'use client'

import { createClient } from '@/utils/supabase/client'
import { ChevronRight, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'

type PremiumUpgradeButtonProps = {
  className?: string
  showChevron?: boolean
  isPremium?: boolean
  onPremiumStatusChange?: (isPremium: boolean) => void
  refreshToken?: number
}

export default function PremiumUpgradeButton({
  className = 'btn-primary flex w-full items-center justify-center gap-1.5 py-3 disabled:cursor-not-allowed disabled:opacity-70',
  showChevron = true,
  isPremium: isPremiumProp = false,
  onPremiumStatusChange,
  refreshToken = 0,
}: PremiumUpgradeButtonProps) {
  const [isPremium, setIsPremium] = useState<boolean | null>(isPremiumProp ? true : null)
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)

  useEffect(() => {
    if (isPremiumProp) {
      setIsPremium(true)
      return
    }

    let cancelled = false

    async function loadPremiumStatus() {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (cancelled || userError || !user) {
          if (!cancelled) setIsPremium(false)
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .maybeSingle()

        if (cancelled) return

        if (profileError) {
          console.error('[PremiumUpgradeButton] Failed to load premium status:', profileError.message)
          setIsPremium(false)
          return
        }

        const premium = profile?.is_premium ?? false
        setIsPremium(premium)
        onPremiumStatusChange?.(premium)
      } catch (error) {
        if (!cancelled) {
          console.error('[PremiumUpgradeButton] Premium status check failed:', error)
          setIsPremium(false)
        }
      }
    }

    void loadPremiumStatus()

    return () => {
      cancelled = true
    }
  }, [refreshToken, onPremiumStatusChange, isPremiumProp])

  async function handleUpgrade() {
    setIsLoadingCheckout(true)

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
      setIsLoadingCheckout(false)
    }
  }

  if (isPremium === null || isPremium) {
    return null
  }

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={isLoadingCheckout}
      className={className}
    >
      <Crown className="h-4 w-4 shrink-0" aria-hidden />
      {isLoadingCheckout ? 'Redirecting to secure checkout...' : 'Upgrade to Premium ($29)'}
      {showChevron && !isLoadingCheckout ? (
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
      ) : null}
    </button>
  )
}
