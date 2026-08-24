import React from 'react';

const MOCK_JOBS = [
  {
    id: 1,
    title: "Staff Admin Operational & Customer Service",
    company: "PT Central Bank Asia Tbk",
    location: "Kota Bekasi",
    type: "Full-time",
    salary: "Rp 5.500.000 - Rp 6.800.000",
    posted: "Hari ini",
    badge: "Verified Corporate",
    icon: "fa-building-columns",
    category: "Banking & Admin"
  },
  {
    id: 2,
    title: "Operator Produksi Assembly Line",
    company: "PT Astra Honda Motor",
    location: "Kawasan EJIP, Cikarang",
    type: "Full-time",
    salary: "Rp 5.200.000 - Rp 6.000.000",
    posted: "2 jam lalu",
    badge: "Popular",
    icon: "fa-industry",
    category: "Manufaktur"
  },
  {
    id: 3,
    title: "Quality Control (QC) Inspector",
    company: "PT Mayora Indah Tbk",
    location: "Kawasan MM2100, Cibitung",
    type: "Full-time",
    salary: "Rp 5.000.000 - Rp 5.800.000",
    posted: "1 hari lalu",
    badge: "Urgent",
    icon: "fa-vial",
    category: "Quality Control"
  }
];

const MOCK_NEWS = [
  {
    id: 1,
    title: "Panduan Lolos Interview & Psikotes Online Perusahaan Perbankan 2026",
    category: "Tips Karir",
    date: "24 Agu 2026",
    readTime: "5 menit baca",
    icon: "fa-newspaper"
  },
  {
    id: 2,
    title: "Daftar Kawasan Industri Cikarang yang Buka Rekrutmen Massal",
    category: "Info Industri",
    date: "22 Agu 2026",
    readTime: "4 menit baca",
    icon: "fa-chart-line"
  },
  {
    id: 3,
    title: "Cara Membuat Format CV ATS-Friendly yang Disukai HRD",
    category: "Panduan CV",
    date: "20 Agu 2026",
    readTime: "3 menit baca",
    icon: "fa-file-lines"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Announcement Bar */}
      <div className="bg-blue-950 text-blue-200 text-xs py-2 px-4 border-b border-blue-900 font-medium">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-blue-800 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>
            <span>Fitur Pembuat CV ATS Gratis & Simulasi Tes Psikotes Online Telah Rilis!</span>
          </div>
          <div className="hidden md:flex gap-4 text-xs">
            <a href="#cv-builder" className="hover:text-white transition">Bikin CV Gratis</a>
            <span className="text-blue-700">|</span>
            <a href="#psikotes" className="text-yellow-400 font-semibold hover:underline">Member PRO (Psikotes)</a>
          </div>
        </div>
      </div>

      {/* Main Navbar - BCA Corporate Style */}
      <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 font-black px-3 py-1.5 rounded-lg text-lg tracking-widest shadow">
              BK
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">BEKASI</span>
              <span className="text-xl font-light text-blue-300">KERJA</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100">
            <a href="#" className="text-white border-b-2 border-yellow-400 pb-1 font-semibold">Cari Loker</a>
            <a href="#berita" className="hover:text-white transition">Artikel & Berita</a>
            <a href="#cv-builder" className="hover:text-white transition">Buat CV (Free)</a>
            <a href="#psikotes" className="text-yellow-300 hover:text-yellow-200 font-semibold transition flex items-center gap-1">
              <i className="fa-solid fa-crown text-xs"></i> Tes Psikotes (PRO)
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-semibold text-blue-100 hover:text-white transition">
              Masuk
            </button>
            <button className="px-4 py-2 text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-blue-950 rounded-lg shadow transition flex items-center gap-1.5">
              <i className="fa-solid fa-user-plus text-xs"></i>
              Daftar Member
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-blue-900/80 border border-blue-700 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <i className="fa-solid fa-shield-halved text-yellow-400"></i>
            Portal Lowongan Kerja Terpercaya Wilayah Bekasi & Sekitarnya
          </span>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Temukan Karir Impian & Uji Kesiapan Kerja Anda
          </h1>
          
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto font-normal">
            Akses lowongan industri terverifikasi, buat CV standar HRD secara gratis, dan ikuti simulasi Psikotes Online untuk meningkatkan peluang lolos rekrutmen.
          </p>

          {/* Corporate Search Bar */}
          <div className="bg-white p-2.5 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto text-slate-800">
            <div className="flex-1 flex items-center gap-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
              <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder="Posisi, kata kunci, atau nama perusahaan..."
                className="w-full py-3 text-xs md:text-sm bg-transparent focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 px-3 bg-slate-50 rounded-lg border border-slate-200">
              <i className="fa-solid fa-location-dot text-slate-400 text-sm"></i>
              <select className="py-3 text-xs md:text-sm bg-transparent text-slate-700 focus:outline-none cursor-pointer">
                <option>Semua Lokasi</option>
                <option>Cikarang / EJIP / Jababeka</option>
                <option>Cibitung / MM2100</option>
                <option>Kota Bekasi</option>
                <option>Tambun & Summarecon</option>
              </select>
            </div>

            <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-lg text-xs md:text-sm transition shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
              Cari Kerja
            </button>
          </div>
        </div>
      </section>

      {/* Feature Membership Highlights */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card Member Gratis */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div className="space-y-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Member Gratis
              </span>
              <h3 className="text-base font-bold text-slate-900">Buat CV ATS-Friendly</h3>
              <p className="text-xs text-slate-500">Generator CV otomatis standar HRD perbankan & manufaktur.</p>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap shadow">
              Buat CV Gratis
            </button>
          </div>

          {/* Card Member PRO (Berbayar) */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl p-6 shadow-md hover:shadow-lg transition flex items-center justify-between">
            <div className="space-y-2">
              <span className="bg-slate-950 text-yellow-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 w-fit">
                <i className="fa-solid fa-crown text-[10px]"></i> Member PRO
              </span>
              <h3 className="text-base font-extrabold text-slate-950">Simulasi Tes Psikotes Online</h3>
              <p className="text-xs font-medium text-slate-800">Tes Logika, Kraepelin, & Laporan Evaluasi Nilai.</p>
            </div>
            <button className="bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap shadow">
              Akses Tes PRO
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full flex-1">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-sm">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Filter Lowongan</h3>
            <span className="text-[11px] text-blue-900 font-semibold cursor-pointer">Reset</span>
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kategori</label>
            <div className="space-y-2 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900 focus:ring-blue-900" defaultChecked /> Perbankan & Finance
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900 focus:ring-blue-900" defaultChecked /> Manufaktur & Otomotif
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900 focus:ring-blue-900" /> Logistik & Administrasi
              </label>
            </div>
          </div>
        </aside>

        {/* Job Feed */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Lowongan Kerja Terverifikasi</h2>
              <p className="text-xs text-slate-500">Update terbaru untuk kawasan Bekasi & Cikarang</p>
            </div>
            <span className="text-xs font-semibold text-blue-900">3 Loker Ditampilkan</span>
          </div>

          <div className="space-y-3">
            {MOCK_JOBS.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-900 transition shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center text-xl shrink-0">
                      <i className={`fa-solid ${job.icon}`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base hover:text-blue-900 cursor-pointer">
                          {job.title}
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded">
                          {job.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{job.company}</p>
                    </div>
                  </div>

                  <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow shrink-0">
                    Lamar Sekarang
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t pt-3">
                  <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-slate-400"></i> {job.location}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-briefcase text-slate-400"></i> {job.type}</span>
                  <span className="flex items-center gap-1"><i className="fa-solid fa-money-bill-wave text-slate-400"></i> {job.salary}</span>
                  <span className="ml-auto text-slate-400">{job.posted}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* News & Articles Section */}
      <section id="berita" className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Pusat Edukasi & Informasi</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Berita & Tips Karir Terbaru</h2>
            </div>
            <a href="#" className="text-xs font-bold text-blue-900 hover:underline">Lihat Semua Berita →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_NEWS.map((article) => (
              <div key={article.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-blue-900 transition shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                  <i className={`fa-solid ${article.icon}`}></i>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-blue-900">{article.category}</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-900 cursor-pointer line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[11px] text-slate-400">{article.readTime}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Footer */}
      <footer className="bg-blue-950 text-blue-200 border-t border-blue-900 py-10 px-4 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-white text-blue-900 font-black px-2 py-0.5 rounded text-sm">BK</div>
              <span className="font-bold text-white text-base">BekasiKerja.id</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Platform layanan karir terpadu wilayah Bekasi. Menyediakan info loker terverifikasi, pembuatan CV gratis, dan simulasi psikotes online.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Pencari Kerja</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Cari Lowongan</a></li>
              <li><a href="#cv-builder" className="hover:text-white">Buat CV ATS Gratis</a></li>
              <li><a href="#psikotes" className="hover:text-white">Tes Psikotes Online</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Perusahaan</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white">Pasang Lowongan</a></li>
              <li><a href="#" className="hover:text-white">Layanan Rekrutmen</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Kontak & Bantuan</h4>
            <ul className="space-y-2 text-slate-400">
              <li><i className="fa-regular fa-envelope mr-2"></i> support@bekasikerja.id</li>
              <li><i className="fa-solid fa-location-dot mr-2"></i> Bekasi, Jawa Barat</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-blue-900/60 pt-6 flex flex-col md:flex-row justify-between text-slate-400 text-[11px]">
          <p>© 2026 BekasiKerja.id. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
