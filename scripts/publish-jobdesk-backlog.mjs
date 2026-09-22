#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const posts = [
  {
    type: 'news',
    title: 'Job Desk Production Leader di Cikarang: Tugas dan Skill',
    category: 'Lifestyle & Tips Karir',
    location: 'Cikarang, Jawa Barat',
    content: [
      '# Job Desk Production Leader di Cikarang: Tugas dan Skill', '',
      'Production Leader merupakan salah satu posisi penting di kawasan industri Cikarang. Peran ini membantu memastikan kegiatan produksi berjalan sesuai target, standar kualitas, jadwal, dan aturan keselamatan kerja.', '',
      '## Apa Itu Production Leader?',
      'Production Leader memimpin aktivitas operator atau anggota tim produksi pada area kerja tertentu. Posisi ini menjadi penghubung antara supervisor, tim produksi, dan departemen terkait ketika target atau proses kerja perlu disesuaikan.', '',
      '## Tugas dan Job Desk',
      '- Menyusun atau menjalankan pembagian tugas dan urutan pekerjaan sesuai jadwal produksi.',
      '- Memantau proses produksi agar memenuhi target output, kualitas, dan waktu yang ditetapkan.',
      '- Memastikan operator mengikuti SOP, instruksi kerja, dan standar keselamatan.',
      '- Memeriksa kondisi proses, material, peralatan, dan hasil kerja untuk menemukan masalah lebih awal.',
      '- Berkoordinasi dengan supervisor dan departemen lain ketika terjadi kendala produksi.',
      '- Mencatat hasil produksi, kehadiran, kendala, dan informasi operasional yang diperlukan.',
      '- Membantu pelatihan anggota tim mengenai prosedur kerja dan keselamatan.',
      '- Mendorong perbaikan proses untuk mengurangi kesalahan, downtime, dan pemborosan.', '',
      '## Skill yang Dibutuhkan',
      '- Kepemimpinan dan kemampuan mengatur tim.',
      '- Pemahaman alur produksi dan SOP manufaktur.',
      '- Kemampuan membaca jadwal, instruksi kerja, dan laporan produksi.',
      '- Komunikasi lintas departemen yang jelas.',
      '- Problem solving dan pengambilan keputusan operasional.',
      '- Ketelitian dalam memantau kualitas, output, dan keselamatan.',
      '- Kemampuan menggunakan komputer dan sistem pencatatan produksi menjadi nilai tambah.', '',
      '## Lingkungan Kerja di Cikarang',
      'Production Leader umumnya bekerja dekat dengan lini produksi dan perlu berkoordinasi dengan operator, quality, maintenance, warehouse, serta supervisor. Sistem shift dan target harian dapat berlaku sesuai kebijakan perusahaan.', '',
      '## Tips Melamar',
      '- Tunjukkan pengalaman memimpin tim atau mengatur pekerjaan produksi.',
      '- Jelaskan pengalaman menjalankan SOP, quality control, dan keselamatan kerja.',
      '- Siapkan contoh masalah produksi yang pernah diselesaikan.',
      '- Cantumkan pengalaman menggunakan sistem produksi atau laporan operasional jika ada.', '',

    ].join('\\n'),
  },
  {
    type: 'news',
    title: 'Job Desk Warehouse Supervisor di Cikarang: Tugas dan Skill',
    category: 'Lifestyle & Tips Karir',
    location: 'Cikarang, Jawa Barat',
    content: [
      '# Job Desk Warehouse Supervisor di Cikarang: Tugas dan Skill', '',
      'Warehouse Supervisor berperan penting dalam menjaga alur penerimaan, penyimpanan, dan pengeluaran barang di kawasan industri Cikarang. Posisi ini menggabungkan pengawasan tim, pengendalian inventory, dan kepatuhan terhadap prosedur keselamatan gudang.', '',
      '## Apa Itu Warehouse Supervisor?',
      'Warehouse Supervisor memimpin kegiatan operasional gudang dan memastikan barang bergerak sesuai jadwal serta tercatat secara akurat. Posisi ini biasanya berkoordinasi dengan purchasing, produksi, logistics, dan tim administrasi.', '',
      '## Tugas dan Job Desk',
      '- Mengawasi proses receiving, penyimpanan, picking, packing, dan dispatch barang.',
      '- Membagi tugas harian kepada anggota tim warehouse sesuai kebutuhan operasional.',
      '- Memantau akurasi stok, transaksi inventory, dan hasil stock opname atau cycle count.',
      '- Memeriksa kondisi barang yang masuk dan menindaklanjuti perbedaan jumlah atau kualitas.',
      '- Menjaga penataan lokasi penyimpanan agar kapasitas gudang digunakan secara efisien.',
      '- Memastikan penggunaan SAP, WMS, atau sistem inventory dilakukan secara tepat dan konsisten.',
      '- Mengawasi penerapan SOP, keselamatan kerja, 5S, dan penggunaan alat material handling.',
      '- Berkoordinasi dengan produksi, purchasing, dan logistics untuk menjaga ketersediaan material.',
      '- Membuat laporan operasional dan menyampaikan kendala inventory kepada atasan.',
      '- Mengidentifikasi peluang perbaikan untuk meningkatkan akurasi dan produktivitas gudang.', '',
      '## Skill dan Kualifikasi Umum',
      '- Pemahaman warehouse operation, inventory control, dan alur inbound-outbound.',
      '- Kemampuan memimpin, membagi tugas, dan memantau kinerja tim.',
      '- Pengalaman menggunakan WMS, SAP, atau sistem inventory menjadi nilai tambah.',
      '- Kemampuan Microsoft Excel untuk pencatatan dan analisis data.',
      '- Ketelitian dalam stock opname dan rekonsiliasi data.',
      '- Kemampuan komunikasi dan koordinasi lintas departemen.',
      '- Pemahaman dasar keselamatan gudang dan praktik 5S.', '',
      '## Lingkungan Kerja di Cikarang',
      'Warehouse Supervisor dapat bekerja di pabrik, distribution center, atau gudang kawasan industri. Aktivitas kerja dapat melibatkan mobilitas di area gudang, pengawasan shift, dan koordinasi cepat ketika terjadi perbedaan stok atau keterlambatan material.', '',
      '## Tips Melamar',
      '- Jelaskan pengalaman memimpin operasional gudang dan jumlah anggota tim yang pernah diawasi.',
      '- Cantumkan pengalaman SAP/WMS, stock opname, dan inventory reconciliation.',
      '- Tunjukkan pemahaman tentang keselamatan, 5S, dan pengendalian material.',
      '- Gunakan contoh pencapaian yang terukur tanpa mengarang angka.', '',

    ].join('\\n'),
  },
];

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
const results = [];
for (const post of posts) {
  const check = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
  if (!check.ok) throw new Error(`Gagal cek judul: HTTP ${check.status}`);
  const existing = await check.json();
  if (existing.length) { results.push({ status: 'already_exists', row_id: existing[0].id, title: post.title }); continue; }
  const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Gagal publish ${post.title}: HTTP ${response.status}`);
  const row = body?.[0];
  const verify = await fetch(`${endpoint}?select=id,title,type,category,location,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
  const saved = (await verify.json())?.[0];
  if (!saved || saved.title !== post.title || saved.type !== 'news' || saved.category !== 'Lifestyle & Tips Karir' || !saved.content.includes('## Tugas dan Job Desk')) throw new Error(`Read-back assertion gagal untuk ${post.title}`);
  results.push({ status: 'published', row_id: saved.id, title: saved.title, location: saved.location });
}
console.log(JSON.stringify({ ok: true, count: results.length, results }));
