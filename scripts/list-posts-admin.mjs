#!/usr/bin/env node
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = rawUrl?.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
if (!baseUrl || !serviceKey) throw new Error('Supabase production secrets belum lengkap.');
const response = await fetch(`${baseUrl}/rest/v1/posts?select=id,title,type,created_at&order=id.asc`, {
  headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
});
const body = await response.json();
if (!response.ok) throw new Error(`Supabase HTTP ${response.status}: ${JSON.stringify(body)}`);
console.log(JSON.stringify({ count: body.length, posts: body }, null, 2));
