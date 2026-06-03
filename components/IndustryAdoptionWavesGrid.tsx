'use client'

import { industries } from '@/data/industries'
import {
  BarChart2,
  BookOpen,
  Headphones,
  Heart,
  Laptop,
  Megaphone,
  Scale,
  Users,
} from 'lucide-react'

function IndustryIcon({ id }: { id: string }) {
  const className = 'h-4 w-4'

  switch (id) {
    case 'healthcare':
      return <Heart className={`${className} text-rose-400`} />
    case 'finance':
      return <BarChart2 className={`${className} text-highlight`} />
    case 'crm-sales':
      return <Users className={`${className} text-highlight`} />
    case 'customer-support':
      return <Headphones className={`${className} text-accent`} />
    case 'education':
      return <BookOpen className={`${className} text-accent`} />
    case 'legal':
      return <Scale className={`${className} text-slate-300`} />
    case 'software-engineering':
      return <Laptop className={`${className} text-accent`} />
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
      return 'bg-highlight-muted'
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

export default function IndustryAdoptionWavesGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
      {industries.map((item) => (
        <article
          key={item.id}
          className="flex min-h-[5.5rem] flex-col rounded-xl border border-borderMuted bg-surface px-3.5 py-3 shadow-horizon"
        >
          <span className={`inline-flex w-fit shrink-0 rounded-md p-1.5 ${iconBg(item.id)}`} aria-hidden>
            <IndustryIcon id={item.id} />
          </span>
          <h3 className="mt-2.5 text-[13px] font-semibold leading-snug text-textPrimary">{item.name}</h3>
        </article>
      ))}
    </div>
  )
}
