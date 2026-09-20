'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SearchBar from '../../components/SearchBar';
import { JobCard } from '../../components/Cards';
import { MapPin, Briefcase, Clock } from 'lucide-react';

export default function LowonganClient({ initialJobs = [] }) {
  const [jobs] = useState(initialJobs);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workSystem, setWorkSystem] = useState('');

  const filteredJobs = jobs.filter(
    (j) =>
      !query ||
      [j.title, j.company, j.location, j.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
  ).filter((j) => (
    (!location || j.location === location) &&
    (!employmentType || j.employment_type === employmentType || j.employmentType === employmentType) &&
    (!workSystem || j.work_system === workSystem || j.workSystem === workSystem)
  ));

  const locations = [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort();
  const employmentTypes = [...new Set(jobs.map((job) => job.employment_type || job.employmentType).filter(Boolean))].sort();
  const workSystems = [...new Set(jobs.map((job) => job.work_system || job.workSystem).filter(Boolean))].sort();

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
              <div className="job-filter-row" aria-label="Filter lowongan">
                <select value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Filter lokasi">
                  <option value="">Semua lokasi</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} aria-label="Filter jenis pekerjaan">
                  <option value="">Semua jenis kerja</option>
                  {employmentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={workSystem} onChange={(event) => setWorkSystem(event.target.value)} aria-label="Filter sistem kerja">
                  <option value="">Semua sistem kerja</option>
                  {workSystems.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div>
              <img className="illus" src="/placeholder.svg" alt="Lowongan kerja Bekasi" style={{ background: 'rgba(255,255,255,.15)' }} />
            </div>
          </div>
        </section>

        <section className="container section" style={{ paddingTop: 0 }}>
          {filteredJobs.length === 0 ? (
            <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
              <Briefcase size={48} color="var(--gray-300)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ marginBottom: 8 }}>
                {query ? 'Tidak ada lowongan yang cocok' : 'Belum ada lowongan'}
              </h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                {query
                  ? `Tidak ditemukan lowongan untuk "${query}". Coba kata kunci lain.`
                  : 'Lowongan sedang diperbarui. Daftar sekarang untuk mendapatkan notifikasi lowongan terbaru.'}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                {(query || location || employmentType || workSystem) && (
                  <button onClick={() => { setQuery(''); setLocation(''); setEmploymentType(''); setWorkSystem(''); }} className="btn-secondary">
                    Reset Pencarian
                  </button>
                )}
                <Link href="/member/register" className="btn-primary" style={{ textDecoration: 'none' }}>Daftar Gratis</Link>
              </div>
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
