'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestsPage() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => {
        if (active) setCount(count ?? 0);
      })
      .catch(() => {
        if (active) setCount(0);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <h1 className="text-xl font-bold mb-4">Halaman Testing</h1>
      <p className="text-xs text-slate-500 mb-4">
        Total Lowongan Terdaftar: {count === null ? 'Memuat...' : count}
      </p>
      <a href="/" className="text-xs font-bold text-blue-600 underline">← Kembali ke Beranda</a>
    </div>
  );
}
