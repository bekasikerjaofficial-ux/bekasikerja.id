import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from '../../../lib/supabase-url';

const REASONS = new Set(['penipuan', 'meminta_uang', 'data_mencurigakan', 'informasi_tidak_sesuai', 'lainnya']);

export async function POST(request) {
  try {
    const body = await request.json();
    const jobRef = String(body.jobRef || '').trim();
    const reason = String(body.reason || '').trim();
    const details = String(body.details || '').trim().slice(0, 1000);
    if (!jobRef || jobRef.length > 120) return NextResponse.json({ error: 'Referensi lowongan tidak valid.' }, { status: 400 });
    if (!REASONS.has(reason)) return NextResponse.json({ error: 'Kategori laporan tidak valid.' }, { status: 400 });
    const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: 'Fitur laporan belum dikonfigurasi.' }, { status: 503 });

    let reporterId = null;
    const token = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (token) {
      const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data } = await authClient.auth.getUser(token);
      reporterId = data.user?.id || null;
    }
    const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await db.from('job_reports').insert({ job_ref: jobRef, reporter_id: reporterId, reason, details: details || null });
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') return NextResponse.json({ error: 'Fitur laporan sedang disiapkan.' }, { status: 503 });
      return NextResponse.json({ error: 'Laporan belum dapat disimpan.' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Format laporan tidak valid.' }, { status: 400 });
  }
}
