import HomePageClient from './HomePageClient';
import { mergeJobs } from '../lib/static-jobs';
import { normalizeSupabaseUrl } from '../lib/supabase-url';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function queryPublic(path) {
  const base = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return null;
  try {
    const response = await fetch(`${base}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [settings, allPosts, employerJobs] = await Promise.all([
    queryPublic('site_settings?select=*&id=eq.1'),
    queryPublic('posts?select=*&order=created_at.desc'),
    queryPublic('published_employer_jobs?select=*&order=created_at.desc'),
  ]);
  const posts = Array.isArray(allPosts) ? allPosts : [];
  const jobs = mergeJobs([
    ...(Array.isArray(employerJobs) ? employerJobs : []),
    ...posts.filter((post) => post.type === 'job').slice(0, 6),
  ]);
  const news = posts.filter((post) => post.type === 'news').slice(0, 6);
  return <HomePageClient initialSettings={settings?.[0] || null} initialJobs={jobs} initialNews={news} />;
}
