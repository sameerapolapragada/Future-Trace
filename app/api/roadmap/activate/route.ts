import { getOrCreateMilestoneBlueprint } from '@/lib/milestoneBlueprintCache'
import { buildMilestoneBlueprintSlug, resolvePhaseNumber } from '@/lib/milestoneBlueprintSlug'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ActivateMilestoneRequestBody = {
  currentRole?: string
  targetRole?: string
  milestoneTitle?: string
  phaseNumber?: number | string
  phaseLabel?: string
  chapterLabel?: string
  sprintFocus?: string
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
        { error: 'Premium subscription required to activate milestone blueprints.' },
        { status: 403 }
      )
    }

    let body: ActivateMilestoneRequestBody
    try {
      body = (await request.json()) as ActivateMilestoneRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const milestoneTitle = body.milestoneTitle?.trim()
    const currentRoleRaw = body.currentRole?.trim() || profile.job_role?.trim() || ''
    const targetRoleRaw = body.targetRole?.trim() || ''

    if (!milestoneTitle) {
      return NextResponse.json({ error: 'milestoneTitle is required.' }, { status: 400 })
    }

    if (!currentRoleRaw || !targetRoleRaw) {
      return NextResponse.json(
        { error: 'currentRole and targetRole are required.' },
        { status: 400 }
      )
    }

    let phaseNumber: number
    try {
      phaseNumber = resolvePhaseNumber(body.phaseNumber, body.phaseLabel?.trim())
    } catch (phaseError) {
      const message =
        phaseError instanceof Error ? phaseError.message : 'Invalid phaseNumber or phaseLabel'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const currentRole = formatJobTitle(currentRoleRaw)
    const targetRole = formatJobTitle(targetRoleRaw)
    const slug = buildMilestoneBlueprintSlug(currentRole, targetRole, phaseNumber)

    const phaseLabel = body.phaseLabel?.trim() || `Phase ${phaseNumber}`

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

    const admin = createAdminClient()

    const result = await getOrCreateMilestoneBlueprint({
      admin,
      userSupabase: supabase,
      userId: user.id,
      slug,
      milestoneTitle,
      llmContext: {
        milestoneTitle,
        phaseLabel,
        chapterLabel: body.chapterLabel?.trim(),
        sprintFocus: body.sprintFocus?.trim(),
        currentPosition: currentRole,
        destinationPosition: targetRole,
        resumeExcerpt: body.resumeExcerpt?.trim(),
        taskCount:
          typeof body.taskCount === 'number' && body.taskCount > 0
            ? Math.min(body.taskCount, 8)
            : undefined,
        taskSeeds,
      },
    })

    return NextResponse.json({
      cacheStatus: result.cacheStatus,
      blueprintId: result.blueprintId,
      milestoneSlug: result.milestoneSlug,
      title: result.title,
      tasksPayload: result.tasksPayload,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to activate milestone blueprint'

    const status =
      message.includes('GEMINI_API_KEY') || message.includes('Gemini')
        ? 503
        : message.includes('SUPABASE_SERVICE_ROLE_KEY')
          ? 503
          : message.includes('schema') || message.includes('Invalid')
            ? 502
            : 500

    console.error('[roadmap/activate] error', error)
    return NextResponse.json({ error: message }, { status })
  }
}
