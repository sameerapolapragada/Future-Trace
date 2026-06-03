export type TransitionRole = {
  title: string
  salaryRangeMin: number
  salaryRangeMax: number
  matchPercent: number
  skillGaps: string[]
}

export type MatcherScanPayload = {
  marketRiskScore: number
  riskRationale: string
  matchedRoles: TransitionRole[]
}

export type MatcherScanResponse = {
  scanId: string
  currentRole: string
  targetRole: string
  marketRiskScore: number
  riskRationale: string
  matchedRoles: TransitionRole[]
  isPaid: boolean
  tokenBalance?: number
}
