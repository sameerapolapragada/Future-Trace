import HomeWhatComesNextHighlights from '@/components/HomeWhatComesNextHighlights'
import { whatComesNextItems, type WhatComesNextItem, type WhatComesNextTag } from '@/data/whatComesNext'
import { Bot, ChevronRight, Cog, Link2, Scale, Search, UserCircle, Users } from 'lucide-react'

function tagStyles(tag: WhatComesNextTag) {
  switch (tag) {
    case 'now':
      return 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400'
    case 'emerging':
      return 'border-sky-500/40 bg-accentMuted text-accent'
    case 'critical':
      return 'border-orange-500/40 bg-orange-950/40 text-orange-400'
  }
}

function tagLabel(tag: WhatComesNextTag) {
  switch (tag) {
    case 'now':
      return 'Now'
    case 'emerging':
      return 'Emerging'
    case 'critical':
      return 'Critical'
  }
}

function ItemIcon({ type }: { type: WhatComesNextItem['icon'] }) {
  const className = 'h-4 w-4 text-accent'

  switch (type) {
    case 'copilot':
      return <Users className={className} />
    case 'agent':
      return <Bot className={className} />
    case 'multi-agent':
      return <Link2 className={className} />
    case 'workflow':
      return <Cog className={className} />
    case 'governance':
      return <Scale className={className} />
    case 'traceability':
      return <Search className={className} />
    case 'human-loop':
      return <UserCircle className={className} />
    default:
      return <Bot className={className} />
  }
}

export default function WhatComesNextContent() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {whatComesNextItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-borderMuted bg-surface px-3 py-3 shadow-horizon"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-borderMuted bg-background">
              <ItemIcon type={item.icon} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-textPrimary">{item.title}</h3>
                {item.tag ? (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tagStyles(item.tag)}`}
                  >
                    {tagLabel(item.tag)}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-textSecondary">{item.description}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          </div>
        ))}
      </div>

      <HomeWhatComesNextHighlights />
    </div>
  )
}
