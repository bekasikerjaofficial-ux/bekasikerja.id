import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbmdjqnshyogunoisrn.supabase.co';

// PASTE KUNCI DARI SCREENSHOT SUPABASE KAMU (yang diawali sb_publ1s...) DI DALAM TANDA KUTIP DI BAWAH INI:
const supabaseAnonKey = 'sb_publishable_NHzqFCPITxhr1WtyEFe6Hw_fatYgCgU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
