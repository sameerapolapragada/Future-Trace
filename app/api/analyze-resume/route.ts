import { analyzeResumeLocally } from '@/lib/analyzeResume'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const FREE_DAILY_SCAN_LIMIT = 3

function startOfUtcDayIso(): string {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
}

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { resumeText?: string; jobTitle?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const resumeText = body.resumeText?.trim() ?? ''
  const jobTitle = body.jobTitle?.trim() ?? ''

  if (!resumeText || resumeText.length < 40) {
    return NextResponse.json(
      { error: 'Please paste at least a short resume or skills summary (40+ characters).' },
      { status: 400 }
    )
  }

  if (!jobTitle) {
    return NextResponse.json({ error: 'Target job title is required.' }, { status: 400 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, is_premium')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (!profile.is_premium) {
    const { count, error: countError } = await supabase
      .from('ai_scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .gte('created_at', startOfUtcDayIso())

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    if ((count ?? 0) >= FREE_DAILY_SCAN_LIMIT) {
      return NextResponse.json(
        { error: 'Free daily scan limit reached', code: 'RATE_LIMIT' },
        { status: 429 }
      )
    }
  }

  const analysis = analyzeResumeLocally(resumeText, jobTitle)

  const { error: insertError } = await supabase.from('ai_scan_history').insert({
    profile_id: profile.id,
    email: profile.email,
    resume_text: resumeText,
    overall_score: analysis.score,
    free_summary: analysis.freeSummary,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({
    score: analysis.score,
    jobTitle,
    summary: analysis.freeSummary,
    fullSummary: analysis.fullSummary,
    isPremium: profile.is_premium,
  })
}
