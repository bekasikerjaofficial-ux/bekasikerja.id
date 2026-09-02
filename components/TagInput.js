'use client';
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const t = input.trim().toLowerCase();
    if (!t || tags.includes(t)) { setInput(''); return; }
    onChange([...tags, t]);
    setInput('');
  };

  const removeTag = (t) => {
    onChange(tags.filter((x) => x !== t));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  };

  return (
    <div className="field" style={{ margin: 0 }}>
      <label>Tags</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 'var(--sp-3) var(--sp-4)', border: '1px solid var(--gray-300)', borderRadius: 'var(--r-md)', background: '#fff', minHeight: 42 }}>
        {tags.map((t) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--hl-blue)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>
            {t}
            <button type="button" onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0, lineHeight: 1 }}><X size={12} /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? 'Ketik lalu Enter...' : ''}
          style={{ border: 'none', outline: 'none', flex: 1, minWidth: 60, fontSize: 13, padding: '2px 4px' }}
        />
      </div>
      <span className="text-muted" style={{ fontSize: 11 }}>Tekan Enter atau klik + untuk tambah tag</span>
    </div>
  );
}
