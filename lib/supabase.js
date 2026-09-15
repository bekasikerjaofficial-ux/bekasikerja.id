import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Build-resilient: never throw at import time if env vars are absent (e.g. Vercel
// build step before env is configured). Real errors surface at runtime instead of
// breaking static prerender.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set. ' +
    'Copy .env.local.example to .env.local (and set them in Vercel project env). ' +
    'Supabase calls will no-op until configured.'
  );
}

export const supabase = createClient(
  // Use PKCE so OAuth returns a one-time `code` to the callback route.
  // The callback page exchanges it in this same browser client, preserving
  // the session in the browser storage used by AuthProvider/dashboard.
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
    },
  }
);
