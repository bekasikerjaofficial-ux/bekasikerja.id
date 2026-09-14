#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env.local');

function loadEnvFile() {
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
    no: Number(match[1]),
    prov: match[2],
    slug: match[3],
    ump2025: Number(match[4]),
    ump2026: Number(match[5]),
    naik: match[6],
  }));
}

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(value);
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
  if (!response.ok) {
    throw new Error(`Supabase HTTP ${response.status}: ${body?.message || body?.error || text}`);
  }
  return body;
}

loadEnvFile();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  fail('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib tersedia di runtime.', 2);
} else {
  const baseUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/posts`;
  try {
    const rows = await request(`${baseUrl}?select=title&type=eq.news&order=created_at.asc`);
    const existingTitles = new Set((rows || []).map((row) => row.title));
    const next = parseUmpData()
      .map((item) => ({ ...item, title: `UMP ${item.prov} 2026: Kenaikan dari UMP 2025` }))
      .find((item) => !existingTitles.has(item.title));

    if (!next) {
      console.log(JSON.stringify({ ok: true, status: 'complete', message: 'Semua 38 artikel UMP sudah terpublikasi.' }));
    } else if (process.env.PUBLISH_UMP_DRY_RUN === '1') {
      console.log(JSON.stringify({ ok: true, status: 'dry-run', next }));
    } else {
      const content = [
        `Informasi UMP ${next.prov} tahun 2026 berdasarkan dataset BekasiKerja.id.`,
        '',
        `UMP 2025: ${rupiah(next.ump2025)}`,
        `UMP 2026: ${rupiah(next.ump2026)}`,
        `Kenaikan: ${next.naik}`,
        '',
        `Baca halaman lengkap: https://www.bekasikerja.id/ump/${next.slug}`,
      ].join('\n');
      const inserted = await request(baseUrl, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          type: 'news',
          title: next.title,
          company: 'BekasiKerja.id',
          category: 'Info Kerja Wilayah',
          content,
          image_url: null,
          location: next.prov,
          deadline: null,
        }),
      });
      console.log(JSON.stringify({ ok: true, status: 'published', article: next, row: inserted?.[0] || null }));
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
