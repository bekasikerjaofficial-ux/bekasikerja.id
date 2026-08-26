'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialSiteSettings = {
  brandName: 'BekasiKerja.id',
  badgeText: 'PORTAL LOWONGAN KERJA BEKASI & KARAWANG',
  heroTitle: 'Temukan Karir Impianmu di Kawasan Industri',
  heroSubtitle: 'Update lowongan kerja operator, admin, hingga engineering terpercaya setiap hari.'
};

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
  }
];

export function AppProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [jobs, setJobs] = useState(initialJobs);

  useEffect(() => {
    const savedSettings = localStorage.getItem('bk_settings');
    const savedJobs = localStorage.getItem('bk_jobs');
    if (savedSettings) setSiteSettings(JSON.parse(savedSettings));
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  const updateSiteSettings = (newSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('bk_settings', JSON.stringify(newSettings));
  };

  const addJob = (newJob) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('bk_jobs', JSON.stringify(updated));
  };

  const deleteJob = (id) => {
    const updated = jobs.filter(job => job.id !== id);
    setJobs(updated);
    localStorage.setItem('bk_jobs', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ siteSettings, updateSiteSettings, jobs, addJob, deleteJob }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}