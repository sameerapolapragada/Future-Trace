-- Run once on Web-Dev Supabase branch (SQL Editor) after pushing git rename to 20260531000000.
-- Aligns schema_migrations.version with the 14-digit filename Supabase Git expects.

update supabase_migrations.schema_migrations
set version = '20260531000000'
where version = '20260531';

-- Verify (should show 20260531000000, not 20260531):
-- select version, name from supabase_migrations.schema_migrations where name = 'add_is_premium_to_profiles';
