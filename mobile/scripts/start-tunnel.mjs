#!/usr/bin/env node
/**
 * Expo Go tunnel (Android / iOS) — avoids broken `expo start --tunnel` shared ngrok.
 *
 * Uses NGROK_AUTHTOKEN from mobile/.env (recommended), or localtunnel (no signup).
 */
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readEnvValue } from './load-env.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 8081
const authtoken = readEnvValue(root, 'NGROK_AUTHTOKEN')
const devClient = process.argv.includes('--dev-client')

function spawnExpo(extraEnv = {}) {
  const args = ['expo', 'start', '--lan']
  if (devClient) args.push('--dev-client')
  else args.push('-c')
  return spawn('npx', args, {
    cwd: root,
    env: { ...process.env, ...extraEnv },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
}

async function waitForMetro(ms = 180000) {
  const deadline = Date.now() + ms
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/status`)
      if (res.ok) return
    } catch {
      /* not ready */
    }
    await new Promise((r) => setTimeout(r, 800))
  }
  throw new Error(`Metro did not start on port ${PORT}`)
}

function toProxyUrl(tunnelHttpUrl) {
  return tunnelHttpUrl.replace(/^http:/, 'https:')
}

function printAndroidSteps(proxyUrl, expUrl) {
  if (devClient) {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Android dev build — TUNNEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Force-quit Future Trace DEV (clear from recents).
  2. Open the dev app — scan QR or paste this URL:

     ${expUrl}

  Do NOT use 192.168.x.x — your router blocks phone↔Mac on Wi‑Fi.

  Tunnel host: ${proxyUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
    return
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Android + Expo Go SDK 54 — TUNNEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Force-quit Expo Go (clear from recents).
  2. Run this command on your Mac (already running if you see this).
  3. In Expo Go → "Enter URL manually" and paste EXACTLY:

     ${expUrl}

  Or scan the QR in the terminal (must match the URL above).

  Tunnel host: ${proxyUrl}

  If loading stalls 30+ seconds, press "Reload" in Expo Go.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

function buildExpUrl(proxyUrl) {
  const u = new URL(proxyUrl)
  const port = u.port || (u.protocol === 'https:' ? '443' : '80')
  return `exp://${u.hostname}:${port}`
}

async function openNgrokTunnel() {
  const ngrok = (await import('@expo/ngrok')).default
  const httpUrl = await ngrok.connect({ port: PORT, authtoken, proto: 'http' })
  return {
    proxy: toProxyUrl(httpUrl),
    async close() {
      try {
        await ngrok.disconnect(httpUrl)
        await ngrok.kill()
      } catch {
        /* ignore */
      }
    },
  }
}

function openLocaltunnel() {
  return new Promise((resolve, reject) => {
    console.log('\nNo NGROK_AUTHTOKEN — using localtunnel (free, no signup).\n')
    console.log(
      'Tip: For a more reliable tunnel, add NGROK_AUTHTOKEN to mobile/.env\n' +
        '     https://dashboard.ngrok.com/get-started/your-authtoken\n',
    )

    const proc = spawn('npx', ['--yes', 'localtunnel', '--port', String(PORT)], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        proc.kill()
        reject(new Error('localtunnel timed out'))
      }
    }, 60000)

    const onData = (chunk) => {
      const text = chunk.toString()
      const match = text.match(/https:\/\/[^\s]+\.loca\.lt/i)
      if (match && !settled) {
        settled = true
        clearTimeout(timeout)
        resolve({
          proxy: match[0].trim(),
          async close() {
            proc.kill()
          },
        })
      }
    }

    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('error', (err) => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        reject(err)
      }
    })
    proc.on('exit', (code) => {
      if (!settled && code !== 0) {
        settled = true
        clearTimeout(timeout)
        reject(new Error(`localtunnel exited with code ${code}`))
      }
    })
  })
}

async function openCloudflared() {
  return new Promise((resolve, reject) => {
    const proc = spawn('cloudflared', ['tunnel', '--url', `http://127.0.0.1:${PORT}`], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        proc.kill()
        reject(new Error('cloudflared timed out'))
      }
    }, 60000)

    const onData = (chunk) => {
      const match = chunk.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i)
      if (match && !settled) {
        settled = true
        clearTimeout(timeout)
        resolve({
          proxy: match[0],
          async close() {
            proc.kill()
          },
        })
      }
    }

    proc.stderr.on('data', onData)
    proc.stdout.on('data', onData)
    proc.on('error', () => {
      if (!settled) {
        settled = true
        clearTimeout(timeout)
        reject(new Error('cloudflared not installed'))
      }
    })
  })
}

async function openTunnel() {
  if (authtoken) {
    console.log('\nOpening ngrok with your token…\n')
    return openNgrokTunnel()
  }

  try {
    console.log('\nTrying cloudflared (no account)…\n')
    return await openCloudflared()
  } catch {
    /* fall through */
  }

  return openLocaltunnel()
}

await import('./ensure-logo.mjs')
await import('./reset-dev-server.mjs')

let metro = null
let tunnel = null

const shutdown = async () => {
  metro?.kill('SIGTERM')
  await tunnel?.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

try {
  console.log('\nStarting Metro…\n')
  metro = spawnExpo()
  await waitForMetro()

  tunnel = await openTunnel()
  const { proxy } = tunnel
  const expUrl = buildExpUrl(proxy)

  printAndroidSteps(proxy, expUrl)

  if (proxy.includes('loca.lt')) {
    console.log(
      '\nNote: localtunnel often breaks Expo Go (interstitial page). ' +
        'Add NGROK_AUTHTOKEN to mobile/.env for a reliable tunnel, or use: npm run start:android\n',
    )
  }

  console.log('Restarting Metro with tunnel URL in QR…\n')
  metro.kill('SIGTERM')
  await new Promise((r) => setTimeout(r, 2500))

  metro = spawnExpo({
    EXPO_PACKAGER_PROXY_URL: proxy,
    REACT_NATIVE_PACKAGER_HOSTNAME: new URL(proxy).hostname,
  })
} catch (err) {
  const body = err?.body
  console.error('\nTunnel failed:', body?.msg ?? err.message)
  if (body?.details?.err) console.error('Details:', body.details.err)
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Fix tunnel for Android Expo Go
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Best option (free, ~2 min):

  1. https://dashboard.ngrok.com/signup
  2. Copy authtoken → add to mobile/.env:
       NGROK_AUTHTOKEN=your_token
  3. npm run start:tunnel

  Or install cloudflared: brew install cloudflared
  Then run npm run start:tunnel again.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
  await shutdown()
}

metro?.on('exit', async (code) => {
  await tunnel?.close()
  process.exit(code ?? 0)
})
