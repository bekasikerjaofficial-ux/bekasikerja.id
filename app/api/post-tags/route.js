import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function adminClient() {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  const sb = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await sb.from('post_tags').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!supabaseServiceKey) return NextResponse.json({ error: 'Service role key missing' }, { status: 500 });
  const sb = adminClient();
  const { post_id, tag_ids } = await req.json();
  if (!post_id || !Array.isArray(tag_ids)) return NextResponse.json({ error: 'post_id + tag_ids wajib' }, { status: 400 });
  // Hapus yang lama, insert yang baru
  const { error: delErr } = await sb.from('post_tags').delete().eq('post_id', post_id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  const rows = tag_ids.map((tag_id) => ({ post_id, tag_id }));
  const { data, error } = await sb.from('post_tags').insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
