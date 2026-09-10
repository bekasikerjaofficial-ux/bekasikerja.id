'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  const key = 'bekasikerja_visitor_id';
  let value = window.localStorage.getItem(key);
  if (!value) {
    value = `${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`;
    window.localStorage.setItem(key, value);
  }
  return value;
}

export default function AnalyticsTracker() {
  useEffect(() => {
    const path = `${window.location.pathname}${window.location.search}`;
    const sessionId = getSessionId();
    if (!sessionId) return;
    supabase.rpc('record_page_visit', { p_path: path, p_session_id: sessionId })
      .then(({ error }) => { if (error) console.warn('[analytics]', error.message); });
  }, []);

  return null;
}
