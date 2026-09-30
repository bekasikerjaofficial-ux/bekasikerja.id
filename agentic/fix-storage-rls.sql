-- ============================================================
-- MIGRASI: policies write admin yang hilang di produksi
-- ------------------------------------------------------------
-- Gejala: upload gambar gagal dengan
--   "new row violates row-level security policy"
--   dan insert ke `posts` juga gagal untuk admin yang sudah login.
-- Penyebab: policy `images_admin_write` dan `posts_admin_write`
-- tidak pernah ter-apply di project produksi (schema dijalankan
-- sebelum policy ini ada / partial). `site_settings_admin_write`
-- terbukti masih ada, jadi `public.is_admin()` sendiri berfungsi.
--
-- Idempotent: aman dijalankan berulang.
-- Cara jalankan: workflow GitHub Actions "Setup Supabase" (manual),
-- atau psql langsung ke project. Butuh secret SUPABASE_DB_URL.
-- ============================================================

-- 1) Pastikan fungsi penentu admin ada (sumber kebenaran untuk semua policy).
create or replace function public.admin_emails()
returns text[] language sql stable as $$
  select array['bekasikerja.official@gmail.com'];
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    lower(auth.email()) = any(public.admin_emails())
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 2) Bucket images harus ada dan public (public = URL bisa dibaca tanpa login).
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- 3) storage.objects: public bisa baca, hanya admin bisa tulis.
drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "images_admin_write" on storage.objects;
create policy "images_admin_write" on storage.objects
  for all using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());

-- 4) posts: public baca, admin tulis.
alter table public.posts enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select using (true);

drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- 5) site_settings: reaffirm (sudah ada di produksi, tapi dijaga agar sinkron).
alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- Verifikasi: setelah run, script `npm run diag:storage` harus mencetak
--   service-role upload: ok
--   anon upload:         FAIL new row violates row-level security policy  (diharapkan)
--   admin-session upload: ok
--   posts INSERT:        ALLOWED
