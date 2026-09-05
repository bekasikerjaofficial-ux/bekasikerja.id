'use client';
import React from 'react';
import { Briefcase, Search } from 'lucide-react';

// Shared navbar — HeyLaw layout + BCA token (#005cab)
// Desktop: logo (kiri) | nav (center) | search + auth (kanan)
// Mobile (<860px): logo (kiri) | Daftar (kanan) — hamburger & nav disembunyiin (clean)
export default function SiteHeader({
  brand = 'BekasiKerja.id',
  logoUrl = null,
  active = '/',
  searchPlaceholder = 'Cari lowongan, perusahaan, atau artikel...',
  showSearch = true,
}) {
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
          ) : (
            <Briefcase size={24} strokeWidth={2} />
          )}
          <span>{brand}</span>
        </a>

        <nav className="nav">
          <a href="/" className={active === '/' ? 'active' : ''}>Beranda</a>
          <a href="/#lowongan" className={active === '/#lowongan' ? 'active' : ''}>Lowongan</a>
          <a href="/paket" className={active === '/paket' ? 'active' : ''}>Paket</a>
          <a href="/#lifestyle" className={active === '/#lifestyle' ? 'active' : ''}>Lifestyle</a>
          <a href="/ump-indonesia-2026" className={active === '/ump-indonesia-2026' ? 'active' : ''}>Artikel</a>
        </nav>

        <div className="header-actions">
          {showSearch && (
            <div className="search">
              <Search size={16} color="var(--gray-500)" />
              <input
                style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', color: 'var(--gray-700)', fontSize: 14 }}
                type="search"
                placeholder={searchPlaceholder}
                aria-label="Pencarian"
              />
            </div>
          )}
          <div className="auth-btns">
            <a href="/member/register" className="btn-outline btn-pill btn-daftar">Daftar</a>
            <a href="/member/login" className="btn-login btn-pill btn-login-mobile">Login</a>
          </div>
        </div>
      </div>
    </header>
  );
}
