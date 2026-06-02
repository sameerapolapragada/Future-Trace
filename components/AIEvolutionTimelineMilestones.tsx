'use client'

import { timelinePreviewItems, type TimelinePreviewItem } from '@/data/timelinePreview'
import {
  BarChart3,
  Bot,
  Globe2,
  LayoutGrid,
  Link2,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react'

function MilestoneIcon({ type }: { type: TimelinePreviewItem['icon'] }) {
  const className = 'h-4 w-4'

  switch (type) {
    case 'symbolic':
      return <LayoutGrid className={`${className} text-orange-400`} />
    case 'ml':
      return <BarChart3 className={`${className} text-highlight`} />
    case 'transformers':
      return <RefreshCw className={`${className} text-accent`} />
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
      return 'bg-highlight-muted'
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

export default function AIEvolutionTimelineMilestones() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
      {timelinePreviewItems.map((item) => (
        <article
          key={item.id}
          className="flex min-h-[6.75rem] flex-col rounded-xl border border-borderMuted bg-surface px-3.5 py-3 shadow-horizon"
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex shrink-0 rounded-md p-1.5 ${iconBg(item.icon)}`}
              aria-hidden
            >
              <MilestoneIcon type={item.icon} />
            </span>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {formatEra(item.era)}
            </span>
          </div>
          <h3 className="mt-2.5 text-[13px] font-semibold leading-snug text-textPrimary">{item.title}</h3>
          <p className="mt-0.5 text-[11px] text-textSecondary">{item.tag}</p>
        </article>
      ))}
    </div>
  )
}
