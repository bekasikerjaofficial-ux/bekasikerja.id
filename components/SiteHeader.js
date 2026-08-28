'use client';
import React from 'react';
import { Briefcase, Search } from 'lucide-react';

// Shared navbar — HeyLaw layout + BCA token (#005cab)
// Props: brand (string), logoUrl (string|null), active (href),
//        searchPlaceholder, rightButtons (ReactNode)
export default function SiteHeader({
  brand = 'BekasiKerja.id',
  logoUrl = null,
  active = '/',
  searchPlaceholder = 'Cari lowongan, perusahaan, atau artikel...',
  showSearch = true,
}) {
  const nav = [
    { href: '/', label: 'Beranda' },
    { href: '/#lowongan', label: 'Lowongan' },
    { href: '/#lifestyle', label: 'Lifestyle' },
  ];
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          ) : (
            <Briefcase size={24} strokeWidth={2.4} />
          )}
          <span>{brand}</span>
        </a>

        <nav className="nav">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={active === n.href ? 'active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>

        {showSearch && (
          <div className="search" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} color="var(--gray-500)" />
            <input
              style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', color: 'var(--gray-700)', fontSize: 14 }}
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Pencarian"
            />
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <a href="/member/register" className="btn-outline btn-pill" style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Daftar Member
          </a>
          <a href="/member/login" className="btn-login btn-pill">
            Login Member
          </a>
        </div>
      </div>
    </header>
  );
}
