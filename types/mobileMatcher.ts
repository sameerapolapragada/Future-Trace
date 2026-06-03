export type MobileMatcherPivotRole = {
  title: string
  salary_range: string
  match_percent: number
  skills_missing: string[]
}

export type MobileMatcherResult = {
  market_risk_score: number
  risk_rationale: string
  pivot_roles: MobileMatcherPivotRole[]
}
