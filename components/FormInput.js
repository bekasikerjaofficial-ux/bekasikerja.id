'use client';
import React from 'react';

export default function FormInput({ label, name, value, onChange, type = 'text', placeholder, required, disabled }) {
  return (
    <div className="field" style={{ margin: 0 }}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
