#!/usr/bin/env node
/** Stop stale Metro / Expo processes on common dev ports. */
import { execSync } from 'node:child_process'

export const METRO_PORT = 8081
const EXTRA_PORTS = [8082, 8083]

export function freeMetroPorts(ports = [METRO_PORT, ...EXTRA_PORTS]) {
  const stopped = []

  for (const port of ports) {
    try {
      const pids = execSync(`lsof -ti:${port} 2>/dev/null || true`, { encoding: 'utf8' }).trim()
      if (!pids) continue

      for (const pid of pids.split('\n').filter(Boolean)) {
        try {
          process.kill(Number(pid), 'SIGKILL')
          stopped.push({ port, pid })
        } catch {
          /* already exited */
        }
      }
    } catch {
      /* lsof unavailable */
    }
  }

  return stopped
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const stopped = freeMetroPorts()
  if (stopped.length === 0) {
    console.log('No Metro processes found on ports 8081–8083')
  } else {
    for (const { port, pid } of stopped) {
      console.log(`Stopped pid ${pid} on port ${port}`)
    }
  }
}
