#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://id.jobstreet.com/id/job/94649876?tracking=SHR-AND-SharedJob-asia-4';
const post = {
  type: 'job',
  title: 'Lowongan Kerja PT ASPIRE GROUP INDONESIA – Senior HR Business Partner',
  company: 'PT.ASPIRE GROUP INDONESIA',
  location: 'Bekasi, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja PT ASPIRE GROUP INDONESIA – Senior HR Business Partner', '',
    'PT.ASPIRE GROUP INDONESIA sedang mencari Senior HR Business Partner untuk mendampingi pimpinan dalam pengelolaan karyawan, kinerja, hubungan kerja, dan risiko organisasi. Posisi full time ini berlokasi di Bekasi, Jawa Barat, dengan cakupan kerja yang dapat melibatkan kantor, warehouse, retail, logistik, maupun lokasi operasional lain.', '',
    '## Gambaran Peran',
    'Senior HR Business Partner akan menjadi penghubung strategis antara fungsi HR dan kepala departemen. Fokusnya bukan hanya administrasi SDM, tetapi juga membantu manajemen mengambil keputusan berbasis data, menjaga hubungan kerja yang sehat, dan meningkatkan kinerja tim.', '',
    '## Kualifikasi Kandidat',
    '- Pendidikan minimal S1 Psikologi, Manajemen SDM, Manajemen, Komunikasi, Hukum, atau bidang terkait.',
    '- Memiliki pengalaman minimal 5 tahun di bidang HR dan sedikitnya 2 tahun sebagai HRBP, Employee Relations, Organization Development, atau Senior HR Generalist.',
    '- Pernah menangani organisasi dengan jumlah karyawan sekitar 100–300 orang.',
    '- Berpengalaman menangani karyawan kantor maupun operasional seperti warehouse, retail, logistik, atau produksi.',
    '- Menguasai penanganan employee relations, konflik, investigasi internal, perbaikan kinerja, dan proses disipliner.',
    '- Memahami KPI, performance review, onboarding, talent review, dan pengembangan karyawan.',
    '- Mampu menganalisis persoalan HR dan menyusun rekomendasi berdasarkan data serta fakta.',
    '- Dapat membuat laporan manajemen yang sistematis dan mudah dipahami.',
    '- Memiliki kemampuan komunikasi, interpersonal, negosiasi, dan pemecahan masalah yang baik.',
    '- Mampu berkomunikasi serta membuat laporan profesional dalam bahasa Indonesia dan bahasa Inggris.',
    '- Pengalaman menggunakan HRIS, dashboard HR, Lark, atau workflow digital menjadi nilai tambah.',
    '- Pengalaman di e-commerce, retail, FMCG, distribusi, logistik, atau perusahaan yang sedang berkembang juga menjadi keunggulan.',
    '- Bersedia melakukan perjalanan dinas ke Jakarta, Surabaya, atau lokasi operasional lain sesuai kebutuhan.', '',
    '## Tanggung Jawab Pekerjaan',
    '- Mendampingi kepala departemen dalam memahami kebutuhan tenaga kerja, kinerja tim, dan potensi risiko people management.',
    '- Menangani keluhan karyawan dan employee relations secara objektif, terukur, dan terdokumentasi.',
    '- Memfasilitasi penyelesaian konflik serta menjalankan investigasi internal berdasarkan fakta dan bukti.',
    '- Membantu supervisor mengelola KPI, memberikan feedback, melakukan coaching, dan menjalankan Performance Improvement Plan bila diperlukan.',
    '- Mengkoordinasikan performance review, talent review, onboarding, evaluasi 30/60/90 hari, dan program pengembangan.',
    '- Mendukung proses promosi, succession planning, serta pengembangan talenta berdasarkan kinerja dan kesiapan.',
    '- Menganalisis turnover, absensi, keluhan, tindakan disipliner, dan isu organisasi pada setiap departemen.',
    '- Menyusun laporan HR dan People Risk Report yang memuat fakta, analisis, risiko, serta rekomendasi untuk manajemen.',
    '- Berkolaborasi dengan HR Manager, Legal & Compliance, dan manajemen dalam menyelesaikan isu ketenagakerjaan.',
    '- Melakukan kunjungan ke kantor, warehouse, dan lokasi operasional sesuai kebutuhan bisnis.', '',
    '## Informasi Lowongan',
    'Posisi ini berstatus full time dan berlokasi di Bekasi, Jawa Barat. Detail proses seleksi, pertanyaan perusahaan, dan persyaratan terbaru dapat berubah mengikuti informasi pada halaman sumber.', '',
    `Cara melamar: ${sourceUrl}`,
    'BekasiKerja.id menyusun ulang informasi ini untuk membantu pencari kerja. Pastikan memeriksa sumber resmi sebelum melamar dan jangan mengirimkan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
  ].join('\\n'),
};

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim(); const i = value.indexOf('=');
    if (i < 1 || value.startsWith('#')) continue;
    const key = value.slice(0, i).trim(); const envValue = value.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = envValue;
  }
}
loadEnvFile();
const base = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) throw new Error('Konfigurasi Supabase server belum tersedia.');
const endpoint = `${base}/rest/v1/posts`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const existingResponse = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
const existing = await existingResponse.json();
if (existing.length) {
  console.log(JSON.stringify({ ok: true, status: 'already_exists', row_id: existing[0].id, title: post.title }));
  process.exit(0);
}
const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
const body = await response.json();
if (!response.ok) throw new Error(`Publish gagal HTTP ${response.status}: ${JSON.stringify(body)}`);
const row = body[0];
const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${row.id}`, { headers });
const verified = await verifyResponse.json();
console.log(JSON.stringify({ ok: true, status: 'published', row_id: row.id, title: row.title, type: row.type, verified_count: verified.length, has_source: verified[0]?.content.includes(sourceUrl), bullet_lists: [verified[0]?.content.includes('- Pendidikan minimal'), verified[0]?.content.includes('- Mendampingi kepala')].filter(Boolean).length }));
