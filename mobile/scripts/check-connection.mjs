#!/usr/bin/env node
/** Run while Metro is up (npm run start:phone). Diagnose device reachability. */
import { getLanIp } from './get-lan-ip.mjs'

const lanIp = getLanIp()
if (!lanIp) {
  console.error('No LAN IP — connect Mac to Wi‑Fi.')
  process.exit(1)
}

const urls = [
  `http://127.0.0.1:8081/status`,
  `http://${lanIp}:8081/status`,
  `http://${lanIp}:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&minify=false`,
]

console.log(`\nLAN IP: ${lanIp}`)
console.log(`Expo Go manual URL: exp://${lanIp}:8081\n`)

for (const url of urls) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    const size = res.headers.get('content-length') ?? '?'
    console.log(`${res.ok ? 'OK' : 'FAIL'} ${res.status} ${url} (${size} bytes)`)
  } catch (e) {
    console.log(`FAIL ${url}`)
    console.log(`     ${e.message}`)
  }
}

console.log(`
On your phone (same Wi‑Fi, VPN off):
  1. Safari → http://${lanIp}:8081  (must load)
  2. Expo Go → Enter URL manually → exp://${lanIp}:8081
  3. If Safari fails: guest Wi‑Fi / firewall / router isolation
`)
