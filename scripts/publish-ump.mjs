#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const START_DATE = '2026-10-01';
const KSPI_LOW = 0.075;
const KSPI_HIGH = 0.085;
const SOURCE_URL = 'https://ekonomi.bisnis.com/read/20260907/12/2002105/buruh-kspi-usul-kenaikan-ump-2027-hingga-85';
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

function buildContent(item, low, high) {
  const lowValue = item.ump2026 * (1 + KSPI_LOW);
  const highValue = item.ump2026 * (1 + KSPI_HIGH);
  return [
    `# Estimasi UMP ${item.prov} 2027 Jika Sesuai Usulan Buruh`,
    '',
    `Berapa gaji UMR ${item.prov} 2027? Berikut simulasi estimasi UMP ${item.prov} 2027 apabila usulan kenaikan upah minimum dari KSPI sebesar 7,5% sampai 8,5% diterapkan.`,
    '',
    `## Estimasi UMP ${item.prov} 2027`,
    `Sebagai dasar simulasi, UMP ${item.prov} 2026 tercatat sebesar ${rupiah(item.ump2026)}. Dengan asumsi kenaikan 7,5%–8,5%, estimasi UMP ${item.prov} 2027 berada di kisaran ${rupiah(lowValue)} sampai ${rupiah(highValue)}.`,
    '',
    `- UMP ${item.prov} 2026: ${rupiah(item.ump2026)}`,
    `- Estimasi kenaikan 7,5%: ${rupiah(low)} → ${rupiah(lowValue)}`,
    `- Estimasi kenaikan 8,5%: ${rupiah(high)} → ${rupiah(highValue)}`,
    '',
    `## Dasar Usulan Kenaikan UMP 2027`,
    'KSPI mengusulkan formula yang mempertimbangkan inflasi, pertumbuhan ekonomi, dan indeks tertentu atau alfa 0,9. Dalam pemberitaan yang menjadi rujukan, kisaran kenaikan yang disampaikan adalah 7,5%–8,5%.',
    '',
    '## Apakah Ini Angka Resmi?',
    'Belum. Angka di atas adalah estimasi atau simulasi berdasarkan usulan buruh, bukan keputusan pemerintah. Nilai resmi UMP 2027 masih menunggu data BPS, pembahasan tripartit, dan keputusan gubernur masing-masing provinsi.',
    '',
    '## Catatan UMP dan UMK',
    `UMP berlaku pada tingkat provinsi. Nilai UMK kabupaten/kota di wilayah ${item.prov} dapat berbeda dan memiliki proses penetapan tersendiri. Pembaca perlu menunggu keputusan resmi sebelum menjadikan simulasi ini sebagai acuan pengupahan.`,
    '',
    `Sumber usulan KSPI: ${SOURCE_URL}`,
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
  const prompt = `Editorial featured image for an Indonesian employment news article about estimated provincial minimum wage (UMP) 2027 in ${item.prov}. Show an elegant stylized illustration of ${landmark}, a diverse Indonesian workforce and a subtle modern city/industry atmosphere. Clean navy, teal and warm accent palette, professional news website, no text, no numbers, no logos, no official seals, landscape 3:2 composition.`;
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', quality: 'medium' }),
  });
  const body = await response.json();
  if (!response.ok || !body?.data?.[0]?.b64_json) {
    throw new Error(`OpenAI Images HTTP ${response.status}: ${body?.error?.message || 'respons kosong'}`);
  }
  const imagePath = `ump-2027/${item.slug}.png`;
  const imageBytes = Buffer.from(body.data[0].b64_json, 'base64');
  const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/images/${imagePath}`;
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
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/images/${imagePath}`;
}

loadEnvFile();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const today = todayWib();

if (today < START_DATE) process.exit(0);
if (!supabaseUrl || !serviceRoleKey) {
  fail('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia di runtime.', 2);
} else {
  const baseUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/posts`;
  try {
    const rows = await request(`${baseUrl}?select=title,type&title=like.UMP%20*%202027*`);
    const existingTitles = new Set((rows || []).map((row) => row.title));
    const next = parseUmpData()
      .map((item) => ({ ...item, title: `Estimasi UMP ${item.prov} 2027 Jika Sesuai Usulan Buruh` }))
      .find((item) => !existingTitles.has(item.title));

    if (!next) {
      console.log(JSON.stringify({ ok: true, status: 'complete', message: 'Semua 38 provinsi sudah memiliki artikel estimasi UMP 2027.' }));
    } else if (process.env.PUBLISH_UMP_DRY_RUN === '1') {
      console.log(JSON.stringify({ ok: true, status: 'dry-run', article: next, start_date: START_DATE, source: SOURCE_URL }));
    } else {
      const low = Math.round(next.ump2026 * (1 + KSPI_LOW));
      const high = Math.round(next.ump2026 * (1 + KSPI_HIGH));
      const imageUrl = await generateFeaturedImage(next);
      const inserted = await request(baseUrl, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          type: 'news', title: next.title, company: 'BekasiKerja.id',
          category: 'UMP 2027 · Estimasi Usulan Buruh', content: buildContent(next, low, high),
          image_url: imageUrl, location: next.prov, deadline: null,
        }),
      });
      console.log(JSON.stringify({ ok: true, status: 'published', article: next, estimated_range: { low, high }, row_id: inserted?.[0]?.id || null }));
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
