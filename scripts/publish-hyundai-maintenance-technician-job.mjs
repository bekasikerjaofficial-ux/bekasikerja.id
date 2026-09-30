#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://nyarigawe.jabarprov.go.id';

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
  title: 'Lowongan Kerja Maintenance Technician Hyundai Motor Manufacturing Indonesia – Cikarang',
  company: 'Hyundai Motor Manufacturing Indonesia',
  location: 'Cikarang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Maintenance Technician Hyundai Motor Manufacturing Indonesia – Cikarang', '',
    'Hyundai Motor Manufacturing Indonesia membuka lowongan Maintenance Technician dengan penempatan di Cikarang. Posisi ini fokus pada perawatan mesin dan penanganan gangguan teknis di lini produksi, mulai dari pemeriksaan berkala hingga perbaikan mesin secara listrik maupun mekanis.', '',
    '## Ringkasan Posisi',
    'Maintenance Technician menjaga kondisi mesin tetap optimal melalui pemeriksaan dan perbaikan. Pekerjaan melibatkan penanganan mesin secara listrik dan mekanis, penggunaan repair tools, serta pelaporan setiap gangguan yang ditemukan.', '',
    '## Kualifikasi',
    '- Pendidikan menengah yang relevan',
    '- Memiliki pengalaman minimal 1 tahun di bidang perbaikan mesin',
    '- Mampu melakukan maintenance mesin secara listrik dan mekanis',
    '- Familiar dengan penggunaan repair tools',
    '- Bersedia bekerja dengan gangguan pendengaran', '',
    '## Tanggung Jawab Utama',
    '- Melakukan perawatan mesin secara listrik dan mekanis',
    '- Menjalankan mesin dan melakukan maintenance secara berkala untuk mencegah kerusakan yang sering terjadi',
    '- Menangani perbaikan mesin yang bermasalah sesuai kebutuhan',
    '- Melaporkan setiap gangguan yang ditemukan', '',
    '## Informasi Lowongan',
    'Perusahaan: Hyundai Motor Manufacturing Indonesia. Posisi Maintenance Technician dengan penempatan di Cikarang, Jawa Barat. Periode pendaftaran: 28 September sampai 24 Oktober 2026.', '',
    'Cara melamar: buka aplikasi Nyari Gawe, masuk ke menu Cari Lowongan, lalu cari Hyundai Motor Manufacturing Indonesia. Proses seleksi berjalan mulai dari penyaringan CV, tes akademik dan psikotest, wawancara, hingga medical check up. Berdasarkan informasi rekrutmen, proses ini tidak dipungut biaya.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini berdasarkan unggahan rekrutmen Hyundai Motor Manufacturing Indonesia. Periksa kembali detail lamaran pada sumber resmi sebelum mengirimkan dokumen.',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl)) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
