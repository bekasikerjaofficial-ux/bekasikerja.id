#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://ekon.go.id/publikasi/detail/7120/pemerintah-siapkan-sejumlah-program-ekonomi-untuk-perkuat-perlidungan-masyarakat-dan-dorong-pertumbuhan-di-2027';

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizeUrl(value) {
  return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

const post = {
  type: 'news',
  title: 'Kabar Gembira, Pemerintah Akan Bagikan Uang 900rb kepada Pekerja',
  company: 'Kementerian Koordinator Bidang Perekonomian RI',
  location: 'Jakarta',
  category: 'Berita',
  deadline: null,
  image_url: null,
  content: [
    '# Kabar Gembira, Pemerintah Akan Bagikan Uang 900rb kepada Pekerja', '',
    'Pemerintah akan kembali memberikan Bantuan Subsidi Upah (BSU) dengan besaran Rp300 ribu per bulan untuk periode tiga bulan. Dengan hitungan tersebut, setiap pekerja penerima memperoleh total bantuan Rp900 ribu. Program ini ditujukan kepada sekitar 13,3 juta pekerja dengan kebutuhan anggaran yang diperkirakan hampir Rp12 triliun.', '',
    '## Bantuan Subsidi Upah Kembali Diberikan',
    'Selain bantuan pangan, Pemerintah akan kembali memberikan Bantuan Subsidi Upah (BSU) yang diberikan satu kali untuk periode tiga bulan dengan besaran Rp300 ribu per bulan. Program tersebut ditujukan kepada sekitar 13,3 juta pekerja dengan kebutuhan anggaran yang diperkirakan hampir Rp12 triliun.', '',
    '## Program 2027 yang Dilanjutkan',
    'Memasuki 2027, sejumlah program yang telah dilaksanakan pada tahun ini akan dilanjutkan.', '',
    '- Program magang melalui Kementerian Ketenagakerjaan akan dilanjutkan dengan sasaran 150 ribu peserta',
    '- Program vokasi akan dilanjutkan untuk 300 ribu orang',
    '- Kebijakan pengurangan PPh Pasal 21 bagi pekerja dengan penghasilan di bawah Rp10 juta dilanjutkan dengan sasaran sekitar 7,5 juta pekerja', '',
    '## Dari Padat Karya dan Pariwisata ke Seluruh Sektor',
    'Kebijakan yang selama ini diberikan kepada sektor padat karya dan pariwisata akan diperluas pada 2027.', '',
    'Dan ini kalau yang sekarang diberikan kepada padat karya dan pariwisata. Yang tahun depan diberikan ke seluruh sektor yang gajinya di bawah 10 juta.', '',
    'Menko Airlangga Hartarto menyampaikan hal tersebut dalam Keterangan Pers usai rapat di Istana Negara, pada Rabu (30/09/2026).', '',
    '## Catatan',
    'Kebutuhan anggaran untuk berbagai program yang akan dilanjutkan pada 2027 masih dalam proses penyisiran oleh Menteri Keuangan. Berdasarkan perhitungan sementara, kebutuhan anggaran untuk keseluruhan program tersebut diperkirakan sekitar Rp31 triliun.', '',
    `Sumber: ${sourceUrl}`,
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

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { ...headers, Prefer: 'return=representation' },
  body: JSON.stringify(post),
});
const body = await response.json().catch(() => null);
if (!response.ok) throw new Error(`Gagal menerbitkan posting: HTTP ${response.status} ${JSON.stringify(body)}`);
const row = body?.[0];
if (!row?.id) throw new Error('Supabase tidak mengembalikan ID posting.');

const verifyResponse = await fetch(`${endpoint}?select=id,title,type,category,company,location,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal memverifikasi posting: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
const saved = verified?.[0];
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'news' || saved.category !== 'Berita') {
  throw new Error('Verifikasi read-back posting gagal.');
}
const requiredPhrases = ['Rp300 ribu per bulan', '13,3 juta pekerja', 'Rp12 triliun', '150 ribu peserta', '300 ribu orang', '7,5 juta pekerja', 'Rp10 juta'];
const missing = requiredPhrases.filter((phrase) => !saved.content.includes(phrase));
if (missing.length) throw new Error(`Isi posting tidak lengkap: ${missing.join(', ')}`);
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, category: saved.category }));
