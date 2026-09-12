'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function MemberForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!email.trim()) return;
    setLoading(true);

    const redirectUrl = `${window.location.origin}/member/reset-password`;

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setMsg('Email reset password telah dikirim. Cek inbox Anda.');
  };

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" className="brand-mark" style={{ fontSize: 18, marginBottom: 8 }}>BK</Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Reset Password</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Masukkan email untuk menerima link reset password</p>
        </div>

        {msg && (
          <div style={{ background: '#e8f7ee', border: '1px solid #b7e3c8', color: '#1a7f43', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} /> {msg}
          </div>
        )}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', color: 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Email</label>
            <input type="email" required placeholder="nama@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ fontSize: 13, marginTop: 24 }}>
          <Link href="/member/login" style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>← Kembali ke Login</Link>
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
