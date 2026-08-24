'use client';
import React, { useState } from 'react';

export default function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('isMemberLoggedIn', 'true');
    localStorage.setItem('memberName', email.split('@')[0]);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
        <div className="text-center mb-6">
          <div className="bg-blue-900 text-white font-black px-3 py-1.5 rounded-lg text-xl tracking-widest inline-block mb-2">
            BK
          </div>
          <h1 className="text-xl font-bold text-slate-900">Masuk Akun Member</h1>
          <p className="text-xs text-slate-500">Akses lamaran & fitur eksklusif BekasiKerja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@gmail.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-sm transition shadow"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Belum punya akun?{' '}
          <a href="/member/register" className="text-blue-900 font-bold hover:underline">
            Daftar Member Gratis
          </a>
        </p>
      </div>
    </div>
  );
}
