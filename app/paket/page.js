'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ShieldCheck, Users, WalletCards } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import PackageCard from '../../components/PackageCard';
import { DEFAULT_PACKAGES } from '../../lib/packages';

const FAQS = [
  { q: 'Bagaimana cara mengaktifkan membership?', a: 'Pilih paket, daftar atau masuk ke akun Member, lalu ikuti instruksi aktivasi. Status paket akan terhubung ke akun yang digunakan saat pembelian.' },
  { q: 'Apakah paket bisa digunakan untuk semua tes?', a: 'Akses tes mengikuti benefit masing-masing paket. Detail fitur yang tersedia ditampilkan langsung di setiap kartu paket.' },
  { q: 'Apakah pembayaran aman dan bisa refund?', a: 'Pembayaran dan aktivasi paket saat ini masih dalam tahap maintenance dan dikelola oleh admin. Hubungi tim BekasiKerja sebelum melakukan pembayaran.' },
];

function selectMarketingPackages(source) {
  const bySlug = new Map(source.map((pkg) => [pkg.slug, pkg]));
  const wanted = ['gratis', 'sultan', 'have'];
  return wanted.map((slug) => bySlug.get(slug)).filter(Boolean);
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="package-faq" aria-labelledby="package-faq-title">
      <div className="package-faq-heading">
        <span className="badge">FAQ MEMBERSHIP</span>
        <h2 id="package-faq-title">Pertanyaan yang sering ditanyakan</h2>
        <p>Masih ragu memilih paket? Berikut jawaban singkatnya.</p>
      </div>
      <div className="faq-list">
        {FAQS.map((item, index) => (
          <div className={`faq-item${open === index ? ' open' : ''}`} key={item.q}>
            <button type="button" className="faq-question" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>
              <span>{item.q}</span><ChevronDown size={18} aria-hidden="true" />
            </button>
            {open === index && <p className="faq-answer">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PaketPage() {
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase.from('packages').select('*').eq('active', true).order('sort_order', { ascending: true });
      if (active) setPackages(selectMarketingPackages(data && data.length ? data : DEFAULT_PACKAGES));
    };
    load().catch(() => { if (active) setPackages(selectMarketingPackages(DEFAULT_PACKAGES)); });
    return () => { active = false; };
  }, []);

  const list = packages || selectMarketingPackages(DEFAULT_PACKAGES);

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/paket" showSearch={false} />
      <main>
        <section className="package-hero">
          <div className="container">
            <span className="badge">PAKET PSIKOTES &amp; TES MASUK KERJA</span>
            <h1>Lebih siap menghadapi tes, lebih dekat ke pekerjaan impian.</h1>
            <p>Mulai gratis, lalu pilih akses latihan yang sesuai dengan target kariermu di Bekasi, Cikarang, dan Karawang.</p>
          </div>
        </section>

        <section className="container package-pricing-section" aria-labelledby="package-pricing-title">
          <div className="package-section-heading">
            <div><span className="eyebrow">Pilih aksesmu</span><h2 id="package-pricing-title">Paket membership BekasiKerja</h2></div>
            <p>Benefit jelas, harga transparan, dan bisa dipilih sesuai kebutuhan persiapanmu.</p>
          </div>
          <div className="package-grid package-grid-three">
            {list.map((pkg) => <PackageCard key={pkg.slug || pkg.id} pkg={pkg} />)}
          </div>
        </section>

        <section className="container package-trust" aria-label="Keunggulan membership">
          <div><Users size={20} /><strong>Dipilih pencari kerja lokal</strong><span>untuk persiapan tes yang lebih terarah</span></div>
          <div><ShieldCheck size={20} /><strong>Benefit transparan</strong><span>lihat fitur sebelum memilih paket</span></div>
          <div><WalletCards size={20} /><strong>Aktivasi oleh admin</strong><span>hubungi tim sebelum pembayaran</span></div>
        </section>

        <div className="container"><FAQSection /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
