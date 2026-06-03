import { generatePremiumRoadmapTasksWithGemini } from '@/lib/geminiRoadmapTasks'
import { buildMilestoneBlueprintSlug } from '@/lib/milestoneBlueprintSlug'
import type { AnalyzeRoadmapUserContext } from '@/lib/analyzeRoadmapPrompt'
import type { PremiumRoadmapTasksPayload } from '@/types/premiumRoadmapResources'
import type { SupabaseClient } from '@supabase/supabase-js'

export type MasterMilestoneBlueprintRow = {
  id: string
  milestone_slug: string
  title: string
  tasks_payload: PremiumRoadmapTasksPayload
}

export type MilestoneActivateResult = {
  cacheStatus: 'hit' | 'miss'
  blueprintId: string
  milestoneSlug: string
  title: string
  tasksPayload: PremiumRoadmapTasksPayload
}

export async function linkUserSprintProgress(
  supabase: SupabaseClient,
  userId: string,
  masterBlueprintId: string
): Promise<void> {
  const { error } = await supabase.from('user_sprint_progress').upsert(
    {
      user_id: userId,
      master_blueprint_id: masterBlueprintId,
      last_engaged_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,master_blueprint_id' }
  )

  if (error) {
    throw new Error(`Failed to link sprint progress: ${error.message}`)
  }
}

async function fetchBlueprintBySlug(
  admin: SupabaseClient,
  slug: string
): Promise<MasterMilestoneBlueprintRow | null> {
  const { data, error } = await admin
    .from('master_milestone_blueprints')
    .select('id, milestone_slug, title, tasks_payload')
    .eq('milestone_slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Blueprint lookup failed: ${error.message}`)
  }

  if (!data) return null

  return data as MasterMilestoneBlueprintRow
}

async function insertBlueprint(
  admin: SupabaseClient,
  slug: string,
  title: string,
  tasksPayload: PremiumRoadmapTasksPayload
): Promise<MasterMilestoneBlueprintRow> {
  const { data, error } = await admin
    .from('master_milestone_blueprints')
    .insert({
      milestone_slug: slug,
      title,
      tasks_payload: tasksPayload,
    })
    .select('id, milestone_slug, title, tasks_payload')
    .single()

  if (error) {
    if (error.code === '23505') {
      const existing = await fetchBlueprintBySlug(admin, slug)
      if (existing) return existing
    }
    throw new Error(`Blueprint insert failed: ${error.message}`)
  }

  return data as MasterMilestoneBlueprintRow
}

export async function getOrCreateMilestoneBlueprint(params: {
  admin: SupabaseClient
  userSupabase: SupabaseClient
  userId: string
  slug: string
  milestoneTitle: string
  llmContext: AnalyzeRoadmapUserContext
}): Promise<MilestoneActivateResult> {
  const { admin, userSupabase, userId, slug, milestoneTitle, llmContext } = params

  const cached = await fetchBlueprintBySlug(admin, slug)

  if (cached) {
    console.log('[roadmap/activate] LLM Cache Hit', {
      milestoneSlug: slug,
      blueprintId: cached.id,
    })

    await linkUserSprintProgress(userSupabase, userId, cached.id)

    return {
      cacheStatus: 'hit',
      blueprintId: cached.id,
      milestoneSlug: cached.milestone_slug,
      title: cached.title,
      tasksPayload: cached.tasks_payload,
    }
  }

  console.log('[roadmap/activate] LLM Generation Cache Miss', { milestoneSlug: slug })

  const tasksPayload = await generatePremiumRoadmapTasksWithGemini(llmContext)

  const created = await insertBlueprint(admin, slug, milestoneTitle, tasksPayload)

  console.log('[roadmap/activate] Blueprint cached after generation', {
    milestoneSlug: slug,
    blueprintId: created.id,
  })

  await linkUserSprintProgress(userSupabase, userId, created.id)

  return {
    cacheStatus: 'miss',
    blueprintId: created.id,
    milestoneSlug: created.milestone_slug,
    title: created.title,
    tasksPayload: created.tasks_payload,
  }
}
