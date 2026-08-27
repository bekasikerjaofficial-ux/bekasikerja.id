'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Cikarang',
    salary: '',
    type: 'Full-time',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Proteksi Halaman Admin — hanya user Supabase yang login
  useEffect(() => {
    let active = true;
    const guard = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        router.replace('/nyosor/login');
      }
    };
    guard();
    return () => { active = false; };
  }, [router]);

  // Handle Input Teks
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Upload File Gambar & Convert ke Preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, image: imagePreview };
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/nyosor/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center border-b border-blue-900">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-500 text-blue-950 font-black px-2 py-0.5 rounded text-xs">ADMIN PANEL</span>
          <span className="font-bold text-sm">Dashboard BekasiKerja.id</span>
        </div>
        <button onClick={() => handleLogout()} className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white font-semibold">
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

            {/* FIELD UPLOAD GAMBAR DENGAN FILE INPUT */}
            <div className="border border-dashed border-slate-300 p-4 rounded-xl bg-slate-50">
              <label className="font-bold text-slate-700 block mb-1">Upload Gambar / Logo Perusahaan / Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">*Format JPG/PNG, maksimal 2MB</span>

              {/* TAMPILAN PREVIEW GAMBAR */}
              {imagePreview && (
                <div className="mt-3 flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 object-contain rounded border" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Gambar Siap Diposting</span>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-[11px] text-red-600 hover:underline font-semibold"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              )}
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
