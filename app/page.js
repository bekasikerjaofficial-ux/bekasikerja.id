'use client';
import React from 'react';
import { useApp } from './AppContext';

export default function HomePage() {
  const { siteSettings, jobs = [] } = useApp() || {};

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-xl tracking-tight text-slate-900">
            {siteSettings?.brandName || 'BekasiKerja.id'}
          </a>
          <nav className="flex items-center gap-4 text-xs font-semibold">
            <a href="/" className="text-blue-600">Beranda</a>
            <a href="/admin" className="text-slate-600 hover:text-slate-900">Admin</a>
            <a href="/cv-builder" className="text-slate-600 hover:text-slate-900">CV Builder</a>
          </nav>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-slate-900 text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {siteSettings?.badgeText || 'PORTAL LOWONGAN KERJA BEKASI & KARAWANG'}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {siteSettings?.heroTitle || 'Temukan Karir Impianmu di Kawasan Industri'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
            {siteSettings?.heroSubtitle || 'Update lowongan kerja operator, admin, hingga engineering terpercaya setiap hari.'}
          </p>
        </div>
      </section>

      {/* LIST POSTINGAN LOKER TERBARU */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Lowongan Kerja Terbaru</h2>
            <p className="text-xs text-slate-500">Lowongan terverifikasi di Bekasi, Cikarang, & Karawang</p>
          </div>
          <span className="bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-100">
            {jobs.length} Lowongan
          </span>
        </div>

        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 transition hover:border-blue-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                      {job.category || 'Manufaktur'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1">{job.title}</h3>
                    <p className="text-xs font-semibold text-slate-600">{job.company}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {job.desc}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t pt-3 border-slate-100">
                  <span>📍 {job.location}</span>
                  <span className="text-rose-600 font-bold">S/d: {job.deadline}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-400">Belum ada lowongan diposting.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}