// app/cv-builder/page.js
'use client';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function CvBuilderPage() {
  const [cvData, setCvData] = useState({ name: '', email: '', phone: '', summary: '', skills: '' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-extrabold mb-2">Pembuat CV Otomatis</h1>
        <p className="text-xs text-slate-500 mb-6">Isi formulir di bawah untuk membuat CV standar lamaran pabrik/industri.</p>
        
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">Nama Lengkap</label>
            <input type="text" placeholder="Ahmad Yani" value={cvData.name} onChange={e=>setCvData({...cvData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Email</label>
              <input type="email" placeholder="ahmad@gmail.com" value={cvData.email} onChange={e=>setCvData({...cvData, email: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="font-bold block mb-1">Nomor WhatsApp</label>
              <input type="text" placeholder="08123456789" value={cvData.phone} onChange={e=>setCvData({...cvData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="font-bold block mb-1">Keahlian / Skill Utama</label>
            <input type="text" placeholder="Contoh: Operasional Mesin CNC, Microsoft Excel, ISO 9001" value={cvData.skills} onChange={e=>setCvData({...cvData, skills: e.target.value})} className="w-full p-2 border rounded-lg" />
          </div>
          <button onClick={() => alert('Fitur Cetak PDF CV siap digunakan!')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">
            Simpan & Download CV PDF
          </button>
        </div>
      </div>
    </div>
  );
}
