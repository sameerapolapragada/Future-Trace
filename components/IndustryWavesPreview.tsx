'use client'

import { industries } from '@/data/industries'
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Code,
  Headphones,
  Heart,
  Megaphone,
  Scale,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function IndustryIcon({ id }: { id: string }) {
  const className = 'h-3.5 w-3.5'

  switch (id) {
    case 'healthcare':
      return <Heart className={`${className} text-rose-400`} />
    case 'finance':
      return <BarChart2 className={`${className} text-emerald-400`} />
    case 'crm-sales':
      return <Users className={`${className} text-sky-300`} />
    case 'customer-support':
      return <Headphones className={`${className} text-sky-200`} />
    case 'education':
      return <BookOpen className={`${className} text-sky-400`} />
    case 'legal':
      return <Scale className={`${className} text-slate-300`} />
    case 'software-engineering':
      return <Code className={`${className} text-sky-400`} />
    case 'marketing':
      return <Megaphone className={`${className} text-orange-400`} />
    default:
      return <Users className={`${className} text-slate-400`} />
  }
}

function iconBg(id: string): string {
  switch (id) {
    case 'healthcare':
      return 'bg-rose-400/10'
    case 'finance':
      return 'bg-emerald-400/10'
    case 'crm-sales':
      return 'bg-sky-300/10'
    case 'customer-support':
      return 'bg-sky-200/10'
    case 'education':
      return 'bg-sky-400/10'
    case 'legal':
      return 'bg-slate-300/10'
    case 'software-engineering':
      return 'bg-sky-400/10'
    case 'marketing':
      return 'bg-orange-400/10'
    default:
      return 'bg-sky-400/10'
  }
}

export default function IndustryWavesPreview() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setExpanded(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <section aria-labelledby="industry-waves-heading" className="mb-10">
      <div className="flex items-center justify-between gap-3 border-b border-sky-900/30 pb-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left md:pointer-events-none md:cursor-default"
          aria-expanded={expanded}
          aria-controls="industry-waves-grid"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform md:hidden ${
              expanded ? 'rotate-0' : '-rotate-90'
            }`}
            aria-hidden
          />
          <div className="min-w-0">
            <h2 id="industry-waves-heading" className="text-lg font-semibold tracking-tight text-slate-100">
              Industry Adoption Waves
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">How industries adopted AI over time</p>
          </div>
        </button>

        <Link
          href="/industries"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-sky-400 transition hover:text-sky-300"
        >
          View full
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div
        id="industry-waves-grid"
        className={`grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 ${
          expanded ? 'mt-4 block' : 'mt-0 hidden md:mt-4 md:grid'
        }`}
      >
        {industries.map((item) => (
          <article
            key={item.id}
            className="flex min-h-[4rem] flex-col justify-center rounded-lg border border-sky-900/20 bg-trace-surface/30 px-3 py-2.5"
          >
            <span
              className={`inline-flex w-fit shrink-0 rounded-md p-1 ${iconBg(item.id)}`}
              aria-hidden
            >
              <IndustryIcon id={item.id} />
            </span>
            <h3 className="mt-1.5 text-[13px] font-semibold leading-tight text-slate-100">{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
