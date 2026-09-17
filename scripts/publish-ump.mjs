#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const SOURCE_URL = 'https://www.bekasikerja.id/ump';
const LANDMARKS = {
  Aceh: 'Masjid Raya Baiturrahman', 'Sumatera Utara': 'Danau Toba', 'Sumatera Barat': 'Jam Gadang',
  Riau: 'Istana Siak', Jambi: 'Candi Muaro Jambi', 'Sumatera Selatan': 'Jembatan Ampera',
  Bengkulu: 'Benteng Marlborough', Lampung: 'Menara Siger', 'Kep. Bangka Belitung': 'Pantai Tanjung Tinggi',
  'Kepulauan Riau': 'Jembatan Barelang', 'DKI Jakarta': 'Monas', 'Jawa Barat': 'Gedung Sate',
  'Jawa Tengah': 'Candi Borobudur', 'DI Yogyakarta': 'Tugu Yogyakarta', 'Jawa Timur': 'Jembatan Suramadu',
  Banten: 'Masjid Agung Banten', Bali: 'Pura Ulun Danu Beratan', 'Nusa Tenggara Barat': 'Gunung Rinjani',
  'Nusa Tenggara Timur': 'Komodo dan Pulau Padar', 'Kalimantan Barat': 'Tugu Khatulistiwa',
  'Kalimantan Tengah': 'Jembatan Kahayan', 'Kalimantan Selatan': 'Pasar Terapung',
  'Kalimantan Timur': 'IKN dan Istana Garuda', 'Kalimantan Utara': 'Taman Nasional Kayan Mentarang',
  'Sulawesi Utara': 'Bunaken', 'Sulawesi Tengah': 'Jembatan Palu', 'Sulawesi Selatan': 'Rumah Tongkonan',
  'Sulawesi Tenggara': 'Benteng Keraton Buton', Gorontalo: 'Menara Limboto', 'Sulawesi Barat': 'Pantai Manakarra',
  Maluku: 'Jembatan Merah Putih Ambon', 'Maluku Utara': 'Gunung Gamalama', 'Papua Barat': 'Raja Ampat',
  Papua: 'Pegunungan Jayawijaya', 'Papua Tengah': 'Danau Paniai', 'Papua Pegunungan': 'Lembah Baliem',
  'Papua Selatan': 'Taman Nasional Wasur', 'Papua Barat Daya': 'Raja Ampat',
};

function loadEnvFile() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function fail(message, code = 1) {
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exitCode = code;
}

function parseUmpData() {
  const source = fs.readFileSync(path.join(root, 'lib/ump-data.js'), 'utf8');
  const pattern = /\{\s*no:\s*(\d+),\s*prov:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*ump2025:\s*(\d+),\s*ump2026:\s*(\d+),\s*naik:\s*'([^']+)'\s*\}/g;
  return [...source.matchAll(pattern)].map((match) => ({
    no: Number(match[1]), prov: match[2], slug: match[3],
    ump2025: Number(match[4]), ump2026: Number(match[5]), naik: match[6],
  }));
}

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(Math.round(value));
}

