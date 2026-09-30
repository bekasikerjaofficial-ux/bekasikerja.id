#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://www.linkedin.com/jobs/view/4460214543/';
const title = 'Lowongan Kerja Menarini Indria Laboratories – Human Resources Business Partner';
const post = {
  type: 'job',
  title,
  company: 'Menarini Indria Laboratories',
  location: 'Cikarang Pusat, Jawa Barat, Indonesia',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    `# ${title}`,
    '',
    'Menarini Indria Laboratories membuka kesempatan bagi profesional Human Resources untuk menjadi mitra strategis pimpinan plant di Cikarang. Posisi ini berperan dalam menyelaraskan strategi SDM, menjaga kepatuhan operasional, mengembangkan kapabilitas karyawan, dan membangun budaya kerja berkinerja tinggi.',
    '',
    '## Ringkasan Posisi',
    'Human Resources Business Partner – Plant bertindak sebagai penasihat bagi pimpinan plant sekaligus mengelola operasional HR di lokasi kerja. Peran ini meliputi perencanaan tenaga kerja, pengembangan talenta, layanan HR, hubungan karyawan, serta dukungan General Affairs dan keselamatan kerja.',
    '',
    '## Kualifikasi',
    '- Minimal lulusan S1 Human Resources, Psikologi, Administrasi Bisnis, Hukum, Teknik Industri, atau bidang terkait.',
    '- Memiliki pengalaman HR progresif selama 8–10 tahun, termasuk 3–5 tahun pada posisi manajerial di lingkungan manufaktur atau plant; pengalaman di industri farmasi, FMCG, atau kimia menjadi nilai tambah.',
    '- Berpengalaman dalam Organization Development, perencanaan dan penganggaran tenaga kerja, hubungan karyawan, Compensation & Benefits, Performance & Talent Management, HRIS, HSE, serta operasional HR.',
    '- Memahami hukum ketenagakerjaan Indonesia dan kepatuhan HR.',
    '- Mampu memimpin serta membangun keterlibatan dengan stakeholder di berbagai jenjang organisasi.',
    '- Memiliki kemampuan komunikasi, analisis, dan pemecahan masalah yang kuat.',
    '- Pengalaman di organisasi regional atau multinasional sangat diutamakan.',
    '- Fasih berbahasa Indonesia dan Inggris, secara lisan maupun tulisan.',
    '',
    '## Tanggung Jawab Utama',
    '- Menyelaraskan strategi SDM dengan target produktivitas, kapasitas operasional, dan tujuan jangka panjang Tech Ops bersama pimpinan plant.',
    '- Menilai struktur organisasi serta kebutuhan tenaga kerja untuk mendukung efisiensi operasional dan kebutuhan produksi.',
    '- Memberikan konsultasi kepada manajer terkait perencanaan tenaga kerja, kinerja, kompensasi, pengembangan kapabilitas, dan kepatuhan hukum.',
    '- Menganalisis rencana produksi dan jadwal kerja untuk menetapkan kebutuhan jumlah karyawan serta mengelola anggaran tenaga kerja tahunan.',
    '- Menyusun laporan jumlah karyawan dan KPI tenaga kerja, serta memberi masukan tentang penjadwalan shift dan penempatan sumber daya.',
    '- Menjalankan tinjauan talenta, succession planning, orientasi karyawan baru, strategi rekrutmen, dan evaluasi usulan gaji kandidat.',
    '- Berkolaborasi dalam pengelolaan kinerja, kompensasi, benefit, payroll, pelatihan soft skills, kepemimpinan, nilai perusahaan, dan Code of Conduct.',
    '- Mengawasi operasional HR harian, termasuk pencatatan waktu, masukan payroll, dan cuti, sesuai hukum ketenagakerjaan serta standar industri seperti GMP.',
    '- Memastikan kebijakan HR dan SOP diperbarui serta selaras dengan peraturan yang berlaku dan sertifikasi ISO, sekaligus mendorong perbaikan proses layanan HR.',
    '- Menangani investigasi, keluhan, hubungan dengan dewan karyawan atau serikat pekerja, serta mendukung General Affairs, EHS, dan program engagement karyawan.',
    '',
    '## Informasi Lowongan',
    'Jabatan: HR Business Partner – Plant. Tipe peran: People Manager. Lokasi kerja: Cikarang. Posisi ini melapor langsung kepada HR Director dan secara dotted line kepada Plant Director. Status pekerjaan yang tercantum di sumber adalah full-time.',
    '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini berdasarkan detail yang terlihat pada sumber. Periksa kembali halaman sumber resmi untuk proses lamaran dan informasi terbaru sebelum mengirimkan data pribadi.',
  ].join('\n'),
};

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

loadEnvFile();
const base = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !serviceRoleKey) throw new Error('Konfigurasi Supabase server belum tersedia.');

const endpoint = `${base}/rest/v1/posts`;
const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
};

const byTitleResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&title=eq.${encodeURIComponent(title)}`, { headers });
if (!byTitleResponse.ok) throw new Error(`Gagal memeriksa judul: HTTP ${byTitleResponse.status}`);
let matches = await byTitleResponse.json();
const bySourceResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&content=like.*${encodeURIComponent(sourceUrl)}*`, { headers });
if (!bySourceResponse.ok) throw new Error(`Gagal memeriksa sumber: HTTP ${bySourceResponse.status}`);
const sourceMatches = await bySourceResponse.json();
for (const row of sourceMatches) if (!matches.some((match) => match.id === row.id)) matches.push(row);

let row;
let status;
if (matches.length) {
  row = matches[0];
  status = 'already_exists';
} else {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(post),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Gagal menerbitkan posting: HTTP ${response.status}`);
  row = body?.[0];
  status = 'published';
}
if (!row?.id) throw new Error('ID row tidak tersedia setelah pemeriksaan/insert.');

const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal read-back row: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
if (verified.length !== 1) throw new Error(`Read-back row tidak tunggal: ${verified.length}`);
const saved = verified[0];
const assertions = {
  type: saved.type === 'job',
  category: saved.category === 'Lowongan Kerja',
  title: saved.title === title,
  company: saved.company === post.company,
  location: saved.location === post.location,
  source: saved.content.includes(sourceUrl),
  qualifications: saved.content.includes('## Kualifikasi') && saved.content.includes('- Minimal lulusan'),
  responsibilities: saved.content.includes('## Tanggung Jawab Utama') && saved.content.includes('- Menyelaraskan strategi SDM'),
};
if (Object.values(assertions).some((value) => !value)) throw new Error(`Read-back assertion gagal: ${JSON.stringify(assertions)}`);
console.log(JSON.stringify({ ok: true, status, row_id: saved.id, title: saved.title, company: saved.company, location: saved.location, type: saved.type, category: saved.category, assertions }));
