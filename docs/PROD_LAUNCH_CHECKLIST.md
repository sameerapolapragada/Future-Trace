# Production launch checklist

Use this before pointing real users at the live web app. Replace `yourdomain.com` with your production domain (e.g. `future-trace.com`).

---

## Supabase Dashboard (Production project / branch)

### Authentication → URL configuration

Add **Redirect URLs** (allow list):

| URL | Purpose |
|-----|---------|
| `https://yourdomain.com/auth/callback` | OAuth / PKCE callback (required if you enable Google, GitHub, etc.) |
| `https://yourdomain.com/auth/reset-password` | Password reset emails |
| `http://localhost:3000/auth/callback` | Local OAuth testing |
| `http://localhost:3000/auth/reset-password` | Local password reset testing |

Set **Site URL**:

```
https://yourdomain.com
```

### Authentication → Providers → Email

**Confirm email** — choose one launch strategy:

| Setting | When to use |
|---------|-------------|
| **OFF** | Frictionless sign-up; users reach `/dashboard` immediately after register (good for early beta) |
| **ON** | High-trust / compliance-heavy launch; users must click inbox link before first sign-in |

Ensure the in-app sign-up copy matches this setting (`/auth` success message).

### Authentication → Providers

- [ ] Email provider **enabled**
- [ ] (Optional) Social providers enabled only after `/auth/callback` route exists in the app

### Branches & database

- [ ] Production Supabase branch linked to Git **`main`** (or your release branch)
- [ ] All migrations in `supabase/migrations/` applied on production
- [ ] Spot-check tables: `profiles`, `ai_scan_history`, `compliance_logs`
- [ ] Trigger `on_auth_user_created` → `handle_new_user_signup()` exists

### Security

- [ ] RLS **enabled + forced** on `profiles`, `ai_scan_history`, `compliance_logs`
- [ ] **Never** put `service_role` or OpenAI keys in client env vars
- [ ] Only **anon / publishable** key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Hosting (e.g. Vercel)

- [ ] Deploy from release branch (`main` or production line)
- [ ] Environment variables set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Custom domain + HTTPS live
- [ ] `npm run build` passes on CI

---

## Application smoke test (production URL)

- [ ] Sign up → `profiles` row created
- [ ] Sign in → `/dashboard` loads profile tab
- [ ] Edit full name / role → saves to `profiles`
- [ ] Sign out → `/auth`; signed-in visit to `/auth` redirects to `/dashboard`
- [ ] Forgot password → email → `/auth/reset-password` → `/dashboard`
- [ ] PWA install prompt (optional) on HTTPS

---

## Legal & compliance (if storing emails + resume text)

- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] (Optional) Schedule `cleanup_old_free_scans()` via pg_cron on production

---

## Supabase client architecture (repo)

The app uses split SSR clients only:

| Context | Import |
|---------|--------|
| Client Components | `@/utils/supabase/client` |
| Server Components / RSC helpers | `@/utils/supabase/server` |
| Profile loader | `@/utils/supabase/getProfile` |

Legacy `lib/supabase.ts` has been removed — do not reintroduce a singleton browser client at the repo root.
