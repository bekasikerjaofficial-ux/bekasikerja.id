-- BekasiKerja.id Employer Phase 4 UAT: candidate search, consent, contact requests, audit
-- Run after employer-schema.sql and employer-phase2-3.sql.

alter table public.candidate_profiles add column if not exists search_consent_at timestamptz;
alter table public.candidate_profiles add column if not exists contact_consent boolean not null default false;

create table if not exists public.employer_contact_requests (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  employer_user_id uuid not null references auth.users(id),
  candidate_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(company_id, candidate_id, status)
);

create table if not exists public.candidate_access_logs (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  employer_user_id uuid not null references auth.users(id),
  candidate_id uuid not null references auth.users(id) on delete cascade,
  access_type text not null,
  search_query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists contact_requests_candidate_idx on public.employer_contact_requests(candidate_id, created_at desc);
create index if not exists contact_requests_company_idx on public.employer_contact_requests(company_id, created_at desc);
create index if not exists candidate_access_logs_candidate_idx on public.candidate_access_logs(candidate_id, created_at desc);
create index if not exists candidate_access_logs_company_idx on public.candidate_access_logs(company_id, created_at desc);

alter table public.employer_contact_requests enable row level security;
alter table public.candidate_access_logs enable row level security;

drop policy if exists contact_requests_employer_read on public.employer_contact_requests;
create policy contact_requests_employer_read on public.employer_contact_requests for select using (company_id in (select public.user_company_ids()) or employer_user_id = auth.uid() or public.is_admin());
drop policy if exists contact_requests_employer_insert on public.employer_contact_requests;
create policy contact_requests_employer_insert on public.employer_contact_requests for insert with check (company_id in (select public.user_company_ids()) and employer_user_id = auth.uid());
drop policy if exists contact_requests_candidate_update on public.employer_contact_requests;
create policy contact_requests_candidate_update on public.employer_contact_requests for update using (candidate_id = auth.uid() or public.is_admin()) with check (candidate_id = auth.uid() or public.is_admin());

drop policy if exists candidate_access_logs_admin_read on public.candidate_access_logs;
create policy candidate_access_logs_admin_read on public.candidate_access_logs for select using (public.is_admin() or company_id in (select public.user_company_ids()));
drop policy if exists candidate_access_logs_employer_insert on public.candidate_access_logs;
create policy candidate_access_logs_employer_insert on public.candidate_access_logs for insert with check (company_id in (select public.user_company_ids()) and employer_user_id = auth.uid());
