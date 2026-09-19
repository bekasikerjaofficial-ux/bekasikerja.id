import { NextResponse } from 'next/server';
import { requireEmployer, badRequest } from '../../../../lib/employer-auth';

export async function GET(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  return NextResponse.json({ company: auth.company });
}

export async function PATCH(request) {
  const auth = await requireEmployer(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.name?.trim()) return badRequest('Nama perusahaan wajib diisi.');
  const allowed = ['name','legal_name','logo_url','industry','founded_year','employee_count','address','city','website','hr_email','hr_whatsapp','description','benefits','social_links'];
  const payload = Object.fromEntries(allowed.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
  payload.updated_at = new Date().toISOString();
  const { data, error } = await auth.db.from('companies').update(payload).eq('id', auth.company.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ company: data });
}
