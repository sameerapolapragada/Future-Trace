import { generateMobileMatcherWithGemini } from '@/lib/mobileMatcher'
import {
  delayMs,
  generateMobileMatcherMock,
  isMockAiEnabled,
  mockAiLatencyMs,
} from '@/lib/mobileMatcherMock'
import { persistMatcherScan } from '@/lib/mobileMatcherPersist'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { createBearerClient, extractBearerToken } from '@/lib/supabase/bearer'
import type { MobileMatcherResult } from '@/types/mobileMatcher'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type MobileMatcherRequestBody = {
  current_role?: string
  target_role?: string
  resume_text?: string
  /** When true, consumes one credit from profiles.token_balance (non-premium users). */
  use_one_time_token?: boolean
}

async function runMatcher(context: {
  currentRole: string
  targetRole: string
  resumeExcerpt?: string
}): Promise<MobileMatcherResult> {
  if (isMockAiEnabled()) {
    await delayMs(mockAiLatencyMs())
    return generateMobileMatcherMock(context)
  }

  return generateMobileMatcherWithGemini(context)
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
  const useOneTimeToken = body.use_one_time_token === true

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

  try {
    const result = await runMatcher({
      currentRole,
      targetRole,
      resumeExcerpt: resumeText || undefined,
    })

    const persistResult = await persistMatcherScan({
      supabase,
      userId: user.id,
      currentRole,
      targetRole,
      resumeText,
      result,
      useOneTimeToken,
    })

    if (!persistResult.ok) {
      return NextResponse.json({ error: persistResult.error }, { status: persistResult.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Matcher analysis failed.'
    const status = message.includes('GEMINI_API_KEY') ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
