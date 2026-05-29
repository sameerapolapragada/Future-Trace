'use client'

import IntelligenceProfileGrid from '@/components/IntelligenceProfileGrid'
import { ensureIntelligenceProfile } from '@/lib/careerRoadmap'
import type { CareerRoadmap } from '@/types/careerRoadmap'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'
import type { ReactNode } from 'react'

type CareerRoadmapCardProps = {
  roadmap: CareerRoadmap
  variant?: 'workspace' | 'preview'
  actions?: ReactNode
  isPremium?: boolean
  userId?: string | null
}

export default function CareerRoadmapCard({
  roadmap,
  variant = 'workspace',
  actions,
  isPremium = false,
  userId = null,
}: CareerRoadmapCardProps) {
  const isPreview = variant === 'preview'
  const pipelineSteps = roadmap.skillAcquisitionPipeline
  const intelligenceProfile = ensureIntelligenceProfile(roadmap)

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-sky-800/30 bg-gradient-to-br from-slate-950 via-trace-surface/90 to-sky-950/40 shadow-[0_24px_80px_-32px_rgba(14,165,233,0.35)] ${
        isPreview ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
        aria-hidden
      />

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400/90">
              AI Career Transition Pathway
            </p>
          </div>
          {!isPreview ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              A phased capability route designed for momentum — immediate skill wins first, leading to
              your target role framework.
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      <div className={`mt-5 grid gap-3 ${isPreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <section className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
              <Zap className="h-4 w-4 text-emerald-400" aria-hidden />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/90">
              Your First 30-Day Action Sprint
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{roadmap.nextMilestone}</p>
        </section>

        <section className="rounded-xl border border-sky-500/20 bg-sky-950/20 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15">
              <TrendingUp className="h-4 w-4 text-sky-400" aria-hidden />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300/90">
              Primary Leverage Point
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{roadmap.biggestObstacle}</p>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-sky-900/35 bg-black/20 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Skill acquisition pipeline
          </h3>
          <span className="text-[11px] text-slate-500">{pipelineSteps.length} phases</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <ol className="flex min-w-max items-start gap-0">
            {pipelineSteps.map((step, index) => {
              const isFirst = index === 0
              const isLast = index === pipelineSteps.length - 1

              return (
                <li key={`${step.milestone}-${index}`} className="flex items-start">
                  <div className="flex w-[9.5rem] flex-col items-center px-1 sm:w-[10.5rem]">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold ${
                        isFirst
                          ? 'border-sky-400/50 bg-sky-500/15 text-sky-200'
                          : isLast
                            ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
                            : 'border-slate-700 bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p
                      className={`mt-3 text-center text-xs font-medium leading-snug ${
                        isLast ? 'text-sky-100' : 'text-slate-300'
                      }`}
                    >
                      {step.milestone}
                    </p>
                    <span
                      className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${
                        isFirst
                          ? 'text-sky-400/80'
                          : isLast
                            ? 'text-violet-300/80'
                            : 'text-slate-500'
                      }`}
                    >
                      {step.phaseLabel}
                    </span>
                  </div>

                  {!isLast ? (
                    <div className="mt-5 flex w-8 shrink-0 items-center justify-center sm:w-10" aria-hidden>
                      <div className="h-px w-full bg-gradient-to-r from-sky-700/50 via-sky-500/40 to-sky-700/20" />
                      <ArrowRight className="-ml-1 h-3.5 w-3.5 shrink-0 text-sky-600" />
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {!isPreview ? (
        <IntelligenceProfileGrid
          profile={intelligenceProfile}
          isPremium={isPremium}
          userId={userId}
        />
      ) : null}
    </article>
  )
}
