'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter'
import ShareButtons from '../../../components/ShareButtons';
import { NewsCard } from '../../../components/Cards';
import PackageCTA from '../../../components/PackageCTA';
import { Newspaper } from 'lucide-react';

export default function ArtikelPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(data);

      if (data) {
        const { data: candidates } = await supabase
          .from('posts')
          .select('*')
          .eq('type', 'news')
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(8);

        setLatestPosts((candidates || []).slice(0, 3));
        const sameCategory = (candidates || []).filter((item) => (
          data.category && item.category === data.category
        ));
        const otherNews = (candidates || []).filter((item) => (
          !data.category || item.category !== data.category
        ));
        setRelatedPosts([...sameCategory, ...otherNews].slice(0, 4));
      }

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
        <p className="text-muted" style={{ fontSize: 14 }}>Artikel tidak ditemukan.</p>
        <Link href="/" style={{ color: 'var(--hl-blue)', fontWeight: 700, fontSize: 13 }}>← Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/ump-indonesia-2026" showSearch={false} />

      <main className="container section" style={{ maxWidth: 860 }}>
        {post.image_url && (
          <Image
            src={post.image_url}
            alt={post.title}
            width={860}
            height={280}
            style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 16, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-card)' }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <span className="badge-tag news">{post.category || 'Artikel'}</span>
          {post.created_at && (
            <span className="text-muted" style={{ fontSize: 12 }}>
              {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        <h1 className="h-display" style={{ fontSize: 30, marginTop: 12 }}>{post.title}</h1>
        {post.company && (
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}>{post.company}</p>
        )}

        <article className="panel" style={{ marginTop: 24, padding: 24, fontSize: 14, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-line' }}>
          {post.content}
        </article>

        {latestPosts.length > 0 && (
          <section className="panel" aria-labelledby="latest-title" style={{ marginTop: 24, padding: 20 }}>
            <h2 id="latest-title" className="related-title" style={{ marginBottom: 14 }}>
              <Newspaper size={20} color="var(--hl-blue)" /> Berita Terbaru
            </h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {latestPosts.map((item) => (
                <Link key={item.id} href={`/artikel/${item.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-900)', textDecoration: 'none' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.45 }}>{item.title}</span>
                  <span style={{ flexShrink: 0, color: 'var(--hl-blue)', fontWeight: 700, fontSize: 12 }}>Baca →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="related-articles" aria-labelledby="related-title">
            <div className="section-head">
              <div>
                <h2 id="related-title" className="related-title">
                  <Newspaper size={20} color="var(--hl-blue)" /> Artikel Terkait
                </h2>
                <p className="text-muted related-subtitle">
                  Berita dan tips karir lain yang mungkin bermanfaat untukmu.
                </p>
              </div>
            </div>
            <div className="related-grid">
              {relatedPosts.map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, textDecoration: 'none' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </main>

      <PackageCTA />

      <SiteFooter />
      <ShareButtons title={post?.title ? `${post.title} — BekasiKerja.id` : ''} />
    </div>
  );
}
