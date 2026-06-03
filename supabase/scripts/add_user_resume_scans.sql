-- Run in Supabase Dashboard → SQL Editor (dev branch).
-- Creates mobile Career Shield scan history table + RLS policies.

create table if not exists public.user_resume_scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  current_role_input text,
  target_role_input text not null default 'Unknown Role',
  calculated_risk_score integer not null default 50
    check (calculated_risk_score >= 0 and calculated_risk_score <= 100),
  resume_excerpt text,
  tier text not null default 'free',
  gaps_summary text,
  matcher_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_resume_scans_user_id_created_at_idx
  on public.user_resume_scans (user_id, created_at desc);

alter table public.user_resume_scans enable row level security;

drop policy if exists "user_resume_scans_select_own" on public.user_resume_scans;
create policy "user_resume_scans_select_own"
  on public.user_resume_scans for select
  using (auth.uid() = user_id);

drop policy if exists "user_resume_scans_insert_own" on public.user_resume_scans;
create policy "user_resume_scans_insert_own"
  on public.user_resume_scans for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_resume_scans_delete_own" on public.user_resume_scans;
create policy "user_resume_scans_delete_own"
  on public.user_resume_scans for delete
  using (auth.uid() = user_id);
