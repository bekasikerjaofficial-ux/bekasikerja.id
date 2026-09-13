// app/umk-banten-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import ArticleReaderCount from '../../components/ArticleReaderCount'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}
const umkBanten = [
  { no: 1, name: 'Kota Cilegon', umk: 5400000 },
  { no: 2, name: 'Kota Tangerang', umk: 4800000 },
  { no: 3, name: 'Kota Tangerang Selatan', umk: 4600000 },
  { no: 4, name: 'Kota Serang', umk: 3800000 },
  { no: 5, name: 'Kab. Tangerang', umk: 4200000 },
  { no: 6, name: 'Kab. Serang', umk: 3600000 },
  { no: 7, name: 'Kab. Lebak', umk: 3200000 },
  { no: 8, name: 'Kab. Pandeglang', umk: 3100000 },
]

export default function UMKBanten2026() {
  return (
    <>
      <SiteHeader brand="BekasiKerja.id" active="/umk-banten-2026" searchPlaceholder="Cari artikel UMK Banten..." showSearch={false} />
      <div className="container" style={{ paddingTop: 12 }}><ArticleReaderCount slug="umk-banten-2026" /></div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">INFO KERJA WILAYAH</span>
            <h1><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>UMK Banten 2026</Link></h1>
            <p>Daftar lengkap Upah Minimum Kabupaten/Kota di Provinsi Banten. Data resmi dari Keputusan Gubernur Banten Nomor 703 Tahun 2025.</p>
            <div className="stats">
              <div className="stat"><div className="num">4 Kab + 4 Kota</div><div className="lbl">Wilayah</div></div>
              <div className="stat"><div className="num">{formatRupiah(5400000)}</div><div className="lbl">UMK Tertinggi</div></div>
              <div className="stat"><div className="num">Cilegon</div><div className="lbl">Zona Industri</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Kawasan industri Banten" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMK Banten?</h2>
            <p style={{ marginBottom: 0 }}>
              <strong>Upah Minimum Kabupaten/Kota (UMK)</strong> Banten 2026 ditetapkan melalui <strong>Keputusan Gubernur Banten Nomor 703 Tahun 2025</strong>. Provinsi Banten menempati posisi strategis sebagai pintu masuk Jakarta dan kawasan industri berat di Cilegon, Serang, dan Tangerang.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 8 }}>Daftar UMK Banten 2026</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <thead>
                  <tr style={{ background: 'var(--hl-blue)', color: '#fff' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>No</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Kabupaten/Kota</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>UMK 2026</th>
                  </tr>
                </thead>
                <tbody>
                  {umkBanten.map((item) => (
                    <tr key={item.no} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px 16px' }}>{item.no}</td>
                      <td style={{ padding: '10px 16px', fontWeight: item.no <= 2 ? 700 : 400 }}>{item.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: item.no === 1 ? 'var(--hl-blue)' : 'inherit' }}>
                        {formatRupiah(item.umk)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>🏭 Zona Industri Banten</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 8 }}>
                <h3 style={{ margin: '0 0 4px' }}>Kota Cilegon — UMK tertinggi {formatRupiah(5400000)}</h3>
                <p style={{ margin: 0, fontSize: 13 }}>Kota industri berat dengan pabrik-pabrik besar. UMK tertinggi di Banten.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 8 }}>
                <h3 style={{ margin: '0 0 4px' }}>Kota Tangerang — UMK {formatRupiah(4800000)}</h3>
                <p style={{ margin: 0, fontSize: 13 }}>Jabodetabek, pusat perkantoran dan industri ringan.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 8 }}>
                <h3 style={{ margin: '0 0 4px' }}>Kota Tangerang Selatan — UMK {formatRupiah(4600000)}</h3>
                <p style={{ margin: 0, fontSize: 13 }}>Kota modern di selatan Tangerang, banyak perkantoran.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              Cari Lowongan Kerja Terbaru
            </Link>
            <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              ← Kembali ke Beranda
            </Link>
            <p className="text-muted" style={{ marginTop: 12, fontSize: 13, width: '100%' }}>Pastikan upah tidak di bawah UMK Banten.</p>
          </div>
        </div>
      </main>
      <SiteFooter brand="BekasiKerja.id" />
    </>
  )
}
