#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://id.jobstreet.com/id/job/94638069?tracking=SHR-AND-SharedJob-asia-4';
const post = {
  type: 'job',
  title: 'Lowongan Kerja PT GLOVIS INDONESIA – Head of HR & General Affair Dept',
  company: 'PT GLOVIS INDONESIA INTERNATIONAL',
  location: 'Cikarang Pusat, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja PT GLOVIS INDONESIA – Head of HR & General Affair Dept', '',
    'PT GLOVIS INDONESIA INTERNATIONAL membuka peluang bagi pemimpin berpengalaman untuk mengelola fungsi Human Resources, General Affair, dan dukungan legal ketenagakerjaan di lingkungan logistik otomotif. Posisi full time ini berbasis di Cikarang Pusat, Jawa Barat.', '',
    '## Sekilas tentang Posisi',
    'Peran ini bertanggung jawab memastikan pengelolaan SDM, fasilitas, aset, hubungan industrial, dan pelaporan operasional berjalan terkoordinasi. Kandidat akan bekerja dekat dengan manajemen untuk menjaga kepatuhan, efisiensi, dan kesiapan operasional perusahaan.', '',
    '## Tanggung Jawab Utama',
    '- Menyusun dan menjalankan strategi HR yang mencakup rekrutmen, pengembangan talenta, keterlibatan karyawan, serta rencana suksesi.',
    '- Mengawasi hubungan industrial, kepatuhan terhadap aturan ketenagakerjaan, dan koordinasi dengan instansi pemerintah seperti Disnaker.',
    '- Mengelola proses payroll, benefit, audit HR, pengembangan karyawan, dan sistem manajemen kinerja.',
    '- Memimpin pengelolaan fasilitas kantor, yard, gudang, armada, serta aset operasional perusahaan.',
    '- Memastikan kontrol, perawatan, dan pemanfaatan kendaraan maupun peralatan berjalan efektif.',
    '- Menangani persoalan hubungan industrial, penyelesaian sengketa, perjanjian kerja bersama, dan audit regulasi.',
    '- Memberikan dukungan legal untuk urusan hubungan karyawan serta berkoordinasi dengan penasihat hukum eksternal bila diperlukan.',
    '- Menyusun laporan eksekutif dan laporan operasional yang terstruktur, lengkap, serta mudah diaudit.',
    '- Memantau perubahan regulasi yang berdampak pada industri otomotif, logistik, dan kepatuhan ketenagakerjaan.', '',
    '## Kualifikasi',
    '- Memiliki pengalaman minimal 12 tahun di bidang HR, General Affair, dan/atau fungsi legal ketenagakerjaan.',
    '- Pengalaman di industri otomotif, manufaktur komponen, atau operasional logistik menjadi nilai tambah.',
    '- Memahami hubungan industrial, hukum ketenagakerjaan, dan penerapan kepatuhan perusahaan.',
    '- Terbukti mampu memimpin fungsi HR secara menyeluruh serta mengelola fasilitas dan aset perusahaan.',
    '- Menguasai Microsoft Excel untuk analisis dan pelaporan.',
    '- Mampu berkomunikasi dengan baik dalam bahasa Inggris dan bahasa Indonesia.',
    '- Dapat menyusun laporan yang rapi, sistematis, mendalam, dan siap digunakan untuk kebutuhan audit.', '',
    '## Informasi Perusahaan',
    'PT GLOVIS INDONESIA INTERNATIONAL merupakan bagian dari Hyundai Glovis dan bergerak dalam layanan logistik produksi otomotif. Posisi ini berstatus full time dan berlokasi di Cikarang Pusat, Jawa Barat.', '',
    `Cara melamar: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini untuk membantu pencari kerja. Periksa kembali persyaratan dan proses lamaran pada sumber resmi sebelum mengirimkan data pribadi.',
  ].join('\\n'),
};

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim(); const i = value.indexOf('=');
    if (i < 1 || value.startsWith('#')) continue;
    const key = value.slice(0, i).trim(); const envValue = value.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = envValue;
  }
}
loadEnvFile();
const base = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) throw new Error('Konfigurasi Supabase server belum tersedia.');
const endpoint = `${base}/rest/v1/posts`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const existingResponse = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
const existing = await existingResponse.json();
if (existing.length) {
  console.log(JSON.stringify({ ok: true, status: 'already_exists', row_id: existing[0].id, title: post.title }));
  process.exit(0);
}
const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
const body = await response.json();
if (!response.ok) throw new Error(`Publish gagal HTTP ${response.status}: ${JSON.stringify(body)}`);
const row = body[0];
const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${row.id}`, { headers });
const verified = await verifyResponse.json();
console.log(JSON.stringify({ ok: true, status: 'published', row_id: row.id, title: row.title, type: row.type, verified_count: verified.length, has_source: verified[0]?.content.includes(sourceUrl), has_bullets: verified[0]?.content.includes('- Menyusun') }));
