// Hardcoded admin emails — matches admin_emails() in agentic/supabase-setup.sql
// Used client-side until RPC is provisioned in production DB.
const ADMIN_EMAILS = [
  'bekasikerja.official@gmail.com',
  'hernanda@gmail.com',
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
