// app/ump-indonesia-2026/page.js
'use client'
import React from 'react'
import Link from 'next/link'

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}
const umpData = [
  { no: 1, prov: 'Aceh', ump2025: 3685616, ump2026: 3932552, naik: '+6,70%' },
  { no: 2, prov: 'Sumatera Utara', ump2025: 2992559, ump2026: 3228949, naik: '+7,90%' },
  { no: 3, prov: 'Sumatera Barat', ump2025: 2994193, ump2026: 3182955, naik: '+6,30%' },
  { no: 4, prov: 'Riau', ump2025: 3508776, ump2026: 3780495, naik: '+7,74%' },
  { no: 5, prov: 'Jambi', ump2025: 3234535, ump2026: 3471497, naik: '+7,33%' },
  { no: 6, prov: 'Sumatera Selatan', ump2025: 3681571, ump2026: 3942963, naik: '+7,10%' },
  { no: 7, prov: 'Bengkulu', ump2025: 2670039, ump2026: 2827250, naik: '+5,89%' },
  { no: 8, prov: 'Lampung', ump2025: 2893070, ump2026: 3047734, naik: '+5,35%' },
  { no: 9, prov: 'Kep. Bangka Belitung', ump2025: 3876600, ump2026: 4035000, naik: '+4,09%' },
  { no: 10, prov: 'Kepulauan Riau', ump2025: 3623654, ump2026: 3879520, naik: '+7,06%' },
  { no: 11, prov: 'DKI Jakarta', ump2025: 5396761, ump2026: 5729876, naik: '+6,17%' },
  { no: 12, prov: 'Jawa Barat', ump2025: 2191232, ump2026: 2317601, naik: '+5,77%' },
  { no: 13, prov: 'Jawa Tengah', ump2025: 2169349, ump2026: 2327386, naik: '+7,28%' },
  { no: 14, prov: 'DI Yogyakarta', ump2025: 2264080, ump2026: 2417495, naik: '+6,78%' },
  { no: 15, prov: 'Jawa Timur', ump2025: 2305985, ump2026: 2446880, naik: '+6,11%' },
  { no: 16, prov: 'Banten', ump2025: 2905119, ump2026: 3100881, naik: '+6,74%' },
  { no: 17, prov: 'Bali', ump2025: 2996561, ump2026: 3207459, naik: '+7,04%' },
  { no: 18, prov: 'Nusa Tenggara Barat', ump2025: 2602931, ump2026: 2673861, naik: '+2,73%' },
  { no: 19, prov: 'Nusa Tenggara Timur', ump2025: 2328969, ump2026: 2455898, naik: '+5,45%' },
  { no: 20, prov: 'Kalimantan Barat', ump2025: 2878286, ump2026: 3054552, naik: '+6,12%' },
  { no: 21, prov: 'Kalimantan Tengah', ump2025: 3473621, ump2026: 3686138, naik: '+6,12%' },
  { no: 22, prov: 'Kalimantan Selatan', ump2025: 3496195, ump2026: 3725000, naik: '+6,54%' },
  { no: 23, prov: 'Kalimantan Timur', ump2025: 3579314, ump2026: 3762431, naik: '+5,12%' },
  { no: 24, prov: 'Kalimantan Utara', ump2025: 3580160, ump2026: 3775243, naik: '+5,45%' },
  { no: 25, prov: 'Sulawesi Utara', ump2025: 3775425, ump2026: 4002630, naik: '+6,02%' },
  { no: 26, prov: 'Sulawesi Tengah', ump2025: 2915000, ump2026: 3179565, naik: '+9,08%' },
  { no: 27, prov: 'Sulawesi Selatan', ump2025: 3657527, ump2026: 3921088, naik: '+7,21%' },
  { no: 28, prov: 'Sulawesi Tenggara', ump2025: 3073552, ump2026: 3306496, naik: '+7,58%' },
  { no: 29, prov: 'Gorontalo', ump2025: 3221731, ump2026: 3405144, naik: '+5,69%' },
  { no: 30, prov: 'Sulawesi Barat', ump2025: 3104430, ump2026: 3315934, naik: '+6,81%' },
  { no: 31, prov: 'Maluku', ump2025: 3141700, ump2026: 3334490, naik: '+6,14%' },
  { no: 32, prov: 'Maluku Utara', ump2025: 3408000, ump2026: 3510240, naik: '+3,00%' },
  { no: 33, prov: 'Papua Barat', ump2025: 3615000, ump2026: 3841000, naik: '+6,25%' },
  { no: 34, prov: 'Papua', ump2025: 4285850, ump2026: 4436283, naik: '+3,51%' },
  { no: 35, prov: 'Papua Tengah', ump2025: 4285848, ump2026: 4285848, naik: '0,00%' },
  { no: 36, prov: 'Papua Pegunungan', ump2025: 4285850, ump2026: 4508714, naik: '+5,20%' },
  { no: 37, prov: 'Papua Selatan', ump2025: 4285850, ump2026: 4508100, naik: '+5,19%' },
  { no: 38, prov: 'Papua Barat Daya', ump2025: 3614000, ump2026: 3766000, naik: '+4,21%' },
]

