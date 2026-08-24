import React from 'react';

const MOCK_JOBS = [
  {
    id: 1,
    title: "Operator Produksi",
    company: "PT Astra Honda Motor",
    location: "Kawasan EJIP, Cikarang",
    type: "Full-time",
    salary: "Rp 5.200.000 - Rp 6.000.000",
    posted: "2 jam yang lalu",
    badge: "Hot"
  },
  {
    id: 2,
    title: "Staff Admin Gudang",
    company: "PT Logistik Maju Bersama",
    location: "Bekasi Barat, Kota Bekasi",
    type: "Full-time",
    salary: "Rp 4.800.000 - Rp 5.300.000",
    posted: "1 hari yang lalu",
    badge: "Urgent"
  },
  {
    id: 3,
    title: "Quality Control (QC) Inspector",
    company: "PT Mayora Indah Tbk",
    location: "MM2100, Cibitung",
    type: "Full-time",
    salary: "Rp 5.000.000 - Rp 5.800.000",
    posted: "2 hari yang lalu",
    badge: "New"
  },
  {
    id: 4,
    title: "Teknisi Maintenance Mesin",
    company: "PT Hyundai Motor Manufacturing",
    location: "GIIC, Deltamas",
    type: "Contract",
    salary: "Rp 5.500.000 - Rp 7.000.000",
    posted: "3 hari yang lalu",
    badge: "Hot"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600">BEKASI</span>
            <span className="text-2xl font-black text-gray-800">KERJA</span>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-sm text-gray-600">
            <a href="#" className="text-blue-600 font-semibold">Cari Kerja</a>
            <a href="#" className="hover:text-blue-600">Perusahaan</a>
            <a href="#" className="hover:text-blue-600">Tips Karir</a>
          </nav>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition">
              Masuk
            </button>
            <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Pasang Lowongan
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 py-12 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Temukan Pekerjaan Impianmu di Bekasi
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            Ribuan info lowongan kerja terbaru di Kota & Kabupaten Bekasi, Cikarang, hingga Cibitung.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mt-6">
            <input
              type="text"
              placeholder="Posisi, keahlian, atau nama perusahaan..."
              className="flex-1 px-4 py-3 text-gray-800 text-sm focus:outline-none rounded-lg"
            />
            <select className="px-4 py-3 text-gray-600 text-sm bg-gray-50 border-0 md:border-l border-gray-200 focus:outline-none rounded-lg">
              <option>Semua Lokasi</option>
              <option>Cikarang</option>
              <option>Cibitung</option>
              <option>Kota Bekasi</option>
              <option>Tambun</option>
            </select>
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition text-sm">
              Cari Kerja
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter */}
        <aside className="space-y-6 bg-white p-5 rounded-xl border border-gray-200 h-fit">
          <h3 className="font-bold text-gray-900 border-b pb-3">Filter Lowongan</h3>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Tipe Pekerjaan</label>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked /> Full-time
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Kontrak / Magang
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Part-time
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Kawasan Industri</label>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> MM2100
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> EJIP & HYUNDAI
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Jababeka
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Delta Silicon
              </label>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">Lowongan Terbaru</h2>
            <span className="text-xs text-gray-500">Menampilkan 4 dari 40+ lowongan</span>
          </div>

          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base md:text-lg hover:text-blue-600 cursor-pointer">
                      {job.title}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded">
                      {job.badge}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{job.company}</p>
                </div>
                <button className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition">
                  Lamar
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 border-t pt-3">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>💰 {job.salary}</span>
                <span className="ml-auto text-gray-400">{job.posted}</span>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Bekasikerja.id — Portal Info Lowongan Kerja Bekasi & Cikarang.</p>
      </footer>
    </div>
  );
}
