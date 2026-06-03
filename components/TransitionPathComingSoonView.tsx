'use client'

import CareerRoadmapCard from '@/components/CareerRoadmapCard'
import ComingSoonWallCard from '@/components/ComingSoonWallCard'
import { buildDefaultCareerRoadmap } from '@/lib/careerRoadmap'
import {
  formatBlueprintDurationLabel,
  MACRO_PROGRESS_SECTION_LABEL,
} from '@/lib/careerJourneyLabels'
import type { CareerRoadmap } from '@/types/careerRoadmap'
import { ArrowLeft, ChevronRight, Map } from 'lucide-react'
import { useMemo } from 'react'

type TransitionPathComingSoonViewProps = {
  currentRole: string
  onBack: () => void
}

function RoleTransitionStatusBar({ roadmap }: { roadmap: CareerRoadmap }) {
  return (
    <div
      role="group"
      aria-label={`Career transition from ${roadmap.currentPosition} to ${roadmap.destinationPosition}`}
      className="horizon-card px-6 py-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <p className="min-w-0 truncate text-sm font-semibold text-textPrimary sm:flex-1 sm:text-right">
          {roadmap.currentPosition}
        </p>
        <div className="flex shrink-0 items-center justify-center gap-1" aria-hidden>
          <ChevronRight className="h-4 w-4 text-accent" strokeWidth={2.5} />
        </div>
        <p className="min-w-0 truncate text-sm font-semibold text-textPrimary sm:flex-1">
          {roadmap.destinationPosition}
        </p>
      </div>
    </div>
  )
}

function MacroBlueprintDurationBar({ roadmap }: { roadmap: CareerRoadmap }) {
  const totalMonths = roadmap.estimatedJourneyMonths
  const activeMonth = 1
  const progress = Math.min(100, Math.round((activeMonth / totalMonths) * 100))

  return (
    <div
      role="status"
      aria-label={`${formatBlueprintDurationLabel(totalMonths)}. Month ${activeMonth} of ${totalMonths}.`}
      className="horizon-card px-6 py-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="min-w-0 text-sm font-semibold text-textPrimary">
          {formatBlueprintDurationLabel(totalMonths)}
        </p>
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-xs">
          <div
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-borderMuted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Blueprint progress: month ${activeMonth} of ${totalMonths}`}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="shrink-0 text-[11px] tabular-nums text-textSecondary">
            Month <span className="font-semibold text-textPrimary">{activeMonth}</span> of{' '}
            <span className="font-semibold text-textPrimary">{totalMonths}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TransitionPathComingSoonView({
  currentRole,
  onBack,
}: TransitionPathComingSoonViewProps) {
  const previewRoadmap = useMemo(
    () => buildDefaultCareerRoadmap(currentRole || 'Your current role'),
    [currentRole],
  )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Map className="h-6 w-6 shrink-0 text-accent" aria-hidden />
            <h1 className="text-xl font-bold text-textPrimary md:text-2xl">
              AI Career Transition Path
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-textSecondary">
            Macro milestones and sprint workspace for your full role transition.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="horizon-interactive inline-flex items-center gap-2 rounded-xl border border-trace-border bg-trace-surface px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back
        </button>
      </header>

      <section className="relative min-h-[28rem]">
        <div
          className="pointer-events-none flex flex-col gap-3 select-none blur-[3px]"
          aria-hidden
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-textSecondary">
            {MACRO_PROGRESS_SECTION_LABEL}
          </p>
          <RoleTransitionStatusBar roadmap={previewRoadmap} />
          <MacroBlueprintDurationBar roadmap={previewRoadmap} />
          <CareerRoadmapCard roadmap={previewRoadmap} variant="workspace" isPremium />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <ComingSoonWallCard onBack={onBack} />
          </div>
        </div>
      </section>
    </div>
  )
}
