import type { MatcherProfileTier } from '@/lib/matcherTier'
import type { SupabaseClient } from '@supabase/supabase-js'

export type MatcherProfile = MatcherProfileTier & { id: string }

export type DashboardProfile = MatcherProfile & {
  email: string
  full_name: string | null
  job_role: string | null
}

export const MATCHER_PROFILE_COLUMNS = 'id, is_premium, web_tier, mobile_tier, token_balance'
export const BASE_PROFILE_COLUMNS = 'id, is_premium'
export const DASHBOARD_PROFILE_BASE_COLUMNS = 'email, full_name, job_role, is_premium'
export const DASHBOARD_PROFILE_MATCHER_COLUMNS = `${DASHBOARD_PROFILE_BASE_COLUMNS}, web_tier, mobile_tier, token_balance`

export function isMissingMatcherColumnError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('web_tier') ||
    lower.includes('mobile_tier') ||
    lower.includes('token_balance') ||
    lower.includes('user_resume_scans') ||
    (lower.includes('column') && lower.includes('does not exist'))
  )
}

export function profileFromRow(row: Record<string, unknown>): MatcherProfile {
  return {
    id: String(row.id),
    is_premium: Boolean(row.is_premium),
    web_tier: (row.web_tier as string | null | undefined) ?? 'free',
    mobile_tier: (row.mobile_tier as string | null | undefined) ?? 'free',
    token_balance: (row.token_balance as number | null | undefined) ?? 0,
  }
}

export function dashboardProfileFromRow(row: Record<string, unknown>): DashboardProfile {
  return {
    ...profileFromRow(row),
    email: String(row.email ?? ''),
    full_name: (row.full_name as string | null | undefined) ?? null,
    job_role: (row.job_role as string | null | undefined) ?? null,
  }
}

export async function selectMatcherProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ profile: MatcherProfile | null; error: string | null }> {
  const withMatcherColumns = await supabase
    .from('profiles')
    .select(MATCHER_PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (!withMatcherColumns.error) {
    return {
      profile: withMatcherColumns.data ? profileFromRow(withMatcherColumns.data) : null,
      error: null,
    }
  }

  if (!isMissingMatcherColumnError(withMatcherColumns.error.message)) {
    return { profile: null, error: withMatcherColumns.error.message }
  }

  const withBaseColumns = await supabase
    .from('profiles')
    .select(BASE_PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (withBaseColumns.error) {
    return { profile: null, error: withBaseColumns.error.message }
  }

  return {
    profile: withBaseColumns.data ? profileFromRow(withBaseColumns.data) : null,
    error: null,
  }
}

export async function selectDashboardProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ profile: DashboardProfile | null; error: string | null }> {
  const withMatcherColumns = await supabase
    .from('profiles')
    .select(DASHBOARD_PROFILE_MATCHER_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (!withMatcherColumns.error) {
    return {
      profile: withMatcherColumns.data
        ? dashboardProfileFromRow(withMatcherColumns.data)
        : null,
      error: null,
    }
  }

  if (!isMissingMatcherColumnError(withMatcherColumns.error.message)) {
    return { profile: null, error: withMatcherColumns.error.message }
  }

  const withBaseColumns = await supabase
    .from('profiles')
    .select(DASHBOARD_PROFILE_BASE_COLUMNS)
    .eq('id', userId)
    .maybeSingle()

  if (withBaseColumns.error) {
    return { profile: null, error: withBaseColumns.error.message }
  }

  return {
    profile: withBaseColumns.data ? dashboardProfileFromRow(withBaseColumns.data) : null,
    error: null,
  }
}

const MIGRATION_HINT =
  'Matcher database columns are not set up yet. Apply the latest Supabase migrations (20260603120000_matcher_tiers_and_scans.sql).'

export async function incrementScanTokenBalance(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ tokenBalance: number; error: string | null }> {
  const { profile, error: loadError } = await selectMatcherProfile(supabase, userId)

  if (loadError) {
    return { tokenBalance: 0, error: loadError }
  }

  const nextBalance = (profile?.token_balance ?? 0) + 1
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ token_balance: nextBalance })
    .eq('id', userId)
    .select('token_balance')
    .single()

  if (!updateError) {
    return { tokenBalance: updated?.token_balance ?? nextBalance, error: null }
  }

  if (isMissingMatcherColumnError(updateError.message)) {
    return { tokenBalance: 0, error: MIGRATION_HINT }
  }

  return { tokenBalance: 0, error: updateError.message }
}

export async function activateMatcherPremium(
  supabase: SupabaseClient,
  userId: string,
  options: { subscription: boolean },
): Promise<{ isPremium: boolean; tokenBalance: number; error: string | null }> {
  const profileUpdate = options.subscription
    ? { web_tier: 'pro', is_premium: true }
    : { is_premium: true }

  const { data: profile, error: updateError } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', userId)
    .select('is_premium, web_tier, token_balance')
    .single()

  if (!updateError && profile) {
    return {
      isPremium: profile.is_premium === true || profile.web_tier === 'pro',
      tokenBalance: profile.token_balance ?? 0,
      error: null,
    }
  }

  if (updateError && isMissingMatcherColumnError(updateError.message)) {
    const { data: fallbackProfile, error: fallbackError } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', userId)
      .select('is_premium')
      .single()

    if (fallbackError) {
      return { isPremium: false, tokenBalance: 0, error: fallbackError.message }
    }

    return {
      isPremium: fallbackProfile?.is_premium === true,
      tokenBalance: 0,
      error: null,
    }
  }

  return {
    isPremium: false,
    tokenBalance: 0,
    error: updateError?.message ?? 'Premium activation failed',
  }
}
