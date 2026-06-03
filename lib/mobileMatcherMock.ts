import type { MobileMatcherUserContext } from '@/lib/mobileMatcherPrompt'
import type { MobileMatcherResult } from '@/types/mobileMatcher'

const MOCK_LATENCY_MS = 1500

const HIGH_EXPOSURE_TERMS = [
  'analyst',
  'coordinator',
  'assistant',
  'support',
  'data entry',
  'customer service',
  'bookkeeper',
  'recruiter',
]

const RESILIENT_TERMS = [
  'director',
  'principal',
  'architect',
  'lead',
  'head',
  'strategist',
  'engineer',
]

export function isMockAiEnabled(): boolean {
  return process.env.ENABLE_MOCK_AI === 'true'
}

export function mockAiLatencyMs(): number {
  return MOCK_LATENCY_MS
}

export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

function hashRoles(currentRole: string, targetRole: string) {
  const seed = `${currentRole}|${targetRole}`.toLowerCase()
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function normalizeRole(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function isAiRiskManagerTarget(targetRole: string): boolean {
  return normalizeRole(targetRole) === 'ai risk manager'
}

function calculateMockRiskScore(currentRole: string, targetRole: string): number {
  if (isAiRiskManagerTarget(targetRole)) {
    return 18
  }

  const current = currentRole.trim().toLowerCase()
  const target = targetRole.trim().toLowerCase()

  let score = 48 + (hashRoles(current, target) % 18)

  if (includesAny(current, HIGH_EXPOSURE_TERMS)) score += 22
  else if (includesAny(current, RESILIENT_TERMS)) score -= 12

  if (includesAny(target, RESILIENT_TERMS)) score -= 8
  if (current && target && current === target) score += 14

  return Math.max(12, Math.min(96, Math.round(score)))
}

function mockRiskRationale(currentRole: string, targetRole: string, riskIndex: number): string {
  const current = currentRole.trim() || 'your current role'
  const target = targetRole.trim() || 'your target role'

  if (isAiRiskManagerTarget(targetRole)) {
    return `${target} aligns with governance-heavy, human-in-the-loop accountability that resists full automation displacement from ${current}. Your transition path benefits from low routine-task exposure if you emphasize model oversight, policy design, and audit-ready decision trails.`
  }

  if (riskIndex >= 70) {
    return `${current} sits in a high-automation exposure band while pivoting toward ${target}. Repetitive execution tasks and reporting loops are most vulnerable to agent substitution over the next 18–24 months.`
  }

  if (riskIndex >= 45) {
    return `The transition from ${current} to ${target} carries moderate disruption risk. Judgment-heavy coordination still protects parts of your scope if you reposition toward AI-augmented ownership quickly.`
  }

  return `${current} shows relative resilience on the path to ${target}, but adjacent roles are compressing salary bands as AI tooling matures. The main risk is falling behind peers who operationalize automation first.`
}

function aiRiskManagerPivotRoles(): MobileMatcherResult['pivot_roles'] {
  return [
    {
      title: 'AI Compliance Director',
      salary_range: '$165k–$210k',
      match_percent: 82,
      skills_missing: ['EU AI Act control mapping', 'Model risk governance frameworks'],
    },
    {
      title: 'Enterprise Risk Architect',
      salary_range: '$155k–$198k',
      match_percent: 76,
      skills_missing: ['Third-party model vendor due diligence', 'Quantitative scenario stress testing'],
    },
    {
      title: 'Model Auditor',
      salary_range: '$140k–$185k',
      match_percent: 71,
      skills_missing: ['SHAP/LIME interpretability reviews', 'Audit trail automation in ML pipelines'],
    },
  ]
}

function mockPivotRoles(targetRole: string, seed: number): MobileMatcherResult['pivot_roles'] {
  if (isAiRiskManagerTarget(targetRole)) {
    return aiRiskManagerPivotRoles()
  }

  const target = targetRole.trim() || 'Target Role'

  return [
    {
      title: `${target} — Strategy Track`,
      salary_range: '$98k–$132k',
      match_percent: 68 + (seed % 12),
      skills_missing: ['Stakeholder AI briefings', 'Workflow automation design'],
    },
    {
      title: `${target} — Technical Track`,
      salary_range: '$105k–$145k',
      match_percent: 58 + (seed % 15),
      skills_missing: ['Python for analytics', 'LLM evaluation basics'],
    },
    {
      title: `${target} — Operations Track`,
      salary_range: '$88k–$118k',
      match_percent: 74 + (seed % 10),
      skills_missing: ['Change management', 'Cross-functional program delivery'],
    },
  ]
}

/** Deterministic matcher output for dev/testing — no Gemini API calls. */
export function generateMobileMatcherMock(context: MobileMatcherUserContext): MobileMatcherResult {
  const currentRole = context.currentRole.trim() || 'Current Role'
  const targetRole = context.targetRole.trim() || 'Target Role'
  const seed = hashRoles(currentRole, targetRole)
  const market_risk_score = calculateMockRiskScore(currentRole, targetRole)

  return {
    market_risk_score,
    risk_rationale: mockRiskRationale(currentRole, targetRole, market_risk_score),
    pivot_roles: mockPivotRoles(targetRole, seed),
  }
}
