'use client';
import React from 'react';
import { Search } from 'lucide-react';

// SearchCard — BCA-style inline filter card (lokasi/posisi)
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
      <Search size={18} color="var(--gray-500)" />
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
