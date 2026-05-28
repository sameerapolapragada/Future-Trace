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

Schedule daily (after enabling **pg_cron**):

```sql
select cron.schedule(
  'cleanup-old-free-scans',
  '0 3 * * *',
  $$select public.cleanup_old_free_scans();$$
);
```

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
