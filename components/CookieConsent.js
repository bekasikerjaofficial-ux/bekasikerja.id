'use client';
import React, { useState, useEffect } from 'react';

// Cookie consent floating card — HeyLaw motif with localStorage persistence
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show if user hasn't previously accepted
    const accepted = localStorage.getItem('bk_cookie_consent');
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bk_cookie_consent', 'accepted');
    localStorage.setItem('bk_cookie_date', new Date().toISOString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="cookie" role="dialog" aria-label="Persetujuan cookie">
      <span>
        Kami menggunakan cookie untuk meningkatkan pengalaman Anda di{' '}
        <strong>BekasiKerja.id</strong>.
      </span>
      <button onClick={handleAccept} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
        Mengerti
      </button>
    </div>
  );
}
