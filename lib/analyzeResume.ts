export type AnalyzeResumeResult = {
  score: number
  freeSummary: string
  fullSummary: string
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
  'inventory',
  'copywriting',
  'moderation',
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

export function analyzeResumeLocally(
  resumeText: string,
  jobTitle: string
): AnalyzeResumeResult {
  const lower = resumeText.toLowerCase()
  let score = 52

  for (const signal of AUTOMATION_SIGNALS) {
    if (lower.includes(signal)) score += 7
  }

  for (const signal of RESILIENCE_SIGNALS) {
    if (lower.includes(signal)) score -= 5
  }

  if (resumeText.length < 200) score += 6
  if (resumeText.length > 1200) score -= 4

  score = Math.min(100, Math.max(8, Math.round(score)))

  const exposureBand =
    score >= 71 ? 'immediate automation pressure' : score >= 36 ? 'moderate task exposure' : 'lower near-term disruption risk'

  const freeSummary = `Your ${jobTitle} profile shows ${exposureBand} based on recurring task patterns, tooling references, and skill signals detected in your resume. Focus on strengthening judgment-heavy and cross-functional capabilities to improve long-term insulation.`

  const fullSummary = `${freeSummary} Premium analysis maps each resume bullet to automation timelines, flags three priority skill gaps, and generates a daily micro-learning sequence aimed at reducing your vulnerability score below 15% within 30 days.`

  return { score, freeSummary, fullSummary }
}

export function scoreGaugeColor(score: number): string {
  if (score <= 35) return '#34d399'
  if (score <= 70) return '#fbbf24'
  return '#f87171'
}
