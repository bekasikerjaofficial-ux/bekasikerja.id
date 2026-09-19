import { NextResponse } from 'next/server';
import { requireEmployer, badRequest } from '../../../../../lib/employer-auth';

export async function PATCH(request, { params }) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  const update = {};
  if (body.action === 'submit_review') update.status = 'pending_review';
  else if (body.action === 'archive') update.status = 'archived';
  else if (body.action === 'extend') update.application_deadline = body.applicationDeadline || null;
  else {
    const allowed = ['title','department','location','employment_type','work_system','education_minimum','major','experience_minimum','skills','salary_min','salary_max','benefits','description','responsibilities','requirements','application_deadline','vacancies','application_method'];
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key];
  }
  if (!Object.keys(update).length) return badRequest('Tidak ada perubahan.');
  update.updated_at = new Date().toISOString();
  const { data, error } = await auth.db.from('employer_jobs').update(update).eq('id', params.id).eq('company_id', auth.company.id).select('*').single();
  if (error || !data) return NextResponse.json({ error: error?.message || 'Lowongan tidak ditemukan.' }, { status: error ? 400 : 404 });
  return NextResponse.json({ job: data });
}
