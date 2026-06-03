#!/usr/bin/env node
/**
 * Start Metro for a physical device on the same Wi‑Fi.
 * Forces bundle URLs to use the Mac’s LAN IP (not 127.0.0.1).
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getLanIp } from './get-lan-ip.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const lanIp = getLanIp()
if (!lanIp) {
  console.error(
    '\nCould not detect a LAN IP. Use the iOS/Android simulator, or connect this Mac to Wi‑Fi.\n',
  )
  process.exit(1)
}

await import('./ensure-logo.mjs')

const expUrl = `exp://${lanIp}:8081`

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
  RCT_METRO_PORT: '8081',
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Physical device — Expo Go SDK 54
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phone + Mac on the SAME Wi‑Fi. VPN off on both.

  QR must show: ${expUrl}
  NOT 127.0.0.1 and NOT an old exp.direct tunnel URL.

  Logo missing? Run: npm run verify:logo  (do NOT delete assets/)

  If you see "Failed to download remote update":
  1. Force-quit Expo Go (swipe away completely)
  2. Safari on phone → http://${lanIp}:8081
     → If this fails, fix Wi‑Fi/firewall first (not the app)
  3. Expo Go → "Enter URL manually" → paste:
     ${expUrl}
  4. In another terminal: npm run check:connection

  Android USB: adb reverse tcp:8081 tcp:8081 && npm run start:localhost
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn('npx', ['expo', 'start', '--lan'], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code) => process.exit(code ?? 0))
