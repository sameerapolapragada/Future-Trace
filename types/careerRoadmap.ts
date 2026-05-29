/** Structured career transition output — core free-tier value proposition. */
export interface IntelligenceProfile {
  strengths: string[]
  emergingAdvantages: string[]
  structuralVulnerabilities: string[]
  highYieldOpportunityZones: string[]
}

export interface SkillMilestone {
  /** Tactical capability the user builds in this phase. */
  milestone: string
  /** Short phase label shown beneath the node (e.g. "Phase 1"). */
  phaseLabel: string
}

export interface CareerRoadmap {
  currentPosition: string
  destinationPosition: string
  estimatedJourneyMonths: number
  /** First 30-day action sprint copy (UI: "Your First 30-Day Action Sprint"). */
  nextMilestone: string
  /** Asymmetrical advantage framing (UI: "Primary Leverage Point"). */
  biggestObstacle: string
  skillAcquisitionPipeline: SkillMilestone[]
  /** Active skill sprint label (UI: "Next up" — e.g. 1-Month Skill Sprint). */
  immediate30DayTarget?: string
  intelligenceProfile?: IntelligenceProfile
}

export type ScanAnalysisPayload = {
  jobTitle: string
  summary: string
  roadmap: CareerRoadmap
  /** Retained for premium history / internal metrics; omitted from free-tier UI. */
  score?: number
  fullSummary?: string
  isPremium: boolean
}
