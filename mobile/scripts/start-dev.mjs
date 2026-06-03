#!/usr/bin/env node
/** Dev build on same Wi‑Fi — sets LAN hostname for Metro. */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getLanIp } from './get-lan-ip.mjs'
import { freeMetroPorts, METRO_PORT } from './free-metro-ports.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

freeMetroPorts()

const lanIp = getLanIp()
if (!lanIp) {
  console.error('\nNo LAN IP. Use: npm run start:dev:usb\n')
  process.exit(1)
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dev build — Metro on ${lanIp}:${METRO_PORT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phone + Mac on SAME Wi‑Fi. VPN off.

  Open the Future Trace DEV app (not Expo Go).

  If you see "failed to connect ${lanIp}:${METRO_PORT}":
  → Wi‑Fi cannot reach your Mac. Use USB instead:

     npm run start:dev:usb

  Test on phone browser: http://${lanIp}:${METRO_PORT}
  API health check: http://${lanIp}:3000/api/health-check
  (both must load before the dev app will connect)
  QR code must show port ${METRO_PORT} — not 8082.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn(
  'npx',
  ['expo', 'start', '--dev-client', '--lan', '--port', String(METRO_PORT)],
  {
  cwd: root,
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
    RCT_METRO_PORT: String(METRO_PORT),
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
  }
)

child.on('exit', (code) => process.exit(code ?? 0))
