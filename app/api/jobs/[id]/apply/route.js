import { NextResponse } from 'next/server';
import { requireUser, badRequest } from '../../../../../lib/employer-auth';

export async function POST(request, { params }) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;
  const { data: job } = await auth.db.from('employer_jobs').select('id,status').eq('id', params.id).eq('status', 'active').maybeSingle();
  if (!job) return NextResponse.json({ error: 'Lowongan tidak ditemukan atau belum aktif.' }, { status: 404 });
  const body = await request.json();
  const { data: memberProfile } = await auth.db.from('member_profiles').select('full_name,phone,address,bio').eq('user_id', auth.user.id).maybeSingle();
  if (memberProfile) {
    await auth.db.from('candidate_profiles').upsert({
      user_id: auth.user.id,
      full_name: memberProfile.full_name,
      phone: memberProfile.phone,
      city: memberProfile.address,
      updated_at: new Date().toISOString(),
    });
  }
  const { error } = await auth.db.from('job_applications').insert({ job_id: job.id, candidate_id: auth.user.id, cover_letter: body.coverLetter || null });
  if (error?.code === '23505') return NextResponse.json({ error: 'Kamu sudah melamar lowongan ini.' }, { status: 409 });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true }, { status: 201 });
}
