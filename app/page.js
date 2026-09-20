import { supabase } from '../lib/supabase';
import HomePageClient from './HomePageClient';
import { mergeJobs } from '../lib/static-jobs';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ data: settings }, { data: allPosts }, { data: employerJobs }] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase.from('published_employer_jobs').select('*').order('created_at', { ascending: false }),
  ]);
  const posts = allPosts || [];
  const jobs = mergeJobs([...((employerJobs || [])), ...posts.filter((post) => post.type === 'job').slice(0, 6)]);
  const news = posts.filter((post) => post.type === 'news').sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 6);
  return <HomePageClient initialSettings={settings || null} initialJobs={jobs} initialNews={news} />;
}
