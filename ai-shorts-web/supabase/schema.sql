-- AI Shorts Factory — initial schema. Run this in the Supabase SQL editor
-- (Project -> SQL Editor -> New query) on a fresh project.

create extension if not exists "pgcrypto";

-- One row per authenticated user, keyed to Supabase's own auth.users.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  approved boolean not null default false,
  videos_this_month integer not null default 0,
  google_refresh_token text, -- TODO: encrypt at rest before real users are invited
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users can read their own row"
  on public.users for select
  using (auth.uid() = id);

create policy "users can upsert their own row"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users can update their own row"
  on public.users for update
  using (auth.uid() = id);

-- One row per video request.
create type public.job_status as enum (
  'drafting',
  'awaiting_approval',
  'rejected',
  'generating_assets',
  'rendering',
  'qa_running',
  'qa_failed',
  'qa_passed',
  'rendering_final',
  'mixing_sfx',
  'generating_seo',
  'uploading',
  'completed',
  'failed'
);

create type public.video_track as enum ('make-short', 'make-vox', 'make-ai-short');

create table public.video_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  topic text not null,
  track public.video_track not null,
  status public.job_status not null default 'drafting',
  script_draft jsonb,
  cost_estimate jsonb,
  error text,
  drive_file_id text,
  drive_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.video_jobs enable row level security;

create policy "users can read their own jobs"
  on public.video_jobs for select
  using (auth.uid() = user_id);

create policy "users can create their own jobs"
  on public.video_jobs for insert
  with check (auth.uid() = user_id);

create policy "users can update their own jobs"
  on public.video_jobs for update
  using (auth.uid() = user_id);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger video_jobs_set_updated_at
  before update on public.video_jobs
  for each row execute function public.set_updated_at();

-- QA vision-loop audit trail, one row per iteration per job.
create table public.qa_iterations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.video_jobs (id) on delete cascade,
  iteration_n integer not null,
  screenshot_urls text[] not null default '{}',
  verdict text not null,
  defects jsonb,
  created_at timestamptz not null default now()
);

alter table public.qa_iterations enable row level security;

create policy "users can read qa iterations for their own jobs"
  on public.qa_iterations for select
  using (exists (select 1 from public.video_jobs j where j.id = job_id and j.user_id = auth.uid()));

-- Generated SEO metadata, one row per job.
create table public.seo_content (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.video_jobs (id) on delete cascade unique,
  title text,
  description text,
  hashtags text[],
  created_at timestamptz not null default now()
);

alter table public.seo_content enable row level security;

create policy "users can read seo content for their own jobs"
  on public.seo_content for select
  using (exists (select 1 from public.video_jobs j where j.id = job_id and j.user_id = auth.uid()));

-- Realtime: let the dashboard subscribe to job status changes.
alter publication supabase_realtime add table public.video_jobs;
