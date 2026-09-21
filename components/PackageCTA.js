'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { DEFAULT_PACKAGES } from '../lib/packages';

// Homepage CTA: latihan psikotes dan paket persiapan tes kerja.
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
  const marketingList = ['gratis', 'hemat', 'sultan', 'have']
    .map((slug) => list.find((pkg) => pkg.slug === slug))
    .filter(Boolean);

  return (
    <section className="container section" id="paket-cta">
      <div className="section-head">
        <div>
          <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Besok psikotes? Latihan sekarang.
          </h2>
          <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
            Pilih paket sesuai kebutuhan persiapan tes kerjamu.
          </p>
        </div>
        <a href="/paket" className="link-more">Lihat Semua Paket ›</a>
      </div>
      <div className="package-grid package-grid-three">
        {marketingList.map((pkg) => (
          <PackageCard key={pkg.slug || pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
