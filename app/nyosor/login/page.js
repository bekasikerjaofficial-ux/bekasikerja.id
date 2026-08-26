'use client';
import React, { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Password Login Admin kamu
  const ADMIN_PASS = 'adminkayaraya2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      localStorage.setItem('bk_admin_auth', 'true');
      window.location.href = '/admin';
    } else {
      setError('Password akses admin tidak valid!');
    }
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
            <label className="font-bold block mb-1 text-slate-300">Secret Key / Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-rose-400 text-xs font-bold text-center">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-extrabold py-2.5 rounded-xl transition text-white">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
