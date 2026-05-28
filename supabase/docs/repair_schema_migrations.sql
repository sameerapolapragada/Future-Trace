-- =============================================================================
-- Fix: "Remote migration versions not found in local migrations directory"
-- Run on your **Web-Dev** Supabase branch (SQL Editor).
-- =============================================================================

-- STEP 1 — See what Supabase thinks is applied
select version, name, inserted_at
from supabase_migrations.schema_migrations
order by version;

-- STEP 2 — Rows that do NOT match a file in git (expected 14-digit prefixes):
--   20260528120000, 20260528120100, 20260528130000, 20260528140000,
--   20260529120000, 20260529130000, 20260530120000
select s.version, s.name
from supabase_migrations.schema_migrations s
where s.version !~ '^[0-9]{14}$'
   or s.version not in (
     '20260528120000',
     '20260528120100',
     '20260528130000',
     '20260528140000',
     '20260529120000',
     '20260529130000',
     '20260530120000'
   );

-- STEP 3 — Polluted duplicates (legacy format: version = '20260528120000_initial_schema')
-- If STEP 2 returns rows, either add a matching .sql stub in git OR remove orphan rows (dev only):
--
-- Example: remove ONE orphan version (replace with value from STEP 2):
-- delete from supabase_migrations.schema_migrations where version = 'PASTE_VERSION_HERE';
--
-- Example: remove polluted long-form versions when a 14-digit row also exists:
-- delete from supabase_migrations.schema_migrations
-- where version ~ '^[0-9]{14}_';

-- STEP 4 — After git has a file for every remaining version, push Web-Dev again.
-- New migration 20260530120000 will apply only if not already in the table.
