'use client';
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    window.location.href = '/';
  };

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" className="brand-mark" style={{ fontSize: 18, marginBottom: 8 }}>BK</Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Masuk Akun Member</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Akses lamaran &amp; fitur eksklusif BekasiKerja</p>
        </div>

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
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
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

        <p className="text-center text-muted" style={{ fontSize: 13, marginTop: 24 }}>
          Belum punya akun?{' '}
          <Link href="/member/register" style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>Daftar Member Gratis</Link>
        </p>
      </div>
    </div>
  );
}
