import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use the anon client so the OAuth code exchange works on the public route.
// After exchange, the user is authenticated and a session cookie is set.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const provider = searchParams.get('provider');
  const next = searchParams.get('next') || '/member/dashboard';

  if (error) {
    return NextResponse.redirect(new URL('/member/login', request.url).toString());
  }

  if (!code) {
    return NextResponse.redirect(new URL('/member/login?error=missing_code', request.url).toString());
  }

  try {
    // Exchange the code for a session.
    const { data, error: err } = await supabase.auth.exchangeCodeForSession(code);

    if (err) {
      console.error('[auth/callback] exchangeCodeForSession error:', err);
      return NextResponse.redirect(new URL('/member/login?error=exchange_failed', request.url).toString());
    }

    if (!data.session) {
      return NextResponse.redirect(new URL('/member/login?error=no_session', request.url).toString());
    }

    // Redirect to the 'next' URL (or dashboard by default)
    const redirectUrl = next.startsWith('/') ? next : '/member/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url).toString());
  } catch (e) {
    console.error('[auth/callback] unexpected error:', e);
    return NextResponse.redirect(new URL('/member/login?error=unexpected', request.url).toString());
  }
}
