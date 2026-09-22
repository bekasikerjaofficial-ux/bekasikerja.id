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

-- Email admin utama; app_metadata.role = admin juga diterima untuk user
-- yang dibuat oleh Auth Admin API/CI. app_metadata tidak bisa diubah user biasa.
create or replace function public.admin_emails()
returns text[] language sql stable as $$
  select array['admin@bekasikerja.id'];
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    lower(auth.email()) = any(public.admin_emails())
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
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
-- PAKET MEMBERSHIP & PSIKOTES (concept doc: Gratis/Basic/Pro/Premium)
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

-- ============================================================
-- CATEGORIES (list kategori pekerjaan)
-- ============================================================
create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  slug        text not null unique,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TAGS (list tag / keyword)
-- ============================================================
create table if not exists public.tags (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  slug        text not null unique,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- POST_TAGS (junction: posts <-> tags)
-- ============================================================
create table if not exists public.post_tags (
  post_id     bigint not null references public.posts(id) on delete cascade,
  tag_id      bigint not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- ============================================================
-- ALTER site_settings: add header_name column
-- ============================================================
alter table public.site_settings add column if not exists header_name text;
update public.site_settings set header_name = 'BekasiKerja' where id = 1 and header_name is null;

-- ============================================================
-- RLS: categories, tags public read, admin write
-- ============================================================
alter table public.categories enable row level security;
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories for select using (true);
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

alter table public.tags enable row level security;
drop policy if exists "tags_public_read" on public.tags;
create policy "tags_public_read" on public.tags for select using (true);
drop policy if exists "tags_admin_write" on public.tags;
create policy "tags_admin_write" on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "post_tags_admin_write" on public.post_tags;
create policy "post_tags_admin_write" on public.post_tags for all using (public.is_admin());


-- BekasiKerja analytics: visitor harian, member count, dan pembaca artikel.
-- Jalankan setelah supabase-setup.sql. Semua fungsi aman dipanggil dari anon client.

create table if not exists public.page_visits (
  id bigint generated always as identity primary key,
  visit_date date not null default (now() at time zone 'utc')::date,
  path text not null,
  session_id text not null,
  created_at timestamptz not null default now(),
  unique (visit_date, path, session_id)
);
create index if not exists page_visits_date_idx on public.page_visits(visit_date desc);

create table if not exists public.article_reads (
  slug text primary key,
  read_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.page_visits enable row level security;
alter table public.article_reads enable row level security;

revoke all on public.page_visits from anon, authenticated;
revoke all on public.article_reads from anon, authenticated;

drop function if exists public.record_page_visit(text, text);
create or replace function public.record_page_visit(p_path text, p_session_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_path is null or p_session_id is null or length(p_session_id) < 8 then return; end if;
  insert into public.page_visits (path, session_id)
  values (left(p_path, 500), left(p_session_id, 100))
  on conflict (visit_date, path, session_id) do nothing;
end;
$$;
grant execute on function public.record_page_visit(text, text) to anon, authenticated;

drop function if exists public.record_article_read(text);
create or replace function public.record_article_read(p_slug text)
returns bigint language plpgsql security definer set search_path = public as $$
declare result bigint;
begin
  if p_slug is null or length(p_slug) = 0 then return 0; end if;
  insert into public.article_reads(slug, read_count, updated_at)
  values (left(p_slug, 200), 1, now())
  on conflict (slug) do update set read_count = article_reads.read_count + 1, updated_at = now()
  returning read_count into result;
  return result;
end;
$$;
grant execute on function public.record_article_read(text) to anon, authenticated;

drop function if exists public.get_article_read_count(text);
create or replace function public.get_article_read_count(p_slug text)
returns bigint language sql stable security definer set search_path = public as $$
  select coalesce((select read_count from public.article_reads where slug = p_slug), 0);
$$;
grant execute on function public.get_article_read_count(text) to anon, authenticated;

drop function if exists public.get_admin_analytics(integer);
create or replace function public.get_admin_analytics(p_days integer default 30)
returns table (metric_date date, visitors bigint, members bigint)
language sql stable security definer set search_path = public as $$
  select d.metric_date,
         (select count(distinct v.session_id) from public.page_visits v where v.visit_date = d.metric_date) visitors,
         (select count(*) from auth.users u where (u.created_at at time zone 'utc')::date <= d.metric_date) members
  from generate_series(current_date - greatest(1, least(p_days, 365)) + 1, current_date, interval '1 day') d(metric_date)
  where public.is_admin()
  order by d.metric_date;
$$;
grant execute on function public.get_admin_analytics(integer) to authenticated;
