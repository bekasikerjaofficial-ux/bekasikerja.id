import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from './supabase-url';

function config() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

// Reads the caller's own JWT out of the Authorization header.
//
// SUPABASE_SERVICE_ROLE_KEY is deliberately not involved. That key is absent
// from the Vercel deployment env, and requiring it here made every employer
// route answer 401 for any caller, including a correctly signed-in one. The
// database client's `db` member is built from the anon key plus the caller's
// token, so Postgres RLS still enforces authorization per row via the
// user_company_ids()/is_admin() policies. That is both sufficient and safer
// than a server-wide key that bypasses RLS entirely.
function callerToken(request) {
  const authorization = request.headers.get('authorization') || '';
  return authorization.match(/^Bearer\s+(.+)$/i)?.[1] || '';
}

function dbFor(url, anonKey, token) {
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function requireUser(request) {
  const { url, anonKey } = config();
  const token = callerToken(request);
  if (!url || !anonKey) {
    console.error('[requireUser] missing env', { url: !!url, anonKey: !!anonKey });
    return { error: Response.json({ error: 'Server configuration error' }, { status: 500 }) };
  }
  if (!token) {
    return { error: Response.json({ error: 'Login diperlukan.' }, { status: 401 }) };
  }
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) return { error: Response.json({ error: 'Sesi login tidak valid.' }, { status: 401 }) };
  return { user: data.user, db: dbFor(url, anonKey, token) };
}

export async function requireEmployer(request) {
  const { url, anonKey } = config();
  const token = callerToken(request);
  if (!url || !anonKey) {
    console.error('[requireEmployer] missing env', { url: !!url, anonKey: !!anonKey });
    return { error: Response.json({ error: 'Server configuration error' }, { status: 500 }) };
  }
  if (!token) {
    return { error: Response.json({ error: 'Login employer diperlukan.' }, { status: 401 }) };
  }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    return { error: Response.json({ error: 'Sesi login tidak valid.' }, { status: 401 }) };
  }

  const db = dbFor(url, anonKey, token);
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