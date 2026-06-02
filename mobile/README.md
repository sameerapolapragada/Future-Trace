# Future Trace — Mobile (iOS & Android)

Expo app on the **`Dev`** git branch. Uses the **same Supabase project and schema** as the web app.

## Setup

```bash
cd mobile
cp .env.example .env
npm install
```

## Run on a **physical phone** (fixes “Failed to download remote update”)

That error means Expo Go on your phone could not reach the JS bundle on your Mac—not Supabase or git.

```bash
cd mobile
npm run start:phone
```

1. Wait until the terminal shows a **QR code** and a `exp://…` URL (tunnel, not `127.0.0.1`).
2. On your phone: **force-quit Expo Go** → open again (or clear Expo Go storage).
3. Scan the **new** QR from this terminal only (do not reuse an old link).
4. Ensure **Expo Go supports SDK 54** ([expo.dev/go](https://expo.dev/go)).

If tunnel is slow or fails, try same Wi‑Fi + LAN:

```bash
npm run start:reset
npm run start:clear
```

Use the QR that shows your Mac’s **LAN IP** (e.g. `exp://192.168.x.x:8081`), not `127.0.0.1`.

## Run on **simulator** (easiest)

```bash
cd mobile
npm run start:clear
# Press i (iOS Simulator) or a (Android Emulator)
```

## Navigation

Gold-gradient **drawer** (matches web):

- Home  
- AI Evolution Timeline  
- Industry Adoption Waves  
- Jobs Affected by AI Evolution  
- What Comes Next  

## Branch policy

Commit mobile changes to **`Dev` only** — not `Web-Dev`.

## Supabase

Same keys as web: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/.env`.
