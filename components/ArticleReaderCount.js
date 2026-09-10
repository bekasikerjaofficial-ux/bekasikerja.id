'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ArticleReaderCount({ slug }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const key = `bekasikerja_read_${slug}`;
    const alreadyRead = typeof window !== 'undefined' && window.sessionStorage.getItem(key);
    const load = async () => {
      if (!alreadyRead) {
        const { error } = await supabase.rpc('record_article_read', { p_slug: slug });
        if (!error && typeof window !== 'undefined') window.sessionStorage.setItem(key, '1');
      }
      const { data, error } = await supabase.rpc('get_article_read_count', { p_slug: slug });
      if (!error) setCount(Number(data || 0));
    };
    load();
  }, [slug]);

  return (
    <span aria-label="Jumlah pembaca" style={{ fontSize: 12, color: 'var(--gray-600)' }}>
      {count === null ? 'Memuat pembaca...' : `${count.toLocaleString('id-ID')} pembaca`}
    </span>
  );
}
