-- ============================================================
-- BekasiKerja.id — Supabase Setup (Schema + RLS + Storage)
-- Idempoten: aman dijalankan berulang (CI/CD tiap deploy ke main).
-- TIDAK ada seed data — production menggunakan data aslinya.
-- Jalankan via psql:  psql "$SUPABASE_DB_URL" -f agentic/supabase-setup.sql
-- ============================================================

-- 1) TABEL posts -------------------------------------------------
create table if not exists public.posts (
  id            bigint generated always as identity primary key,
  type          text not null check (type in ('job','news')),
  title         text not null,
  company       text,
  location      text,
  category      text,
  deadline      text,
  image_url     text,
  content       text,
  created_at    timestamptz not null default now()
);

-- 2) TABEL site_settings (baris id = 1) --------------------------
create table if not exists public.site_settings (
  id            bigint primary key,
  brand_name    text,
  logo_url      text,
  badge_text    text,
  hero_title    text,
  hero_subtitle text
);
insert into public.site_settings (id, brand_name, badge_text, hero_title, hero_subtitle)
values (1, 'BekasiKerja.id', 'PORTAL LOWONGAN KERJA BEKASI & KARAWANG',
        'Temukan Karir Impianmu di Kawasan Industri',
        'Update lowongan kerja operator, admin, hingga engineering terpercaya setiap hari.')
on conflict (id) do nothing;

-- 3) STORAGE: bucket "images" (Public) --------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public = read only. Write = hanya admin (email di-whitelist).
-- ============================================================

-- Ganti dengan email admin Supabase Auth kamu:
create or replace function public.admin_emails()
returns text[] language sql stable as $$
  select array['admin@bekasikerja.id'];
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select coalesce(auth.email() = any(public.admin_emails()), false);
$$;

-- posts
alter table public.posts enable row level security;
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select using (true);
drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings
alter table public.site_settings enable row level security;
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select using (true);
drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- storage: public bisa baca, admin bisa tulis
drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');
drop policy if exists "images_admin_write" on storage.objects;
create policy "images_admin_write" on storage.objects
  for all using (bucket_id = 'images' and public.is_admin())
  with check (bucket_id = 'images' and public.is_admin());

-- ============================================================
-- BUAT USER ADMIN (Supabase Auth)
-- Tidak bisa via SQL murni. CI/CD membuatnya via Auth Admin API
-- (lihat .github/workflows/setup-supabase.yml) pakai SERVICE_ROLE key.
-- Email harus sama dengan public.admin_emails() di atas.
-- ============================================================
