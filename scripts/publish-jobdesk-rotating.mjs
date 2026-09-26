#!/usr/bin/env node
/**
 * Job Desk rotating publisher — ZERO inference cost.
 *
 * Runs without any LLM in the loop (hermes cron --no-agent --script).
 * Picks the next unused topic from a local bank of hand-written job-desk
 * explainers for Bekasi / Cikarang / Karawang, dedupes against the production
 * `posts` table, inserts one row via Supabase REST, then reads it back.
 *
 * Fail-closed: exits non-zero (loudly) if the bank is exhausted, the
 * credentials are missing, or the read-back assertion fails. It never invents
 * a topic and never writes a partial row.
 *
 * Run: node scripts/publish-jobdesk-rotating.mjs
 *      DRY_RUN=1 node scripts/publish-jobdesk-rotating.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

/* Resolve the repo root: cron may run from ~/.hermes/scripts, so fall back
 * to the known project path when .env.local is not in the current directory. */
const CANDIDATE_ROOTS = [process.cwd(), '/home/valarion/workspace/dev/bekasikerja.id'];
const root = CANDIDATE_ROOTS.find((d) => fs.existsSync(path.join(d, '.env.local'))) || process.cwd();
const DRY = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const CATEGORY = 'Lifestyle & Tips Karir';

/* ------------------------------------------------------------------ *
 * Topic bank lives in scripts/jobdesk-topics.mjs so the list can grow
 * without touching publishing logic. It is required, not optional: the
 * publisher fails closed rather than falling back to a stale seed, so a
 * missing or empty bank can never silently publish less than expected.
 * ------------------------------------------------------------------ */
let BANK = [];
try {
  const mod = await import('./jobdesk-topics.mjs');
  if (Array.isArray(mod.TOPICS)) BANK = mod.TOPICS;
} catch (err) {
  console.error(
    `[jobdesk] GAGAL: scripts/jobdesk-topics.mjs tidak terbaca (${err.message}). ` +
      'Bank topik wajib ada; tidak ada tulisan yang dilakukan.'
  );
  process.exit(1);
}
if (!BANK.length) {
  console.error('[jobdesk] GAGAL: bank topik kosong. Tidak ada tulisan yang dilakukan.');
  process.exit(1);
}

/* Validate the bank up front so bad data fails before any write: a
 * half-published article is worse than a loud non-zero exit. */
const VALID_CITIES = new Set(['Bekasi', 'Cikarang', 'Karawang']);
for (const t of BANK) {
  if (!t || typeof t.role !== 'string' || !VALID_CITIES.has(t.city)) {
    console.error(
      '[jobdesk] GAGAL: topik tidak valid (' +
        'role=' + (t && t.role) +
        ', city=' + (t && t.city) +
        '). Tidak ada tulisan yang dilakukan.'
    );
    process.exit(1);
  }
  const wanted = { tugas: 6, skill: 6, tips: 4 };
  for (const key of Object.keys(wanted)) {
    const list = t[key];
    if (!Array.isArray(list) || list.length !== wanted[key]) {
      console.error(
        '[jobdesk] GAGAL: ' + t.role + '/' + key + ' harus ' + wanted[key] +
        ' item, dapat ' + (list ? list.length : 'non-array') +
        '. Tidak ada tulisan yang dilakukan.'
      );
      process.exit(1);
    }
  }
}

