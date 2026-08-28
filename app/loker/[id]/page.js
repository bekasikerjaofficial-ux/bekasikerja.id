'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="auth-wrap">
        <p className="text-muted" style={{ fontSize: 13 }}>Memuat artikel...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="auth-wrap" style={{ flexDirection: 'column', gap: 16 }}>
        <p className="text-muted" style={{ fontSize: 14 }}>Konten tidak ditemukan.</p>
        <Link href="/" style={{ color: 'var(--hl-blue)', fontWeight: 700, fontSize: 13 }}>← Kembali ke Beranda</Link>
      </div>
    );
  }

  const isJob = post.type === 'job';

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active={isJob ? '/#lowongan' : '/#lifestyle'} showSearch={false} />

      <main className="container section" style={{ maxWidth: 860 }}>
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 16, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-card)' }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <span className={`badge-tag ${isJob ? 'job' : 'news'}`}>
            {isJob ? 'Lowongan Kerja' : (post.category || 'Artikel')}
          </span>
          {isJob && post.location && (
            <span className="text-muted" style={{ fontSize: 13 }}>📍 {post.location}</span>
          )}
        </div>

        <h1 className="h-display" style={{ fontSize: 30, marginTop: 12 }}>{post.title}</h1>

        {isJob && post.company && (
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}>{post.company}</p>
        )}
        {isJob && post.deadline && (
          <p style={{ fontSize: 12, color: 'var(--hl-red)', fontWeight: 700 }}>Batas lamar: {post.deadline}</p>
        )}

        <article className="panel" style={{ marginTop: 24, padding: 24, fontSize: 14, lineHeight: 1.7, color: 'var(--gray-700)', whiteSpace: 'pre-line' }}>
          {post.content}
        </article>

        {isJob && (
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,92,171,.06)', border: '1px solid rgba(0,92,171,.2)', borderRadius: 16, fontSize: 13, color: 'var(--hl-blue-dark)' }}>
            <strong>Cara melamar:</strong> Kirim CV &amp; berkas ke email HRD perusahaan, atau datang
            langsung ke alamat kawasan industri tertera. Pastikan melengkapi persyaratan sebelum
            batas waktu lamaran.
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href="/" style={{ color: 'var(--hl-blue)', fontWeight: 700, fontSize: 13 }}>← Kembali ke Beranda</Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
