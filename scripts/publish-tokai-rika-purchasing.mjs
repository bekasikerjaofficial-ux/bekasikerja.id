#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://id.jobstreet.com/id/job/94786423?tracking=SHR-AND-SharedJob-asia-4';

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim();
    if (!value || value.startsWith('#')) continue;
    const separator = value.indexOf('=');
    if (separator < 1) continue;
    const key = value.slice(0, separator).trim();
    const envValue = value.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = envValue;
  }
}

function normalizeUrl(value) {
  return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

const post = {
  type: 'job',
  title: 'Lowongan Kerja Staff Purchasing PT Tokai Rika Safety Indonesia – Karawang',
  company: 'PT Tokai Rika Safety Indonesia',
  location: 'Karawang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Staff Purchasing PT Tokai Rika Safety Indonesia – Karawang', '',
    'PT Tokai Rika Safety Indonesia membuka lowongan Staff Purchasing untuk penempatan di Karawang, Jawa Barat. Posisi ini merupakan pekerjaan kontrak/temporal dengan kisaran gaji Rp7.000.000–Rp7.500.000 per bulan.', '',
    '## Ringkasan Posisi',
    'Staff Purchasing bertanggung jawab atas pengadaan material dan komponen otomotif untuk mendukung proses produksi perusahaan.', '',
    '## Kualifikasi',
    'Informasi persyaratan tidak dapat diambil langsung dari sumber JobStreet. Silakan periksa sumber resmi untuk detail kualifikasi lengkap.', '',
    '## Tanggung Jawab Utama',
    '- Mengelola proses pengadaan material dan komponen produksi',
    '- Berkomunikasi dengan vendor dan supplier',
    '- Memastikan ketersediaan material sesuai jadwal produksi',
    '- Mendukung efisiensi biaya pembelian', '',
    '## Informasi Lowongan',
    'Perusahaan: PT Tokai Rika Safety Indonesia. Posisi Staff Purchasing dengan penempatan di Karawang, Jawa Barat. Tipe kontrak/temporal dengan kisaran gaji Rp7.000.000–Rp7.500.000 per bulan.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini dari Jobstreet. Periksa detail terbaru pada sumber resmi sebelum melamar dan jangan pernah memberikan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
  ].join('\n'),
};

loadEnvFile();
const supabaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error(JSON.stringify({ ok: false, error: 'Konfigurasi Supabase server belum tersedia.' }));
  process.exit(2);
}

const endpoint = `${supabaseUrl}/rest/v1/posts`;
const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json' };
const existingResponse = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
if (!existingResponse.ok) throw new Error(`Gagal memeriksa posting: HTTP ${existingResponse.status}`);
const existing = await existingResponse.json();
if (existing.length) {
  console.log(JSON.stringify({ ok: true, status: 'already_exists', row_id: existing[0].id, title: post.title }));
  process.exit(0);
}

const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
const body = await response.json().catch(() => null);
if (!response.ok) throw new Error(`Gagal menerbitkan posting: HTTP ${response.status} ${JSON.stringify(body)}`);
const row = body?.[0];
if (!row?.id) throw new Error('Supabase tidak mengembalikan ID posting.');
const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal memverifikasi posting: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
const saved = verified?.[0];
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('Staff Purchasing')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
