import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from './supabase-url';

// Supabase client for admin route handlers.
//
// These routes do NOT need the service-role key. Every table they touch has a
// `is_admin()` RLS policy, and `requireAdmin()` has already verified the
// caller's session before any handler runs. Passing the caller's own JWT with
// the anon key lets Postgres enforce authorization per row, which is both
// sufficient and safer than a server-wide key that bypasses RLS entirely.
//
// The previous code built this client from SUPABASE_SERVICE_ROLE_KEY. That key
// is not present in the Vercel deployment env, so createClient() threw
// "supabaseKey is required" inside each handler and Next.js surfaced an opaque
// 500 with an empty body.
export function adminDb(request) {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('[adminDb] missing env', { url: !!url, anonKey: !!anonKey });
    return null;
  }
  const authorization = request?.headers?.get?.('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export function adminDbMissingResponse() {
  return NextResponse.json(
    {
      error: 'Server configuration error',
      detail: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must both be set in the deployment environment.',
    },
    { status: 500 },
  );
}