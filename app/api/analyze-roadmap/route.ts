import { generatePremiumRoadmapTasks } from '@/lib/analyzeRoadmap'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type AnalyzeRoadmapRequestBody = {
  milestoneTitle?: string
  phaseLabel?: string
  chapterLabel?: string
  sprintFocus?: string
  currentPosition?: string
  destinationPosition?: string
  resumeExcerpt?: string
  taskCount?: number
  taskSeeds?: Array<{ id: string; text: string }>
}

export async function POST(request: Request) {
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
      .select('is_premium, job_role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    if (!profile?.is_premium) {
      return NextResponse.json(
        { error: 'Premium subscription required for technical execution resources.' },
        { status: 403 }
      )
    }

    let body: AnalyzeRoadmapRequestBody
    try {
      body = (await request.json()) as AnalyzeRoadmapRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const milestoneTitle = body.milestoneTitle?.trim()
    const phaseLabel = body.phaseLabel?.trim()

    if (!milestoneTitle || !phaseLabel) {
      return NextResponse.json(
        { error: 'milestoneTitle and phaseLabel are required.' },
        { status: 400 }
      )
    }

    const taskSeeds = Array.isArray(body.taskSeeds)
      ? body.taskSeeds
          .filter(
            (seed): seed is { id: string; text: string } =>
              Boolean(seed) &&
              typeof seed.id === 'string' &&
              seed.id.trim().length > 0 &&
              typeof seed.text === 'string' &&
              seed.text.trim().length > 0
          )
          .map((seed) => ({ id: seed.id.trim(), text: seed.text.trim() }))
      : undefined

    const payload = await generatePremiumRoadmapTasks({
      milestoneTitle,
      phaseLabel,
      chapterLabel: body.chapterLabel?.trim(),
      sprintFocus: body.sprintFocus?.trim(),
      currentPosition:
        formatJobTitle(body.currentPosition?.trim() ?? '') ||
        formatJobTitle(profile.job_role?.trim() ?? '') ||
        'Your current role',
      destinationPosition:
        formatJobTitle(body.destinationPosition?.trim() ?? '') || 'Your target role',
      resumeExcerpt: body.resumeExcerpt?.trim(),
      taskCount:
        typeof body.taskCount === 'number' && body.taskCount > 0
          ? Math.min(body.taskCount, 8)
          : undefined,
      taskSeeds,
    })

    return NextResponse.json(payload)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate roadmap execution resources'

    const status =
      message.includes('OPENAI_API_KEY') || message.includes('OpenAI')
        ? 503
        : message.includes('schema') || message.includes('Invalid')
          ? 502
          : 500

    console.error('[analyze-roadmap]', error)
    return NextResponse.json({ error: message }, { status })
  }
}
