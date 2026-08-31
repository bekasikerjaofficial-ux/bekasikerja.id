'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import PackageCard from '../../components/PackageCard';
import { DEFAULT_PACKAGES } from '../../lib/packages';

export default function PaketPage() {
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from('packages').select('*').eq('active', true).order('sort_order', { ascending: true });
      if (active) setPackages(data && data.length ? data : DEFAULT_PACKAGES);
    };
    load().catch(() => { if (active) setPackages(DEFAULT_PACKAGES); });
    return () => { active = false; };
  }, []);

  const list = packages || DEFAULT_PACKAGES;

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/paket" showSearch={false} />

      <main>
        <section className="hero">
          <div className="container">
            <span className="badge">PAKET PSIKOTES &amp; TES MASUK KERJA</span>
            <h1>Persiapan Tes Masuk Kerja yang Terencana</h1>
            <p>
              Mulai dari gratis untuk lihat loker &amp; buat CV, hingga paket lengkap
              untuk semua jenis psikotes.
            </p>
          </div>
        </section>

        <section className="container section">
          <div className="package-grid">
            {list.map((pkg) => (
              <PackageCard key={pkg.slug || pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        <section className="container section" style={{ paddingTop: 0 }}>
          <div className="panel" style={{ padding: 24 }}>
            <h2 className="h-section" style={{ fontSize: 18, marginBottom: 12 }}>
              Bedanya tiap paket?
            </h2>
            <ul style={{ display: 'grid', gap: 10, fontSize: 14, margin: 0, paddingLeft: 18 }}>
              <li><strong>Gratis</strong> — lihat lowongan &amp; buat CV, tanpa tes.</li>
              <li><strong>Hemat</strong> — + Matematika Dasar &amp; Tes Logika Dasar.</li>
              <li><strong>Sultan</strong> — + Ketelitian &amp; Psikotes Umum.</li>
              <li><strong>Have</strong> — semua di atas + English Test &amp; Case Study.</li>
            </ul>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 12 }}>
              Pembayaran &amp; aktivasi paket berbayar saat ini dikelola oleh admin.
              Hubungi tim BekasiKerja untuk upgrade paket.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
