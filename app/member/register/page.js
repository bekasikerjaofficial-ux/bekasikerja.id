'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MemberRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);

  const saveAndRedirect = (name) => {
    localStorage.setItem('isMemberLoggedIn', 'true');
    localStorage.setItem('memberName', name);
    setSubmitted(true);
    
    // Gunakan router.replace agar tidak memicu reload halaman dan navigasi lebih cepat
    setTimeout(() => {
      router.replace('/');
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAndRedirect(formData.name || 'Pelamar');
  };

  const handleGoogleRegister = () => {
    saveAndRedirect('User Google');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">
        
        <div className="text-center mb-6">
          <div className="bg-blue-900 text-white font-black px-3 py-1.5 rounded-lg text-xl tracking-widest inline-block mb-2 shadow">
            BK
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Daftar Akun Member</h1>
          <p className="text-xs text-slate-500 mt-1">Cari kerja & buat CV gratis dalam hitungan detik</p>
        </div>

        {submitted && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs p-3 rounded-lg mb-4 text-center font-bold">
            🎉 Berhasil Mendaftar! Mengalihkan ke Halaman Utama...
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Daftar dengan Google / Gmail
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-[11px] text-slate-400 uppercase font-semibold">atau dengan email</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@gmail.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold py-3 rounded-xl text-xs transition shadow mt-2"
          >
            Daftar Akun Gratis
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <a href="/member/login" className="text-blue-900 font-bold hover:underline">
            Masuk di sini
          </a>
        </p>

      </div>
    </div>
  );
}
