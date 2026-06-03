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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (profile?.is_premium) {
      return NextResponse.json({ isPremium: true })
    }

    // Free-tier usage is tracked in ai_scan_history (rolling 30-day window).
    const { count, error: countError } = await supabase
      .from('ai_scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .gte('created_at', rollingScanWindowStart())

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    return NextResponse.json(buildFreeScanBalance(count ?? 0))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load scan balance'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
