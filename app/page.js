'use client';
import React, { useState, useEffect } from 'react';

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Management Trainee (MT) - Operational",
    company: "PT Central Bank Asia Tbk",
    location: "Kota Bekasi (KCP Juanda)",
    salary: "Rp 7.500.000 - Rp 9.000.000",
    tag: "URGENT HIRING",
    deadline: "31 Agustus 2026"
  },
  {
    id: 2,
    title: "Senior Operator Produksi & Technical Staff",
    company: "PT Astra Honda Motor",
    location: "Kawasan EJIP, Cikarang",
    salary: "Rp 5.800.000 - Rp 6.700.000",
    tag: "REKRUTMEN MASSAL",
    deadline: "05 September 2026"
  }
];

const REGULAR_JOBS = [
  {
    id: 101,
    title: "Staff Admin Gudang & Logistik",
    company: "PT Logistik Maju Bersama",
    location: "Bekasi Barat",
    type: "Full-time",
    salary: "Rp 4.800.000 - Rp 5.300.000",
    posted: "3 jam lalu"
  },
  {
    id: 102,
    title: "Teknisi Maintenance Mesin Industri",
    company: "PT Hyundai Motor Manufacturing",
    location: "GIIC Deltamas",
    type: "Contract",
    salary: "Rp 5.500.000 - Rp 7.000.000",
    posted: "1 hari lalu"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [member, setMember] = useState({ isLoggedIn: false, name: '' });

  // Deteksi status login saat halaman dibuka
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isMemberLoggedIn') === 'true';
    const name = localStorage.getItem('memberName') || 'Member';
    setMember({ isLoggedIn, name });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_JOBS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isMemberLoggedIn');
    localStorage.removeItem('memberName');
    setMember({ isLoggedIn: false, name: '' });
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % FEATURED_JOBS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? FEATURED_JOBS.length - 1 : prev - 1));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Top Bar */}
      <div className="bg-blue-900 text-blue-100 text-xs py-2 px-4 font-medium">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded">NEW</span>
            <span>Akses Tes Psikotes & Generator CV ATS Gratis untuk Member!</span>
          </div>
          <div className="hidden md:flex gap-4">
            <a href="#cv" className="hover:text-white">Bikin CV</a>
            <span>|</span>
            <a href="#psikotes" className="text-yellow-300 font-bold hover:underline">Member PRO</a>
          </div>
        </div>
      </div>

      {/* Navbar Dinamis (Deteksi Login) */}
      <header className="bg-white text-blue-900 sticky top-0 z-50 shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white font-black px-3 py-1.5 rounded-lg text-lg tracking-widest shadow">
              BK
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-blue-900">BEKASI</span>
              <span className="text-xl font-bold text-blue-600">KERJA</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#" className="text-blue-900 border-b-2 border-blue-900 pb-1 font-bold">Cari Loker</a>
            <a href="#berita" className="hover:text-blue-900">Berita & Artikel</a>
            <a href="#cv" className="hover:text-blue-900">Buat CV (Free)</a>
            <a href="#psikotes" className="text-amber-600 font-bold flex items-center gap-1">
              Tes Psikotes (PRO)
            </a>
          </nav>

          {/* Area Tombol Header Dinamis */}
          <div className="flex items-center gap-3">
            {member.isLoggedIn ? (
              <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  👋 {member.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded transition"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <a href="/member/login" className="px-4 py-2 text-xs font-bold text-blue-900 hover:text-blue-700">
                  Masuk
                </a>
                <a href="/member/register" className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow">
                  Daftar Member
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-100 py-10 px-4 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Lowongan Kerja Prioritas Minggu Ini</h2>
            </div>
            
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm">
                ❮
              </button>
              <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm">
                ❯
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-6 md:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="bg-amber-400 text-blue-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {FEATURED_JOBS[currentSlide].tag}
                </span>

                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {FEATURED_JOBS[currentSlide].title}
                </h1>

                <div className="space-y-1 text-blue-100 text-xs md:text-sm">
                  <p className="font-semibold text-white">
                    🏢 {FEATURED_JOBS[currentSlide].company}
                  </p>
                  <p className="text-slate-200">
                    📍 {FEATURED_JOBS[currentSlide].location} <span className="mx-2">|</span> 💰 {FEATURED_JOBS[currentSlide].salary}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 shrink-0 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                <span className="text-[11px] text-blue-100 text-center">
                  Batas Lamaran: <strong className="text-amber-300">{FEATURED_JOBS[currentSlide].deadline}</strong>
                </span>
                <button className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-extrabold px-6 py-2.5 rounded-lg text-xs transition shadow">
                  Lamar Sekarang ➔
                </button>
                <button className="bg-blue-950/60 hover:bg-blue-950 border border-white/30 text-white font-semibold px-6 py-2 rounded-lg text-xs transition">
                  Simpan Loker
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {FEATURED_JOBS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-blue-900" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feed & Footer */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full flex-1">
        <aside className="bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Filter Cepat</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked /> Kawasan Industri Cikarang
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked /> Perbankan & Office Bekasi
            </label>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b pb-2">Lowongan Terbaru Lainnya</h2>
          {REGULAR_JOBS.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-700 transition shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                <p className="text-xs text-slate-600">{job.company} — <span className="text-slate-400">{job.location}</span></p>
                <p className="text-xs text-emerald-700 font-bold mt-1">{job.salary}</p>
              </div>
              <button className="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-800 shadow-sm">
                Lamar
              </button>
            </div>
          ))}
        </section>
      </main>

      <footer className="bg-blue-950 text-blue-200 py-6 text-center text-xs">
        <p>© 2026 BekasiKerja.id — Portal Lowongan Kerja Terpercaya Bekasi</p>
      </footer>
    </div>
  );
}
