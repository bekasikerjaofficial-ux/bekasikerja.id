-- ============================================================
-- Seed paket membership (ONE-TIME convenience)
-- BEDA dengan supabase-setup.sql: file ini hanya isi DATA, bukan
-- schema/RLS. Dipisah supaya provisioning SQL tetap bersih
-- (sesuai konvensi: data produk diisi via /admin/paket).
--
-- Idempoten: ON CONFLICT (slug) DO UPDATE — aman dijalankan ulang.
-- Jalankan setelah supabase-setup.sql:
--   psql "$SUPABASE_DB_URL" -f agentic/seed-packages.sql
-- ATAU via Supabase SQL Editor (dashboard).
-- ============================================================

insert into public.packages (slug, name, price, period, tagline, description, features, popular, sort_order, active)
values
  (
    'gratis', 'Gratis', 0, 'selamanya',
    'Mulai sekarang, tanpa biaya',
    'Lihat lowongan kerja & buat CV gratis.',
    '[
      {"text":"Akses lowongan kerja terverifikasi","included":true},
      {"text":"Pembuat CV gratis","included":true},
      {"text":"Tes Matematika Dasar","included":false},
      {"text":"Tes Logika Dasar","included":false},
      {"text":"Tes Ketelitian & Psikotes","included":false},
      {"text":"English Test & Case Study","included":false}
    ]'::jsonb,
    false, 0, true
  ),
  (
    'hemat', 'Hemat', 25000, '3 bulan',
    'Persiapan dasar tes masuk kerja',
    'CV gratis + Matematika Dasar + Tes Logika Dasar.',
    '[
      {"text":"Akses lowongan kerja terverifikasi","included":true},
      {"text":"Pembuat CV gratis","included":true},
      {"text":"Tes Matematika Dasar","included":true},
      {"text":"Tes Logika Dasar (Deret & Pola gambar)","included":true},
      {"text":"Tes Ketelitian & Psikotes","included":false},
      {"text":"English Test & Case Study","included":false}
    ]'::jsonb,
    false, 1, true
  ),
  (
    'sultan', 'Sultan', 35000, '3 bulan',
    'Paket paling laku untuk psikotes lengkap',
    'Paket Hemat + Ketelitian + Psikotes Umum.',
    '[
      {"text":"Akses lowongan kerja terverifikasi","included":true},
      {"text":"Pembuat CV gratis","included":true},
      {"text":"Tes Matematika Dasar","included":true},
      {"text":"Tes Logika Dasar (Deret & Pola gambar)","included":true},
      {"text":"Tes Ketelitian","included":true},
      {"text":"Psikotes Umum","included":true},
      {"text":"English Test & Case Study","included":false}
    ]'::jsonb,
    true, 2, true
  ),
  (
    'have', 'Have', 50000, '3 bulan',
    'Semua tes, tanpa batas',
    'Paket Sultan + English Test, Case Study, dll.',
    '[
      {"text":"Akses lowongan kerja terverifikasi","included":true},
      {"text":"Pembuat CV gratis","included":true},
      {"text":"Tes Matematika Dasar","included":true},
      {"text":"Tes Logika Dasar (Deret & Pola gambar)","included":true},
      {"text":"Tes Ketelitian","included":true},
      {"text":"Psikotes Umum","included":true},
      {"text":"English Test","included":true},
      {"text":"Case Study","included":true}
    ]'::jsonb,
    false, 3, true
  )
on conflict (slug) do update set
  name = excluded.name,
  price = excluded.price,
  period = excluded.period,
  tagline = excluded.tagline,
  description = excluded.description,
  features = excluded.features,
  popular = excluded.popular,
  sort_order = excluded.sort_order,
  active = excluded.active;
