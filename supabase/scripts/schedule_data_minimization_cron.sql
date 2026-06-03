-- =============================================================================
-- Manual apply: schedule data-minimization-cleanup (pg_cron)
-- Paste into Supabase SQL Editor if Git migration has not run yet.
-- =============================================================================

begin;

create extension if not exists pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

do $cron$
begin
  if exists (
    select 1
    from cron.job
    where jobname = 'data-minimization-cleanup'
  ) then
    perform cron.unschedule('data-minimization-cleanup');
  end if;
exception
  when undefined_table then
    raise exception
      'pg_cron is not available. Enable pg_cron under Database → Extensions, then run this script again.';
end;
$cron$;

select cron.schedule(
  'data-minimization-cleanup',
  '0 0 * * *',
  $$select public.cleanup_old_free_scans();$$
);

commit;

-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------

-- 1) Confirm the job is registered
select
  jobid,
  jobname,
  schedule,
  command,
  active,
  database,
  username
from cron.job
where jobname = 'data-minimization-cleanup';

-- 2) Inspect execution history (empty until the first scheduled run)
select
  d.jobid,
  j.jobname,
  d.runid,
  d.status,
  d.start_time,
  d.end_time,
  d.return_message
from cron.job_run_details d
join cron.job j on j.jobid = d.jobid
where j.jobname = 'data-minimization-cleanup'
order by d.start_time desc
limit 20;
