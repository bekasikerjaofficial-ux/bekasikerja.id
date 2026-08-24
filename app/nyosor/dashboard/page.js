'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Cikarang',
    salary: '',
    type: 'Full-time',
    logoUrl: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // Proteksi Halaman Admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/nyosor/login');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Loker Baru Disimpan:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/nyosor/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center border-b border-blue-900">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-500 text-blue-950 font-black px-2 py-0.5 rounded text-xs">ADMIN PANEL</span>
          <span className="font-bold text-sm">Dashboard BekasiKerja.id</span>
        </div>
        <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white font-semibold">
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-lg font-bold text-slate-900">Posting Lowongan Kerja Baru</h1>
            <p className="text-xs text-slate-500">Isi formulir di bawah ini untuk mengunggah postingan loker baru.</p>
          </div>

          {submitted && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs p-3 rounded-lg text-center font-bold">
              ✅ Lowongan Kerja Berhasil Diposting!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Posisi Pekerjaan</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="ex: Staff QC Inspector"
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Perusahaan / PT</label>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="ex: PT Astra Honda Motor"
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Kawasan</label>
                <select name="location" onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:outline-none">
                  <option value="Cikarang">Cikarang / EJIP / Jababeka</option>
                  <option value="Cibitung">Cibitung / MM2100</option>
                  <option value="Kota Bekasi">Kota Bekasi</option>
                  <option value="Tambun">Tambun / Summarecon</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kisaran Gaji</label>
                <input
                  type="text"
                  name="salary"
                  placeholder="ex: Rp 5.200.000 - Rp 6.000.000"
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Link URL Gambar / Logo Perusahaan</label>
              <input
                type="url"
                name="logoUrl"
                placeholder="https://domain.com/logo.png"
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Deskripsi & Syarat Kualifikasi</label>
              <textarea
                name="description"
                rows="5"
                placeholder="Tuliskan kualifikasi dan cara melamar..."
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:border-blue-900"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg text-sm transition shadow"
            >
              Publish Lowongan Kerja
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
