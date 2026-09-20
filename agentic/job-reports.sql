-- Idempotent migration for job safety reports.
-- Apply after the core posts/employer schemas are available.
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
-- Public writes are intentionally handled by the server route with validation/service role.
-- No public read policy: reports are admin-only.
