# GDPR / CCPA database compliance

## Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Account profile; `id` cascades from `auth.users` deletion |
| `ai_scan_history` | Resume PII + scores; cascades when profile is removed |
| `compliance_logs` | Immutable audit trail (`target_profile_id` kept after user deletion) |

## Migration

Apply:

```bash
supabase db push
```

Or paste `supabase/migrations/20260530120000_gdpr_ccpa_compliance_data_layer.sql` into **SQL Editor**.

## Right to be forgotten

Deleting a user in **Authentication → Users** (or `auth.admin.deleteUser`) removes `auth.users` row → cascades to `profiles` → cascades to `ai_scan_history`. `compliance_logs` rows remain with `target_profile_id` for legal audit.

Log deletion requests from the app:

```sql
select public.log_compliance_event('ACCOUNT_DELETION_REQUESTED');
```

## Data minimization

`cleanup_old_free_scans()` deletes `ai_scan_history` rows older than **30 days** for `is_premium = false`.

Scheduled via **pg_cron** (migration `20260601120000_schedule_data_minimization_cron.sql`):

- Job name: `data-minimization-cleanup`
- Schedule: `0 0 * * *` (midnight **UTC** daily)
- Manual script: `supabase/scripts/schedule_data_minimization_cron.sql`

Verify in SQL Editor:

```sql
select jobid, jobname, schedule, command, active
from cron.job
where jobname = 'data-minimization-cleanup';

select d.status, d.start_time, d.end_time, d.return_message
from cron.job_run_details d
join cron.job j on j.jobid = d.jobid
where j.jobname = 'data-minimization-cleanup'
order by d.start_time desc
limit 20;
```

## Signup trigger verification

Runtime check (service role required in `.env.local`):

```bash
npm run verify:signup-trigger
```

Script: `scripts/verify-signup-trigger.ts` — creates a test user, asserts `profiles` + `ACCOUNT_CREATED` log, deletes the user, confirms profile cascade.

## App signup metadata

Web/mobile sign-up must send:

```ts
options: { data: { full_name: 'Jane Doe' } }
```

Trigger `handle_new_user_signup()` reads `raw_user_meta_data->>'full_name'`.

## RLS summary

- **profiles:** own row SELECT/UPDATE
- **ai_scan_history:** own row SELECT/INSERT only (no client UPDATE/DELETE)
- **compliance_logs:** INSERT only (no client read/update/delete)
