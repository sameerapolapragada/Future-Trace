'use client'

import SkillMilestoneDrawer from '@/components/SkillMilestoneDrawer'
import WorkspaceEngagementSidebar from '@/components/WorkspaceEngagementSidebar'
import {
  buildDefaultCareerRoadmap,
  parseCareerRoadmap,
} from '@/lib/careerRoadmap'
import {
  formatBlueprintDurationLabel,
  formatMilestoneChapterLabel,
  MACRO_PROGRESS_SECTION_LABEL,
  MICRO_SPRINT_WORKSPACE_LABEL,
} from '@/lib/careerJourneyLabels'
import { toTitleCase } from '@/lib/formatJobTitle'
import {
  completionStorageKey,
  enrichSkillPipeline,
  extractSkillPipeline,
  milestoneKey,
} from '@/lib/premiumRoadmapTasks'
import type { CareerRoadmap, SkillMilestone, SkillTask } from '@/types/careerRoadmap'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Map } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

function milestoneCardProgress(
  step: SkillMilestone,
  index: number,
  completedTaskKeys: Set<string>
): number {
  const tasks = step.tasks ?? []
  if (tasks.length === 0) return 0

  const key = milestoneKey(step, index)
  const done = tasks.filter((task) => completedTaskKeys.has(completionStorageKey(key, task.id))).length
  return Math.round((done / tasks.length) * 100)
}

