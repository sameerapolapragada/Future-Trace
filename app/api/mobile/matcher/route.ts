import { generateMobileMatcherWithGemini } from '@/lib/mobileMatcher'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { createBearerClient, extractBearerToken } from '@/lib/supabase/bearer'
import type { MobileMatcherResult } from '@/types/mobileMatcher'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type MobileMatcherRequestBody = {
  current_role?: string
  target_role?: string
  resume_text?: string
}

function summarizeGaps(result: MobileMatcherResult): string | null {
  const skills = result.pivot_roles.flatMap((role) => role.skills_missing).filter(Boolean)
  if (skills.length === 0) return null
  return [...new Set(skills)].slice(0, 6).join(', ')
}

export async function POST(request: Request) {
  let body: MobileMatcherRequestBody

  try {
    body = (await request.json()) as MobileMatcherRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const currentRole = formatJobTitle(String(body.current_role ?? ''))
  const targetRole = formatJobTitle(String(body.target_role ?? ''))
  const resumeText = String(body.resume_text ?? '').trim()

  if (!currentRole) {
    return NextResponse.json({ error: 'current_role is required.' }, { status: 400 })
  }

  if (!targetRole) {
    return NextResponse.json({ error: 'target_role is required.' }, { status: 400 })
  }

  if (resumeText.length > 0 && resumeText.length < 40) {
    return NextResponse.json(
      { error: 'resume_text must be at least 40 characters when provided.' },
      { status: 400 }
    )
  }

  try {
    const result = await generateMobileMatcherWithGemini({
      currentRole,
      targetRole,
      resumeExcerpt: resumeText || undefined,
    })

    const accessToken = extractBearerToken(request)
    if (accessToken) {
      const supabase = createBearerClient(accessToken)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error: insertError } = await supabase.from('user_resume_scans').insert({
          user_id: user.id,
          current_role_input: currentRole,
          target_role_input: targetRole,
          calculated_risk_score: result.market_risk_score,
          resume_excerpt: resumeText ? resumeText.slice(0, 5000) : null,
          tier: 'free',
          gaps_summary: summarizeGaps(result),
          matcher_payload: result,
        })

        if (insertError) {
          console.error('[mobile/matcher] scan insert failed:', insertError.message)
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Matcher analysis failed.'
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
