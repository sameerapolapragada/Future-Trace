'use client'

import { timelinePreviewItems, type TimelinePreviewItem } from '@/data/timelinePreview'
import {
  BarChart3,
  Bot,
  ChevronRight,
  Globe2,
  LayoutGrid,
  Link2,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react'
import Link from 'next/link'

function PreviewIcon({ type }: { type: TimelinePreviewItem['icon'] }) {
  const className = 'h-4 w-4'

  switch (type) {
    case 'symbolic':
      return <LayoutGrid className={`${className} text-orange-400`} />
    case 'ml':
      return <BarChart3 className={`${className} text-emerald-400`} />
    case 'transformers':
      return <RefreshCw className={`${className} text-sky-400`} />
    case 'generative':
      return <Sparkles className={`${className} text-amber-400`} />
    case 'rag':
      return <Bot className={`${className} text-cyan-400`} />
    case 'agents':
      return <Target className={`${className} text-rose-400`} />
    case 'workflows':
      return <Link2 className={`${className} text-slate-400`} />
    case 'future':
      return <Globe2 className={`${className} text-blue-400`} />
    default:
      return <LayoutGrid className={className} />
  }
}

function iconBg(type: TimelinePreviewItem['icon']): string {
  switch (type) {
    case 'symbolic':
      return 'bg-orange-400/10'
    case 'ml':
      return 'bg-emerald-400/10'
    case 'transformers':
      return 'bg-sky-400/10'
    case 'generative':
      return 'bg-amber-400/10'
    case 'rag':
      return 'bg-cyan-400/10'
    case 'agents':
      return 'bg-rose-400/10'
    case 'workflows':
      return 'bg-slate-400/10'
    case 'future':
      return 'bg-blue-400/10'
    default:
      return 'bg-sky-400/10'
  }
}

function formatEra(era: string): string {
  return era.toLowerCase() === 'future' ? 'FUTURE' : era
}

export default function EvolutionTimelinePreview() {
  return (
    <section aria-labelledby="evolution-timeline-heading" className="mb-10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="evolution-timeline-heading" className="text-lg font-semibold tracking-tight text-slate-100">
            AI Evolution Timeline
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Key milestones in AI development</p>
        </div>

        <Link
          href="/timeline"
          className="inline-flex shrink-0 items-center gap-0.5 pt-0.5 text-xs font-medium text-sky-400 transition hover:text-sky-300"
        >
          View full
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
        {timelinePreviewItems.map((item) => (
          <article
            key={item.id}
            className="flex min-h-[6.75rem] flex-col rounded-xl border border-sky-900/30 bg-trace-surface/50 px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`inline-flex shrink-0 rounded-md p-1.5 ${iconBg(item.icon)}`}
                aria-hidden
              >
                <PreviewIcon type={item.icon} />
              </span>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-sky-400">
                {formatEra(item.era)}
              </span>
            </div>
            <h3 className="mt-2.5 text-[13px] font-semibold leading-snug text-slate-100">{item.title}</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">{item.tag}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
