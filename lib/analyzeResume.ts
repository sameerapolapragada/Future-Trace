import { buildCareerRoadmap } from '@/lib/careerRoadmap'
import type { CareerRoadmap } from '@/types/careerRoadmap'

export type AnalyzeResumeResult = {
  score: number
  freeSummary: string
  fullSummary: string
  roadmap: CareerRoadmap
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
  currentPosition: string,
  destinationPosition: string
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

  const roadmap = buildCareerRoadmap(resumeText, currentPosition, destinationPosition)
  const freeSummary = buildRoadmapSummary(roadmap)
  const fullSummary = `${freeSummary} Premium unlocks step-by-step weekly actions, skill-gap drills, and progress tracking across every stage of your route.`

  return { score, freeSummary, fullSummary, roadmap }
}

export function buildRoadmapSummary(roadmap: CareerRoadmap): string {
  const skillSprint = roadmap.immediate30DayTarget ?? '1-Month Skill Sprint'

  return `Your phased route from ${roadmap.currentPosition} to ${roadmap.destinationPosition} spans ${roadmap.estimatedJourneyMonths} months. Next up: ${skillSprint}. First sprint: ${roadmap.nextMilestone}`
}

/** @deprecated Use roadmap journey months in new UI; kept for legacy history rows. */
export function buildExposureSummary(score: number, jobTitle: string): string {
  const exposureBand =
    score >= 71
      ? 'immediate automation pressure'
      : score >= 36
        ? 'moderate task exposure'
        : 'lower near-term disruption risk'

  return `Your ${jobTitle} profile shows ${exposureBand} based on recurring task patterns, tooling references, and skill signals detected in your resume. Focus on strengthening judgment-heavy and cross-functional capabilities to improve long-term insulation.`
}

export function scoreGaugeColor(score: number): string {
  if (score <= 35) return '#34d399'
  if (score <= 70) return '#fbbf24'
  return '#f87171'
}

export type ExposureRiskLabel = 'Safe' | 'At Risk' | 'Vulnerable'

export function scoreExposureLabel(score: number): ExposureRiskLabel {
  if (score >= 71) return 'Vulnerable'
  if (score >= 36) return 'At Risk'
  return 'Safe'
}
