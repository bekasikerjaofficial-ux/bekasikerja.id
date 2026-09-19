#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const PUBLISH_YEAR = process.env.UMP_YEAR || '2026';
const START_DATE = process.env.UMP_START_DATE || '2026-09-17';
const ESTIMATE_LOW = 0.075;
const ESTIMATE_HIGH = 0.095;
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

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}

function fallbackLandmarkSvg(item) {
  const province = escapeXml(item.prov);
  const landmark = escapeXml(LANDMARKS[item.prov] || `ikon budaya ${item.prov}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#062b55"/><stop offset="1" stop-color="#008d9a"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4b44d"/><stop offset="1" stop-color="#e87843"/></linearGradient></defs><rect width="1200" height="675" fill="url(#sky)"/><circle cx="1000" cy="130" r="82" fill="#ffd77a" opacity=".85"/><path d="M0 470 170 315 300 430 490 235 650 420 830 270 1200 500V675H0Z" fill="#123f63" opacity=".9"/><path d="M0 535Q260 455 500 535T1200 510V675H0Z" fill="url(#ground)"/><g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M310 505V385h55v120M278 385h120M330 315v70M305 345h50"/><path d="M550 520V410h100v110M535 410h130M570 365h60v45M585 330h30v35"/><path d="M785 520V390h80v130M770 390h110M805 350h40v40"/></g><text x="64" y="90" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700">BEKASIKERJA.ID</text><text x="64" y="585" fill="#fff" font-family="Arial,sans-serif" font-size="42" font-weight="800">UMP ${PUBLISH_YEAR} — ${province}</text><text x="66" y="625" fill="#fff" font-family="Arial,sans-serif" font-size="25" opacity=".9">Landmark: ${landmark}</text></svg>`;
}

async function uploadFallbackFeaturedImage(item) {
  const imagePath = `ump-${PUBLISH_YEAR}/${item.slug}.png`;
  const storageBaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const tempDir = fs.mkdtempSync(path.join('/tmp', 'ump-image-'));
  const svgPath = path.join(tempDir, `${item.slug}.svg`);
  const pngPath = path.join(tempDir, `${item.slug}.png`);
  fs.writeFileSync(svgPath, fallbackLandmarkSvg(item));
  execFileSync('convert', [svgPath, '-resize', '1200x675!', pngPath]);
  const upload = await fetch(`${storageBaseUrl}/storage/v1/object/images/${imagePath}`, {
    method: 'POST',
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'image/png', 'x-upsert': 'true' },
    body: fs.readFileSync(pngPath),
  });
  if (!upload.ok) throw new Error(`Supabase Storage fallback HTTP ${upload.status}: ${await upload.text()}`);
  return `${storageBaseUrl}/storage/v1/object/public/images/${imagePath}`;
}

