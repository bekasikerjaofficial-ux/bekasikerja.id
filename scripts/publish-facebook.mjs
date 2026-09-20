#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v26.0';
const PAGE_ID = process.env.META_PAGE_ID;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const PAGE_NAME = process.env.META_PAGE_NAME || 'Bekasi Kerja';
const SITE_URL = 'https://www.bekasikerja.id';

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
function normalizeUrl(value) { return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''); }
function slugify(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function excerpt(value, limit = 240) {
  const clean = String(value || '').replace(/\\n/g, ' ').replace(/\r?\n/g, ' ')
    .replace(/^#{1,6}\s+/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^-\s+/gm, '').replace(/\s+/g, ' ').trim();
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean;
}
function articleUrl(post) {
  const section = post.type === 'job' ? 'loker' : 'artikel';
  return `${SITE_URL}/${section}/${slugify(post.title)}-${post.id}`;
}
function hashtags(post) {
  const location = String(post.location || '').toLowerCase();
  const tags = ['#BekasiKerja'];
  if (location.includes('karawang')) tags.push('#Karawang');
  else if (location.includes('cikarang')) tags.push('#Cikarang');
  else if (location.includes('bekasi')) tags.push('#Bekasi');
  if (post.type === 'job') tags.push('#LowonganKerja');
  else if (post.category === 'Lifestyle & Tips Karir') tags.push('#TipsKarir');
  else tags.push('#BeritaKerja');
  return tags.join(' ');
}
function caption(post) {
  const kind = post.type === 'job' ? 'lowongan kerja' : 'artikel';
  return `${post.title}\n\n${excerpt(post.content)}\n\nBaca ${kind} selengkapnya:\n${articleUrl(post)}\n\n${hashtags(post)}`;
}
async function request(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${body?.message || body?.error?.message || JSON.stringify(body)}`);
  return body;
}

loadEnvFile();
if (!PAGE_ID || !PAGE_TOKEN) {
  console.log(JSON.stringify({ ok: false, status: 'blocked', reason: 'META_PAGE_ID dan META_PAGE_ACCESS_TOKEN belum tersedia; tidak ada posting Facebook yang dikirim.' }));
  process.exit(0);
}
const supabaseBase = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseBase || !supabaseKey) throw new Error('Konfigurasi Supabase server belum tersedia.');
const rest = `${supabaseBase}/rest/v1`;
const supabaseHeaders = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
const posts = await request(`${rest}/posts?select=id,title,type,category,content,location,created_at&order=created_at.asc&limit=1000`, { headers: supabaseHeaders });
const results = [];
for (const post of posts || []) {
  const existing = await request(`${rest}/social_publications?select=id,status,external_id&platform=eq.facebook&channel_id=eq.${encodeURIComponent(PAGE_ID)}&post_id=eq.${encodeURIComponent(post.id)}&limit=1`, { headers: supabaseHeaders });
  if (existing?.[0]?.status === 'published' && existing[0].external_id) {
    results.push({ id: post.id, status: 'already_published', external_id: existing[0].external_id });
    continue;
  }
  const payload = new URLSearchParams({ message: caption(post), link: articleUrl(post), access_token: PAGE_TOKEN });
  try {
    const published = await request(`https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(PAGE_ID)}/feed`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload });
    const record = { platform: 'facebook', channel_id: PAGE_ID, post_id: post.id, external_id: published.id, status: 'published', error_message: null, published_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (existing?.[0]?.id) await request(`${rest}/social_publications?id=eq.${encodeURIComponent(existing[0].id)}`, { method: 'PATCH', headers: { ...supabaseHeaders, Prefer: 'return=minimal' }, body: JSON.stringify(record) });
    else await request(`${rest}/social_publications`, { method: 'POST', headers: { ...supabaseHeaders, Prefer: 'return=minimal' }, body: JSON.stringify(record) });
    const verify = await request(`https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(published.id)}?fields=id,is_published&access_token=${encodeURIComponent(PAGE_TOKEN)}`);
    if (verify.id !== published.id || verify.is_published === false) throw new Error('Facebook read-back tidak menunjukkan post published.');
    results.push({ id: post.id, status: 'published', external_id: published.id });
  } catch (error) {
    const message = String(error.message || error).slice(0, 500);
    const record = { platform: 'facebook', channel_id: PAGE_ID, post_id: post.id, status: 'failed', error_message: message, updated_at: new Date().toISOString() };
    if (existing?.[0]?.id) await request(`${rest}/social_publications?id=eq.${encodeURIComponent(existing[0].id)}`, { method: 'PATCH', headers: { ...supabaseHeaders, Prefer: 'return=minimal' }, body: JSON.stringify(record) });
    else await request(`${rest}/social_publications`, { method: 'POST', headers: { ...supabaseHeaders, Prefer: 'return=minimal' }, body: JSON.stringify(record) });
    results.push({ id: post.id, status: 'failed', error: message });
  }
}
console.log(JSON.stringify({ ok: true, page: PAGE_NAME, page_id: PAGE_ID, total: results.length, results }));
