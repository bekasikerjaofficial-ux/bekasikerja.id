#!/usr/bin/env node
// Publish the Ferron Pharma "General Affairs Staff" job post.
// Source: official recruitment poster (tinyurl.com/StaffGA / ferron-pharma.com).
// Idempotent: exits 0 with already_exists if the title is already published.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://tinyurl.com/StaffGA';
const companyUrl = 'https://www.ferron-pharma.com';

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim();
    if (!value || value.startsWith('#')) continue;
    const separator = value.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const envValue = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = envValue;
  }
}

function normalizeUrl(value) {
  return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

const post = {
  type: 'job',
  title: 'Lowongan Kerja General Affairs Staff Ferron Pharma – Cikarang, Bekasi',
  company: 'Ferron Pharma',
  location: 'Cikarang, Bekasi, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja General Affairs Staff Ferron Pharma – Cikarang, Bekasi',
    '',
    'Ferron Pharma membuka lowongan General Affairs Staff untuk penempatan di Cikarang, Bekasi. Posisi ini bertugas menjaga operasional kantor, aset dan fasilitas, sistem keamanan, serta layanan umum dan housekeeping agar berjalan optimal.',
    '',
    '## Deskripsi Pekerjaan',
    '- Monitoring pengelolaan operasional kantor, perangkat, fasilitas kantor, asuransi, contingency, serta pengelolaan limit non-BJ',
    '- Melakukan monitoring dan pemeliharaan aset serta fasilitas GA, termasuk access control, fire alarm, CCTV, dan sistem pendukung lainnya',
    '- Mengordinasikan kegiatan pemeliharaan dan memastikan peralatan serta fasilitas kantor berfungsi dengan baik',
    '- Monitoring dan membantu terhadap pelayanan General Service dan Housekeeping supaya berjalan dengan optimal dan efisien',
    '- Membantu General Service dan House Keeping Supervisor dalam tata laksana pelayanan GA',
    '- Menyusun laporan kegiatan dan evaluasi GA secara akurat dan tepat waktu',
    '',
    '## Kualifikasi',
    '- Minimal ijazah D3 dari semua jurusan',
    '- Memiliki pengalaman dalam bidang pengelolaan CCTV dan akses kontrol',
    '- Terbuka untuk fresh graduate, pengalaman minimal 1 tahun sebagai GA di industri manufaktur, khususnya farmasi, menjadi nilai plus',
    '- Jujur, teliti, terorganisir, sistematis, dan memiliki rasa tanggung jawab yang tinggi',
    '- Penempatan di Cikarang (Bekasi)',
    '',
    '## Informasi Lowongan',
    'Perusahaan: Ferron Pharma. Posisi General Affairs Staff dengan penempatan di Cikarang, Bekasi. Kirimkan lamaran melalui tautan berikut: ' + sourceUrl + '. Informasi perusahaan tersedia di ' + companyUrl + '.',
    '',
    'Sumber lowongan: poster rekrutmen resmi Ferron Pharma (' + companyUrl + ').',
    'BekasiKerja.id menulis ulang informasi ini berdasarkan poster rekrutmen resmi Ferron Pharma. Periksa kembali detail lamaran pada sumber resmi sebelum mengirimkan dokumen.',
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
const headers = { apikey: serviceRoleKey, Authorization: 'Bearer ' + serviceRoleKey, 'Content-Type': 'application/json' };

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
if (
  verified.length !== 1 ||
  saved.title !== post.title ||
  saved.type !== 'job' ||
  saved.company !== post.company ||
  saved.location !== post.location ||
  !String(saved.content).includes(sourceUrl) ||
  !String(saved.content).includes('- Menyusun laporan kegiatan dan evaluasi GA secara akurat dan tepat waktu')
) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));