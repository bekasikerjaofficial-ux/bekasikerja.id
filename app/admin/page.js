'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

export default function AdminDashboard() {
  const { siteSettings, updateSiteSettings, jobs = [], addJob, deleteJob } = useApp() || {};
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    brandName: '', badgeText: '', heroTitle: '', heroSubtitle: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: 'Cikarang, Bekasi', category: 'Manufaktur / Pabrik', deadline: '30 Sep 2026', desc: ''
  });

  useEffect(() => {
    // Cek status login dari halaman /nyosor
    const loggedIn = localStorage.getItem('bk_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthorized(true);
    } else {
      // Jika belum login, tendang balik ke halaman login /nyosor
      window.location.href = '/nyosor';
    }

    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  const handleLogout = () => {
    localStorage.removeItem('bk_admin_logged_in');
    window.location.href = '/nyosor';
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (updateSiteSettings) updateSiteSettings(settingsForm);
    alert('✅ Teks Header & Banner Berhasil Diubah!');
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const newJob = { id: Date.now(), ...jobForm };
    if (addJob) addJob(newJob);
    alert('✅ Lowongan Baru Berhasil Diposting!');
    setJobForm({ title: '', company: '', location: 'Cikarang, Bekasi', category: 'Manufaktur / Pabrik', deadline: '30 Sep 2026', desc: '' });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-xs font-semibold text-slate-500">
        Memeriksa hak akses admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-lg tracking-tight text-slate-900">
            {settingsForm.brandName || 'BekasiKerja.id'} <span className="text-xs font-normal text-slate-400">(Admin Panel)</span>
          </a>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href="/" className="text-slate-600 hover:text-slate-900">Lihat Web Utama</a>
            <button
              onClick={handleLogout}
              className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1.5 rounded-lg font-bold transition"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        
        {/* FORM SETTINGS WEBSITE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b">
            ⚙️ Edit Nama Brand & Banner Utama
          </h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Nama Brand / Website</label>
                <input type="text" required value={settingsForm.brandName} onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Teks Badge (Kecil Atas)</label>
                <input type="text" required value={settingsForm.badgeText} onChange={(e) => setSettingsForm({ ...settingsForm, badgeText: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
            </div>
            <div>
              <label className="font-bold block mb-1">Judul Utama Banner</label>
              <input type="text" required value={settingsForm.heroTitle} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold block mb-1">Sub-judul / Deskripsi Banner</label>
              <textarea rows="2" required value={settingsForm.heroSubtitle} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl"></textarea>
            </div>
            <button type="submit" className="bg-slate-900 text-white font-bold px-5 py-2 rounded-xl">Simpan Teks Banner</button>
          </form>
        </div>

        {/* FORM POSTING LOKER BARU */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b">➕ Tambah Loker Baru</h2>
            <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Posisi</label>
                <input type="text" required placeholder="ex: Staff QC Inspector" value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Nama Perusahaan / PT</label>
                <input type="text" required placeholder="ex: PT Astra Honda Motor" value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Lokasi Kawasan</label>
                <input type="text" required value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi / Syarat</label>
                <textarea rows="3" required placeholder="Tulis kualifikasi..." value={jobForm.desc} onChange={(e) => setJobForm({ ...jobForm, desc: e.target.value })} className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl">Publish Lowongan</button>
            </form>
          </div>

          {/* LIST LOKER AKTIF */}
          <div className="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b flex justify-between">
              <span>📋 Lowongan Aktif</span>
              <span className="text-blue-600">{jobs.length} Total</span>
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {jobs.map((job) => (
                <div key={job.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border text-xs">
                  <div>
                    <strong className="text-slate-900 block">{job.title}</strong>
                    <p className="text-slate-500 text-[11px]">{job.company}</p>
                  </div>
                  <button onClick={() => deleteJob(job.id)} className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}