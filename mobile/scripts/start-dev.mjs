#!/usr/bin/env node
/** Dev build on same Wi‑Fi — sets LAN hostname for Metro. */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getLanIp } from './get-lan-ip.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

const lanIp = getLanIp()
if (!lanIp) {
  console.error('\nNo LAN IP. Use: npm run start:dev:usb\n')
  process.exit(1)
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dev build — Metro on ${lanIp}:8081
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phone + Mac on SAME Wi‑Fi. VPN off.

  Open the Future Trace DEV app (not Expo Go).

  If you see "failed to connect ${lanIp}:8081":
  → Wi‑Fi cannot reach your Mac. Use USB instead:

     npm run start:dev:usb

  Test on phone browser: http://${lanIp}:8081
  (must load before the dev app will connect)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn('npx', ['expo', 'start', '--dev-client', '--lan'], {
  cwd: root,
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
    RCT_METRO_PORT: '8081',
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code) => process.exit(code ?? 0))
