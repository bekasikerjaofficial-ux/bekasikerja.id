import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createQrisCharge, isMidtransConfigured } from '../../../lib/midtrans';

// Route handler (Node runtime) — membuat transaksi QRIS Midtrans untuk upgrade paket.
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    const { packageSlug } = await req.json();
    if (!packageSlug) return NextResponse.json({ error: 'packageSlug wajib' }, { status: 400 });

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase env belum lengkap' }, { status: 500 });
    }
    if (!isMidtransConfigured) {
      return NextResponse.json({ error: 'Payment gateway belum dikonfigurasi' }, { status: 503 });
    }

    // Auth user dari session Supabase (bawa cookie lewat anon client)
    const sbUser = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: u } = await sbUser.auth.getUser();
    const user = u?.user;
    if (!user) return NextResponse.json({ error: 'Login dulu' }, { status: 401 });

    // Ambil paket dari DB
    const sbAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: pkg, error: pkgErr } = await sbAdmin
      .from('packages').select('*').eq('slug', packageSlug).eq('active', true).single();
    if (pkgErr || !pkg) return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });
    if (!pkg.price || pkg.price <= 0) {
      return NextResponse.json({ error: 'Paket gratis tidak butuh bayar' }, { status: 400 });
    }

    // Order id unik: bk-<userIdShort>-<pkg>-<timestamp>
    const orderId = `bk-${user.id.slice(0, 8)}-${pkg.slug}-${Date.now()}`;

    // Simpan order (pending) — dipakai webhook untuk mengaitkan ke membership
    await sbAdmin.from('membership_orders').insert([{
      order_id: orderId,
      user_id: user.id,
      package_id: pkg.id,
      amount: pkg.price,
      status: 'pending',
    }]);

    const charge = await createQrisCharge({
      orderId,
      amount: pkg.price,
      pkgName: pkg.name,
      userEmail: user.email,
      userName: (user.user_metadata && user.user_metadata.full_name) || pkg.name,
    });

    return NextResponse.json({
      orderId: charge.orderId,
      qrString: charge.qrString,
      transactionId: charge.transactionId,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
