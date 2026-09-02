'use client';
import React from 'react';

export default function FormSelect({ label, name, value, onChange, options, placeholder }) {
  return (
    <div className="field" style={{ margin: 0 }}>
      <label>{label}</label>
      <select name={name} value={value || ''} onChange={onChange}>
        <option value="">{placeholder || 'Pilih...'}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
