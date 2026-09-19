#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const source = path.join(root, 'scripts/backfill-ump-images.mjs');
const content = fs.readFileSync(source, 'utf8');
const match = content.match(/const landmarks = \{([\s\S]*?)\n\};/);
if (!match) throw new Error('Landmark map tidak ditemukan.');
const landmarks = Function(`return {${match[1]}\n}`)();
function loadEnvFile() {
  const file = path.join(root, '.env.local');
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim(); const i = value.indexOf('=');
    if (i > 0 && !value.startsWith('#')) process.env[value.slice(0, i).trim()] ||= value.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
}
function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function svg(province, landmark) {
  const art = {
    Aceh: '<path d="M340 500V350h120v150M320 350h160M370 300h60v50M395 250h10v50M410 250h10v50"/><path d="M700 500V365h150v135M675 365h200M725 315h100v50"/>',
    'Sumatera Utara': '<path d="M0 470 210 250 390 470M300 470 540 180 760 470M650 470 900 230 1200 470"/><path d="M0 520Q300 430 600 520T1200 510V675H0Z"/>',
    'Sumatera Barat': '<path d="M510 500V300h180v200M480 300h240M560 230h80v70M595 170h10v60M565 205h70"/><path d="M250 510 360 420 470 510M730 510 840 420 950 510"/>',
    Riau: '<path d="M370 500V330h460v170M330 330h540M430 260h340v70M500 210h200v50M560 170h80v40"/><path d="M250 510h700"/>',
    Jambi: '<path d="M430 510V350l170-130 170 130v160M390 350h420M470 290h260M510 250h180"/><path d="M280 510h640"/>',
    'Sumatera Selatan': '<path d="M210 410Q600 180 990 410M210 410Q600 640 990 410M300 360v100M450 290v240M600 250v320M750 290v240M900 360v100"/>',
    Bengkulu: '<path d="M290 500V315h620v185M260 315h680M350 250h500v65M410 195h380v55M470 150h260v45M330 500h540"/>',
  }[province] || '<path d="M260 510 470 260 680 510M600 510 820 220 1040 510M150 540h900"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#062b55"/><stop offset="1" stop-color="#008d9a"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4b44d"/><stop offset="1" stop-color="#e87843"/></linearGradient></defs><rect width="1200" height="675" fill="url(#sky)"/><circle cx="1000" cy="130" r="82" fill="#ffd77a" opacity=".85"/><path d="M0 470 170 315 300 430 490 235 650 420 830 270 1200 500V675H0Z" fill="#123f63" opacity=".9"/><path d="M0 535Q260 455 500 535T1200 510V675H0Z" fill="url(#ground)"/><g fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity=".94">${art}</g></svg>`;
}
loadEnvFile();
const base = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const postsUrl = `${base}/rest/v1/posts`;
const rowsResponse = await fetch(`${postsUrl}?select=id,title,location,type&title=like.*UMP*2026*&type=eq.news&order=id.asc`, { headers });
const rows = await rowsResponse.json();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ump-png-'));
const results = [];
for (const row of rows) {
  const province = row.location || row.title.match(/^UMP (.+?) 2026:/)?.[1];
  const landmark = landmarks[province]; if (!province || !landmark) continue;
  const slug = province.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const svgPath = path.join(temp, `${slug}.svg`); const pngPath = path.join(temp, `${slug}.png`);
  fs.writeFileSync(svgPath, svg(province, landmark));
  execFileSync('convert', [svgPath, '-resize', '1200x675!', pngPath]);
  const imagePath = `ump-2026/${slug}.png`;
  const upload = await fetch(`${base}/storage/v1/object/images/${imagePath}`, { method: 'POST', headers: { ...headers, 'Content-Type': 'image/png', 'x-upsert': 'true' }, body: fs.readFileSync(pngPath) });
  if (!upload.ok) throw new Error(`Upload ${province} gagal: ${upload.status}`);
  const imageUrl = `${base}/storage/v1/object/public/images/${imagePath}`;
  const update = await fetch(`${postsUrl}?id=eq.${row.id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify({ image_url: imageUrl }) });
  if (!update.ok) throw new Error(`Update ${province} gagal: ${update.status}`);
  results.push({ id: row.id, province, image_url: imageUrl });
}
const verify = await fetch(`${postsUrl}?select=id,image_url&title=like.*UMP*2026*&type=eq.news&order=id.asc`, { headers });
console.log(JSON.stringify({ ok: verify.ok, updated: results.length, results, readback: await verify.json() }));
