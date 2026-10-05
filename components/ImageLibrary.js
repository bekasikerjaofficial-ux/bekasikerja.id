'use client';
import React, { useEffect, useState } from 'react';
import { Images, Loader2, Check, RefreshCw } from 'lucide-react';

// ImageLibrary — pick an image already in the Supabase `images` bucket instead of
// re-uploading the same file. Re-uploads were producing byte-identical duplicates.
export default function ImageLibrary({ value, onSelect }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/images');
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      const { images: list } = await res.json();
      setImages(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Gagal memuat library gambar.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && images.length === 0) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          background: 'var(--gray-100)', border: '1px solid var(--gray-300)',
          borderRadius: 8, padding: '8px 12px', color: 'var(--gray-700)',
          justifyContent: 'center',
        }}
      >
        <Images size={14} /> {open ? 'Tutup Library Gambar' : 'Pilih dari Library Gambar'}
        {images.length > 0 && !open && <span style={{ color: 'var(--hl-blue)' }}>({images.length})</span>}
      </button>

      {open && (
        <div style={{ border: '1px solid var(--gray-200)', borderRadius: 12, padding: 12, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-600)' }}>
              {loading ? 'Memuat gambar...' : `${images.length} gambar tersedia`}
            </span>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              aria-label="Muat ulang library gambar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'inline-flex' }}
            >
              {loading ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
            </button>
          </div>

          {error && <p style={{ fontSize: 11, color: 'var(--hl-red)', fontWeight: 700 }}>{error}</p>}

          {!loading && !error && images.length === 0 && (
            <p style={{ fontSize: 11, color: 'var(--gray-500)' }}>Belum ada gambar di library. Upload dulu lewat field di atas.</p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
            {images.map((img) => {
              const selected = value === img.url;
              return (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => { onSelect(img.url); setOpen(false); }}
                  title={img.name}
                  aria-label={`Pilih gambar ${img.name}`}
                  aria-pressed={selected}
                  style={{
                    position: 'relative', padding: 0, cursor: 'pointer',
                    border: selected ? '2px solid var(--hl-blue)' : '1px solid var(--gray-200)',
                    borderRadius: 8, overflow: 'hidden', background: 'var(--gray-50)',
                    aspectRatio: '1 / 1',
                  }}
                >
                  <img src={img.url} alt={img.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {selected && (
                    <span style={{ position: 'absolute', top: 4, right: 4, background: 'var(--hl-blue)', color: '#fff', borderRadius: '999px', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}