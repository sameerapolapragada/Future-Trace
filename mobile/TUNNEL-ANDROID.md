# Fix "Failed to download remote update" — Android + Expo Go SDK 54

This error means **Expo Go cannot reach Metro on your Mac**. Your app code is fine.

## Best fix: USB (no Wi‑Fi, no tunnel)

1. Enable **USB debugging** on the phone (Developer options).
2. Plug phone into Mac, tap **Allow** on the debugging prompt.
3. Run:

```bash
cd mobile
npm run start:android
```

4. Force-quit **Expo Go**, reopen.
5. **Enter URL manually** → `exp://127.0.0.1:8081`

Keep the USB cable connected while you develop.

---

## Option B: Tunnel (any network)

Expo’s `npx expo start --tunnel` is broken for many people. Use our script instead.

### With free ngrok token (recommended)

1. https://dashboard.ngrok.com/signup  
2. Copy authtoken → add to `mobile/.env`:
   ```
   NGROK_AUTHTOKEN=your_token
   ```
3. ```bash
   npm run start:tunnel
   ```
4. Paste the printed `exp://…` URL into Expo Go (not an old URL).

### Without ngrok

```bash
npm run start:tunnel
```

Uses cloudflared or localtunnel. If it still fails, use **USB** (`npm run start:android`) or get a free ngrok token.

---

## Option C: Same Wi‑Fi (LAN)

```bash
npm run start:phone
```

- Phone and Mac on **same Wi‑Fi**, VPN **off**
- URL must be `exp://192.168.x.x:8081` (not `127.0.0.1`)
- Test in phone browser: `http://192.168.x.x:8081` — must load before Expo Go will work

---

## Checklist every time

- [ ] Force-quit Expo Go before connecting
- [ ] Use a **fresh** URL from the terminal (don’t reuse old QR)
- [ ] Wait until Metro says bundling finished
- [ ] Expo Go from Play Store, **SDK 54**
