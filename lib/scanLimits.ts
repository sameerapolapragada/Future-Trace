export const FREE_MONTHLY_SCAN_LIMIT = 3

export function rollingScanWindowStart(): string {
  const start = new Date()
  start.setDate(start.getDate() - 30)
  start.setHours(0, 0, 0, 0)
  return start.toISOString()
}

export type ScanBalanceResponse =
  | { isPremium: true }
  | { isPremium: false; scansUsed: number; scansRemaining: number }

export function buildFreeScanBalance(scansUsed: number): Extract<ScanBalanceResponse, { isPremium: false }> {
  return {
    isPremium: false,
    scansUsed,
    scansRemaining: Math.max(0, FREE_MONTHLY_SCAN_LIMIT - scansUsed),
  }
}
