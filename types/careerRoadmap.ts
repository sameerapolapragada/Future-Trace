/** Structured career transition output — core free-tier value proposition. */
export interface CareerRoadmap {
  currentPosition: string
  destinationPosition: string
  estimatedJourneyMonths: number
  nextMilestone: string
  biggestObstacle: string
  recommendedRoute: string[]
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
