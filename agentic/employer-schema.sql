-- BekasiKerja.id Employer MVP: roles, companies, jobs, applications, RLS
-- Idempotent migration. Run after agentic/supabase-setup.sql.

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('candidate', 'employer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id bigint generated always as identity primary key,
  name text not null,
  legal_name text,
  logo_url text,
  industry text,
  founded_year integer,
  employee_count text,
  address text,
  city text,
  website text,
  hr_email text,
  hr_whatsapp text,
  description text,
  benefits jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_members (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'owner' check (member_role in ('owner','hr','recruiter')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists public.employer_jobs (
  id bigint generated always as identity primary key,
  company_id bigint not null references public.companies(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  title text not null,
  department text,
  location text,
  employment_type text not null default 'Full Time'
    check (employment_type in ('Full Time','Part Time','Contract','Internship','Freelance')),
  work_system text not null default 'On-site'
    check (work_system in ('On-site','Hybrid','Remote')),
  education_minimum text,
  major text,
  experience_minimum text,
  skills jsonb not null default '[]'::jsonb,
  salary_min integer,
  salary_max integer,
  benefits jsonb not null default '[]'::jsonb,
  description text,
  responsibilities text,
  requirements text,
  application_deadline date,
  vacancies integer not null default 1 check (vacancies > 0),
  application_method text,
  status text not null default 'draft'
    check (status in ('draft','pending_review','active','rejected','expired','archived')),
  moderation_note text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  city text,
  education text,
  experience jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  cv_url text,
  searchable boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id bigint generated always as identity primary key,
  job_id bigint not null references public.employer_jobs(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  cover_letter text,
  status text not null default 'new'
    check (status in ('new','screening','shortlisted','interview','passed','rejected')),
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create table if not exists public.application_status_history (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.job_applications(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.application_notes (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.job_applications(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.employer_notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id bigint references public.companies(id) on delete cascade,
  type text not null default 'general',
  title text not null,
  message text not null,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists company_members_user_idx on public.company_members(user_id);
create index if not exists employer_jobs_company_idx on public.employer_jobs(company_id, created_at desc);
create index if not exists employer_jobs_status_idx on public.employer_jobs(status, application_deadline);
create index if not exists job_applications_job_idx on public.job_applications(job_id, status);
create index if not exists job_applications_candidate_idx on public.job_applications(candidate_id);
create index if not exists application_notes_application_idx on public.application_notes(application_id, created_at desc);

create or replace function public.has_role(p_role text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = p_role
  ) or (p_role = 'admin' and public.is_admin());
$$;

create or replace function public.is_employer()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('employer');
$$;

create or replace function public.user_company_ids()
returns setof bigint language sql stable security definer set search_path = public as $$
  select company_id from public.company_members
  where user_id = auth.uid() and is_active = true;
$$;

create or replace function public.create_employer_account(
  p_name text,
  p_legal_name text default null,
  p_industry text default null,
  p_city text default null,
  p_hr_email text default null,
  p_hr_whatsapp text default null
)
returns bigint language plpgsql security definer set search_path = public as $$
 declare v_company_id bigint;
 begin
   if auth.uid() is null then raise exception 'Authentication required'; end if;
   if not exists (select 1 from public.user_roles where user_id = auth.uid()) then
     insert into public.user_roles(user_id, role) values (auth.uid(), 'employer');
   elsif not exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'employer') then
     raise exception 'User already has another role';
   end if;
   insert into public.companies(name, legal_name, industry, city, hr_email, hr_whatsapp)
   values (trim(p_name), nullif(trim(p_legal_name), ''), nullif(trim(p_industry), ''),
           nullif(trim(p_city), ''), nullif(trim(p_hr_email), ''), nullif(trim(p_hr_whatsapp), ''))
   returning id into v_company_id;
   insert into public.company_members(company_id, user_id, member_role)
   values (v_company_id, auth.uid(), 'owner');
   return v_company_id;
 end;
$$;

grant execute on function public.has_role(text) to authenticated;
grant execute on function public.is_employer() to authenticated;
grant execute on function public.user_company_ids() to authenticated;
grant execute on function public.create_employer_account(text,text,text,text,text,text) to authenticated;

-- Ownership and visibility policies.
alter table public.user_roles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.employer_jobs enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.job_applications enable row level security;
alter table public.application_status_history enable row level security;
alter table public.application_notes enable row level security;
alter table public.employer_notifications enable row level security;

drop policy if exists user_roles_self_read on public.user_roles;
create policy user_roles_self_read on public.user_roles for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists companies_public_verified_read on public.companies;
create policy companies_public_verified_read on public.companies for select using (verification_status = 'verified' or id in (select public.user_company_ids()) or public.is_admin());
drop policy if exists companies_owner_update on public.companies;
create policy companies_owner_update on public.companies for update using (id in (select public.user_company_ids()) or public.is_admin()) with check (id in (select public.user_company_ids()) or public.is_admin());

drop policy if exists company_members_self_read on public.company_members;
create policy company_members_self_read on public.company_members for select using (user_id = auth.uid() or company_id in (select public.user_company_ids()) or public.is_admin());

drop policy if exists employer_jobs_public_active_read on public.employer_jobs;
create policy employer_jobs_public_active_read on public.employer_jobs for select using (status = 'active' or company_id in (select public.user_company_ids()) or public.is_admin());
drop policy if exists employer_jobs_owner_insert on public.employer_jobs;
create policy employer_jobs_owner_insert on public.employer_jobs for insert with check (company_id in (select public.user_company_ids()) and created_by = auth.uid());
drop policy if exists employer_jobs_owner_update on public.employer_jobs;
create policy employer_jobs_owner_update on public.employer_jobs for update using (company_id in (select public.user_company_ids()) or public.is_admin()) with check (company_id in (select public.user_company_ids()) or public.is_admin());

drop policy if exists candidate_profiles_self_read on public.candidate_profiles;
create policy candidate_profiles_self_read on public.candidate_profiles for select using (user_id = auth.uid() or (searchable = true and public.is_employer()) or public.is_admin());
drop policy if exists candidate_profiles_self_write on public.candidate_profiles;
create policy candidate_profiles_self_write on public.candidate_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists applications_candidate_read on public.job_applications;
create policy applications_candidate_read on public.job_applications for select using (candidate_id = auth.uid() or public.is_admin() or job_id in (select id from public.employer_jobs where company_id in (select public.user_company_ids())));
drop policy if exists applications_candidate_insert on public.job_applications;
create policy applications_candidate_insert on public.job_applications for insert with check (candidate_id = auth.uid());
drop policy if exists applications_employer_update on public.job_applications;
create policy applications_employer_update on public.job_applications for update using (job_id in (select id from public.employer_jobs where company_id in (select public.user_company_ids())) or public.is_admin()) with check (job_id in (select id from public.employer_jobs where company_id in (select public.user_company_ids())) or public.is_admin());

drop policy if exists status_history_related_read on public.application_status_history;
create policy status_history_related_read on public.application_status_history for select using (application_id in (select id from public.job_applications where candidate_id = auth.uid()) or application_id in (select ja.id from public.job_applications ja join public.employer_jobs ej on ej.id = ja.job_id where ej.company_id in (select public.user_company_ids())) or public.is_admin());
drop policy if exists status_history_employer_insert on public.application_status_history;
create policy status_history_employer_insert on public.application_status_history for insert with check (
  changed_by = auth.uid() and (
    application_id in (
      select ja.id from public.job_applications ja
      join public.employer_jobs ej on ej.id = ja.job_id
      where ej.company_id in (select public.user_company_ids())
    ) or public.is_admin()
  )
);

drop policy if exists notes_employer_read_write on public.application_notes;
create policy notes_employer_read_write on public.application_notes for all using (application_id in (select ja.id from public.job_applications ja join public.employer_jobs ej on ej.id = ja.job_id where ej.company_id in (select public.user_company_ids())) or public.is_admin()) with check (author_id = auth.uid() and (application_id in (select ja.id from public.job_applications ja join public.employer_jobs ej on ej.id = ja.job_id where ej.company_id in (select public.user_company_ids())) or public.is_admin()));

drop policy if exists notifications_owner_read on public.employer_notifications;
create policy notifications_owner_read on public.employer_notifications for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists notifications_owner_update on public.employer_notifications;
create policy notifications_owner_update on public.employer_notifications for update using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

-- Public view for future homepage/lowongan integration.
create or replace view public.published_employer_jobs as
select ('employer-' || ej.id)::text as id, ej.company_id, c.name as company, ej.title, ej.location, null::text as category,
       ej.application_deadline::text as deadline, c.logo_url as image_url,
       ej.description as content, ej.created_at
from public.employer_jobs ej
join public.companies c on c.id = ej.company_id
where ej.status = 'active';

grant select on public.published_employer_jobs to anon, authenticated;
