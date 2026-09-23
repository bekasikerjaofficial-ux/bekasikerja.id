#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const post = {
  type: 'news',
  title: 'Job Desk Quality Control Inspector di Cikarang: Tugas dan Skill',
  category: 'Lifestyle & Tips Karir',
  location: 'Cikarang, Jawa Barat',
  content: [
    '# Job Desk Quality Control Inspector di Cikarang: Tugas dan Skill',
    '',
    'Quality Control (QC) Inspector merupakan salah satu posisi kunci di industri manufaktur dan produksi, terutama di kawasan industri Cikarang. Peran ini memastikan setiap produk, komponen, atau material memenuhi standar kualitas dan keselamatan sebelum dikirim ke pelanggan atau masuk ke tahap produksi berikutnya.',
    '',
    '## Apa Itu Quality Control Inspector?',
    'Quality Control Inspector bertanggung jawab memeriksa, menguji, dan mengukur produk pada berbagai tahap proses produksi. Posisi ini merupakan garda terakhir yang memastikan cacat, penyimpangan, atau ketidaksesuaian terdeteksi sebelum produk meninggalkan fasilitas produksi.',
    '',
    '## Tugas dan Job Desk',
    '- Memeriksa material, komponen, dan produk jadi secara visual atau menggunakan alat ukur sesuai standar yang berlaku.',
    '- Mengukur dimensi, berat, warna, dan karakteristik produk menggunakan alat ukur, gauge, atau alat uji.',
    '- Mencatat hasil inspeksi, jumlah yang lolos atau tidak lolos, dan menyimpannya dalam laporan kualitas.',
    '- Menandai dan memisahkan produk yang tidak sesuai agar tidak diproses lebih lanjut.',
    '- Berkoordinasi dengan tim produksi, maintenance, dan engineering ketika ditemukan penyimpangan berulang.',
    '- Memastikan proses pengujian mengikuti SOP, instruksi kerja, dan standar ISO 9001/14001 jika berlaku.',
    '- Menyiapkan dokumen CoA, SDS, atau bukti uji yang dibutuhkan pelanggan atau auditor.',
    '- Melakukan kalibrasi sederhana atau memastikan alat ukur masih dalam masa berlaku kalibrasi.',
    '- Memantau kondisi area inspeksi agar tetap bersih, rapi, dan sesuai standar keselamatan.',
    '- Melaporkan tren produk tidak sesuai untuk membantu perbaikan proses berkelanjutan.',
    '',
    '## Skill yang Dibutuhkan',
    '- Kemampuan membaca gambar teknik, toleransi dimensi, dan spesifikasi produk.',
    '- Pengalaman menggunakan alat ukur: jangka sorong, mikrometer, gauge, atau alat ukur khusus lainnya.',
    '- Pemahaman dasar SOP, standar ISO, dan prinsip dasar quality management.',
    '- Ketelitian dalam mencatat data dan mengidentifikasi produk di luar spesifikasi.',
    '- Kemampuan mengoperasikan komputer untuk entri data dan laporan.',
    '- Pemahaman dasar statistik dan control chart menjadi nilai tambah.',
    '- Kemampuan komunikasi untuk menyampaikan hasil inskepsi dan temuan kepada tim produksi.',
    '',
    '## Lingkungan Kerja di Cikarang',
    'QC Inspector umumnya bekerja di lantai produksi, area gudang material, atau laboratorium pengujian. Aktivitas dapat melibatkan berdiri dalam waktu lama, mobilitas antar area, dan sistem shift sesuai jadwal produksi. Standar keselamatan dan penggunaan alat pelindung diri wajib dipatuhi.',
    '',
    '## Tips Melamar',
    '- Cantumkan pengalaman melakukan inspeksi material atau produk manufaktur.',
    '- Sebutkan alat ukur yang pernah digunakan dan tingkat keakuratan yang diharapkan.',
    '- Tunjukkan pemahaman tentang SOP dan standar kualitas seperti ISO.',
    '- Sertakan contoh kasus penyimpangan yang berhasil ditindaklanjuti.',
    '- Siapkan sertifikat pelatihan pengukuran, kalibrasi, atau ISO jika ada.',
    '',
  ].join('\\n'),
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
function normalizeUrl(value) { return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''); }
loadEnvFile();
const base = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !key) throw new Error('Konfigurasi Supabase server belum tersedia.');
const endpoint = `${base}/rest/v1/posts`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

const check = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
if (!check.ok) throw new Error(`Gagal cek judul: HTTP ${check.status}`);
const existing = await check.json();
if (existing.length) {
  console.log(JSON.stringify({ status: 'already_exists', row_id: existing[0].id, title: post.title }));
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { ...headers, Prefer: 'return=representation' },
  body: JSON.stringify(post),
});
const body = await response.json().catch(() => null);
if (!response.ok) throw new Error(`Gagal publish ${post.title}: HTTP ${response.status}`);
const row = body?.[0];

const verify = await fetch(`${endpoint}?select=id,title,type,category,location,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
const saved = (await verify.json())?.[0];
if (
  !saved ||
  saved.title !== post.title ||
  saved.type !== 'news' ||
  saved.category !== 'Lifestyle & Tips Karir' ||
  !saved.content.includes('## Tugas dan Job Desk')
) {
  throw new Error(`Read-back assertion gagal untuk ${post.title}`);
}

console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, location: saved.location }));
