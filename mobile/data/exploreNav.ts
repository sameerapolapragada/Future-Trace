import type { Ionicons } from '@expo/vector-icons'

export type ExploreNavItem = {
  label: string
  href: `/(explore)${string}`
  icon: keyof typeof Ionicons.glyphMap
}

export const EXPLORE_NAV_ITEMS: ExploreNavItem[] = [
  { label: 'Home', href: '/(explore)', icon: 'home-outline' },
  {
    label: 'AI Evolution Timeline',
    href: '/(explore)/ai-evolution-timeline',
    icon: 'hardware-chip-outline',
  },
  {
    label: 'Industry Adoption Waves',
    href: '/(explore)/industry-adoption-waves',
    icon: 'layers-outline',
  },
  {
    label: 'Jobs Affected by AI Evolution',
    href: '/(explore)/jobs-affected-by-ai',
    icon: 'briefcase-outline',
  },
  {
    label: 'What Comes Next',
    href: '/(explore)/what-comes-next',
    icon: 'sparkles-outline',
  },
]
