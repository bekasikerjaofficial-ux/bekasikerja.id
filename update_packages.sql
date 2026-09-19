-- Update paket berlangganan BekasiKerja.id
-- Jalankan di Supabase SQL Editor production.
UPDATE public.packages SET price = 25000, period = '6 bulan' WHERE slug = 'hemat';
UPDATE public.packages SET price = 50000, period = '6 bulan' WHERE slug = 'sultan';
UPDATE public.packages SET price = 100000, period = '12 bulan' WHERE slug = 'have';

-- Verifikasi
SELECT slug, name, price, period FROM public.packages ORDER BY sort_order;
