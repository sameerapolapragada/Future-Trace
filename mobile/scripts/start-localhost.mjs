#!/usr/bin/env node
/** Metro on localhost — use with Android USB: adb reverse tcp:8081 tcp:8081 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./reset-dev-server.mjs')

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Localhost + USB (Android)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Run once: adb reverse tcp:8081 tcp:8081
  Then scan the QR (127.0.0.1 / localhost is OK over USB).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn('npx', ['expo', 'start', '--localhost', '-c'], {
  cwd: root,
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: 'localhost',
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code) => process.exit(code ?? 0))
