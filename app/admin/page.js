'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPostImg, setUploadingPostImg] = useState(false);
  const [posts, setPosts] = useState([]);

  const [settings, setSettings] = useState({
    brand_name: '', logo_url: '', badge_text: '', hero_title: '', hero_subtitle: '',
  });

  const [postForm, setPostForm] = useState({
    type: 'job', title: '', company: '', location: '', category: 'Manufaktur', deadline: '', image_url: '', content: '',
  });

  useEffect(() => {
    let active = true;
    const guard = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/nyosor/login';
        return;
      }
      if (active) await fetchData();
    };
    guard();
    return () => { active = false; };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: st } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (st) setSettings(st);
    const { data: ps } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (ps) setPosts(ps);
    setLoading(false);
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      alert('Gagal upload file. Pastikan bucket "images" di Supabase sudah dibuat & di-set PUBLIC! Error: ' + error.message);
      return null;
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    const publicUrl = await uploadImage(file);
    if (publicUrl) setSettings({ ...settings, logo_url: publicUrl });
    setUploadingLogo(false);
  };

  const handlePostImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPostImg(true);
    const publicUrl = await uploadImage(file);
    if (publicUrl) setPostForm({ ...postForm, image_url: publicUrl });
    setUploadingPostImg(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('site_settings').update(settings).eq('id', 1);
    alert('✅ Settings & Logo Website berhasil diperbarui!');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    await supabase.from('posts').insert([postForm]);
    alert('✅ Postingan berhasil di-publish!');
    setPostForm({ type: 'job', title: '', company: '', location: '', category: 'Manufaktur', deadline: '', image_url: '', content: '' });
    fetchData();
  };

  const handleDeletePost = async (id) => {
    if (confirm('Hapus postingan ini?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchData();
    }
  };

  if (loading) return <div className="auth-wrap"><p className="text-muted" style={{ fontSize: 13 }}>Memuat Dashboard Admin...</p></div>;

  return (
    <div>
      <SiteHeader brand={settings.brand_name || 'BekasiKerja.id'} active="/admin" showSearch={false} />

      <main className="container section">
        {/* EDIT BRANDING */}
        <section className="panel" style={{ padding: 24, marginBottom: 32 }}>
          <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)' }}>
            ⚙️ Identity &amp; Branding Situs
          </h2>
          <form onSubmit={handleSaveSettings} style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Nama Website / Brand</label>
                <input type="text" value={settings.brand_name || ''} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Upload File Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: 13 }} />
                {uploadingLogo && <span className="text-muted" style={{ fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>Mengunggah logo...</span>}
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Atau Link URL Logo</label>
                <input type="text" placeholder="https://..." value={settings.logo_url || ''} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} />
              </div>
            </div>

            {settings.logo_url && (
              <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="text-muted" style={{ fontSize: 11, fontWeight: 700 }}>Preview:</span>
                <img src={settings.logo_url} alt="Preview Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Badge Teks Header</label>
                <input type="text" value={settings.badge_text || ''} onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Judul Utama Hero</label>
                <input type="text" value={settings.hero_title || ''} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} />
              </div>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label>Sub-Judul / Deskripsi Banner</label>
              <textarea rows="2" value={settings.hero_subtitle || ''} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} />
            </div>

            <button type="submit" className="btn-primary" style={{ justifySelf: 'start' }}>💾 Simpan Pengaturan Situs</button>
          </form>
        </section>

        {/* INPUT + LIST POSTINGAN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px,5fr) 7fr', gap: 24 }} className="admin-grid">
          <section className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16 }}>
              ➕ Tambah Postingan Baru
            </h2>
            <form onSubmit={handleCreatePost} style={{ display: 'grid', gap: 14 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Jenis Postingan</label>
                <select value={postForm.type} onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}>
                  <option value="job">Lowongan Kerja (Loker)</option>
                  <option value="news">Artikel Lifestyle / Berita</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Judul</label>
                <input type="text" required value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} />
              </div>

              {postForm.type === 'job' && (
                <>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Nama Perusahaan / PT</label>
                    <input type="text" value={postForm.company} onChange={(e) => setPostForm({ ...postForm, company: e.target.value })} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Lokasi Kawasan</label>
                    <input type="text" value={postForm.location} onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Batas Melamar (Deadline)</label>
                    <input type="text" placeholder="ex: 30 Sep 2026" value={postForm.deadline} onChange={(e) => setPostForm({ ...postForm, deadline: e.target.value })} />
                  </div>
                </>
              )}

              <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 12, display: 'grid', gap: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--gray-700)', fontSize: 11 }}>🖼️ Gambar / Logo PT</span>
                <input type="file" accept="image/*" onChange={handlePostImageUpload} style={{ fontSize: 12 }} />
                {uploadingPostImg && <span style={{ fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>Mengunggah gambar...</span>}
                <input type="text" placeholder="Atau tempel link URL gambar" value={postForm.image_url} onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })} style={{ fontSize: 12 }} />
                {postForm.image_url && (
                  <img src={postForm.image_url} alt="Preview" style={{ height: 64, width: 'auto', borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                )}
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label>Deskripsi / Konten Lengkap</label>
                <textarea rows="4" required value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} />
              </div>

              <button type="submit" disabled={uploadingPostImg} className="btn-primary">
                {uploadingPostImg ? 'Tunggu Upload...' : 'Publish Postingan'}
              </button>
            </form>
          </section>

          <section className="panel" style={{ padding: 24 }}>
            <h3 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>📋 Semua Postingan</span>
              <span style={{ color: 'var(--hl-blue)' }}>{posts.length} Content</span>
            </h3>
            <div style={{ display: 'grid', gap: 12, maxHeight: 520, overflowY: 'auto' }}>
              {posts.map((p) => (
                <div key={p.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {p.image_url && <img src={p.image_url} alt="thumb" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />}
                    <div>
                      <span className={`badge-tag ${p.type === 'job' ? 'job' : 'news'}`} style={{ marginBottom: 4 }}>{p.type}</span>
                      <strong style={{ color: 'var(--gray-900)', display: 'block', fontSize: 13 }}>{p.title}</strong>
                      <span className="text-muted" style={{ fontSize: 11 }}>{p.company || p.category}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeletePost(p.id)} className="btn-danger" style={{ padding: '8px 12px', fontSize: 12 }}>Hapus</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
