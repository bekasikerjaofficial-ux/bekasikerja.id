'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

export default function AdminDashboard() {
  const { jobs = [], news = [], addJob, addNews } = useApp() || {};

  // --- STATE LOKER ---
  const [jobList, setJobList] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
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

  // --- STATE BERITA ---
  const [newsList, setNewsList] = useState([]);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Lifestyle',
    date: '26 Agt 2026',
    image: '',
    content: ''
  });

  useEffect(() => {
    setJobList(jobs);
    setNewsList(news);
  }, [jobs, news]);

  // --- HANDLER LOKER (CREATE & EDIT) ---
  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (editingJobId) {
      // UPDATE DATA LAMA
      const updated = jobList.map((item) =>
        item.id === editingJobId ? { ...item, ...jobForm } : item
      );
      setJobList(updated);
      localStorage.setItem('bk_jobs', JSON.stringify(updated));
      alert('✅ Lowongan Kerja Berhasil Diperbarui!');
      setEditingJobId(null);
    } else {
      // TAMBAH DATA BARU
      const newJob = {
        id: Date.now(),
        ...jobForm,
        image: jobForm.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
      };
      if (addJob) addJob(newJob);
      alert('✅ Lowongan Kerja Berhasil Diposting!');
    }
    setJobForm({ title: '', company: '', location: 'Cikarang / EJIP / Jababeka', salary: '', category: 'Manufaktur / Pabrik', type: 'Full-time', deadline: '30 Sep 2026', image: '', desc: '' });
  };

  const handleEditJob = (job) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      category: job.category || 'Manufaktur / Pabrik',
      type: job.type || 'Full-time',
      deadline: job.deadline || '',
      image: job.image || '',
      desc: job.desc || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJob = (id) => {
    if (confirm('Yakin ingin menghapus lowongan ini?')) {
      const updated = jobList.filter((j) => j.id !== id);
      setJobList(updated);
      localStorage.setItem('bk_jobs', JSON.stringify(updated));
      alert('Lowongan berhasil dihapus!');
      window.location.reload();
    }
  };

  // --- HANDLER BERITA (CREATE & EDIT) ---
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    if (editingNewsId) {
      // UPDATE BERITA LAMA
      const updated = newsList.map((item) =>
        item.id === editingNewsId ? { ...item, ...newsForm } : item
      );
      setNewsList(updated);
      localStorage.setItem('bk_news', JSON.stringify(updated));
      alert('✅ Artikel Berhasil Diperbarui!');
      setEditingNewsId(null);
    } else {
      // TAMBAH BERITA BARU
      const newNews = {
        id: Date.now(),
        ...newsForm,
        image: newsForm.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80'
      };
      if (addNews) addNews(newNews);
      alert('✅ Artikel Berhasil Diposting!');
    }
    setNewsForm({ title: '', category: 'Lifestyle', date: '26 Agt 2026', image: '', content: '' });
  };

  const handleEditNews = (item) => {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title || '',
      category: item.category || 'Lifestyle',
      date: item.date || '',
      image: item.image || '',
      content: item.content || ''
    });
  };

  const handleDeleteNews = (id) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      const updated = newsList.filter((n) => n.id !== id);
      setNewsList(updated);
      localStorage.setItem('bk_news', JSON.stringify(updated));
      alert('Artikel berhasil dihapus!');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      {/* HEADER */}
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

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-10">

        {/* SECTION 1: LOWONGAN KERJA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FORM LOKER */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                {editingJobId ? '✏️ Edit Lowongan Kerja' : '➕ Tambah Loker Baru'}
              </h2>
              {editingJobId && (
                <button
                  onClick={() => {
                    setEditingJobId(null);
                    setJobForm({ title: '', company: '', location: 'Cikarang / EJIP / Jababeka', salary: '', category: 'Manufaktur / Pabrik', type: 'Full-time', deadline: '30 Sep 2026', image: '', desc: '' });
                  }}
                  className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Posisi Pekerjaan</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Staff QC Inspector"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Nama Perusahaan / PT</label>
                <input
                  type="text"
                  required
                  placeholder="ex: PT Astra Honda Motor"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Kategori</label>
                  <select
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="Manufaktur / Pabrik">Manufaktur / Pabrik</option>
                    <option value="Logistik & Gudang">Logistik & Gudang</option>
                    <option value="Admin & Office">Admin & Office</option>
                    <option value="Teknik & Engineering">Teknik & Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Batas Melamar</label>
                  <input
                    type="text"
                    required
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Lokasi Kawasan</label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">URL Gambar / Logo (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={jobForm.image}
                  onChange={(e) => setJobForm({ ...jobForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Deskripsi / Syarat</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tulis kualifikasi..."
                  value={jobForm.desc}
                  onChange={(e) => setJobForm({ ...jobForm, desc: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full text-white font-extrabold py-2.5 rounded-xl transition ${
                  editingJobId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editingJobId ? 'Simpan Perubahan Loker' : 'Publish Lowongan Kerja'}
              </button>
            </form>
          </div>

          {/* LIST KELOLA LOKER */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 pb-2 border-b flex justify-between items-center">
              <span>📋 Daftar Lowongan Kerja</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">{jobList.length} Total</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {jobList.length > 0 ? (
                jobList.map((job) => (
                  <div key={job.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="pr-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded mr-1">
                        {job.category || 'Loker'}
                      </span>
                      <strong className="text-slate-900 block mt-1">{job.title}</strong>
                      <p className="text-slate-500 text-[11px]">{job.company} • {job.location}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-2.5 py-1 rounded-lg font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-2.5 py-1 rounded-lg font-bold transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada lowongan tersimpan.</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: BERITA & LIFESTYLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-200 pt-8">
          {/* FORM BERITA */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold text-slate-900">
                {editingNewsId ? '✏️ Edit Artikel' : '📰 Tambah Artikel Berita'}
              </h2>
              {editingNewsId && (
                <button
                  onClick={() => {
                    setEditingNewsId(null);
                    setNewsForm({ title: '', category: 'Lifestyle', date: '26 Agt 2026', image: '', content: '' });
                  }}
                  className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  placeholder="Judul artikel..."
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Kategori</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tips Karir">Tips Karir</option>
                    <option value="#AwasModus">#AwasModus</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Tanggal</label>
                  <input
                    type="text"
                    required
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">URL Gambar Header</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newsForm.image}
                  onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Isi Singkat Artikel</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tulis ringkasan artikel..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full text-white font-extrabold py-2.5 rounded-xl transition ${
                  editingNewsId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {editingNewsId ? 'Simpan Perubahan Artikel' : 'Publish Artikel Berita'}
              </button>
            </form>
          </div>

          {/* LIST KELOLA BERITA */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900 mb-4 pb-2 border-b flex justify-between items-center">
              <span>📰 Daftar Artikel Berita</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">{newsList.length} Total</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {newsList.length > 0 ? (
                newsList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="pr-2">
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded mr-1">
                        {item.category}
                      </span>
                      <strong className="text-slate-900 block mt-1">{item.title}</strong>
                      <p className="text-slate-500 text-[11px]">{item.date}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditNews(item)}
                        className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-2.5 py-1 rounded-lg font-bold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white px-2.5 py-1 rounded-lg font-bold transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Belum ada artikel tersimpan.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
