'use client';
import React from 'react';
import Navbar from '@/app/components/Navbar';

export default function CvBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">CV Builder (Ats Friendly)</h1>
        <p className="text-xs text-slate-500 mb-8">Fitur pembuatan CV otomatis sedang diperbarui.</p>
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <p className="text-xs text-slate-600 font-medium">Segera hadir untuk membantu kamu membuat CV standar pabrik dan korporat!</p>
        </div>
      </div>
    </div>
  );
}
