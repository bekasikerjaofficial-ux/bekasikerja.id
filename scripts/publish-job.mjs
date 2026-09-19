#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://id.jobstreet.com/id/job/94639399?tracking=SHR-AND-SharedJob-asia-4';

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
  title: 'Industrial Relations Associate Specialist – Karawang',
  company: 'PT CONTEMPORARY AMPEREX TECHNOLOGY INDONESIA BATTERY',
  location: 'Karawang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Industrial Relations Associate Specialist – Karawang', '',
    'PT CONTEMPORARY AMPEREX TECHNOLOGY INDONESIA BATTERY membuka peluang bagi profesional yang berpengalaman menangani hubungan industrial di lingkungan manufaktur. Posisi ini berfokus pada kepatuhan ketenagakerjaan, penyelesaian perselisihan, dan koordinasi dengan pihak eksternal.', '',
    '## Ringkasan Pekerjaan',
    '- Memastikan kebijakan perusahaan, kontrak kerja, SOP, dan praktik operasional selaras dengan peraturan ketenagakerjaan Indonesia.',
    '- Menangani keluhan pekerja serta memediasi perselisihan individu maupun kelompok secara objektif.',
    '- Berkoordinasi dengan Disnaker dan lembaga terkait untuk pelaporan serta penanganan perkara hubungan industrial.',
    '- Menyiapkan langkah pencegahan dan mitigasi ketika muncul potensi aksi industrial atau gangguan operasional.', '',
    '## Kualifikasi yang Dicari',
    '- Pendidikan minimal S1 Hukum, Hubungan Industrial, Manajemen SDM, atau Psikologi.',
    '- Memahami regulasi ketenagakerjaan, termasuk penyelesaian perselisihan hubungan industrial dan aturan turunannya.',
    '- Memiliki pengalaman sekitar 3–5 tahun dalam negosiasi bipartit/tripartit, pemeriksaan pelanggaran disiplin, surat peringatan, dan proses pemutusan hubungan kerja.',
    '- Berpengalaman menyusun Peraturan Perusahaan, PKB, perjanjian bersama, serta dokumen pelaporan kepada Disnaker.',
    '- Mampu membangun hubungan profesional dengan Disnaker, mediator, BPJS, dan perwakilan serikat pekerja.',
    '- Memiliki kemampuan mediasi dan negosiasi yang tegas, tenang, serta persuasif.',
    '- Kemampuan bahasa Inggris diperlukan; bahasa Mandarin menjadi nilai tambah.', '',
    '## Informasi Lamaran',
    'Posisi ini berstatus full time dan berlokasi di Karawang, Jawa Barat. Detail proses lamaran, pertanyaan perusahaan, dan persyaratan terbaru dapat berubah mengikuti halaman sumber.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'Catatan: BekasiKerja.id menulis ulang informasi ini untuk memudahkan pencari kerja. Periksa halaman sumber sebelum melamar dan jangan pernah memberikan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
  ].join('\\n'),
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
console.log(JSON.stringify({ ok: true, status: 'published', row_id: body?.[0]?.id || null, title: body?.[0]?.title || post.title, type: body?.[0]?.type || post.type, source_url: sourceUrl }));
