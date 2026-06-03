# Future Trace — Mobile (iOS & Android)

Expo app on the **`Dev`** git branch. Uses the **same Supabase dev branch and schema** as the web app (`Web-Dev` or your web branch).

**Shared setup:** [docs/SHARED_SUPABASE.md](../docs/SHARED_SUPABASE.md)

## Setup

```bash
cd mobile
cp .env.example .env
# Paste the same dev-branch URL + anon key as web .env.local (EXPO_PUBLIC_* prefix)
# Set EXPO_PUBLIC_API_URL so your phone can reach Next.js (npm run dev at repo root)
npm install
```

## Auth

Mobile uses **real Supabase Auth** — the same accounts as the web app. After configuring `mobile/.env`:

1. Sign up / sign in from the app (Shield tab or auth screens).
2. Scan history syncs to `user_resume_scans` when signed in.
3. Add `futuretrace://reset-password` to Supabase Auth redirect URLs for password reset.

## Run on your Android phone (recommended — no Expo Go)

Install your own dev app once, then live-reload while you code:

**[DEV-ANDROID.md](./DEV-ANDROID.md)** — EAS APK + `npm run start:dev`

Quick version:

```bash
cd mobile
eas build --profile development --platform android   # once
npm run start:dev                                   # daily
```

## Run the app (Expo Go — legacy)

### Simulator (recommended)

```bash
npm run start:clear
# Press i (iOS) or a (Android)
```

### Physical phone (same Wi‑Fi as your Mac)

```bash
npm run start:phone
```

The script prints your Mac’s LAN IP and sets `REACT_NATIVE_PACKAGER_HOSTNAME` so Expo Go does **not** try to load the bundle from `127.0.0.1`.

1. Wait for Metro and the **QR code**.
2. Confirm the URL is `exp://192.168.x.x:8081` (your LAN IP) — **not** `127.0.0.1`.
3. On the phone, open **Safari** → `http://<that-same-ip>:8081`. If that fails, Expo Go cannot reach your Mac (guest Wi‑Fi, VPN, firewall, or router client isolation).
4. Phone and Mac on the **same Wi‑Fi**; turn VPN off; force-quit Expo Go, then scan a **fresh** QR.

### Android + USB (when Wi‑Fi blocks the phone)

```bash
adb reverse tcp:8081 tcp:8081
npm run start:localhost
```

Then scan the QR in Expo Go (localhost works over USB reverse).

### Tunnel — Android / any network (LAN failed)

See **[TUNNEL-ANDROID.md](./TUNNEL-ANDROID.md)** for full steps.

```bash
cd mobile
# Add NGROK_AUTHTOKEN to .env (free from ngrok.com) — recommended
npm run start:tunnel
```

In **Expo Go → Enter URL manually**, paste the `exp://…` URL from the terminal.

Do **not** use `npx expo start --tunnel` (shared ngrok breaks with `reading 'body'`).

## Common errors

| Message | What it means | Fix |
|--------|----------------|-----|
| `Failed to download remote update` | Phone can’t reach Metro (wrong/stale URL) | See **Fix remote update** below |

### Fix “Failed to download remote update”

1. From `mobile/`: `npm run start:phone` (not `expo start --tunnel` unless you set `NGROK_AUTHTOKEN`)
2. QR must be `exp://192.168.x.x:8081` — **not** `127.0.0.1` or an old `exp.direct` link
3. **Safari on the phone** → `http://<same-ip>:8081` — if this doesn’t load, fix Wi‑Fi/firewall before Expo Go
4. Force-quit Expo Go → **Enter URL manually** → `exp://<ip>:8081`
5. While Metro runs: `npm run check:connection`
| `Cannot read properties of undefined (reading 'body')` | Expo shared ngrok failed | Add `NGROK_AUTHTOKEN` to `.env` and `npm run start:tunnel`, or use `start:phone` |
| Port 8081 in use | Old Metro still running | `npm run start:reset` then start again |

## Navigation

Gold-gradient **drawer** (matches web): Home, AI Evolution Timeline, Industry Adoption Waves, Jobs Affected by AI, What Comes Next.

## Branch policy

Commit mobile changes to **`Dev` only** — not `Web-Dev`.

## Supabase

Same keys as web: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/.env`.
