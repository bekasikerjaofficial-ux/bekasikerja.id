// app/context/AppContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Menghindari hydration mismatch saat membaca localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('bk_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Operator Produksi - PT Epson Indonesia', company: 'PT Epson Indonesia', location: 'Cikarang, Bekasi', deadline: '31 Agu 2026', type: 'Full-time', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80', desc: 'Dibutuhkan segera operator produksi berpengalaman.' },
    { id: 2, title: 'Staff QA / QC - PT Astra Honda Motor', company: 'PT AHM', location: 'Cibitung, Bekasi', deadline: '05 Sep 2026', type: 'Full-time', image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80', desc: 'Melakukan kontrol kualitas pada lini perakitan.' },
    { id: 3, title: 'Admin Logistik - PT Mayora Indah', company: 'PT Mayora', location: 'Jababeka, Bekasi', deadline: '10 Sep 2026', type: 'Contract', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80', desc: 'Mengelola pencatatan gudang dan pengiriman barang.' },
    { id: 4, title: 'Engineering Staff - PT LG Electronics', company: 'PT LG', location: 'MM2100, Bekasi', deadline: '15 Sep 2026', type: 'Full-time', image: 'https://images.unsplash.com/photo-1537462715879-363eeb61a3ad?w=600&auto=format&fit=crop&q=80', desc: 'Maintenance mesin produksi pabrik.' },
  ]);

  const [news, setNews] = useState([
    { id: 1, title: 'Informasi Pembayaran Biaya Admin PDAM di Beberapa Wilayah', date: '24 Agt 2026', category: 'Lifestyle', hero: true, image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80', content: 'Simak rincian tarif terbaru administrasi layanan air bersih.' },
    { id: 2, title: 'Investasi Berbasis Syariah dengan Sukuk Ritel SR025', date: '21 Agt 2026', category: 'Edukasi', hero: false, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&auto=format&fit=crop&q=80', content: 'Pilihan instrumen investasi aman bagi pekerja.' },
    { id: 3, title: 'Tips Menghadapi Wawancara Kerja di Kawasan Industri Cikarang', date: '20 Agt 2026', category: 'Tips Karir', hero: false, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', content: 'Kunci sukses lolos interview HRD dan user.' },
    { id: 4, title: 'Waspada Modus Penipuan Lowongan Kerja Atas Nama PT Terkenal', date: '19 Agt 2026', category: '#AwasModus', hero: false, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80', content: 'Kenali ciri-ciri rekrutmen palsu yang memungut biaya.' },
  ]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('bk_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bk_user');
  };

  const unlockPremium = () => {
    if (user) {
      const updated = { ...user, isPremium: true };
      setUser(updated);
      localStorage.setItem('bk_user', JSON.stringify(updated));
    }
  };

  const addJob = (job) => setJobs((prev) => [job, ...prev]);
  const addNews = (item) => setNews((prev) => [item, ...prev]);

  return (
    <AppContext.Provider value={{ user, login, logout, unlockPremium, jobs, news, addJob, addNews }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
