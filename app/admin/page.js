'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

export default function AdminDashboard() {
  const { jobs = [], news = [], addJob, addNews } = useApp() || {};
  const [activeTab, setActiveTab] = useState('create_job');

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Cikarang / EJIP / Jababeka',
    salary: '',
    category: 'Manufaktur / Pabrik',
    type: 'Full-time',
    deadline: '30 Sep 2026',
    image: '',
    desc: ''
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Lifestyle',
    date: '26 Agt 2026',
    image: '',
    content: ''
  });

  const [localJobs, setLocalJobs] = useState([]);
  const [localNews, setLocalNews] = useState([]);

  useEffect(() => {
    setLocalJobs(jobs);
    setLocalNews(news);
  }, [jobs, news]);

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now(),
      ...jobForm,
      image: jobForm.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
    };
    if (addJob) addJob(newJob);
    alert('✅ Lowongan Kerja Berhasil Diposting!');
    setJobForm({
      title: '',
      company: '',
      location: 'Cikarang / EJIP / Jababeka',
      salary: '',
      category: 'Manufaktur / Pabrik',
      type: 'Full-time',
      deadline: '30 Sep 2026',
      image: '',
      desc: ''
    });
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const newNews = {
      id: Date.now(),
      ...newsForm,
      image: newsForm.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80'
    };
    if (addNews) addNews(newNews);
    alert('✅ Berita / Artikel Lifestyle Berhasil Diposting!');
    setNewsForm({
      title: '',
      category: 'Lifestyle',
      date: '26 Agt 2026',
      image: '',
      content: ''
    });
  };

  const handleDeleteJob = (id) => {
    if (confirm('Yakin ingin menghapus lowongan ini?')) {
      const updated = localJobs.filter(j => j.id !== id);
      setLocalJobs(updated);
      localStorage.setItem('bk_jobs', JSON.stringify(updated));
      alert('Lowongan berhasil dihapus!');
      window.location.reload();
    }
  };

  const handleDeleteNews = (id) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      const updated = localNews.filter(n => n.id !== id);
      setLocalNews(updated);
      localStorage.setItem('bk_news', JSON.stringify(updated));
      alert('Artikel berhasil dihapus!');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* HEADER SIMPLE */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-lg tracking-tight text-slate-900">
            Bekasi<span className="text-blue-600">Karawang</span>
          </a>
          <nav className="flex items-center gap-4 text-xs font-semibold">
            <a href="/" className="text-slate-600 hover:text-slate-900">Beranda</a>
            <a href="/admin" className="text-blue-600">Admin</a>
            <a href="/cv-builder" className="text-slate-600 hover:text-slate-900">CV Builder</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('create_job')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'create_job' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ➕ Post Loker Baru
          </button>
          <button
            onClick={() => setActiveTab('create_news')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'create_news' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📰 Post Berita / Lifestyle
          </button>
          <button
            onClick={() => setActiveTab('manage_posts')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'manage_posts' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📋 Kelola Postingan ({localJobs.length + localNews.length})
          </button>
        </div>

        {activeTab === 'create_job' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Posting Lowongan Kerja Baru</h2>
              <p className="text-xs text-slate-500">Isi formulir di bawah ini untuk mengunggah postingan loker baru.</p>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Posisi Pekerjaan</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Staff QC Inspector"
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Nama Perusahaan / PT</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: PT Astra Honda Motor"
                    value={jobForm.company}
                    onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Kategori Sektor Industri</label>
                  <select
                    value={jobForm.category}
                    onChange={e => setJobForm({ ...jobForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="Manufaktur / Pabrik">Manufaktur / Pabrik</option>
                    <option value="Logistik & Gudang">Logistik & Gudang</option>
                    <option value="Admin & Office">Admin & Office</option>
                    <option value="Teknik & Engineering">Teknik & Engineering</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Lokasi Kawasan</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Cikarang / EJIP / Jababeka"
                    value={jobForm.location}
                    onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Kisaran Gaji (Opsional)</label>
                  <input
                    type="text"
                    placeholder="ex: Rp 5.200.000 - Rp 6.000.000"
                    value={jobForm.salary}
                    onChange={e => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">URL Gambar / Logo Perusahaan</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={jobForm.image}
                  onChange={e => setJobForm({ ...jobForm, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Deskripsi & Syarat Kualifikasi</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan kualifikasi dan cara melamar..."
                  value={jobForm.desc}
                  onChange={e => setJobForm({ ...jobForm, desc: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition"
              >
                Publish Lowongan Kerja
              </button>
            </form>
          </div>
        )}

        {activeTab === 'create_news' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Posting Berita & Artikel Lifestyle</h2>
              <p className="text-xs text-slate-500">Artikel akan otomatis masuk ke seksi berita di bagian bawah beranda.</p>
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Artikel / Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Judul artikel..."
                  value={newsForm.title}
                  onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold block mb-1">Kategori Berita</label>
                  <select
                    value={newsForm.category}
                    onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tips Karir">Tips Karir</option>
                    <option value="#AwasModus">#AwasModus</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Tanggal Rilis</label>
                  <input
                    type="text"
                    required
                    value={newsForm.date}
                    onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">URL Gambar Header Artikel</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newsForm.image}
                  onChange={e => setNewsForm({ ...newsForm, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Isi Singkat Artikel</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan ringkasan berita..."
                  value={newsForm.content}
                  onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition"
              >
                Publish Artikel Berita
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage_posts' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b">
                Daftar Lowongan Kerja ({localJobs.length})
              </h3>
              <div className="space-y-3">
                {localJobs.map(job => (
                  <div key={job.id} className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded mr-2">{job.category || 'Loker'}</span>
                      <strong className="text-slate-900">{job.title}</strong>
                      <p className="text-slate-500 text-[11px] mt-0.5">{job.company} • {job.location}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-3 py-1 rounded-lg font-bold transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b">
                Daftar Artikel & Berita ({localNews.length})
              </h3>
              <div className="space-y-3">
                {localNews.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded mr-2">{item.category}</span>
                      <strong className="text-slate-900">{item.title}</strong>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.date}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-3 py-1 rounded-lg font-bold transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
