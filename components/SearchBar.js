'use client';
import React from 'react';
import { Search } from 'lucide-react';

// SearchCard — clean, generic search element (works desktop & mobile)
export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form
      className="search-card"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(value);
      }}
      role="search"
    >
      <Search size={18} strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Cari lowongan, perusahaan, atau artikel...'}
        aria-label="Pencarian lowongan"
      />
      <button type="submit" className="btn-primary">Cari</button>
    </form>
  );
}
