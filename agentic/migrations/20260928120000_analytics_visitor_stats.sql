-- Visitor + article-read statistics for the admin panel.
-- Apply once in production. Idempotent: safe to run repeatedly.
--
-- Why this file exists: the admin UI (app/admin/page.js) reads
-- get_admin_analytics(), and components/AnalyticsTracker.js calls
-- record_page_visit() on every page view. Neither the tables nor the RPCs
-- existed in production, so visitor counts were permanently 0.
--
-- is_admin() and admin_emails() are re-declared here so this file can be run
-- standalone, without first running agentic/supabase-setup.sql. Paste into
-- Supabase Dashboard > SQL Editor and run once.

-- ---------------------------------------------------------------- admin auth
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

-- ------------------------------------------------------------------- tables
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

-- Writes only happen through the security-definer RPCs below, so the anon
-- key needs no direct table access. Admin reads also go through a definer
-- function, gated by is_admin().
revoke all on public.page_visits from anon, authenticated;
revoke all on public.article_reads from anon, authenticated;

-- -------------------------------------------------------------- write paths
drop function if exists public.record_page_visit(text, text);
create or replace function public.record_page_visit(p_path text, p_session_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_path is null or length(p_path) = 0 then return; end if;
  if p_session_id is null or length(p_session_id) < 8 then return; end if;
  insert into public.page_visits (path, session_id)
  values (left(p_path, 500), left(p_session_id, 100))
  on conflict (visit_date, path, session_id) do nothing;
end;
$$;
grant execute on function public.record_page_visit(text, text) to anon, authenticated;

drop function if exists public.record_article_read(text);
create or replace function public.record_article_read(p_slug text)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  v_count bigint;
begin
  if p_slug is null or length(p_slug) = 0 then return 0; end if;
  insert into public.article_reads (slug, read_count, updated_at)
  values (left(p_slug, 200), 1, now())
  on conflict (slug) do update
    set read_count = public.article_reads.read_count + 1, updated_at = now();
  select read_count into v_count from public.article_reads where slug = left(p_slug, 200);
  return v_count;
end;
$$;
grant execute on function public.record_article_read(text) to anon, authenticated;

-- --------------------------------------------------------------- read paths
drop function if exists public.get_article_read_count(text);
create or replace function public.get_article_read_count(p_slug text)
returns bigint language sql stable security definer set search_path = public as $$
  select coalesce(
    (select read_count from public.article_reads where slug = left(p_slug, 200)),
    0
  );
$$;
grant execute on function public.get_article_read_count(text) to anon, authenticated;

drop function if exists public.get_admin_analytics(integer);
create or replace function public.get_admin_analytics(p_days integer default 30)
returns table (metric_date date, visitors bigint, members bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  return query
    select d.metric_date::date,
           (
             select count(distinct v.session_id)
             from public.page_visits v
             where v.visit_date = d.metric_date::date
           ),
           (
             select count(*)
             from auth.users u
             where (u.created_at at time zone 'utc')::date <= d.metric_date::date
           )
    from generate_series(
           current_date - greatest(1, least(coalesce(p_days, 30), 365)),
           current_date,
           interval '1 day'
         ) as d(metric_date)
    order by d.metric_date;
end;
$$;
grant execute on function public.get_admin_analytics(integer) to authenticated;