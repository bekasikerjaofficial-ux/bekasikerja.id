'use client';
import React from 'react';
import { Check, X, Star } from 'lucide-react';

function formatPrice(price, period) {
  if (!price || price === 0) return 'Gratis';
  const rp = new Intl.NumberFormat('id-ID').format(price);
  const suffix = period === 'bulan' ? '/bln' : period && period !== 'selamanya' ? '/' + period : '';
  return `Rp ${rp}${suffix}`;
}

export default function PackageCard({ pkg, ctaHref }) {
  const href = ctaHref || (pkg.slug === 'gratis' ? '/member/register' : '/checkout?paket=' + pkg.slug);
  const features = Array.isArray(pkg.features) ? pkg.features : [];

  return (
    <div className={`pkg-card${pkg.popular ? ' popular' : ''}`}>
      {pkg.popular && (
        <span className="pkg-badge"><Star size={13} /> Terlaris</span>
      )}
      <h3 className="pkg-name">{pkg.name}</h3>
      <div className="pkg-price">{formatPrice(pkg.price, pkg.period)}</div>
      {pkg.tagline && <p className="pkg-tagline">{pkg.tagline}</p>}
      {pkg.description && <p className="pkg-desc">{pkg.description}</p>}
      <ul className="pkg-features">
        {features.map((f, i) => (
          <li key={i} className={f.included ? 'inc' : 'exc'}>
            {f.included
              ? <Check size={16} className="ic" />
              : <X size={16} className="ic" />}
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <a href={href} className={pkg.popular ? 'btn-primary pkg-cta' : 'btn-secondary pkg-cta'}>
        {pkg.slug === 'gratis' ? 'Daftar Gratis' : 'Pilih Paket'}
      </a>
    </div>
  );
}
