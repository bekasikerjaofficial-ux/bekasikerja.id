import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbmdjqnshyogunoisrn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR...'; // PASTI KAN KUNCI ANON KEY ASLI DI SINI

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
