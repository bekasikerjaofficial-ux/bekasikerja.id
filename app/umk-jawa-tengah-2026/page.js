// app/umk-jawa-tengah-2026/page.js
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
const umkJateng = [
  { no: 1, name: 'Kota Surakarta', umk: 4963471 },
  { no: 2, name: 'Kota Salatiga', umk: 4733592 },
  { no: 3, name: 'Kota Semarang', umk: 4635846 },
  { no: 4, name: 'Kota Pekalongan', umk: 4521052 },
  { no: 5, name: 'Kota Tegal', umk: 4412838 },
  { no: 6, name: 'Kab. Karanganyar', umk: 4384825 },
  { no: 7, name: 'Kab. Sragen', umk: 4287366 },
  { no: 8, name: 'Kab. Wonogiri', umk: 4172422 },
  { no: 9, name: 'Kab. Boyolali', umk: 4079296 },
  { no: 10, name: 'Kab. Klaten', umk: 3973076 },
  { no: 11, name: 'Kab. Sukoharjo', umk: 3895349 },
  { no: 12, name: 'Kab. Bantul', umk: 3815346 },
  { no: 13, name: 'Kab. Gunungkidul', umk: 3720793 },
  { no: 14, name: 'Kab. Sleman', umk: 3653428 },
  { no: 15, name: 'Kab. Magelang', umk: 3583723 },
  { no: 16, name: 'Kab. Kulon Progo', umk: 3498542 },
  { no: 17, name: 'Kab. Wonosobo', umk: 3424159 },
  { no: 18, name: 'Kab. Temanggung', umk: 3357294 },
  { no: 19, name: 'Kab. Purworejo', umk: 3287066 },
  { no: 20, name: 'Kab. Kebumen', umk: 3218159 },
  { no: 21, name: 'Kab. Pekalongan', umk: 3145493 },
  { no: 22, name: 'Kab. Batang', umk: 3082441 },
  { no: 23, name: 'Kab. Kendal', umk: 3028781 },
  { no: 24, name: 'Kab. Demak', umk: 2964227 },
  { no: 25, name: 'Kab. Grobogan', umk: 2908544 },
  { no: 26, name: 'Kab. Blora', umk: 2853638 },
  { no: 27, name: 'Kab. Rembang', umk: 2796741 },
  { no: 28, name: 'Kab. Pati', umk: 2737344 },
  { no: 29, name: 'Kab. Jepara', umk: 2681470 },
  { no: 30, name: 'Kab. Karimun Jawa', umk: 2623583 },
  { no: 31, name: 'Kab. Cilacap', umk: 2568271 },
  { no: 32, name: 'Kab. Banjarnegara', umk: 2512169 },
  { no: 33, name: 'Kab. Purbalingga', umk: 2459145 },
]

const umpJateng = 2446880

export default function UMKJawaTengah2026() {
  return (
    <>
      <SiteHeader brand="BekasiKerja.id" active="/umk-jawa-tengah-2026" searchPlaceholder="Cari artikel UMK..." showSearch={false} />
      <div className="container" style={{ paddingTop: 12 }}><ArticleReaderCount slug="umk-jawa-tengah-2026" /></div>
      <section className="hero region-hero">
        <div className="container">
          <div>
            <span className="badge">INFO KERJA WILAYAH</span>
            <h1><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>UMK Jawa Tengah 2026</Link></h1>
            <p>Daftar lengkap Upah Minimum Kabupaten/Kota di seluruh wilayah Jawa Tengah. Update terbaru dari Keputusan Gubernur Jateng.</p>
            <div className="stats region-stats">
              <div className="stat"><div className="num region-stat-num">33+6</div><div className="lbl">Kabupaten/Kota</div></div>
              <div className="stat"><div className="num region-stat-num">{formatRupiah(4963471)}</div><div className="lbl">UMK Tertinggi</div></div>
              <div className="stat"><div className="num region-stat-num">{formatRupiah(umpJateng)}</div><div className="lbl">UMP Provinsi</div></div>
            </div>
          </div>
          <div><img className="illus region-illus" src="/placeholder.svg" alt="Kawasan industri Jawa Tengah" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMK Jawa Tengah?</h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Upah Minimum Kabupaten/Kota (UMK)</strong> Jawa Tengah 2026 ditetapkan melalui <strong>Keputusan Gubernur Jawa Tengah Nomor 561.2/Kep/83/2025</strong>.
            </p>
            <p style={{ marginBottom: 0 }}>
              UMP Provinsi Jawa Tengah 2026 sebesar <strong>{formatRupiah(umpJateng)} per bulan</strong> (+6,11% dari UMP 2025). UMK setiap kabupaten/kota umumnya <strong>lebih tinggi</strong> dari UMP provinsi.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 8 }}>Daftar UMK Jawa Tengah 2026</h2>
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
                  {umkJateng.map((item) => (
                    <tr key={item.no} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px 16px' }}>{item.no}</td>
                      <td style={{ padding: '10px 16px', fontWeight: item.no <= 5 ? 700 : 400 }}>{item.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: item.no <= 3 ? 'var(--hl-blue)' : 'inherit' }}>
                        {formatRupiah(item.umk)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>🏆 UMK Tertinggi Jawa Tengah</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { name: 'Kota Surakarta', umk: 4963471 },
                { name: 'Kota Salatiga', umk: 4733592 },
                { name: 'Kota Semarang', umk: 4635846 },
                { name: 'Kota Pekalongan', umk: 4521052 },
                { name: 'Kota Tegal', umk: 4412838 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: i === 0 ? 'var(--hl-blue)' : 'var(--gray-100)', color: i === 0 ? '#fff' : 'inherit', borderRadius: 8 }}>
                  <span style={{ fontWeight: 700 }}>#{i + 1} {item.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(item.umk)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>📉 UMK Terendah Jawa Tengah</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { name: 'Kab. Purbalingga', umk: 2459145 },
                { name: 'Kab. Banjarnegara', umk: 2568271 },
                { name: 'Kab. Cilacap', umk: 2623583 },
                { name: 'Kab. Jepara', umk: 2681470 },
                { name: 'Kab. Pati', umk: 2737344 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-100)', borderRadius: 8 }}>
                  <span style={{ fontWeight: 700 }}>#{i + 1} {item.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(item.umk)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              Cari Lowongan Kerja Terbaru
            </Link>
            <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 14 }}>
              ← Kembali ke Beranda
            </Link>
            <p className="text-muted" style={{ marginTop: 12, fontSize: 13, width: '100%' }}>
              Pastikan upah yang kamu terima tidak di bawah UMK daerahmu.
            </p>
          </div>
        </div>
      </main>
      <LatestNewsLinks />
      <SiteFooter brand="BekasiKerja.id" />
    </>
  )
}
