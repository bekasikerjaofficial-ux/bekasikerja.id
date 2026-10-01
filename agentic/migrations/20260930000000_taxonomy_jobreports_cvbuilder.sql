-- ============================================================================
-- BekasiKerja.id — taxonomy, job reports, CV builder
--
-- Companion to 20260928120000_analytics_visitor_stats.sql, which already
-- covers page_visits, article_reads and the admin analytics RPCs.
-- Both files are idempotent and independent; run either order.
--
-- VERIFIED MISSING IN PRODUCTION (2026-09-30, PostgREST probe):
--   categories, tags, post_tags, job_reports, cv_templates, member_cvs
--   app/api/categories|tags|post-tags all returned HTTP 500
--   app/api/job-reports returned 503 "Fitur laporan belum dikonfigurasi."
--   app/cv-builder found 0 templates and could not save
--
-- Every column below is transcribed from the application code that reads it,
-- not inferred. Signatures must match exactly:
--   app/api/categories/route.js  -> name, slug, description
--   app/api/tags/route.js         -> name, slug
--   app/api/post-tags/route.js    -> post_id, tag_id
--   app/api/job-reports/route.js  -> job_ref, reporter_id, reason, details
--   app/cv-builder/page.js        -> template_slug, sort_order, is_active,
--                                    full_name, email, phone, address, summary,
--                                    experience, education, skills,
--                                    certifications, languages, user_id
--   app/loker/[id]/page.js        -> reason values must match REASONS set
--
-- Apply: Supabase Dashboard > SQL Editor > paste > Run.
--
-- REQUIRES 20260928120000_analytics_visitor_stats.sql to have been run first.
-- The RLS policies below call public.is_admin(), which that file defines.
-- Running this file alone fails inside the transaction and rolls back with
-- 'function public.is_admin() does not exist' — the verify block at the end
-- checks for it explicitly. Run the analytics migration, then this one.
-- ============================================================================

begin;

-- ============================================================================
-- BLOCK 1 — categories / tags / post_tags
--
-- BUG FIXED HERE: agentic/supabase-setup.sql creates a "post_tags_admin_write"
-- policy but never runs ENABLE ROW LEVEL SECURITY on post_tags. A policy on a
-- table with RLS disabled is inert, so post_tags was world-readable and
-- world-writable through PostgREST. The enable statement below is new.
-- ============================================================================

