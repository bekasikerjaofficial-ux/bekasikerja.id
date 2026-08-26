'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function AdminPage() {
  const { user, addJob, addNews, jobs, news } = useApp();
  const [activeTab, setActiveTab] = useState('job');

  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', deadline: '', type: 'Full-time', image: '', desc: '' });
  const [newsForm, setNewsForm] = useState({ title: '', category: 'Lifestyle', date: '26 Agt 2026', image: '', content: '' });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl text-center shadow border">
          <h2 className="text-base font-extrabold text-rose-600">Akses Ditolak!</h2>
          <p className="text-xs text-slate-500 mt-2">Anda harus login sebagai Admin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  const handleJobSubmit = (e) => {
    e.preventDefault();
    addJob({ id: Date.now(), ...jobForm, image: jobForm.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80' });
    alert('Lowongan kerja berhasil diposting ke Beranda!');
    setJobForm({ title: '', company: '', location: '', deadline: '', type: 'Full-time', image: '', desc: '' });
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    addNews({ id: Date.now(), ...newsForm, hero: false, image: newsForm.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80' });
    alert('Berita / Artikel berhasil diposting ke kategori Lifestyle!');
    setNewsForm({ title: '', category: 'Lifestyle', date: '26 Agt 2026', image: '', content: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-2">Dashboard Administrator</h1>
        <p className="text-xs text-slate-500 mb-6">Kelola lowongan kerja, artikel lifestyle, dan pengaturan tes.</p>

        {/* ADMIN TABS */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setActiveTab('job')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'job' ? 'bg-blue-600 text-white shadow' : 'bg-white border text-slate-600'}`}
          >
            Post Lowongan Kerja ({jobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'news' ? 'bg-blue-600 text-white shadow' : 'bg-white border text-slate-600'}`}
          >
            Post Berita / Lifestyle ({news.length})
          </button>
        </div>

        {/* TAB 1: POST LOWONGAN */}
        {activeTab === 'job' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-sm font-extrabold mb-4 pb-2 border-b">Form Post Lowongan Baru (Masuk ke Kategori Loker)</h2>
            <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Posisi / Judul Lowongan</label>
                <input type="text" required value={jobForm.title} onChange={e=>setJobForm({...jobForm, title: e.target.value})} placeholder="Contoh: Staff HRD - PT Yamaha" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Nama Perusahaan</label>
                  <input type="text" required value={jobForm.company} onChange={e=>setJobForm({...jobForm, company: e.target.value})} placeholder="PT Yamaha" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Lokasi</label>
                  <input type="text" required value={jobForm.location} onChange={e=>setJobForm({...jobForm, location: e.target.value})} placeholder="Karawang / Bekasi" className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Deadline</label>
                  <input type="text" required value={jobForm.deadline} onChange={e=>setJobForm({...jobForm, deadline: e.target.value})} placeholder="30 Sep 2026" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Tipe Kerja</label>
                  <select value={jobForm.type} onChange={e=>setJobForm({...jobForm, type: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white">
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">URL Gambar / Thumbnail</label>
                <input type="text" value={jobForm.image} onChange={e=>setJobForm({...jobForm, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi & Syarat</label>
                <textarea rows="3" required value={jobForm.desc} onChange={e=>setJobForm({...jobForm, desc: e.target.value})} placeholder="Deskripsi pekerjaan..." className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition">
                Publish Lowongan Kerja
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: POST BERITA / LIFESTYLE */}
        {activeTab === 'news' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-sm font-extrabold mb-4 pb-2 border-b">Form Post Artikel Berita (Masuk ke Kategori Lifestyle & Edukasi)</h2>
            <form onSubmit={handleNewsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Artikel</label>
                <input type="text" required value={newsForm.title} onChange={e=>setNewsForm({...newsForm, title: e.target.value})} placeholder="Judul berita..." className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Kategori</label>
                  <select value={newsForm.category} onChange={e=>setNewsForm({...newsForm, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white">
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tips Karir">Tips Karir</option>
                    <option value="#AwasModus">#AwasModus</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Tanggal</label>
                  <input type="text" required value={newsForm.date} onChange={e=>setNewsForm({...newsForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">URL Gambar</label>
                <input type="text" value={newsForm.image} onChange={e=>setNewsForm({...newsForm, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Isi Konten</label>
                <textarea rows="3" required value={newsForm.content} onChange={e=>setNewsForm({...newsForm, content: e.target.value})} placeholder="Ringkasan atau isi artikel..." className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition">
                Publish Artikel Lifestyle
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
