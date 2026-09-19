import { NextResponse } from 'next/server';
import { requireUser, badRequest } from '../../../../lib/employer-auth';

export async function POST(request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.name?.trim()) return badRequest('Nama perusahaan wajib diisi.');

  const { data: existing } = await auth.db.from('company_members').select('company_id').eq('user_id', auth.user.id).eq('is_active', true).maybeSingle();
  if (existing) return NextResponse.json({ companyId: existing.company_id, existing: true });

  const { data, error } = await auth.db.rpc('create_employer_account', {
    p_name: body.name.trim(),
    p_legal_name: body.legalName || null,
    p_industry: body.industry || null,
    p_city: body.city || null,
    p_hr_email: body.hrEmail || auth.user.email,
    p_hr_whatsapp: body.hrWhatsapp || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ companyId: data });
}
