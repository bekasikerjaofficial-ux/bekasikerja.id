-- BekasiKerja.id Employer Phase 2 + 3 additions
-- Run after agentic/employer-schema.sql.

create table if not exists public.company_verifications (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','verified','rejected')),
  submitted_by uuid not null references auth.users(id),
  reviewed_by uuid references auth.users(id),
  review_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique(company_id, status)
);

create table if not exists public.saved_candidates (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique(company_id, candidate_id)
);

create table if not exists public.job_views (
  id bigint generated always as identity primary key,
  job_id bigint not null references public.employer_jobs(id) on delete cascade,
  session_id text not null,
  viewed_at timestamptz not null default now(),
  unique(job_id, session_id)
);

create table if not exists public.employer_packages (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  price integer not null default 0,
  period text not null default 'bulan',
  job_quota integer,
  candidate_quota integer,
  featured_job boolean not null default false,
  sponsored_job boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employer_subscriptions (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  package_id bigint not null references public.employer_packages(id),
  status text not null default 'pending' check (status in ('pending','active','expired','cancelled')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.employer_payments (
  id bigint generated always as identity primary key,
  subscription_id bigint not null references public.employer_subscriptions(id) on delete cascade,
  invoice_number text not null unique,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending','manual_review','paid','rejected','expired','refunded')),
  payment_method text not null default 'manual',
  proof_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_actions (
  id bigint generated always as identity primary key,
  admin_id uuid not null references auth.users(id),
  action_type text not null,
  entity_type text not null,
  entity_id bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.employer_packages(slug,name,price,period,job_quota,candidate_quota,featured_job,sponsored_job)
values
 ('gratis','Gratis',0,'selamanya',1,50,false,false),
 ('basic','Basic',25000,'bulan',3,250,false,false),
 ('pro','Pro',75000,'bulan',10,1000,true,false),
 ('premium','Premium',150000,'bulan',null,null,true,true)
on conflict(slug) do update set name=excluded.name, price=excluded.price, period=excluded.period,
 job_quota=excluded.job_quota, candidate_quota=excluded.candidate_quota,
 featured_job=excluded.featured_job, sponsored_job=excluded.sponsored_job;

create index if not exists company_verifications_company_idx on public.company_verifications(company_id, submitted_at desc);
create index if not exists saved_candidates_company_idx on public.saved_candidates(company_id, created_at desc);
create index if not exists job_views_job_idx on public.job_views(job_id, viewed_at desc);
create index if not exists employer_subscriptions_company_idx on public.employer_subscriptions(company_id, created_at desc);
create index if not exists employer_payments_subscription_idx on public.employer_payments(subscription_id, created_at desc);

alter table public.company_verifications enable row level security;
alter table public.saved_candidates enable row level security;
alter table public.job_views enable row level security;
alter table public.employer_packages enable row level security;
alter table public.employer_subscriptions enable row level security;
alter table public.employer_payments enable row level security;
alter table public.admin_actions enable row level security;

drop policy if exists company_verifications_owner_read on public.company_verifications;
create policy company_verifications_owner_read on public.company_verifications for select using (company_id in (select public.user_company_ids()) or public.is_admin());
drop policy if exists company_verifications_owner_insert on public.company_verifications;
create policy company_verifications_owner_insert on public.company_verifications for insert with check (submitted_by = auth.uid() and company_id in (select public.user_company_ids()));
drop policy if exists company_verifications_admin_update on public.company_verifications;
create policy company_verifications_admin_update on public.company_verifications for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists saved_candidates_company_all on public.saved_candidates;
create policy saved_candidates_company_all on public.saved_candidates for all using (company_id in (select public.user_company_ids()) or public.is_admin()) with check (company_id in (select public.user_company_ids()) or public.is_admin());

drop policy if exists job_views_public_insert on public.job_views;
create policy job_views_public_insert on public.job_views for insert with check (length(session_id) >= 8);
drop policy if exists job_views_company_read on public.job_views;
create policy job_views_company_read on public.job_views for select using (job_id in (select id from public.employer_jobs where company_id in (select public.user_company_ids())) or public.is_admin());

drop policy if exists employer_packages_public_read on public.employer_packages;
create policy employer_packages_public_read on public.employer_packages for select using (active = true or public.is_admin());
drop policy if exists employer_packages_admin_write on public.employer_packages;
create policy employer_packages_admin_write on public.employer_packages for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists employer_subscriptions_company_read on public.employer_subscriptions;
create policy employer_subscriptions_company_read on public.employer_subscriptions for select using (company_id in (select public.user_company_ids()) or public.is_admin());
drop policy if exists employer_subscriptions_admin_write on public.employer_subscriptions;
create policy employer_subscriptions_admin_write on public.employer_subscriptions for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists employer_payments_company_read on public.employer_payments;
create policy employer_payments_company_read on public.employer_payments for select using (subscription_id in (select id from public.employer_subscriptions where company_id in (select public.user_company_ids())) or public.is_admin());
drop policy if exists employer_payments_admin_write on public.employer_payments;
create policy employer_payments_admin_write on public.employer_payments for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_actions_admin_read on public.admin_actions;
create policy admin_actions_admin_read on public.admin_actions for select using (public.is_admin());
drop policy if exists admin_actions_admin_insert on public.admin_actions;
create policy admin_actions_admin_insert on public.admin_actions for insert with check (public.is_admin() and admin_id = auth.uid());
