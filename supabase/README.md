# Supabase — Dev branch workflow

Schema lives in `supabase/migrations/`. **Do not run against production** until you promote the Supabase branch.

## GitHub ↔ Supabase dev branch

You linked:

- **GitHub:** `Dev` branch  
- **Supabase:** `dev` preview branch  

When you **push migrations to GitHub `Dev`**, Supabase applies them to the **dev database only**. Production (`main`) stays unchanged until you merge/promote in the Supabase dashboard.

## What’s in the migrations

| File | Purpose |
|------|---------|
| `20260528120000_initial_schema.sql` | Tables, enums, RLS, auth profile trigger |
| `20260528120100_seed_plans.sql` | Free/Pro plans + timeline metadata key |

Milestone/industry/score **content** seed from `mobile/data/*.ts` is a separate step (script or future migration).

## Apply to dev (pick one)

### A) GitHub (recommended — matches your setup)

```bash
git checkout Dev
git add supabase/
git commit -m "Add Supabase schema migrations for dev branch"
git push origin Dev
```

Then in [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Branches** → `dev` → confirm migration ran (or check deployment logs).

### B) Supabase CLI (local push to linked dev branch)

```bash
brew install supabase/tap/supabase   # if needed
cd /Users/sammy/Future-Trace
supabase login
supabase link --project-ref <DEV_BRANCH_PROJECT_REF>   # from Branches → dev → Settings
supabase db push
```

Use the **dev branch project ref**, not production. Find it under **Project → Branches → dev**.

## Verify tables on dev

In Supabase SQL editor (dev branch selected):

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

You should see `milestones`, `user_profiles`, `exposure_scores`, `plans`, etc.

## Mobile app

`mobile/.env` should use the **dev branch** API URL and anon key while developing on `Dev`:

- Dashboard → **Branches** → `dev` → **Settings** → **API**

Production keys stay on `main` / production branch only.

## Promote to production (later)

When schema is tested on dev:

1. Merge `Dev` → `main` on GitHub (if production branch is linked to `main`), **or**
2. Use Supabase **Promote branch** / merge in dashboard  

Never run `supabase db push` against production without reviewing migrations first.
