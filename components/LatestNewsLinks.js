'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Newspaper } from 'lucide-react';
import { postPath } from '../lib/post-url';

export default function LatestNewsLinks({ excludeId = null }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      let query = supabase.from('posts').select('id,title,created_at').eq('type', 'news').order('created_at', { ascending: false }).limit(4);
      if (excludeId) query = query.neq('id', excludeId);
      const { data, error } = await query;
      if (active && !error) setItems((data || []).slice(0, 3));
    };
    load();
    return () => { active = false; };
  }, [excludeId]);

  if (!items.length) return null;

  return (
    <section className="panel" aria-labelledby="latest-news-title" style={{ margin: '24px auto 0', padding: 20, maxWidth: 900 }}>
      <h2 id="latest-news-title" className="related-title" style={{ marginBottom: 14 }}>
        <Newspaper size={20} color="var(--hl-blue)" /> Berita Terbaru
      </h2>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <Link key={item.id} href={postPath('news', item)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--gray-200)', color: 'var(--gray-900)', textDecoration: 'none' }}>
            <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.45 }}>{item.title}</span>
            <span style={{ flexShrink: 0, color: 'var(--hl-blue)', fontWeight: 700, fontSize: 12 }}>Baca →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
