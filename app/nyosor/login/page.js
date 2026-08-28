'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError('Login gagal: ' + error.message);
      return;
    }
    router.replace('/admin');
  };

  return (
    <div className="auth-wrap" style={{ background: 'var(--hl-navy)' }}>
      <div className="panel" style={{ padding: 32, maxWidth: 360, width: '100%', background: '#fff' }}>
        <div className="text-center" style={{ marginBottom: 20 }}>
          <h1 className="h-display" style={{ fontSize: 20, color: 'var(--gray-900)' }}>Nyosor Portal Access</h1>
          <p className="text-muted" style={{ fontSize: 12 }}>Restricted Admin Authentication</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 14 }}>
          <div className="field" style={{ margin: 0 }}>
            <label style={{ color: 'var(--gray-700)' }}>Email Admin</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bekasikerja.id" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label style={{ color: 'var(--gray-700)' }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p style={{ color: 'var(--hl-red)', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? 'Memproses...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
