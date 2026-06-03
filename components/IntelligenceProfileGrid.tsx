'use client'

import PremiumUpgradeButton from '@/components/PremiumUpgradeButton'
import { PREMIUM_FEATURES } from '@/lib/premiumFeatures'
import type { IntelligenceProfile } from '@/types/careerRoadmap'
import {
  Check,
  ChevronDown,
  Lock,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

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
  onPremiumStatusChange?: (isPremium: boolean) => void
  premiumRefreshToken?: number
}

type CollapsibleProfileSectionProps = {
  title: string
  icon: LucideIcon
  items: string[]
  headingClass: string
  iconClass: string
  isPremium: boolean
  blurred?: boolean
  /** When blurred, keep the first bullet readable as a free-tier preview when expanded. */
  showFirstItem?: boolean
  /** When collapsed, show the first bullet lightly blurred for free users. */
  showCollapsedPreview?: boolean
}

function ProfileBullet({
  item,
  blurLevel,
  ariaHidden,
}: {
  item: string
  blurLevel: 'none' | 'light' | 'full'
  ariaHidden?: boolean
}) {
  const blurClass =
    blurLevel === 'full' ? 'blur-sm select-none' : blurLevel === 'light' ? 'blur-[2px] select-none opacity-80' : ''

  return (
    <li
      className={`flex gap-2 text-sm leading-relaxed text-textSecondary ${blurClass}`}
      aria-hidden={ariaHidden}
    >
      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-slate-500" aria-hidden />
      <span>{item}</span>
    </li>
  )
}

function CollapsibleProfileSection({
  title,
  icon: Icon,
  items,
  headingClass,
  iconClass,
  isPremium,
  blurred = false,
  showFirstItem = false,
  showCollapsedPreview = false,
}: CollapsibleProfileSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `${title.replace(/\s+/g, '-').toLowerCase()}-panel`
  const firstItem = items[0]

  const showFreeCollapsedTeaser =
    !isOpen && !isPremium && showCollapsedPreview && Boolean(firstItem)

  return (
    <div className="border-b border-trace-border py-4 first:pt-0 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 text-left"
      >
        <h4
          className={`flex min-w-0 flex-1 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${headingClass}`}
        >
          <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClass}`} aria-hidden />
          <span className="truncate">{title}</span>
          <span className="shrink-0 font-normal normal-case tracking-normal text-slate-500">
            ({items.length})
          </span>
        </h4>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {showFreeCollapsedTeaser ? (
        <ul className="mt-2.5">
          <ProfileBullet item={firstItem} blurLevel="light" />
        </ul>
      ) : null}

      {isOpen ? (
        <ul id={panelId} className="mt-2.5 space-y-2">
          {items.map((item, index) => {
            const itemBlurred = blurred && !(showFirstItem && index === 0)

            return (
              <ProfileBullet
                key={`${item}-${index}`}
                item={item}
                blurLevel={itemBlurred ? 'full' : 'none'}
                ariaHidden={itemBlurred}
              />
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function PremiumUnlockBanner({
  isPremium,
  onPremiumStatusChange,
  premiumRefreshToken,
}: {
  isPremium: boolean
  onPremiumStatusChange?: (isPremium: boolean) => void
  premiumRefreshToken?: number
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-trace-border bg-surface px-5 py-5 text-center shadow-xl shadow-black/40">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-borderMuted bg-accentMuted">
        <Lock className="h-4 w-4 text-accent" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-textPrimary">
        Upgrade to Premium to unlock your full transition plan
      </p>
      <ul className="mt-4 space-y-2.5 text-left">
        {PREMIUM_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-textSecondary">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
      <PremiumUpgradeButton
        className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-1.5"
        isPremium={isPremium}
        onPremiumStatusChange={onPremiumStatusChange}
        refreshToken={premiumRefreshToken}
      />
      <p className="mt-2 text-center text-[11px] text-slate-500">$29/month · Cancel anytime</p>
    </div>
  )
}

export default function IntelligenceProfileGrid({
  profile,
  isPremium,
  onPremiumStatusChange,
  premiumRefreshToken,
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
          className="text-xs font-semibold uppercase tracking-[0.14em] text-textPrimary"
        >
          Intelligence Profile
        </h3>
        {!isPremium ? (
          <span className="rounded-full border border-trace-border bg-accentMuted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent/90">
            Partial preview
          </span>
        ) : null}
      </div>

      <div className="relative">
        <div className="rounded-xl border border-trace-border bg-background px-4 py-5 sm:px-5">
          <div className="flex flex-col">
            <CollapsibleProfileSection
              title="Strengths"
              icon={Sparkles}
              items={profile.strengths}
              headingClass="text-accent/90"
              iconClass="text-highlight"
              isPremium={isPremium}
              blurred={previewBlur}
              showFirstItem={previewBlur}
              showCollapsedPreview
            />
            <CollapsibleProfileSection
              title="Emerging Advantages"
              icon={TrendingUp}
              items={profile.emergingAdvantages}
              headingClass="text-accent/90"
              iconClass="text-accent"
              isPremium={isPremium}
              blurred={previewBlur}
              showFirstItem={previewBlur}
              showCollapsedPreview
            />
            <CollapsibleProfileSection
              title="Structural Vulnerabilities"
              icon={ShieldAlert}
              items={vulnerabilityItems}
              headingClass="text-orange-300/90"
              iconClass="text-orange-400"
              isPremium={isPremium}
              blurred={previewBlur}
            />
            <CollapsibleProfileSection
              title="High-Yield Opportunity Zones"
              icon={Target}
              items={opportunityItems}
              headingClass="text-accent/90"
              iconClass="text-highlight"
              isPremium={isPremium}
              blurred={previewBlur}
            />
          </div>
        </div>

        {!isPremium ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="pointer-events-auto w-full max-w-md">
              <PremiumUnlockBanner
                isPremium={isPremium}
                onPremiumStatusChange={onPremiumStatusChange}
                premiumRefreshToken={premiumRefreshToken}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
