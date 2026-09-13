'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SearchBar from '../../components/SearchBar';
import { JobCard } from '../../components/Cards';
import { MapPin, Briefcase, Clock } from 'lucide-react';

export default function LowonganPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('type', 'job')
      .order('created_at', { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      !query ||
      [j.title, j.company, j.location, j.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/#lowongan" searchPlaceholder="Cari lowongan..." />

      <main>
        <section className="hero" style={{ paddingBottom: 'var(--sp-12)' }}>
          <div className="container">
            <div>
              <span className="badge">LOWONGAN KERJA TERVERIFIKASI</span>
              <h1>Semua Lowongan Kerja</h1>
              <p>Daftar lengkap lowongan kerja kawasan industri Bekasi, Cikarang, dan Karawang. Update setiap hari.</p>
              <div className="hero-search" style={{ marginTop: 16 }}>
                <SearchBar value={query} onChange={setQuery} placeholder="Cari lowongan, perusahaan, atau lokasi..." />
              </div>
            </div>
            <div>
              <img className="illus" src="/placeholder.svg" alt="Lowongan kerja Bekasi" style={{ background: 'rgba(255,255,255,.15)' }} />
            </div>
          </div>
        </section>

        <section className="container section" style={{ paddingTop: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-20) 0' }}>
              <p className="text-muted">Memuat lowongan...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
              <Briefcase size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: 8 }}>
                {query ? 'Tidak ada lowongan yang cocok' : 'Belum ada lowongan'}
              </h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                {query
                  ? `Tidak ditemukan lowongan untuk "${query}". Coba kata kunci lain.`
                  : 'Lowongan kerja akan muncul di sini setelah admin memposting.'}
              </p>
              {query && (
                <button onClick={() => setQuery('')} className="btn-secondary" style={{ marginTop: 16 }}>
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
                  Menampilkan {filteredJobs.length} lowongan
                </p>
              </div>
              <div className="card-grid">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
