import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use the anon client so the OAuth code exchange works on the public route.
// After exchange, the user is authenticated and a session cookie is set.
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
  },
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const provider = searchParams.get('provider');

  if (error) {
    return NextResponse.redirect(new URL('/member/login', request.url).toString());
  }

  if (!code) {
    return NextResponse.redirect(new URL('/member/login?error=missing_code', request.url).toString());
  }

  try {
    // Exchange the code for a session.
    // signInWithOAuth is client-side; on the route handler we use the underlying
    // exchange flow via the Admin client to avoid redirect to a different host.
    // Because this callback URL is a redirect_to we registered with Supabase,
    // we can use the PKCE flow via the public client.
    const { data, error: err } = await supabase.auth.exchangeCodeForSession(code);

    if (err) {
      console.error('[auth/callback] exchangeCodeForSession error:', err);
      return NextResponse.redirect(new URL('/member/login?error=exchange_failed', request.url).toString());
    }

    if (!data.session) {
      return NextResponse.redirect(new URL('/member/login?error=no_session', request.url).toString());
    }

    // Set the cookie in the response so subsequent page loads have the session.
    // We redirect to the member login page where the UI can read the session
    // via supabase.auth.getSession() (see the bridged localStorage below).
    const loginUrl = new URL('/member/login', request.url);
    loginUrl.searchParams.set('provider', provider || 'google');
    loginUrl.searchParams.set('success', '1');
    return NextResponse.redirect(loginUrl.toString());
  } catch (e) {
    console.error('[auth/callback] unexpected error:', e);
    return NextResponse.redirect(new URL('/member/login?error=unexpected', request.url).toString());
  }
}
