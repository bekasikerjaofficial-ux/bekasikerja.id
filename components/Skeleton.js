'use client';
import React from 'react';

// Base shimmer block — reusable rectangle with pulse animation
function ShimmerBlock({ style, className }) {
  return (
    <div
      className={`skeleton-shimmer${className ? ' ' + className : ''}`}
      style={{
        background: 'var(--gray-200)',
        borderRadius: 'var(--r-md)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      aria-hidden="true"
    >
      <div className="skeleton-shimmer-effect" />
    </div>
  );
}

// SkeletonCard — placeholder for JobCard/NewsCard
export function SkeletonCard({ variant = 'job' }) {
  return (
    <div className="card skeleton-card" style={{ pointerEvents: 'none' }}>
      {variant === 'news' && (
        <ShimmerBlock style={{ width: '100%', aspectRatio: '16/9' }} />
      )}
      <div className="body">
        <ShimmerBlock style={{ width: 70, height: 20, marginBottom: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <ShimmerBlock style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <ShimmerBlock style={{ width: '80%', height: 16, marginBottom: 6 }} />
            <ShimmerBlock style={{ width: '50%', height: 12 }} />
          </div>
        </div>
        <ShimmerBlock style={{ width: '100%', height: 12, marginBottom: 4 }} />
        <ShimmerBlock style={{ width: '75%', height: 12, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
          <ShimmerBlock style={{ width: 80, height: 11 }} />
          <ShimmerBlock style={{ width: 60, height: 11 }} />
        </div>
      </div>
    </div>
  );
}

// SkeletonTable — placeholder for admin/data tables
export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-table" style={{
      background: '#fff',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 12,
        padding: '12px 16px',
        background: 'var(--gray-100)',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <ShimmerBlock key={i} style={{ width: '60%', height: 14 }} />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 12,
            padding: '12px 16px',
            borderBottom: rowIdx < rows - 1 ? '1px solid var(--gray-100)' : 'none',
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <ShimmerBlock key={colIdx} style={{ width: colIdx === 0 ? '90%' : '70%', height: 13 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// SkeletonForm — placeholder for form inputs
export function SkeletonForm({ fields = 4 }) {
  return (
    <div className="skeleton-form" style={{
      background: '#fff',
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--r-lg)',
      padding: 24,
      boxShadow: 'var(--shadow-card)',
    }}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="field" style={{ margin: 0, marginBottom: i < fields - 1 ? 16 : 0 }}>
          <ShimmerBlock style={{ width: 80, height: 12, marginBottom: 6 }} />
          <ShimmerBlock style={{ width: '100%', height: 40, borderRadius: 'var(--r-md)' }} />
        </div>
      ))}
      <div style={{ marginTop: 20 }}>
        <ShimmerBlock style={{ width: 120, height: 40, borderRadius: 'var(--r-md)' }} />
      </div>
    </div>
  );
}

// Shimmer effect keyframes + styles (injected once)
export function SkeletonStyles() {
  return (
    <style jsx global>{`
      @keyframes skeleton-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .skeleton-shimmer-effect::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.6) 50%,
          transparent 100%
        );
        animation: skeleton-shimmer 1.5s infinite;
      }
      .skeleton-card { pointer-events: none; }
    `}</style>
  );
}

export default { SkeletonCard, SkeletonTable, SkeletonForm, SkeletonStyles };