export default function PremiumRoadmapPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null)
  const [exposureScore, setExposureScore] = useState<number | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null)
  const [completedTaskKeys, setCompletedTaskKeys] = useState<Set<string>>(new Set())
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null)

  const skillPipeline = useMemo(
    () => (roadmap ? enrichSkillPipeline(roadmap.skillAcquisitionPipeline) : []),
    [roadmap]
  )

  const loadRoadmap = useCallback(async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Please sign in to view your roadmap.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium, job_role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    const premium = profile?.is_premium ?? false
    setIsPremium(premium)

    if (!premium) {
      setLoading(false)
      return
    }

    const { data: latestScan, error: scanError } = await supabase
      .from('ai_scan_history')
      .select('career_roadmap, job_title, overall_score')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (scanError) {
      setError(scanError.message)
      setLoading(false)
      return
    }

    let resolvedRoadmap =
      parseCareerRoadmap(latestScan?.career_roadmap) ??
      buildDefaultCareerRoadmap(
        profile?.job_role?.trim() || 'Your current role',
        latestScan?.job_title?.trim() || undefined
      )

    const embeddedPipeline = latestScan?.career_roadmap
      ? extractSkillPipeline(latestScan.career_roadmap as Record<string, unknown>)
      : null

    if (embeddedPipeline?.length) {
      resolvedRoadmap = {
        ...resolvedRoadmap,
        skillAcquisitionPipeline: enrichSkillPipeline(embeddedPipeline),
      }
    } else {
      resolvedRoadmap = {
        ...resolvedRoadmap,
        skillAcquisitionPipeline: enrichSkillPipeline(resolvedRoadmap.skillAcquisitionPipeline),
      }
    }

    setRoadmap(resolvedRoadmap)
    setExposureScore(
      typeof latestScan?.overall_score === 'number' ? latestScan.overall_score : null
    )

    try {
      const response = await fetch('/api/roadmap/tasks')
      const payload = (await response.json()) as { completed?: string[]; error?: string }
      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not load task progress')
      }
      setCompletedTaskKeys(new Set(payload.completed ?? []))
    } catch (fetchError) {
      console.error('[PremiumRoadmap] Task completion load failed:', fetchError)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void loadRoadmap()
  }, [loadRoadmap])

  async function handleToggleTask(
    milestoneKeyValue: string,
    task: SkillTask,
    completed: boolean
  ) {
    const storageKey = completionStorageKey(milestoneKeyValue, task.id)

    setCompletedTaskKeys((previous) => {
      const next = new Set(previous)
      if (completed) {
        next.add(storageKey)
      } else {
        next.delete(storageKey)
      }
      return next
    })

    setTogglingTaskId(task.id)

    try {
      const response = await fetch('/api/roadmap/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneKey: milestoneKeyValue,
          taskId: task.id,
          completed,
        }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not save task progress')
      }
    } catch (toggleError) {
      console.error('[PremiumRoadmap] Task toggle failed:', toggleError)
      setCompletedTaskKeys((previous) => {
        const next = new Set(previous)
        if (completed) {
          next.delete(storageKey)
        } else {
          next.add(storageKey)
        }
        return next
      })
    } finally {
      setTogglingTaskId(null)
    }
  }

  const activeStep =
    selectedSkill !== null && skillPipeline[selectedSkill] ? skillPipeline[selectedSkill] : null

  if (loading) {
    return (
      <div className="relative -mx-4 -my-8 min-h-screen text-textSecondary sm:-mx-6 md:-mx-8 md:-my-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-4 md:p-8">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
          <p className="text-sm text-textSecondary">Loading your premium roadmap…</p>
        </div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="relative -mx-4 -my-8 min-h-screen text-textSecondary sm:-mx-6 md:-mx-8 md:-my-12">
        <div className="mx-auto max-w-lg p-4 md:p-8">
          <div className="rounded-2xl border border-trace-border bg-trace-surface p-8 text-center">
            <Map className="mx-auto h-10 w-10 text-accent" aria-hidden />
            <h1 className="mt-4 text-xl font-semibold text-textPrimary">Premium Roadmap</h1>
            <p className="mt-2 text-sm leading-relaxed text-textSecondary">
              Upgrade to Premium to unlock your interactive skill acquisition pipeline with checkable
              micro-tasks.
            </p>
            <Link
              href="/dashboard"
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="relative -mx-4 -my-8 min-h-screen text-textSecondary sm:-mx-6 md:-mx-8 md:-my-12">
        <div className="p-4 md:p-8">
          <div className="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error ?? 'Unable to load your roadmap.'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative -mx-4 -my-8 min-h-screen text-textSecondary sm:-mx-6 md:-mx-8 md:-my-12">
      <div className="w-full min-h-screen p-4 md:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-24 md:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to Dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-textPrimary">Your Premium Roadmap</h1>
          <p className="mt-1.5 text-sm text-textSecondary">
            {toTitleCase(roadmap.currentPosition)} → {toTitleCase(roadmap.destinationPosition)}
          </p>
        </div>
        <div className="horizon-card px-6 py-4 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
            {MACRO_PROGRESS_SECTION_LABEL}
          </p>
          <p className="mt-1 font-semibold text-textPrimary">
            {formatBlueprintDurationLabel(roadmap.estimatedJourneyMonths)}
          </p>
        </div>
      </header>

      <section
        className="horizon-card border-borderMuted bg-accentMuted p-6 sm:p-8"
        aria-labelledby="micro-sprint-workspace-heading"
      >
        <h2
          id="micro-sprint-workspace-heading"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-accent"
        >
          {MICRO_SPRINT_WORKSPACE_LABEL}
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          Complete checkable tasks and track streak-style progress within your active milestone
          chapter.
        </p>
        <p className="mt-2 text-[11px] font-medium text-accent">
          Active sprint: {roadmap.immediate30DayTarget ?? '1-Month Skill Sprint'}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-textPrimary">{roadmap.nextMilestone}</p>
        {selectedSkill !== null && skillPipeline[selectedSkill] ? (
          <p className="mt-3 text-xs text-slate-500">
            Working in:{' '}
            <span className="font-medium text-textSecondary">
              {formatMilestoneChapterLabel(
                selectedSkill,
                skillPipeline.length,
                roadmap.estimatedJourneyMonths
              )}{' '}
              — {skillPipeline[selectedSkill].milestone}
            </span>
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Select a milestone below to open your task checklist.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
        <section aria-labelledby="skill-pipeline-heading" className="lg:col-span-7">
          <h2
            id="skill-pipeline-heading"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-textSecondary"
          >
            {MACRO_PROGRESS_SECTION_LABEL} — transition chapters
          </h2>
          <p className="mt-1 text-sm text-textSecondary">
            Four sequential milestones across your blueprint. Open a chapter to work tasks in your
            30-day sprint workspace.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {skillPipeline.map((step, index) => {
              const progress = milestoneCardProgress(step, index, completedTaskKeys)
              const isSelected = selectedSkill === index
              const isComplete = progress === 100
              const chapterLabel = formatMilestoneChapterLabel(
                index,
                skillPipeline.length,
                roadmap.estimatedJourneyMonths
              )

              return (
                <button
                  key={`${step.phaseLabel}-${step.milestone}`}
                  type="button"
                  onClick={() => setSelectedSkill(index)}
                  className={`horizon-interactive group relative overflow-hidden rounded-2xl border p-6 text-left sm:p-8 ${
                    isSelected
                      ? 'horizon-milestone-active'
                      : 'border-borderMuted bg-surface hover:bg-accentMuted/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span
                        className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          isSelected
                            ? 'horizon-badge-active border-borderMuted'
                            : 'border-borderMuted bg-background text-textSecondary'
                        }`}
                      >
                        {chapterLabel}
                      </span>
                      <h3 className="mt-4 text-lg font-semibold leading-snug text-textPrimary">
                        {step.milestone}
                      </h3>
                    </div>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                        isSelected
                          ? 'horizon-badge-active border-borderMuted'
                          : 'border-borderMuted bg-background text-textSecondary'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-textSecondary">
                      <span>{progress}% complete</span>
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 text-highlight">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          Done
                        </span>
                      ) : (
                        <span>{step.tasks?.length ?? 0} tasks</span>
                      )}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-borderMuted">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-80 transition group-hover:opacity-100">
                    View micro-tasks
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <WorkspaceEngagementSidebar
          roadmap={roadmap}
          skillPipeline={skillPipeline}
          completedTaskKeys={completedTaskKeys}
          exposureScore={exposureScore}
        />
      </div>

      {activeStep && selectedSkill !== null ? (
        <SkillMilestoneDrawer
          step={activeStep}
          stepIndex={selectedSkill}
          open={selectedSkill !== null}
          completedTaskKeys={completedTaskKeys}
          onClose={() => setSelectedSkill(null)}
          onToggleTask={handleToggleTask}
          togglingTaskId={togglingTaskId}
        />
      ) : null}
        </div>
      </div>
    </div>
  )
}
