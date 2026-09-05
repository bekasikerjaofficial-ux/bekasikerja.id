'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import SearchBar from '../components/SearchBar';
import CookieConsent from '../components/CookieConsent';
import CategoryChips from '../components/CategoryChips';
import { JobCard, NewsCard, SidebarItem } from '../components/Cards';
import FeaturedSlider from '../components/FeaturedSlider';
import Reveal from '../components/Reveal';
import PackageCTA from '../components/PackageCTA';
import { Newspaper, Briefcase } from 'lucide-react';

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

      {/* CATEGORY CHIPS (pill filter row — visual) */}
      <CategoryChips />

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
              <div className="hero-search">
                <SearchBar value={query} onChange={setQuery} placeholder="Cari lowongan, perusahaan, atau artikel..." />
              </div>
            </div>
            <div>
              <img
                className="illus"
                src={settings?.hero_image_url || '/placeholder.svg'}
                alt="Kawasan industri Bekasi"
                style={{ background: 'rgba(255,255,255,.1)', display: (settings?.hero_image_url ? 'block' : 'none') }}
              />
            </div>
          </div>
        </section>

        {/* FEATURED SLIDER (carousel of top jobs) */}
        <Reveal as="section" className="container section" style={{ paddingTop: 0 }}>
          <FeaturedSlider jobs={jobs.slice(0, 8)} />
        </Reveal>

        {/* 4 PAKET CTA PSIKOTES */}
        <PackageCTA />

        {/* SPLIT CONTENT: Jobs (main) + Articles (sidebar) */}
        <Reveal as="div" className="container section" delay={80}>
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
                    <div className="stagger" key={job.id}>
                      <JobCard job={job} />
                    </div>
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
        </Reveal>

        {/* ARTIKEL TERKINI — Section baru di bawah Lifestyle, bukan di slider */}
        <Reveal as="section" className="container section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              📰 Artikel Terkini
            </h2>
            <a href="/ump-indonesia-2026" className="link-more">Lihat Semua Artikel ›</a>
          </div>
          <div className="card-grid">
            {/* Artikel 1: Daftar UMP Indonesia 2026 */}
            <div className="stagger">
              <div className="card" style={{ cursor: 'pointer' }}>
                <div className="body" style={{ padding: 24 }}>
                  <span className="badge-tag job">INFO KERJA</span>
                  <h3 style={{ marginBottom: 8 }}>Daftar UMP Indonesia Tahun 2026</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 12 }}>
                    Update terbaru besaran Upah Minimum Provinsi di seluruh 38 provinsi Indonesia. Bandingkan gaji minimum daerahmu!
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>
                    <span>38 Provinsi</span>
                    <span>·</span>
                    <span>Rp5,7jt UMP Tertinggi</span>
                  </div>
                  <a href="/ump-indonesia-2026" className="btn-primary" style={{ display: 'inline-flex', marginTop: 12, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            </div>

            {/* Artikel 2: UMK Jawa Tengah 2026 */}
            <div className="stagger">
              <div className="card" style={{ cursor: 'pointer' }}>
                <div className="body" style={{ padding: 24 }}>
                  <span className="badge-tag news">WILAYAH</span>
                  <h3 style={{ marginBottom: 8 }}>UMK Jawa Tengah 2026</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 12 }}>
                    Daftar lengkap UMK Jawa Tengah 2026 — semua kabupaten/kota di Jateng. Update dari Keputusan Gubernur.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>
                    <span>33+6 Kab/Kota</span>
                    <span>·</span>
                    <span>UMK Sampai Rp4,6jt</span>
                  </div>
                  <a href="/umk-jawa-tengah-2026" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 12, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            </div>

            {/* Artikel 3: UMP DKI Jakarta 2026 */}
            <div className="stagger">
              <div className="card popular" style={{ cursor: 'pointer' }}>
                <div className="body" style={{ padding: 24 }}>
                  <span className="badge-tag job">🏆 TERKINI</span>
                  <h3 style={{ marginBottom: 8 }}>UMP DKI Jakarta 2026</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 12 }}>
                    Rp5.729.876 per bulan — tertinggi di Indonesia! Update terbaru besaran UMP DKI Jakarta tahun 2026.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>
                    <span>#1 Nasional</span>
                    <span>·</span>
                    <span>+6,17% Kenaikan</span>
                  </div>
                  <a href="/ump-dki-jakarta-2026" className="btn-primary" style={{ display: 'inline-flex', marginTop: 12, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            </div>

            {/* Artikel 4: UMK Jawa Timur 2026 */}
            <div className="stagger">
              <div className="card" style={{ cursor: 'pointer' }}>
                <div className="body" style={{ padding: 24 }}>
                  <span className="badge-tag news">WILAYAH</span>
                  <h3 style={{ marginBottom: 8 }}>UMK Jawa Timur 2026</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 12 }}>
                    Daftar lengkap UMK Jawa Timur 2026 — 35 kabupaten/kota. Data resmi dari Gubernur Jatim.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>
                    <span>38 Wilayah</span>
                    <span>·</span>
                    <span>UMK Sampai Rp5,2jt</span>
                  </div>
                  <a href="/umk-jawa-timur-2026" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 12, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            </div>

            {/* Artikel 5: UMK Banten 2026 */}
            <div className="stagger">
              <div className="card" style={{ cursor: 'pointer' }}>
                <div className="body" style={{ padding: 24 }}>
                  <span className="badge-tag job">JABODETABEK</span>
                  <h3 style={{ marginBottom: 8 }}>UMK Banten 2026</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 12 }}>
                    Daftar lengkap UMK Banten 2026 — 4 kabupaten + 4 kota. Zona industri Cilegon & Tangerang.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>
                    <span>4K+4Kab</span>
                    <span>·</span>
                    <span>UMK Sampai Rp5,4jt</span>
                  </div>
                  <a href="/umk-banten-2026" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 12, textDecoration: 'none', fontSize: 12, padding: '8px 16px' }}>
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter brand={settings?.brand_name || 'BekasiKerja.id'} />
      <CookieConsent />
    </div>
  );
}
