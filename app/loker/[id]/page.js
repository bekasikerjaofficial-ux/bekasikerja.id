'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import { MapPin } from 'lucide-react'
import ShareButtons from '../../../components/ShareButtons';
import RichArticleContent from '../../../components/RichArticleContent';
import LatestNewsLinks from '../../../components/LatestNewsLinks';
import PackageCTA from '../../../components/PackageCTA';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data: legacyPost } = await supabase.from('posts').select('*').eq('id', id).single();
      if (legacyPost) {
        setPost(legacyPost);
      } else if (String(id).startsWith('employer-')) {
        const employerId = String(id).replace(/^employer-/, '');
        const { data: employerJob } = await supabase.from('employer_jobs').select('*, companies(name, logo_url)').eq('id', employerId).eq('status', 'active').single();
        if (employerJob) {
          setPost({ ...employerJob, id, type: 'job', company: employerJob.companies?.name, image_url: employerJob.companies?.logo_url, deadline: employerJob.application_deadline, content: employerJob.description || '', title: employerJob.title });
          const sessionKey = window.localStorage.getItem('bk_view_session') || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          window.localStorage.setItem('bk_view_session', sessionKey);
          fetch(`/api/employer/jobs/${employerId}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sessionKey }) }).catch(() => {});
        }
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
        <p className="text-muted" style={{ fontSize: 14 }}>Konten tidak ditemukan.</p>
        <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, textDecoration: 'none' }}>← Kembali ke Beranda</Link>
      </div>
    );
  }

  const isJob = post.type === 'job';
  const isEmployerJob = String(post.id).startsWith('employer-');
  const applyUrl = isJob
    ? post.content?.match(/https?:\/\/(?:id\.jobstreet\.com|www\.linkedin\.com)\/[^\s)\\\\]+/)?.[0]
    : '';

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active={isJob ? '/#lowongan' : '/#lifestyle'} showSearch={false} />

      <main className="container section" style={{ maxWidth: 860 }}>
        {post.image_url && (
          <Image
            src={post.image_url}
            alt={post.title}
            width={860}
            height={280}
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 16, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-card)' }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <span className={`badge-tag ${isJob ? 'job' : 'news'}`}>
            {isJob ? 'Lowongan Kerja' : (post.category || 'Artikel')}
          </span>
          {isJob && post.location && (
            <span className="text-muted" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} /> {post.location}
            </span>
          )}
        </div>

        <h1 className="h-display" style={{ fontSize: 30, marginTop: 12 }}>{post.title}</h1>

        {isJob && post.company && (
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}>{post.company}</p>
        )}
        {isJob && post.deadline && (
          <p style={{ fontSize: 12, color: 'var(--hl-red)', fontWeight: 700 }}>Batas lamar: {post.deadline}</p>
        )}
        <ShareButtons inline title={post?.title ? `${post.title} — BekasiKerja.id` : ''} />

        <article className="panel" style={{ marginTop: 24, padding: '28px 30px', color: 'var(--gray-700)' }}>
          <RichArticleContent content={post.content} hideApplyLinks={isJob} />
        </article>

        {isEmployerJob && (
          <form className="panel" style={{ marginTop: 24, padding: 24 }} onSubmit={async (event) => {
            event.preventDefault();
            setApplyMessage('Mengirim lamaran...');
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) { setApplyMessage('Silakan login terlebih dahulu untuk melamar.'); return; }
            const response = await fetch(`/api/jobs/${post.id.replace('employer-', '')}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session.access_token}` }, body: JSON.stringify({ coverLetter }) });
            const payload = await response.json().catch(() => ({}));
            setApplyMessage(response.ok ? 'Lamaran berhasil dikirim.' : (payload.error || 'Lamaran gagal dikirim.'));
          }}>
            <h2 className="h-section" style={{ marginTop: 0 }}>Lamar Lowongan Ini</h2>
            <div className="field"><label>Pesan lamaran (opsional)</label><textarea rows="4" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Ceritakan secara singkat pengalaman yang relevan." /></div>
            <button className="btn-primary" type="submit">Kirim Lamaran</button>
            {applyMessage && <p className="text-muted" style={{ fontSize: 13 }}>{applyMessage}</p>}
          </form>
        )}

        {isJob && applyUrl && (
          <a className="job-apply-cta" href={applyUrl} target="_blank" rel="noopener noreferrer">
            Lamaran cepat
          </a>
        )}

        {isJob && (
          <div style={{ marginTop: 24, padding: 16, background: 'rgba(0,92,171,.06)', border: '1px solid rgba(0,92,171,.2)', borderRadius: 16, fontSize: 13, color: 'var(--hl-blue-dark)' }}>
            <strong>Cara melamar:</strong> Kirim CV &amp; berkas ke email HRD perusahaan, atau datang
            langsung ke alamat kawasan industri tertera. Pastikan melengkapi persyaratan sebelum
            batas waktu lamaran.
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, textDecoration: 'none' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </main>

      <LatestNewsLinks />
      <PackageCTA />

      <SiteFooter />
    </div>
  );
}
