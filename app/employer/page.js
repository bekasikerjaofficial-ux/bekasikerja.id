'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EmployerShell from '../../components/EmployerShell';
import { employerFetch } from '../../lib/employer-client';

const labels = { active: 'Aktif', draft: 'Draft', pending_review: 'Menunggu Review', rejected: 'Ditolak', expired: 'Berakhir', archived: 'Diarsipkan' };
export default function EmployerDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { employerFetch('/api/employer/dashboard').then(setData).catch((err) => setError(err.message)); }, []);
  if (error) return <main className="auth-wrap"><div className="panel" style={{ padding: 28, maxWidth: 480, textAlign: 'center' }}><h1 className="h-section">Dashboard Employer</h1><p className="text-muted">{error}</p><Link href="/employer/onboarding" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>Lengkapi Profil Perusahaan</Link></div></main>;
  if (!data) return <main className="auth-wrap"><p className="text-muted">Memuat dashboard...</p></main>;
  const stats = data.stats || {};
  return <EmployerShell companyName={data.company?.name}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}><div><h2 className="h-display" style={{ fontSize: 24, margin: 0 }}>Dashboard</h2><p className="text-muted" style={{ fontSize: 13 }}>Ringkasan aktivitas rekrutmen perusahaan.</p></div><Link href="/employer/jobs/new" className="btn-primary" style={{ textDecoration: 'none' }}>+ Pasang Lowongan</Link></div>
    <div className="employer-stat-grid"><div className="employer-stat"><div className="value">{stats.activeJobs || 0}</div><div className="text-muted">Lowongan Aktif</div></div><div className="employer-stat"><div className="value">{stats.totalApplicants || 0}</div><div className="text-muted">Total Pelamar</div></div><div className="employer-stat"><div className="value">{stats.shortlisted || 0}</div><div className="text-muted">Shortlisted</div></div><div className="employer-stat"><div className="value">{stats.interviews || 0}</div><div className="text-muted">Interview</div></div></div>
    <section className="panel" style={{ padding: 20, marginTop: 24 }}><div className="section-head"><h2 className="h-section" style={{ margin: 0 }}>Lowongan yang Dikelola</h2><Link href="/employer/jobs" className="link-more">Lihat Semua ›</Link></div>{data.expiringJobs?.length ? <div className="employer-table-wrap"><table className="employer-table"><thead><tr><th>Posisi</th><th>Status</th><th>Batas Lamaran</th></tr></thead><tbody>{data.expiringJobs.map((job) => <tr key={job.id}><td>{job.title}</td><td><span className={`employer-status ${job.status}`}>{labels[job.status] || job.status}</span></td><td>{job.application_deadline || '-'}</td></tr>)}</tbody></table></div> : <p className="text-muted" style={{ fontSize: 13 }}>Belum ada lowongan. Mulai dengan memasang lowongan pertama.</p>}</section>
    <section className="panel" style={{ padding: 20, marginTop: 16 }}><h2 className="h-section" style={{ margin: 0 }}>Aktivitas Terbaru</h2><p className="text-muted" style={{ fontSize: 13, marginBottom: 0 }}>{data.recentApplications?.length ? `${data.recentApplications.length} aktivitas pelamar terbaru tersedia.` : 'Belum ada aktivitas pelamar.'}</p></section>
  </EmployerShell>;
}
