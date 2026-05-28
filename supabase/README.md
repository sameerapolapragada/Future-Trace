# Supabase schema workflow (Git → Supabase only)

This project treats **Git as the single source of truth** for database schema. Changes flow in **one direction only**.

```text
  supabase/migrations/*.sql  →  git commit  →  git push  →  Supabase applies migrations
```

## What we do

1. Author every schema change as a new file under `supabase/migrations/`.
2. Commit and push to the linked Git branch (`Web-Dev` → Supabase branch).
3. Let Supabase GitHub integration (or `supabase db push`) apply migrations to the database.

## What we do not do

- **Do not** edit tables/policies only in the Supabase Dashboard and expect Git to stay in sync (dashboard changes are not written back to this repo).
- **Do not** run `supabase db pull` to overwrite migration history unless you are deliberately capturing a one-time baseline and reviewing the diff.
- **Do not** apply ad-hoc SQL in production without a matching migration file in git.

## Supabase Dashboard linking

In **Project → Branches → Git**, link branch **`Web-Dev`** to this repo. On push, Supabase runs **new** migration files only. It does not commit database state back to GitHub.

## Local apply (optional)

If Git integration is skipped, you may run migrations manually (still Git-owned SQL, pasted or pushed):

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```

That pushes **from your local migration files to Supabase**, not the reverse.

## Compliance migration

See `migrations/20260530120000_gdpr_ccpa_compliance_data_layer.sql` and `docs/COMPLIANCE.md`.

## Migrations not showing in Supabase?

If pushes do not apply schema, read **`docs/MIGRATION_SYNC.md`**.  
Typical error: `Remote migration versions not found in local migrations directory` — run the SQL there to list remote versions and add missing files to git.
