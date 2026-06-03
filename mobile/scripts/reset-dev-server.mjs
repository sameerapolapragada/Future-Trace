#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

try {
  const pids = execSync('lsof -ti:8081 2>/dev/null || true', { encoding: 'utf8' }).trim()
  if (pids) {
    for (const pid of pids.split('\n').filter(Boolean)) {
      try {
        process.kill(Number(pid), 'SIGKILL')
      } catch {
        /* already exited */
      }
    }
    console.log('Stopped process(es) on port 8081')
  }
} catch {
  /* lsof unavailable */
}

for (const dir of ['.expo', join('node_modules', '.cache')]) {
  try {
    rmSync(join(root, dir), { recursive: true, force: true })
  } catch {
    /* ignore */
  }
}

console.log('Cleared .expo and Metro cache (logo files are kept)')
