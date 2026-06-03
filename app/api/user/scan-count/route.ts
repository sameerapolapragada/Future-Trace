import { SHOW_CAREER_SHIELD_BETA } from '@/lib/featureFlags'
import { isMatcherPaidTier } from '@/lib/matcherTier'
import { isMissingMatcherColumnError, selectMatcherProfile } from '@/lib/matcherProfileSelect'
import { buildFreeScanBalance, rollingScanWindowStart } from '@/lib/scanLimits'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profile, error: profileError } = await selectMatcherProfile(supabase, user.id)

    if (profileError) {
      return NextResponse.json({ error: profileError }, { status: 500 })
    }

    const tier = profile ?? { is_premium: false }

    if (SHOW_CAREER_SHIELD_BETA) {
      if (tier.is_premium) {
        return NextResponse.json({ isPremium: true })
      }

      const { count, error: countError } = await supabase
        .from('ai_scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .gte('created_at', rollingScanWindowStart())

      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 })
      }

      return NextResponse.json(buildFreeScanBalance(count ?? 0))
    }

    if (isMatcherPaidTier(tier)) {
      return NextResponse.json({ isPremium: true })
    }

    const { count, error: countError } = await supabase
      .from('user_resume_scans')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .gte('created_at', rollingScanWindowStart())

    if (countError) {
      if (isMissingMatcherColumnError(countError.message)) {
        return NextResponse.json(buildFreeScanBalance(0))
      }
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    return NextResponse.json(buildFreeScanBalance(count ?? 0))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load scan balance'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
