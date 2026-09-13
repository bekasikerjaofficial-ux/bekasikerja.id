import Link from 'next/link';
import { Search, Home, Briefcase, Package, FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '404 - Halaman Tidak Ditemukan | BekasiKerja',
  description: 'Halaman yang Anda cari tidak ditemukan. Kembali ke halaman utama BekasiKerja.',
};

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div className="container">
        <div style={{ fontSize: 96, fontWeight: 800, color: 'var(--hl-blue)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: 28, margin: '24px 0 12px' }}>Halaman Tidak Ditemukan</h1>
        <p className="text-muted" style={{ fontSize: 16, maxWidth: 500, margin: '0 auto 32px' }}>
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Mari kami bantu menemukan apa yang Anda butuhkan.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Home size={16} /> Beranda
          </Link>
          <Link href="/lowongan" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Briefcase size={16} /> Lowongan
          </Link>
          <Link href="/paket" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Package size={16} /> Paket
          </Link>
          <Link href="/ump-indonesia-2026" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <FileText size={16} /> Artikel
          </Link>
        </div>
      </div>
    </main>
  );
}
