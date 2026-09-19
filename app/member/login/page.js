'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { getSafeInternalPath } from '../../../lib/safe-redirect';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      setSuccess(true);
      // If there's a next param, redirect there
      const next = getSafeInternalPath(params.get('next'), '/member/dashboard');
      setTimeout(() => { window.location.href = next; }, 1500);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    window.location.href = '/member/dashboard';
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const next = getSafeInternalPath(params.get('next'), '/member/dashboard');
    const redirectTo = `${window.location.origin}/member/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Logo BekasiKerja.id" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Masuk Akun Member</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Akses lamaran &amp; fitur eksklusif BekasiKerja</p>
        </div>

        {success && (
          <div style={{ background: '#e8f7ee', border: '1px solid #b7e3c8', color: '#1a7f43', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700, textAlign: 'center' }}>
            Login berhasil! Mengalihkan...
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 16 }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@gmail.com"
            />
          </div>

          <div className="field" style={{ margin: 0 }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: 'var(--gray-500)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--hl-red)', fontSize: 13, fontWeight: 700, background: '#fff0f0', border: '1px solid #ffd0d0', padding: 8, borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
          <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>atau</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '10px 16px',
            border: '1px solid var(--gray-300)',
            borderRadius: 8,
            background: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--gray-700)',
            transition: '.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Masuk dengan Google
        </button>

        <p className="text-center text-muted" style={{ fontSize: 13, marginTop: 24 }}>
          Belum punya akun?{' '}
          <Link href="/member/register" style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>Daftar Member Gratis</Link>
        </p>
        <p className="text-center" style={{ fontSize: 12, marginTop: 8 }}>
          <Link href="/member/forgot-password" style={{ color: 'var(--gray-500)' }}>Lupa password?</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)' }}>
          <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
