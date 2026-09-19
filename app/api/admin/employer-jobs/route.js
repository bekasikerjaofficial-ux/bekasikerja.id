import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../../../../lib/server-auth';
import { normalizeSupabaseUrl } from '../../../../lib/supabase-url';

function db() {
  return createClient(normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL), process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const serviceDb = db();
  const { data, error } = await serviceDb.from('employer_jobs').select('*, companies(id,name,verification_status)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ jobs: data || [] });
}

export async function PATCH(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!['active','rejected','archived'].includes(body.status)) return NextResponse.json({ error: 'Status moderation tidak valid.' }, { status: 400 });
  const update = { status: body.status, moderation_note: body.note || null, updated_at: new Date().toISOString() };
  if (body.status === 'active') update.published_at = new Date().toISOString();
  const serviceDb = db();
  const { data, error } = await serviceDb.from('employer_jobs').update(update).eq('id', body.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data: members } = await serviceDb.from('company_members').select('user_id').eq('company_id', data.company_id).eq('is_active', true);
  if (members?.length) await serviceDb.from('employer_notifications').insert(members.map((member) => ({ user_id: member.user_id, company_id: data.company_id, type: 'job_moderation', title: body.status === 'active' ? 'Lowongan disetujui' : 'Status lowongan diperbarui', message: body.status === 'active' ? `Lowongan "${data.title}" telah disetujui admin.` : `Lowongan "${data.title}" berstatus ${body.status}.`, link: '/employer/jobs' })));
  return NextResponse.json({ job: data });
}
