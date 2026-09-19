import { NextResponse } from 'next/server';
import { requireEmployer, badRequest } from '../../../../lib/employer-auth';

function normalize(body, userId, companyId) {
  return {
    company_id: companyId,
    created_by: userId,
    title: body.title?.trim(),
    department: body.department || null,
    location: body.location || null,
    employment_type: body.employmentType || 'Full Time',
    work_system: body.workSystem || 'On-site',
    education_minimum: body.educationMinimum || null,
    major: body.major || null,
    experience_minimum: body.experienceMinimum || null,
    skills: Array.isArray(body.skills) ? body.skills : [],
    salary_min: body.salaryMin ? Number(body.salaryMin) : null,
    salary_max: body.salaryMax ? Number(body.salaryMax) : null,
    benefits: Array.isArray(body.benefits) ? body.benefits : [],
    description: body.description || null,
    responsibilities: body.responsibilities || null,
    requirements: body.requirements || null,
    application_deadline: body.applicationDeadline || null,
    vacancies: Math.max(1, Number(body.vacancies || 1)),
    application_method: body.applicationMethod || null,
    status: body.status === 'pending_review' ? 'pending_review' : 'draft',
  };
}

export async function GET(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data, error } = await auth.db.from('employer_jobs').select('*, job_applications(count)').eq('company_id', auth.company.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ jobs: data || [] });
}

export async function POST(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.title?.trim()) return badRequest('Judul pekerjaan wajib diisi.');
  const { data, error } = await auth.db.from('employer_jobs').insert(normalize(body, auth.user.id, auth.company.id)).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ job: data }, { status: 201 });
}
