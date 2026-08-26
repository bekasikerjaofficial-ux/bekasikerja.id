'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [settings, setSettings] = useState({ brand_name: '', badge_text: '', hero_title: '', hero_subtitle: '' });

  const [postForm, setPostForm] = useState({
    type: 'job', title: '', company: '', location: '', category: 'Manufaktur', deadline: '', image_url: '', content: ''
  });

  useEffect(() => {
    const auth = localStorage.getItem('bk_admin_auth');
    if (auth !== 'true') {
      window.location.href = '/nyosor/login';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: st } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (st) setSettings(st);

    const { data: ps } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (ps) setPosts(ps);
    setLoading(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('site_settings').update(settings).eq('id', 1);
    alert('✅ Settings website berhasil diubah!');
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

  if (loading) return <div className="p-8 text-center text-xs text-slate-500 font-sans">Memuat Dashboard Admin...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-extrabold text-slate-900 text-lg">{settings.brand_name} <span className="text-xs font-normal text-slate-400">(Admin Panel)</span></h1>
          <button onClick={() => { localStorage.removeItem('bk_admin_auth'); window.location.href = '/nyosor/login'; }} className="bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg">Logout</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        
        {/* EDIT BANNER & BRANDING */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 pb-2 border-b">⚙️ Branding & Banner Header</h2>
          <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Nama Brand Website</label>
                <input type="text" value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Badge Text (Kecil Atas)</label>
                <input type="text" value={settings.badge_text} onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
            </div>
            <div>
              <label className="font-bold block mb-1">Judul Utama Banner</label>
              <input type="text" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="font-bold block mb-1">Sub-judul Banner</label>
              <textarea rows="2" value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} className="w-full px-3 py-2 border rounded-xl"></textarea>
            </div>
            <button type="submit" className="bg-slate-900 text-white font-bold px-5 py-2 rounded-xl">Simpan Teks Banner</button>
          </form>
        </div>

        {/* INPUT POSTINGAN BARU */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b">➕ Tambah Postingan Baru</h2>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Jenis Postingan</label>
                <select value={postForm.type} onChange={(e) => setPostForm({ ...postForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-xl bg-white">
                  <option value="job">Lowongan Kerja (Loker)</option>
                  <option value="news">Artikel Lifestyle / Berita</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Judul</label>
                <input type="text" required value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>

              {postForm.type === 'job' && (
                <>
                  <div>
                    <label className="font-bold block mb-1">Nama Perusahaan / PT</label>
                    <input type="text" value={postForm.company} onChange={(e) => setPostForm({ ...postForm, company: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Lokasi Kawasan</label>
                    <input type="text" value={postForm.location} onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Batas Melamar (Deadline)</label>
                    <input type="text" placeholder="ex: 30 Sep 2026" value={postForm.deadline} onChange={(e) => setPostForm({ ...postForm, deadline: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
                  </div>
                </>
              )}

              <div>
                <label className="font-bold block mb-1">URL Gambar / Logo PT (Thumbnail)</label>
                <input type="url" placeholder="https://..." value={postForm.image_url} onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="font-bold block mb-1">Deskripsi / Konten Lengkap</label>
                <textarea rows="4" required value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-xl"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl">Publish Postingan</button>
            </form>
          </div>

          {/* LIST POSTINGAN */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b flex justify-between">
              <span>📋 Semua Postingan</span>
              <span className="text-blue-600">{posts.length} Content</span>
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {posts.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border text-xs">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt="thumb" className="w-10 h-10 object-cover rounded-lg" />}
                    <div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${p.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{p.type}</span>
                      <strong className="text-slate-900 block mt-0.5">{p.title}</strong>
                      <p className="text-slate-500 text-[11px]">{p.company || p.category}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeletePost(p.id)} className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-lg">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
