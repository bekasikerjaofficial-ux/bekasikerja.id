import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbmdjqnshyogunoisrn.supabase.co';

// PASTE KUNCI DARI SCREENSHOT SUPABASE KAMU (yang diawali sb_publ1s...) DI DALAM TANDA KUTIP DI BAWAH INI:
const supabaseAnonKey = 'PASTE_KUNCI_SB_PUBL1S_DI_SINI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
