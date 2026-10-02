-- job_reports: allow public submission, keep reads admin-only.
--
-- The original migration relied on the server route inserting with the
-- service-role key ("Public writes are intentionally handled by the server
-- route with validation/service role"). That key is absent from the Vercel
-- deployment, so the route can no longer bypass RLS and every report POST
-- failed. The route now forwards the caller's own JWT (anon when the visitor
-- is not signed in) and lets Postgres authorize the insert, which requires an
-- explicit INSERT policy.
--
-- Safety notes:
--   * reporter_id is force-nulled for anonymous submitters. Without auth.uid()
--     the client could otherwise attribute a report to any user id.
--   * status stays 'pending' (the table default); a reporter must not be able
--     to pre-resolve their own report.
--   * reason is constrained by the table CHECK constraint.
create table if not exists public.job_reports (
  id bigint generated always as identity primary key,
  job_ref text not null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null check (reason in ('penipuan','meminta_uang','data_mencurigakan','informasi_tidak_sesuai','lainnya')),
  details text,
  status text not null default 'pending' check (status in ('pending','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists job_reports_job_ref_idx on public.job_reports(job_ref, created_at desc);
create index if not exists job_reports_status_idx on public.job_reports(status, created_at desc);

alter table public.job_reports enable row level security;

drop policy if exists job_reports_public_submit on public.job_reports;
create policy job_reports_public_submit on public.job_reports
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and reporter_id is null
    and length(job_ref) between 1 and 120
    and (details is null or length(details) <= 1000)
  );

-- Reads stay admin-only; admins are covered by the existing is_admin() policy
-- pattern used across the other admin tables.
drop policy if exists job_reports_admin_read on public.job_reports;
create policy job_reports_admin_read on public.job_reports
  for select to authenticated using (public.is_admin());

drop policy if exists job_reports_admin_update on public.job_reports;
create policy job_reports_admin_update on public.job_reports
  for update to authenticated using (public.is_admin()) with check (public.is_admin());