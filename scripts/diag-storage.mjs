// Diagnostic Storage/RLL Supabase untuk projek BekasiKerja.id.
//
// Jalankan: npm run diag:storage
//
// Mendiagnosis apakah bucket `images` ada, public, dan apakah policy
// RLS write (images_admin_write / posts_admin_write) sudah ter-apply di
// project yang benar. Script ini HANYA membaca .env.local dan hanya
// menulis file probe ke prefix `diag/` lalu menghapusnya.
//
// Dengan service-role + satu user probe sekali pakai, kita bisa
// membedakan tiga kegagalan yang sering tertukar:
//   - bucket tidak ada / tidak public  -> kode utama perlu overhaul
//   - policy belum di-apply            -> jalankan agentic/fix-storage-rls.sql
//   - session tidak punya role admin   -> provisioning auth yang salah
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  fs
    .readFileSync(path.resolve('.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);

// Samakan lib/supabase-url.js: nilai .env bisa membawa suffix /rest/v1.
const url = env.NEXT_PUBLIC_SUPABASE_URL.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svcKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !svcKey) {
  console.error('Env tidak lengkap. Butuh NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

console.log('project:', new URL(url).host, '\n');

const svc = createClient(url, svcKey, { auth: { persistSession: false } });
const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const images = svc.storage.from('images');
const probePaths = [];

// 1. Bucket ada & public?
const { data: buckets, error: bErr } = await svc.storage.listBuckets();
if (bErr) {
  console.log('1. listBuckets FAIL:', bErr.message);
  console.log('   -> cek SUPABASE_SERVICE_ROLE_KEY; tanpa itu diagnosis tidak bisa lanjut.');
  process.exit(1);
}
console.log('1. buckets:', buckets.map((b) => `${b.name}(public=${b.public})`).join(', ') || '(none)');
if (!buckets.some((b) => b.id === 'images')) {
  console.log('   -> bucket "images" TIDAK ADA. Jalankan agentic/supabase-setup.sql.');
}

// 2. Object nyata untuk tes public-read.
const seed = `diag/_seed_${Date.now()}.txt`;
const seedUp = await images.upload(seed, new Blob(['seed']));
console.log('\n2. service-role upload:', seedUp.error ? 'FAIL ' + seedUp.error.message : 'ok');
if (!seedUp.error) probePaths.push(seed);

const seedUrl = anon.storage.from('images').getPublicUrl(seed).data.publicUrl;
const seedGet = await fetch(seedUrl);
console.log('   public URL fetch:', seedGet.status, seedGet.ok ? '(bucket public, URL terbaca)' : '(bucket TIDAK public)');
if (seedGet.ok) await seedGet.text();

// 3. Anon harus DITOLAK (bucket bukan dunia terbuka untuk tulis).
const anonUp = await anon.storage.from('images').upload(`diag/_anon_${Date.now()}.txt`, new Blob(['x']));
console.log('\n3. anon storage INSERT:', anonUp.error ? 'DITOLAK (benar) ' + anonUp.error.message : 'DITERIMA (BAHAYA: policy write terlalu longgar)');
if (!anonUp.error) probePaths.push(anonUp.data.path);

// 4. Sesi admin harus DITERIMA.
const probeEmail = `diag-storage-${Date.now()}@bekasikerja.test`;
const probePassword = 'Diag-' + Math.random().toString(36).slice(2) + '!aA1';
const { data: created, error: cErr } = await svc.auth.admin.createUser({
  email: probeEmail,
  password: probePassword,
  email_confirm: true,
  app_metadata: { role: 'admin' },
});

if (cErr) {
  console.log('\n4. gagal membuat user probe:', cErr.message);
} else {
  try {
    const { error: sErr } = await anon.auth.signInWithPassword({ email: probeEmail, password: probePassword });
    console.log('\n4. session role=admin sign-in:', sErr ? 'FAIL ' + sErr.message : 'ok');
    if (!sErr) {
      const admUp = await anon.storage.from('images').upload(`diag/_adm_${Date.now()}.txt`, new Blob(['x']));
      console.log('   storage INSERT:', admUp.error ? 'DITOLAK <-INI BUGNYA ' + admUp.error.message : 'DITERIMA (ok)');
      if (!admUp.error) probePaths.push(admUp.data.path);

      const ins = await anon.from('posts').insert({ title: '__diag__', type: 'news' }).select();
      console.log('   posts INSERT   :', ins.error ? 'DITOLAK <- Policy posts_admin_write hilang' : 'DITERIMA (ok)');
      if (!ins.error) await svc.from('posts').delete().eq('id', ins.data[0].id);

      const upd = await anon.from('site_settings').update({ brand_name: '__diag__' }).eq('id', 1).select();
      console.log('   settings UPDATE:', upd.error ? 'DITOLAK <- is_admin() suspect' : 'DITERIMA (ok, is_admin bekerja)');
      if (!upd.error) await svc.from('site_settings').update({ brand_name: 'BekasiKerja.id' }).eq('id', 1);
    }
  } finally {
    await svc.auth.admin.deleteUser(created.user.id);
  }
}

if (probePaths.length) await images.remove(probePaths);
console.log('\ncleanup: probe dihapus.');

console.log(
  '\nKESIMPULAN: bila ada baris "DITOLAK <-INI BUGNYA" atau "posts_admin_write hilang",\n' +
    'jalankan SQL: agentic/fix-storage-rls.sql (butuh secret SUPABASE_DB_URL).',
);
