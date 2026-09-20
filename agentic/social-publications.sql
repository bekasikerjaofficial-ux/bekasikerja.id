-- Apply only after reviewing production schema and Meta integration credentials.
-- Idempotency and audit trail for automatic Facebook Page publishing.
create table if not exists public.social_publications (
  id bigint generated always as identity primary key,
  platform text not null,
  channel_id text not null,
  post_id bigint not null references public.posts(id) on delete cascade,
  external_id text,
  status text not null default 'pending',
  error_message text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, channel_id, post_id)
);

create index if not exists social_publications_status_idx
  on public.social_publications (platform, channel_id, status);

alter table public.social_publications enable row level security;