function todayWib() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function buildContent(item) {
  if (PUBLISH_YEAR === '2027') {
    const lowValue = Math.round(item.ump2026 * (1 + ESTIMATE_LOW));
    const highValue = Math.round(item.ump2026 * (1 + ESTIMATE_HIGH));
    return [
      `# Estimasi UMP ${item.prov} 2027: Simulasi Kenaikan 7,5%–9,5%`, '',
      `Berapa perkiraan UMP ${item.prov} tahun 2027? Artikel ini menyajikan simulasi berdasarkan UMP 2026 dan rentang usulan kenaikan buruh KSPI sebesar 7,5% sampai 9,5%.`, '',
      `## Simulasi UMP ${item.prov} 2027`,
      `Jika kenaikan 7,5%–9,5% diterapkan, UMP ${item.prov} 2027 diperkirakan berada di kisaran ${rupiah(lowValue)} sampai ${rupiah(highValue)}.`, '',
      `- UMP ${item.prov} 2026: ${rupiah(item.ump2026)}`,
      `- Simulasi kenaikan 7,5%: ${rupiah(lowValue)}`,
      `- Simulasi kenaikan 9,5%: ${rupiah(highValue)}`, '',
      '## Apakah Ini Angka Resmi?',
      'Belum. Ini hanya simulasi berdasarkan usulan KSPI, bukan keputusan pemerintah. Angka resmi UMP 2027 menunggu ketetapan pemerintah dan gubernur masing-masing provinsi.', '',
      '## Catatan UMP dan UMK',
      `UMP berlaku pada tingkat provinsi. UMK kabupaten atau kota di wilayah ${item.prov} dapat berbeda dan memiliki proses penetapan tersendiri.`, '',
      'Sumber dasar simulasi: usulan kenaikan buruh KSPI sebesar 7,5%–9,5%.',
      `Artikel terkait: https://www.bekasikerja.id/ump/${item.slug}`,
    ].join('\\n');
  }
  return [
    `# UMP ${item.prov} 2026: Besaran Upah Minimum Provinsi`, '',
    `Berapa UMP ${item.prov} tahun 2026? Artikel ini merangkum besaran upah minimum provinsi, perbandingannya dengan tahun 2025, nominal kenaikan dalam rupiah, serta persentase perubahannya.`, '',
    `## Besaran UMP ${item.prov} 2026`,
    `UMP ${item.prov} pada 2026 tercatat sebesar ${rupiah(item.ump2026)} per bulan.`, '',
    `- UMP ${item.prov} 2025: ${rupiah(item.ump2025)}`,
    `- UMP ${item.prov} 2026: ${rupiah(item.ump2026)}`,
    `- Nominal kenaikan: ${rupiah(item.ump2026 - item.ump2025)}`,
    `- Persentase kenaikan: ${item.naik}`, '',
    '## Bedanya UMP dan UMK',
    `UMP berlaku untuk seluruh provinsi ${item.prov}. Kabupaten atau kota dapat memiliki UMK tersendiri dengan nilai yang berbeda.`, '',
    '## Catatan untuk Pekerja',
    'UMP merupakan batas minimum pengupahan. Gaji aktual dapat lebih tinggi sesuai jabatan, pengalaman, tunjangan, dan kebijakan perusahaan.', '',
    'Data UMP 2026 dirangkum dari data provinsi yang digunakan BekasiKerja.id. Periksa keputusan pemerintah daerah untuk kebutuhan administratif atau pengupahan resmi.', '',
    `Sumber data: ${SOURCE_URL}/${item.slug}`,
    `Artikel terkait: https://www.bekasikerja.id/ump/${item.slug}`,
  ].join('\\n');
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
  if (!openaiKey) return uploadFallbackFeaturedImage(item);
  const landmark = LANDMARKS[item.prov] || `ikon budaya ${item.prov}`;
  const prompt = `Editorial featured image for an Indonesian employment news article about ${PUBLISH_YEAR === '2027' ? 'estimated ' : ''}provincial minimum wage (UMP) ${PUBLISH_YEAR} in ${item.prov}. Show an elegant stylized illustration of ${landmark}, a diverse Indonesian workforce and a subtle modern city/industry atmosphere. Clean navy, teal and warm accent palette, professional news website, no text, no numbers, no logos, no official seals, landscape 3:2 composition.`;
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', quality: 'medium' }),
  });
  const body = await response.json();
  if (!response.ok || !body?.data?.[0]?.b64_json) {
    throw new Error(`OpenAI Images HTTP ${response.status}: ${body?.error?.message || 'respons kosong'}`);
  }
  const imagePath = `ump-${PUBLISH_YEAR}/${item.slug}.png`;
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

if (today < START_DATE) {
  console.log(JSON.stringify({ ok: true, status: 'waiting', publish_year: PUBLISH_YEAR, start_date: START_DATE }));
  process.exit(0);
}
if (!supabaseUrl || !serviceRoleKey) {
  fail('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia di runtime.', 2);
} else {
  const baseUrl = `${supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')}/rest/v1/posts`;
  try {
    const rows = await request(`${baseUrl}?select=title&type=eq.news&limit=1000`);
    const existingTitles = new Set((rows || []).map((row) => row.title));
    const next = parseUmpData()
      .map((item) => ({ ...item, title: PUBLISH_YEAR === '2027'
        ? `Estimasi UMP ${item.prov} 2027: Simulasi Kenaikan 7,5%–9,5%`
        : `UMP ${item.prov} 2026: Besaran Upah Minimum Provinsi` }))
      .find((item) => !existingTitles.has(item.title));

    if (!next) {
      console.log(JSON.stringify({ ok: true, status: 'complete', message: `Semua 38 provinsi sudah memiliki artikel UMP ${PUBLISH_YEAR}.` }));
    } else if (process.env.PUBLISH_UMP_DRY_RUN === '1') {
      console.log(JSON.stringify({ ok: true, status: 'dry-run', article: next, publish_year: PUBLISH_YEAR, source: SOURCE_URL }));
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
