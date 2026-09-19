'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { Image, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '', company: '', location: 'Cikarang', salary: '', type: 'Full-time', description: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const guard = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) router.replace('/nyosor/login');
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (!isAdmin) router.replace('/');
    };
    guard();
    return () => { active = false; };
  }, [router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert('Ukuran gambar terlalu besar! Maksimal 2 MB.'); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const { error: err } = await supabase.from('posts').insert({
        type: 'job',
        title: formData.title,
        company: formData.company,
        location: formData.location,
        content: `${formData.description}\n\nGaji: ${formData.salary || 'N/A'}\nTipe: ${formData.type}`,
        image_url: imageUrl,
        deadline: null,
        category: 'Manufaktur',
        tags: [],
      });
      if (err) throw err;
      setSubmitted(true);
      setFormData({ title: '', company: '', location: 'Cikarang', salary: '', type: 'Full-time', description: '' });
      setImagePreview(null);
      setImageFile(null);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError('Gagal menyimpan: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/nyosor/login');
  };

  return (
    <div>
      <header className="header">
        <div className="container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginRight: 8 }}>
              <img src="/logo.png" alt="Logo BekasiKerja.id" style={{ height: 24, width: 'auto', objectFit: 'contain' }} />
            </Link>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Dashboard BekasiKerja.id</span>
          </div>
          <button onClick={handleLogout} className="btn-danger" style={{ padding: '8px 14px', fontSize: 12 }}>Logout</button>
        </div>
      </header>

      <main className="container section" style={{ maxWidth: 720 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)' }}>
            Posting Lowongan Kerja Baru
          </h2>
          <p className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>Isi formulir di bawah ini untuk mengunggah postingan loker baru.</p>

          {submitted && (
            <div style={{ background: '#e8f7ee', border: '1px solid #b7e3c8', color: '#1a7f43', fontSize: 13, padding: 12, borderRadius: 8, margin: '16px 0', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} /> Lowongan Kerja Berhasil Diposting!
            </div>
          )}

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', color: 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, margin: '16px 0', fontWeight: 700 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <div className="admin-grid" style={{ gap: 16 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Judul Posisi Pekerjaan</label>
                <input name="title" required placeholder="ex: Staff QC Inspector" value={formData.title} onChange={handleChange} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Nama Perusahaan / PT</label>
                <input name="company" required placeholder="ex: PT Astra Honda Motor" value={formData.company} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-grid" style={{ gap: 16 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Lokasi Kawasan</label>
                <select name="location" value={formData.location} onChange={handleChange}>
                  <option value="Cikarang">Cikarang / EJIP / Jababeka</option>
                  <option value="Cibitung">Cibitung / MM2100</option>
                  <option value="Kota Bekasi">Kota Bekasi</option>
                  <option value="Tambun">Tambun / Summarecon</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Kisaran Gaji</label>
                <input name="salary" placeholder="ex: Rp 5.200.000 - Rp 6.000.000" value={formData.salary} onChange={handleChange} />
              </div>
            </div>

            <div style={{ padding: 16, border: '1px dashed var(--gray-300)', borderRadius: 12, background: 'var(--gray-100)' }}>
              <label style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-700)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Image size={14} /> Upload Gambar / Logo Perusahaan
              </label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: 12, display: 'block', marginTop: 8 }} />
              <span className="text-muted" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>*Format JPG/PNG, maksimal 2MB</span>
              {imagePreview && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: 8, borderRadius: 8, border: '1px solid var(--gray-200)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-800)', display: 'block' }}>Gambar Siap Diposting</span>
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} style={{ fontSize: 11, color: 'var(--hl-red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label>Deskripsi & Syarat Kualifikasi</label>
              <textarea name="description" rows="5" placeholder="Tuliskan kualifikasi dan cara melamar..." value={formData.description} onChange={handleChange} />
            </div>

            <button type="submit" disabled={uploading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {uploading ? <><Loader2 size={16} className="spin" /> Mengunggah...</> : 'Publish Lowongan Kerja'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
