'use client';

import React from 'react';
import { ArrowRight, BookOpen, Brain, Check, GraduationCap, Sparkles, Star } from 'lucide-react';
import { packageDisplayName } from '../lib/packages';

const PACKAGE_VISUALS = {
  gratis: { label: 'Mulai Gratis', format: 'Akses dasar karier', icon: Sparkles },
  hemat: { label: 'Basic', format: 'Latihan matematika & logika', icon: BookOpen },
  sultan: { label: 'Paling Populer', format: 'Persiapan psikotes lengkap', icon: Brain },
  have: { label: 'Ultimate VIP', format: 'Semua modul karier', icon: GraduationCap },
};

const PRICE_ANCHORS = {
  gratis: null,
  sultan: 150000,
  have: 300000,
};

function formatRupiah(value) {
  if (!value) return 'Gratis';
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

function discountPercent(original, current) {
  if (!original || !current || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

export default function PackageCard({ pkg, ctaHref }) {
  const visual = PACKAGE_VISUALS[pkg.slug] || PACKAGE_VISUALS.gratis;
  const VisualIcon = visual.icon;
  const originalPrice = PRICE_ANCHORS[pkg.slug];
  const discount = discountPercent(originalPrice, pkg.price);
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  const href = ctaHref || (pkg.slug === 'gratis' ? '/member/register' : `/checkout?paket=${pkg.slug}`);
  const isPopular = pkg.slug === 'sultan' || pkg.popular;
  const ctaLabel = pkg.slug === 'gratis' ? 'Mulai Gratis' : isPopular ? 'Ambil Promo Sekarang' : 'Pilih Paket';

  return (
    <article className={`pkg-card${isPopular ? ' popular' : ''}`}>
      {isPopular && <span className="pkg-badge"><Star size={13} /> Paling Populer</span>}
      <div className={`pkg-card-visual pkg-card-visual-${pkg.slug}`}>
        <span className="pkg-category-badge"><VisualIcon size={14} /> {visual.label}</span>
        <p className="pkg-format">{visual.format}</p>
        <h3 className="pkg-visual-title">{pkg.slug === 'have' ? 'Ultimate' : packageDisplayName(pkg)}</h3>
        <div className="pkg-visual-icon" aria-hidden="true"><VisualIcon size={54} strokeWidth={1.5} /></div>
      </div>
      <div className="pkg-card-content">
        <div className="pkg-price-label">Paket {pkg.slug === 'have' ? 'Ultimate VIP' : packageDisplayName(pkg)}</div>
        <div className="pkg-price-row">
          {originalPrice && <span className="pkg-old-price">{formatRupiah(originalPrice)}</span>}
          {discount && <span className="pkg-discount">Hemat {discount}%</span>}
        </div>
        <div className="pkg-price">{formatRupiah(pkg.price)}{pkg.price > 0 && <small> / {pkg.period}</small>}</div>
        {pkg.tagline && <p className="pkg-tagline">{pkg.tagline}</p>}
        {pkg.description && <p className="pkg-desc">{pkg.description}</p>}
        <a href={href} className={isPopular ? 'btn-primary pkg-cta' : 'btn-secondary pkg-cta'}>
          {ctaLabel} <ArrowRight size={15} />
        </a>
        <ul className="pkg-features" aria-label={`Benefit utama paket ${packageDisplayName(pkg)}`}>
          {features.filter((feature) => feature.included).slice(0, 3).map((feature, i) => (
            <li key={i} className="inc">
              <Check size={16} className="ic" aria-hidden="true" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
        <a href={href} className="pkg-detail">Lihat Detail <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
    </article>
  );
}
