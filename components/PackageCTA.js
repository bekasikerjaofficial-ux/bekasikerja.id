'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { DEFAULT_PACKAGES } from '../lib/packages';

// Homepage CTA: 4 Paket Psikotes. Render dari DB bila ada, else fallback konstanta.
export default function PackageCTA() {
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (active) setPackages(data && data.length ? data : DEFAULT_PACKAGES);
    };
    load().catch(() => { if (active) setPackages(DEFAULT_PACKAGES); });
    return () => { active = false; };
  }, []);

  const list = packages || DEFAULT_PACKAGES;

  return (
    <section className="container section" id="paket-cta">
      <div className="section-head">
        <div>
          <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Paket Psikotes &amp; Tes Masuk Kerja
          </h2>
          <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
            Pilih paket sesuai kebutuhan persiapan tes kerjamu.
          </p>
        </div>
        <a href="/paket" className="link-more">Lihat Semua Paket ›</a>
      </div>
      <div className="package-grid">
        {list.map((pkg) => (
          <PackageCard key={pkg.slug || pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
