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
  // TIDAK ada fallback localhost: kalau env belum diset di Vercel,
  // kita mau GAGAL TERLIHAT (build/throw) daripada silent baca localhost
  // yang tidak ada di production.
  supabaseUrl,
  supabaseAnonKey
);
