#!/usr/bin/env node

// Publishes PT Sugity Creatives recruitment news articles, one per run.
// SELECT selects which article to publish (1, 2, 3). Default 1.
// Idempotent: skips any article already present by title.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const SELECT = String(process.env.SELECT || '1').trim();
const sourceUrl = 'https://www.disnakerja.com/lowongan-kerja-pt-sugity-creatives/';
const posterUrl = 'https://bit.ly/4dka9PL';

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

const articles = [
  {
    title: 'PT Sugity Creatives Rekrut Fresh Graduate Accounting, GPA Minimal 3,00 dan Maksimal Usia 25 Tahun',
    position: 'Fresh Graduate Accounting',
    content: [
      '# PT Sugity Creatives Rekrut Fresh Graduate Accounting, GPA Minimal 3,00 dan Maksimal Usia 25 Tahun', '',
      'PT Sugity Creatives, anak perusahaan Toyota Auto Body Jepang yang bergerak di bidang produksi cetakan plastik untuk komponen otomotif, membuka lowongan Fresh Graduate Accounting. Lowongan dibuka untuk lulusan jenjang associate dan bachelor degree maksimal berusia 25 tahun dengan ipk minimal 3,00. Lokasi kerja berada di Cikarang, Jawa Barat.', '',
      '## Ringkasan Posisi',
      '- Posisi: Fresh Graduate Accounting',
      '- Pendidikan: Accounting, jenjang Associate dan Bachelor degree',
      '- Lokasi: Cikarang, Jawa Barat',
      '- Pengalaman: Fresh Graduate',
      '- Batas usia: maksimal 25 tahun', '',
      '## Kualifikasi',
      '- Male / Female. Max. 25 years old.',
      '- Fresh graduate with GPA minimum 3.00.',
      '- Fluent in English (written & verbal). Japanese would be an advantage.',
      '- Willing to learn & positive attitude.',
      '- Good communication & networking skills.',
      '- Familiar with financial systems such as Accurate, or similar accounting software.',
      '- Proficient in Microsoft Excel & Words.',
      '- Understanding of basic accounting and taxation principles (have Brevet A & B certificate will be additional value).', '',
      '## Informasi Lowongan',
      '- Deadline: 6 Oktober 2026',
      '- Proses seleksi: Applicant Screening, Invitation, HC & User Test, Psychological Test, MCU, User & BOD Interview, Offering',
      '- Lamaran dilakukan secara online melalui formulir resmi yang menyediakan tautan dan QR code pada unggahan rekrutmen.',
      '- Proses rekrutmen tidak dipungut biaya.', '',
      '## Tentang Perusahaan',
      'PT Sugity Creatives merupakan anak perusahaan dari Toyota Auto Body Jepang yang bergerak di bidang produksi cetakan plastik untuk komponen otomotif. Perusahaan ini pertama kali berdiri pada 21 April 1995 di Cikarang.', '',
      'Model bisnis perusahaan bertumpu pada tiga pilar, yaitu Konversi Kendaraan, Suku Cadang, dan Cetakan (Mold).', '',
      `Sumber: ${sourceUrl}`,
      `Tautan rekrutmen pada unggahan: ${posterUrl}`,
    ].join('\n'),
  },
  {
    title: 'PT Sugity Creatives Rekrut Fresh Graduate Material Engineering, Maksimal Usia 25 Tahun',
    position: 'Fresh Graduate Material Engineering',
    content: [
      '# PT Sugity Creatives Rekrut Fresh Graduate Material Engineering, Maksimal Usia 25 Tahun', '',
      'PT Sugity Creatives membuka lowongan Fresh Graduate Material Engineering untuk lulusan Teknik Material. Kandidat diminta memiliki ijazah jenjang associate atau bachelor degree dengan ipk minimal 3,00 serta batas usia maksimal 25 tahun. Lokasi kerja berada di Cikarang, Jawa Barat.', '',
      '## Ringkasan Posisi',
      '- Posisi: Fresh Graduate Material Engineering',
      '- Pendidikan: Material Engineering, jenjang Associate dan Bachelor degree',
      '- Lokasi: Cikarang, Jawa Barat',
      '- Pengalaman: Fresh Graduate',
      '- Batas usia: maksimal 25 tahun', '',
      '## Kualifikasi',
      '- Male / Female. Max. 25 years old.',
      '- Fresh graduate with GPA minimum 3.00.',
      '- Fluent in English (written & verbal). Japanese would be an advantage.',
      '- Willing to learn & positive attitude.',
      '- Good communication & networking skills.', '',
      '## Informasi Lowongan',
      '- Deadline: 6 Oktober 2026',
      '- Proses seleksi: Applicant Screening, Invitation, HC & User Test, Psychological Test, MCU, User & BOD Interview, Offering',
      '- Lamaran dilakukan secara online melalui formulir resmi yang menyediakan tautan dan QR code pada unggahan rekrutmen.',
      '- Proses rekrutmen tidak dipungut biaya.', '',
      '## Tentang Perusahaan',
      'PT Sugity Creatives merupakan anak perusahaan dari Toyota Auto Body Jepang yang bergerak di bidang produksi cetakan plastik untuk komponen otomotif. Perusahaan ini pertama kali berdiri pada 21 April 1995 di Cikarang.', '',
      'Model bisnis perusahaan bertumpu pada tiga pilar, yaitu Konversi Kendaraan, Suku Cadang, dan Cetakan (Mold).', '',
      `Sumber: ${sourceUrl}`,
      `Tautan rekrutmen pada unggahan: ${posterUrl}`,
    ].join('\n'),
  },
  {
    title: 'PT Sugity Creatives Rekrut Experienced Design Engineer, Batas Usia 29 Tahun dan Wajib Berpengalaman',
    position: 'Experienced Design Engineering',
    content: [
      '# PT Sugity Creatives Rekrut Experienced Design Engineer, Batas Usia 29 Tahun dan Wajib Berpengalaman', '',
      'PT Sugity Creatives membuka lowongan Experienced Design Engineering untuk kandidat yang sudah memiliki pengalaman profesional di bidang Teknik Desain. Batas usia maksimal 29 tahun dengan ipk minimal 3,00. Lokasi kerja berada di Cikarang, Jawa Barat.', '',
      '## Ringkasan Posisi',
      '- Posisi: Experienced Design Engineering',
      '- Pendidikan: Design Engineering, jenjang Associate dan Bachelor degree',
      '- Lokasi: Cikarang, Jawa Barat',
      '- Pengalaman: Experienced, wajib memiliki pengalaman profesional',
      '- Batas usia: maksimal 29 tahun', '',
      '## Kualifikasi',
      '- Male / Female. 29 years old.',
      '- Professional experiences with GPA minimum 3.00.',
      '- Fluent in English (written & verbal). Japanese would be an advantage.',
      '- Willing to learn & positive attitude.',
      '- Good communication & networking skills.', '',
      '## Informasi Lowongan',
      '- Deadline: 6 Oktober 2026',
      '- Proses seleksi: Applicant Screening, Invitation, HC & User Test, Psychological Test, MCU, User & BOD Interview, Offering',
      '- Lamaran dilakukan secara online melalui formulir resmi yang menyediakan tautan dan QR code pada unggahan rekrutmen.',
      '- Proses rekrutmen tidak dipungut biaya.', '',
      '## Tentang Perusahaan',
      'PT Sugity Creatives merupakan anak perusahaan dari Toyota Auto Body Jepang yang bergerak di bidang produksi cetakan plastik untuk komponen otomotif. Perusahaan ini pertama kali berdiri pada 21 April 1995 di Cikarang.', '',
      'Model bisnis perusahaan bertumpu pada tiga pilar, yaitu Konversi Kendaraan, Suku Cadang, dan Cetakan (Mold).', '',
      `Sumber: ${sourceUrl}`,
      `Tautan rekrutmen pada unggahan: ${posterUrl}`,
    ].join('\n'),
  },
];

const index = Number(SELECT) - 1;
if (!Number.isInteger(index) || index < 0 || index >= articles.length) {
  console.error(JSON.stringify({ ok: false, error: `SELECT harus antara 1 dan ${articles.length}, diterima: ${SELECT}` }));
  process.exit(2);
}

const article = articles[index];
const post = {
  type: 'news',
  title: article.title,
  company: 'PT Sugity Creatives',
  location: 'Cikarang, Jawa Barat',
  category: 'Berita',
  deadline: '2026-10-06',
  image_url: null,
  content: article.content,
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

const verifyResponse = await fetch(`${endpoint}?select=id,title,type,category,company,location,deadline,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal memverifikasi posting: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
const saved = verified?.[0];
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'news' || saved.category !== 'Berita' || saved.company !== post.company) {
  throw new Error('Verifikasi read-back posting gagal.');
}
const required = ['Applicant Screening', 'Psychological Test', 'MCU', 'User & BOD Interview', 'tidak dipungut biaya', '6 Oktober 2026'];
const missing = required.filter((phrase) => !saved.content.includes(phrase));
if (missing.length) throw new Error(`Isi posting tidak lengkap: ${missing.join(', ')}`);
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, position: article.position, title: saved.title }));