import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeSupabaseUrl } from './supabase-url';
import { isAdminUser } from './admin-check';

export async function requireAdmin(request) {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get('authorization') || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  const token = tokenMatch?.[1] || '';

  // NOTE: SUPABASE_SERVICE_ROLE_KEY is deliberately NOT required here. The guard
  // only validates the caller's session with the anon key; the service key is
  // used later by the route handler's own db() helper. Requiring it made every
  // admin API call fail with a generic 401 whenever it was absent from the
  // deployment env.
  if (!url || !anonKey) {
    console.error('[requireAdmin] Supabase env missing', { url: !!url, anonKey: !!anonKey });
    return { error: NextResponse.json({ error: 'Server configuration error' }, { status: 500 }) };
  }
  if (!token) {
    return { error: NextResponse.json({ error: 'Admin authentication required' }, { status: 401 }) };
  }

  const authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    return { error: NextResponse.json({ error: 'Invalid admin session' }, { status: 401 }) };
  }

  // Resolved from the verified token (app_metadata.role or canonical email
  // allowlist). The `is_admin()` RPC is absent in the production DB
  // (PGRST202), so calling it here denied every admin request.
  if (!isAdminUser(userData.user)) {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  }

  return { user: userData.user };
}
