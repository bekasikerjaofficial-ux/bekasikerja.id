// app/umk-jawa-timur-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

const umkJatim = [
  { no: 1, name: 'Kota Surabaya', umk: 5288796 },
  { no: 2, name: 'Kab. Gresik', umk: 5195401 },
  { no: 3, name: 'Kab. Sidoarjo', umk: 5191541 },
  { no: 4, name: 'Kab. Pasuruan', umk: 5187681 },
  { no: 5, name: 'Kab. Mojokerto', umk: 5176101 },
  { no: 6, name: 'Kab. Malang', umk: 3802862 },
  { no: 7, name: 'Kota Malang', umk: 3736101 },
  { no: 8, name: 'Kota Batu', umk: 3562484 },
  { no: 9, name: 'Kota Pasuruan', umk: 3555301 },
  { no: 10, name: 'Kab. Jombang', umk: 3320770 },
  { no: 11, name: 'Kab. Tuban', umk: 3229092 },
  { no: 12, name: 'Kota Mojokerto', umk: 3208556 },
  { no: 13, name: 'Kab. Lamongan', umk: 3196328 },
  { no: 14, name: 'Kab. Probolinggo', umk: 3164526 },
  { no: 15, name: 'Kota Probolinggo', umk: 3045172 },
  { no: 16, name: 'Kab. Jember', umk: 3012197 },
  { no: 17, name: 'Kab. Banyuwangi', umk: 2989145 },
  { no: 18, name: 'Kota Kediri', umk: 2742806 },
  { no: 19, name: 'Kab. Bojonegoro', umk: 2685983 },
  { no: 20, name: 'Kab. Kediri', umk: 2651603 },
  { no: 21, name: 'Kota Blitar', umk: 2639518 },
  { no: 22, name: 'Kab. Tulungagung', umk: 2628190 },
  { no: 23, name: 'Kota Madiun', umk: 2588794 },
  { no: 24, name: 'Kab. Lumajang', umk: 2578320 },
  { no: 25, name: 'Kab. Blitar', umk: 2567744 },
  { no: 26, name: 'Kab. Nganjuk', umk: 2564627 },
  { no: 27, name: 'Kab. Ngawi', umk: 2556815 },
  { no: 28, name: 'Kab. Magetan', umk: 2553866 },
  { no: 29, name: 'Kab. Sumenep', umk: 2553688 },
  { no: 30, name: 'Kab. Madiun', umk: 2553221 },
  { no: 31, name: 'Kab. Bangkalan', umk: 2550274 },
  { no: 32, name: 'Kab. Ponorogo', umk: 2549876 },
  { no: 33, name: 'Kab. Trenggalek', umk: 2530313 },
  { no: 34, name: 'Kab. Pamekasan', umk: 2528004 },
  { no: 35, name: 'Kab. Pacitan', umk: 2514892 },
  { no: 36, name: 'Kab. Bondowoso', umk: 2496886 },
  { no: 37, name: 'Kab. Sampang', umk: 2484443 },
  { no: 38, name: 'Kab. Situbondo', umk: 2483962 },
]

const umpJatim = 2446880

export default function UMKJawaTimur2026() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">INFO KERJA WILAYAH</span>
            <h1>UMK Jawa Timur 2026</h1>
            <p>Daftar lengkap Upah Minimum Kabupaten/Kota di seluruh wilayah Jawa Timur. Data resmi dari Keputusan Gubernur Jatim No. 100.3.3.1/937/013/2025.</p>
            <div className="stats">
              <div className="stat"><div className="num">35+3</div><div className="lbl">Kabupaten/Kota</div></div>
              <div className="stat"><div className="num">{formatRupiah(5288796)}</div><div className="lbl">UMK Tertinggi</div></div>
              <div className="stat"><div className="num">{formatRupiah(umpJatim)}</div><div className="lbl">UMP Provinsi</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Kawasan industri Jawa Timur" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMK Jawa Timur?</h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Upah Minimum Kabupaten/Kota (UMK)</strong> Jawa Timur 2026 ditetapkan melalui <strong>Keputusan Gubernur Jawa Timur Nomor 100.3.3.1/937/013/2025</strong>.
            </p>
            <p style={{ margin: 0 }}>
              UMP Provinsi Jawa Timur 2026 sebesar <strong>{formatRupiah(umpJatim)} per bulan</strong> (+6,11% dari UMP 2025). UMK setiap kabupaten/kota umumnya <strong>lebih tinggi</strong> dari UMP provinsi.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 8 }}>Daftar UMK Jawa Timur 2026</h2>
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
                  {umkJatim.map((item) => (
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

          <div className="split" style={{ marginBottom: 32 }}>
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 12 }}>🏆 UMK Tertinggi</h3>
              <p style={{ margin: 0 }}><strong>Kota Surabaya</strong> — {formatRupiah(5288796)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Gresik</strong> — {formatRupiah(5195401)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Sidoarjo</strong> — {formatRupiah(5191541)}/bulan</p>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 12 }}>📉 UMK Terendah</h3>
              <p style={{ margin: 0 }}><strong>Kab. Situbondo</strong> — {formatRupiah(2483962)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Sampang</strong> — {formatRupiah(2484443)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Bondowoso</strong> — {formatRupiah(2496886)}/bulan</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Cari Lowongan Kerja di Jawa Timur
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
