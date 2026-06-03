import { Platform } from 'react-native'

const DEFAULT_API_URL = 'http://localhost:3000'

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '')
}

/**
 * Use EXPO_PUBLIC_API_URL from mobile/.env — set per how you run the app:
 * - Android emulator:  http://10.0.2.2:3000
 * - Physical + USB:    http://localhost:3000  (+ adb reverse tcp:3000 tcp:3000)
 * - Physical + Wi‑Fi:  http://<mac-lan-ip>:3000
 */
export function resolveApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim()

  if (configured) {
    return normalizeBaseUrl(configured)
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'
  }

  return DEFAULT_API_URL
}

export function apiReachabilityHint(): string {
  const base = resolveApiBaseUrl()

  if (base.includes('10.0.2.2')) {
    return `Android emulator: run "npm run dev" on your Mac. API: ${base}`
  }

  if (base.includes('localhost') || base.includes('127.0.0.1')) {
    return `USB mode: run "adb reverse tcp:3000 tcp:3000" and "npm run dev". API: ${base}`
  }

  return `On your phone open ${base}/api/health-check in the browser first. API: ${base}`
}
