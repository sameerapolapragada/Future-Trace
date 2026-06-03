'use client'

import { Loader2, Radar, Ticket } from 'lucide-react'
import { useState } from 'react'

type MatcherPaywallCardProps = {
  onCheckoutComplete?: () => void
}

export default function MatcherPaywallCard({ onCheckoutComplete }: MatcherPaywallCardProps) {
  const [loadingPlan, setLoadingPlan] = useState<'subscription' | 'single_scan' | null>(null)

  async function startCheckout(plan: 'subscription' | 'single_scan') {
    setLoadingPlan(plan)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = (await response.json()) as { url?: string; error?: string }

      if (data.url) {
        onCheckoutComplete?.()
        window.location.href = data.url
        return
      }

      throw new Error(data.error ?? 'Checkout could not be started')
    } catch (error) {
      console.error('[MatcherPaywallCard] Checkout failed:', error)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#111827] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,187,45,0.12),transparent_55%)]" />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Premium transition intelligence
        </p>
        <h3 className="mt-3 text-xl font-bold text-textPrimary sm:text-2xl">
          Unlock Your 5 Immediate Transition Trajectories
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-textSecondary">
          See five ranked alternative roles with salary bands, match percentages, and the exact
          technical skill gaps to close first.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => startCheckout('subscription')}
            disabled={loadingPlan !== null}
            className="horizon-interactive flex flex-col items-start rounded-xl border border-accent/30 bg-accentMuted/40 p-5 text-left transition hover:border-accent/60"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Radar className="h-4 w-4" aria-hidden />
              Live Market Radar
            </span>
            <span className="mt-3 text-2xl font-bold text-textPrimary">$7.99/mo</span>
            <span className="mt-2 text-xs leading-relaxed text-textSecondary">
              Continuous background tracking, weekly re-scans, and automated risk alerts.
            </span>
            {loadingPlan === 'subscription' ? (
              <span className="mt-4 inline-flex items-center gap-2 text-xs text-accent">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Redirecting…
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => startCheckout('single_scan')}
            disabled={loadingPlan !== null}
            className="horizon-interactive flex flex-col items-start rounded-xl border border-borderMuted bg-surface/80 p-5 text-left transition hover:border-accent/40"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-textPrimary">
              <Ticket className="h-4 w-4 text-accent" aria-hidden />
              Single-Use Unlock Pass
            </span>
            <span className="mt-3 text-2xl font-bold text-textPrimary">$2.99</span>
            <span className="mt-2 text-xs leading-relaxed text-textSecondary">
              One-time purchase. Grants 1 instant scan token credit.
            </span>
            {loadingPlan === 'single_scan' ? (
              <span className="mt-4 inline-flex items-center gap-2 text-xs text-accent">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Redirecting…
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  )
}
