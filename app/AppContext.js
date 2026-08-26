'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialJobs = [
  {
    id: 1,
    title: 'Operator Produksi Assembly',
    company: 'PT Astra Honda Motor',
    location: 'Kawasan Industri MM2100, Cikarang',
    salary: 'Rp 5.200.000 - Rp 5.800.000',
    category: 'Manufaktur / Pabrik',
    type: 'Full-time',
    deadline: '30 Sep 2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    desc: 'Melakukan perakitan komponen kendaraan sesuai standar SOP operasional.'
  },
  {
    id: 2,
    title: 'Staff Quality Control (QC)',
    company: 'PT Mayora Indah Tbk',
    location: 'Kawasan Industri KIIC, Karawang',
    salary: 'Rp 5.500.000 - Rp 6.200.000',
    category: 'Teknik & Engineering',
    type: 'Full-time',
    deadline: '15 Okt 2026',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    desc: 'Memastikan standar mutu produk sesuai spesifikasi sebelum didistribusikan.'
  }
];

const initialNews = [
  {
    id: 1,
    title: 'Tips Lolos Interview User di Perusahaan Manufaktur Cikarang',
    category: 'Tips Karir',
    date: '26 Agt 2026',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    content: 'Persiapkan mental dan pahami alur SOP teknis industri sebelum menghadapi interview user.'
  },
  {
    id: 2,
    title: 'Waspada Modus Penipuan Loker Berbayar di Kawasan Industri',
    category: '#AwasModus',
    date: '25 Agt 2026',
    image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop&q=80',
    content: 'PT resmi tidak pernah memungut biaya apapun selama proses rekrutmen berlangsung.'
  }
];

export function AppProvider({ children }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [news, setNews] = useState(initialNews);

  useEffect(() => {
    const savedJobs = localStorage.getItem('bk_jobs');
    const savedNews = localStorage.getItem('bk_news');
    if (savedJobs) setJobs(JSON.parse(savedJobs));
    if (savedNews) setNews(JSON.parse(savedNews));
  }, []);

  const addJob = (newJob) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('bk_jobs', JSON.stringify(updated));
  };

  const addNews = (newNews) => {
    const updated = [newNews, ...news];
    setNews(updated);
    localStorage.setItem('bk_news', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ jobs, news, addJob, addNews }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