/* --------------------- content composition --------------------- */
function rot(arr, n) {
  if (!arr.length) return [];
  return arr.map((_, i) => arr[(i + n) % arr.length]);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function compose(topic, n) {
  const title = `Job Desk ${topic.role} di ${topic.city}: Tugas dan Skill`;
  return {
    type: 'news',
    title,
    category: CATEGORY,
    location: `${topic.city}, Jawa Barat`,
    content: [
      `# ${title}`,
      '',
      introFor(topic),
      '',
      `## Apa Itu ${topic.role}?`,
      `${topic.role} adalah posisi yang bekerja di lingkungan industri, gudang, atau titik layanan di wilayah ${topic.city}. Posisi ini bagian dari rantai kerja harian yang menjaga agar aktivitas operasional berjalan tanpa hambatan.`,
      '',
      '## Tugas dan Job Desk',
      ...rot(topic.tugas, n).map((t) => `- ${t}`),
      '',
      '## Skill yang Dibutuhkan',
      ...rot(topic.skill, n).map((s) => `- ${s}`),
      '',
      `## Lingkungan Kerja di ${topic.city}`,
      envFor(topic),
      '',
      '## Tips Melamar',
      ...rot(topic.tips, n).map((t) => `- ${t}`),
      '',
      '## Kesimpulan',
      `Posisi ${topic.role} di ${topic.city} cocok untuk kandidat yang teliti, disiplin, dan siap bekerja mengikuti prosedur serta standar keselamatan kerja. Siapkan pengalaman relevan, jelaskan shift yang bisa diikuti, dan pastikan CV Anda menampilkan ketelitian pada detail.`,
    ].join('\n'),
  };
}

/* --------------------- env + REST --------------------- */
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
function normalizeUrl(v) {
  return String(v || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

loadEnvFile();
const base = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) {
  console.error('[jobdesk] GAGAL: konfigurasi Supabase server tidak tersedia. Tidak ada tulisan dilakukan.');
  process.exit(1);
}

const endpoint = `${base}/rest/v1/posts`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

/* Bank entries stay terse (short phrases only). Prose is expanded here so
 * adding topics never requires rewriting paragraph text. */
function introFor(t) {
  const area = t.bunch || 'operasional';
  return (
    `${t.role} di ${t.city} bekerja di lingkungan ${area}. ` +
    `Posisi ini menjadi bagian dari rantai kerja harian yang menjaga agar ` +
    `kegiatan di wilayah ${t.city} berjalan tanpa hambatan.`
  );
}

function envFor(t) {
  const area = t.bunch || 'operasional';
  return (
    `Pekerjaan ${t.role} di ${t.city} berlangsung di lingkungan ${area} ` +
    `yang bekerja mengikuti ritme terstruktur dan aturan keselamatan kerja. ` +
    `Kebersihan, kerapian, dan keselamatan kerja menjadi bagian dari penilaian.`
  );
}

/* --------------------- pick next unused topic --------------------- */
/* PostgREST `or=(...)` cannot parse titles containing spaces, so fetch the
 * job-desk stream once with a prefix match and filter in JS. */
const existingRes = await fetch(
  `${endpoint}?select=id,title&category=eq.${encodeURIComponent(CATEGORY)}&title=like.Job%20Desk*`,
  { headers }
);
if (!existingRes.ok) {
  console.error(`[jobdesk] GAGAL: tidak bisa membaca judul yang sudah ada. HTTP ${existingRes.status}`);
  process.exit(1);
}
const existing = await existingRes.json();
const taken = new Set(existing.map((r) => r.title));

let picked = null;
let n = 0;
for (let i = 0; i < BANK.length; i += 1) {
  const candidate = compose(BANK[(i + 1) % BANK.length], i);
  if (!taken.has(candidate.title)) {
    picked = candidate;
    n = i;
    break;
  }
}

if (!picked) {
  console.error(
    `[jobdesk] GAGAL: bank topik habis. Semua ${BANK.length} topik sudah dipublikasikan. ` +
      'Tambahkan topik baru ke scripts/publish-jobdesk-rotating.mjs sebelum jadwal berikutnya.'
  );
  process.exit(1);
}

console.log(
  JSON.stringify({
    status: 'selected',
    title: picked.title,
    total_bank: BANK.length,
    already_published: taken.size,
    dry_run: DRY,
  })
);

if (DRY) {
  console.log('[jobdesk] DRY RUN: berhenti sebelum menulis.');
  process.exit(0);
}

/* --------------------- insert + read back --------------------- */
const dup = await fetch(`${endpoint}?select=id&title=eq.${encodeURIComponent(picked.title)}`, { headers });
if (!dup.ok) {
  console.error(`[jobdesk] GAGAL: cek duplikat gagal. HTTP ${dup.status}`);
  process.exit(1);
}
if ((await dup.json()).length) {
  console.log(JSON.stringify({ status: 'already_exists', title: picked.title }));
  process.exit(0);
}

const res = await fetch(endpoint, {
  method: 'POST',
  headers: { ...headers, Prefer: 'return=representation' },
  body: JSON.stringify(picked),
});
const body = await res.json().catch(() => null);
if (!res.ok) {
  console.error(`[jobdesk] GAGAL publish: HTTP ${res.status} ${JSON.stringify(body)}`);
  process.exit(1);
}
const row = body?.[0];

const verify = await fetch(
  `${endpoint}?select=id,title,type,category,location,content&id=eq.${encodeURIComponent(row.id)}`,
  { headers }
);
const saved = (await verify.json())?.[0];

if (
  !saved ||
  saved.title !== picked.title ||
  saved.type !== 'news' ||
  saved.category !== CATEGORY ||
  !saved.content.includes('## Tugas dan Job Desk') ||
  !saved.content.includes('## Skill yang Dibutuhkan')
) {
  console.error(`[jobdesk] GAGAL: read-back assertion tidak lolos untuk ${picked.title}`);
  process.exit(1);
}

console.log(
  JSON.stringify({
    ok: true,
    status: 'published',
    row_id: saved.id,
    title: saved.title,
    location: saved.location,
    url: `/artikel/${slugify(saved.title)}-${saved.id}`,
  })
);
