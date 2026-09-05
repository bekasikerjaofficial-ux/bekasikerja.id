// app/umk-jawa-tengah-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

const umkJateng = [
  { no: 1, name: 'Kota Semarang', umk: 4672352 },
  { no: 2, name: 'Kab. Semarang', umk: 4499948 },
  { no: 3, name: 'Kota Surakarta', umk: 4447730 },
  { no: 4, name: 'Kab. Sukoharjo', umk: 4293820 },
  { no: 5, name: 'Kota Salatiga', umk: 4127311 },
  { no: 6, name: 'Kab. Kendal', umk: 3895804 },
  { no: 7, name: 'Kab. Wonogiri', umk: 3623861 },
  { no: 8, name: 'Kab. Karanganyar', umk: 3594499 },
  { no: 9, name: 'Kab. Sragen', umk: 3508912 },
  { no: 10, name: 'Kab. Wonosobo', umk: 3188514 },
  { no: 11, name: 'Kab. Magelang', umk: 3167527 },
  { no: 12, name: 'Kab. Temanggung', umk: 3124961 },
  { no: 13, name: 'Kab. Cilacap', umk: 3115198 },
  { no: 14, name: 'Kab. Banyumas', umk: 3186513 },
  { no: 15, name: 'Kab. Purworejo', umk: 3082161 },
  { no: 16, name: 'Kab. Kulon Progo', umk: 3049574 },
  { no: 17, name: 'Kab. Kebumen', umk: 3011865 },
  { no: 18, name: 'Kota Tegal', umk: 3027460 },
  { no: 19, name: 'Kab. Tegal', umk: 2951355 },
  { no: 20, name: 'Kab. Batang', umk: 2925189 },
  { no: 21, name: 'Kab. Pemalang', umk: 2934861 },
  { no: 22, name: 'Kab. Pekalongan', umk: 2837818 },
  { no: 23, name: 'Kota Pekalongan', umk: 2902542 },
  { no: 24, name: 'Kab. Rembang', umk: 2843961 },
  { no: 25, name: 'Kab. Blora', umk: 2839531 },
  { no: 26, name: 'Kab. Bojonegoro', umk: 2833064 },
  { no: 27, name: 'Kab. Lamongan', umk: 2840915 },
  { no: 28, name: 'Kab. Brebes', umk: 2835251 },
  { no: 29, name: 'Kab. Purbalingga', umk: 2894630 },
  { no: 30, name: 'Kab. Banjarnegara', umk: 2962552 },
  { no: 31, name: 'Kab. Tuban', umk: 2801877 },
  { no: 32, name: 'Kab. Cirebon', umk: 2880798 },
  { no: 33, name: 'Kab. Jepara', umk: 2854137 },
]

export default function UMKJawaTengah2026() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">INFO KERJA WILAYAH</span>
            <h1>UMK Jawa Tengah 2026</h1>
            <p>Daftar lengkap Upah Minimum Kabupaten/Kota di seluruh wilayah Jawa Tengah. Update terbaru dari Keputusan Gubernur Jateng.</p>
            <div className="stats">
              <div className="stat"><div className="num">33+6</div><div className="lbl">Kabupaten/Kota</div></div>
              <div className="stat"><div className="num">{formatRupiah(4672352)}</div><div className="lbl">UMK Tertinggi</div></div>
              <div className="stat"><div className="num">{formatRupiah(2327386)}</div><div className="lbl">UMP Provinsi</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Kawasan industri Jawa Tengah" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMK Jawa Tengah?</h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Upah Minimum Kabupaten/Kota (UMK)</strong> Jawa Tengah adalah batas upah terendah yang wajib dibayar oleh pemberi kerja di masing-masing kabupaten/kota di wilayah Provinsi Jawa Tengah.
            </p>
            <p style={{ marginBottom: 12 }}>
              UMK 2026 ditetapkan melalui <strong>Keputusan Gubernur Jawa Tengah</strong> dan berlaku bagi seluruh pekerja dengan masa kerja kurang dari 1 tahun.
            </p>
            <p style={{ margin: 0 }}>
              Besaran UMK umumnya <strong>lebih tinggi</strong> dari UMP Provinsi Jawa Tengah yang ditetapkan sebesar Rp2.327.386 per bulan (+7,28% dari UMP 2025).
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
                      <td style={{ padding: '10px 16px', fontWeight: item.no <= 3 ? 700 : 400 }}>{item.name}</td>
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
              <p style={{ margin: 0 }}><strong>Kota Semarang</strong> — {formatRupiah(4672352)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Semarang</strong> — {formatRupiah(4499948)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kota Surakarta</strong> — {formatRupiah(4447730)}/bulan</p>
            </div>
            <div className="panel" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 12 }}>📉 UMK Terendah</h3>
              <p style={{ margin: 0 }}><strong>Kab. Tuban</strong> — {formatRupiah(2801877)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Bojonegoro</strong> — {formatRupiah(2833064)}/bulan</p>
              <p style={{ margin: '4px 0 0' }}><strong>Kab. Brebes</strong> — {formatRupiah(2835251)}/bulan</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Cari Lowongan Kerja di Jawa Tengah
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
