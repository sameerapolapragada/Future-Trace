'use client'

import PremiumUpgradeButton from '@/components/PremiumUpgradeButton'
import type { ScanBalanceResponse } from '@/lib/scanLimits'
import { FREE_MONTHLY_SCAN_LIMIT } from '@/lib/scanLimits'
import { Sparkles } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

type ScanBalanceBadgeProps = {
  refreshToken?: number
  onBalanceChange?: (balance: ScanBalanceResponse | null) => void
}

export default function ScanBalanceBadge({
  refreshToken = 0,
  onBalanceChange,
}: ScanBalanceBadgeProps) {
  const [balance, setBalance] = useState<ScanBalanceResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadBalance = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/user/scan-count')
      const payload = (await response.json()) as ScanBalanceResponse & { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not load scan balance')
      }

      const nextBalance: ScanBalanceResponse = payload.isPremium
        ? { isPremium: true }
        : {
            isPremium: false,
            scansUsed: payload.scansUsed ?? 0,
            scansRemaining: payload.scansRemaining ?? 0,
          }

      setBalance(nextBalance)
      onBalanceChange?.(nextBalance)
    } catch (error) {
      console.error('[ScanBalanceBadge] Failed to load scan balance:', error)
      setBalance(null)
      onBalanceChange?.(null)
    } finally {
      setLoading(false)
    }
  }, [onBalanceChange])

  useEffect(() => {
    void loadBalance()
  }, [loadBalance, refreshToken])

  if (loading) {
    return (
      <div className="rounded-xl border border-trace-border bg-slate-100 px-4 py-3 text-xs text-slate-500">
        Checking scan balance…
      </div>
    )
  }

  if (!balance) {
    return null
  }

  if (balance.isPremium) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-borderMuted bg-accentMuted px-4 py-3">
        <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p className="text-sm font-semibold text-accent">✨ Premium: Unlimited Scans Active</p>
      </div>
    )
  }

  if (balance.scansRemaining === 0) {
    return (
      <div className="badge-status-warning rounded-xl px-4 py-4">
        <p className="text-sm font-semibold leading-snug">
          0 Free Scans Remaining This Month. Upgrade to Premium for Unlimited Optimizations.
        </p>
        <PremiumUpgradeButton className="btn-primary mt-3 inline-flex w-full items-center justify-center gap-1.5 py-2.5 sm:w-auto" />
      </div>
    )
  }

  return (
    <div className="badge-status-success rounded-xl px-4 py-3">
      <p className="text-sm">
        Remaining Free Scans This Month:{' '}
        <span className="font-semibold">
          {balance.scansRemaining} / {FREE_MONTHLY_SCAN_LIMIT}
        </span>
      </p>
    </div>
  )
}

export function isScanUploadLocked(balance: ScanBalanceResponse | null): boolean {
  return Boolean(balance && !balance.isPremium && balance.scansRemaining === 0)
}
