#!/usr/bin/env node
/**
 * Metro cache clears do NOT delete logo files — this restores them if missing or corrupted.
 */
import { copyFileSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const canonical = join(root, 'assets/logo-canonical.png')
const targets = [
  join(root, 'assets/brand-logo.png'),
  join(root, 'assets/future-trace-logo.png'),
]

const MIN_BYTES = 8000

if (!existsSync(canonical)) {
  console.error(
    '\nMissing mobile/assets/logo-canonical.png — logo cannot be restored.\n' +
      'Re-copy your logo file into that path.\n',
  )
  process.exit(1)
}

for (const target of targets) {
  const ok =
    existsSync(target) &&
    (() => {
      try {
        return statSync(target).size >= MIN_BYTES
      } catch {
        return false
      }
    })()

  if (!ok) {
    copyFileSync(canonical, target)
    console.log(`Restored ${target.replace(root + '/', '')}`)
  }
}