function todayWib() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function buildContent(item) {
  return [
    `# UMP ${item.prov} 2026: Besaran Upah Minimum Provinsi`,
    '',
    `Berapa UMP ${item.prov} tahun 2026? Artikel ini merangkum besaran upah minimum provinsi, perbandingannya dengan tahun 2025, serta persentase perubahan yang tercatat.`,
    '',
    `## Besaran UMP ${item.prov} 2026`,
    `UMP ${item.prov} pada 2026 tercatat sebesar ${rupiah(item.ump2026)} per bulan. Angka ini menjadi dasar upah minimum tingkat provinsi dan berbeda dari UMK kabupaten atau kota.`,
    '',
    `- UMP ${item.prov} 2025: ${rupiah(item.ump2025)}`,
    `- UMP ${item.prov} 2026: ${rupiah(item.ump2026)}`,
    `- Perubahan dibanding 2025: ${item.naik}`,
    '',
    '## Bedanya UMP dan UMK',
    `UMP berlaku untuk seluruh provinsi ${item.prov}. Kabupaten atau kota dapat memiliki UMK tersendiri dengan nilai yang berbeda, sehingga pencari kerja perlu melihat ketentuan wilayah tempat perusahaan berada.`,
    '',
    '## Catatan untuk Pekerja',
    'UMP merupakan batas minimum pengupahan sesuai ketentuan yang berlaku. Besaran gaji aktual dapat lebih tinggi berdasarkan jabatan, pengalaman, tunjangan, dan kebijakan perusahaan.',
    '',
    'Data UMP 2026 dirangkum dari data provinsi yang digunakan BekasiKerja.id. Periksa keputusan pemerintah daerah untuk kebutuhan administratif atau pengupahan resmi.',
    '',
    `Sumber data: ${SOURCE_URL}/${item.slug}`,
    `Artikel terkait: https://www.bekasikerja.id/ump/${item.slug}`,
  ].join('\n');
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(`Supabase HTTP ${response.status}: ${body?.message || body?.error || text}`);
  return body;
}

async function generateFeaturedImage(item) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return null;
  const landmark = LANDMARKS[item.prov] || `ikon budaya ${item.prov}`;
  const prompt = `Editorial featured image for an Indonesian employment news article about provincial minimum wage (UMP) 2026 in ${item.prov}. Show an elegant stylized illustration of ${landmark}, a diverse Indonesian workforce and a subtle modern city/industry atmosphere. Clean navy, teal and warm accent palette, professional news website, no text, no numbers, no logos, no official seals, landscape 3:2 composition.`;
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', quality: 'medium' }),
  });
  const body = await response.json();
  if (!response.ok || !body?.data?.[0]?.b64_json) {
    throw new Error(`OpenAI Images HTTP ${response.status}: ${body?.error?.message || 'respons kosong'}`);
  }
  const imagePath = `ump-2026/${item.slug}.png`;
  const imageBytes = Buffer.from(body.data[0].b64_json, 'base64');
  const storageBaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const uploadUrl = `${storageBaseUrl}/storage/v1/object/images/${imagePath}`;
  const upload = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: imageBytes,
  });
  if (!upload.ok) throw new Error(`Supabase Storage HTTP ${upload.status}: ${await upload.text()}`);
  return `${storageBaseUrl}/storage/v1/object/public/images/${imagePath}`;
}

loadEnvFile();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const today = todayWib();

if (!supabaseUrl || !serviceRoleKey) {
  fail('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia di runtime.', 2);
} else {
  const baseUrl = `${supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')}/rest/v1/posts`;
  try {
    const rows = await request(`${baseUrl}?select=title&type=eq.news&limit=1000`);
    const existingTitles = new Set((rows || []).map((row) => row.title));
    const next = parseUmpData()
      .map((item) => ({ ...item, title: `UMP ${item.prov} 2026: Besaran Upah Minimum Provinsi` }))
      .find((item) => !existingTitles.has(item.title));

    if (!next) {
      console.log(JSON.stringify({ ok: true, status: 'complete', message: 'Semua 38 provinsi sudah memiliki artikel UMP 2026.' }));
    } else if (process.env.PUBLISH_UMP_DRY_RUN === '1') {
      console.log(JSON.stringify({ ok: true, status: 'dry-run', article: next, source: SOURCE_URL }));
    } else {
      const imageUrl = await generateFeaturedImage(next);
      const inserted = await request(baseUrl, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          type: 'news', title: next.title, company: 'BekasiKerja.id',
          category: 'Berita', content: buildContent(next),
          image_url: imageUrl, location: next.prov, deadline: null,
        }),
      });
      console.log(JSON.stringify({ ok: true, status: 'published', article: next, row_id: inserted?.[0]?.id || null }));
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
