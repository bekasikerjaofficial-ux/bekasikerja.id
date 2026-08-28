'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function MemberRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!formData.name.trim()) return;
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.name } },
    });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (data.session) {
      setTimeout(() => {
        router.replace('/');
        router.refresh();
      }, 600);
    } else {
      setMsg('Pendaftaran berhasil! Cek email untuk verifikasi, lalu login.');
    }
  };

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" className="brand-mark" style={{ fontSize: 18, marginBottom: 8 }}>BK</Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Daftar Akun Member</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Cari kerja &amp; buat CV gratis dalam hitungan detik</p>
        </div>

        {msg && (
          <div style={{ background: '#e8f7ee', border: '1px solid #b7e3c8', color: '#1a7f43', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700 }}>
            🎉 {msg}
          </div>
        )}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', color: 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Nama Lengkap</label>
            <input type="text" required placeholder="Contoh: Budi Santoso" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Email</label>
            <input type="email" required placeholder="nama@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Memproses...' : 'Daftar Akun Gratis'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ fontSize: 13, marginTop: 24 }}>
          Sudah punya akun?{' '}
          <Link href="/member/login" style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
