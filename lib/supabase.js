import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbmdjqnshyogunoisrn.supabase.co';
// Ganti bagian di dalam tanda kutip dengan kunci anon key (sb_publ1s...) kamu:
const supabaseAnonKey = 'PASTE_KUNCI_ANON_KEY_KAMU_DI_SINI'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
