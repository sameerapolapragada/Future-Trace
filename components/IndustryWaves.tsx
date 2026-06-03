'use client'

import { industries, type IndustryCard } from '../data/industries'
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  Code,
  Headphones,
  Heart,
  Megaphone,
  Scale,
  Users,
} from 'lucide-react'
import { useState } from 'react'

const iconFor = (id: string) => {
  switch (id) {
    case 'healthcare':
      return <Heart className="h-5 w-5 text-rose-400" />
    case 'finance':
      return <BarChart2 className="h-5 w-5 text-highlight" />
    case 'crm-sales':
      return <Users className="h-5 w-5 text-highlight" />
    case 'customer-support':
      return <Headphones className="h-5 w-5 text-accent" />
    case 'education':
      return <BookOpen className="h-5 w-5 text-accent" />
    case 'legal':
      return <Scale className="h-5 w-5 text-slate-300" />
    case 'software-engineering':
      return <Code className="h-5 w-5 text-accent" />
    case 'marketing':
      return <Megaphone className="h-5 w-5 text-orange-400" />
    default:
      return <Users className="h-5 w-5 text-slate-400" />
  }
}

function BulletSection({
  title,
  items,
  titleClassName,
}: {
  title: string
  items: string[]
  titleClassName: string
}) {
  return (
    <div>
      <h4 className={`text-sm font-semibold ${titleClassName}`}>{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-400">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-500" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function IndustryAccordion({ industry }: { industry: IndustryCard }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-lg border border-trace-border bg-trace-surface">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-trace-surface focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-inset"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-trace-border bg-slate-100">
          {iconFor(industry.id)}
        </div>
        <h3 className="min-w-0 flex-1 text-base font-semibold text-trace-foreground">{industry.name}</h3>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-trace-border px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <BulletSection title="Early AI" items={industry.earlyAI} titleClassName="text-cyan-400" />
            <BulletSection title="Current AI" items={industry.currentAI} titleClassName="text-accent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <BulletSection title="Main risks" items={industry.mainRisks} titleClassName="text-orange-400" />
            <BulletSection
              title="Main opportunities"
              items={industry.mainOpportunities}
              titleClassName="text-highlight"
            />
          </div>
          <BulletSection
            title="Agentic Future"
            items={industry.agenticFuture}
            titleClassName="text-highlight"
          />
        </div>
      )}
    </article>
  )
}

export default function IndustryWaves() {
  return (
    <section aria-label="Industry details" className="flex flex-col gap-3">
      {industries.map((industry) => (
        <IndustryAccordion key={industry.id} industry={industry} />
      ))}
    </section>
  )
}
