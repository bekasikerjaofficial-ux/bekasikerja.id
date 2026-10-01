import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/server-auth';
import { adminDb, adminDbMissingResponse } from '../../../../lib/service-db';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const db = adminDb(request);
  if (!db) return adminDbMissingResponse();
  const { data, error } = await db.from('companies').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ companies: data || [] });
}

export async function PATCH(request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!['verified', 'rejected'].includes(body.status)) {
    return NextResponse.json({ error: 'Status verifikasi invalid.' }, { status: 400 });
  }
  const db = adminDb(request);
  if (!db) return adminDbMissingResponse();

  const now = new Date().toISOString();
  const { data: company, error } = await db
    .from('companies')
    .update({ verification_status: body.status, updated_at: now })
    .eq('id', body.id)
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await db
    .from('company_verifications')
    .update({ status: body.status, reviewed_by: auth.user.id, review_note: body.note || null, reviewed_at: now })
    .eq('company_id', body.id)
    .eq('status', 'pending');

  await db.from('admin_actions').insert({
    admin_id: auth.user.id,
    action_type: `company_${body.status}`,
    entity_type: 'company',
    entity_id: body.id,
    metadata: { note: body.note || null },
  });

  const { data: members } = await db.from('company_members').select('user_id').eq('company_id', body.id).eq('is_active', true);
  if (members?.length) {
    await db.from('employer_notifications').insert(
      members.map((member) => ({
        user_id: member.user_id,
        company_id: body.id,
        type: 'verification',
        title: body.status === 'verified' ? 'Perusahaan terverifikasi' : 'Verifikasi perusahaan ditolak',
        message:
          body.status === 'verified'
            ? 'Profil perusahaan telah terverifikasi admin.'
            : 'Verifikasi perusahaan perlu diperbaiki.',
        link: '/employer/profile',
      })),
    );
  }
  return NextResponse.json({ company });
}