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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-sm w-full space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-white">Nyosor Portal Access</h1>
          <p className="text-xs text-slate-400">Restricted Admin Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1 text-slate-300">Email Admin</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bekasikerja.id"
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="font-bold block mb-1 text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-rose-400 text-xs font-bold text-center">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-500 font-extrabold py-2.5 rounded-xl transition text-white"
          >
            {busy ? 'Memproses...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
