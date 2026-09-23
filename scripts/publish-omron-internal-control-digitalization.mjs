#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://forms.cloud.microsoft/r/trpzw0HeQK';

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
  title: 'Lowongan Kerja Internal Control Officer & Digitalization Officer PT Omron Manufacturing Indonesia – Cikarang',
  company: 'PT Omron Manufacturing of Indonesia',
  location: 'Cikarang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Internal Control Officer & Digitalization Officer PT Omron Manufacturing Indonesia – Cikarang', '',
    'PT Omron Manufacturing of Indonesia (OMI) membuka lowongan untuk dua posisi: Internal Control Officer dan Digitalization Officer. Perusahaan ini merupakan bagian dari Omron Corporation Jepang yang memproduksi komponen elektronik dan produk otomasi seperti Relay, Switch, Sensor, dan Timer untuk berbagai industri.', '',
    '## Ringkasan Posisi',
    'PT Omron Manufacturing of Indonesia mencari profesional untuk mengisi posisi Internal Control Officer dan Digitalization Officer di lokasi Cikarang, Jawa Barat.', '',
    '## Kualifikasi',
    'Kualifikasi yang disebutkan pada poster rekrutmen:', '',
    '**Internal Control Officer:**',
    '- Pengetahuan standar dan metodologi auditing untuk melakukan audit',
    '- Pemahaman regulasi dan standar kepatuhan yang relevan',
    '- Minimal D3 Teknik Industri, Manajemen, Akuntansi, Ekonomi, atau jurusan relevan',
    '- Mampu menganalisis data audit dan mengusulkan perbaikan',
    '- Kemampuan analitis berkomunikasi dalam bahasa Inggris', '',
    '**Digitalization Officer:**',
    '- Minimal D3 Sistem Informasi, Teknik Informatika, Ilmu Komputer, IT, atau jurusan relevan',
    '- Pemahaman SQL dan manajemen database yang baik',
    '- Pengalaman pengembangan web front-end dan back-end menggunakan HTML, CSS, JavaScript, PHP, dan Laravel',
    '## Tanggung Jawab Utama',
    'Tugas spesifik tidak tercantum secara rinci pada poster rekrutmen.', '',
    '## Informasi Lowongan',
    'Perusahaan: PT Omron Manufacturing of Indonesia. Penempatan: Cikarang, Jawa Barat. Lamar melalui: https://forms.cloud.microsoft/r/trpzw0HeQK.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini berdasarkan dokumen rekrutmen PT Omron Manufacturing of Indonesia. Periksa kembali detail lamaran pada sumber resmi sebelum mengirimkan dokumen.',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('Internal Control Officer')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
