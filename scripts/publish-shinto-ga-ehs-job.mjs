#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://lnkd.in/p/gHH2MXcS';

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
  title: 'Lowongan Kerja Staff GA-EHS Shinto Kogyo Indonesia – Cikarang/Karawang',
  company: 'PT Shinto Kogyo Indonesia',
  location: 'Cikarang/Karawang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Staff GA-EHS Shinto Kogyo Indonesia – Cikarang/Karawang', '',
    'PT Shinto Kogyo Indonesia membuka lowongan Staff GA-EHS untuk penempatan di Cikarang atau Karawang. Posisi ini menangani General Affairs, keselamatan dan kesehatan kerja, pengelolaan lingkungan, aset, perizinan, serta koordinasi vendor.', '',
    '## Ringkasan Posisi',
    'Staff GA-EHS mendukung kelancaran operasional perusahaan melalui pengelolaan fasilitas dan aset, pelaksanaan program K3 serta lingkungan, dan penerapan sistem manajemen K3 dan lingkungan.', '',
    '## Kualifikasi',
    '- Memiliki kemampuan komunikasi dan koordinasi yang baik',
    '- Pengalaman minimal 3 tahun di bidang GA dan EHS pada industri manufaktur otomotif',
    '- Memiliki keterampilan komputer (Microsoft Package)',
    '- Pendidikan minimal S1 jurusan Manajemen, Teknik Lingkungan, Ilmu Kesehatan Masyarakat, Kesehatan & Keselamatan Kerja (K3)',
    '- Problem solving dan proaktif terhadap isu operasional',
    '- Memiliki pengalaman mengelola Audit ISO 9001 dan 14001',
    '- Memiliki sertifikat Ahli K3 Umum',
    '- Terbiasa mengelola perawatan gedung dan fasilitasnya, mengerjakan administrasi aset dan perizinan perusahaan, serta berkoordinasi dengan vendor',
    '- Memiliki pengetahuan dasar tentang UU No. 1 tahun 1970', '',
    '## Tanggung Jawab Utama',
    '- Menangani administrasi, perizinan, serta pelaporan terkait kegiatan GA dan EHS',
    '- Mengelola fasilitas dan aset perusahaan untuk mendukung kelancaran operasional',
    '- Mendukung implementasi sistem manajemen K3 dan lingkungan di perusahaan',
    '- Mengoordinasikan kebutuhan General Affairs seperti keamanan, kebersihan, transportasi, dan pengelolaan vendor',
    '- Melakukan inspeksi area kerja, identifikasi potensi bahaya, dan monitoring kepatuhan penggunaan APD',
    '- Melaksanakan program K3 dan pengelolaan lingkungan sesuai peraturan yang berlaku', '',
    '## Informasi Lowongan',
    'Perusahaan: PT Shinto Kogyo Indonesia. Posisi Staff GA-EHS dengan penempatan di Cikarang atau Karawang. Kirimkan CV dan lamaran melalui bit.ly/GAEHSStaff. Informasi pada poster menyebutkan bahwa proses rekrutmen tidak dipungut biaya.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini berdasarkan unggahan rekrutmen dan poster PT Shinto Kogyo Indonesia. Periksa kembali detail lamaran pada sumber resmi sebelum mengirimkan dokumen.',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('- Melakukan inspeksi area kerja, identifikasi potensi bahaya, dan monitoring kepatuhan penggunaan APD')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
