# Migration sync troubleshooting (Git → Supabase)

## Symptom

- **GitHub check:** `Supabase Preview` → `Remote migration versions not found in local migrations directory.`
- **Dashboard:** No new migrations / tables from `Web-Dev` pushes.

## Cause

Supabase compares **remote** `supabase_migrations.schema_migrations` to **files** in `supabase/migrations/`.  
Every version already applied on the branch database must have a matching file in git.  
If the branch was created from another line of work (e.g. `Dev`) or SQL was run in the dashboard, remote history can be **ahead of** what `Web-Dev` has in git.

## Fix A — Align git with remote (recommended)

1. Open the **Web-Dev** Supabase branch project (GitHub check → “Details” link).
2. **SQL Editor** → run:

```sql
select version, name
from supabase_migrations.schema_migrations
order by version;
```

3. For each `version` **missing** from `supabase/migrations/` in this repo, either:
   - **Copy** the real `.sql` from `Dev` / history into `supabase/migrations/<version>_*.sql`, or
   - Add a **no-op stub** (only if that migration is already applied and you have no file):

```sql
-- migration already applied on remote; stub keeps Git in sync
select 1;
```

4. Commit, push `Web-Dev`, re-check **Supabase Preview**.

Current files in git (baseline):

- `20260528120000_initial_schema.sql`
- `20260528120100_seed_plans.sql`
- `20260528130000_add_plans_description.sql`
- `20260528140000_pipeline_test_marker.sql`
- `20260530120000_gdpr_ccpa_compliance_data_layer.sql`

Any **extra** row from the query above must get a matching file.

## Fix B — Fresh branch (empty history)

Create a new **persistent** Supabase branch for `Web-Dev` only, link it in **Branches → Git**, and push.  
Only the five migrations above run (no drift from `Dev`).

## Fix C — Manual apply (bypass Git check)

Paste `migrations/20260530120000_gdpr_ccpa_compliance_data_layer.sql` into **SQL Editor** on the target branch.  
Git integration still fails until Fix A is done.

## Required repo files

- `supabase/config.toml` — must exist (branch `project_id`).
- `supabase/migrations/*.sql` — complete history matching remote.

## One-way rule

Schema changes only via new files in `supabase/migrations/` → commit → push.  
Do not rely on dashboard DDL without a matching migration file.
