// app/umk-banten-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

const umkBanten = [
  { no: 1, name: 'Kota Tangerang Selatan', umk: 5247870, type: 'Kota' },
  { no: 2, name: 'Kota Cilegon', umk: 5469922, type: 'Kota' },
  { no: 3, name: 'Kab. Tangerang', umk: 5210377, type: 'Kab.' },
  { no: 4, name: 'Kab. Serang', umk: 5178521, type: 'Kab.' },
  { no: 5, name: 'Kota Tangerang', umk: 5399405, type: 'Kota' },
  { no: 6, name: 'Kota Serang', umk: 4665927, type: 'Kota' },
  { no: 7, name: 'Kab. Pandeglang', umk: 3360078, type: 'Kab.' },
  { no: 8, name: 'Kab. Lebak', umk: 3330010, type: 'Kab.' },
]

const umpBanten = 3100881

export default function UMKBanten2026() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">INFO KERJA WILAYAH</span>
            <h1>UMK Banten 2026</h1>
            <p>Daftar lengkap Upah Minimum Kabupaten/Kota di Provinsi Banten. Data resmi dari Keputusan Gubernur Banten Nomor 703 Tahun 2025.</p>
            <div className="stats">
              <div className="stat"><div className="num">4 Kab + 4 Kota</div><div className="lbl">Wilayah</div></div>
              <div className="stat"><div className="num">{formatRupiah(5469922)}</div><div className="lbl">UMK Tertinggi</div></div>
              <div className="stat"><div className="num">{formatRupiah(umpBanten)}</div><div className="lbl">UMP Provinsi</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Kawasan Banten" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMK Banten?</h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Upah Minimum Kabupaten/Kota (UMK)</strong> Banten 2026 ditetapkan melalui <strong>Keputusan Gubernur Banten Nomor 703 Tahun 2025</strong>.
            </p>
            <p style={{ margin: 0 }}>
              UMP Provinsi Banten 2026 sebesar <strong>{formatRupiah(umpBanten)} per bulan</strong> (+6,74% dari UMP 2025). UMK di Banten umumnya <strong>lebih tinggi</strong> dari UMP provinsi, dengan UMK tertinggi di Kota Cilegon dan Kota Tangerang.
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
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Tipe</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>UMK 2026</th>
                  </tr>
                </thead>
                <tbody>
                  {umkBanten.map((item) => (
                    <tr key={item.no} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px 16px' }}>{item.no}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{ background: item.type === 'Kota' ? 'var(--hl-blue)' : 'var(--hl-gold)', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--hl-blue)' }}>
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
              <p style={{ margin: 0 }}><strong>Kota Cilegon</strong> — {formatRupiah(5469922)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kota Tangerang</strong> — {formatRupiah(5399405)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Tangerang</strong> — {formatRupiah(5210377)}/bulan</p>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 12 }}>📉 UMK Terendah</h3>
              <p style={{ margin: 0 }}><strong>Kab. Lebak</strong> — {formatRupiah(3330010)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Pandeglang</strong> — {formatRupiah(3360078)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kota Serang</strong> — {formatRupiah(4665927)}/bulan</p>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Kenapa Banten UMK-nya Tinggi?</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>🏭 Zona Industri Padat</h3>
                <p className="text-muted" style={{ margin: 0 }}>Kota Cilegon — pusat industri petrokimia PT Indonesia Asahan Aluminium (Inalum) dan PT Krakatau Steel.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>🏙️ Jabodetabek Selatan</h3>
                <p className="text-muted" style={{ margin: 0 }}>Kota Tangerang &amp; Tangerang Selatan — bagian dari metropolitan Jakarta, banyak pusat perdagangan &amp; industri.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>📈 Pelabuhan &amp; Logistik</h3>
                <p className="text-muted" style={{ margin: 0 }}>Pelabuhan Merak dan zona ekonomi khusus mendorong pertumbuhan ekonomi Banten.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Cari Lowongan Kerja di Banten
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
