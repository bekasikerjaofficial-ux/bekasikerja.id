#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://www.linkedin.com/jobs/view/4466191224/';

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
  title: 'Lowongan Kerja Human Capital Freelance Hijrahfood – Bekasi',
  company: 'Hijrahfood (PT. Hijrah Gizi Hewani)',
  location: 'Cimuning, Bekasi, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Human Capital Freelance Hijrahfood – Bekasi', '',
    'Hijrahfood atau PT. Hijrah Gizi Hewani membuka kesempatan bagi fresh graduate untuk bergabung sebagai Human Capital Freelance. Posisi ini berfokus pada administrasi dan pengarsipan dokumen dengan penempatan di Cimuning, Bekasi.', '',
    '## Ringkasan Posisi',
    'Human Capital Freelance akan mendukung pekerjaan administrasi, pengelolaan arsip, dan kerahasiaan data perusahaan sesuai kebutuhan operasional.', '',
    '## Kualifikasi',
    '- Minimal lulusan baru atau fresh graduate S1 dari semua jurusan.',
    '- Teliti, rapi, dan terorganisir dalam mengarsipkan dokumen.',
    '- Mampu mengoperasikan Microsoft Office dasar.',
    '- Pengalaman administrasi menjadi nilai tambah.',
    '- Bertanggung jawab dan mampu menjaga kerahasiaan data sensitif perusahaan.',
    '- Bersedia bekerja freelance sesuai kebutuhan.', '',
    '## Tanggung Jawab Utama',
    '- Mendukung pengelolaan dan pengarsipan dokumen Human Capital.',
    '- Membantu pekerjaan administrasi sesuai kebutuhan perusahaan.',
    '- Menjaga kerapian, ketelitian, dan kerahasiaan dokumen yang ditangani.', '',
    '## Informasi Lowongan',
    'Perusahaan: Hijrahfood (PT. Hijrah Gizi Hewani). Posisi ini bersifat freelance/kontrak dengan penempatan di Cimuning, Bekasi, Jawa Barat. Hijrahfood bergerak dalam distribusi daging dan peternakan untuk pelanggan institusional, termasuk hotel, restoran, katering, dan pabrik.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini dari LinkedIn. Periksa detail terbaru pada sumber resmi sebelum melamar dan jangan pernah memberikan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('- Minimal lulusan baru atau fresh graduate S1 dari semua jurusan.')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
