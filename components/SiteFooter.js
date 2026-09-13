'use client';
import React from 'react';
import { Briefcase, Newspaper } from 'lucide-react';
import Image from 'next/image';

// Shared footer — HeyLaw 3-column layout + BCA navy
export default function SiteFooter({ brand = 'BekasiKerja.id', logoUrl = '/logo.png' }) {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={24} height={24} style={{ objectFit: 'contain' }} />
            ) : (
              <Briefcase size={18} />
            )}
            {brand}
          </h3>
          <p style={{ fontSize: 13, marginTop: 12, lineHeight: 1.7 }}>
            Portal lowongan kerja terverifikasi untuk kawasan industri Bekasi, Cikarang,
            dan Karawang. Info loker manufaktur & tips karir harian.
          </p>
        </div>

        <div>
          <h3>Navigasi</h3>
          <a href="/">Beranda</a>
          <a href="/#lowongan">Lowongan Kerja</a>
          <a href="/#lifestyle">Lifestyle &amp; Tips Karir</a>
          <a href="/cv-builder">CV Builder</a>
          <a href="/member/login">Member</a>
        </div>

        <div>
          <span style={{ fontSize: 12, display: 'block', opacity: 0.7 }}>
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
