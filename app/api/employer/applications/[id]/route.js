import { NextResponse } from 'next/server';
import { requireEmployer, badRequest } from '../../../../../lib/employer-auth';

const STATUSES = ['new','screening','shortlisted','interview','passed','rejected'];

export async function PATCH(request, { params }) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data: application } = await auth.db.from('job_applications').select('*, employer_jobs!inner(company_id)').eq('id', params.id).eq('employer_jobs.company_id', auth.company.id).single();
  if (!application) return NextResponse.json({ error: 'Pelamar tidak ditemukan.' }, { status: 404 });
  const body = await request.json();
  if (!STATUSES.includes(body.status)) return badRequest('Status pelamar tidak valid.');
  const oldStatus = application.status;
  const { data, error } = await auth.db.from('job_applications').update({ status: body.status, updated_at: new Date().toISOString() }).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await auth.db.from('application_status_history').insert({ application_id: application.id, old_status: oldStatus, new_status: body.status, changed_by: auth.user.id });
  if (body.note?.trim()) await auth.db.from('application_notes').insert({ application_id: application.id, author_id: auth.user.id, note: body.note.trim() });
  return NextResponse.json({ application: data });
}
