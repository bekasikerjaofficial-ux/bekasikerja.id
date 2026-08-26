'use client';
import React from 'react';

export default function CvBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER SIMPLE */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-extrabold text-lg tracking-tight text-slate-900">
            Bekasi<span className="text-blue-600">Karawang</span>
          </a>
          <nav className="flex items-center gap-4 text-xs font-semibold">
            <a href="/" className="text-slate-600 hover:text-slate-900">Beranda</a>
            <a href="/admin" className="text-slate-600 hover:text-slate-900">Admin</a>
            <a href="/cv-builder" className="text-blue-600">CV Builder</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">CV Builder (ATS Friendly)</h1>
        <p className="text-xs text-slate-500 mb-8">Fitur pembuatan CV otomatis sedang diperbarui.</p>
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <p className="text-xs text-slate-600 font-medium">
            Segera hadir untuk membantu kamu membuat CV standar pabrik dan korporat!
          </p>
        </div>
      </div>
    </div>
  );
}
