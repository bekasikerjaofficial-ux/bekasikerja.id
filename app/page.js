import React from 'react';

// Data Dummy Lowongan Kerja
const MOCK_JOBS = [
  {
    id: 1,
    title: "Staff Admin Operational",
    company: "PT Central Bank Asia Tbk - Branch Bekasi",
    location: "Kota Bekasi",
    type: "Full-time",
    salary: "Rp 5.500.000 - Rp 6.800.000",
    posted: "Hari ini",
    badge: "Official"
  },
  {
    id: 2,
    title: "Operator Produksi Otomotif",
    company: "PT Astra Honda Motor",
    location: "Kawasan EJIP, Cikarang",
    type: "Full-time",
    salary: "Rp 5.200.000 - Rp 6.000.000",
    posted: "2 jam lalu",
    badge: "Hot"
  },
  {
    id: 3,
    title: "Quality Control Inspector",
    company: "PT Mayora Indah Tbk",
    location: "MM2100, Cibitung",
    type: "Full-time",
    salary: "Rp 5.000.000 - Rp 5.800.000",
    posted: "1 hari lalu",
    badge: "Urgent"
  }
];

// Data Dummy Artikel Berita Karir (Ala Portal BCA/Corporate News)
const MOCK_NEWS = [
  {
    id: 1,
    title: "Tips Lolos Interview & Psikotes di Perusahaan Perbankan & Industri Bekasi 2026",
    category: "Tips Karir",
    date: "24 Agu 2026",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
  },
  {
    id: 2,
    title: "Daftar Kawasan Industri Cikarang yang Buka Lowongan Besar-besaran Bulan Ini",
    category: "Info Industri",
    date: "22 Agu 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80"
  },
  {
    id: 3,
    title: "Format CV ATS-Friendly Terbaru untuk Melamar di Perusahaan Multinasional",
    category: "Panduan CV",
    date: "20 Agu 2026",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Banner Ala BCA */}
      <div className="bg-blue-950 text-blue-200 text-xs py-2 px-4 border-b border-blue-900">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span>📢 Fitur Baru: Buat CV ATS gratis & Akses Tes Psikotes Online untuk Member PRO!</span>
          <div className="space-x-4">
            <a href="#cv-builder" className="hover:underline">Bikin CV</a>
            <a href="#psikotes" className="hover:underline font-semibold text-yellow-400">Upgrade PRO (Psikotes)</a>
          </div>
        </div>
      </div>

      {/* Navbar Ala BCA */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 font-black px-3 py-1 rounded text-xl tracking-wider">
              BK
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">BEKASI</span>
              <span className="text-xl font-light text-blue-300">KERJA</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-blue-100">
            <a href="#" className="hover:text-white transition">Lowongan Kerja</a>
            <a href="#berita" className="hover:text-white transition">Berita & Artikel</a>
            <a href="#cv-builder" className="hover:text-white transition">Pembuat CV (Gratis)</a>
            <a href="#psikotes" className="hover:text-white transition text-yellow-300">Tes Psikotes (PRO)</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#login" className="px-4 py-2 text-xs font-semibold text-blue-100 hover:text-white transition">
              Masuk
            </a>
            <a href="#register" className="px-4 py-2 text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-blue-950 rounded shadow transition">
              Daftar Member
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="bg-blue-800/80 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Portal Karir Terpercaya Wilayah Bekasi & Sekitarnya
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Karir Profesional Dimulai Dari Sini
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
            Akses lowongan terverifikasi, buat CV standar HRD, dan uji kesiapan kerja Anda melalui Simulasi Tes Psikotes Online.
          </p>

          {/* Search Box */}
          <div className="bg-white p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mt-8">
            <input
              type="text"
              placeholder="Cari posisi kerja (ex: Staff Admin, QC, Operator)..."
              className="flex-1 px-4 py-3 text-slate-800 text-sm focus:outline-none"
            />
            <select className="px-4 py-3 text-slate-600 text-sm bg-slate-50 border-0 md:border-l border-slate-200 focus:outline-none">
              <option>Semua Kawasan</option>
              <option>Cikarang / EJIP / Jababeka</option>
              <option>Cibitung / MM2100</option>
              <option>Kota Bekasi</option>
              <option>Tambun & Summarecon</option>
            </select>
            <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded text-sm transition shadow">
              Cari Lowongan
            </button>
          </div>
        </div>
      </section>

      {/* Pricing / Fitur Member Section */}
      <section className="max-w-6xl mx-auto px-4 py-10 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Gratis */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded">MEMBER GRATIS</span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">Buat CV Online (ATS Friendly)</h3>
              <p className="text-xs text-slate-500 mt-1">Lamar loker lebih mudah dengan resume yang disukai HRD.</p>
            </div>
            <button className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded hover:bg-slate-800 transition whitespace-nowrap">
              Buat CV Now
            </button>
          </div>

          {/* Member Premium/PRO */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-xl p-6 shadow-md flex justify-between items-center">
            <div>
              <span className="bg-slate-950 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded">MEMBER PRO (BERBAYAR)</span>
              <h3 className="text-lg font-extrabold mt-2">Simulasi Tes Psikotes & Kraepelin</h3>
              <p className="text-xs font-medium text-slate-800 mt-1">Uji kemampuan logika, matematika, dan dapatkan sertifikat hasil tes.</p>
            </div>
            <button className="bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded hover:bg-slate-900 transition whitespace-nowrap">
              Beli Akses PRO
            </button>
          </div>
        </div>
      </section>

      {/* Container Utama */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter */}
        <aside className="space-y-6 bg-white p-5 rounded-xl border border-slate-200 h-fit shadow-sm">
          <h3 className="font-bold text-slate-900 border-b pb-3 text-sm">Filter Pencarian</h3>
          
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Tipe Pekerjaan</label>
            <div className="space-y-2 text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900" defaultChecked /> Full-Time (Tetap)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900" /> Kontrak (PKWT)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900" /> Magang (Internship)
              </label>
            </div>
          </div>
        </aside>

        {/* List Lowongan Kerja */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">Lowongan Kerja Terbaru</h2>
            <span className="text-xs text-slate-500">Terverifikasi oleh Tim BekasiKerja</span>
          </div>

          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-900 transition shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base hover:text-blue-900 cursor-pointer">
                      {job.title}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded">
                      {job.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1">{job.company}</p>
                </div>
                <button className="bg-blue-900 text-white font-semibold px-4 py-1.5 rounded text-xs hover:bg-blue-800 transition">
                  Lamar Cepat
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t pt-3">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>💰 {job.salary}</span>
                <span className="ml-auto text-slate-400">{job.posted}</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Section Artikel & Berita Karir (Ala BCA Corporate News) */}
      <section id="berita" className="bg-white border-t border-slate-200 py-12 px-4 mt-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Artikel & Edukasi</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Berita & Tips Karir Terbaru</h2>
            </div>
            <a href="#" className="text-xs font-bold text-blue-900 hover:underline">Lihat Semua Artikel →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_NEWS.map((article) => (
              <div key={article.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-blue-900 uppercase">{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-blue-900 cursor-pointer">
                    {article.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 border-t border-blue-900 py-8 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm">BekasiKerja.id</p>
            <p className="mt-1 text-slate-400">Portal Lowongan Kerja, Pembuat CV, dan Tes Psikotes Online Kota & Kabupaten Bekasi.</p>
          </div>
          <p className="text-slate-400">© 2026 Bekasikerja.id. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
