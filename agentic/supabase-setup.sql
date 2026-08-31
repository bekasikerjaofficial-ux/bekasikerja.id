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

-- ============================================================
-- PAKET MEMBERSHIP & PSIKOTES (concept doc: Gratis/Hemat/Sultan/Have)
-- TIDAK ada seed data — diisi via /admin/paket.
-- ============================================================

-- 4) TABEL packages (konfigurasi paket, dikelola admin)
create table if not exists public.packages (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  price       integer not null default 0,          -- 0 = gratis
  period      text not null default 'bulan',
  tagline     text,
  description text,
  features    jsonb not null default '[]'::jsonb,   -- [{text, included:bool}]
  popular     boolean not null default false,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 5) TABEL memberships (entitlement member -> paket)
create table if not exists public.memberships (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  bigint not null references public.packages(id) on delete cascade,
  status      text not null default 'active' check (status in ('active','expired','cancelled')),
  started_at  timestamptz not null default now(),
  expires_at  timestamptz,
  unique (user_id, package_id)
);

-- helper: apakah user punya package aktif by slug?
create or replace function public.has_package(p_user uuid, p_slug text)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.memberships m
    join public.packages p on p.id = m.package_id
    where m.user_id = p_user and p.slug = p_slug and m.status = 'active'
      and (m.expires_at is null or m.expires_at > now())
  );
$$;

-- RLS: packages publik baca, admin tulis
alter table public.packages enable row level security;
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read" on public.packages for select using (true);
drop policy if exists "packages_admin_write" on public.packages;
create policy "packages_admin_write" on public.packages
  for all using (public.is_admin()) with check (public.is_admin());

-- RLS: memberships — owner baca miliknya, admin tulis semua
alter table public.memberships enable row level security;
drop policy if exists "memberships_owner_read" on public.memberships;
create policy "memberships_owner_read" on public.memberships
  for select using (auth.uid() = user_id);
drop policy if exists "memberships_admin_write" on public.memberships;
create policy "memberships_admin_write" on public.memberships
  for all using (public.is_admin()) with check (public.is_admin());

-- 6) TABEL membership_orders (order pembayaran QRIS, diisi oleh /api/checkout)
create table if not exists public.membership_orders (
  id          bigint generated always as identity primary key,
  order_id    text not null unique,         -- order_id Midtrans
  user_id     uuid not null references auth.users(id) on delete cascade,
  package_id  bigint not null references public.packages(id) on delete cascade,
  amount      integer not null,
  status      text not null default 'pending' check (status in ('pending','paid','cancelled')),
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists membership_orders_user_idx on public.membership_orders(user_id);

-- RLS: order hanya bisa dibaca owner & admin (dibuat via service role di route)
alter table public.membership_orders enable row level security;
drop policy if exists "membership_orders_owner_read" on public.membership_orders;
create policy "membership_orders_owner_read" on public.membership_orders
  for select using (auth.uid() = user_id);
drop policy if exists "membership_orders_admin_all" on public.membership_orders;
create policy "membership_orders_admin_all" on public.membership_orders
  for all using (public.is_admin()) with check (public.is_admin());
