'use client';
import React from 'react';
import { supabase } from '../lib/supabase';
import { Image, Loader2 } from 'lucide-react';

export default function ImageUpload({ label, value, onChange, accept = 'image/*', maxSize, folder = '' }) {
  const [preview, setPreview] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (maxSize && file.size > maxSize) {
      alert(`Ukuran gambar terlalu besar! Maksimal ${(maxSize / 1024 / 1024).toFixed(0)} MB.`);
      return;
    }
    // Local preview (instant)
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onloadend = () => { setPreview(reader.result); };
      reader.readAsDataURL(file);
    }
    // Upload to Supabase Storage
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file);
      onChange(publicUrl);
    } catch (error) {
      alert('Gagal upload file. Pastikan bucket "images" di Supabase sudah dibuat & di-set PUBLIC! Error: ' + error.message);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Show uploaded public URL preview if available, otherwise local preview
  const displaySrc = value && !value.startsWith('blob:') ? value : preview;

  return (
    <div className="field" style={{ margin: 0 }}>
      <label>{label}</label>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFile} style={{ fontSize: 13 }} />
      {uploading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: 'var(--gray-500)' }}>
          <Loader2 size={14} className="animate-spin" />
          <span>Mengunggah...</span>
        </div>
      )}
      {displaySrc && !uploading && (
        <div style={{ padding: 12, background: 'var(--gray-100)', border: '1px solid var(--gray-200)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span className="text-muted" style={{ fontSize: 11, fontWeight: 700 }}>Preview:</span>
          <img src={displaySrc} alt="Preview" style={{ height: 32, width: 'auto', objectFit: 'contain', borderRadius: 4 }} />
          <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', color: 'var(--hl-red)', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Hapus</button>
        </div>
      )}
    </div>
  );
}