export default function UMPIndonesia2026() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div>
            <span className="badge">INFORMASI KERJA TERKINI</span>
            <h1>Daftar UMP Indonesia Tahun 2026</h1>
            <p>Update terbaru besaran Upah Minimum Provinsi di seluruh 38 provinsi Indonesia. Bandingkan gaji minimum daerahmu!</p>
            <div className="stats">
              <div className="stat"><div className="num">38</div><div className="lbl">Provinsi</div></div>
              <div className="stat"><div className="num">{formatRupiah(5729876)}</div><div className="lbl">UMP Tertinggi</div></div>
              <div className="stat"><div className="num">PP 49/2025</div><div className="lbl">Dasar Hukum</div></div>
            </div>
          </div>
          <div>
            <img className="illus" src="/placeholder.svg" alt="Kawasan industri Indonesia" />
          </div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          {/* Pengantar */}
          <div className="panel" style={{ padding: 24, marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Apa Itu UMP 2026?</h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Upah Minimum Provinsi (UMP)</strong> adalah batas upah bulanan terendah yang wajib dibayar oleh setiap pemberi kerja kepada pekerja di wilayah provinsi tertentu. UMP 2026 ditetapkan melalui <strong>Peraturan Pemerintah Nomor 49 Tahun 2025</strong> yang disahkan Presiden Prabowo Subianto.
            </p>
            <p style={{ marginBottom: 12 }}>
              Formula baru perhitungan UMP 2026: <strong>Inflasi + (Pertumbuhan Ekonomi × Alfa)</strong> dengan nilai Alfa 0,5–0,9 (naik dari aturan sebelumnya 0,1–0,3).
            </p>
            <p style={{ marginBottom: 0 }}>
              UMP berlaku penuh bagi <strong>pekerja dengan masa kerja kurang dari 1 tahun</strong>. Untuk pekerja dengan masa kerja ≥ 1 tahun, pengupahan mengacu pada struktur dan skala upah perusahaan.
            </p>
          </div>

          {/* Tabel UMP */}
          <div style={{ marginBottom: 32 }}>
            <h2 className="h-section" style={{ marginBottom: 8 }}>Daftar Lengkap UMP 2026 — 38 Provinsi</h2>
            <p className="text-muted" style={{ marginBottom: 16 }}>Data berdasarkan PP No. 49/2025 dan Keputusan Gubernur masing-masing provinsi.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <thead>
                  <tr style={{ background: 'var(--hl-blue)', color: '#fff' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>No</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Provinsi</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>UMP 2025</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>UMP 2026</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Kenaikan</th>
                  </tr>
                </thead>
                <tbody>
                  {umpData.map((item) => (
                    <tr key={item.no} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600 }}>{item.no}</td>
                      <td style={{ padding: '10px 16px', fontWeight: item.no === 11 ? 800 : 400, color: item.no === 11 ? 'var(--hl-blue)' : 'inherit' }}>
                        {item.prov}{item.no === 11 ? ' ⭐' : ''}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>{formatRupiah(item.ump2025)}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>{formatRupiah(item.ump2026)}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          background: 'var(--hl-teal)', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 
                        }}>
                          {item.naik}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Highlight Cards */}
          <div className="package-grid" style={{ marginBottom: 32 }}>
            <div className="pkg-card popular">
              <div className="pkg-badge">🏆 Tertinggi</div>
              <div className="pkg-name">DKI Jakarta</div>
              <div className="pkg-price">{formatRupiah(5729876)}</div>
              <div className="pkg-tagline">Per bulan</div>
              <div className="pkg-desc">UPA 2026 tertinggi di seluruh Indonesia</div>
            </div>
            <div className="pkg-card">
              <div className="pkg-badge">📉 Terendah</div>
              <div className="pkg-name">Jawa Barat</div>
              <div className="pkg-price">{formatRupiah(2317601)}</div>
              <div className="pkg-tagline">Per bulan</div>
              <div className="pkg-desc">UMP terendah nasional — +5,77% dari 2025</div>
            </div>
            <div className="pkg-card">
              <div className="pkg-badge">📈 Kenaikan Terbesar</div>
              <div className="pkg-name">Sulawesi Tengah</div>
              <div className="pkg-price">+9,08%</div>
              <div className="pkg-tagline">Dari Rp2.915.000 → Rp3.179.565</div>
              <div className="pkg-desc">Provinsi dengan persentase kenaikan tertinggi</div>
            </div>
            <div className="pkg-card">
              <div className="pkg-badge">📝 Dasar Hukum</div>
              <div className="pkg-name">PP No. 49/2025</div>
              <div className="pkg-price" style={{ fontSize: 'var(--fs-xl)' }}>Formula Baru</div>
              <div className="pkg-tagline">Inflasi + (Pertumbuhan × Alfa 0,5–0,9)</div>
              <div className="pkg-desc">PP 49/2025 mengubah ketentuan pengupahan</div>
            </div>
          </div>

          {/* FAQ */}
          <div className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Pertanyaan Umum</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Berapa UMP tertinggi di Indonesia 2026?</h3>
                <p className="text-muted" style={{ margin: 0 }}>DKI Jakarta dengan UMP 2026 sebesar Rp5.729.876 per bulan.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Berapa UMP terendah di Indonesia 2026?</h3>
                <p className="text-muted" style={{ margin: 0 }}>Jawa Barat dengan UMP 2026 sebesar Rp2.317.601 per bulan.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Kapan UMP 2026 berlaku?</h3>
                <p className="text-muted" style={{ margin: 0 }}>UMP 2026 berlaku sejak 1 Januari 2026 dan ditetapkan melalui Keputusan Gubernur masing-masing provinsi.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Apakah UMP berlaku untuk semua pekerja?</h3>
                <p className="text-muted" style={{ margin: 0 }}>UMP berlaku penuh bagi pekerja dengan masa kerja kurang dari 1 tahun. Pekerja dengan masa kerja ≥ 1 tahun mengacu pada struktur dan skala upah perusahaan.</p>
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Apa bedanya UMP dan UMK?</h3>
                <p className="text-muted" style={{ margin: 0 }}>UMP ditetapkan di tingkat provinsi, sedangkan UMK (Upah Minimum Kabupaten/Kota) ditetapkan di tingkat kabupaten/kota dan umumnya lebih tinggi dari UMP.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/lowongan" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Cari Lowongan Kerja Terbaru
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
