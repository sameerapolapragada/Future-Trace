# Future Trace — Mobile (iOS & Android)

Expo app on the **`Dev`** git branch. Uses the **same Supabase project and schema** as the web app.

## Setup

```bash
cd mobile
cp .env.example .env
# EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (same as web)
npm install
npx expo start
```

- Press **i** — iOS Simulator  
- Press **a** — Android Emulator  

### "Failed to download remote update" on a phone

Expo Go could not reach your dev server (not a Supabase/git issue). Try in order:

1. **Run from `mobile/` only** — `cd mobile` before `npx expo start` (not the repo root).
2. **Clear cache** — `npx expo start -c`
3. **Tunnel mode** (different Wi‑Fi / firewall) — `npx expo start --tunnel`
4. **Same network** — phone and Mac on the same Wi‑Fi, or use tunnel.
5. **SDK match** — install [Expo Go](https://expo.dev/go) that supports **SDK 54** (project uses Expo ~54).
6. **Simulator** — `npx expo start` then press **i** or **a** (avoids LAN issues).

If it still fails: temporarily disable VPN/firewall, or reboot your router (some LAN setups block device-to-Mac traffic).

## Navigation

Gold-gradient **drawer** (matches web home panel):

- Home  
- AI Evolution Timeline  
- Industry Adoption Waves  
- Jobs Affected by AI Evolution  
- What Comes Next  

Legacy routes `(auth)` and `(app)` tabs remain in the repo for sign-in and score flows.

## Branch policy

Commit mobile changes to **`Dev` only** — do not merge into `Web-Dev`.

## Supabase

`lib/supabase.ts` is ready for auth and data when you wire real sign-in. Schema migrations live in `/supabase/migrations` at the repo root.
