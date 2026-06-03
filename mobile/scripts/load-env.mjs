import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Read KEY=value from mobile/.env (no dependency on dotenv). */
export function readEnvValue(root, key) {
  if (process.env[key]) return process.env[key].trim()
  try {
    const text = readFileSync(join(root, '.env'), 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      if (trimmed.slice(0, eq).trim() !== key) continue
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      return value
    }
  } catch {
    /* no .env */
  }
  return undefined
}
