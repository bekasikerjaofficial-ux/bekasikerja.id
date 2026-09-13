import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../components/SiteHeader'
import SiteFooter from '../../../components/SiteFooter'
import ArticleReaderCount from '../../../components/ArticleReaderCount'
import { getUmpBySlug, umpData, formatRupiah } from '../../../lib/ump-data'

export function generateStaticParams() { return umpData.map(({ slug }) => ({ slug })) }

export function generateMetadata({ params }) {
  const item = getUmpBySlug(params.slug)
  if (!item) return { title: 'Artikel UMP 2026' }
  return { title: `UMP ${item.prov} 2026: Kenaikan dari UMP 2025`, description: `Informasi UMP ${item.prov} 2026, kenaikan dari UMP 2025, dan dampaknya bagi pekerja.` }
}

export default function UmpProvincePage({ params }) {
  const item = getUmpBySlug(params.slug)
  if (!item) notFound()
  const delta = item.ump2026 - item.ump2025
  return <>
    <SiteHeader brand="BekasiKerja.id" logoUrl="/logo.png" active="/ump-indonesia-2026" showSearch={false} />
    <section className="hero"><div className="container"><div>
      <span className="badge">INFO UMP 2026</span>
      <h1>UMP {item.prov} 2026</h1>
      <p>Perbandingan UMP {item.prov} tahun 2025 dan 2026, termasuk nilai kenaikan upah minimum provinsi.</p>
      <ArticleReaderCount slug={`ump-${item.slug}-2026`} />
      <div className="stats">
        <div className="stat"><div className="num">{formatRupiah(item.ump2026)}</div><div className="lbl">UMP 2026</div></div>
        <div className="stat"><div className="num">{item.naik}</div><div className="lbl">Kenaikan</div></div>
        <div className="stat"><div className="num">{formatRupiah(delta)}</div><div className="lbl">Kenaikan Rupiah</div></div>
      </div>
    </div><div><img className="illus" src="/placeholder.svg" alt={`Ilustrasi pekerja ${item.prov}`} /></div></div></section>
    <main id="main" className="section"><div className="container">
      <article className="panel" style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h2 className="h-section">UMP {item.prov} 2026 naik {item.naik}</h2>
        <p>UMP {item.prov} tahun 2026 ditetapkan sebesar <strong>{formatRupiah(item.ump2026)} per bulan</strong>. Nilai ini naik {item.naik} atau sekitar <strong>{formatRupiah(delta)}</strong> dibandingkan UMP {item.prov} tahun 2025 sebesar {formatRupiah(item.ump2025)}.</p>
        <h2 className="h-section" style={{ marginTop: 24 }}>Perbandingan UMP 2025 dan 2026</h2>
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          <tr><th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--gray-200)' }}>UMP 2025</th><td style={{ textAlign: 'right', padding: 12, borderBottom: '1px solid var(--gray-200)' }}>{formatRupiah(item.ump2025)}</td></tr>
          <tr><th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--gray-200)' }}>UMP 2026</th><td style={{ textAlign: 'right', padding: 12, borderBottom: '1px solid var(--gray-200)', fontWeight: 800 }}>{formatRupiah(item.ump2026)}</td></tr>
          <tr><th style={{ textAlign: 'left', padding: 12 }}>Kenaikan</th><td style={{ textAlign: 'right', padding: 12, color: 'var(--hl-teal)', fontWeight: 800 }}>{formatRupiah(delta)} ({item.naik})</td></tr>
        </tbody></table></div>
        <h2 className="h-section" style={{ marginTop: 24 }}>Catatan untuk pekerja</h2>
        <p>UMP adalah batas upah minimum tingkat provinsi. Perusahaan wajib memperhatikan ketentuan upah minimum yang berlaku. Pekerja dengan masa kerja satu tahun atau lebih juga perlu melihat struktur dan skala upah perusahaan.</p>
        <p className="text-muted" style={{ fontSize: 12, marginTop: 24 }}>Catatan data: angka di artikel ini mengikuti dataset UMP 2025–2026 yang sudah digunakan pada artikel utama BekasiKerja.id. UMK kabupaten/kota dapat berbeda dan umumnya memiliki ketetapan tersendiri.</p>
      </article>
      <div style={{ textAlign: 'center', marginTop: '80px', marginBottom: '80px' }}>
        <Link href="/ump-indonesia-2026" className="btn-secondary">← Lihat daftar seluruh provinsi</Link>
        <span style={{ margin: '0 8px', color: 'var(--gray-300)' }}>|</span>
        <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>Kembali ke Beranda</Link>
      </div>
    </div></main>
    <SiteFooter brand="BekasiKerja.id" />
  </>
}
