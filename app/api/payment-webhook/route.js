import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Webhook Midtrans: aktifkan membership saat settlement (QRIS dibayar).
// Midtrans kirim POST ke /api/payment-webhook dengan body notification.
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Midtrans signature verification (opsional tapi disarankan).
// sha512(order_id + status_code + gross_amount + server_key)
function verifySignature(payload) {
  const crypto = require('crypto');
  const key = process.env.MIDTRANS_SERVER_KEY || '';
  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${key}`;
  const hash = crypto.createHash('sha512').update(raw).digest('hex');
  return hash === payload.signature_key;
}

export async function POST(req) {
  try {
    const payload = await req.json();

    // Verifikasi signature bila env diset
    if (process.env.MIDTRANS_SERVER_KEY && !verifySignature(payload)) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 403 });
    }

    const orderId = payload.order_id;
    const status = payload.transaction_status; // settlement | capture | pending | expire | cancel | deny

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase env belum lengkap' }, { status: 500 });
    }
    const sb = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Cari order lokal
    const { data: order, error: oErr } = await sb
      .from('membership_orders').select('*').eq('order_id', orderId).single();
    if (oErr || !order) return NextResponse.json({ error: 'order tidak dikenal' }, { status: 404 });

    const PAID = status === 'settlement' || status === 'capture';
    const TERMINATED = status === 'expire' || status === 'cancel' || status === 'deny';

    if (PAID && order.status !== 'paid') {
      // Aktifkan (atau perpanjang) membership otomatis
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 3); // periode 3 bulan
      await sb.from('memberships').upsert([{
        user_id: order.user_id,
        package_id: order.package_id,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      }], { onConflict: 'user_id,package_id' });
      await sb.from('membership_orders').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('order_id', orderId);
      return NextResponse.json({ ok: true, activated: true });
    }

    if (TERMINATED) {
      await sb.from('membership_orders').update({ status: 'cancelled' }).eq('order_id', orderId);
    }

    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
