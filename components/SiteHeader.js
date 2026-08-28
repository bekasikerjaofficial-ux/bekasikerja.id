'use client';
import React, { useState } from 'react';
import { Briefcase, Search, Menu, X } from 'lucide-react';

// Shared navbar — HeyLaw layout + BCA token (#005cab)
// Desktop: logo (kiri) | nav (center) | search + auth (kanan)
// Mobile (<860px): logo + hamburger (kiri) | auth (kanan), nav dropdown + search row di bawah
export default function SiteHeader({
  brand = 'BekasiKerja.id',
  logoUrl = null,
  active = '/',
  searchPlaceholder = 'Cari lowongan, perusahaan, atau artikel...',
  showSearch = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
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
            <Briefcase size={24} strokeWidth={2} />
          )}
          <span>{brand}</span>
        </a>

        <button
          className="nav-toggle"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${menuOpen ? 'mobile-open' : ''}`}>
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={active === n.href ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
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
            <a href="/member/register" className="btn-outline btn-pill" style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Daftar
            </a>
            <a href="/member/login" className="btn-login btn-pill">
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
