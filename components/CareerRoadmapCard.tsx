'use client'

import type { CareerRoadmap } from '@/types/careerRoadmap'
import { ArrowRight, Clock3, Flag, MapPin, Mountain, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

type CareerRoadmapCardProps = {
  roadmap: CareerRoadmap
  variant?: 'workspace' | 'preview'
  actions?: ReactNode
}

export default function CareerRoadmapCard({
  roadmap,
  variant = 'workspace',
  actions,
}: CareerRoadmapCardProps) {
  const isPreview = variant === 'preview'
  const routeSteps = roadmap.recommendedRoute

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
              A structured route from where you are today to your target role — with the next move
              and primary friction point called out up front.
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      <div className={`mt-5 grid gap-3 ${isPreview ? 'grid-cols-1' : 'sm:grid-cols-[1fr_auto_1fr]'}`}>
        <div className="rounded-xl border border-sky-900/35 bg-black/25 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Current position
          </p>
          <p className="mt-2 text-base font-semibold leading-snug text-slate-100 sm:text-lg">
            {roadmap.currentPosition}
          </p>
        </div>

        {!isPreview ? (
          <div className="hidden items-center justify-center sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-700/40 bg-sky-950/50">
              <ArrowRight className="h-4 w-4 text-sky-300" aria-hidden />
            </div>
          </div>
        ) : null}

        <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 p-4 ring-1 ring-sky-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-400/80">
            Destination
          </p>
          <p className="mt-2 text-base font-semibold leading-snug text-sky-50 sm:text-lg">
            {roadmap.destinationPosition}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-950/70 via-sky-950/80 to-blue-950/70 px-4 py-2 shadow-[inset_0_1px_0_rgba(125,211,252,0.12)]">
          <Clock3 className="h-4 w-4 text-cyan-300" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
            Estimated journey
          </span>
          <span className="text-sm font-bold tabular-nums text-cyan-50">
            ~{roadmap.estimatedJourneyMonths} months
          </span>
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${isPreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <section className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Flag className="h-4 w-4 text-emerald-400" aria-hidden />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/90">
              Next milestone
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{roadmap.nextMilestone}</p>
        </section>

        <section className="rounded-xl border border-orange-500/15 bg-orange-950/10 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <Mountain className="h-4 w-4 text-orange-400" aria-hidden />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-300/90">
              Biggest obstacle
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">{roadmap.biggestObstacle}</p>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-sky-900/35 bg-black/20 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Recommended route
          </h3>
          <span className="text-[11px] text-slate-500">{routeSteps.length} stages</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <ol className="flex min-w-max items-start gap-0">
            {routeSteps.map((step, index) => {
              const isFirst = index === 0
              const isLast = index === routeSteps.length - 1

              return (
                <li key={`${step}-${index}`} className="flex items-start">
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
                      {isFirst ? <MapPin className="h-4 w-4" aria-hidden /> : index + 1}
                    </div>
                    <p
                      className={`mt-3 text-center text-xs font-medium leading-snug ${
                        isLast ? 'text-sky-100' : 'text-slate-300'
                      }`}
                    >
                      {step}
                    </p>
                    {isFirst ? (
                      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-sky-400/80">
                        You are here
                      </span>
                    ) : isLast ? (
                      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-violet-300/80">
                        Target role
                      </span>
                    ) : null}
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
    </article>
  )
}
