#!/usr/bin/env node
/**
 * Android + USB — most reliable way to fix "Failed to download remote update".
 * Phone loads Metro via USB (no Wi‑Fi / tunnel needed).
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveAdbPath, runAdb } from './resolve-adb.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')
await import('./reset-dev-server.mjs')

const adbPath = resolveAdbPath()
if (!adbPath) {
  console.error('adb not found — check ~/Library/Android/sdk/platform-tools')
  process.exit(1)
}

const adb = runAdb(['reverse', 'tcp:8081', 'tcp:8081'])
if (adb.status !== 0) {
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  adb failed — connect Android with USB debugging ON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Phone: Settings → Developer options → USB debugging ON
  2. Plug in USB, accept "Allow USB debugging"
  3. Run: ${adbPath} devices   (must list your phone)

  ${adb.stderr?.trim() || adb.stdout?.trim() || ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
  process.exit(1)
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Android USB (Expo Go SDK 54)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  adb reverse is active.

  1. Force-quit Expo Go
  2. Wait for Metro below, then in Expo Go → Enter URL manually:

     exp://127.0.0.1:8081

  Or scan the QR (must show 127.0.0.1, not 192.168.x.x)

  Keep USB plugged in while developing.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn(
  'npx',
  ['expo', 'start', '--localhost', '-c'],
  {
    cwd: root,
    env: {
      ...process.env,
      REACT_NATIVE_PACKAGER_HOSTNAME: '127.0.0.1',
      RCT_METRO_PORT: '8081',
    },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
)

child.on('exit', (code) => process.exit(code ?? 0))
