'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default function EmployerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '', industry: '', hrWhatsapp: '' });
  const [error, setError] = useState(''); const [message, setMessage] = useState(''); const [pendingEmail, setPendingEmail] = useState(''); const [loading, setLoading] = useState(false); const [resending, setResending] = useState(false);
  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const resendVerification = async () => { if (!pendingEmail) return; setResending(true); setError(''); const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: pendingEmail, options: { emailRedirectTo: `${window.location.origin}/employer/onboarding` } }); setResending(false); if (resendError) setError(`Email verifikasi gagal dikirim: ${resendError.message}`); else setMessage(`Email verifikasi dikirim ulang ke ${pendingEmail}.`); };
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setMessage('');
    const { data, error: err } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name, account_type: 'employer' }, emailRedirectTo: `${window.location.origin}/employer/onboarding` } });
    if (err) { setError(err.message); setLoading(false); return; }
    if (!data.session) { setPendingEmail(form.email); setForm({ name: '', email: '', password: '', city: '', industry: '', hrWhatsapp: '' }); setMessage('Pendaftaran berhasil. Cek email untuk verifikasi, lalu masuk kembali untuk melengkapi profil perusahaan.'); setLoading(false); return; }
    const session = data.session;
    const response = await fetch('/api/employer/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ name: form.name, industry: form.industry, city: form.city, hrWhatsapp: form.hrWhatsapp, hrEmail: form.email }) });
    if (!response.ok) { const payload = await response.json().catch(() => ({})); setError(payload.error || 'Profil perusahaan gagal dibuat.'); setLoading(false); return; }
    router.replace('/employer');
  };
  return <main className="auth-wrap font-sans"><div className="panel" style={{ padding: 32, maxWidth: 520, width: '100%' }}>
    <Link href="/" className="logo" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: 20 }}>BekasiKerja.id</Link>
    <h1 className="h-display" style={{ fontSize: 22 }}>Daftar Member Perusahaan</h1><p className="text-muted" style={{ fontSize: 13 }}>Buat akun HR untuk memasang lowongan dan mengelola pelamar.</p>
    {error && <p style={{ color: 'var(--hl-red)', fontSize: 13 }}>{error}</p>}{message && <p style={{ color: 'var(--hl-teal)', fontSize: 13 }}>{message}</p>}{pendingEmail && <button type="button" className="btn-secondary" disabled={resending} onClick={resendVerification} style={{ fontSize: 12, marginBottom: 10 }}>{resending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}</button>}
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
      {[['name','Nama perusahaan','text'],['email','Email HR','email'],['password','Password','password'],['industry','Industri','text'],['city','Kota/Kabupaten','text'],['hrWhatsapp','WhatsApp HR','text']].map(([key,label,type]) => <div className="field" key={key}><label>{label}</label><input required={['name','email','password'].includes(key)} type={type} value={form[key]} onChange={change(key)} /></div>)}
      <button disabled={loading} className="btn-primary">{loading ? 'Memproses...' : 'Daftar Perusahaan'}</button>
    </form>
    <p className="text-muted" style={{ fontSize: 13, marginTop: 18 }}>Sudah punya akun? <Link href="/employer/login">Masuk di sini</Link></p>
    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', marginTop: 14, textDecoration: 'none' }}>← Kembali ke Beranda</Link>
  </div></main>;
}
