'use client'

import IntelligenceProfileGrid from '@/components/IntelligenceProfileGrid'
import { ensureIntelligenceProfile } from '@/lib/careerRoadmap'
import {
  formatBlueprintDurationLabel,
  formatMilestoneChapterLabel,
  MACRO_PROGRESS_SECTION_LABEL,
  MICRO_SPRINT_WORKSPACE_LABEL,
} from '@/lib/careerJourneyLabels'
import type { CareerRoadmap } from '@/types/careerRoadmap'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'
import type { ReactNode } from 'react'

type CareerRoadmapCardProps = {
  roadmap: CareerRoadmap
  variant?: 'workspace' | 'preview'
  actions?: ReactNode
  isPremium?: boolean
  userId?: string | null
  onPremiumStatusChange?: (isPremium: boolean) => void
  premiumRefreshToken?: number
}

function SectionHeading({ label, description }: { label: string; description?: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-textSecondary">{label}</p>
      {description ? (
        <p className="mt-1.5 text-xs leading-relaxed text-textSecondary">{description}</p>
      ) : null}
    </div>
  )
}

export default function CareerRoadmapCard({
  roadmap,
  variant = 'workspace',
  actions,
  isPremium = false,
  userId = null,
  onPremiumStatusChange,
  premiumRefreshToken,
}: CareerRoadmapCardProps) {
  const isPreview = variant === 'preview'
  const pipelineSteps = roadmap.skillAcquisitionPipeline
  const intelligenceProfile = ensureIntelligenceProfile(roadmap)
  const totalMonths = roadmap.estimatedJourneyMonths
  const milestoneCount = pipelineSteps.length

  return (
    <article className={isPreview ? 'horizon-card p-6' : 'horizon-card-padded'}>
      <header className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              AI Career Transition Pathway
            </p>
          </div>
          {!isPreview ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-textSecondary">
              Your blueprint spans macro milestones across the full transition window, with a focused
              30-day sprint workspace for day-to-day execution.
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      <section className="mt-8 border-t border-borderMuted pt-8" aria-labelledby="macro-progress-heading">
        <SectionHeading
          label={MACRO_PROGRESS_SECTION_LABEL}
          description="Four capability chapters across your full transition timeline."
        />
        <h3 id="macro-progress-heading" className="sr-only">
          {MACRO_PROGRESS_SECTION_LABEL}
        </h3>

        <p className="text-sm font-semibold text-textPrimary">{formatBlueprintDurationLabel(totalMonths)}</p>

        <div className="mt-6 rounded-xl border border-borderMuted bg-background p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-textSecondary">
              Transition chapters
            </h4>
            <span className="text-[11px] text-textSecondary">{milestoneCount} milestones</span>
          </div>

          <div className="overflow-x-auto pb-1">
            <ol className="flex min-w-max items-start gap-0">
              {pipelineSteps.map((step, index) => {
                const isFirst = index === 0
                const isLast = index === pipelineSteps.length - 1
                const chapterLabel = formatMilestoneChapterLabel(index, milestoneCount, totalMonths)

                return (
                  <li key={`${step.milestone}-${index}`} className="flex items-start">
                    <div className="flex w-[10.5rem] flex-col items-center px-1 sm:w-[11.5rem]">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-all duration-200 ${
                          isFirst
                            ? 'horizon-badge-active border-borderMuted'
                            : 'border-borderMuted bg-surface text-textSecondary'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`mt-2 text-center text-[10px] font-semibold uppercase tracking-wide ${
                          isFirst ? 'text-accent' : 'text-textSecondary'
                        }`}
                      >
                        {chapterLabel}
                      </p>
                      <p
                        className={`mt-2 text-center text-xs font-medium leading-snug ${
                          isFirst ? 'text-textPrimary' : 'text-textSecondary'
                        }`}
                      >
                        {step.milestone}
                      </p>
                    </div>

                    {!isLast ? (
                      <div className="mt-5 flex w-8 shrink-0 items-center justify-center sm:w-10" aria-hidden>
                        <div className="h-px w-full bg-borderMuted" />
                        <ArrowRight className="-ml-1 h-3.5 w-3.5 shrink-0 text-textSecondary" />
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      {!isPreview ? (
        <section
          className="mt-8 border-t border-borderMuted pt-8"
          aria-labelledby="micro-sprint-workspace-heading"
        >
          <SectionHeading
            label={MICRO_SPRINT_WORKSPACE_LABEL}
            description="Your immediate operational window — complete sprint tasks within the active milestone chapter."
          />
          <h3 id="micro-sprint-workspace-heading" className="sr-only">
            {MICRO_SPRINT_WORKSPACE_LABEL}
          </h3>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-borderMuted bg-accentMuted p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface">
                  <Zap className="h-4 w-4 text-accent" aria-hidden />
                </span>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Active sprint focus
                </h4>
              </div>
              <p className="mt-2 text-[11px] font-medium text-textSecondary">
                {roadmap.immediate30DayTarget ?? '1-Month Skill Sprint'}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-textPrimary">{roadmap.nextMilestone}</p>
            </section>

            <section className="rounded-xl border border-borderMuted bg-surface p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accentMuted">
                  <TrendingUp className="h-4 w-4 text-accent" aria-hidden />
                </span>
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-textSecondary">
                  Primary leverage point
                </h4>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-textPrimary">{roadmap.biggestObstacle}</p>
            </section>
          </div>
        </section>
      ) : null}

      {!isPreview ? (
        <IntelligenceProfileGrid
          profile={intelligenceProfile}
          isPremium={isPremium}
          userId={userId}
          onPremiumStatusChange={onPremiumStatusChange}
          premiumRefreshToken={premiumRefreshToken}
        />
      ) : null}
    </article>
  )
}
