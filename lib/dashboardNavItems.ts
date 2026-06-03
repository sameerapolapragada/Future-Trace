import type { LucideIcon } from 'lucide-react'
import { BookOpen, Shield, User } from 'lucide-react'
import type { DashboardView } from '@/components/DashboardNav'
import { SHOW_CAREER_SHIELD_BETA } from '@/lib/featureFlags'

/** Premium workspace routes omitted from nav when {@link SHOW_CAREER_SHIELD_BETA} is false. */
export const SHIELD_BETA_ROUTES = [
  '/dashboard/shield',
  '/dashboard/sandbox',
  '/dashboard/roadmap',
] as const

export type MatcherTab = 'analysis' | 'history'

type DashboardNavLinkItem = {
  kind: 'link'
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
  /** Hidden unless Career Shield beta is enabled. */
  shieldBetaOnly?: boolean
}

type DashboardNavViewItem = {
  kind: 'view'
  id: DashboardView
  label: string
  shortLabel: string
  icon: LucideIcon
  /** Hidden unless Career Shield beta is enabled. */
  shieldBetaOnly?: boolean
}

export type DashboardNavItem = DashboardNavLinkItem | DashboardNavViewItem

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    kind: 'link',
    href: '/blog',
    label: 'Blog',
    shortLabel: 'Blog',
    icon: BookOpen,
    shieldBetaOnly: true,
  },
  {
    kind: 'view',
    id: 'shield',
    label: 'AI Career Transition Path',
    shortLabel: 'Path',
    icon: Shield,
    shieldBetaOnly: true,
  },
  {
    kind: 'link',
    href: '/dashboard/roadmap',
    label: 'Roadmap Workspace',
    shortLabel: 'Roadmap',
    icon: Shield,
    shieldBetaOnly: true,
  },
  {
    kind: 'link',
    href: '/dashboard/sandbox',
    label: 'Code Sandbox',
    shortLabel: 'Sandbox',
    icon: Shield,
    shieldBetaOnly: true,
  },
  {
    kind: 'link',
    href: '/dashboard/shield',
    label: 'Shield Workspace',
    shortLabel: 'Shield',
    icon: Shield,
    shieldBetaOnly: true,
  },
  {
    kind: 'view',
    id: 'profile',
    label: 'Profile',
    shortLabel: 'Profile',
    icon: User,
    shieldBetaOnly: true,
  },
]

export function filterDashboardNavItems(
  items: DashboardNavItem[],
  showCareerShieldBeta: boolean = SHOW_CAREER_SHIELD_BETA,
): DashboardNavItem[] {
  return items.filter((item) => {
    if (item.kind === 'link' && SHIELD_BETA_ROUTES.includes(item.href as (typeof SHIELD_BETA_ROUTES)[number])) {
      return showCareerShieldBeta
    }

    if ('shieldBetaOnly' in item && item.shieldBetaOnly) {
      return showCareerShieldBeta
    }

    return true
  })
}
