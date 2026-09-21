'use client';
import React from 'react';
import { Check, X, Star, Brain, GraduationCap, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { packageDisplayName } from '../lib/packages';

function formatPrice(price, period) {
  if (!price || price === 0) return 'Gratis';
  const rp = new Intl.NumberFormat('id-ID').format(price);
  const suffix = period === 'bulan' ? '/bln' : period && period !== 'selamanya' ? '/' + period : '';
  return `Rp ${rp}${suffix}`;
}

const PACKAGE_VISUALS = {
  gratis: { label: 'Mulai Gratis', format: 'Akses dasar karier', icon: Sparkles },
  hemat: { label: 'Persiapan Dasar', format: 'Latihan matematika & logika', icon: BookOpen },
  sultan: { label: 'Paling Lengkap', format: 'Psikotes dan ketelitian', icon: Brain },
  have: { label: 'Karier Premium', format: 'Semua modul tanpa batas', icon: GraduationCap },
};

export default function PackageCard({ pkg, ctaHref }) {
  const href = ctaHref || (pkg.slug === 'gratis' ? '/member/register' : '/checkout?paket=' + pkg.slug);
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  const visual = PACKAGE_VISUALS[pkg.slug] || PACKAGE_VISUALS.gratis;
  const VisualIcon = visual.icon;
  const includedFeatures = features.filter((feature) => feature.included).slice(0, 4);

  return (
    <article className={`pkg-card${pkg.popular ? ' popular' : ''}`}>
      {pkg.popular && <span className="pkg-badge"><Star size={13} /> Terlaris</span>}
      <div className={`pkg-card-visual pkg-card-visual-${pkg.slug}`}>
        <span className="pkg-category-badge"><VisualIcon size={14} /> {visual.label}</span>
        <p className="pkg-format">{visual.format}</p>
        <h3 className="pkg-visual-title">{packageDisplayName(pkg)}</h3>
        <div className="pkg-visual-icon" aria-hidden="true"><VisualIcon size={54} strokeWidth={1.5} /></div>
      </div>
      <div className="pkg-card-content">
        <div className="pkg-price-label">Paket {packageDisplayName(pkg)}</div>
        <div className="pkg-price">{formatPrice(pkg.price, pkg.period)}</div>
        {pkg.tagline && <p className="pkg-tagline">{pkg.tagline}</p>}
        {pkg.description && <p className="pkg-desc">{pkg.description}</p>}
        <a href={href} className={pkg.popular ? 'btn-primary pkg-cta' : 'btn-secondary pkg-cta'}>
          {pkg.slug === 'gratis' ? 'Daftar Gratis' : 'Beli Paket'} <ArrowRight size={15} />
        </a>
        <ul className="pkg-features">
          {includedFeatures.map((feature, i) => (
            <li key={i} className="inc"><Check size={16} className="ic" /><span>{feature.text}</span></li>
          ))}
        </ul>
        {features.length > includedFeatures.length && (
          <a href={href} className="pkg-detail">Lihat semua benefit <ArrowRight size={14} /></a>
        )}
      </div>
    </article>
  );
}
