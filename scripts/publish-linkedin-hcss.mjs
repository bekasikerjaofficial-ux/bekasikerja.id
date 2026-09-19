#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://www.linkedin.com/jobs/view/4467184579/';
const post = {
  type: 'job',
  title: 'Lowongan Kerja Graha Trans – HCSS Supervisor',
  company: 'Graha Trans',
  location: 'Cikarang Pusat, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Graha Trans – HCSS Supervisor', '',
    'Graha Trans membuka kesempatan bagi profesional Human Capital yang berpengalaman untuk memimpin operasional Human Capital Shared Services (HCSS) di Cikarang Pusat. Posisi ini berfokus pada payroll, administrasi karyawan, Compensation & Benefit, pelaporan ketenagakerjaan, serta ketepatan data SDM.', '',
    '## Ringkasan Posisi',
    'HCSS Supervisor memastikan proses administrasi human capital berjalan akurat, tepat waktu, aman, dan sesuai kebijakan perusahaan serta aturan ketenagakerjaan yang berlaku. Peran ini juga mengawasi rekonsiliasi data dan koordinasi tim agar tidak ada proses penting yang tertunda.', '',
    '## Kualifikasi',
    '- Berpengalaman menangani payroll, Compensation & Benefit, dan administrasi Human Capital.',
    '- Menguasai HCIS/SunFish dan Microsoft Excel.',
    '- Memiliki kemampuan analisis serta rekonsiliasi data yang kuat.',
    '- Teliti, disiplin, mampu menjaga akurasi, dan terbiasa bekerja dengan target waktu.',
    '- Mampu berkomunikasi dan berkoordinasi dengan baik bersama tim maupun departemen terkait.',
    '- Memahami kebijakan Human Capital dan peraturan ketenagakerjaan yang relevan.',
    '- Familiar dengan pelaporan BPJSTK, BPJS Kesehatan, WLKP/WLTK, Disnaker, dan JSHK.',
    '- Mampu menjaga kerahasiaan data karyawan, khususnya data payroll dan benefit.',
    '- Bersedia ditempatkan di Cikarang.', '',
    '## Tanggung Jawab Utama',
    '- Memelihara dan memperbarui data karyawan serta memastikan dokumen administrasi tetap lengkap dan akurat.',
    '- Memeriksa data kehadiran, cuti, sakit, dan lembur melalui sistem HCIS/SunFish.',
    '- Menindaklanjuti perbedaan data kehadiran atau lembur yang dapat memengaruhi payroll.',
    '- Menyiapkan dan memvalidasi payroll, termasuk gaji, tunjangan, potongan, lembur, dan komponen pendapatan lainnya.',
    '- Melakukan rekonsiliasi antara HCIS, payroll, kehadiran, dan catatan pendukung.',
    '- Mengelola administrasi Compensation & Benefit, termasuk tunjangan, reimbursement, BPJSTK, dan BPJS Kesehatan.',
    '- Menyiapkan laporan wajib ketenagakerjaan dan memastikan dokumen dikirim sesuai jadwal.',
    '- Menganalisis data payroll, kehadiran, karyawan, dan benefit untuk menemukan ketidaksesuaian atau risiko.',
    '- Membuat laporan operasional dan menyampaikan isu penting kepada Manager.',
    '- Mengkoordinasikan pekerjaan tim serta mendorong perbaikan proses administrasi Human Capital.', '',
    '## Informasi Lowongan',
    'Posisi ini berstatus full time dan berlokasi di Cikarang Pusat, Jawa Barat. Periksa kembali detail proses seleksi dan persyaratan terbaru pada sumber resmi sebelum melamar.', '',
    `Cara melamar: ${sourceUrl}`,
    'BekasiKerja.id menyusun ulang informasi ini untuk membantu pencari kerja. Jangan mengirimkan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
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
console.log(JSON.stringify({ ok: true, status: 'published', row_id: row.id, title: row.title, type: row.type, verified_count: verified.length, has_source: verified[0]?.content.includes(sourceUrl), bullet_lists: [verified[0]?.content.includes('- Berpengalaman'), verified[0]?.content.includes('- Memelihara')].filter(Boolean).length }));
