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
 * Topic bank. One entry = one publishable job-desk explainer.
 * `city` must be Bekasi, Cikarang, or Karawang (hard rule).
 * ------------------------------------------------------------------ */
const BANK = [
  {
    role: 'Operator Produksi',
    city: 'Cikarang',
    intro:
      'Operator Produksi bekerja langsung di lantai manufaktur untuk mengubah bahan baku menjadi produk jadi dengan mesin dan prosedur kerja yang sudah ditentukan. Posisi ini termasuk job desk yang paling banyak-lowongan di kawasan industri Cikarang.',
    tugas: [
      'Mengoperasikan mesin produksi sesuai jadwal, target, dan prosedur kerja yang berlaku.',
      'Memastikan jumlah, jenis, dan kondisi produk yang dihasilkan sesuai standar.',
      'Melakukan pemeriksaan ringan pada mesin dan melaporkan kerusakan sejak awal.',
      'Mencatat hasil produksi, waktu berhenti mesin, dan pemakaian material setiap shift.',
      'Menjaga kebersihan area kerja serta kebersihan alat ukur yang digunakan.',
      'Berkoordinasi dengan operator lain saat pergantian shift.',
    ],
    skill: [
      'Konsisten mengikuti prosedur kerja dan standar keselamatan kerja.',
      'Terbiasa bekerja dengan sistem shift, termasuk shift malam.',
      'Mampu membaca instruksi kerja sederhana dan diagram alur proses.',
      'Teliti dalam penghitungan dan pencatatan hasil produksi.',
      'Mampu bekerja dalam tim di bawah tekanan target harian.',
      'Mampu berdiri lama dan bergerak aktif selama satu shift kerja.',
    ],
    lingkungan:
      'Area produksi umumnya bising, berdebu, dan sesekali lembap. Lokasi kerja berada di dalam kawasan industri dengan jalur menuju fasilitas umum yang perlu ditempuh berjalan kaki. Alat pelindung diri seperti sepatu safety, helm, dan pelindung telinga wajib dipakai selama shift.',
    tips: [
      'Sebutkan pengalaman kerja di lini produksi dan jenis mesin yang pernah dipakai.',
      'Jelaskan sistem shift yang pernah ditangani beserta jam kerjanya.',
      'Tunjukkan pemahaman prosedur kerja dan K3 meskipun pengalaman belum lama.',
      'Cantumkan kondisi fisik yang relevan karena pekerjaan melibatkan berdiri lama.',
    ],
  },
  {
    role: 'Operator Packaging',
    city: 'Bekasi',
    intro:
      'Operator Packaging menjadi tahap terakhir sebelum produk dikirim ke pelanggan. Posisi ini memastikan produk dikemas, diberi label, dan disegel dengan benar sesuai standar yang berlaku.',
    tugas: [
      'Mengemas produk sesuai ukuran, berat, dan format yang telah ditentukan.',
      'Memastikan label, tanggal produksi, nomor batch, dan kode produk tercetak dan terbaca.',
      'Menghitung ulang hasil pengemasan pada setiap akhir batch.',
      'Membersihkan mesin pengemas dan area kerja sebelum pergantian shift.',
      'Melaporkan kekurangan atau kerusakan bahan kemasan kepada supervisor.',
      'Menysusun kemasan produk jadi di lokasi penyimpanan yang ditentukan.',
    ],
    skill: [
      'Teliti pada detail label dan hasil pencetakan.',
      'Terbiasa bekerja dengan mesin pengemas semi-otomatis.',
      'Mampu melakukan penghitungan fisik dengan akurat.',
      'Memahami prosedur FIFO pada bahan kemasan.',
      'Bekerja cepat namun tetap teliti mengikuti ritme produksi.',
      'Mampu bekerja dengan sistem shift tanpa kehilangan ketelitian.',
    ],
    lingkungan:
      'Lokasi kerja umumnya berada di area dalam ruangan dengan ventilasi yang baik. Pekerjaan berdiri dengan perpindahan posisi minimal, tetapi lantai yang licin dan penggunaan mesin pemotong memerlukan kewaspadaan ekstra.',
    tips: [
      'Sebutkan pengalaman mengemas produk dan jenis kemasan yang pernah ditangani.',
      'Telaskan kemampuan mengikuti ritme kerja produksi yang cepat dan konsisten.',
      'Tunjukkan ketelitian pada pencetakan label dan tanggal produksi.',
      'Jelaskan ketersediaan untuk bekerja sistem shift.',
    ],
  },
  {
    role: 'Staff Gudang dan Logistik',
    city: 'Karawang',
    intro:
      'Staff gudang dan logistik menjadi tulang punggung perpindahan barang dari pabrik ke distributor maupun pelanggan akhir di wilayah Bekasi, Cikarang, dan Karawang. Banyak lowongan di Karawang berada di kawasan pergudangan seperti Cikarang dan surrounding sentra industri.',
    tugas: [
      'Menerima, memeriksa, dan mencatat barang masuk sesuai dokumen pengiriman.',
      'Menyusun dan menata stok berdasarkan lokasi rak yang telah ditentukan.',
      'Menerbitkan surat jalan dan mencatat barang keluar.',
      'Memastikan keakuratan stok fisik dengan pemeriksaan berkala.',
      'Mencatat kondisi barang yang rusak atau tidak sesuai saat diterima.',
      'Membantu proses picking dan packing untuk pesanan pelanggan.',
    ],
    skill: [
      'Memahami alur barang masuk, penyimpanan, dan barang keluar.',
      'Mampu mengoperasikan scanner atau sistem pencatatan stok.',
      'Teliti dan konsisten dalam melakukan pencatatan barang.',
      'Mampu bekerja dengan sistem shift dan target harian.',
      'Terbiasa menggunakan alat berat seperti hand pallet truck.',
      'Memahami aturan FIFO pada penyimpanan barang.',
    ],
    lingkungan:
      'Pekerjaan berada di dalam gudang dengan lantai yang dapat licin, area yang bising, dan penggunaan alat berat yang membebani tulang belakang. Sebagian pekerjaan dapat memerlukan menaiki tangga atau pemindahan bobot secara manual.',
    tips: [
      'Sebutkan pengalaman sebagai operator gudang, checker, atau helper logistik.',
      'Tunjukkan kemampuan menghitung dan mencocokkan data barang.',
      'Jelaskan pengalaman menggunakan hand pallet truck atau alat berat lain.',
      'Sebutkan ketersediaan untuk bekerja sistem shift.',
    ],
  },
];

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
      topic.intro,
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
      topic.lingkungan,
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
