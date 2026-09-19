import { NextResponse } from 'next/server';
import { requireEmployer } from '../../../../lib/employer-auth';

export async function GET(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data: jobs } = await auth.db.from('employer_jobs').select('id,title,status,application_deadline,created_at').eq('company_id', auth.company.id).order('created_at', { ascending: false });
  const ids = (jobs || []).map((job) => job.id);
  let applications = [];
  if (ids.length) {
    const { data } = await auth.db.from('job_applications').select('id,status,applied_at,job_id').in('job_id', ids).order('applied_at', { ascending: false });
    applications = data || [];
  }
  return NextResponse.json({
    company: auth.company,
    stats: {
      activeJobs: (jobs || []).filter((job) => job.status === 'active').length,
      totalJobs: (jobs || []).length,
      totalApplicants: applications.length,
      shortlisted: applications.filter((item) => item.status === 'shortlisted').length,
      interviews: applications.filter((item) => item.status === 'interview').length,
    },
    expiringJobs: (jobs || []).filter((job) => job.application_deadline).slice(0, 5),
    recentApplications: applications.slice(0, 8),
  });
}
