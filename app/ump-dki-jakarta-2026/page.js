// app/ump-dki-jakarta-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

export default function UMPDKIJakarta2026() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">🏆 TERKINI</span>
            <h1>UMP DKI Jakarta 2026</h1>
            <p>Rp5.729.876 per bulan — tertinggi di seluruh Indonesia! Update terbaru besaran upah minimum DKI Jakarta tahun 2026.</p>
            <div className="stats">
              <div className="stat"><div className="num">{formatRupiah(5729876)}</div><div className="lbl">UMP 2026</div></div>
              <div className="stat"><div className="num">+6,17%</div><div className="lbl">Kenaikan</div></div>
              <div className="stat"><div className="num">#1</div><div className="lbl">Nasional</div></div>
            </div>
          </div>
          <div><img className="illus" src="/placeholder.svg" alt="Jakarta business district" /></div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Detail UMP DKI Jakarta 2026</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <strong>UMP 2026:</strong> {formatRupiah(5729876)} per bulan
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <strong>UMP 2025:</strong> {formatRupiah(5396761)} per bulan
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <strong>Kenaikan:</strong> +6,17% (+Rp333.115)
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <strong>Dasar Hukum:</strong> PP No. 49 Tahun 2025
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <strong>Berlaku sejak:</strong> 1 Januari 2026
              </div>
              <div style={{ padding: 16, background: 'var(--hl-blue)', color: '#fff', borderRadius: 12 }}>
                <strong>Posisi Nasional:</strong> #1 Tertinggi di Indonesia
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Mengapa Jakarta Paling Tinggi?</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <h3 style={{ marginBottom: 4 }}>💰 Biaya Hidup Tinggi</h3>
                <p className="text-muted" style={{ margin: 0 }}>Jakarta adalah pusat ekonomi nasional dengan biaya hidup tertinggi di Indonesia.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>📈 Pertumbuhan Ekonomi Kuat</h3>
                <p className="text-muted" style={{ margin: 0 }}>Kontribensi PDB DKI Jakarta sekitar 17% dari total nasional.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>🏢 Investasi Besar</h3>
                <p className="text-muted" style={{ margin: 0 }}>Banyak perusahaan nasional dan multinasional berbasis di Jakarta.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>📊 Inflasi Terkendali</h3>
                <p className="text-muted" style={{ margin: 0 }}>Kombinasi inflasi + pertumbuhan ekonomi menghasilkan nilai alfa tinggi dalam formula UMP.</p>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Perbandingan UMP/UMK Jabodetabek</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: 'var(--hl-blue)', color: '#fff' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Kota</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Provinsi</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>UMK/UMP 2026</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}><td style={{ padding: '10px 16px', fontWeight: 700 }}>DKI Jakarta (UMP)</td><td style={{ padding: '10px 16px' }}>DKI Jakarta</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>{formatRupiah(5729876)}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}><td style={{ padding: '10px 16px', fontWeight: 700 }}>Kota Bekasi (UMK)</td><td style={{ padding: '10px 16px' }}>Jawa Barat</td><td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--hl-blue)' }}>{formatRupiah(5999443)} ⭐</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}><td style={{ padding: '10px 16px' }}>Kab. Bekasi (UMK)</td><td style={{ padding: '10px 16px' }}>Jawa Barat</td><td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatRupiah(5938885)}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}><td style={{ padding: '10px 16px' }}>Kota Depok (UMK)</td><td style={{ padding: '10px 16px' }}>Jawa Barat</td><td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatRupiah(5522662)}</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--gray-200)' }}><td style={{ padding: '10px 16px' }}>Kota Bogor (UMK)</td><td style={{ padding: '10px 16px' }}>Jawa Barat</td><td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatRupiah(5437203)}</td></tr>
                  <tr><td style={{ padding: '10px 16px' }}>Kab. Bogor (UMK)</td><td style={{ padding: '10px 16px' }}>Jawa Barat</td><td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatRupiah(5161769)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>FAQ — UMP DKI Jakarta 2026</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <h3 style={{ marginBottom: 4 }}>Berapa UMP DKI Jakarta 2026?</h3>
                <p className="text-muted" style={{ margin: 0 }}>{formatRupiah(5729876)} per bulan. Tertinggi di seluruh Indonesia.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <h3 style={{ marginBottom: 4 }}>Berapa kenaikan UMP DKI Jakarta 2026?</h3>
                <p className="text-muted" style={{ margin: 0 }}>+6,17% dari UMP 2025 sebesar {formatRupiah(5396761)}. Kenaikan Rp333.115 per bulan.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <h3 style={{ marginBottom: 4 }}>Kapan UMP 2026 berlaku?</h3>
                <p className="text-muted" style={{ margin: 0 }}>Sejak 1 Januari 2026. Ditetapkan melalui Keputusan Gubernur DKI Jakarta berdasarkan PP No. 49/2025.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--gray-100)', borderRadius: 12 }}>
                <h3 style={{ marginBottom: 4 }}>Apakah UMK Jakarta lebih tinggi dari UMP?</h3>
                <p className="text-muted" style={{ margin: 0 }}>Ya. UMK setiap kabupaten/kota administrasi DKI Jakarta umumnya Rp500.000–800.000 lebih tinggi dari UMP Provinsi.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--hl-blue)', color: '#fff', borderRadius: 12 }}>
                <h3 style={{ marginBottom: 4, color: '#fff' }}>💡 Menarik: UMK Kota Bekasi lebih tinggi dari UMP Jakarta!</h3>
                <p style={{ margin: 0, color: '#fff' }}>Karena Kota Bekasi berada di Provinsi Jawa Barat, UMK-nya ({formatRupiah(5999443)}) justru lebih tinggi dari UMP DKI Jakarta ({formatRupiah(5729876)}).</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Cari Lowongan Kerja di Jakarta
            </Link>
            <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>
              Pastikan upah yang kamu terima tidak di bawah UMP/UMK daerah masing-masing.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
