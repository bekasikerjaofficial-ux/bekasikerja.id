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
  type: 'news',
  title: 'Hyundai Motor Manufacturing Indonesia Rekrut Maintenance Technician, Kualifikasi SMK Minimal 1 Tahun Pengalaman',
  company: 'Hyundai Motor Manufacturing Indonesia',
  location: 'Cikarang, Jawa Barat',
  category: 'Berita',
  deadline: null,
  image_url: null,
  content: [
    '# Hyundai Motor Manufacturing Indonesia Rekrut Maintenance Technician, Kualifikasi SMK Minimal 1 Tahun Pengalaman', '',
    'Hyundai Motor Manufacturing Indonesia membuka pendaftaran Maintenance Technician untuk penempatan di Cikarang, Jawa Barat. Pendaftaran berlangsung sejak 28 September hingga 24 Oktober 2026. Kandidat yang dilantisakan adalah lulusan SMK atau sekolah vokasional dengan pengalaman sekurang-kurangnya satu tahun di bidang maintenance mekanikal atau kelistrikan.', '',
    '## Posisi yang Dibuka',
    'Posisi yang dibuka adalah Maintenance Technician dengan penempatan di Cikarang, salah satu kawasan industri terbesar di Jawa Barat.', '',
    '## Syarat Utama',
    '- Lulusan SMK atau sekolah vokasional yang relevan',
    '- Memiliki pengalaman minimal 1 tahun di bidang maintenance mekanikal atau kelistrikan',
    '- Mampu melakukan maintenance mesin secara listrik dan mekanis',
    '- Familiar dengan penggunaan repair tools',
    '- Bersedia bekerja dengan gangguan pendengaran', '',
    '## Job Desk dan Tanggung Jawab',
    '- Melakukan perawatan mesin secara listrik dan mekanis',
    '- Menjalankan mesin dan melakukan maintenance secara berkala untuk mencegah kerusakan yang sering terjadi',
    '- Menangani perbaikan mesin yang bermasalah sesuai kebutuhan',
    '- Melaporkan setiap gangguan yang ditemukan', '',
    '## Tahapan Seleksi',
    'Proses seleksi berjalan bertahap dari penyaringan berkas lamaran, tes akademik dan psikotest, wawancara, medical check up, hingga orientasi dan awal kerja.', '',
    '## Cara Mendaftar',
    'Pendaftaran dibuka melalui aplikasi Nyari Gawe. Masuk ke menu Cari Lowongan, kemudian cari Hyundai Motor Manufacturing Indonesia dan pilih posisi Maintenance Technician. Periode pendaftaran berlaku dari 28 September sampai 24 Oktober 2026.', '',
    '## Catatan Penting',
    'Hyundai Motor Manufacturing Indonesia menyatakan proses rekrutmen ini tidak dipungut biaya.', '',
    '## Peluang Karier',
    'Posisi Maintenance Technician terbuka bagi kandidat yang relevan dan dapat bekerja pada sistem shift di kawasan industri Cikarang.', '',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'news' || saved.category !== 'Berita' || saved.company !== post.company || saved.location !== post.location) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, category: saved.category, company: saved.company, location: saved.location }));
