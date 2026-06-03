import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

/** Resolve adb binary — PATH first, then common Android SDK locations on Mac/Linux. */
export function resolveAdbPath() {
  const which = spawnSync('which', ['adb'], { encoding: 'utf8' })
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim()
  }

  const sdkRoots = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    join(homedir(), 'Library', 'Android', 'sdk'),
    join(homedir(), 'Android', 'Sdk'),
  ].filter(Boolean)

  for (const root of sdkRoots) {
    const candidate = join(root, 'platform-tools', 'adb')
    if (existsSync(candidate)) return candidate
  }

  return null
}

export function runAdb(args, options = {}) {
  const adbPath = resolveAdbPath()
  if (!adbPath) {
    return { status: 127, stdout: '', stderr: 'adb not found' }
  }
  return spawnSync(adbPath, args, { encoding: 'utf8', ...options })
}
