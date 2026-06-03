#!/usr/bin/env node
/** Dev build + USB — bypasses Wi‑Fi (failed to connect 192.168.x.x:8081). */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveAdbPath, runAdb } from './resolve-adb.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

const adbPath = resolveAdbPath()
if (!adbPath) {
  console.error(`
Could not find adb. Android SDK platform-tools should include it, e.g.:
  ~/Library/Android/sdk/platform-tools/adb

Add to ~/.zshrc (optional):
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools
`)
  process.exit(1)
}

const adb = runAdb(['reverse', 'tcp:8081', 'tcp:8081'])
if (adb.status !== 0) {
  console.error(`
Could not run adb reverse. Plug in your phone with USB debugging ON, then retry.

  ${adbPath} devices          ← phone must appear

Or fix Wi‑Fi and use: npm run start:dev
`)
  process.exit(1)
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dev build + USB (recommended when Wi‑Fi fails)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  adb reverse active. Keep USB plugged in.

  1. Run this script (already running Metro below)
  2. Open the Future Trace DEV app on your phone
  3. Do NOT scan a 192.168.x.x QR — use localhost instead:
     • Shake phone → Dev menu → change bundler URL to:
       http://localhost:8081
     • Or press "a" in this terminal if device is listed

  If it still fails, force-quit the dev app and reopen.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn('npx', ['expo', 'start', '--dev-client', '--localhost'], {
  cwd: root,
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: 'localhost',
    RCT_METRO_PORT: '8081',
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code) => process.exit(code ?? 0))
