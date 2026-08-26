'use client';
import React, { useState } from 'react';

const ADMIN_PASSWORD = '123456'; // Ganti password kamu di sini

export default function NyosorLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('bk_admin_logged_in', 'true');
      window.location.href = '/admin';
    } else {
      setError('Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 max-w-sm w-full space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-lg font-extrabold text-slate-900">Login Portal Nyosor</h1>
          <p className="text-xs text-slate-500">Akses khusus pengelola BekasiKerja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-blue-600"
            />
          </div>

          {error && <p className="text-rose-600 text-xs font-bold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800"
          >
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}