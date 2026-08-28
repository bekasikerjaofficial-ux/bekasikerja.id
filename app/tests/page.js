'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';

export default function TestsPage() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (active) setCount(count ?? 0); })
      .catch(() => { if (active) setCount(0); });
    return () => { active = false; };
  }, []);

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/tests" showSearch={false} />

      <main className="container section" style={{ maxWidth: 720 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h1 className="h-display" style={{ fontSize: 20 }}>Halaman Testing</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 8 }}>
            Total Lowongan Terdaftar: {count === null ? 'Memuat...' : count}
          </p>
          <a href="/" style={{ color: 'var(--hl-blue)', fontWeight: 700, fontSize: 13 }}>← Kembali ke Beranda</a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
