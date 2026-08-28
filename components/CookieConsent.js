'use client';
import React, { useState } from 'react';

// Cookie consent floating card — HeyLaw motif
export default function CookieConsent() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Persetujuan cookie">
      <span>
        Kami menggunakan cookie untuk meningkatkan pengalaman Anda di {''}
        <strong>BekasiKerja.id</strong>.
      </span>
      <button onClick={() => setOpen(false)}>Terima Semua</button>
    </div>
  );
}
