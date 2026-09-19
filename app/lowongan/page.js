import { supabase } from '../../lib/supabase';
import LowonganClient from './LowonganClient';
import { mergeJobs } from '../../lib/static-jobs';

export const dynamic = 'force-dynamic';

export default async function LowonganPage() {
  const [{ data }, { data: employerJobs }] = await Promise.all([supabase
    .from('posts')
    .select('*')
    .eq('type', 'job')
    .order('created_at', { ascending: false }), supabase
    .from('published_employer_jobs')
    .select('*')
    .order('created_at', { ascending: false })]);

  return <LowonganClient initialJobs={mergeJobs([...(employerJobs || []), ...(data || [])])} />;
}