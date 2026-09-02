'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';
import TagInput from '../../components/TagInput';
import ImageUpload from '../../components/ImageUpload';
import {
  Settings, Plus, ClipboardList, Image, Save, Trash2,
  Edit2, Tag as TagIcon, FolderOpen, CheckCircle2, X,
  ChevronDown, ChevronUp,
} from 'lucide-react';

// ---------- helpers ----------
const CAT_OPTIONS = [
  { value: 'Manufaktur', label: 'Manufaktur' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Gudang', label: 'Gudang' },
  { value: 'Logistik', label: 'Logistik' },
  { value: 'Tips Karir', label: 'Tips Karir' },
  { value: 'Psikotes', label: 'Psikotes' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPostImg, setUploadingPostImg] = useState(false);
  const [posts, setPosts] = useState([]);

  const [settings, setSettings] = useState({
    brand_name: '', header_name: '', logo_url: '', badge_text: '', hero_title: '', hero_subtitle: '',
  });

  const [postForm, setPostForm] = useState({
    type: 'job', title: '', company: '', location: '', category: 'Manufaktur',
    deadline: '', image_url: '', content: '', tagInput: [],
  });

  // Category / tag CRUD
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newTag, setNewTag] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [tagForm, setTagForm] = useState({ name: '' });

  // UI toggles
  const [tab, setTab] = useState('posts'); // posts | settings | categories | tags

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: st } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (st) setSettings(st);
    const { data: ps } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (ps) setPosts(ps);
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    if (cats) setCategories(cats);
    const { data: tgs } = await supabase.from('tags').select('*').order('name');
    if (tgs) setTags(tgs);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const guard = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { window.location.href = '/nyosor/login'; return; }
      if (active) await fetchData();
    };
    guard();
    return () => { active = false; };
  }, []);

  // ---------- Upload ----------
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

  // ---------- Settings (identity & branding) ----------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await supabase.from('site_settings').update(settings).eq('id', 1);
    alert('Pengaturan Identitas & Header berhasil diperbarui!');
    fetchData();
  };

  // ---------- Post CRUD ----------
  const handleCreatePost = async (e) => {
    e.preventDefault();
    const payload = { ...postForm, tags: postForm.tagInput };
    // Use selected category text directly (it's stored as text on posts.category)
    await supabase.from('posts').insert([payload]);
    alert('Postingan berhasil dipublikasikan!');
    setPostForm({ type: 'job', title: '', company: '', location: '', category: 'Manufaktur', deadline: '', image_url: '', content: '', tagInput: [] });
    fetchData();
  };

  const handleDeletePost = async (id) => {
    if (confirm('Hapus postingan ini?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchData();
    }
  };

  // ---------- Category CRUD ----------
  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    const { data, error } = await supabase.from('categories').insert([{ name: newCat.trim(), slug: newCat.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), description: '' }]).select().single();
    if (error) { alert('Gagal tambah kategori: ' + error.message); return; }
    setCategories([...categories, data]);
    setNewCat('');
  };

  const handleUpdateCategory = async (id) => {
    const { error } = await supabase.from('categories').update({ name: catForm.name, description: catForm.description }).eq('id', id);
    if (error) { alert('Gagal update kategori: ' + error.message); return; }
    setCategories(categories.map((c) => (c.id === id ? { ...c, name: catForm.name, description: catForm.description } : c)));
    setEditingCat(null);
  };

  const handleDeleteCategory = async (id) => {
    if (confirm('Hapus kategori ini?')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) setCategories(categories.filter((c) => c.id !== id));
    }
  };

  // ---------- Tag CRUD ----------
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const { data, error } = await supabase.from('tags').insert([{ name: newTag.trim(), slug: newTag.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }]).select().single();
    if (error) { alert('Gagal tambah tag: ' + error.message); return; }
    setTags([...tags, data]);
    setNewTag('');
  };

  const handleUpdateTag = async (id) => {
    const { error } = await supabase.from('tags').update({ name: tagForm.name }).eq('id', id);
    if (error) { alert('Gagal update tag: ' + error.message); return; }
    setTags(tags.map((t) => (t.id === id ? { ...t, name: tagForm.name } : t)));
    setEditingTag(null);
  };

  const handleDeleteTag = async (id) => {
    if (confirm('Hapus tag ini?')) {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (!error) setTags(tags.filter((t) => t.id !== id));
    }
  };

  // ---------- Render helpers ----------
  const isAdminTab = tab === 'categories' || tab === 'tags';

  if (loading) return <div className="auth-wrap"><p className="text-muted" style={{ fontSize: 13 }}>Memuat Dashboard Admin...</p></div>;

  return (
    <div>
      <SiteHeader brand={settings.header_name || settings.brand_name || 'BekasiKerja.id'} active="/admin" showSearch={false} />

      <main className="container section">
        {/* PAGE TITLE */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="h-display" style={{ fontSize: 28 }}>Dashboard Admin</h1>
          <p className="text-muted" style={{ fontSize: 13 }}>Kelola konten, branding, kategori &amp; tag portal BekasiKerja.id</p>
        </div>

        {/* TAB NAV */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--gray-200)', paddingBottom: 8 }}>
          {[
            { key: 'posts', label: 'Postingan', icon: ClipboardList },
            { key: 'settings', label: 'Branding & Header', icon: Settings },
            { key: 'categories', label: 'Kategori', icon: FolderOpen },
            { key: 'tags', label: 'Tag', icon: TagIcon },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 'var(--r-md)', border: 'none',
                background: active ? 'var(--hl-blue)' : 'transparent',
                color: active ? '#fff' : 'var(--gray-700)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
              }}>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ===== TAB: POSTINGAN ===== */}
        {tab === 'posts' && (
          <>
            {/* INPUT + LIST POSTINGAN */}
            <div className="admin-grid" style={{ gap: 24 }}>
              <section className="panel" style={{ padding: 24 }}>
                <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={18} /> Tambah Postingan Baru
                </h2>
                <form onSubmit={handleCreatePost} style={{ display: 'grid', gap: 14 }}>
                  <FormSelect label="Jenis Postingan" name="type" value={postForm.type} onChange={(e) => setPostForm({ ...postForm, type: e.target.value })} options={[{ value: 'job', label: 'Lowongan Kerja (Loker)' }, { value: 'news', label: 'Artikel Lifestyle / Berita' }]} placeholder="" />
                  <FormInput label="Judul" name="title" value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} required placeholder="Judul postingan" />

                  {postForm.type === 'job' && (
                    <>
                      <FormInput label="Nama Perusahaan / PT" name="company" value={postForm.company} onChange={(e) => setPostForm({ ...postForm, company: e.target.value })} placeholder="PT ..." />
                      <FormInput label="Lokasi Kawasan" name="location" value={postForm.location} onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} placeholder="Kawasan industri ..." />
                      <FormInput label="Batas Melamar (Deadline)" name="deadline" value={postForm.deadline} onChange={(e) => setPostForm({ ...postForm, deadline: e.target.value })} placeholder="ex: 30 Sep 2026" />
                    </>
                  )}

                  <FormSelect label="Kategori" name="category" value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} options={CAT_OPTIONS} placeholder="Pilih kategori" />

                  <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 12, display: 'grid', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--gray-700)', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Image size={14} /> Gambar / Logo PT
                    </span>
                    <input type="file" accept="image/*" onChange={handlePostImageUpload} style={{ fontSize: 12 }} />
                    {uploadingPostImg && <span style={{ fontSize: 11, color: 'var(--hl-blue)', fontWeight: 700 }}>Mengunggah gambar...</span>}
                    <input type="text" placeholder="Atau tempel link URL gambar" value={postForm.image_url} onChange={(e) => setPostForm({ ...postForm, image_url: e.target.value })} style={{ fontSize: 12 }} />
                    {postForm.image_url && (<img src={postForm.image_url} alt="Preview" style={{ height: 64, width: 'auto', borderRadius: 8, border: '1px solid var(--gray-200)' }} />)}
                  </div>

                  <TagInput tags={postForm.tagInput} onChange={(t) => setPostForm({ ...postForm, tagInput: t })} />

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
                <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ClipboardList size={18} /> Semua Postingan
                  </span>
                  <span style={{ color: 'var(--hl-blue)' }}>{posts.length} Content</span>
                </h2>
                <div style={{ display: 'grid', gap: 12, maxHeight: 520, overflowY: 'auto' }}>
                  {posts.map((p) => (
                    <div key={p.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.image_url && <img src={p.image_url} alt="thumb" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />}
                        <div>
                          <span className={`badge-tag ${p.type === 'job' ? 'job' : 'news'}`} style={{ marginBottom: 4 }}>{p.type === 'job' ? 'Lowongan' : 'Berita'}</span>
                          <strong style={{ color: 'var(--gray-900)', display: 'block', fontSize: 13 }}>{p.title}</strong>
                          <span className="text-muted" style={{ fontSize: 11 }}>{p.company || p.category || ''}{p.tagInput && p.tagInput.length ? ' · ' + p.tagInput.join(', ') : ''}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeletePost(p.id)} className="btn-danger" style={{ padding: '8px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Belum ada postingan.</p>}
                </div>
              </section>
            </div>
          </>
        )}

        {/* ===== TAB: BRANDING & HEADER ===== */}
        {tab === 'settings' && (
          <section className="panel" style={{ padding: 24, maxWidth: 900 }}>
            <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Settings size={18} /> Identity &amp; Branding Situs (Header Name)
            </h2>
            <form onSubmit={handleSaveSettings} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                <FormInput label="Nama Website / Brand" name="brand_name" value={settings.brand_name || ''} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} placeholder="BekasiKerja.id" />
                <FormInput label="Nama Header (Navbar)" name="header_name" value={settings.header_name || ''} onChange={(e) => setSettings({ ...settings, header_name: e.target.value })} placeholder="BekasiKerja" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
                <FormInput label="Teks Badge Header" name="badge_text" value={settings.badge_text || ''} onChange={(e) => setSettings({ ...settings, badge_text: e.target.value })} placeholder="PORTAL LOWONGAN KERJA BEKASI & KARAWANG" />
                <FormInput label="Judul Utama Hero" name="hero_title" value={settings.hero_title || ''} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} placeholder="Temukan Karir Impianmu..." />
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label>Sub-Judut / Deskripsi Banner</label>
                <textarea rows="2" value={settings.hero_subtitle || ''} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} />
              </div>

              <ImageUpload label="Upload File Logo" value={settings.logo_url || ''} onChange={(url) => setSettings({ ...settings, logo_url: url })} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Atau Link URL Logo</label>
                  <input type="text" placeholder="https://..." value={settings.logo_url || ''} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} />
                </div>
              </div>

              {(settings.logo_url || '') && (
                <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="text-muted" style={{ fontSize: 11, fontWeight: 700 }}>Preview:</span>
                  <img src={settings.logo_url} alt="Preview Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
                </div>
              )}

              <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="text-muted" style={{ fontSize: 11, fontWeight: 700 }}>Header preview:</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--hl-blue)' }}>{settings.header_name || settings.brand_name || 'BekasiKerja'}</span>
              </div>

              <button type="submit" className="btn-primary" style={{ justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Save size={16} /> Simpan Pengaturan Situs
              </button>
            </form>
          </section>
        )}

        {/* ===== TAB: KATEGORI ===== */}
        {tab === 'categories' && (
          <div className="admin-grid" style={{ gap: 24 }}>
            <section className="panel" style={{ padding: 24 }}>
              <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FolderOpen size={18} /> Tambah Kategori
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <FormInput label="Nama Kategori" name="newCat" value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="ex: Marketing" />
                <button onClick={handleAddCategory} className="btn-primary" style={{ alignSelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={16} /> Tambah Kategori
                </button>
              </div>
              <div style={{ display: 'grid', gap: 12, marginTop: 24, maxHeight: 400, overflowY: 'auto' }}>
                {categories.map((c) => (
                  <div key={c.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--gray-900)' }}>{c.name}</strong>
                      {c.description && <span className="text-muted" style={{ fontSize: 11, marginLeft: 8 }}>{c.description}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingCat(editingCat === c.id ? null : c.id); setCatForm({ name: c.name, description: c.description || '' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hl-blue)', padding: 4 }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteCategory(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hl-red)', padding: 4 }}><Trash2 size={14} /></button>
                    </div>
                    {editingCat === c.id && (
                      <div style={{ width: '100%', marginTop: 8, display: 'grid', gap: 8 }}>
                        <FormInput label="Nama" name="catName" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
                        <FormInput label="Deskripsi" name="catDesc" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleUpdateCategory(c.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}><Save size={14} /> Simpan</button>
                          <button onClick={() => setEditingCat(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Batal</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {categories.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Belum ada kategori.</p>}
              </div>
            </section>
          </div>
        )}

        {/* ===== TAB: TAG ===== */}
        {tab === 'tags' && (
          <div className="admin-grid" style={{ gap: 24 }}>
            <section className="panel" style={{ padding: 24 }}>
              <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <TagIcon size={18} /> Tambah Tag
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <FormInput label="Nama Tag" name="newTag" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="ex: Remote" />
                <button onClick={handleAddTag} className="btn-primary" style={{ alignSelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={16} /> Tambah Tag
                </button>
              </div>
              <div style={{ display: 'grid', gap: 12, marginTop: 24, maxHeight: 400, overflowY: 'auto' }}>
                {tags.map((t) => (
                  <div key={t.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--gray-900)' }}>{t.name}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingTag(editingTag === t.id ? null : t.id); setTagForm({ name: t.name }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hl-blue)', padding: 4 }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteTag(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hl-red)', padding: 4 }}><Trash2 size={14} /></button>
                    </div>
                    {editingTag === t.id && (
                      <div style={{ width: '100%', marginTop: 8, display: 'grid', gap: 8 }}>
                        <FormInput label="Nama" name="tagName" value={tagForm.name} onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleUpdateTag(t.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}><Save size={14} /> Simpan</button>
                          <button onClick={() => setEditingTag(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Batal</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {tags.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>Belum ada tag.</p>}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
