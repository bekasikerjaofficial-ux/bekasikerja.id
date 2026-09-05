// app/loker/sam-putra-inti-people-culture-head/page.js
'use client'
import React from 'react'
import Link from 'next/link'
import { MapPin, CalendarClock, Briefcase, Users, Building2 } from 'lucide-react'

const featuredImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'

export default function JobDetail() {
  return (
    <div>
      {/* HERO dengan featured image */}
      <section className="hero" style={{ paddingTop: 'var(--sp-20)', paddingBottom: 'var(--sp-20)' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={featuredImage}
            alt="People and Culture Head — PT. Sam Putra Inti"
            style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-card-hover)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,92,171,.85) 0%, rgba(0,74,137,.9) 100%)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', textAlign: 'center', padding: 'var(--sp-6)' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.6)' }}>LOWONGAN KERJA</span>
            <h1 style={{ fontSize: 'var(--fs-4xl)', fontWeight: 800, marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-2)' }}>People and Culture Head</h1>
            <p style={{ fontSize: 'var(--fs-xl)', opacity: .95, maxWidth: 600, margin: 0 }}>PT. Sam Putra Inti — Bekasi, Jawa Barat</p>
          </div>
        </div>
      </section>

      <main id="main" className="section">
        <div className="container">
          {/* Info Card */}
          <div className="panel" style={{ padding: 32, marginBottom: 32 }}>
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Building2 size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>PT. Sam Putra Inti</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Industri Manufaktur — Bekasi, Jawa Barat</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Briefcase size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>People and Culture Head</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Bidang: Manajemen — Internal (HR & Perekrutan)</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <MapPin size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>Bekasi, Jawa Barat</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Lokasi kerja: Kota Bekasi, Provinsi Jawa Barat</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Users size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>Full Time</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Jenis pekerjaan: Full time</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <CalendarClock size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>Rp 8.000.000 – Rp 10.000.000 / bulan</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Kisaran gaji yang ditawarkan</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <CalendarClock size={24} color="var(--hl-blue)" />
                <div>
                  <strong style={{ fontSize: 16 }}>Diposting 3 hari yang lalu</strong>
                  <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>Waktu posting dari perusahaan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="split">
            {/* MAIN: Responsibilities */}
            <section>
              <div className="panel" style={{ padding: 32 }}>
                <h2 className="h-section" style={{ marginBottom: 24 }}>
                  <Users size={24} color="var(--hl-blue)" style={{ display: 'inline', marginRight: 8 }} />
                  Tanggung Jawab
                </h2>
                <ul style={{ display: 'grid', gap: 16, listStyle: 'none', padding: 0 }}>
                  {[
                    'Partner with Board of Directors dan other leaders untuk mengembangkan serta mengeksekusi People and Culture strategies yang mendukung pertumbuhan bisnis dan tujuan organisasi.',
                    'Lead, coach, dan develop tim di People Operations, Talent Acquisition, Learning & Development, dan General Affairs.',
                    'Lead organizational redesign dan workforce planning untuk mendukung pertumbuhan bisnis 5 tahun ke depan.',
                    'Oversee People Operations termasuk HRIS (Mekari Talenta), payroll, PPh 21, BPJS, compensation & benefits, employee administration, onboarding, attendance, leave management, dan HR data accuracy.',
                    'Bangun talent pipeline yang berkelanjutan dan tingkatkan quality of hire.',
                    'Develop dan oversee performance management system (KPIs) untuk memastikan alignment dengan target perusahaan.',
                    'Lead employee engagement dan culture initiatives yang memperkuat alignment dengan company values, meningkatkan retention, dan enhance organizational performance.',
                    'Manage annual HR dan General Affairs budget dengan mengoptimalkan biaya, efisiensi sumber daya, dan operational excellence.',
                    'Manage complex industrial relations termasuk dispute resolution dan disciplinary processes.',
                    'Lead General Affairs operations, memastikan efisiensi workplace dan facility management, office assets, vendor management, procurement coordination, building maintenance, Foreign Employee Administration (KITAS), LKPM, BPS, dan environment yang aman, compliant, dan produktif.',
                    'Lead Industrial Relations dengan memastikan compliance terhadap labor laws, employment agreements (PKWT/PKWTT), Peraturan Perusahaan, employee disciplinary processes, warning letters (SP), dan HR governance.',
                    'Pastikan HR compliance dengan regulasi yang berlaku sambil mendukung ISO requirements, internal dan external audits, actuarial processes.',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--gray-200)' }}>
                      <span style={{ background: 'var(--hl-blue)', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                      <span style={{ fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* SIDEBAR: Qualifications */}
            <aside>
              <div className="panel" style={{ padding: 32 }}>
                <h2 className="h-section" style={{ marginBottom: 24 }}>
                  <Briefcase size={24} color="var(--hl-blue)" style={{ display: 'inline', marginRight: 8 }} />
                  Kualifikasi
                </h2>
                <div style={{ display: 'grid', gap: 20 }}>
                  {[
                    'Bachelor&rsquo;s degree in Psychology, Law, Management, atau related discipline (Master&rsquo;s degree adalah keuntungan)',
                    'Minimum 5–7 years progressive experience di HRGA, dengan minimal 2–5 years di managerial/leadership role',
                    'Proven track record menangani industrial relations dan complex employee cases',
                    'Strong knowledge Indonesian labor laws dan regulatory frameworks',
                    'Experience dalam leading HR transformation atau system implementation (HRIS) sangat diprioritaskan (Mekari Talenta adalah keuntungan)',
                    'Demonstrated ability operate di both strategic dan hands-on levels',
                    'Strong business acumen dengan kemampuan menyelaraskan HR initiatives dengan organizational goals',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--gray-200)' }}>
                      <span style={{ background: 'var(--hl-gold)', color: 'var(--gray-900)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                      <span style={{ fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, padding: 20, background: 'var(--hl-blue)', color: '#fff', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--fs-xl)' }}>Rp 8–10jt / bulan</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, opacity: .95 }}>Full Time — Bekasi, Jawa Barat</p>
                </div>

                <a href="https://id.jobstreet.com/id/job/94366986/apply" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>
                  Lamar Sekarang →
                </a>
                <p className="text-muted" style={{ marginTop: 8, fontSize: 11, textAlign: 'center' }}>
                  *Lamar melalui JobStreet (sumber asli lowongan)
                </p>
              </div>
            </aside>
          </div>

          {/* Disclaimer */}
          <div className="panel" style={{ padding: 24, marginTop: 32, background: 'var(--gray-100)' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-500)' }}>
              <strong>Disclaimer:</strong> Lowongan ini bersumber dari <a href="https://id.jobstreet.com/id/job/94366986" target="_blank" rel="noopener" style={{ color: 'var(--hl-blue)' }}>JobStreet</a>. Informasi gaji, lokasi, dan kualifikasi dapat berubah sewaktu-waktu. Hubungi perusahaan langsung untuk konfirmasi terbaru. BekasiKerja.id tidak terlibat dalam proses rekrutmen.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
