#!/usr/bin/env node
/**
 * Dev build + tunnel — use when phone cannot reach http://192.168.x.x:8081
 * (router AP isolation). Add NGROK_AUTHTOKEN to .env for best results.
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readEnvValue } from './load-env.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

const hasNgrok = Boolean(readEnvValue(root, 'NGROK_AUTHTOKEN'))

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Dev build + tunnel (Wi‑Fi blocked phone↔Mac)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${hasNgrok ? 'Using your ngrok token.' : 'Tip: add NGROK_AUTHTOKEN to mobile/.env (free at ngrok.com)'}

  When tunnel is ready, open Future Trace DEV app (not Expo Go).
  Use the exp:// URL from this terminal — not 192.168.x.x
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

const child = spawn('node', ['scripts/start-tunnel.mjs', '--dev-client'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

child.on('exit', (code) => process.exit(code ?? 0))
