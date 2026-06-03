'use client'

import { Lock, Sparkles } from 'lucide-react'

type ComingSoonWallCardProps = {
  onBack?: () => void
  backLabel?: string
}

export default function ComingSoonWallCard({
  onBack,
  backLabel = 'Back to Career Matcher',
}: ComingSoonWallCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#111827] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,187,45,0.12),transparent_55%)]" />
      <div className="relative text-center sm:text-left">
        <p className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent sm:justify-start">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Coming soon
        </p>
        <h3 className="mt-3 flex items-center justify-center gap-2 text-xl font-bold text-textPrimary sm:justify-start sm:text-2xl">
          <Sparkles className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          AI Career Transition Path
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-textSecondary">
          Your interactive transition blueprint — macro milestones, sprint workspace, and
          milestone-by-milestone execution — is on the way. Check back soon.
        </p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            {backLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
