'use client'

import BrandLogo from '@/components/BrandLogo'
import { BookOpen, Shield, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export type DashboardView = 'shield' | 'profile'

type DashboardNavProps = {
  view: DashboardView
  onViewChange: (view: DashboardView) => void
}

type NavLinkItem = {
  kind: 'link'
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

type NavViewItem = {
  kind: 'view'
  id: DashboardView
  label: string
  shortLabel: string
  icon: LucideIcon
}

type NavItem = NavLinkItem | NavViewItem

const NAV_ITEMS: NavItem[] = [
  { kind: 'link', href: '/blog', label: 'Blog', shortLabel: 'Blog', icon: BookOpen },
  { kind: 'view', id: 'shield', label: 'AI Career Shield', shortLabel: 'AI Career Shield', icon: Shield },
  { kind: 'view', id: 'profile', label: 'Profile', shortLabel: 'Profile', icon: User },
]

function desktopNavClass(isActive: boolean) {
  return `horizon-interactive flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
    isActive
      ? 'horizon-nav-active'
      : 'text-textSecondary hover:bg-accentMuted/60 hover:text-textPrimary'
  }`
}

function mobileNavClass(isActive: boolean) {
  return `horizon-interactive flex flex-col items-center gap-1 rounded-lg px-3 py-1 ${
    isActive ? 'text-accent' : 'text-textSecondary hover:text-textPrimary'
  }`
}

function NavViewTab({
  tab,
  isActive,
  onSelect,
  variant,
}: {
  tab: NavViewItem
  isActive: boolean
  onSelect: () => void
  variant: 'mobile' | 'desktop'
}) {
  const Icon = tab.icon

  if (variant === 'desktop') {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? 'page' : undefined}
        className={desktopNavClass(isActive)}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {tab.label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'page' : undefined}
      className={mobileNavClass(isActive)}
    >
      <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent' : ''}`} aria-hidden />
      <span className="max-w-[4.75rem] text-center text-[10px] leading-tight">{tab.shortLabel}</span>
    </button>
  )
}

function NavLinkTab({ tab, variant }: { tab: NavLinkItem; variant: 'mobile' | 'desktop' }) {
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
      <span className="max-w-[4.75rem] text-center text-[10px] leading-tight">{tab.shortLabel}</span>
    </Link>
  )
}

export default function DashboardNav({ view, onViewChange }: DashboardNavProps) {
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
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.kind === 'link' ? (
              <NavLinkTab key={item.href} tab={item} variant="desktop" />
            ) : (
              <NavViewTab
                key={item.id}
                tab={item}
                isActive={view === item.id}
                onSelect={() => onViewChange(item.id)}
                variant="desktop"
              />
            )
          )}
        </div>
      </nav>

      <nav
        aria-label="Dashboard navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-borderMuted bg-surface/95 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md md:hidden"
      >
        {NAV_ITEMS.map((item) =>
          item.kind === 'link' ? (
            <NavLinkTab key={item.href} tab={item} variant="mobile" />
          ) : (
            <NavViewTab
              key={item.id}
              tab={item}
              isActive={view === item.id}
              onSelect={() => onViewChange(item.id)}
              variant="mobile"
            />
          )
        )}
      </nav>
    </>
  )
}
