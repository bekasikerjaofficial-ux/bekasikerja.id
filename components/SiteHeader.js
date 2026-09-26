'use client';
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Menu, X, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { isAdminEmail } from '../lib/admin-check';

export default function SiteHeader({
  brand = 'BekasiKerja.id',
  logoUrl = '/logo.png',
  active = '/',
  searchPlaceholder = 'Cari lowongan, perusahaan, atau artikel...',
  showSearch = true,
}) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Check if user is admin for menu visibility
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.className = next;
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      if (data.user) {
        setIsAdmin(isAdminEmail(data.user.email));
      } else {
        setIsAdmin(false);
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsAdmin(isAdminEmail(session?.user?.email));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      document.querySelector('header.header')?.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Beranda', key: '/' },
    { href: '/#lowongan', label: 'Lowongan', key: '/#lowongan' },
    { href: '/tes-gratis', label: 'Tes Gratis', key: '/tes-gratis' },
    { href: '/paket', label: 'Paket', key: '/paket' },
    { href: '/#lifestyle', label: 'Lifestyle', key: '/#lifestyle' },
    { href: '/ump-indonesia-2026', label: 'Artikel', key: '/ump-indonesia-2026' },
  ];

  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo" title="Kembali ke Beranda">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={32} height={32} priority style={{ objectFit: 'contain' }} />
          ) : (
            <Briefcase size={24} strokeWidth={2} />
          )}
          <span>{brand}</span>
        </a>

        <nav className="nav">
          {navLinks.map(link => (
            <a key={link.key} href={link.href} className={active === link.key ? 'active' : ''}>{link.label}</a>
          ))}
          {isAdmin && (
            <a href="/admin" className={active === '/admin' ? 'active' : ''} style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>Admin</a>
          )}
        </nav>

        <div className="header-actions">
          {/* Employer CTA is the header's single dominant action: solid teal,
              slightly larger than the auth buttons. "Daftar" stays a plain
              text link and "Login" an outline, so only one button is loud. */}
          <a href="/employer/register" className="btn-primary btn-pill btn-cta-main">
            Pasang Lowongan
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'}
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
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
            {user ? (
              <>
                {isAdmin && (
                  <a href="/admin" className="btn-primary btn-pill btn-daftar">Admin</a>
                )}
                <a href="/member/dashboard" className="btn-outline btn-pill btn-daftar">Dashboard</a>
                <button onClick={handleLogout} className="btn-login btn-pill btn-login-mobile">Logout</button>
              </>
            ) : (
              <>
                <a href="/member/register" className="btn-link-plain">Daftar</a>
                <a href="/member/login" className="btn-login btn-pill btn-login-mobile">Login</a>
              </>
            )}
          </div>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}
      <nav className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Menu navigasi mobile">
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand">Menu</span>
          <button className="mobile-drawer-close" onClick={closeMobileMenu} aria-label="Tutup menu">
            <X size={22} />
          </button>
        </div>
        <div className="mobile-nav-links">
          {navLinks.map(link => (
            <a
              key={link.key}
              href={link.href}
              className={active === link.key ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="mobile-auth-btns">
          {isAdmin && (
            <a href="/admin" className="btn-primary btn-pill" onClick={closeMobileMenu} style={{ textDecoration: 'none', textAlign: 'center' }}>
              Admin Dashboard
            </a>
          )}
          <a href="/employer/register" className="btn-primary btn-pill btn-cta-main" onClick={closeMobileMenu} style={{ textDecoration: 'none', textAlign: 'center' }}>
            Pasang Lowongan
          </a>
          {user ? (
            <>
              <a href="/member/dashboard" className="btn-outline btn-pill" onClick={closeMobileMenu}>Dashboard</a>
              <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="btn-login btn-pill">Logout</button>
            </>
          ) : (
            <>
              <a href="/member/register" className="btn-outline btn-pill" onClick={closeMobileMenu}>Daftar</a>
              <a href="/member/login" className="btn-login btn-pill" onClick={closeMobileMenu}>Login</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
