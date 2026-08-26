'use client';
import React from 'react';
import { useApp } from '../AppContext';

export default function TestsPage() {
  const { jobs = [] } = useApp() || {};

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <h1 className="text-xl font-bold mb-4">Halaman Testing</h1>
      <p className="text-xs text-slate-500 mb-4">Total Lowongan Terdaftar: {jobs.length}</p>
      <a href="/" className="text-xs font-bold text-blue-600 underline">← Kembali ke Beranda</a>
    </div>
  );
}
