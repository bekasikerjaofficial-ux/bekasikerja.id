'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { PSIKOTES_MODULES, TIER_ORDER, tierIndex } from '../../lib/packages';
import { Lock, CheckCircle2, LogIn } from 'lucide-react';

// Katalog tes psikotes, digate per tier member. Engine soal (Kraepelin/TIU/dll)
// menyusul — di sini baru catalog + gating UI.
export default function PsikotesPage() {
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState('gratis');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { if (active) setLoading(false); return; }
      if (active) setUser(data.user);

      const { data: mem } = await supabase
        .from('memberships')
        .select('packages(slug)')
        .eq('user_id', data.user.id)
        .eq('status', 'active');
      if (active && mem && mem.length) {
        let best = 0;
        mem.forEach((m) => {
          const s = m.packages && m.packages.slug;
          if (s) best = Math.max(best, tierIndex(s));
        });
        setTier(TIER_ORDER[best] || 'gratis');
      }
      if (active) setLoading(false);
    };
    load().catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/psikotes" showSearch={false} />

      <main className="container section" style={{ maxWidth: 980 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h1 className="h-display" style={{ fontSize: 22 }}>Tes Psikotes &amp; Masuk Kerja</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 8 }}>
            {user
              ? `Hai ${user.email}! Paket aktif kamu: ${tier.toUpperCase()}.`
              : 'Login sebagai member untuk membuka tes sesuai paketmu.'}
          </p>

          {!user && !loading && (
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/member/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LogIn size={16} /> Login Member
              </a>
              <a href="/member/register" className="btn-secondary">Daftar Gratis</a>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginTop: 24 }}>
            {PSIKOTES_MODULES.map((m) => {
              const unlocked = tierIndex(tier) >= tierIndex(m.minTier);
              return (
                <div key={m.slug} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 className="h-card" style={{ margin: 0 }}>{m.title}</h3>
                    {unlocked
                      ? <CheckCircle2 size={18} color="var(--hl-teal)" />
                      : <Lock size={18} color="var(--gray-500)" />}
                  </div>
                  <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>{m.desc}</p>
                  <div style={{ marginTop: 14 }}>
                    {unlocked ? (
                      <button className="btn-secondary" style={{ width: '100%', fontSize: 13, padding: '10px' }} disabled>
                        Segera Tersedia
                      </button>
                    ) : (
                      <a href={`/checkout?paket=${m.minTier}`} className="btn-primary" style={{ width: '100%', fontSize: 13, padding: '10px', textAlign: 'center', display: 'block' }}>
                        Butuh Paket {m.minTier.toUpperCase()}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
