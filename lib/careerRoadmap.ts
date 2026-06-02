import { formatJobTitle } from '@/lib/formatJobTitle'
import { parseSkillTask } from '@/lib/enrichSkillTasks'
import { enrichSkillPipeline } from '@/lib/premiumRoadmapTasks'
import type { CareerRoadmap, IntelligenceProfile, SkillMilestone } from '@/types/careerRoadmap'

const DEFAULT_SKILL_SPRINT = '1-Month Skill Sprint'

type RouteTemplate = {
  match: RegExp
  pipeline: SkillMilestone[]
  defaultDestination: string
  leveragePoint: string
  actionSprint: string
  baseMonths: number
}

const SALESFORCE_TO_PM_PIPELINE: SkillMilestone[] = [
  { milestone: 'AI Automation Proof-of-Concept', phaseLabel: 'Phase 1' },
  { milestone: 'Data & API Mechanics', phaseLabel: 'Phase 2' },
  { milestone: 'Product Discovery Foundations', phaseLabel: 'Phase 3' },
  { milestone: 'AI Model Evaluation', phaseLabel: 'Phase 4' },
]

const ROUTE_TEMPLATES: RouteTemplate[] = [
  {
    match: /product|pm|program manager/i,
    pipeline: [
      { milestone: 'AI Workflow Prototyping', phaseLabel: 'Phase 1' },
      { milestone: 'Stakeholder Discovery & Synthesis', phaseLabel: 'Phase 2' },
      { milestone: 'MVP Scoping & Prioritization', phaseLabel: 'Phase 3' },
      { milestone: 'Product Metrics & Iteration', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Product Manager',
    leveragePoint:
      'Bridging operational workflow mechanics directly into AI-driven user behavior tracking.',
    actionSprint:
      'Deploy 1 internal AI automation prototype using your existing stack to check off your first product lifecycle milestone.',
    baseMonths: 18,
  },
  {
    match: /data|analyst|analytics|bi/i,
    pipeline: [
      { milestone: 'Automated Reporting Foundations', phaseLabel: 'Phase 1' },
      { milestone: 'Predictive Analytics Literacy', phaseLabel: 'Phase 2' },
      { milestone: 'Insight Narrative & Storytelling', phaseLabel: 'Phase 3' },
      { milestone: 'AI Strategy Synthesis', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Strategy Analyst',
    leveragePoint:
      'Your recurring reporting cadence is the perfect sandbox to prove AI-augmented insight velocity.',
    actionSprint:
      'Ship one automated insight workflow that replaces a manual weekly report and share results with one stakeholder.',
    baseMonths: 14,
  },
  {
    match: /engineer|developer|software|devops|sre/i,
    pipeline: [
      { milestone: 'LLM Integration Fundamentals', phaseLabel: 'Phase 1' },
      { milestone: 'Agent Workflow Orchestration', phaseLabel: 'Phase 2' },
      { milestone: 'Production Observability for AI', phaseLabel: 'Phase 3' },
      { milestone: 'AI Systems Architecture', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Systems Engineer',
    leveragePoint:
      'Production engineering discipline gives you a credibility edge when wiring LLM features safely.',
    actionSprint:
      'Deliver one production feature integrating an LLM or agent workflow with observability and rollback.',
    baseMonths: 16,
  },
  {
    match: /market|content|brand|growth/i,
    pipeline: [
      { milestone: 'AI-Assisted Campaign Iteration', phaseLabel: 'Phase 1' },
      { milestone: 'Audience Signal Analysis', phaseLabel: 'Phase 2' },
      { milestone: 'Growth Experiment Design', phaseLabel: 'Phase 3' },
      { milestone: 'AI Marketing Strategy', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Marketing Strategist',
    leveragePoint:
      'Campaign iteration speed becomes an asymmetrical advantage when you own positioning while AI handles variants.',
    actionSprint:
      'Launch a micro-campaign where AI assists creative iteration but you own the narrative and success metric.',
    baseMonths: 12,
  },
  {
    match: /admin|assistant|coordinator|operations|ops/i,
    pipeline: [
      { milestone: 'Process Automation Proof-of-Concept', phaseLabel: 'Phase 1' },
      { milestone: 'Cross-Functional Workflow Mapping', phaseLabel: 'Phase 2' },
      { milestone: 'Operational Metrics & Reporting', phaseLabel: 'Phase 3' },
      { milestone: 'AI Operations Leadership', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Operations Manager',
    leveragePoint:
      'Deep familiarity with recurring workflows lets you automate what others only document.',
    actionSprint:
      'Document and automate one recurring workflow end-to-end, then present time saved to your manager.',
    baseMonths: 15,
  },
  {
    match: /design|ux|ui|creative/i,
    pipeline: [
      { milestone: 'AI-Assisted Design Exploration', phaseLabel: 'Phase 1' },
      { milestone: 'Human-Centered Interaction Patterns', phaseLabel: 'Phase 2' },
      { milestone: 'Design System for AI Products', phaseLabel: 'Phase 3' },
      { milestone: 'AI Experience Strategy', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Experience Designer',
    leveragePoint:
      'Human-led design judgment is the differentiator as generative tools commoditize surface-level visuals.',
    actionSprint:
      'Publish a case study showing human-led design decisions on an AI-assisted project within 30 days.',
    baseMonths: 14,
  },
  {
    match: /sales|account|customer success|support/i,
    pipeline: [
      { milestone: 'AI-Assisted Discovery Playbooks', phaseLabel: 'Phase 1' },
      { milestone: 'Solution Scoping & Demos', phaseLabel: 'Phase 2' },
      { milestone: 'Retention Signal Analysis', phaseLabel: 'Phase 3' },
      { milestone: 'AI Solutions Consulting', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Solutions Consultant',
    leveragePoint:
      'Relationship context you already hold converts faster into consultative, AI-literate advisory wins.',
    actionSprint:
      'Close or retain one account using an AI-assisted discovery playbook you authored this month.',
    baseMonths: 13,
  },
  {
    match: /legal|compliance|risk|finance|account/i,
    pipeline: [
      { milestone: 'AI Policy & Control Frameworks', phaseLabel: 'Phase 1' },
      { milestone: 'Risk Assessment for AI Systems', phaseLabel: 'Phase 2' },
      { milestone: 'Governance Workflow Design', phaseLabel: 'Phase 3' },
      { milestone: 'AI Governance Leadership', phaseLabel: 'Phase 4' },
    ],
    defaultDestination: 'AI Governance Lead',
    leveragePoint:
      'Regulatory judgment you exercise daily becomes the trust layer enterprises need for AI adoption.',
    actionSprint:
      'Draft an AI-use policy or control checklist for your function and circulate it for feedback.',
    baseMonths: 20,
  },
]

const DEFAULT_TEMPLATE: RouteTemplate = {
  match: /.*/,
  pipeline: [
    { milestone: 'AI Task Redesign Fundamentals', phaseLabel: 'Phase 1' },
    { milestone: 'Workflow Automation Proof-of-Concept', phaseLabel: 'Phase 2' },
    { milestone: 'Cross-Functional Influence', phaseLabel: 'Phase 3' },
    { milestone: 'AI-Augmented Strategy', phaseLabel: 'Phase 4' },
  ],
  defaultDestination: 'AI-Augmented Strategist',
  leveragePoint:
    'Existing domain expertise is your fastest path to AI-augmented outcomes — not starting from zero.',
  actionSprint:
    'Identify one high-value task cluster to redesign with AI assistance and complete a proof-of-concept in 30 days.',
  baseMonths: 16,
}

function normalizeRole(value: string): string {
  return formatJobTitle(value) || 'Your current role'
}

function isSalesforceToProductTransition(current: string, destination: string): boolean {
  const curr = current.toLowerCase()
  const dest = destination.toLowerCase()
  return /(salesforce|crm|administrator|admin)/i.test(curr) && /product|pm/i.test(dest)
}

function pickTemplate(destination: string, current: string): RouteTemplate {
  if (isSalesforceToProductTransition(current, destination)) {
    return {
      ...ROUTE_TEMPLATES[0],
      pipeline: SALESFORCE_TO_PM_PIPELINE,
      defaultDestination: 'AI Product Manager',
    }
  }

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

function uniqueItems(items: string[]): string[] {
  return [...new Set(items)]
}

function buildIntelligenceProfile(
  template: RouteTemplate,
  current: string,
  destination: string,
  resumeText?: string,
  leveragePoint?: string
): IntelligenceProfile {
  const lower = (resumeText ?? '').toLowerCase()

  const strengths: string[] = [
    `Domain context in ${current} transfers directly to AI-augmented workflows`,
  ]

  for (const signal of RESILIENCE_SIGNALS) {
    if (lower.includes(signal)) {
      strengths.push(`Resume highlights ${signal} — a high-judgment capability under AI pressure`)
    }
  }

  if (/\b(senior|lead|principal|director|head of)\b/i.test(current)) {
    strengths.push('Scope of ownership positions you to sponsor internal AI pilots')
  }

  const emergingAdvantages = [
    leveragePoint ?? template.leveragePoint,
    `Destination role (${destination}) aligns with adjacent skills already in your profile`,
    `Phased capability route reduces ramp time versus a cold transition into ${destination}`,
  ]

  const structuralVulnerabilities: string[] = [
    'Task clusters with repetitive documentation or reporting remain automate-prone',
  ]

  for (const signal of AUTOMATION_SIGNALS) {
    if (lower.includes(signal)) {
      structuralVulnerabilities.push(
        `"${signal}" references suggest elevated near-term automation exposure`
      )
    }
  }

  if (lower.length > 0 && lower.length < 200) {
    structuralVulnerabilities.push('Thin resume signal density limits defensible differentiation')
  }

  const nextCapability = template.pipeline[1]?.milestone ?? 'Workflow Automation Proof-of-Concept'
  const highYieldOpportunityZones = [
    `First internal win mapped to ${destination} hiring criteria`,
    'Cross-functional visibility by shipping one AI-assisted workflow this quarter',
    'Portfolio artifact proving human-led judgment on an AI-augmented deliverable',
    `Next capability milestone: ${nextCapability}`,
  ]

  return {
    strengths: uniqueItems(strengths).slice(0, 4),
    emergingAdvantages: uniqueItems(emergingAdvantages).slice(0, 4),
    structuralVulnerabilities: uniqueItems(structuralVulnerabilities).slice(0, 4),
    highYieldOpportunityZones: uniqueItems(highYieldOpportunityZones).slice(0, 4),
  }
}

function parseIntelligenceProfile(value: unknown): IntelligenceProfile | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const keys = [
    'strengths',
    'emergingAdvantages',
    'structuralVulnerabilities',
    'highYieldOpportunityZones',
  ] as const

  for (const key of keys) {
    const list = record[key]
    if (!Array.isArray(list) || !list.every((item: unknown) => typeof item === 'string')) {
      return null
    }
  }

  return {
    strengths: record.strengths as string[],
    emergingAdvantages: record.emergingAdvantages as string[],
    structuralVulnerabilities: record.structuralVulnerabilities as string[],
    highYieldOpportunityZones: record.highYieldOpportunityZones as string[],
  }
}

function parseSkillMilestone(value: unknown): SkillMilestone | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  if (typeof record.milestone !== 'string' || typeof record.phaseLabel !== 'string') {
    return null
  }

  const tasks = Array.isArray(record.tasks)
    ? record.tasks
        .map((task) => parseSkillTask(task))
        .filter((task): task is NonNullable<ReturnType<typeof parseSkillTask>> => task !== null)
    : undefined

  return {
    milestone: record.milestone,
    phaseLabel: record.phaseLabel,
    tasks,
  }
}

function parseSkillAcquisitionPipeline(value: unknown): SkillMilestone[] | null {
  if (!Array.isArray(value) || value.length === 0) return null

  const pipeline = value.map(parseSkillMilestone).filter((step): step is SkillMilestone => step !== null)
  return pipeline.length === value.length ? pipeline : null
}

function migrateLegacyRecommendedRoute(value: unknown): SkillMilestone[] | null {
  if (!Array.isArray(value) || value.length === 0) return null
  if (!value.every((step) => typeof step === 'string')) return null

  return value.map((step, index) => ({
    milestone: step,
    phaseLabel: `Phase ${index + 1}`,
  }))
}

function personalizeActionSprint(
  base: string,
  resumeText: string | undefined,
  destination: string
): string {
  const lower = (resumeText ?? '').toLowerCase()
  const dest = destination.toLowerCase()

  if (/salesforce|crm/i.test(lower) && /product|pm/i.test(dest)) {
    return 'Deploy 1 internal AI automation prototype using your existing Salesforce framework to check off your first product lifecycle milestone.'
  }

  if (/salesforce|crm/i.test(lower)) {
    return 'Deploy 1 AI-assisted workflow inside your existing Salesforce framework and document the before/after cycle time.'
  }

  return base
}

function personalizeLeveragePoint(
  base: string,
  resumeText: string | undefined,
  current: string
): string {
  const lower = (resumeText ?? '').toLowerCase()

  if (/salesforce|crm/i.test(lower)) {
    return 'Bridging operational Salesforce workflow mechanics directly into AI-driven user behavior tracking.'
  }

  if (/excel|spreadsheet|sheets/i.test(lower)) {
    return 'Turning spreadsheet fluency into rapid AI prototype cycles others in your org cannot match.'
  }

  if (/\b(senior|lead|principal|director)\b/i.test(current)) {
    return `${base} Your leadership scope accelerates adoption when you model the first win.`
  }

  return base
}

function buildRoadmapFields(
  template: RouteTemplate,
  current: string,
  destination: string,
  resumeText?: string,
  months?: number
): CareerRoadmap {
  const leveragePoint = personalizeLeveragePoint(template.leveragePoint, resumeText, current)

  return {
    currentPosition: current,
    destinationPosition: destination,
    estimatedJourneyMonths: months ?? template.baseMonths,
    nextMilestone: personalizeActionSprint(template.actionSprint, resumeText, destination),
    biggestObstacle: leveragePoint,
    skillAcquisitionPipeline: enrichSkillPipeline(template.pipeline.map((step) => ({ ...step }))),
    immediate30DayTarget: DEFAULT_SKILL_SPRINT,
    intelligenceProfile: buildIntelligenceProfile(
      template,
      current,
      destination,
      resumeText,
      leveragePoint
    ),
  }
}

/** Default roadmap when a free user lands on the dashboard (profile-only, no scan yet). */
export function buildDefaultCareerRoadmap(
  currentPosition: string,
  destinationPosition?: string
): CareerRoadmap {
  const current = normalizeRole(currentPosition)
  const destination = normalizeRole(destinationPosition || inferDestination(current))
  const template = pickTemplate(destination, current)

  return buildRoadmapFields(template, current, destination)
}

function inferDestination(current: string): string {
  const template = pickTemplate('', current)
  return template.defaultDestination
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
  const months = adjustJourneyMonths(template.baseMonths, resumeText, current, destination)

  return buildRoadmapFields(template, current, destination, resumeText, months)
}

export function ensureIntelligenceProfile(roadmap: CareerRoadmap): IntelligenceProfile {
  if (roadmap.intelligenceProfile) {
    return roadmap.intelligenceProfile
  }

  const template = pickTemplate(roadmap.destinationPosition, roadmap.currentPosition)

  return buildIntelligenceProfile(
    template,
    roadmap.currentPosition,
    roadmap.destinationPosition,
    undefined,
    roadmap.biggestObstacle
  )
}

export function parseCareerRoadmap(value: unknown): CareerRoadmap | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  if (
    typeof record.currentPosition !== 'string' ||
    typeof record.destinationPosition !== 'string' ||
    typeof record.estimatedJourneyMonths !== 'number' ||
    typeof record.nextMilestone !== 'string' ||
    typeof record.biggestObstacle !== 'string'
  ) {
    return null
  }

  const skillAcquisitionPipeline =
    parseSkillAcquisitionPipeline(record.skillAcquisitionPipeline) ??
    migrateLegacyRecommendedRoute(record.recommendedRoute)

  if (!skillAcquisitionPipeline) return null

  return {
    currentPosition: record.currentPosition,
    destinationPosition: record.destinationPosition,
    estimatedJourneyMonths: record.estimatedJourneyMonths,
    nextMilestone: record.nextMilestone,
    biggestObstacle: record.biggestObstacle,
    skillAcquisitionPipeline,
    immediate30DayTarget:
      typeof record.immediate30DayTarget === 'string'
        ? record.immediate30DayTarget
        : DEFAULT_SKILL_SPRINT,
    intelligenceProfile:
      parseIntelligenceProfile(record.intelligenceProfile) ??
      buildIntelligenceProfile(
        pickTemplate(record.destinationPosition, record.currentPosition),
        record.currentPosition,
        record.destinationPosition,
        undefined,
        record.biggestObstacle
      ),
  }
}

export function buildRoadmapShareText(roadmap: CareerRoadmap): string {
  const skillSprint = roadmap.immediate30DayTarget ?? DEFAULT_SKILL_SPRINT
  const pipeline = roadmap.skillAcquisitionPipeline
    .map((step) => `${step.phaseLabel}: ${step.milestone}`)
    .join(' → ')

  return [
    'AI Career Transition Roadmap',
    '',
    `${roadmap.currentPosition} → ${roadmap.destinationPosition}`,
    `Next up: ${skillSprint}`,
    `Career runway: ${roadmap.estimatedJourneyMonths} months`,
    '',
    `First 30-day action sprint: ${roadmap.nextMilestone}`,
    `Primary leverage point: ${roadmap.biggestObstacle}`,
    '',
    `Skill acquisition pipeline: ${pipeline}`,
  ].join('\n')
}
