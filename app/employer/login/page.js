'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function EmployerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e) => { e.preventDefault(); setLoading(true); setError(''); const { error: err } = await supabase.auth.signInWithPassword({ email, password }); setLoading(false); if (err) setError(err.message); else router.replace('/employer/onboarding'); };
  return <main className="auth-wrap font-sans"><div className="panel" style={{ padding: 32, maxWidth: 420, width: '100%' }}>
    <Link href="/" className="logo" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: 20 }}>BekasiKerja.id</Link>
    <h1 className="h-display" style={{ fontSize: 22 }}>Masuk Member Perusahaan</h1><p className="text-muted" style={{ fontSize: 13 }}>Kelola perusahaan, lowongan, dan pelamar.</p>
    {error && <p style={{ color: 'var(--hl-red)', fontSize: 13 }}>{error}</p>}
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginTop: 20 }}>
      <div className="field"><label>Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label>Password</label><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <button disabled={loading} className="btn-primary">{loading ? 'Memproses...' : 'Masuk'}</button>
    </form>
    <p className="text-muted" style={{ fontSize: 13, marginTop: 20 }}>Belum punya akun? <Link href="/employer/register">Daftar sebagai perusahaan</Link></p>
    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 16, textDecoration: 'none' }}>← Kembali ke Beranda</Link>
  </div></main>;
}
