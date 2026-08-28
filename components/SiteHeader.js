'use client';
import React from 'react';

// Shared navbar — HeyLaw layout + BCA token (#005cab)
// Props: brand (string), logoUrl (string|null), navItems, active (href),
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
            <span>💼</span>
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
          <input
            className="search"
            type="search"
            placeholder={searchPlaceholder}
            aria-label="Pencarian"
          />
        )}

        <div className="flex items-center gap-2.5">
          <a href="/member/register" className="btn-outline btn-pill" style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600 }}>
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
