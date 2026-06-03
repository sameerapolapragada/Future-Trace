import { createBearerClient, extractBearerToken } from '@/lib/supabase/bearer'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const accessToken = extractBearerToken(request)

  if (!accessToken) {
    return NextResponse.json({ error: 'Authorization required.' }, { status: 401 })
  }

  const supabase = createBearerClient(accessToken)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_resume_scans')
    .select(
      'id, current_role_input, target_role_input, calculated_risk_score, tier, gaps_summary, created_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scans: data ?? [] })
}
