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

export function calculateMarketRiskIndex(currentRole: string, targetRole: string): number {
  const current = currentRole.trim().toLowerCase()
  const target = targetRole.trim().toLowerCase()

  let score = 48 + (hashRoles(current, target) % 18)

  if (includesAny(current, HIGH_EXPOSURE_TERMS)) score += 22
  else if (includesAny(current, RESILIENT_TERMS)) score -= 12

  if (includesAny(target, RESILIENT_TERMS)) score -= 8
  if (current && target && current === target) score += 14

  return Math.max(12, Math.min(96, Math.round(score)))
}

export function buildRiskNarrative(
  currentRole: string,
  targetRole: string,
  riskIndex: number
): string {
  const current = currentRole.trim() || 'your current role'
  const target = targetRole.trim() || 'your target role'

  if (riskIndex >= 70) {
    return `${current} sits in a high-automation exposure band while pivoting toward ${target}. Repetitive execution tasks, reporting loops, and tool-mediated workflows in your current stack are most vulnerable to agent substitution over the next 18–24 months.`
  }

  if (riskIndex >= 45) {
    return `The transition from ${current} to ${target} carries moderate disruption risk. Core deliverables are partially automatable, but judgment-heavy coordination and stakeholder alignment still protect parts of your scope—if you reposition toward AI-augmented ownership fast.`
  }

  return `${current} shows relative resilience on the path to ${target}, but adjacent roles are compressing salary bands as AI tooling matures. The risk is less about immediate replacement and more about falling behind peers who operationalize automation first.`
}

export function riskLevelLabel(riskIndex: number): string {
  if (riskIndex >= 70) return 'Elevated exposure'
  if (riskIndex >= 45) return 'Moderate exposure'
  return 'Managed exposure'
}

export function riskLevelColor(riskIndex: number): string {
  if (riskIndex >= 70) return '#F87171'
  if (riskIndex >= 45) return '#FDBB2D'
  return '#22D3EE'
}
