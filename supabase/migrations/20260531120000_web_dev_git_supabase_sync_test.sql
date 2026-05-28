-- Git → Supabase sync test (Web-Dev branch)
-- Verify after push:
--   select * from public.app_metadata where key = 'web_dev_git_sync_test';

insert into public.app_metadata (key, value, updated_at)
values (
  'web_dev_git_sync_test',
  'applied-via-github-web-dev-' || to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  now()
)
on conflict (key) do update
  set
    value = excluded.value,
    updated_at = excluded.updated_at;
