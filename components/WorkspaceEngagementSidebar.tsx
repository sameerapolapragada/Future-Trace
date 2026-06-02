'use client'

import type { CareerRoadmap, SkillMilestone } from '@/types/careerRoadmap'
import { toTitleCase } from '@/lib/formatJobTitle'
import { completionStorageKey, milestoneKey } from '@/lib/premiumRoadmapTasks'
import { Flame, Target, TrendingUp } from 'lucide-react'

type WorkspaceEngagementSidebarProps = {
  roadmap: CareerRoadmap
  skillPipeline: SkillMilestone[]
  completedTaskKeys: Set<string>
  exposureScore?: number | null
}

function deriveRiskPercent(roadmap: CareerRoadmap, exposureScore?: number | null): number {
  if (typeof exposureScore === 'number' && Number.isFinite(exposureScore)) {
    return Math.max(12, Math.min(92, Math.round(100 - exposureScore)))
  }
  const vulnerabilityCount = roadmap.intelligenceProfile?.structuralVulnerabilities?.length ?? 4
  return Math.min(88, 48 + vulnerabilityCount * 4)
}

function deriveSalaryRange(destination: string): string {
  const d = destination.toLowerCase()
  if (/director|head|vp|chief|lead/i.test(d)) return '$165K – $210K'
  if (/senior|staff|principal/i.test(d)) return '$145K – $170K'
  if (/manager|strategist|architect/i.test(d)) return '$130K – $155K'
  return '$115K – $140K'
}

function countUnlockedKeywords(
  skillPipeline: SkillMilestone[],
  completedTaskKeys: Set<string>
): { unlocked: number; total: number } {
  const total = skillPipeline.length * 3
  let unlocked = 0

  skillPipeline.forEach((step, index) => {
    const tasks = step.tasks ?? []
    if (tasks.length === 0) return
    const key = milestoneKey(step, index)
    const done = tasks.filter((task) =>
      completedTaskKeys.has(completionStorageKey(key, task.id))
    ).length
    unlocked += Math.min(3, Math.ceil((done / tasks.length) * 3))
  })

  return { unlocked, total: Math.max(total, 12) }
}

export default function WorkspaceEngagementSidebar({
  roadmap,
  skillPipeline,
  completedTaskKeys,
  exposureScore,
}: WorkspaceEngagementSidebarProps) {
  const riskPercent = deriveRiskPercent(roadmap, exposureScore)
  const riskTone =
    riskPercent >= 70 ? 'text-rose-400' : riskPercent >= 50 ? 'text-amber-400' : 'text-highlight'
  const riskBarTone =
    riskPercent >= 70 ? 'bg-rose-500' : riskPercent >= 50 ? 'bg-amber-500' : 'bg-highlight'

  const completedTaskCount = completedTaskKeys.size
  const streakDays = Math.min(7, Math.max(1, completedTaskCount > 0 ? Math.ceil(completedTaskCount / 2) : 1))
  const weeklyHoursTarget = 6
  const weeklyHoursCompleted = Math.min(
    weeklyHoursTarget,
    Math.round(completedTaskCount * 0.75 * 10) / 10
  )
  const weeklyProgress = Math.round((weeklyHoursCompleted / weeklyHoursTarget) * 100)

  const { unlocked: keywordsUnlocked, total: keywordsTotal } = countUnlockedKeywords(
    skillPipeline,
    completedTaskKeys
  )
  const salaryRange = deriveSalaryRange(roadmap.destinationPosition)

  return (
    <aside
      className="lg:sticky lg:top-8 lg:col-span-3 lg:self-start"
      aria-label="Engagement and tracking"
    >
      <div className="space-y-6 rounded-xl border border-borderMuted bg-surface p-6 shadow-sm">
        {/* Widget A — Market Risk Profile */}
        <section aria-labelledby="market-risk-heading">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <h2
              id="market-risk-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary"
            >
              Market Risk Profile
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[11px] font-medium text-textSecondary">Current role exposure</p>
              <p className={`mt-1 text-sm font-semibold ${riskTone}`}>
                {toTitleCase(roadmap.currentPosition)}: {riskPercent}% Risk Exposure
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-borderMuted">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${riskBarTone}`}
                  style={{ width: `${riskPercent}%` }}
                />
              </div>
            </div>

            <div className="border-t border-borderMuted pt-4">
              <p className="text-[11px] font-medium text-textSecondary">Target destination demand</p>
              <p className="mt-1 text-sm font-semibold text-textPrimary">
                {toTitleCase(roadmap.destinationPosition)}
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-highlight">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                High Market Demand
              </p>
            </div>
          </div>
        </section>

        {/* Widget B — Momentum & Accountability */}
        <section
          className="border-t border-borderMuted pt-6"
          aria-labelledby="momentum-heading"
        >
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <h2
              id="momentum-heading"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary"
            >
              Momentum &amp; Accountability
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-borderMuted bg-background px-4 py-3">
              <p className="text-[11px] font-medium text-textSecondary">Upskilling streak</p>
              <p className="mt-1 text-base font-semibold text-textPrimary">
                {streakDays}-Day Upskilling Streak{' '}
                <span aria-hidden>🔥</span>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-textSecondary">Weekly learning time</p>
                <p className="text-xs font-semibold tabular-nums text-textPrimary">
                  {weeklyHoursCompleted} / {weeklyHoursTarget} hours
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-borderMuted">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-textSecondary">completed this week</p>
            </div>
          </div>
        </section>

        {/* Widget C — Career Destination Targets */}
        <section
          className="border-t border-borderMuted pt-6"
          aria-labelledby="destination-targets-heading"
        >
          <h2
            id="destination-targets-heading"
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary"
          >
            Career Destination Targets
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[11px] font-medium text-textSecondary">Average market salary range</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-textPrimary">{salaryRange}</p>
            </div>

            <div className="rounded-lg border border-borderMuted bg-background px-4 py-3">
              <p className="text-[11px] font-medium text-textSecondary">Resume optimization</p>
              <p className="mt-1 text-sm font-semibold text-textPrimary">
                Resume Keywords Unlocked: {keywordsUnlocked} / {keywordsTotal}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-borderMuted">
                <div
                  className="h-full rounded-full bg-highlight transition-all duration-300"
                  style={{
                    width: `${keywordsTotal > 0 ? Math.round((keywordsUnlocked / keywordsTotal) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  )
}
