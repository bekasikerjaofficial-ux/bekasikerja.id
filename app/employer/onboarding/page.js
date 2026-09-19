'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EmployerShell from '../../../components/EmployerShell';
import { employerFetch } from '../../../lib/employer-client';

export default function EmployerOnboarding() {
  const router = useRouter(); const [form, setForm] = useState({ name: '', legalName: '', industry: '', city: '', hrEmail: '', hrWhatsapp: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { employerFetch('/api/employer/profile').then(() => router.replace('/employer')).catch(() => setLoading(false)); }, [router]);
  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const submit = async (e) => { e.preventDefault(); setSaving(true); setError(''); try { await employerFetch('/api/employer/onboarding', { method: 'POST', body: JSON.stringify(form) }); router.replace('/employer'); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  if (loading) return <main className="auth-wrap"><p className="text-muted">Memuat profil...</p></main>;
  return <main className="auth-wrap font-sans"><div className="panel" style={{ padding: 32, maxWidth: 560, width: '100%' }}>
    <Link href="/" className="logo" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: 18 }}>BekasiKerja.id</Link>
    <h1 className="h-display" style={{ fontSize: 22 }}>Lengkapi Profil Perusahaan</h1><p className="text-muted" style={{ fontSize: 13 }}>Data ini digunakan untuk mengelola lowongan dan proses verifikasi perusahaan.</p>
    {error && <p style={{ color: 'var(--hl-red)', fontSize: 13 }}>{error}</p>}
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
      {[['name','Nama perusahaan'],['legalName','Nama legal perusahaan'],['industry','Industri'],['city','Kota/Kabupaten'],['hrEmail','Email HR'],['hrWhatsapp','WhatsApp HR']].map(([key,label]) => <div className="field" key={key}><label>{label}</label><input required={key === 'name'} value={form[key]} onChange={change(key)} /></div>)}
      <button disabled={saving} className="btn-primary">{saving ? 'Menyimpan...' : 'Simpan Profil Perusahaan'}</button>
    </form>
  </div></main>;
}
