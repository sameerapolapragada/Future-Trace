# Future Trace — Mobile (iOS & Android)

Expo app on the **`Dev`** git branch. Uses the **same Supabase project and schema** as the web app.

## Setup

```bash
cd mobile
cp .env.example .env
npm install
```

## Run the app

### Simulator (recommended)

```bash
npm run start:clear
# Press i (iOS) or a (Android)
```

### Physical phone (same Wi‑Fi as your Mac)

```bash
npm run start:phone
```

1. Wait for Metro and the **QR code**.
2. Use the URL with your Mac’s **LAN IP** (e.g. `exp://192.168.1.x:8081`) — **not** `127.0.0.1`.
3. Phone and Mac must be on the **same Wi‑Fi**. Turn off VPN if it still fails.
4. Force-quit Expo Go, reopen, scan the **new** QR.

### Tunnel (only if LAN does not work)

```bash
npm run start:tunnel
```

Requires `@expo/ngrok` (installed as a dev dependency). If you see:

`CommandError: TypeError: Cannot read properties of undefined (reading 'body')`

that means **Expo’s ngrok tunnel failed** (service limit, outage, or network block)—not your React code. Use **`npm run start:phone`** (LAN) or the **simulator** instead.

## Common errors

| Message | What it means | Fix |
|--------|----------------|-----|
| `Failed to download remote update` | Phone can’t reach Metro | Same Wi‑Fi + `npm run start:phone`, or simulator |
| `Cannot read properties of undefined (reading 'body')` | `--tunnel` / ngrok failed | Don’t use tunnel; use `start:phone` or simulator |
| Port 8081 in use | Old Metro still running | `npm run start:reset` then start again |

## Navigation

Gold-gradient **drawer** (matches web): Home, AI Evolution Timeline, Industry Adoption Waves, Jobs Affected by AI, What Comes Next.

## Branch policy

Commit mobile changes to **`Dev` only** — not `Web-Dev`.

## Supabase

Same keys as web: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `mobile/.env`.
