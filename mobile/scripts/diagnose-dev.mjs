#!/usr/bin/env node
/** Diagnose why the dev build cannot reach Metro. */
import { spawnSync } from 'node:child_process'
import { getLanIp } from './get-lan-ip.mjs'
import { resolveAdbPath, runAdb } from './resolve-adb.mjs'

const lanIp = getLanIp()
const port = 8081

console.log('\nFuture Trace — dev connection check\n')

if (!lanIp) {
  console.log('✗ No LAN IP. Connect Mac to Wi‑Fi.\n')
  process.exit(1)
}

console.log(`Mac LAN IP:  ${lanIp}`)
console.log(`Metro port:  ${port}\n`)

for (const [label, url] of [
  ['localhost', `http://127.0.0.1:${port}/status`],
  ['LAN', `http://${lanIp}:${port}/status`],
]) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    console.log(`${res.ok ? '✓' : '✗'} Metro ${label}: ${res.status}`)
  } catch (e) {
    console.log(`✗ Metro ${label}: ${e.message}`)
  }
}

const fw = spawnSync('/usr/libexec/ApplicationFirewall/socketfilterfw', ['--getglobalstate'], {
  encoding: 'utf8',
})
console.log(fw.stdout?.includes('enabled') ? '\n⚠ Mac firewall ON' : '\n✓ Mac firewall off')

const adbPath = resolveAdbPath()
if (adbPath) {
  const adb = runAdb(['devices'])
  const n = adb.stdout.trim().split('\n').slice(1).filter((l) => l.includes('device')).length
  console.log(n ? `✓ adb: ${n} device(s) (${adbPath})` : `○ adb ready — plug in USB (${adbPath})`)
} else {
  console.log('○ adb not found — check Android SDK platform-tools')
}

console.log(`
Phone cannot open http://${lanIp}:${port}?
→ Your router blocks device-to-device traffic (AP isolation).
→ Same Wi‑Fi name is not enough on many home/guest networks.

Fixes (pick one):
  1. npm run start:dev:usb      USB cable + adb reverse
  2. Phone hotspot              Mac joins phone hotspot, then npm run start:dev
  3. npm run start:dev:tunnel     Works on cellular / any network
`)
