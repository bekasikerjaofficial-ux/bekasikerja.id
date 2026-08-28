'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [news, setNews] = useState([]);
  const [sliderPosts, setSliderPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (sliderPosts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderPosts]);

  const fetchInitialData = async () => {
    const { data: st } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (st) setSettings(st);

    const { data: allPosts } = await supabase.from('posts').select('*').order('created_at', { ascending: false });

    if (allPosts) {
      setSliderPosts(allPosts.slice(0, 3));
      setJobs(allPosts.filter((p) => p.type === 'job').slice(0, 6));
      setNews(allPosts.filter((p) => p.type === 'news').slice(0, 6));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER NAVIGASI */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <a href="/" className="font-extrabold text-xl tracking-tight text-blue-900 flex items-center gap-2">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
              <span>💼</span>
            )}
            <span>{settings?.brand_name || 'BekasiKerja.id'}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="/" className="text-blue-600 font-bold">Beranda</a>
            <a href="#lowongan" className="hover:text-blue-600 transition">Lowongan</a>
            <a href="#lifestyle" className="hover:text-blue-600 transition">Lifestyle</a>

          </nav>

          <div className="flex items-center gap-2.5 text-xs font-bold">
            <a href="/member/register" className="bg-slate-100 text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200">
              Daftar Member
            </a>
            <a href="/member/login" className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm">
              Login Member
            </a>
          </div>

        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-slate-900 text-white py-10 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            {settings?.badge_text || 'PORTAL KARIR TERVERIFIKASI'}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {settings?.hero_title || 'Temukan Pekerjaan Impianmu di Bekasi & Cikarang'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
            {settings?.hero_subtitle || 'Info lowongan kerja industri manufaktur terupdate dan tips karir harian.'}
          </p>
        </div>
      </section>

      {/* AUTO SLIDER */}
      {sliderPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 -mt-6">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-800">
            {sliderPosts.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <img src={slide.image_url || '/placeholder.svg'} alt="slide" className="w-full h-full object-cover brightness-50" />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent text-white space-y-2">
                  <span className="bg-blue-600 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                    {slide.type === 'job' ? 'Lowongan Utama' : 'Headline News'}
                  </span>
                  <h2 className="text-lg md:text-2xl font-extrabold line-clamp-1">{slide.title}</h2>
                  <p className="text-xs text-slate-300 line-clamp-2">{slide.content}</p>
                </div>
              </div>
            ))}

            <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
              {sliderPosts.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-white/50'}`}></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-2 flex items-center gap-2">
          <span className="text-slate-400 text-sm px-2">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lowongan, perusahaan, atau artikel..."
            className="flex-1 px-2 py-2 text-xs outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 px-2">✕</button>
          )}
        </div>
      </div>

      {/* DUAL GRID CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* GRID LOWONGAN KERJA */}
        <section id="lowongan" className="space-y-4 scroll-mt-20">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">💼 Lowongan Kerja Terbaru</h2>
              <p className="text-xs text-slate-500">Info loker terverifikasi kawasan Bekasi, Cikarang, & Karawang</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs
              .filter((j) =>
                !query ||
                [j.title, j.company, j.location].join(' ').toLowerCase().includes(query.toLowerCase())
              )
              .map((job) => (
              <Link key={job.id} href={`/loker/${job.id}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={job.image_url || '/placeholder.svg'} alt="pt" className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs line-clamp-1">{job.title}</h3>
                      <p className="text-[11px] font-semibold text-slate-500">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">{job.content}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                  <span>📍 {job.location || 'Kawasan Industri'}</span>
                  <span className="text-rose-600 font-bold">S/d: {job.deadline || 'Secepatnya'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* GRID LIFESTYLE & TIPS KARIR */}
        <section id="lifestyle" className="space-y-4 scroll-mt-20">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">📰 Lifestyle & Tips Karir</h2>
              <p className="text-xs text-slate-500">Panduan kerja, psikotes, hingga berita industri terkini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news
              .filter((n) =>
                !query ||
                [n.title, n.category].join(' ').toLowerCase().includes(query.toLowerCase())
              )
              .map((item) => (
              <Link key={item.id} href={`/loker/${item.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <img src={item.image_url || '/placeholder.svg'} alt="cover" className="w-full h-32 object-cover" />
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">{item.category || 'Lifestyle'}</span>
                    <h3 className="font-extrabold text-slate-900 text-xs line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
