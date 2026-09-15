'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

export default function MemberAuthCallback() {
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const finishLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get('next') || '/member/dashboard';
      const next = nextParam.startsWith('/') ? nextParam : '/member/dashboard';
      const code = params.get('code');

      try {
        // detectSessionInUrl may already have exchanged the PKCE code while the
        // browser client initialized. Reuse that session before exchanging again.
        const { data: current, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!current.session && code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data: finalSession, error: finalError } = await supabase.auth.getSession();
        if (finalError) throw finalError;
        if (!finalSession.session) throw new Error('Kode login tidak ditemukan.');

        window.location.replace(next);
      } catch (callbackError) {
        console.error('[auth/callback] login failed:', callbackError);
        if (active) {
          setError('Login Google belum selesai. Silakan coba lagi.');
        }
      }
    };

    finishLogin();
    return () => { active = false; };
  }, []);

  return (
    <main className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', marginBottom: 16 }}>
          <img src="/logo.png" alt="Logo BekasiKerja.id" style={{ height: 36, width: 'auto' }} />
        </Link>
        {error ? (
          <>
            <h1 className="h-display" style={{ fontSize: 20 }}>Login gagal</h1>
            <p className="text-muted" style={{ fontSize: 13, margin: '12px 0 20px' }}>{error}</p>
            <Link href="/member/login" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Kembali ke Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="h-display" style={{ fontSize: 20 }}>Menyelesaikan login...</h1>
            <p className="text-muted" style={{ fontSize: 13 }}>Mohon tunggu sebentar.</p>
          </>
        )}
      </div>
    </main>
  );
}
