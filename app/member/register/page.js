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
      // langsung login (email confirmation nonaktif di env)
      setTimeout(() => {
        router.replace('/');
        router.refresh();
      }, 600);
    } else {
      setMsg('Pendaftaran berhasil! Cek email untuk verifikasi, lalu login.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">
        <div className="text-center mb-6">
          <Link href="/" className="bg-blue-900 text-white font-black px-3 py-1.5 rounded-lg text-xl tracking-widest inline-block mb-2 shadow">
            BK
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Daftar Akun Member</h1>
          <p className="text-xs text-slate-500 mt-1">Cari kerja & buat CV gratis dalam hitungan detik</p>
        </div>

        {msg && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs p-3 rounded-lg mb-4 text-center font-bold">
            🎉 {msg}
          </div>
        )}
        {error && (
          <div className="bg-rose-100 border border-rose-400 text-rose-800 text-xs p-3 rounded-lg mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
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
              value={formData.email}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-900 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white font-extrabold py-3 rounded-xl text-xs transition shadow mt-2 cursor-pointer"
          >
            {loading ? 'Memproses...' : 'Daftar Akun Gratis'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/member/login" className="text-blue-900 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
