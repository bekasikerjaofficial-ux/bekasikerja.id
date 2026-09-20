'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CalendarClock, Newspaper } from 'lucide-react';

function formatPostedDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

// JobCard — card grid item, HeyLaw card style + BCA token
export function JobCard({ job }) {
  return (
    <Link href={`/loker/${job.id}`} className="card">
      <div className="body">
        <span className="badge-tag job">Lowongan</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Image
            src={job.image_url || '/placeholder.svg'}
            alt={job.company || 'PT'}
            width={40}
            height={40}
            loading="lazy"
            style={{ borderRadius: 12, objectFit: 'cover', border: '1px solid var(--gray-200)' }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{job.title}</h3>
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
        {formatPostedDate(job.created_at) && (
          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 8 }}>
            Diposting {formatPostedDate(job.created_at)}
          </div>
        )}
      </div>
    </Link>
  );
}

// NewsCard — sidebar / lifestyle card
function getNewsExcerpt(content = '') {
  const clean = String(content)
    .replace(/\\+n/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > 200 ? `${clean.slice(0, 200).trim()}...` : clean;
}

export function NewsCard({ item }) {
  return (
    <Link href={`/artikel/${item.id}`} className="card">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
        <Image
          src={item.image_url || '/placeholder.svg'}
          alt={`${item.title} cover`}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="thumb"
        />
      </div>
      <div className="body">
        <span className="badge-tag news">{item.category || 'Lifestyle'}</span>
        <h3 style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{item.title}</h3>
        {formatPostedDate(item.created_at) && (
          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>
            Diposting {formatPostedDate(item.created_at)}
          </div>
        )}
        <p style={{ fontSize: 13, color: 'var(--gray-600)', margin: '8px 0 0', lineHeight: 1.6 }}>
          {getNewsExcerpt(item.content)}
        </p>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--hl-blue)', fontWeight: 600 }}>
            Baca Selengkapnya →
          </span>
        </div>
      </div>
    </Link>
  );
}

// SidebarItem — compact article row (HeyLaw sidebar)
export function SidebarItem({ item }) {
  return (
    <a href={`/artikel/${item.id}`} className="item">
      <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
        <Image
          src={item.image_url || '/placeholder.svg'}
          alt={item.title}
          fill
          loading="lazy"
          sizes="60px"
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
      </div>
      <span className="t">{item.title}</span>
    </a>
  );
}
