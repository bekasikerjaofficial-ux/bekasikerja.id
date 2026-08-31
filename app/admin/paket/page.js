'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import SiteHeader from '../../../components/SiteHeader';
import { Plus, Save, Trash2, Package as PackageIcon, Star } from 'lucide-react';

// CRUD paket (mirip app/admin posts). Guard admin via Supabase Auth.
export default function AdminPaket() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const blank = {
    name: '', slug: '', price: 0, period: 'bulan', tagline: '', description: '',
    features: '[]', popular: false, sort_order: 0, active: true,
  };
  const [form, setForm] = useState(blank);

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

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('sort_order', { ascending: true });
    if (data) setPackages(data);
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    let features;
    try { features = JSON.parse(form.features); }
    catch { alert('Fitur harus JSON array, contoh: [{"text":"Akses loker","included":true}]'); return; }
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      sort_order: Number(form.sort_order) || 0,
      features,
    };
    delete payload.id;
    await supabase.from('packages').insert([payload]);
    alert('Paket berhasil ditambah!');
    setForm(blank);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus paket ini?')) {
      await supabase.from('packages').delete().eq('id', id);
      fetchData();
    }
  };

  if (loading) return <div className="auth-wrap"><p className="text-muted" style={{ fontSize: 13 }}>Memuat...</p></div>;

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/admin/paket" showSearch={false} />

      <main className="container section">
        <div className="admin-grid" style={{ gap: 24 }}>
          <section className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Tambah Paket
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: 14 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Slug (unik, lowercase)</label>
                <input type="text" required placeholder="hemat" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Nama Paket</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Harga (Rp)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Periode</label>
                  <input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
                </div>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Tagline</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Deskripsi</label>
                <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Fitur (JSON array)</label>
                <textarea rows="4" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'end' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Urutan</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>
                  <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Tandai &quot;Terlaris&quot;
                </label>
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Save size={16} /> Simpan Paket
              </button>
            </form>
          </section>

          <section className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ fontSize: 18, paddingBottom: 12, borderBottom: '1px solid var(--gray-200)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <PackageIcon size={18} /> Semua Paket
              </span>
              <span style={{ color: 'var(--hl-blue)' }}>{packages.length} paket</span>
            </h2>
            <div style={{ display: 'grid', gap: 12, maxHeight: 520, overflowY: 'auto' }}>
              {packages.map((p) => (
                <div key={p.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, gap: 12 }}>
                  <div>
                    <strong style={{ color: 'var(--gray-900)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {p.popular && <Star size={13} color="var(--hl-gold)" />}{p.name}
                    </strong>
                    <span className="text-muted" style={{ fontSize: 11 }}>
                      {p.slug} · Rp {new Intl.NumberFormat('id-ID').format(p.price || 0)} / {p.period}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="btn-danger" style={{ padding: '8px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              ))}
              {packages.length === 0 && (
                <p className="text-muted" style={{ fontSize: 13 }}>Belum ada paket. Tambah di form kiri.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
