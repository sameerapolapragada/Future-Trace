import { createAdminClient } from '@/utils/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { MobileMatcherResult } from '@/types/mobileMatcher'

type MatcherProfile = {
  id: string
  is_premium: boolean
  token_balance: number
  token_balance_available: boolean
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

const TOKEN_BALANCE_MIGRATION =
  'supabase/migrations/20260603140000_profiles_token_balance.sql'
const USER_RESUME_SCANS_SCRIPT = 'supabase/scripts/add_user_resume_scans.sql'

function isMissingUserResumeScansTable(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('user_resume_scans') && lower.includes('schema cache')
}

function summarizeGaps(result: MobileMatcherResult): string | null {
  const skills = result.pivot_roles.flatMap((role) => role.skills_missing).filter(Boolean)
  if (skills.length === 0) return null
  return [...new Set(skills)].slice(0, 6).join(', ')
}

function isMissingTokenBalanceColumn(message: string): boolean {
  return message.toLowerCase().includes('token_balance')
}

async function loadMatcherProfile(
  supabase: SupabaseClient,
  userId: string,
  needsTokenBalance: boolean
): Promise<MatcherProfile | PersistMatcherScanResult> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, is_premium')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    return { ok: false, status: 500, error: error.message }
  }

  if (!profile) {
    return { ok: false, status: 404, error: 'Profile not found.' }
  }

  if (!needsTokenBalance) {
    return {
      id: profile.id,
      is_premium: Boolean(profile.is_premium),
      token_balance: 0,
      token_balance_available: false,
    }
  }

  const { data: tokenRow, error: tokenError } = await supabase
    .from('profiles')
    .select('token_balance')
    .eq('id', userId)
    .maybeSingle()

  if (tokenError) {
    if (isMissingTokenBalanceColumn(tokenError.message)) {
      return {
        ok: false,
        status: 503,
        error:
          `profiles.token_balance is missing on your Supabase dev branch. ` +
          `Run ${TOKEN_BALANCE_MIGRATION} in the SQL Editor, then retry.`,
      }
    }
    return { ok: false, status: 500, error: tokenError.message }
  }

  return {
    id: profile.id,
    is_premium: Boolean(profile.is_premium),
    token_balance: typeof tokenRow?.token_balance === 'number' ? tokenRow.token_balance : 0,
    token_balance_available: true,
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
  const profileResult = await loadMatcherProfile(
    input.supabase,
    input.userId,
    input.useOneTimeToken
  )
  if ('ok' in profileResult && profileResult.ok === false) {
    return profileResult
  }

  const profile = profileResult as MatcherProfile

  if (input.useOneTimeToken && !profile.is_premium) {
    if (!profile.token_balance_available) {
      return {
        ok: false,
        status: 503,
        error:
          `profiles.token_balance is missing on your Supabase dev branch. ` +
          `Run ${TOKEN_BALANCE_MIGRATION} in the SQL Editor, then retry.`,
      }
    }

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
    if (isMissingUserResumeScansTable(insertError.message)) {
      return {
        ok: false,
        status: 503,
        error:
          `public.user_resume_scans is missing on your Supabase dev branch. ` +
          `Run ${USER_RESUME_SCANS_SCRIPT} in the SQL Editor, then retry.`,
      }
    }
    return { ok: false, status: 500, error: insertError.message }
  }

  if (input.useOneTimeToken && !profile.is_premium && profile.token_balance_available) {
    const decrementError = await decrementTokenBalance(input.userId, profile.token_balance)
    if (decrementError) {
      console.error('[mobile/matcher] token decrement failed:', decrementError)
      return { ok: false, status: 500, error: decrementError }
    }
  }

  return { ok: true, tier }
}
