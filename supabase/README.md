# Supabase — GitHub Dev → Supabase dev (automated flow)

Target workflow:

```text
Cursor edits supabase/migrations → commit → push GitHub Dev → Supabase runs migrations on dev branch only
```

Production (`main`) stays separate until you promote or enable production deploy.

---

## One-time setup (Dashboard)

### 1. Enable GitHub integration

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project  
2. **Project Settings** → **Integrations** → **GitHub**  
3. **Authorize GitHub** → choose repo: `sameerapolapragada/Future-Trace` (or your fork)  
4. **Working directory:** `.`  
   - Use `.` because `supabase/` is at the repo root  
5. Recommended options:

| Option | Setting | Why |
|--------|---------|-----|
| **Automatic branching** | ON | GitHub `Dev` ↔ Supabase `dev` |
| **Supabase changes only** | ON (optional) | Only deploy when `supabase/**` changes |
| **Production branch** | `main` | Not `Dev` |
| **Deploy to production** | OFF until ready | Prevents accidental prod migrations |

6. **Enable integration**

### 2. Confirm branch pairing

1. **Branches** in the dashboard  
2. You should see **`dev`** linked to GitHub branch **`Dev`**  
3. If `dev` is missing: push any commit to GitHub `Dev` with `supabase/` present, or create the branch in GitHub first  

Branch names can differ in case (`Dev` vs `dev`); Supabase maps Git branches to preview branches. Check the branch list after the first push.

### 3. GitHub required check (recommended)

1. GitHub repo → **Settings** → **Branches** → branch protection for `Dev` (optional) or `main`  
2. **Require status checks** → add the Supabase check (e.g. **Supabase Preview** / **Supabase Branch**)  
3. Stops merging broken migrations  

### 4. Mobile env for dev

While on GitHub `Dev`, point the app at the **dev** Supabase branch API keys:

- Dashboard → **Branches** → **dev** → **Settings** → **API**  
- Put URL + anon key in `mobile/.env`  

---

## Day-to-day flow (Cursor → Git → Supabase)

### When you change the database

1. Edit or add files under `supabase/migrations/`  
   - New file name: `YYYYMMDDHHMMSS_description.sql` (unique timestamp)  
2. Commit on **`Dev`**:

```bash
cd /Users/sammy/Future-Trace
git checkout Dev
git add supabase/
git commit -m "Describe schema change"
git push origin Dev
```

3. Watch deployment:
   - **GitHub:** commit page → Supabase status check  
   - **Supabase:** **Branches** → **dev** → logs / migrations  

4. Verify on **dev** (not production):

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;
```

### When you only change app code (`mobile/`, no SQL)

Push to `Dev` as usual. Supabase may skip deploy if **Supabase changes only** is ON — that is expected.

---

## CLI (optional)

Global `supabase` is not required. Use:

```bash
npx supabase login
npx supabase link --project-ref <DEV_BRANCH_PROJECT_REF>
npx supabase db push
```

Use only for debugging. Prefer **git push** once GitHub integration works.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Git “up to date” but no tables | Git does not run SQL. Check **dev** branch in dashboard; run migrations manually once, or fix integration logs |
| Tables on wrong environment | Branch switcher → select **dev** |
| No Supabase check on GitHub push | Re-enable integration; confirm `supabase/migrations/` changed |
| Migration failed in logs | Open log details; fix SQL; push a new migration (do not edit old migration files that already ran) |
| Check stuck / never finishes | [Branching troubleshooting](https://supabase.com/docs/guides/deployment/branching/troubleshooting) — recreate preview branch or contact support |

### First deploy already done manually?

If you ran SQL by hand in the editor, hosted migration history may be out of sync. Options:

- Mark migrations applied: `npx supabase migration repair --status applied` (linked to dev), or  
- Reset **dev** branch in dashboard and push again (destroys dev data)  

---

## Production (later)

1. Test on **dev**  
2. Merge `Dev` → `main` on GitHub  
3. Enable **Deploy to production** only when ready, or **Promote branch** in Supabase  

---

## What’s in this repo

| File | Purpose |
|------|---------|
| `migrations/20260528120000_initial_schema.sql` | Tables, RLS, auth trigger |
| `migrations/20260528120100_seed_plans.sql` | Plans + metadata |
| `config.toml` | CLI / branching config |

Content seed (milestones from `mobile/data`) is a follow-up migration or `seed.sql`.
