import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from './supabase-url';

// Server-side Supabase client using the service-role key (bypasses RLS).
// Route handlers that need elevated access use this instead of inline
// createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY) calls: a missing
// key there throws "supabaseKey is required" *inside* the handler, which
// Next.js surfaces as an opaque 500 with an empty body. This module reports
// the misconfiguration explicitly instead.
//
// NOTE: deliberately no silent fallback to the anon key. Under RLS these
// routes would quietly return a filtered, wrong dataset — worse than a loud
// failure.
export function serviceDb() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('[serviceDb] missing env', { url: !!url, serviceRoleKey: !!serviceKey });
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function serviceDbMissingResponse() {
  return NextResponse.json(
    {
      error: 'Server configuration error',
      detail: 'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set in the deployment environment.',
    },
    { status: 500 },
  );
}