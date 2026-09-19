#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const landmarks = {
  Aceh: 'Masjid Raya Baiturrahman',
  'Sumatera Utara': 'Danau Toba',
  'Sumatera Barat': 'Jam Gadang',
  Riau: 'Istana Siak',
  Jambi: 'Candi Muaro Jambi',
  'Sumatera Selatan': 'Jembatan Ampera',
  Bengkulu: 'Benteng Marlborough',
  Lampung: 'Menara Siger',
  'Kep. Bangka Belitung': 'Pantai Tanjung Tinggi',
  'Kepulauan Riau': 'Jembatan Barelang',
  'DKI Jakarta': 'Monas',
  'Jawa Barat': 'Gedung Sate',
  'Jawa Tengah': 'Candi Borobudur',
  'DI Yogyakarta': 'Tugu Yogyakarta',
  'Jawa Timur': 'Jembatan Suramadu',
  Banten: 'Masjid Agung Banten',
  Bali: 'Pura Ulun Danu Beratan',
  'Nusa Tenggara Barat': 'Gunung Rinjani',
  'Nusa Tenggara Timur': 'Komodo dan Pulau Padar',
  'Kalimantan Barat': 'Tugu Khatulistiwa',
  'Kalimantan Tengah': 'Jembatan Kahayan',
  'Kalimantan Selatan': 'Pasar Terapung',
  'Kalimantan Timur': 'IKN dan Istana Garuda',
  'Kalimantan Utara': 'Taman Nasional Kayan Mentarang',
  'Sulawesi Utara': 'Bunaken',
  'Sulawesi Tengah': 'Jembatan Palu',
  'Sulawesi Selatan': 'Rumah Tongkonan',
  'Sulawesi Tenggara': 'Benteng Keraton Buton',
  Gorontalo: 'Menara Limboto',
  'Sulawesi Barat': 'Pantai Manakarra',
  Maluku: 'Jembatan Merah Putih Ambon',
  'Maluku Utara': 'Gunung Gamalama',
  'Papua Barat': 'Raja Ampat',
  Papua: 'Pegunungan Jayawijaya',
  'Papua Tengah': 'Danau Paniai',
  'Papua Pegunungan': 'Lembah Baliem',
  'Papua Selatan': 'Taman Nasional Wasur',
  'Papua Barat Daya': 'Raja Ampat',
};

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim();
    if (!value || value.startsWith('#')) continue;
    const i = value.indexOf('=');
    if (i < 1) continue;
    const key = value.slice(0, i).trim();
    const envValue = value.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = envValue;
  }
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function makeSvg(province, landmark) {
  const safeProvince = esc(province);
  const safeLandmark = esc(landmark);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
<title id="title">UMP 2026 ${safeProvince}</title><desc id="desc">Ilustrasi landmark ${safeLandmark}</desc>
<defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#062b55"/><stop offset="1" stop-color="#008d9a"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4b44d"/><stop offset="1" stop-color="#e87843"/></linearGradient></defs>
<rect width="1200" height="675" fill="url(#sky)"/><circle cx="1000" cy="130" r="82" fill="#ffd77a" opacity=".85"/><path d="M0 470 170 315 300 430 490 235 650 420 830 270 1200 500V675H0Z" fill="#123f63" opacity=".9"/><path d="M0 535Q260 455 500 535T1200 510V675H0Z" fill="url(#ground)"/>
<g fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".92"><path d="M310 505V385h55v120M278 385h120M330 315v70M305 345h50"/><path d="M550 520V410h100v110M535 410h130M570 365h60v45M585 330h30v35"/><path d="M785 520V390h80v130M770 390h110M805 350h40v40"/></g>
<text x="64" y="90" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700">BEKASIKERJA.ID</text><text x="64" y="585" fill="#fff" font-family="Arial,sans-serif" font-size="42" font-weight="800">UMP 2026 — ${safeProvince}</text><text x="66" y="625" fill="#fff" font-family="Arial,sans-serif" font-size="25" opacity=".9">Landmark: ${safeLandmark}</text>
</svg>`;
}

loadEnvFile();
const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !key) throw new Error('Konfigurasi Supabase server belum tersedia.');
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const postsUrl = `${supabaseUrl}/rest/v1/posts`;
const storageUrl = `${supabaseUrl}/storage/v1/object/images`;
const postsResponse = await fetch(`${postsUrl}?select=id,title,location,image_url&type=eq.news&title=like.*UMP*2026*&order=id.asc`, { headers });
const posts = await postsResponse.json();
if (!postsResponse.ok) throw new Error(`Gagal membaca posting: HTTP ${postsResponse.status}`);
const results = [];
for (const post of posts) {
  const province = post.location || post.title.match(/^UMP (.+?) 2026:/)?.[1];
  const landmark = landmarks[province];
  if (!province || !landmark) { results.push({ id: post.id, status: 'skipped', reason: 'landmark tidak ditemukan' }); continue; }
  const slug = province.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const objectPath = `ump-2026/${slug}.svg`;
  const svg = makeSvg(province, landmark);
  const upload = await fetch(`${storageUrl}/${objectPath}`, { method: 'POST', headers: { ...headers, 'Content-Type': 'image/svg+xml', 'x-upsert': 'true' }, body: svg });
  if (!upload.ok) throw new Error(`Upload gagal untuk ${province}: HTTP ${upload.status}`);
  const imageUrl = `${storageUrl}/public/${objectPath}`;
  const update = await fetch(`${postsUrl}?id=eq.${post.id}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify({ image_url: imageUrl }) });
  if (!update.ok) throw new Error(`Update gagal untuk ${province}: HTTP ${update.status}`);
  results.push({ id: post.id, province, landmark, image_url: imageUrl, status: 'updated' });
}
const verify = await fetch(`${postsUrl}?select=id,title,image_url&title=like.*UMP*2026*&order=id.asc`, { headers });
const verified = await verify.json();
console.log(JSON.stringify({ ok: true, count: results.length, updated: results.filter((x) => x.status === 'updated').length, results, readback: verified.map((x) => ({ id: x.id, title: x.title, has_image: Boolean(x.image_url) })) }));
