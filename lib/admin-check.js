// Admin identity checks.
//
// Production DB did NOT get the `is_admin()` / `admin_emails()` functions
// (POST /rest/v1/rpc/is_admin -> PGRST202 "function not found"), so every RPC
// based guard silently failed closed. Until the SQL migration is applied to
// production we resolve the admin role from the verified JWT instead:
//   1. `app_metadata.role` is set by the Auth Admin API and cannot be edited
//      by the user themselves.
//   2. The canonical email allowlist below mirrors `admin_emails()` in
//      agentic/supabase-setup.sql — keep both in sync when applying the SQL.
//
// This is an authorization decision, not UI cosmetics: server-auth.js calls the
// same helper on a token that was validated with auth.getUser(token).

const ADMIN_EMAILS = [
  'bekasikerja.official@gmail.com',
  'mherfin.official@gmail.com',
  'hernanda@gmail.com',
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
}

// user = the authenticated user object (verified JWT claims + app_metadata)
export function isAdminUser(user) {
  if (!user) return false;
  const role = user.app_metadata?.role;
  if (role === 'admin') return true;
  return isAdminEmail(user.email);
}
