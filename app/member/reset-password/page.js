'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function MemberResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('verifying'); // verifying | ready | success | error
  const [message, setMessage] = useState('Memverifikasi link reset...');
  const [loading, setLoading] = useState(false);
  const [returnPath, setReturnPath] = useState('/member/login');

  useEffect(() => {
    const requestedNext = new URLSearchParams(window.location.search).get('next');
    const safeNext = requestedNext && requestedNext.startsWith('/')
      ? requestedNext
      : '/member/login';
    setReturnPath(safeNext);

    const verifyResetLink = async () => {
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.substring(1));
      const error = query.get('error_description') || query.get('error') || hash.get('error_description') || hash.get('error');
      if (error) throw new Error('Link reset password tidak valid atau sudah kedaluwarsa.');

      // PKCE returns ?code=..., while implicit flow returns #access_token=....
      const code = query.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else if (hash.get('access_token')) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: hash.get('access_token'),
          refresh_token: hash.get('refresh_token') || '',
        });
        if (sessionError) throw sessionError;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!data.session) throw new Error('Token reset password tidak ditemukan. Pastikan Anda membuka link dari email.');
      setStatus('ready');
    };

    verifyResetLink().catch((verifyError) => {
      setStatus('error');
      setMessage('Gagal memverifikasi: ' + verifyError.message);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password.length < 6) {
      setMessage('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Password tidak cocok.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setStatus('error');
      setMessage('Gagal mengubah password: ' + error.message);
      return;
    }

    setStatus('success');
    setMessage('Password berhasil diubah! Anda akan diarahkan ke login...');
    setTimeout(() => router.replace(returnPath), 2500);
  };

  return (
    <div className="auth-wrap font-sans">
      <div className="panel" style={{ padding: 32, maxWidth: 400, width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          <Link href="/" style={{ marginBottom: 8, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Logo BekasiKerja.id" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Buat Password Baru</h1>
        </div>

        {status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 12px', color: 'var(--hl-blue)' }} />
            <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>{message}</p>
          </div>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Password Baru</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className="field" style={{ margin: 0 }}>
              <label>Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {message && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', color: 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, fontWeight: 700 }}>
                {message}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#16a34a', fontWeight: 700, fontSize: 15 }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <XCircle size={48} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#dc2626', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{message}</p>
            <Link href={returnPath === '/nyosor/login' ? '/nyosor/forgot-password' : '/member/forgot-password'} className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}>
              {returnPath === '/nyosor/login' ? 'Minta Link Admin Baru' : 'Minta Link Baru'}
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
