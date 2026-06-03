#!/usr/bin/env node
import os from 'node:os'

/** Prefer Wi‑Fi / Ethernet IPv4 on a private LAN (same network as a physical phone). */
export function getLanIp() {
  const nets = os.networkInterfaces()
  const candidates = []

  for (const name of Object.keys(nets)) {
    if (/^lo/i.test(name)) continue
    for (const net of nets[name] ?? []) {
      if (net.family !== 'IPv4' || net.internal) continue
      const { address } = net
      if (
        address.startsWith('192.168.') ||
        address.startsWith('10.') ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(address)
      ) {
        candidates.push({ name, address })
      }
    }
  }

  const preferred = ['en0', 'en1', 'wlan0', 'eth0']
  for (const iface of preferred) {
    const hit = candidates.find((c) => c.name === iface)
    if (hit) return hit.address
  }

  return candidates[0]?.address ?? null
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ip = getLanIp()
  if (!ip) {
    console.error('No LAN IPv4 found. Connect to Wi‑Fi or use a simulator / USB (see README).')
    process.exit(1)
  }
  console.log(ip)
}
