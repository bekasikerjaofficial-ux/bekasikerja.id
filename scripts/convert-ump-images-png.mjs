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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#062b55"/><stop offset="1" stop-color="#008d9a"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4b44d"/><stop offset="1" stop-color="#e87843"/></linearGradient></defs><rect width="1200" height="675" fill="url(#sky)"/><circle cx="1000" cy="130" r="82" fill="#ffd77a" opacity=".85"/><path d="M0 470 170 315 300 430 490 235 650 420 830 270 1200 500V675H0Z" fill="#123f63" opacity=".9"/><path d="M0 535Q260 455 500 535T1200 510V675H0Z" fill="url(#ground)"/><g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M310 505V385h55v120M278 385h120M330 315v70M305 345h50"/><path d="M550 520V410h100v110M535 410h130M570 365h60v45M585 330h30v35"/><path d="M785 520V390h80v130M770 390h110M805 350h40v40"/></g><text x="64" y="90" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700">BEKASIKERJA.ID</text><text x="64" y="585" fill="#fff" font-family="Arial,sans-serif" font-size="42" font-weight="800">UMP 2026 — ${esc(province)}</text><text x="66" y="625" fill="#fff" font-family="Arial,sans-serif" font-size="25" opacity=".9">Landmark: ${esc(landmark)}</text></svg>`;
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
