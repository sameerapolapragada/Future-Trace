# Shared Supabase schema (web + mobile)

Web and mobile use **one Supabase dev branch / database**. Git branches are separate; the schema is not.

## Git branches vs Supabase

| Git branch | App code | Supabase |
|------------|----------|----------|
| **Web-Dev** (or your web branch) | Next.js web app | Same **dev** branch |
| **Dev** (mobile branch) | Expo mobile app | Same **dev** branch |

**Rule:** `supabase/migrations/` is the single source of truth for schema. When either branch adds a migration:

1. Merge or cherry-pick the migration into the other git branch before release.
2. Push to GitHub so Supabase applies it on the linked **dev** branch (or run SQL manually once).

Both apps read/write the same tables (`profiles`, `user_resume_scans`, `ai_scan_history`, etc.).

## Environment variables (same project, different prefixes)

Copy keys from **Supabase Dashboard → Branches → dev → Settings → API**.

### Web — `.env.local` (repo root)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<dev-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<dev-service-role>   # server only
GEMINI_API_KEY=<key>                           # matcher + roadmap APIs
```

### Mobile — `mobile/.env`

```bash
EXPO_PUBLIC_SUPABASE_URL=<same URL as web>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<same anon key as web>
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3000   # device → Next.js APIs
```

| Platform | API URL hint |
|----------|----------------|
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Physical phone | `http://192.168.x.x:3000` or ngrok tunnel |

Run Next.js from repo root: `npm run dev`.

## Auth (shared users)

- **Web:** Supabase Auth via cookies (`@supabase/ssr`).
- **Mobile:** Supabase Auth via `AsyncStorage` session (`mobile/lib/supabase.ts`).
- Same email/password works on both apps.
- Sign-up metadata uses `full_name` (web + mobile) → `profiles` row via DB trigger.

### Mobile password reset (one-time Supabase setup)

In **Supabase → Authentication → URL Configuration**, add:

```text
futuretrace://reset-password
```

Also add your site URL for web reset flows if not already set.

## Mobile features using shared DB

| Feature | How it syncs |
|---------|----------------|
| Sign in / sign up | Supabase Auth (same `auth.users`) |
| Profile name / role | `profiles` table (same as web dashboard) |
| Career Shield history | `user_resume_scans` via `/api/mobile/matcher` + `/api/mobile/scans` |
| Notification prefs (mobile) | Local device storage only (not in DB yet) |

## Test without Gemini API costs

Add to `.env.local` (repo root):

```bash
ENABLE_MOCK_AI=true
```

When enabled, `/api/mobile/matcher`:

- Waits **1.5s** (simulated network latency for loading UI tests)
- Returns schema-valid mock JSON (no Gemini charges)
- Runs the **same** auth, `user_resume_scans` insert, and optional `token_balance` decrement as production
- Response shape is identical to live Gemini — mobile cannot tell the difference

Target role **AI Risk Manager** returns a low **18%** risk score with governance-focused pivot roles.

Optional request body flag: `"use_one_time_token": true` consumes one `profiles.token_balance` credit (non-premium users).

When ready for live scoring: set `ENABLE_MOCK_AI=false` (or remove it), add `GEMINI_API_KEY`, restart Next.js.

## Day-to-day workflow

### Web developer (Web-Dev branch)

```bash
git checkout Web-Dev
# edit app/, run npm run dev with .env.local
git add app/ components/ ...
git commit -m "..."
git push origin Web-Dev
```

### Mobile developer (Dev branch)

```bash
git checkout Dev
# edit mobile/, run npm run start:dev with mobile/.env
git add mobile/ ...
git commit -m "..."
git push origin Dev
```

### Schema change (either branch)

```bash
# add supabase/migrations/YYYYMMDDHHMMSS_description.sql
git add supabase/migrations/
git commit -m "Add ..."
git push
# merge migration file into the other git branch when ready
```

Verify on **dev** branch in Supabase SQL editor or **Branches → dev → Migrations**.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Mobile “Supabase is not configured” | Create `mobile/.env` from `mobile/.env.example` with dev keys |
| Mobile history empty after scan | Sign in with Supabase; ensure `user_resume_scans` migration ran on dev |
| Mobile cannot reach matcher API | Set `EXPO_PUBLIC_API_URL` to reachable host; run `npm run dev` at repo root |
| Profile save fails on mobile | Confirm `profiles` table exists on dev (web schema applied) |
| GitHub “not associated with Supabase Branch” | Link GitHub `Dev` to Supabase `dev` in Dashboard → Integrations (see `supabase/README.md`) |
