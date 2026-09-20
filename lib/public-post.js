import { normalizeSupabaseUrl } from './supabase-url';
import { postIdFromParam, slugifyTitle } from './post-url';

export async function getPublicPost(param, type) {
  const base = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return null;
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const value = postIdFromParam(param);
  const endpoint = `${base}/rest/v1/posts`;
  try {
    if (/^\d+$/.test(String(value))) {
      const response = await fetch(`${endpoint}?select=*&id=eq.${encodeURIComponent(value)}&type=eq.${encodeURIComponent(type)}`, { headers, next: { revalidate: 300 } });
      const rows = await response.json();
      return rows?.[0] || null;
    }
    const response = await fetch(`${endpoint}?select=*&type=eq.${encodeURIComponent(type)}&limit=1000`, { headers, next: { revalidate: 300 } });
    const rows = await response.json();
    return (rows || []).find((post) => slugifyTitle(post.title) === String(value)) || null;
  } catch {
    return null;
  }
}
