import type { CareerRoadmap } from '@/types/careerRoadmap'

type RouteTemplate = {
  match: RegExp
  route: string[]
  obstacle: string
  nextMilestone: string
  baseMonths: number
}

const ROUTE_TEMPLATES: RouteTemplate[] = [
  {
    match: /product|pm|program manager/i,
    route: ['Associate', 'Business Analyst', 'Product Owner', 'AI Product Manager'],
    obstacle: 'Translating technical AI capabilities into stakeholder-ready product bets',
    nextMilestone: 'Complete one cross-functional discovery cycle with measurable outcomes',
    baseMonths: 18,
  },
  {
    match: /data|analyst|analytics|bi/i,
    route: ['Junior Analyst', 'Analytics Specialist', 'Insights Lead', 'AI Strategy Analyst'],
    obstacle: 'Moving from descriptive reporting to decision-grade, AI-augmented insight',
    nextMilestone: 'Ship an automated insight workflow that replaces a recurring manual report',
    baseMonths: 14,
  },
  {
    match: /engineer|developer|software|devops|sre/i,
    route: ['Engineer II', 'Tech Lead', 'Platform Engineer', 'AI Systems Engineer'],
    obstacle: 'Depth in agent orchestration and production AI reliability',
    nextMilestone: 'Deliver one production feature integrating an LLM or agent workflow',
    baseMonths: 16,
  },
  {
    match: /market|content|brand|growth/i,
    route: ['Coordinator', 'Marketing Specialist', 'Growth Lead', 'AI Marketing Strategist'],
    obstacle: 'Owning strategy while AI handles execution-heavy campaign tasks',
    nextMilestone: 'Launch a campaign where AI assists creative iteration but you own positioning',
    baseMonths: 12,
  },
  {
    match: /admin|assistant|coordinator|operations|ops/i,
    route: ['Admin', 'Business Analyst', 'Operations Lead', 'AI Operations Manager'],
    obstacle: 'Building analytical credibility beyond task coordination',
    nextMilestone: 'Document and automate one recurring workflow end-to-end',
    baseMonths: 15,
  },
  {
    match: /design|ux|ui|creative/i,
    route: ['Designer', 'Product Designer', 'Design Lead', 'AI Experience Designer'],
    obstacle: 'Defending craft and systems thinking as generative tools commoditize visuals',
    nextMilestone: 'Publish a case study showing human-led design decisions on an AI-assisted project',
    baseMonths: 14,
  },
  {
    match: /sales|account|customer success|support/i,
    route: ['Representative', 'Account Manager', 'Customer Success Lead', 'AI Solutions Consultant'],
    obstacle: 'Shifting from transactional outreach to consultative, AI-literate advisory',
    nextMilestone: 'Close or retain one account using an AI-assisted discovery playbook you authored',
    baseMonths: 13,
  },
  {
    match: /legal|compliance|risk|finance|account/i,
    route: ['Analyst', 'Specialist', 'Senior Advisor', 'AI Governance Lead'],
    obstacle: 'Staying accountable for judgment calls as automation absorbs routine review',
    nextMilestone: 'Draft an AI-use policy or control checklist for your function',
    baseMonths: 20,
  },
]

const DEFAULT_TEMPLATE: RouteTemplate = {
  match: /.*/,
  route: ['Individual Contributor', 'Senior IC', 'Team Lead', 'AI-Augmented Strategist'],
  obstacle: 'Building visible ownership of outcomes AI cannot delegate',
  nextMilestone: 'Identify one high-value task cluster to redesign with AI assistance',
  baseMonths: 16,
}

function normalizeRole(value: string): string {
  return value.trim() || 'Your current role'
}

function pickTemplate(destination: string, current: string): RouteTemplate {
  const haystack = `${destination} ${current}`
  return ROUTE_TEMPLATES.find((template) => template.match.test(haystack)) ?? DEFAULT_TEMPLATE
}

