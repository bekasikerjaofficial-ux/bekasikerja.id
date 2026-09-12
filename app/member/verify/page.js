'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MemberVerify() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('Memverifikasi email Anda...');

  useEffect(() => {
    const verifyEmail = async () => {
      if (typeof window === 'undefined') return;

      // Supabase verification link contains hash fragment like:
      // #access_token=...&refresh_token=...&expires_at=...&token_type=bearer&type=signup
      const hash = window.location.hash;
      if (!hash) {
        setStatus('error');
        setMessage('Link verifikasi tidak valid atau sudah kedaluwarsa.');
        return;
      }

      // Parse hash params
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      if (!accessToken) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan.');
        return;
      }

      try {
        // Set session from the tokens in the hash
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('[verify] setSession error:', error);
          setStatus('error');
          setMessage('Gagal memverifikasi: ' + error.message);
          return;
        }

        // Mark email as confirmed via getUser (forces a session refresh)
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) {
          console.error('[verify] getUser error:', userErr);
          setStatus('error');
          setMessage('Gagal mengambil data pengguna.');
          return;
        }

        if (userData.user && userData.user.email_confirmed_at) {
          setStatus('success');
          setMessage('Email berhasil diverifikasi! Anda akan diarahkan ke dashboard...');
          setTimeout(() => {
            router.replace('/member/dashboard');
          }, 2500);
        } else {
          // Fallback: token was set but email_confirmed_at not yet populated
          // The verification itself happened on Supabase side via the token
          setStatus('success');
          setMessage('Email berhasil diverifikasi! Silakan login.');
          setTimeout(() => {
            router.replace('/member/login?verified=1');
          }, 2000);
        }
      } catch (e) {
        console.error('[verify] unexpected error:', e);
        setStatus('error');
        setMessage('Terjadi kesalahan saat verifikasi.');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 420, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" className="brand-mark" style={{ fontSize: 18, marginBottom: 8 }}>BK</Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Verifikasi Email</h1>
        </div>

        {status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 14, color: 'var(--gray-600)' }}>
            <div style={{ marginBottom: 12 }}>⏳</div>
            {message}
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#16a34a', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              Berhasil!
            </p>
            <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <XCircle size={48} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              Gagal
            </p>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 16 }}>{message}</p>
            <Link href="/member/login" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}>
              Kembali ke Login
            </Link>
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)' }}>
          <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
