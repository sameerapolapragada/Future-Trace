'use client'

import { timelinePreviewItems, type TimelinePreviewItem } from '@/data/timelinePreview'
import {
  BarChart3,
  Bot,
  ChevronDown,
  ChevronRight,
  Globe2,
  LayoutGrid,
  Layers,
  Link2,
  Sparkles,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function PreviewIcon({ type }: { type: TimelinePreviewItem['icon'] }) {
  const className = 'h-3.5 w-3.5'

  switch (type) {
    case 'symbolic':
      return <LayoutGrid className={`${className} text-orange-400`} />
    case 'ml':
      return <BarChart3 className={`${className} text-emerald-400`} />
    case 'transformers':
      return <Layers className={`${className} text-sky-400`} />
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

export default function EvolutionTimelinePreview() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setExpanded(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <section aria-labelledby="evolution-timeline-heading" className="mb-10">
      <div className="flex items-center justify-between gap-3 border-b border-sky-900/30 pb-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left md:pointer-events-none md:cursor-default"
          aria-expanded={expanded}
          aria-controls="evolution-timeline-grid"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform md:hidden ${
              expanded ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden
          />
          <div className="min-w-0">
            <h2 id="evolution-timeline-heading" className="text-lg font-semibold tracking-tight text-slate-100">
              AI Evolution Timeline
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Key milestones in AI development</p>
          </div>
        </button>

        <Link
          href="/timeline"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-sky-400 transition hover:text-sky-300"
        >
          View full
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div
        id="evolution-timeline-grid"
        className={`grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 ${
          expanded ? 'mt-4 block' : 'mt-0 hidden md:mt-4 md:grid'
        }`}
      >
        {timelinePreviewItems.map((item) => (
          <div key={item.id} className="flex flex-col">
            <article className="flex flex-1 flex-col rounded-lg border border-sky-900/20 bg-trace-surface/30 px-3 py-2.5">
              <span
                className={`inline-flex w-fit shrink-0 rounded-md p-1 ${iconBg(item.icon)}`}
                aria-hidden
              >
                <PreviewIcon type={item.icon} />
              </span>
              <h3 className="mt-1.5 text-[13px] font-semibold leading-tight text-slate-100">{item.title}</h3>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.tag}</p>
            </article>
            <p className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-sky-400/80">
              {item.era}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
