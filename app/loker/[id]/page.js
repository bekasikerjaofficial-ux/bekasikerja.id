'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      setPost(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500 font-sans">
        Memuat artikel...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-sm text-slate-600">Konten tidak ditemukan.</p>
        <Link href="/" className="text-xs text-blue-600 font-bold">← Kembali ke Beranda</Link>
      </div>
    );
  }

  const isJob = post.type === 'job';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-blue-900">
            {isJob ? '💼 Lowongan' : '📰 Artikel'}
          </Link>
          <Link href="/" className="text-xs text-blue-600 font-bold">← Beranda</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl border border-slate-200 shadow-sm"
          />
        )}

        <div className="mt-6 flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${isJob ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
            {isJob ? 'Lowongan Kerja' : (post.category || 'Artikel')}
          </span>
          {isJob && post.location && (
            <span className="text-[11px] text-slate-500">📍 {post.location}</span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3 leading-tight">
          {post.title}
        </h1>

        {isJob && post.company && (
          <p className="text-sm font-semibold text-slate-600 mt-1">{post.company}</p>
        )}
        {isJob && post.deadline && (
          <p className="text-[11px] text-rose-600 font-bold mt-1">Batas lamar: {post.deadline}</p>
        )}

        <article className="mt-6 text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {post.content}
        </article>

        {isJob && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900">
            <strong>Cara melamar:</strong> Kirim CV & berkas ke email HRD perusahaan, atau datang
            langsung ke alamat kawasan industri tertera. Pastikan melengkapi persyaratan sebelum
            batas waktu lamaran.
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-xs text-blue-600 font-bold">← Kembali ke Beranda</Link>
        </div>
      </main>
    </div>
  );
}