function adjustJourneyMonths(
  baseMonths: number,
  resumeText: string | undefined,
  current: string,
  destination: string
): number {
  let months = baseMonths
  const lower = (resumeText ?? '').toLowerCase()

  if (/\b(senior|lead|principal|director|head of)\b/i.test(current)) months -= 4
  if (/\b(junior|intern|entry|associate)\b/i.test(current)) months += 4

  if (RESILIENCE_SIGNALS.some((signal) => lower.includes(signal))) months -= 2
  if (AUTOMATION_SIGNALS.some((signal) => lower.includes(signal))) months += 2

  return Math.min(36, Math.max(6, months))
}

const AUTOMATION_SIGNALS = [
  'data entry',
  'scheduling',
  'reporting',
  'excel',
  'spreadsheet',
  'customer service',
  'transcription',
  'bookkeeping',
]

const RESILIENCE_SIGNALS = [
  'strategy',
  'leadership',
  'architecture',
  'stakeholder',
  'negotiation',
  'governance',
  'research',
  'design',
  'compliance',
  'mentoring',
]

/** Default roadmap when a free user lands on the dashboard (profile-only, no scan yet). */
export function buildDefaultCareerRoadmap(
  currentPosition: string,
  destinationPosition?: string
): CareerRoadmap {
  const current = normalizeRole(currentPosition)
  const destination = normalizeRole(destinationPosition || inferDestination(current))
  const template = pickTemplate(destination, current)

  return {
    currentPosition: current,
    destinationPosition: destination,
    estimatedJourneyMonths: template.baseMonths,
    nextMilestone: template.nextMilestone,
    biggestObstacle: template.obstacle,
    recommendedRoute: personalizeRoute(template.route, current),
  }
}

function inferDestination(current: string): string {
  const template = pickTemplate('', current)
  return template.route[template.route.length - 1] ?? 'AI-Augmented Strategist'
}

function personalizeRoute(route: string[], current: string): string[] {
  const steps = [...route]
  const first = steps[0]
  if (first && current.toLowerCase().includes(first.toLowerCase())) {
    steps[0] = current
  } else if (first && !steps.some((step) => current.toLowerCase().includes(step.toLowerCase()))) {
    steps.unshift(current)
  }
  return steps
}

/** Roadmap generated from resume scan + target role. */
export function buildCareerRoadmap(
  resumeText: string,
  currentPosition: string,
  destinationPosition: string
): CareerRoadmap {
  const current = normalizeRole(currentPosition)
  const destination = normalizeRole(destinationPosition)
  const template = pickTemplate(destination, current)

  return {
    currentPosition: current,
    destinationPosition: destination,
    estimatedJourneyMonths: adjustJourneyMonths(
      template.baseMonths,
      resumeText,
      current,
      destination
    ),
    nextMilestone: template.nextMilestone,
    biggestObstacle: template.obstacle,
    recommendedRoute: personalizeRoute(template.route, current),
  }
}

export function parseCareerRoadmap(value: unknown): CareerRoadmap | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  if (
    typeof record.currentPosition !== 'string' ||
    typeof record.destinationPosition !== 'string' ||
    typeof record.estimatedJourneyMonths !== 'number' ||
    typeof record.nextMilestone !== 'string' ||
    typeof record.biggestObstacle !== 'string' ||
    !Array.isArray(record.recommendedRoute) ||
    !record.recommendedRoute.every((step) => typeof step === 'string')
  ) {
    return null
  }

  return {
    currentPosition: record.currentPosition,
    destinationPosition: record.destinationPosition,
    estimatedJourneyMonths: record.estimatedJourneyMonths,
    nextMilestone: record.nextMilestone,
    biggestObstacle: record.biggestObstacle,
    recommendedRoute: record.recommendedRoute,
  }
}

export function buildRoadmapShareText(roadmap: CareerRoadmap): string {
  return [
    'AI Career Transition Roadmap',
    '',
    `${roadmap.currentPosition} → ${roadmap.destinationPosition}`,
    `Estimated journey: ${roadmap.estimatedJourneyMonths} months`,
    '',
    `Next milestone: ${roadmap.nextMilestone}`,
    `Biggest obstacle: ${roadmap.biggestObstacle}`,
    '',
    `Route: ${roadmap.recommendedRoute.join(' → ')}`,
  ].join('\n')
}
