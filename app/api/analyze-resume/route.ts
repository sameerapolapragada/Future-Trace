import { analyzeResumeLocally } from '@/lib/analyzeResume'
import { extractResumeTextFromFile, isAllowedResumeFile } from '@/lib/extractResumeFile'
import { formatJobTitle } from '@/lib/formatJobTitle'
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

  throw new Error('Upload a resume file or paste at least 40 characters of text.')
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

  const jobTitle = formatJobTitle(String(formData.get('jobTitle') ?? ''))
  const currentJobTitle = formatJobTitle(String(formData.get('currentJobTitle') ?? ''))
  if (!jobTitle) {
    return NextResponse.json({ error: 'Target job title is required.' }, { status: 400 })
  }

  let resumeText: string
  try {
    resumeText = await resumeTextFromFormData(formData)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not read resume content.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (resumeText.length < 40) {
    return NextResponse.json(
      { error: 'Could not extract enough text from that document. Try another file or paste your resume.' },
      { status: 400 }
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, job_role, is_premium')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const currentPosition =
    currentJobTitle || formatJobTitle(profile.job_role?.trim() ?? '') || jobTitle
  const analysis = analyzeResumeLocally(resumeText, currentPosition, jobTitle)

  if (!profile.is_premium) {
    const { count, error: countError } = await supabase
      .from('ai_scan_history')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .gte('created_at', rollingScanWindowStart())

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const balance = buildFreeScanBalance(count ?? 0)
    if (balance.scansRemaining <= 0) {
      return NextResponse.json(
        {
          error: `You have used all ${FREE_MONTHLY_SCAN_LIMIT} free scans for this month. Upgrade to Premium for unlimited optimizations.`,
        },
        { status: 429 }
      )
    }

    const { error: insertError } = await supabase.from('ai_scan_history').insert({
      profile_id: profile.id,
      email: profile.email,
      resume_text: resumeText,
      overall_score: analysis.score,
      free_summary: analysis.freeSummary,
      job_title: jobTitle,
      career_roadmap: analysis.roadmap,
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      jobTitle,
      summary: analysis.freeSummary,
      roadmap: analysis.roadmap,
      score: analysis.score,
      isPremium: false,
    })
  }

  const { error: insertError } = await supabase.from('ai_scan_history').insert({
    profile_id: profile.id,
    email: profile.email,
    resume_text: resumeText,
    overall_score: analysis.score,
    free_summary: analysis.freeSummary,
    job_title: jobTitle,
    career_roadmap: analysis.roadmap,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({
    score: analysis.score,
    jobTitle,
    summary: analysis.freeSummary,
    fullSummary: analysis.fullSummary,
    roadmap: analysis.roadmap,
    isPremium: true,
  })
}
