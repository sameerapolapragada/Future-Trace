'use client'

import { ChevronRight, Crown } from 'lucide-react'
import { useState } from 'react'

type PremiumUpgradeButtonProps = {
  className?: string
  showChevron?: boolean
}

export default function PremiumUpgradeButton({
  className = 'flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70',
  showChevron = true,
}: PremiumUpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpgrade() {
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', { method: 'POST' })
      const data = (await response.json()) as { url?: string; error?: string }

      if (data.url) {
        window.location.href = data.url
        return
      }

      throw new Error(data.error ?? 'Checkout session could not be created')
    } catch (error) {
      console.error('[PremiumUpgradeButton] Checkout failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <button type="button" onClick={handleUpgrade} disabled={isLoading} className={className}>
      <Crown className="h-4 w-4 shrink-0" aria-hidden />
      {isLoading ? 'Redirecting to secure checkout...' : 'Upgrade to Premium ($29)'}
      {showChevron && !isLoading ? (
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
      ) : null}
    </button>
  )
}
