'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Briefcase, PlusCircle, Users, Bookmark, BarChart3, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ITEMS = [
  ['/employer', 'Dashboard', LayoutDashboard],
  ['/employer/profile', 'Profil Perusahaan', Building2],
  ['/employer/jobs', 'Lowongan Saya', Briefcase],
  ['/employer/jobs/new', 'Pasang Lowongan', PlusCircle],
  ['/employer/applicants', 'Pelamar', Users],
  ['/employer/saved-candidates', 'Kandidat Tersimpan', Bookmark],
  ['/employer/candidates', 'Cari Kandidat', Users],
  ['/employer/statistics', 'Statistik', BarChart3],
  ['/employer/packages', 'Paket & Pembayaran', CreditCard],
  ['/employer/notifications', 'Notifikasi', Bell],
  ['/employer/help', 'Bantuan', HelpCircle],
];

export default function EmployerShell({ children, companyName = 'Employer' }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => { await supabase.auth.signOut(); router.replace('/employer/login'); };
  return (
    <div className="employer-shell">
      <aside className="employer-sidebar">
        <Link href="/" className="logo" style={{ textDecoration: 'none', marginBottom: 24 }}>BekasiKerja.id</Link>
        <div className="text-muted" style={{ fontSize: 12, marginBottom: 16 }}>MEMBER PERUSAHAAN</div>
        <nav style={{ display: 'grid', gap: 4 }}>
          {ITEMS.map(([href, label, Icon]) => (
            <Link key={href} href={href} className={pathname === href ? 'employer-nav active' : 'employer-nav'}>
              <Icon size={17} /> <span>{label}</span>
            </Link>
          ))}
          <button type="button" onClick={logout} className="employer-nav" style={{ border: 0, width: '100%', textAlign: 'left' }}><LogOut size={17} /> <span>Logout</span></button>
        </nav>
      </aside>
      <main className="employer-main">
        <div className="employer-topbar">
          <div><span className="text-muted" style={{ fontSize: 12 }}>MEMBER PERUSAHAAN</span><h1 style={{ fontSize: 20, margin: '4px 0 0' }}>{companyName}</h1></div>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 12 }}>← Beranda</Link>
        </div>
        {children}
      </main>
    </div>
  );
}
