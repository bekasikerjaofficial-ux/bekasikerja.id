import { supabase } from '../../lib/supabase';
import LowonganClient from './LowonganClient';
import { mergeJobs } from '../../lib/static-jobs';

export const dynamic = 'force-dynamic';

export default async function LowonganPage() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('type', 'job')
    .order('created_at', { ascending: false });

  return <LowonganClient initialJobs={mergeJobs(data || [])} />;
}