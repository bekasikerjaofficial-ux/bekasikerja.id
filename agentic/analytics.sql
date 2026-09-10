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
