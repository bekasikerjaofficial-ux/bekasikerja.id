import { NextResponse } from 'next/server';
import { requireEmployer } from '../../../../lib/employer-auth';

export async function GET(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data: jobs } = await auth.db.from('employer_jobs').select('id').eq('company_id', auth.company.id);
  const ids = (jobs || []).map((job) => job.id);
  if (!ids.length) return NextResponse.json({ applications: [] });
  const { data, error } = await auth.db.from('job_applications').select('id,status,cover_letter,applied_at,updated_at,job_id,candidate_profiles(*)').in('job_id', ids).order('applied_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ applications: data || [] });
}