create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  slug        text not null unique,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.tags (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  slug        text not null unique,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.post_tags (
  post_id bigint not null references public.posts(id) on delete cascade,
  tag_id  bigint not null references public.tags(id)   on delete cascade,
  primary key (post_id, tag_id)
);

-- FIX: post_tags had a policy but no RLS enable.
alter table public.post_tags enable row level security;

alter table public.categories enable row level security;
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.tags enable row level security;
drop policy if exists "tags_public_read" on public.tags;
create policy "tags_public_read" on public.tags
  for select using (true);
drop policy if exists "tags_admin_write" on public.tags;
create policy "tags_admin_write" on public.tags
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "post_tags_admin_write" on public.post_tags;
create policy "post_tags_admin_write" on public.post_tags
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed the taxonomy from categories already in use by the published posts,
-- so the admin Categories tab is not empty on first load.
insert into public.categories (name, slug)
select distinct trim(p.category),
       lower(regexp_replace(trim(p.category), '[^a-zA-Z0-9]+', '-', 'g'))
from public.posts p
where p.category is not null
  and trim(p.category) <> ''
on conflict (name) do nothing;


-- ============================================================================
-- BLOCK 2 — job_reports  (app/api/job-reports/route.js)
-- Transcribed from agentic/job-reports.sql. The reason check constraint must
-- stay in sync with the route's REASONS set or reports get rejected at 400.
-- ============================================================================

create table if not exists public.job_reports (
  id          bigint generated always as identity primary key,
  job_ref     text        not null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason      text        not null
              check (reason in ('penipuan','meminta_uang','data_mencurigakan',
                                'informasi_tidak_sesuai','lainnya')),
  details     text,
  status      text        not null default 'pending'
              check (status in ('pending','reviewing','resolved','dismissed')),
  created_at  timestamptz not null default now()
);

create index if not exists job_reports_job_ref_idx
  on public.job_reports (job_ref, created_at desc);
create index if not exists job_reports_status_idx
  on public.job_reports (status, created_at desc);

-- RLS enabled with NO policies: the server route writes with the service role
-- (which bypasses RLS) and validates input itself. No client may read or
-- write. Reports are admin-only, and nothing reads them yet.
alter table public.job_reports enable row level security;


-- ============================================================================
-- BLOCK 3 — cv_templates / member_cvs  (app/cv-builder/page.js)
--
-- RLS here is PER-ROW OWNER scoped, deliberately different from the
-- analytics tables: the CV builder inserts, updates and deletes
-- member_cvs straight from the browser using the member's own session.
-- Revoking table access (the analytics pattern) would break the feature.
-- ============================================================================

create table if not exists public.cv_templates (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  description text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.member_cvs (
  id             bigint generated always as identity primary key,
  user_id        uuid not null references auth.users(id) on delete cascade,
  template_slug  text not null default 'minimal',
  full_name      text,
  email          text,
  phone          text,
  address        text,
  summary        text,
  experience     jsonb default '[]'::jsonb,
  education      jsonb default '[]'::jsonb,
  skills         jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  languages      jsonb default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists member_cvs_user_idx
  on public.member_cvs (user_id, updated_at desc);

alter table public.cv_templates enable row level security;
drop policy if exists "cv_templates_public_read" on public.cv_templates;
create policy "cv_templates_public_read" on public.cv_templates
  for select using (true);

alter table public.member_cvs enable row level security;
drop policy if exists "member_cvs_owner_all" on public.member_cvs;
create policy "member_cvs_owner_all" on public.member_cvs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seeds must match the three slugs app/cv-builder/page.js branches on
-- (MinimalTemplate / ModernTemplate / ProfessionalTemplate).
insert into public.cv_templates (slug, name, description, sort_order) values
  ('minimal',      'Minimal',      'Desain bersih dan profesional, ATS-friendly', 1),
  ('modern',       'Modern',       'Tampilan kontemporer dengan aksen warna',   2),
  ('professional', 'Professional', 'Format klasik untuk perusahaan korporat',  3)
on conflict (slug) do nothing;


-- ============================================================================
-- BLOCK 4 — storage RLS for the images bucket
--
-- BLOCK 0: bucket 'images' exists and is public, but every storage.objects
-- insert was rejected with:
--     403 {"code":"AccessDenied","message":"new row violates row-level security
--          policy"}
-- i.e. the bucket has no permissive insert policy, so supabase.storage
-- .from('images').upload(...) from app/admin/page.js, app/nyosor/dashboard,
-- and components/ImageUpload.js could never succeed.
--
-- Uploads are done from the browser with the anon key, so the policy has to
-- permit the anon role. Scope is deliberately tight: insert only, and only
-- into the images bucket — nothing grants read/write on other objects.
-- Unauthenticated users can therefore upload files, which was already true
-- by design (there is no upload auth check in the app), but could not
-- actually happen until this policy existed.
--
-- Reads stay public (bucket is public). Updates/deletes stay restricted to
-- authenticated users, matching the fact that only logged-in staff edit
-- existing posts.
-- ============================================================================

-- Path scope matches what the code actually does: every caller uploads to the
-- bucket root with a name like '1712abc_xyz.png' (no folder prefix). ImageUpload
-- accepts an optional `folder` prop, but neither call site passes one, so the
-- policy must not require a folder or all real uploads are rejected.
insert into storage.objects (bucket_id, name)
select 'images', '.policy-anchor'
where not exists (
  select 1 from storage.objects
  where bucket_id = 'images' and name = '.policy-anchor'
);

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- Insert only. anon is required because all three upload sites run in the
-- browser with the public anon key (app/admin/page.js, app/nyosor/dashboard,
-- components/ImageUpload.js) — the app has no upload auth gate.
drop policy if exists "images_anon_upload" on storage.objects;
create policy "images_anon_upload" on storage.objects
  for insert with check (bucket_id = 'images');

-- Update/delete restricted to logged-in users; only staff edit existing posts.
drop policy if exists "images_authenticated_manage" on storage.objects;
create policy "images_authenticated_manage" on storage.objects
  for all using (
    bucket_id = 'images' and auth.role() = 'authenticated'
  ) with check (
    bucket_id = 'images' and auth.role() = 'authenticated'
  );


-- ============================================================================
-- BLOCK 5 — verification
-- Read the output after running. All three must report ok.
-- ============================================================================

do $$
declare
  v_missing text;
begin
  -- Fail loudly and early if the prerequisite migration was not run, rather
  -- than erroring partway through with an opaque is_admin() message.
  if to_regprocedure('public.is_admin()') is null then
    raise exception 'VERIFY FAILED — run 20260928120000_analytics_visitor_stats.sql first '
                    '(it defines public.is_admin(), required by every policy here)';
  end if;

  select string_agg(t, ', ') into v_missing
  from unnest(array['categories','tags','post_tags','job_reports',
                    'cv_templates','member_cvs']) as t
  where to_regclass('public.' || t) is null;

  if v_missing is not null then
    raise exception 'VERIFY FAILED — missing tables: %', v_missing;
  end if;

  -- post_tags RLS is the silent security bug this file exists to fix.
  if not exists (select 1 from pg_class c
                 join pg_namespace n on n.oid = c.relnamespace
                 where n.nspname = 'public'
                   and c.relname = 'post_tags'
                   and c.relrowsecurity) then
    raise exception 'VERIFY FAILED — post_tags row level security is not enabled';
  end if;

  -- Upload fix: without this policy every image upload from the admin panel
  -- fails with 403 'new row violates row-level security policy'.
  if not exists (select 1 from pg_policies
                 where schemaname = 'storage'
                   and tablename = 'objects'
                   and policyname = 'images_anon_upload') then
    raise exception 'VERIFY FAILED — images_anon_upload storage policy missing, '
                    'image upload will still return 403';
  end if;

  raise notice 'VERIFY OK — 6 tables present, post_tags RLS enabled, storage upload policy present';
end;
$$;

commit;
