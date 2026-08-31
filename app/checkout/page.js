'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { DEFAULT_PACKAGES } from '../../lib/packages';
import { QrCode, CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const [user, setUser] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    let active = true;
    const slug = new URLSearchParams(window.location.search).get('paket');
    const found = DEFAULT_PACKAGES.find((p) => p.slug === slug) || null;
    if (active) setPkg(found);

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { window.location.href = '/member/login?next=/checkout?paket=' + slug; return; }
      if (active) setUser(data.user);
      if (active) setLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  // Poll status (fallback bila webhook belum ke-fire / user tutup)
  useEffect(() => {
    if (!orderId || !polling) return;
    const iv = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const res = await fetch('/api/checkout/status?order=' + encodeURIComponent(orderId));
      if (res.ok) {
        const j = await res.json();
        if (j.paid) {
          clearInterval(iv);
          setPolling(false);
          setQr((q) => ({ ...q, paid: true }));
        }
      }
    }, 4000);
    return () => clearInterval(iv);
  }, [orderId, polling]);

  const handlePay = async () => {
    setError('');
    if (!pkg || !pkg.price) { setError('Paket gratis tidak butuh pembayaran.'); return; }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageSlug: pkg.slug }),
      });
      const j = await res.json();
      if (!res.ok) { setError(j.error || 'Gagal membuat QRIS'); return; }
      setQr({ qrString: j.qrString, orderId: j.orderId });
      setOrderId(j.orderId);
      setPolling(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/paket" showSearch={false} />
      <main className="container section" style={{ maxWidth: 640 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h1 className="h-display" style={{ fontSize: 22 }}>Pembayaran Paket</h1>
          {loading && <p className="text-muted" style={{ fontSize: 13 }}>Memuat...</p>}

          {!loading && !pkg && (
            <p className="text-muted" style={{ fontSize: 13 }}>Pilih paket dulu di <a href="/paket" style={{ color: 'var(--hl-blue)', fontWeight: 700 }}>halaman Paket</a>.</p>
          )}

          {!loading && pkg && (
            <>
              <div style={{ marginTop: 16, padding: 16, background: 'var(--gray-100)', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: 'var(--gray-900)', fontSize: 16 }}>Paket {pkg.name}</strong>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Rp {new Intl.NumberFormat('id-ID').format(pkg.price)} / {pkg.period}
                </div>
              </div>

              {!qr && (
                <button className="btn-primary" style={{ width: '100%', marginTop: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handlePay}>
                  <QrCode size={18} /> Bayar dengan QRIS
                </button>
              )}

              {error && <p style={{ color: 'var(--hl-red)', fontSize: 13, fontWeight: 700, marginTop: 12 }}>{error}</p>}

              {qr && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                  {qr.paid ? (
                    <div style={{ color: 'var(--hl-teal)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={20} /> Pembayaran berhasil! Paket kamu aktif.
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>Scan QRIS ini dengan e-wallet / m-banking:</p>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qr.qrString)}`}
                        alt="QRIS pembayaran"
                        style={{ width: 240, height: 240, margin: '12px auto', borderRadius: 12, border: '1px solid var(--gray-200)' }}
                      />
                      <p className="text-muted" style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <Loader2 size={14} className="spin" /> Menunggu pembayaran... (otomatis aktif setelah transfer)
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
