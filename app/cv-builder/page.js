'use client';
import React from 'react';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export default function CvBuilderPage() {
  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/cv-builder" showSearch={false} />

      <main className="container section" style={{ maxWidth: 760, textAlign: 'center' }}>
        <h1 className="h-display" style={{ fontSize: 30 }}>CV Builder (ATS Friendly)</h1>
        <p className="text-muted" style={{ fontSize: 14, margin: '8px 0 32px' }}>
          Fitur pembuatan CV otomatis sedang diperbarui.
        </p>
        <div className="panel" style={{ padding: 40, maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>
            Segera hadir untuk membantu kamu membuat CV standar pabrik dan korporat!
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
