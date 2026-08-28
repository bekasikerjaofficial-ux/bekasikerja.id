'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, CalendarClock, Newspaper } from 'lucide-react';

// JobCard — card grid item, HeyLaw card style + BCA token
export function JobCard({ job }) {
  return (
    <Link href={`/loker/${job.id}`} className="card">
      <div className="body">
        <span className="badge-tag job">Lowongan</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <img
            src={job.image_url || '/placeholder.svg'}
            alt={job.company || 'PT'}
            style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--gray-200)' }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{job.title}</h3>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>{job.company}</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--gray-600)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.content}
        </p>
        <div className="meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> {job.location || 'Kawasan Industri'}
          </span>
          <span className="deadline" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CalendarClock size={12} /> {job.deadline || 'Secepatnya'}
          </span>
        </div>
      </div>
    </Link>
  );
}

// NewsCard — sidebar / lifestyle card
export function NewsCard({ item }) {
  return (
    <Link href={`/loker/${item.id}`} className="card">
      <img src={item.image_url || '/placeholder.svg'} alt="cover" className="thumb" />
      <div className="body">
        <span className="badge-tag news">{item.category || 'Lifestyle'}</span>
        <h3>{item.title}</h3>
        <p style={{ fontSize: 12, color: 'var(--gray-500)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.content}
        </p>
      </div>
    </Link>
  );
}

// SidebarItem — compact article row (HeyLaw sidebar)
export function SidebarItem({ item }) {
  return (
    <a href={`/loker/${item.id}`} className="item">
      <img src={item.image_url || '/placeholder.svg'} alt="thumb" />
      <span className="t">{item.title}</span>
    </a>
  );
}
