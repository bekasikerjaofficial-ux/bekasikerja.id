'use client';
import React from 'react';
import { Image } from 'lucide-react';

export default function ImageUpload({ label, value, onChange, accept = 'image/*', maxSize }) {
  const [preview, setPreview] = React.useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (maxSize && file.size > maxSize) {
      alert(`Ukuran gambar terlalu besar! Maksimal ${(maxSize / 1024 / 1024).toFixed(0)} MB.`);
      return;
    }
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onloadend = () => { setPreview(reader.result); };
      reader.readAsDataURL(file);
    }
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);
  };

  const handleClear = () => {
    setPreview(null);
    onChange('');
  };

  return (
    <div className="field" style={{ margin: 0 }}>
      <label>{label}</label>
      <input type="file" accept={accept} onChange={handleFile} style={{ fontSize: 13 }} />
      {preview && (
        <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span className="text-muted" style={{ fontSize: 11, fontWeight: 700 }}>Preview:</span>
          <img src={preview} alt="Preview" style={{ height: 32, width: 'auto', objectFit: 'contain', borderRadius: 4 }} />
          <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', color: 'var(--hl-red)', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Hapus</button>
        </div>
      )}
    </div>
  );
}
