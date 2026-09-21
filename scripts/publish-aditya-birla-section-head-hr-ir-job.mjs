#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceUrl = 'https://www.linkedin.com/jobs/view/4439061116/';

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
  title: 'Lowongan Kerja Section Head HR IR Aditya Birla Yarn – Karawang',
  company: 'Aditya Birla Yarn',
  location: 'West Karawang, Jawa Barat',
  category: 'Lowongan Kerja',
  deadline: null,
  image_url: null,
  content: [
    '# Lowongan Kerja Section Head HR IR Aditya Birla Yarn – Karawang', '',
    'Aditya Birla Yarn membuka kesempatan bagi profesional Human Resources untuk mengisi posisi Section Head HR IR di West Karawang, Jawa Barat. Posisi full-time ini menangani operasional HR, hubungan industrial, kepatuhan, dan audit ketenagakerjaan.', '',
    '## Ringkasan Posisi',
    'Section Head HR IR bertanggung jawab mengelola fungsi Human Resources dan Industrial Relations, termasuk operasional HR, hubungan dengan serikat pekerja, kepatuhan hukum ketenagakerjaan, serta koordinasi dengan pemangku kepentingan internal dan eksternal.', '',
    '## Kualifikasi',
    '- Fluent in English both written & spoken',
    '- At least 10 years of working experience is the same field; preferable from manufacturing',
    '- Candidate must possess at least Bachelor\'s Degree in any major or background',
    '- Ability to manage multiple stakeholders – internal and external.',
    '- Required language(s): English',
    '- Proficiency in MS Office and HRIS tools.',
    '- Excellent interpersonal and communication skills.',
    '- Conflict resolution and negotiation skills.',
    '- Strong knowledge of labor laws and statutory compliance.', '',
    '## Tanggung Jawab Utama',
    '- Prepare for labor audits and respond to notices and inspections.',
    '- Handle day-to-day IR matters including discipline, grievance redressal, and employee relations.',
    '- Support in HRMIS data management and HR analytics reporting.',
    '- Implement best practices in compliance and keep updated with changes in labor legislation.',
    '- Manage end-to-end HR operations, including recruitment, onboarding, payroll coordination, and exit formalities.',
    '- Maintain statutory records and liaison with labor departments, legal advisors, and external stakeholders.',
    '- Drive employee engagement initiatives, training & development programs, and performance management cycles.',
    '- Ensure compliance with all applicable labor laws (Factories Act, ID Act, Payment of Wages Act, etc.).',
    '- Liaise with union representatives and participate in collective bargaining, negotiations, and settlement discussions.',
    '- Implement and monitor HR policies and ensure alignment with labor laws.', '',
    '## Informasi Lowongan',
    'Perusahaan: Aditya Birla Yarn. Posisi full-time dengan penempatan di West Karawang, Jawa Barat. Tingkat posisi: Mid-Senior level. Industri: Textile Manufacturing.', '',
    'Kirimkan lamaran ke: ridha.hayat@adityabirla.com', '',
    `Sumber lowongan: ${sourceUrl}`,
    'BekasiKerja.id menulis ulang informasi ini berdasarkan lowongan LinkedIn. Periksa kembali detail terbaru pada sumber resmi sebelum melamar dan jangan pernah memberikan data bank atau kartu kredit kepada pihak yang tidak terverifikasi.',
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
if (verified.length !== 1 || saved.title !== post.title || saved.type !== 'job' || saved.category !== 'Lowongan Kerja' || saved.company !== post.company || saved.location !== post.location || !String(saved.content).includes(sourceUrl) || !String(saved.content).includes('ridha.hayat@adityabirla.com')) {
  throw new Error('Verifikasi read-back posting gagal.');
}
console.log(JSON.stringify({ ok: true, status: 'published', row_id: saved.id, title: saved.title, type: saved.type, category: saved.category, company: saved.company, location: saved.location, source_url: sourceUrl }));
