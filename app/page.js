'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import SearchBar from '../components/SearchBar';
import CookieConsent from '../components/CookieConsent';
import { JobCard, NewsCard, SidebarItem } from '../components/Cards';
import { Factory, Briefcase, Wrench, Package, Truck, Newspaper, Brain, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: st } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (st) setSettings(st);

    const { data: allPosts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (allPosts) {
      setJobs(allPosts.filter((p) => p.type === 'job').slice(0, 6));
      setNews(allPosts.filter((p) => p.type === 'news').slice(0, 6));
    }
  };

  const filteredJobs = jobs.filter(
    (j) => !query || [j.title, j.company, j.location].join(' ').toLowerCase().includes(query.toLowerCase())
  );
  const filteredNews = news.filter(
    (n) => !query || [n.title, n.category].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <a href="#main" className="skip-link">Lewati ke konten</a>

      {/* PROMO STRIP (HeyLaw motif) */}
      <div className="promo-strip">
        Portal karir terverifikasi Bekasi &amp; Karawang —{' '}
        <a href="/member/register">Daftar member gratis</a>
      </div>

      {/* HEADER */}
      <SiteHeader
        brand={settings?.brand_name || 'BekasiKerja.id'}
        logoUrl={settings?.logo_url || null}
        active="/"
      />

      {/* CATEGORY ICON BAR (HeyLaw module) */}
      <div className="cat-bar">
        <div className="container">
          {[
            { icon: Factory, label: 'Manufaktur' },
            { icon: Briefcase, label: 'Admin' },
            { icon: Wrench, label: 'Engineering' },
            { icon: Package, label: 'Gudang' },
            { icon: Truck, label: 'Logistik' },
            { icon: BookOpen, label: 'Tips Karir' },
            { icon: Brain, label: 'Psikotes' },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <a key={c.label} href="/#lowongan" className="cat">
                <span className="circle"><Icon size={20} /></span>
                <span>{c.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <main id="main">
        {/* HERO (HeyLaw gradient + BCA blue) */}
        <section className="hero">
          <div className="container">
            <div>
              <span className="badge">{settings?.badge_text || 'PORTAL KARIR TERVERIFIKASI'}</span>
              <h1>{settings?.hero_title || 'Temukan Karir Impianmu di Kawasan Industri'}</h1>
              <p>{settings?.hero_subtitle || 'Update lowongan kerja operator, admin, hingga engineering terpercaya setiap hari.'}</p>
              <div className="stats">
                <div className="stat">
                  <div className="num">{jobs.length}+</div>
                  <div className="lbl">Lowongan Aktif</div>
                </div>
                <div className="stat">
                  <div className="num">{news.length}+</div>
                  <div className="lbl">Artikel &amp; Tips</div>
                </div>
                <div className="stat">
                  <div className="num">3</div>
                  <div className="lbl">Kawasan Industri</div>
                </div>
              </div>
            </div>
            <div>
              <img
                className="illus"
                src={settings?.hero_image_url || '/placeholder.svg'}
                alt="Kawasan industri Bekasi"
                style={{ background: 'rgba(255,255,255,.1)' }}
              />
            </div>
          </div>
        </section>

        {/* SEARCH CARD (BCA style) */}
        <div className="container" style={{ marginTop: -24, position: 'relative', zIndex: 10 }}>
          <SearchBar value={query} onChange={setQuery} placeholder="Cari lowongan, perusahaan, atau artikel..." />
        </div>

        {/* SPLIT CONTENT: Jobs (main) + Articles (sidebar) */}
        <div className="container section">
          <div className="split">
            {/* MAIN: LOWONGAN */}
            <section id="lowongan" className="scroll-mt-20">
              <div className="section-head">
                <div>
                  <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={22} color="var(--hl-blue)" /> Lowongan Kerja Terbaru
                  </h2>
                  <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
                    Info loker terverifikasi kawasan Bekasi, Cikarang, &amp; Karawang
                  </p>
                </div>
                <a href="/#lowongan" className="link-more">Lihat Semua ›</a>
              </div>

              {filteredJobs.length === 0 ? (
                <p className="text-muted" style={{ fontSize: 13 }}>Belum ada lowongan yang cocok.</p>
              ) : (
                <div className="card-grid">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </section>

            {/* SIDEBAR: LIFESTYLE & ARTICLES */}
            <aside id="lifestyle" className="side scroll-mt-20">
              <div className="panel" style={{ padding: 16 }}>
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Newspaper size={18} color="var(--hl-blue)" /> Lifestyle &amp; Tips Karir
                </h3>
                {filteredNews.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: 13 }}>Belum ada artikel.</p>
                ) : (
                  filteredNews.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                  ))
                )}
                <a href="/#lifestyle" className="btn-secondary" style={{ display: 'block', textAlign: 'center', marginTop: 12, textDecoration: 'none' }}>
                  Lihat Artikel Lainnya
                </a>
              </div>
            </aside>
          </div>

          {/* LIFESTYLE GRID (bawah, full width) */}
          <section id="lifestyle-grid" className="scroll-mt-20" style={{ marginTop: 48 }}>
            <div className="section-head">
              <div>
                <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Newspaper size={22} color="var(--hl-blue)" /> Lifestyle &amp; Tips Karir
                </h2>
                <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
                  Panduan kerja, psikotes, hingga berita industri terkini
                </p>
              </div>
            </div>
            <div className="card-grid">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter brand={settings?.brand_name || 'BekasiKerja.id'} />
      <CookieConsent />
    </div>
  );
}
