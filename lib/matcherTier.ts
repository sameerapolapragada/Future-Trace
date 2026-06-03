export type MatcherProfileTier = {
  web_tier?: string | null
  mobile_tier?: string | null
  token_balance?: number | null
  is_premium?: boolean | null
}

export function hasActiveMatcherSubscription(profile: MatcherProfileTier): boolean {
  if (profile.web_tier === 'pro') return true
  if (profile.mobile_tier === 'subscriber') return true
  if (profile.is_premium) return true
  return false
}

export function hasMatcherScanCredits(profile: MatcherProfileTier): boolean {
  return (profile.token_balance ?? 0) > 0
}

/** Paid tier: active subscription or at least one scan token. */
export function isMatcherPaidTier(profile: MatcherProfileTier): boolean {
  return hasActiveMatcherSubscription(profile) || hasMatcherScanCredits(profile)
}

/** Use a token when user has credits but no active subscription. */
export function shouldConsumeMatcherToken(profile: MatcherProfileTier): boolean {
  return !hasActiveMatcherSubscription(profile) && hasMatcherScanCredits(profile)
}
