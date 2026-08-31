import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Status poll fallback untuk client (bila webhook belum ke-fire).
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req) {
  const order = new URL(req.url).searchParams.get('order');
  if (!order) return NextResponse.json({ error: 'order wajib' }, { status: 400 });
  if (!supabaseUrl || !supabaseServiceKey) return NextResponse.json({ error: 'env' }, { status: 500 });

  const sb = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: o } = await sb.from('membership_orders').select('status').eq('order_id', order).single();
  return NextResponse.json({ paid: o && o.status === 'paid' });
}
