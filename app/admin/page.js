// app/admin/page.js
'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function AdminPage() {
  const { user, addJob, addNews, jobs, news } = useApp();
  const [activeTab, setActiveTab] = useState('job');

  // Form Lowongan Kerja dengan Kategori
  const [jobForm, setJobForm] = useState({ 
    title: '', 
    company: '', 
    location: '', 
    category: 'Manufaktur / Pabrik',
    deadline: '', 
    type: 'Full-time', 
    image: '', 
    desc: '' 
  });

  // Form Berita dengan Kategori Lengkap
  const [newsForm, setNewsForm] = useState({ 
    title: '', 
    category: 'Lifestyle', 
    date: '26 Agt 2026', 
    image: '', 
    content: '' 
  });

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
    const newJob = {
      id: Date.now(),
      ...jobForm,
      image: jobForm.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
    };
    addJob(newJob);
    alert('Lowongan kerja berhasil diposting ke Beranda!');
    setJobForm({ title: '', company: '', location: '', category: 'Manufaktur / Pabrik', deadline: '', type: 'Full-time', image: '', desc: '' });
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const newNews = {
      id: Date.now(),
      ...newsForm,
      hero: false,
      image: newsForm.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80'
    };
    addNews(newNews);
    alert('Berita / Artikel berhasil diposting!');
    setNewsForm({ title: '', category: 'Lifestyle', date: '26 Agt 2026', image: '', content: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-2">Dashboard Administrator</h1>
        <p className="text-xs text-slate-500 mb-6">Kelola postingan lowongan kerja, berita lifestyle, dan data portal.</p>

        {/* TAB NAVIGASI ADMIN */}
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

        {/* FORM 1: POST LOWONGAN KERJA */}
        {activeTab === 'job' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-sm font-extrabold mb-4 pb-2 border-b">Form Post Lowongan Kerja Baru</h2>
            <form onSubmit={handleJobSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul / Posisi Lowongan</label>
                <input type="text" required value={jobForm.title} onChange={e=>setJobForm({...jobForm, title: e.target.value})} placeholder="Contoh: Operator Produksi - PT Epson" className="w-full px-3 py-2 border rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Nama Perusahaan / PT</label>
                  <input type="text" required value={jobForm.company} onChange={e=>setJobForm({...jobForm, company: e.target.value})} placeholder="PT Epson Indonesia" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Lokasi</label>
                  <input type="text" required value={jobForm.location} onChange={e=>setJobForm({...jobForm, location: e.target.value})} placeholder="Cikarang, Bekasi" className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Kategori Lowongan</label>
                  <select value={jobForm.category} onChange={e=>setJobForm({...jobForm, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white font-semibold">
                    <option value="Manufaktur / Pabrik">Manufaktur / Pabrik</option>
                    <option value="Logistik & Gudang">Logistik & Gudang</option>
                    <option value="Administration & Staff">Administration & Staff</option>
                    <option value="Engineering & IT">Engineering & IT</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Tipe Pekerjaan</label>
                  <select value={jobForm.type} onChange={e=>setJobForm({...jobForm, type: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white font-semibold">
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Batas Akhir / Deadline</label>
                  <input type="text" required value={jobForm.deadline} onChange={e=>setJobForm({...jobForm, deadline: e.target.value})} placeholder="30 Sep 2026" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold block mb-1">URL Banner / Gambar Thumbnail</label>
                  <input type="text" value={jobForm.image} onChange={e=>setJobForm({...jobForm, image: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Deskripsi & Requirements</label>
                <textarea rows="3" required value={jobForm.desc} onChange={e=>setJobForm({...jobForm, desc: e.target.value})} placeholder="Kualifikasi dan deskripsi pekerjaan..." className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition">
                Publish Lowongan Kerja
              </button>
            </form>
          </div>
        )}

        {/* FORM 2: POST BERITA / LIFESTYLE */}
        {activeTab === 'news' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h2 className="text-sm font-extrabold mb-4 pb-2 border-b">Form Post Berita & Lifestyle</h2>
            <form onSubmit={handleNewsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Judul Artikel</label>
                <input type="text" required value={newsForm.title} onChange={e=>setNewsForm({...newsForm, title: e.target.value})} placeholder="Judul artikel..." className="w-full px-3 py-2 border rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Kategori Artikel / Berita</label>
                  <select value={newsForm.category} onChange={e=>setNewsForm({...newsForm, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white font-semibold">
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Tips Karir">Tips Karir</option>
                    <option value="#AwasModus">#AwasModus</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Tanggal Publikasi</label>
                  <input type="text" required value={newsForm.date} onChange={e=>setNewsForm({...newsForm, date: e.target.value})} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">URL Gambar Header</label>
                <input type="text" value={newsForm.image} onChange={e=>setNewsForm({...newsForm, image: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border rounded-xl" />
              </div>

              <div>
                <label className="font-bold block mb-1">Isi Ringkasan Berita</label>
                <textarea rows="3" required value={newsForm.content} onChange={e=>setNewsForm({...newsForm, content: e.target.value})} placeholder="Isi berita singkat..." className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow transition">
                Publish Artikel Berita
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
