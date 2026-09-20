#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const title = 'Lowongan Kerja Cikarang PT Haier Electrical Appliance Indonesia – Warehouse Supervisor';
const applicationEmail = 'rinto.junaidi@haier.co.id';
const sourceMarker = `Application email: ${applicationEmail}`;
const post = {
  type: 'job',
  title,
  company: 'PT. Haier Electrical Appliance Indonesia',
  location: 'EJIP, Cikarang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    `# ${title}`,
    '',
    'PT. Haier Electrical Appliance Indonesia membuka kesempatan bagi profesional warehouse untuk bergabung sebagai Warehouse Supervisor. Posisi ini ditempatkan di kawasan EJIP, Cikarang, dan berfokus pada pengendalian operasional gudang, akurasi persediaan, serta koordinasi alur material di lingkungan industri.',
    '',
    '## Ringkasan Posisi',
    'Warehouse Supervisor bertanggung jawab memastikan aktivitas penerimaan, penyimpanan, pengendalian, dan pengeluaran material berjalan tertib, efisien, dan sesuai prosedur perusahaan. Peran ini juga memimpin tim gudang serta menjaga kesesuaian antara stok fisik dan catatan sistem.',
    '',
    '## Kualifikasi',
    '- Pendidikan minimal D3 atau S1 Logistik, Supply Chain Management, Teknik Industri, Manajemen, atau bidang terkait.',
    '- Memiliki pengalaman minimal 3 tahun dalam operasional warehouse, terutama di lingkungan manufaktur atau industri.',
    '- Memiliki pengalaman supervisory minimal 1 tahun.',
    '- Memahami proses receiving, storage, material handling, serta pengendalian part inbound dan outbound.',
    '- Menguasai inventory management, warehouse controlling, stock opname, dan stock reconciliation.',
    '- Familiar menggunakan SAP atau Warehouse Management System (WMS).',
    '- Memahami perencanaan kapasitas gudang dan optimalisasi ruang penyimpanan.',
    '- Menguasai Microsoft Excel dan aplikasi perkantoran terkait.',
    '- Kemampuan bahasa Inggris tertulis dan lisan menjadi nilai tambah.',
    '- Memiliki kemampuan kepemimpinan, komunikasi, pemecahan masalah, dan organisasi yang baik.',
    '- Bersedia ditempatkan di EJIP, Cikarang.',
    '',
    '## Tanggung Jawab Utama',
    '- Mengawasi kegiatan warehouse harian, termasuk receiving, penyimpanan, material handling, picking, dan issuing barang.',
    '- Memantau pergerakan part inbound dan outbound serta memastikan pencatatannya akurat.',
    '- Menjaga akurasi persediaan melalui stock opname harian, mingguan, dan bulanan.',
    '- Melakukan rekonsiliasi stok fisik dengan data pada sistem.',
    '- Mengatur kapasitas gudang dan mengoptimalkan pemanfaatan ruang penyimpanan.',
    '- Memimpin personel warehouse melalui pembagian tugas, pemantauan kinerja, dan pengawasan kepatuhan SOP.',
    '- Mengendalikan data inventory melalui SAP atau WMS dengan input yang tepat waktu dan akurat.',
    '- Berkoordinasi dengan Production, Purchasing, dan Logistics untuk memastikan ketersediaan material.',
    '- Mengawasi proses penerimaan material agar diperiksa, dicatat, dan disimpan sesuai prosedur.',
    '- Memastikan aktivitas gudang mematuhi kebijakan perusahaan, standar keselamatan, dan praktik 5S.',
    '- Mengidentifikasi kendala operasional dan mendorong perbaikan efisiensi, produktivitas, serta akurasi inventory.',
    '',
    '## Informasi Lowongan',
    '- Posisi: Warehouse Supervisor',
    '- Perusahaan: PT. Haier Electrical Appliance Indonesia',
    '- Penempatan: EJIP, Cikarang, Jawa Barat',
    '- Cara melamar: kirim CV terbaru melalui email ke `rinto.junaidi@haier.co.id`',
    '- Subjek email: `WH Spv_Name_Domicile`',
    '',
    '## Lamaran',
    `Kirim CV terbaru ke email ${applicationEmail} dengan subjek **WH Spv_Name_Domicile**.`,
    '',
    '## Sumber Informasi',
    'Informasi lowongan ini disusun ulang dari poster rekrutmen PT. Haier Electrical Appliance Indonesia yang diterima BekasiKerja.id. Poster tidak mencantumkan URL sumber eksternal. Periksa kembali detail rekrutmen sebelum mengirimkan data pribadi.',
    sourceMarker,
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
function normalizeUrl(value) { return String(value || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''); }
loadEnvFile();
const base = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !serviceRoleKey) throw new Error('Konfigurasi Supabase server belum tersedia.');
const endpoint = `${base}/rest/v1/posts`;
const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json' };
const existingResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&title=eq.${encodeURIComponent(title)}`, { headers });
if (!existingResponse.ok) throw new Error(`Gagal cek duplikat: HTTP ${existingResponse.status}`);
const existing = await existingResponse.json();
let row; let status;
if (existing.length) {
  row = existing[0];
  const updateResponse = await fetch(`${endpoint}?id=eq.${encodeURIComponent(row.id)}`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(post),
  });
  const updateBody = await updateResponse.json().catch(() => null);
  if (!updateResponse.ok) throw new Error(`Gagal memperbarui posting: HTTP ${updateResponse.status}`);
  row = updateBody?.[0] || row;
  status = 'updated';
} else {
  const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Gagal menerbitkan posting: HTTP ${response.status}`);
  row = body?.[0]; status = 'published';
}
if (!row?.id) throw new Error('ID row tidak tersedia setelah insert/check.');
const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal read-back: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
if (verified.length !== 1) throw new Error(`Read-back tidak tunggal: ${verified.length}`);
const saved = verified[0];
const assertions = {
  title: saved.title === title,
  type: saved.type === 'job',
  category: saved.category === 'Lowongan Kerja',
  company: saved.company === post.company,
  location: saved.location === post.location,
  applicationEmail: saved.content.includes(applicationEmail),
  sourceMarker: saved.content.includes(sourceMarker),
  qualifications: saved.content.includes('## Kualifikasi') && saved.content.includes('- Pendidikan minimal D3'),
  responsibilities: saved.content.includes('## Tanggung Jawab Utama') && saved.content.includes('- Mengawasi kegiatan warehouse harian'),
};
if (Object.values(assertions).some((value) => !value)) throw new Error(`Assertion read-back gagal: ${JSON.stringify(assertions)}`);
console.log(JSON.stringify({ ok: true, status, row_id: saved.id, title: saved.title, company: saved.company, location: saved.location, type: saved.type, category: saved.category, assertions }));
