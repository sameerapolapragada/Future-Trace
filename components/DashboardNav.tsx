'use client'

import BrandLogo from '@/components/BrandLogo'
import {
  DASHBOARD_NAV_ITEMS,
  filterDashboardNavItems,
  type DashboardNavItem,
  type MatcherTab,
} from '@/lib/dashboardNavItems'
import { SHOW_CAREER_SHIELD_BETA } from '@/lib/featureFlags'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export type DashboardView = 'shield' | 'profile' | 'transitionPath'

type DashboardNavProps = {
  view: DashboardView
  onViewChange: (view: DashboardView) => void
  showCareerShieldBeta?: boolean
  matcherTab?: MatcherTab
  onMatcherTabChange?: (tab: MatcherTab) => void
}

function desktopNavClass(isActive: boolean) {
  return `horizon-interactive flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
    isActive
      ? 'horizon-nav-active'
      : 'text-textSecondary hover:bg-accentMuted/60 hover:text-textPrimary'
  }`
}

function mobileNavClass(isActive: boolean) {
  return `horizon-interactive flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-1 ${
    isActive ? 'text-accent' : 'text-textSecondary hover:text-textPrimary'
  }`
}

function NavIconButton({
  icon: Icon,
  label,
  shortLabel,
  isActive,
  onClick,
  variant,
}: {
  icon: LucideIcon
  label: string
  shortLabel: string
  isActive: boolean
  onClick: () => void
  variant: 'mobile' | 'desktop'
}) {
  if (variant === 'desktop') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
        className={desktopNavClass(isActive)}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={mobileNavClass(isActive)}
    >
      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent' : ''}`} aria-hidden />
      <span className="max-w-[5.5rem] text-center text-[10px] leading-tight">{shortLabel}</span>
    </button>
  )
}

function NavViewTab({
  tab,
  isActive,
  onSelect,
  variant,
}: {
  tab: Extract<DashboardNavItem, { kind: 'view' }>
  isActive: boolean
  onSelect: () => void
  variant: 'mobile' | 'desktop'
}) {
  const Icon = tab.icon

  return (
    <NavIconButton
      icon={Icon}
      label={tab.label}
      shortLabel={tab.shortLabel}
      isActive={isActive}
      onClick={onSelect}
      variant={variant}
    />
  )
}

function NavLinkTab({
  tab,
  variant,
}: {
  tab: Extract<DashboardNavItem, { kind: 'link' }>
  variant: 'mobile' | 'desktop'
}) {
  const Icon = tab.icon

  if (variant === 'desktop') {
    return (
      <Link href={tab.href} className={desktopNavClass(false)}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {tab.label}
      </Link>
    )
  }

  return (
    <Link href={tab.href} className={mobileNavClass(false)}>
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      <span className="max-w-[5.5rem] text-center text-[10px] leading-tight">{tab.shortLabel}</span>
    </Link>
  )
}

function renderNavItem(
  item: DashboardNavItem,
  props: {
    view: DashboardView
    onViewChange: (view: DashboardView) => void
    matcherTab: MatcherTab
    onMatcherTabChange: (tab: MatcherTab) => void
    variant: 'mobile' | 'desktop'
  },
) {
  const { view, onViewChange, matcherTab, onMatcherTabChange, variant } = props

  if (item.kind === 'link') {
    return <NavLinkTab key={item.href} tab={item} variant={variant} />
  }

  return (
    <NavViewTab
      key={item.id}
      tab={item}
      isActive={view === item.id}
      onSelect={() => onViewChange(item.id)}
      variant={variant}
    />
  )
}

export default function DashboardNav({
  view,
  onViewChange,
  showCareerShieldBeta = SHOW_CAREER_SHIELD_BETA,
  matcherTab = 'analysis',
  onMatcherTabChange,
}: DashboardNavProps) {
  const navItems = filterDashboardNavItems(DASHBOARD_NAV_ITEMS, showCareerShieldBeta)
  const handleMatcherTabChange = onMatcherTabChange ?? (() => {})
  const hasNavItems = navItems.length > 0

  const navListClass = 'flex items-center gap-1 md:ml-auto md:mr-0'

  const mobileNavListClass = showCareerShieldBeta
    ? 'flex w-full justify-around'
    : 'mx-auto flex w-full max-w-xs justify-center gap-2 px-6'

  return (
    <>
      <nav
        aria-label="Dashboard navigation"
        className="sticky top-0 z-40 hidden w-full border-b border-borderMuted bg-surface/95 shadow-horizon backdrop-blur-md md:flex md:items-center md:justify-between md:px-8 md:py-4"
      >
        <Link
          href="/"
          className="horizon-interactive flex items-center gap-2.5 text-lg font-bold tracking-tight text-textPrimary hover:opacity-90"
        >
          <BrandLogo size={48} className="h-11 w-11 sm:h-12 sm:w-12" />
          <span>Future Trace</span>
        </Link>
        {hasNavItems ? (
          <div className={navListClass}>
            {navItems.map((item) =>
              renderNavItem(item, {
                view,
                onViewChange,
                matcherTab,
                onMatcherTabChange: handleMatcherTabChange,
                variant: 'desktop',
              }),
            )}
          </div>
        ) : null}
      </nav>

      {hasNavItems ? (
        <nav
          aria-label="Dashboard navigation"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-borderMuted bg-surface/95 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md md:hidden"
        >
          <div className={mobileNavListClass}>
            {navItems.map((item) =>
              renderNavItem(item, {
                view,
                onViewChange,
                matcherTab,
                onMatcherTabChange: handleMatcherTabChange,
                variant: 'mobile',
              }),
            )}
          </div>
        </nav>
      ) : null}
    </>
  )
}
