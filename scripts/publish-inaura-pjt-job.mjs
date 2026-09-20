#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

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
  title: 'Lowongan Kerja Penanggung Jawab Teknis (PJT) InAura – Bekasi & Cikarang',
  company: 'InAura',
  location: 'Summarecon Bekasi dan Jababeka 1, Bekasi/Cikarang',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Penanggung Jawab Teknis (PJT) InAura – Bekasi & Cikarang', '',
    'InAura membuka lowongan Penanggung Jawab Teknis (PJT) untuk mendukung operasional B2B Luxe Balayage CHOCOLUXE di area Summarecon Bekasi dan Jababeka 1. Kandidat perlu siap bekerja penuh waktu serta mobile antara Bekasi dan Cikarang.', '',
    '## Ringkasan Posisi',
    'Posisi PJT bertanggung jawab memastikan kegiatan distribusi kosmetik berjalan sesuai regulasi, SOP, dokumentasi, serta standar penelusuran produk.', '',
    '## Kualifikasi',
    '- Pendidikan minimal D3 Farmasi.',
    '- Memiliki STR aktif untuk tenaga vokasi kefarmasian.',
    '- Memahami regulasi distribusi kosmetik.',
    '- Memahami SOP, dokumentasi, dan penelusuran produk.',
    '- Memahami proses penyimpanan, retur, penanganan keluhan, penarikan kembali produk, serta CAPA.',
    '- Pengalaman relevan dan kemampuan administrasi menjadi nilai tambah.',
    '- Bersedia bekerja full time dan mobile antara Bekasi dan Cikarang.', '',
    '## Tanggung Jawab Utama',
    '- Memastikan proses distribusi dan penyimpanan produk mengikuti ketentuan yang berlaku.',
    '- Menjaga kelengkapan dokumentasi dan traceability produk.',
    '- Mendukung penanganan retur, keluhan, recall, serta tindakan perbaikan dan pencegahan (CAPA).',
    '- Memastikan penerapan SOP dalam kegiatan operasional terkait.', '',
    '## Informasi Lowongan',
    'Lokasi penempatan berada di Summarecon Bekasi dan Jababeka 1. Posisi tersedia full time dengan kebutuhan mobilitas antara Bekasi dan Cikarang.', '',
    'Cara melamar: kirim CV terbaru ke career@inaura.co.id dengan subjek email “PJT_Domisili”.',
    'BekasiKerja.id menulis ulang informasi ini dari poster rekrutmen InAura. Periksa kembali detail lowongan sebelum melamar dan jangan memberikan data sensitif kepada pihak yang tidak terverifikasi.',
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
const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
};

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

const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal memverifikasi posting: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
const saved = verified?.[0];
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || !String(saved.content).includes('PJT_Domisili') || !String(saved.content).includes('- Pendidikan minimal D3 Farmasi.')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location }));
