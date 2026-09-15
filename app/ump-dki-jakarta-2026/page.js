// app/ump-dki-jakarta-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import ArticleReaderCount from '../../components/ArticleReaderCount'
import LatestNewsLinks from '../../components/LatestNewsLinks'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}
const umpDki = {
  ump2025: 5396761,
  ump2026: 5729876,
  naik: '+6,17%',
}
const umkDki = {
  kabupaten: [
    { name: 'Kab. Bekasi', umk: 5284005 },
    { name: 'Kab. Karawang', umk: 3725000 },
    { name: 'Kab. Bogor', umk: 4500000 },
    { name: 'Kab. Tangerang', umk: 4200000 },
    { name: 'Kab. Cianjur', umk: 3300000 },
  ],
  kota: [
    { name: 'Kota Bekasi', umk: 5999443 },
    { name: 'Kota Tangerang', umk: 4800000 },
    { name: 'Kota Depok', umk: 4700000 },
    { name: 'Kota Cilegon', umk: 4300000 },
    { name: 'Kota Tangerang Selatan', umk: 4600000 },
  ],
}

export default function UMPDKIJakarta2026() {
  return (
    <>
      <SiteHeader brand="BekasiKerja.id" active="/ump-dki-jakarta-2026" searchPlaceholder="Cari artikel UMP DKI..." showSearch={false} />
      <div className="container" style={{ paddingTop: 12 }}><ArticleReaderCount slug="ump-dki-jakarta-2026" /></div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">🏆 TERKINI</span>
            <h1><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>UMP DKI Jakarta 2026</Link></h1>
            <p>Rp5.729.876 per bulan — tertinggi di seluruh Indonesia! Update terbaru besaran upah minimum DKI Jakarta tahun 2026.</p>
            <div className="stats">
              <div className="stat"><div className="num">{formatRupiah(5729876)}</div><div className="lbl">UMP 2026</div></div>
              <div className="stat"><div className="num">+6,17%</div><div className="lbl">Kenaikan</div></div>
              <div className="stat"><div className="num">4K+4Kab</div><div className="lbl">UMK Daerah</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Kawasan industri Jakarta" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMP DKI Jakarta?</h2>
            <p style={{ marginBottom: 0 }}>
              <strong>UPah Minimum Provinsi (UMP) DKI Jakarta</strong> 2026 sebesar <strong>{formatRupiah(5729876)} per bulan</strong> (+6,17% dari UMP 2025). Ditetapkan berdasarkan PP No. 49/2025 dan Keputusan Gubernur DKI Jakarta.
            </p>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>📊 Detail UMP DKI Jakarta 2026</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--hl-blue)', color: '#fff', borderRadius: 8 }}>
                <span>UMP 2025</span>
                <span style={{ fontWeight: 700 }}>{formatRupiah(5396761)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--hl-blue)', color: '#fff', borderRadius: 8 }}>
                <span>UMP 2026</span>
                <span style={{ fontWeight: 700 }}>{formatRupiah(5729876)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-100)', borderRadius: 8 }}>
                <span>Kenaikan</span>
                <span style={{ fontWeight: 700, color: 'var(--hl-green)' }}>+6,17%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-100)', borderRadius: 8 }}>
                <span>Dasar Hukum</span>
                <span style={{ fontWeight: 700 }}>PP No. 49/2025</span>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>📋 UMK DKI Jakarta & Sekitarnya</h2>
            <h3 style={{ marginBottom: 8 }}>Kabupaten</h3>
            <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
              {umkDki.kabupaten.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--gray-100)', borderRadius: 8 }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(item.umk)}</span>
                </div>
              ))}
            </div>
            <h3 style={{ marginBottom: 8 }}>Kota</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {umkDki.kota.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--gray-100)', borderRadius: 8 }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(item.umk)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>💡 Menarik: UMK Kota Bekasi lebih tinggi dari UMP Jakarta!</h2>
            <p style={{ margin: 0 }}>Karena Kota Bekasi berada di Provinsi Jawa Barat, UMK-nya ({formatRupiah(5999443)}) justru lebih tinggi dari UMP DKI Jakarta ({formatRupiah(5729876)}).</p>
          </div>

          <div className="panel" style={{ padding: 24, marginTop: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Pertanyaan Umum</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Berapa UMP DKI Jakarta 2026?</h3>
                <p className="text-muted" style={{ margin: 0 }}>Rp5.729.876 per bulan (+6,17%).</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Apakah UMK DKI Jakarta lebih tinggi dari UMP?</h3>
                <p className="text-muted" style={{ margin: 0 }}>UMK Kota Bekasi ({formatRupiah(5999443)}) lebih tinggi dari UMP DKI Jakarta ({formatRupiah(5729876)}).</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Kapan UMP DKI 2026 berlaku?</h3>
                <p className="text-muted" style={{ margin: 0 }}>Sejak 1 Januari 2026.</p>
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
            <p className="text-muted" style={{ marginTop: 12, fontSize: 13, width: '100%' }}>Pastikan upah tidak di bawah UMP/UMK daerahmu.</p>
          </div>
        </div>
      </main>
      <LatestNewsLinks />
      <SiteFooter brand="BekasiKerja.id" />
    </>
  )
}
