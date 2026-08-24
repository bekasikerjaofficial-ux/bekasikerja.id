'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MemberRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isMemberLoggedIn', 'true');
    localStorage.setItem('memberName', formData.name);
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
        <div className="text-center mb-6">
          <div className="bg-blue-900 text-white font-black px-3 py-1.5 rounded-lg text-xl tracking-widest inline-block mb-2">
            BK
          </div>
          <h1 className="text-xl font-bold text-slate-900">Daftar Member BekasiKerja</h1>
          <p className="text-xs text-slate-500">Buat akun untuk melamar kerja & buat CV gratis</p>
        </div>

        {submitted && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs p-3 rounded-lg mb-4 text-center font-bold">
            🎉 Pendaftaran Berhasil! Mengalihkan ke Halaman Utama...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@gmail.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">No. WhatsApp</label>
            <input
              type="tel"
              required
              placeholder="081234567890"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-extrabold py-3 rounded-lg text-sm transition shadow mt-2"
          >
            Daftar Akun Sekarang
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
