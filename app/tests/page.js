'use client';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import Link from 'next/link';

export default function TestsPage() {
  const { user, unlockPremium } = useApp();
  const [activeTest, setActiveTest] = useState(null);

  const testsList = [
    { id: 1, title: 'Tes Skill Kompetensi Operator & Teknik', desc: 'Uji kemampuan teknis dasar industri manufaktur.' },
    { id: 2, title: 'Tes Kraepelin / Pauli (Koran)', desc: 'Uji ketahanan kerja, konsistensi, dan kecepatan.' },
    { id: 3, title: 'Psikotes & Logika Penalaran', desc: 'Uji kemampuan analisis verbal dan logika angka.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold mb-2">Pusat Tes & Simulasi Karir</h1>
        <p className="text-xs text-slate-500 mb-8">Asah kemampuan dan uji standar kelulusan tes seleksi perusahaan besar.</p>

        {!user ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-3">
            <p className="text-xs font-bold text-amber-800">Silakan masuk atau daftar terlebih dahulu untuk mengakses menu tes.</p>
            <Link href="/member/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Masuk Sekarang</Link>
          </div>
        ) : !user.isPremium ? (
          /* PAYWALL LOCK */
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">🔒</div>
            <h2 className="text-lg font-extrabold text-slate-900">Menu Tes Terkunci (Khusus Member Premium)</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Unlock seluruh akses 3 jenis tes (Tes Skill, Tes Kraepelin, & Psikotes) untuk meningkatkan peluang diterima kerja.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => {
                  if (confirm('Simulasi Pembayaran Rp 50.000 untuk Unlock Member Premium?')) {
                    unlockPremium();
                    alert('Pembayaran Berhasil! Akun Anda kini menjadi Premium.');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-xs font-extrabold shadow transition cursor-pointer"
              >
                Bayar & Unlock Semua Tes (Rp 50.000)
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED TESTS LIST */
          <div className="space-y-4">
            {testsList.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{test.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{test.desc}</p>
                </div>
                <button 
                  onClick={() => setActiveTest(test.title)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Mulai Tes
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Simulasi: {activeTest}</h3>
              <p className="text-xs text-slate-600">Sistem soal simulasi sedang berjalan. Jawab pertanyaan dengan teliti.</p>
              <div className="bg-slate-100 p-4 rounded-xl text-center text-xs font-bold text-slate-700">
                [ Area Soal Simulasi Aktif ]
              </div>
              <button onClick={() => setActiveTest(null)} className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold">
                Selesai / Keluar Tes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
