'use client'

import { industries } from '@/data/industries'
import {
  BarChart2,
  BookOpen,
  ChevronRight,
  Headphones,
  Heart,
  Laptop,
  Megaphone,
  Scale,
  Users,
} from 'lucide-react'
import Link from 'next/link'

function IndustryIcon({ id }: { id: string }) {
  const className = 'h-4 w-4'

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
      return <Laptop className={`${className} text-sky-400`} />
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
  return (
    <section aria-labelledby="industry-waves-heading" className="mb-10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="industry-waves-heading" className="text-lg font-semibold tracking-tight text-slate-100">
            Industry Adoption Waves
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">How industries adopted AI over time</p>
        </div>

        <Link
          href="/industries"
          className="inline-flex shrink-0 items-center gap-0.5 pt-0.5 text-xs font-medium text-sky-400 transition hover:text-sky-300"
        >
          View full
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
        {industries.map((item) => (
          <article
            key={item.id}
            className="flex min-h-[5.5rem] flex-col rounded-xl border border-sky-900/30 bg-trace-surface/50 px-3.5 py-3"
          >
            <span
              className={`inline-flex w-fit shrink-0 rounded-md p-1.5 ${iconBg(item.id)}`}
              aria-hidden
            >
              <IndustryIcon id={item.id} />
            </span>
            <h3 className="mt-2.5 text-[13px] font-semibold leading-snug text-slate-100">{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
