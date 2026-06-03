-- Mobile resume scan history (Career Shield analyses)
-- Adds target_role_input + calculated_risk_score for explicit History display.

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

-- Backfill path when table already existed without the new columns.
do $migration$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'user_resume_scans'
  ) then
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_resume_scans'
        and column_name = 'target_role_input'
    ) then
      alter table public.user_resume_scans
        add column target_role_input text;

      update public.user_resume_scans
      set target_role_input = coalesce(
        nullif(trim(current_role_input), ''),
        'Unknown Role'
      )
      where target_role_input is null;

      alter table public.user_resume_scans
        alter column target_role_input set default 'Unknown Role';

      alter table public.user_resume_scans
        alter column target_role_input set not null;
    end if;

    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_resume_scans'
        and column_name = 'calculated_risk_score'
    ) then
      alter table public.user_resume_scans
        add column calculated_risk_score integer;

      update public.user_resume_scans
      set calculated_risk_score = 50
      where calculated_risk_score is null;

      alter table public.user_resume_scans
        alter column calculated_risk_score set default 50;

      alter table public.user_resume_scans
        alter column calculated_risk_score set not null;

      alter table public.user_resume_scans
        add constraint user_resume_scans_calculated_risk_score_check
        check (calculated_risk_score >= 0 and calculated_risk_score <= 100);
    end if;
  end if;
end
$migration$;

alter table public.user_resume_scans enable row level security;

create policy "user_resume_scans_select_own"
  on public.user_resume_scans for select
  using (auth.uid() = user_id);

create policy "user_resume_scans_insert_own"
  on public.user_resume_scans for insert
  with check (auth.uid() = user_id);

create policy "user_resume_scans_delete_own"
  on public.user_resume_scans for delete
  using (auth.uid() = user_id);
