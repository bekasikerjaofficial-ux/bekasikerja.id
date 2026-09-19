#!/usr/bin/env node

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = rawUrl?.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const ids = (process.env.EXAMPLE_POST_IDS || '').split(',').map((value) => value.trim()).filter(Boolean);

if (!baseUrl || !serviceKey) {
  console.error(JSON.stringify({ ok: false, error: 'Supabase production URL dan service-role key wajib tersedia.' }));
  process.exit(2);
}
if (ids.length !== 7 || ids.some((id) => !/^\d+$/.test(id))) {
  console.error(JSON.stringify({ ok: false, error: 'Isi EXAMPLE_POST_IDS dengan tepat 7 ID numerik posting contoh.' }));
  process.exit(2);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};
const filter = ids.join(',');
const response = await fetch(`${baseUrl}/rest/v1/posts?select=id,title,type&id=in.(${filter})&order=id.asc`, { headers });
const rows = await response.json();
if (!response.ok) throw new Error(`Supabase HTTP ${response.status}: ${JSON.stringify(rows)}`);
if (!Array.isArray(rows) || rows.length !== 7) {
  throw new Error(`Penghapusan dibatalkan: hanya ditemukan ${Array.isArray(rows) ? rows.length : 'data tidak valid'} dari 7 ID yang diminta.`);
}

console.log(JSON.stringify({ ok: true, action: 'deleting_explicit_example_posts', posts: rows }));
const deletion = await fetch(`${baseUrl}/rest/v1/posts?id=in.(${filter})`, {
  method: 'DELETE', headers: { ...headers, Prefer: 'return=representation' },
});
const deleted = await deletion.json();
if (!deletion.ok) throw new Error(`Supabase HTTP ${deletion.status}: ${JSON.stringify(deleted)}`);
console.log(JSON.stringify({ ok: true, deleted_count: Array.isArray(deleted) ? deleted.length : 0, deleted_ids: rows.map((row) => row.id) }));
