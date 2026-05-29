import { trustChallengeBullets, whatComesNextItems, type WhatComesNextItem, type WhatComesNextTag } from '@/data/whatComesNext'
import {
  Bot,
  ChevronRight,
  Cog,
  Link2,
  Scale,
  Search,
  Shield,
  UserCircle,
  Users,
} from 'lucide-react'
import Link from 'next/link'

function tagStyles(tag: WhatComesNextTag) {
  switch (tag) {
    case 'now':
      return 'border-cyan-500/40 bg-cyan-950/40 text-cyan-400'
    case 'emerging':
      return 'border-sky-500/40 bg-sky-950/40 text-sky-400'
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
  const className = 'h-4 w-4 text-sky-400'

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

export default function WhatComesNext() {
  return (
    <section aria-labelledby="what-comes-next" className="mb-10">
      <div className="mb-5">
        <h2 id="what-comes-next" className="text-lg font-semibold tracking-tight text-slate-100">
          What Comes Next?
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Overview of the next steps in AI evolution and the challenges ahead
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {whatComesNextItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-sky-900/30 bg-trace-surface/40 px-3 py-3"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-900/30 bg-black/60">
                <ItemIcon type={item.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                  {item.tag && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tagStyles(item.tag)}`}
                    >
                      {tagLabel(item.tag)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            </div>
          ))}
        </div>

        <aside className="rounded-xl border border-sky-800/40 bg-gradient-to-br from-sky-950/80 via-trace-surface/90 to-blue-950/60 p-5">
          <Shield className="h-8 w-8 text-sky-400" aria-hidden />
          <h3 className="mt-3 text-base font-semibold leading-snug text-slate-100">
            The Next Challenge is Making Smarter AI, Not Just Trustworthy AI
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Building systems capable of reasoning, learning autonomously, and acting with sound
            judgment beyond human supervision.
          </p>
          <ul className="mt-4 space-y-2">
            {trustChallengeBullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-xs text-slate-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-400" aria-hidden />
                {bullet}
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="mt-5 flex w-full items-center justify-center rounded-lg border border-sky-600/50 bg-sky-950/40 px-4 py-2.5 text-sm font-medium text-sky-300 transition hover:border-sky-500/50 hover:bg-sky-900/40 hover:text-sky-200"
          >
            Learn More
          </Link>
        </aside>

        <div className="rounded-xl border border-sky-800/30 bg-gradient-to-br from-sky-950/50 via-trace-surface/60 to-blue-950/40 px-5 py-6 text-center">
          <h3 className="text-base font-semibold text-slate-100">Understand Your Career Trajectory</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Get a personalized analysis of how AI evolution impacts your specific role, industry, and
            skill set.
          </p>
          <Link
            href="/auth"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500"
          >
            Get Your Analysis
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
