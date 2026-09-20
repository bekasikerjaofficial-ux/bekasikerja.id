import { NextResponse } from 'next/server';
import { requireEmployer } from '../../../../lib/employer-auth';

export async function GET(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data, error } = await auth.db.from('company_verifications').select('*').eq('company_id', auth.company.id).order('submitted_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ verifications: data || [], status: auth.company.verification_status });
}

export async function POST(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const { data, error } = await auth.db.from('company_verifications').insert({ company_id: auth.company.id, submitted_by: auth.user.id, status: 'pending' }).select('*').single();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Verifikasi sudah diajukan.' : error.message }, { status: 400 });
  await auth.db.from('companies').update({ verification_status: 'pending', updated_at: new Date().toISOString() }).eq('id', auth.company.id);
  return NextResponse.json({ verification: data }, { status: 201 });
}
