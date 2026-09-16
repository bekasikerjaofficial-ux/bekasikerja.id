'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/member/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setMessage('Link reset password sudah dikirim. Periksa email admin Anda.');
  };

  return (
    <div className="auth-wrap" style={{ background: 'var(--hl-navy)' }}>
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" style={{ display: 'inline-flex', marginBottom: 12 }}>
            <img src="/logo.png" alt="Logo BekasiKerja.id" style={{ height: 36, width: 'auto' }} />
          </Link>
          <h1 className="h-display" style={{ fontSize: 20 }}>Reset Password Admin</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Masukkan email admin untuk menerima link reset.</p>
        </div>

        {message && <div style={{ background: '#e8f7ee', color: '#1a7f43', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', gap: 8 }}><CheckCircle2 size={16} /> {message}</div>}
        {error && <div style={{ background: '#fff0f0', color: 'var(--hl-red)', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', gap: 8 }}><XCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Email Admin</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bekasikerja.id" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)', gap: 8 }}>
          <Link href="/nyosor/login" style={{ color: 'var(--hl-blue)', fontSize: 12 }}>← Kembali ke Login</Link>
          <Link href="/" style={{ color: 'var(--gray-500)', fontSize: 12 }}>Beranda</Link>
        </div>
      </div>
    </div>
  );
}
