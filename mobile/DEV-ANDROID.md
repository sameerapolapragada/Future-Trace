# Install Future Trace on your Android phone (no Expo Go)

Use a **development build** — your own app icon on the home screen, with **fast refresh** while you code.

## One-time setup (~15–20 min)

### 1. Install tools on your Mac

```bash
npm install -g eas-cli
```

Create a free account: https://expo.dev/signup

```bash
cd mobile
npm install
eas login
eas init
```

`eas init` links the project and adds your `projectId` to **app.json** (static config — EAS cannot edit `app.config.js` automatically).

### 2. Build an APK in the cloud (recommended)

```bash
cd mobile
eas build --profile development --platform android
```

- Wait for the build on expo.dev (about 10–20 minutes).
- When it finishes, open the build page and **download the APK** (or scan the install QR on your phone).

### 3. Install on your phone

- Allow **Install from unknown sources** for the browser/files app you use.
- Open the APK and install **Future Trace** (dev).
- You only do this **once** (reinstall when native dependencies change).

---

## Daily workflow (after the APK is installed)

### Option A — USB (most reliable)

Phone plugged in, USB debugging on:

```bash
cd mobile
npm run start:dev:usb
```

Open the **Future Trace** dev app on your phone. Keep USB connected.

If it asks for a URL, use `http://localhost:8081` (not `192.168.x.x`).

### Option B — Same Wi‑Fi

```bash
cd mobile
npm run start:dev
```

Open the dev app. Phone and Mac must be on the **same Wi‑Fi** (no guest network).

If you see **failed to connect 192.168.x.x:8081**, your router blocks device-to-device traffic (AP isolation). Same Wi‑Fi name is not enough on many home/guest networks.

**Quick test:** On your phone's browser, open `http://YOUR_MAC_IP:8081`. If it doesn't load, Wi‑Fi LAN won't work — pick one of the options below.

### Option C — Phone hotspot (no USB cable)

1. Turn on **Mobile hotspot** on your Android phone.
2. On your Mac, join that hotspot (not your home Wi‑Fi).
3. Run `npm run start:dev` and note the new IP in the terminal.
4. Test `http://NEW_IP:8081` in the phone browser — it should load.
5. Open the Future Trace dev app.

### Option D — Tunnel (works on any network)

Add a free ngrok token to `mobile/.env`:

```
NGROK_AUTHTOKEN=your_token
```

Get one at https://dashboard.ngrok.com/get-started/your-authtoken

```bash
cd mobile
npm run start:dev:tunnel
```

Open the dev app and use the `exp://…` URL from the terminal (not `192.168.x.x`).

Run `npm run diagnose:dev` anytime to check Metro, firewall, and adb.

---

## Alternative: build on your Mac (USB + Android Studio)

If you have Android Studio and USB debugging:

```bash
cd mobile
npm run run:android
```

Installs directly to the plugged-in phone. First run takes longer (downloads SDK components).

---

## When to rebuild the APK

Rebuild (`eas build ...`) only when you:

- Add a new native library (camera, notifications, etc.)
- Change `app.json` / native plugins
- Upgrade Expo SDK

For UI/logo/screen changes in React — **no rebuild**; just `npm run start:dev`.

---

## vs Expo Go

| | Expo Go | Dev build (this guide) |
|--|---------|-------------------------|
| Install | Play Store | One APK from EAS |
| Your app icon | No | Yes |
| Network issues | Common | Rare |
| Native modules | Limited | Full project |
