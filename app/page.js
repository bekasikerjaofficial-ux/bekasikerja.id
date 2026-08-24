'use client';
import React, { useState, useEffect } from 'react';

// Data Lowongan Unggulan untuk Slider Banner
const FEATURED_JOBS = [
  {
    id: 1,
    title: "Management Trainee (MT) - Operational",
    company: "PT Central Bank Asia Tbk",
    location: "Kota Bekasi (KCP Juanda)",
    salary: "Rp 7.500.000 - Rp 9.000.000",
    tag: "URGENT HIRING",
    bgGradient: "from-blue-950 via-blue-900 to-indigo-950",
    deadline: "31 Agustus 2026"
  },
  {
    id: 2,
    title: "Senior Operator Produksi & Technical Staff",
    company: "PT Astra Honda Motor",
    location: "Kawasan EJIP, Cikarang",
    salary: "Rp 5.800.000 - Rp 6.700.000",
    tag: "REKRUTMEN MASSAL",
    bgGradient: "from-slate-900 via-blue-950 to-slate-900",
    deadline: "05 September 2026"
  },
  {
    id: 3,
    title: "Quality Control (QC) & QA Specialist",
    company: "PT Mayora Indah Tbk",
    location: "Kawasan MM2100, Cibitung",
    salary: "Rp 5.500.000 - Rp 6.500.000",
    tag: "FEATURED JOB",
    bgGradient: "from-indigo-950 via-blue-900 to-blue-950",
    deadline: "10 September 2026"
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

  // Auto slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_JOBS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % FEATURED_JOBS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? FEATURED_JOBS.length - 1 : prev - 1));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* Top Bar */}
      <div className="bg-blue-950 text-blue-200 text-xs py-2 px-4 border-b border-blue-900 font-medium">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-blue-950 text-[10px] font-extrabold px-2 py-0.5 rounded">NEW</span>
            <span>Akses Tes Psikotes & Generator CV ATS Gratis untuk Member!</span>
          </div>
          <div className="hidden md:flex gap-4">
            <a href="#cv" className="hover:text-white">Bikin CV</a>
            <span>|</span>
            <a href="#psikotes" className="text-yellow-400 font-bold hover:underline">Member PRO</a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 font-black px-3 py-1.5 rounded-lg text-lg tracking-widest shadow">
              BK
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">BEKASI</span>
              <span className="text-xl font-light text-blue-300">KERJA</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100">
            <a href="#" className="text-white border-b-2 border-yellow-400 pb-1 font-semibold">Cari Loker</a>
            <a href="#berita" className="hover:text-white">Berita & Artikel</a>
            <a href="#cv" className="hover:text-white">Buat CV (Free)</a>
            <a href="#psikotes" className="text-yellow-300 font-semibold flex items-center gap-1">
              <i className="fa-solid fa-crown text-xs"></i> Tes Psikotes (PRO)
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-semibold text-blue-100 hover:text-white">Masuk</button>
            <button className="px-4 py-2 text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-blue-950 rounded-lg shadow">Daftar Member</button>
          </div>
        </div>
      </header>

      {/* HERO SLIDER SECTION (LOKER TERBARU/UNGGULAN) */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-12 px-4 border-b border-blue-900">
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header Slider */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300">Lowongan Kerja Prioritas Minggu Ini</h2>
            </div>
            
            {/* Navigasi Panah */}
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-blue-900/80 hover:bg-blue-800 border border-blue-700 flex items-center justify-center text-white transition">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-blue-900/80 hover:bg-blue-800 border border-blue-700 flex items-center justify-center text-white transition">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>

          {/* Card Slider Utama */}
          <div className={`bg-gradient-to-r ${FEATURED_JOBS[currentSlide].bgGradient} border border-blue-800/80 rounded-2xl p-6 md:p-10 shadow-2xl transition-all duration-500`}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              
              <div className="space-y-4 max-w-2xl">
                <span className="bg-yellow-400 text-blue-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {FEATURED_JOBS[currentSlide].tag}
                </span>

                <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
                  {FEATURED_JOBS[currentSlide].title}
                </h1>

                <div className="space-y-1 text-blue-100 text-sm md:text-base">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <i className="fa-solid fa-building text-blue-400"></i> {FEATURED_JOBS[currentSlide].company}
                  </p>
                  <p className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                    <i className="fa-solid fa-location-dot text-red-400"></i> {FEATURED_JOBS[currentSlide].location}
                    <span className="mx-2">|</span>
                    <i className="fa-solid fa-wallet text-green-400"></i> {FEATURED_JOBS[currentSlide].salary}
                  </p>
                </div>
              </div>

              {/* Action Side */}
              <div className="flex flex-col gap-3 shrink-0 bg-blue-900/40 p-4 rounded-xl border border-blue-700/50 backdrop-blur-sm">
                <span className="text-[11px] text-slate-300 text-center">
                  Batas Lamaran: <strong className="text-yellow-300">{FEATURED_JOBS[currentSlide].deadline}</strong>
                </span>
                <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-extrabold px-6 py-3 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2">
                  Lamar Sekarang <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
                <button className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-white font-semibold px-6 py-2 rounded-xl text-xs transition">
                  Simpan Loker
                </button>
              </div>

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {FEATURED_JOBS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-yellow-400" : "w-2 bg-slate-700"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* QUICK SEARCH BAR */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20 w-full">
        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Cari posisi kerja (ex: Staff Admin, QC, Operator)..."
            className="flex-1 px-4 py-3 text-xs md:text-sm bg-slate-50 rounded-lg focus:outline-none border border-slate-200"
          />
          <select className="px-4 py-3 text-xs md:text-sm bg-slate-50 rounded-lg text-slate-700 focus:outline-none border border-slate-200">
            <option>Semua Kawasan</option>
            <option>Cikarang / EJIP / Jababeka</option>
            <option>Cibitung / MM2100</option>
            <option>Kota Bekasi</option>
          </select>
          <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-lg text-xs md:text-sm transition shadow">
            Cari Loker
          </button>
        </div>
      </section>

      {/* REGULAR JOBS FEED */}
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
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-900 transition shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                <p className="text-xs text-slate-600">{job.company} — <span className="text-slate-400">{job.location}</span></p>
                <p className="text-xs text-green-700 font-semibold mt-1">{job.salary}</p>
              </div>
              <button className="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-800">
                Lamar
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-6 text-center text-xs">
        <p>© 2026 BekasiKerja.id — Portal Lowongan Kerja Terpercaya Bekasi</p>
      </footer>

    </div>
  );
}
