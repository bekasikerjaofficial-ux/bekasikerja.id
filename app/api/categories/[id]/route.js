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

async function requireAdmin() {
  if (!supabaseServiceKey) throw new Error('Service role key missing');
  return adminClient();
}

export async function PUT(req, { params }) {
  const sb = await requireAdmin();
  const { name, description, active } = await req.json();
  const { data, error } = await sb.from('categories').update({ name, description, active }).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req, { params }) {
  const sb = await requireAdmin();
  const { error } = await sb.from('categories').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
