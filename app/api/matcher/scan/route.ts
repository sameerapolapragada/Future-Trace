import { ensureMatcherProfile } from '@/lib/ensureMatcherProfile'
import { extractResumeTextFromFile, isAllowedResumeFile } from '@/lib/extractResumeFile'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { runMatcherGeminiScan } from '@/lib/matcherGemini'
import {
  hasActiveMatcherSubscription,
  isMatcherPaidTier,
  shouldConsumeMatcherToken,
} from '@/lib/matcherTier'
import { isMissingMatcherColumnError } from '@/lib/matcherProfileSelect'
import { buildFreeScanBalance, FREE_MONTHLY_SCAN_LIMIT, rollingScanWindowStart } from '@/lib/scanLimits'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function resumeTextFromFormData(formData: FormData): Promise<string> {
  const file = formData.get('file')
  const pasted = String(formData.get('resumeText') ?? '').trim()

  if (file instanceof File && file.size > 0) {
    if (!isAllowedResumeFile(file)) {
      throw new Error('Unsupported file type. Upload a .txt, .pdf, or .docx resume.')
    }
    return cleanExtractedText(await extractResumeTextFromFile(file))
  }

  if (pasted.length >= 40) {
    return cleanExtractedText(pasted)
  }

  return ''
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

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const targetRole = formatJobTitle(String(formData.get('targetRole') ?? formData.get('jobTitle') ?? ''))
  const currentRole = formatJobTitle(
    String(formData.get('currentRole') ?? formData.get('currentJobTitle') ?? ''),
  )

  if (!targetRole) {
    return NextResponse.json({ error: 'Target role is required.' }, { status: 400 })
  }

  if (!currentRole) {
    return NextResponse.json({ error: 'Current role is required.' }, { status: 400 })
  }

  let resumeText = ''
  try {
    resumeText = await resumeTextFromFormData(formData)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not read resume content.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { profile, error: profileError } = await ensureMatcherProfile(supabase, user)

  if (profileError || !profile) {
    console.error('[matcher/scan] Profile load failed:', profileError)
    return NextResponse.json(
      { error: profileError ?? 'Profile not found' },
      { status: profileError?.includes('account profile') ? 503 : 404 },
    )
  }

  const paid = isMatcherPaidTier(profile)
  const consumeToken = paid && shouldConsumeMatcherToken(profile)

  if (consumeToken && (profile.token_balance ?? 0) < 1) {
    return NextResponse.json({ error: 'No scan tokens remaining.' }, { status: 402 })
  }

  if (!paid) {
    const { count, error: countError } = await supabase
      .from('user_resume_scans')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .gte('created_at', rollingScanWindowStart())

    if (countError && !isMissingMatcherColumnError(countError.message)) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const balance = buildFreeScanBalance(count ?? 0)
    if (!countError && balance.scansRemaining <= 0) {
      return NextResponse.json(
        {
          error: `You have used all ${FREE_MONTHLY_SCAN_LIMIT} free scans for this month. Upgrade to unlock more scans and full transition insights.`,
        },
        { status: 429 },
      )
    }
  }

  try {
    const analysis = await runMatcherGeminiScan({
      currentRole,
      targetRole,
      resumeExcerpt: resumeText.length >= 40 ? resumeText : undefined,
      paid,
    })

    const { data: scanRow, error: insertError } = await supabase
      .from('user_resume_scans')
      .insert({
        profile_id: profile.id,
        current_role: currentRole,
        target_role: targetRole,
        resume_text: resumeText.length >= 40 ? resumeText : null,
        market_risk_score: analysis.marketRiskScore,
        risk_rationale: analysis.riskRationale,
        matched_roles: analysis.matchedRoles,
        is_paid_scan: paid,
      })
      .select('id')
      .single()

    if (insertError || !scanRow) {
      const insertMessage = insertError?.message ?? 'Failed to save scan'
      const needsMigration =
        insertMessage.toLowerCase().includes('user_resume_scans') ||
        insertMessage.toLowerCase().includes('does not exist')

      return NextResponse.json(
        {
          error: needsMigration
            ? 'Matcher database tables are not set up yet. Apply the latest Supabase migrations and try again.'
            : insertMessage,
        },
        { status: 500 },
      )
    }

    let tokenBalance = profile.token_balance ?? 0

    if (consumeToken) {
      tokenBalance = Math.max(0, tokenBalance - 1)
      const { error: tokenError } = await supabase
        .from('profiles')
        .update({ token_balance: tokenBalance })
        .eq('id', profile.id)

      if (tokenError) {
        return NextResponse.json({ error: tokenError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      scanId: scanRow.id,
      currentRole,
      targetRole,
      marketRiskScore: analysis.marketRiskScore,
      riskRationale: analysis.riskRationale,
      matchedRoles: analysis.matchedRoles,
      isPaid: paid,
      hasActiveSubscription: hasActiveMatcherSubscription(profile),
      tokenBalance,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Matcher scan failed'
    console.error('[matcher/scan]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
