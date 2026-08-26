'use client';
import React, { useState } from 'react';
import { useApp } from './AppContext';

export default function Home() {
  const { jobs = [], news = [] } = useApp() || {};
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('Semua');

  const filteredNews = selectedNewsCategory === 'Semua' 
    ? news 
    : news.filter(item => item.category === selectedNewsCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* HEADER SIMPLE */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-lg tracking-tight text-slate-900">
            Bekasi<span className="text-blue-600">Karawang</span>
          </a>
          <nav className="flex items-center gap-4 text-xs font-semibold">
            <a href="/" className="text-blue-600">Beranda</a>
            <a href="/admin" className="text-slate-600 hover:text-slate-900">Admin</a>
            <a href="/cv-builder" className="text-slate-600 hover:text-slate-900">CV Builder</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-3 py-1 rounded-full inline-block mb-3 uppercase">
            Portal Lowongan Kerja Bekasi & Karawang
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
            Temukan Karir Impianmu di Kawasan Industri
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mb-6 max-w-xl mx-auto">
            Update lowongan kerja operator, admin, hingga engineering terpercaya setiap hari.
          </p>
        </div>
      </section>

      {/* LOKER SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Lowongan Kerja Terbaru</h2>
            <p className="text-xs text-slate-500">Lowongan terverifikasi di Bekasi, Cikarang, & Karawang</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {jobs.length} Lowongan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={job.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'} 
                      alt={job.title} 
                      className="w-12 h-12 rounded-xl object-cover border flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {job.category || job.type || 'Full-time'}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mt-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {job.desc || 'Tidak ada deskripsi singkat.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>📍 {job.location}</span>
                  <span className="font-semibold text-rose-600">S/d: {job.deadline}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed text-xs text-slate-400">
              Belum ada lowongan diposting.
            </div>
          )}
        </div>
      </section>

      {/* BERITA SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Berita & Informasi Karir</h2>
            <p className="text-xs text-slate-500">Tips, berita industri, dan panduan dunia kerja</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 text-xs">
            {['Semua', 'Lifestyle', 'Edukasi', 'Tips Karir', '#AwasModus'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedNewsCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedNewsCategory === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white border text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80'} 
                  alt={item.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mb-2">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed text-xs text-slate-400">
              Belum ada artikel di kategori ini.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
