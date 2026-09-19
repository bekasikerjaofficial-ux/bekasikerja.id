import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from './supabase-url';

function config() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export async function requireUser(request) {
  const { url, anonKey, serviceKey } = config();
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\\s+(.+)$/i)?.[1];
  if (!url || !anonKey || !serviceKey || !token) {
    return { error: Response.json({ error: 'Login diperlukan.' }, { status: 401 }) };
  }
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return { error: Response.json({ error: 'Sesi login tidak valid.' }, { status: 401 }) };
  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { user: data.user, db };
}

export async function requireEmployer(request) {
  const { url, anonKey, serviceKey } = config();
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!url || !anonKey || !serviceKey || !token) {
    return { error: Response.json({ error: 'Login employer diperlukan.' }, { status: 401 }) };
  }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    return { error: Response.json({ error: 'Sesi login tidak valid.' }, { status: 401 }) };
  }

  const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: role } = await db.from('user_roles').select('role').eq('user_id', userData.user.id).eq('role', 'employer').maybeSingle();
  if (!role) return { error: Response.json({ error: 'Akun ini bukan employer.' }, { status: 403 }) };

  const { data: membership, error: membershipError } = await db
    .from('company_members')
    .select('company_id, member_role, companies(*)')
    .eq('user_id', userData.user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (membershipError || !membership) {
    return { error: Response.json({ error: 'Profil perusahaan belum dibuat.' }, { status: 409 }) };
  }

  return { user: userData.user, db, company: membership.companies, membership };
}

export function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}
