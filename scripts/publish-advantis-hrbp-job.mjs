#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://id.jobstreet.com/id/job/94637231?tracking=SHR-AND-SharedJob-asia-4';

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

const post = {
  type: 'job',
  title: 'Lowongan Kerja HR Business Partner (HRD & HRM) Assistant Manager – Cikarang',
  company: 'PT Advantis Akaza Indonesia',
  location: 'Cikarang Barat, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja HR Business Partner (HRD & HRM) Assistant Manager – Cikarang', '',
    'PT Advantis Akaza Indonesia membuka kesempatan bagi profesional Human Resources untuk bergabung sebagai HR Business Partner (HRD & HRM) Assistant Manager. Posisi full time ini berlokasi di Cikarang Barat, Jawa Barat, dengan kisaran gaji Rp20.000.000–Rp25.000.000 per bulan sesuai informasi pada sumber lowongan.', '',
    '## Ringkasan Posisi',
    'Posisi ini berperan sebagai mitra HR bagi unit bisnis yang ditugaskan, mencakup rekrutmen, payroll, orientasi karyawan, pengembangan, hubungan kerja, serta pelaporan kondisi HR.', '',
    '## Kualifikasi',
    'Sumber lowongan tidak mencantumkan persyaratan pendidikan atau pengalaman tambahan di luar pertanyaan lamaran yang tersedia.', '',
    '## Tanggung Jawab Utama',
    '- Handle all other areas for the assigned unit',
    '- Ensure new recruites within the assigned SBU are oriented to the organisation',
    '- Prepare reports and presentations on company HR climate by gathering and analyzing relevant data',
    '- Manage the recruitment process',
    '- Ensure all legal requirements are met with regards to subcontracted workers',
    '- Handle monthly payroll calculation',
    '- Manage the PMS of the company in coordination with group HR assigned by giving the relevant awarenes',
    '- Ensure identified training needs of staff in the assigned SBU are addressed by working closely with group HR',
    '- Acts as a point of contact for the employees and managers in the assigned business unit',
    '- Perform additional duties commensurate with the current role, as and when requested by management',
    '- Ensure necessary training for staff are provided by identifying the required training need along with department heads',
    '- Maintain the organisation structures of assigned unit in coordination with group HR by periodicall',
    '- Ensure pre and post recruitment formalities for assigned SBU such as preparation of recruitment related documents', '',
    '## Informasi Lowongan',
    'Perusahaan: PT Advantis Akaza Indonesia. Posisi full time dengan penempatan di Cikarang Barat, Jawa Barat. Kisaran gaji yang tercantum pada sumber adalah Rp20.000.000–Rp25.000.000 per bulan.', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini dari Jobstreet. Periksa detail terbaru pada sumber resmi sebelum melamar dan jangan pernah memberikan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
  ].join('\n'),
};

loadEnvFile();
const supabaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error(JSON.stringify({ ok: false, error: 'Konfigurasi Supabase server belum tersedia.' }));
  process.exit(2);
}

const endpoint = `${supabaseUrl}/rest/v1/posts`;
const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json' };
const existingResponse = await fetch(`${endpoint}?select=id,title&title=eq.${encodeURIComponent(post.title)}`, { headers });
if (!existingResponse.ok) throw new Error(`Gagal memeriksa posting: HTTP ${existingResponse.status}`);
const existing = await existingResponse.json();
if (existing.length) {
  console.log(JSON.stringify({ ok: true, status: 'already_exists', row_id: existing[0].id, title: post.title }));
  process.exit(0);
}

const response = await fetch(endpoint, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(post) });
const body = await response.json().catch(() => null);
if (!response.ok) throw new Error(`Gagal menerbitkan posting: HTTP ${response.status} ${JSON.stringify(body)}`);
const row = body?.[0];
if (!row?.id) throw new Error('Supabase tidak mengembalikan ID posting.');
const verifyResponse = await fetch(`${endpoint}?select=id,title,type,company,location,category,content&id=eq.${encodeURIComponent(row.id)}`, { headers });
if (!verifyResponse.ok) throw new Error(`Gagal memverifikasi posting: HTTP ${verifyResponse.status}`);
const verified = await verifyResponse.json();
const saved = verified?.[0];
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('- Manage the recruitment process')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, company: saved.company, location: saved.location, source_url: sourceUrl }));
