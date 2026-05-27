export type PlanId = 'free' | 'pro'

export type PlanDefinition = {
  id: PlanId
  label: string
  tagline: string
  priceLabel: string
  features: string[]
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    label: 'Free',
    tagline: 'Explore AI history and check your exposure score.',
    priceLabel: '$0 / month',
    features: [
      'AI evolution timeline (all milestones)',
      'AI job exposure score',
      'Search milestones & topics',
    ],
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    tagline: 'Deeper insights and priority updates as AI shifts accelerate.',
    priceLabel: '$12 / month',
    features: [
      'Everything in Free',
      'Personalized risk breakdowns',
      'Industry-specific score context',
      'Early access to new milestones',
      'Export & share score reports',
      'Priority model refresh alerts',
    ],
  },
}

export function getPlan(planId: PlanId): PlanDefinition {
  return PLANS[planId]
}
