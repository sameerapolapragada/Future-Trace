import { createAdminClient } from '@/utils/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { MobileMatcherResult } from '@/types/mobileMatcher'

type MatcherProfile = {
  id: string
  is_premium: boolean
  token_balance: number
}

export type PersistMatcherScanInput = {
  supabase: SupabaseClient
  userId: string
  currentRole: string
  targetRole: string
  resumeText: string
  result: MobileMatcherResult
  useOneTimeToken: boolean
}

export type PersistMatcherScanResult =
  | { ok: true; tier: 'premium' | 'token' | 'free' }
  | { ok: false; status: number; error: string }

function summarizeGaps(result: MobileMatcherResult): string | null {
  const skills = result.pivot_roles.flatMap((role) => role.skills_missing).filter(Boolean)
  if (skills.length === 0) return null
  return [...new Set(skills)].slice(0, 6).join(', ')
}

async function loadMatcherProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<MatcherProfile | PersistMatcherScanResult> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, is_premium, token_balance')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    return { ok: false, status: 500, error: error.message }
  }

  if (!profile) {
    return { ok: false, status: 404, error: 'Profile not found.' }
  }

  return {
    id: profile.id,
    is_premium: Boolean(profile.is_premium),
    token_balance: typeof profile.token_balance === 'number' ? profile.token_balance : 0,
  }
}

async function decrementTokenBalance(userId: string, currentBalance: number): Promise<string | null> {
  try {
    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ token_balance: currentBalance - 1 })
      .eq('id', userId)
      .eq('token_balance', currentBalance)

    if (error) {
      return error.message
    }

    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Could not decrement token balance.'
  }
}

export async function persistMatcherScan(
  input: PersistMatcherScanInput
): Promise<PersistMatcherScanResult> {
  const profileResult = await loadMatcherProfile(input.supabase, input.userId)
  if ('ok' in profileResult && profileResult.ok === false) {
    return profileResult
  }

  const profile = profileResult as MatcherProfile

  if (input.useOneTimeToken && !profile.is_premium) {
    if (profile.token_balance <= 0) {
      return {
        ok: false,
        status: 402,
        error: 'No one-time scan credits remaining. Purchase a unlock pass or upgrade to Premium.',
      }
    }
  }

  const tier: 'premium' | 'token' | 'free' = profile.is_premium
    ? 'premium'
    : input.useOneTimeToken
      ? 'token'
      : 'free'

  const { error: insertError } = await input.supabase.from('user_resume_scans').insert({
    user_id: input.userId,
    current_role_input: input.currentRole,
    target_role_input: input.targetRole,
    calculated_risk_score: input.result.market_risk_score,
    resume_excerpt: input.resumeText ? input.resumeText.slice(0, 5000) : null,
    tier,
    gaps_summary: summarizeGaps(input.result),
    matcher_payload: input.result,
  })

  if (insertError) {
    return { ok: false, status: 500, error: insertError.message }
  }

  if (input.useOneTimeToken && !profile.is_premium) {
    const decrementError = await decrementTokenBalance(input.userId, profile.token_balance)
    if (decrementError) {
      console.error('[mobile/matcher] token decrement failed:', decrementError)
      return { ok: false, status: 500, error: decrementError }
    }
  }

  return { ok: true, tier }
}
