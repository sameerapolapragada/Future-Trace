#!/usr/bin/env node
import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { freeMetroPorts, METRO_PORT } from './free-metro-ports.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

await import('./ensure-logo.mjs')

const stopped = freeMetroPorts()
if (stopped.length > 0) {
  console.log(`Stopped ${stopped.length} stale Metro process(es) on ports 8081–8083`)
}

for (const dir of ['.expo', join('node_modules', '.cache')]) {
  try {
    rmSync(join(root, dir), { recursive: true, force: true })
  } catch {
    /* ignore */
  }
}

console.log('Cleared .expo and Metro cache (logo files are kept)')
