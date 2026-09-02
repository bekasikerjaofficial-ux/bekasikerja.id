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
  const { data, error } = await sb.from('categories').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!supabaseServiceKey) return NextResponse.json({ error: 'Service role key missing' }, { status: 500 });
  const sb = adminClient();
  const { name, description } = await req.json();
  if (!name) return NextResponse.json({ error: 'name wajib' }, { status: 400 });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { data, error } = await sb.from('categories').insert([{ name, slug, description }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
