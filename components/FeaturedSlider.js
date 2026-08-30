'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, MapPin, CalendarClock, Sparkles } from 'lucide-react';
import { JobCard } from './Cards';

// FeaturedSlider — horizontal carousel of featured jobs.
// Controls: prev/next arrows, dot indicators, autoplay (pauses on hover/focus),
// keyboard arrows, and native scroll-snap fallback for touch. BCA token styling.
export default function FeaturedSlider({ jobs = [] }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const [auto, setAuto] = useState(true);
  const reduceMotion = useRef(false);

  // Compute how many "pages" fit (based on visible cards per view).
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('.slide');
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16;
    const perView = Math.max(1, Math.round(track.clientWidth / (first.offsetWidth + gap)));
    const total = Math.max(1, Math.ceil(jobs.length / perView));
    setPages(total);
  }, [jobs.length]);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('.slide');
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16;
    const perView = Math.max(1, Math.round(track.clientWidth / (first.offsetWidth + gap)));
    const clamped = Math.max(0, Math.min(pages - 1, i));
    const target = first.offsetWidth * perView * clamped + gap * perView * clamped;
    track.scrollTo({ left: target, behavior: reduceMotion.current ? 'auto' : 'smooth' });
    setIndex(clamped);
  }, [pages]);

  // Keep dot index in sync when the user drags / swipes manually.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('.slide');
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16;
    const perView = Math.max(1, Math.round(track.clientWidth / (first.offsetWidth + gap)));
    const step = first.offsetWidth * perView + gap * perView;
    const idx = Math.round(track.scrollLeft / step);
    setIndex(Math.max(0, Math.min(pages - 1, idx)));
  }, [pages]);

  // Autoplay.
  useEffect(() => {
    if (!auto || pages <= 1) return;
    const t = setInterval(() => {
      setIndex((cur) => {
        const next = (cur + 1) % pages;
        goTo(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [auto, pages, goTo]);

  if (!jobs.length) return null;

  return (
    <div
      className="slider"
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => setAuto(true)}
      onFocusCapture={() => setAuto(false)}
      onBlurCapture={() => setAuto(true)}
      aria-roledescription="carousel"
      aria-label="Lowongan unggulan"
    >
      <div className="slider-head">
        <h2 className="slider-title">
          <Sparkles size={20} color="var(--hl-gold)" /> Lowongan Unggulan
        </h2>
        <div className="slider-nav">
          <button
            type="button"
            className="slider-arrow"
            aria-label="Sebelumnya"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="slider-arrow"
            aria-label="Berikutnya"
            onClick={() => goTo(index + 1)}
            disabled={index === pages - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="slider-track"
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label="Daftar lowongan unggulan"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') goTo(index - 1);
          if (e.key === 'ArrowRight') goTo(index + 1);
        }}
      >
        {jobs.map((job) => (
          <div className="slide" key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="slider-dots" role="tablist" aria-label="Halaman slider">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ke halaman ${i + 1}`}
              className={`slider-dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
