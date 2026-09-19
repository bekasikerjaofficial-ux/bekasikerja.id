import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from '../../../../lib/supabase-url';

// Status poll fallback untuk client (bila webhook belum ke-fire).
export const runtime = 'nodejs';

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req) {
  const order = new URL(req.url).searchParams.get('order');
  if (!order) return NextResponse.json({ error: 'order wajib' }, { status: 400 });
  if (!supabaseUrl || !supabaseServiceKey) return NextResponse.json({ error: 'env' }, { status: 500 });
  const accessToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!accessToken || !supabaseAnonKey) return NextResponse.json({ error: 'Login dulu' }, { status: 401 });
  const authClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !userData.user) return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });

  const sb = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: o } = await sb.from('membership_orders').select('status').eq('order_id', order).eq('user_id', userData.user.id).single();
  return NextResponse.json({ paid: o && o.status === 'paid' });
}
