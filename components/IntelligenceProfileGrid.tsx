'use client'

import PremiumUpgradeButton from '@/components/PremiumUpgradeButton'
import { PREMIUM_FEATURES } from '@/lib/premiumFeatures'
import type { IntelligenceProfile } from '@/types/careerRoadmap'
import {
  Check,
  Lock,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const PAYWALL_VULNERABILITY_PLACEHOLDERS = [
  'Automate-prone reporting workflows flagged in Q2 task cluster',
  'CRM scheduling patterns overlap with emerging agent tooling',
  'Execution-heavy phrasing underweights leadership narrative',
  'Manual data reconciliation loops detected in weekly cadence',
] as const

export const PAYWALL_OPPORTUNITY_PLACEHOLDERS = [
  'Cross-functional AI pilot ownership with executive visibility',
  'Workflow automation ROI case study for internal promotion track',
  'Agent-assisted stakeholder synthesis for decision velocity',
  'Premium skill adjacency mapped to destination role demand',
] as const

type IntelligenceProfileGridProps = {
  profile: IntelligenceProfile
  isPremium: boolean
  userId: string | null
}

type ProfileListCardProps = {
  title: string
  icon: LucideIcon
  items: string[]
  accentClass: string
  iconClass: string
  blurred?: boolean
  /** When blurred, keep the first bullet readable as a free-tier preview. */
  showFirstItem?: boolean
}

function ProfileListCard({
  title,
  icon: Icon,
  items,
  accentClass,
  iconClass,
  blurred = false,
  showFirstItem = false,
}: ProfileListCardProps) {
  return (
    <article className={`rounded-xl border p-4 sm:p-5 ${accentClass}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-100">{title}</h4>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, index) => {
          const itemBlurred = blurred && !(showFirstItem && index === 0)

          return (
            <li
              key={item}
              className={`flex gap-2 text-sm leading-relaxed text-slate-300 ${
                itemBlurred ? 'blur-sm select-none' : ''
              }`}
              aria-hidden={itemBlurred ? true : undefined}
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400/70" aria-hidden />
              {item}
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function PremiumUnlockBanner() {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-sky-700/40 bg-slate-950/95 px-5 py-5 text-center shadow-xl shadow-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-sky-700/40 bg-sky-950/80">
        <Lock className="h-4 w-4 text-sky-300" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-100">
        Upgrade to Premium to unlock your full transition plan
      </p>
      <ul className="mt-4 space-y-2.5 text-left">
        {PREMIUM_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
      <PremiumUpgradeButton className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70" />
      <p className="mt-2 text-center text-[11px] text-slate-500">$29/month · Cancel anytime</p>
    </div>
  )
}

export default function IntelligenceProfileGrid({
  profile,
  isPremium,
  userId,
}: IntelligenceProfileGridProps) {
  const vulnerabilityItems = isPremium
    ? profile.structuralVulnerabilities
    : [...PAYWALL_VULNERABILITY_PLACEHOLDERS]
  const opportunityItems = isPremium
    ? profile.highYieldOpportunityZones
    : [...PAYWALL_OPPORTUNITY_PLACEHOLDERS]
  const previewBlur = !isPremium

  return (
    <section aria-labelledby="intelligence-profile-heading" className="mt-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3
          id="intelligence-profile-heading"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400"
        >
          Intelligence Profile
        </h3>
        {!isPremium ? (
          <span className="rounded-full border border-sky-800/40 bg-sky-950/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-400/90">
            Partial preview
          </span>
        ) : null}
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ProfileListCard
            title="Strengths"
            icon={Sparkles}
            items={profile.strengths}
            accentClass="border-emerald-500/15 bg-emerald-950/10"
            iconClass="bg-emerald-500/15 text-emerald-400"
            blurred={previewBlur}
            showFirstItem={previewBlur}
          />
          <ProfileListCard
            title="Emerging Advantages"
            icon={TrendingUp}
            items={profile.emergingAdvantages}
            accentClass="border-sky-500/15 bg-sky-950/15"
            iconClass="bg-sky-500/15 text-sky-400"
            blurred={previewBlur}
            showFirstItem={previewBlur}
          />
          <ProfileListCard
            title="Structural Vulnerabilities"
            icon={ShieldAlert}
            items={vulnerabilityItems}
            accentClass="border-orange-500/15 bg-orange-950/10"
            iconClass="bg-orange-500/15 text-orange-400"
            blurred={previewBlur}
          />
          <ProfileListCard
            title="High-Yield Opportunity Zones"
            icon={Target}
            items={opportunityItems}
            accentClass="border-violet-500/15 bg-violet-950/10"
            iconClass="bg-violet-500/15 text-violet-400"
            blurred={previewBlur}
          />
        </div>

        {!isPremium ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="pointer-events-auto w-full max-w-md">
              <PremiumUnlockBanner />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
