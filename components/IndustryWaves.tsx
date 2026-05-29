"use client"

import { industries, type IndustryCard } from '../data/industries'
import { Heart, BarChart2, Users, Headphones, BookOpen, Scale, Code, Megaphone } from 'lucide-react'

const iconFor = (id: string) => {
  switch (id) {
    case 'healthcare':
      return <Heart className="h-6 w-6 text-rose-400" />
    case 'finance':
      return <BarChart2 className="h-6 w-6 text-emerald-400" />
    case 'crm-sales':
      return <Users className="h-6 w-6 text-indigo-400" />
    case 'customer-support':
      return <Headphones className="h-6 w-6 text-indigo-300" />
    case 'education':
      return <BookOpen className="h-6 w-6 text-violet-400" />
    case 'legal':
      return <Scale className="h-6 w-6 text-slate-300" />
    case 'software-engineering':
      return <Code className="h-6 w-6 text-sky-400" />
    case 'marketing':
      return <Megaphone className="h-6 w-6 text-orange-400" />
    default:
      return <Users className="h-6 w-6 text-slate-400" />
  }
}

export default function IndustryWaves() {
  return (
    <section aria-labelledby="industry-waves" className="mb-12">
      <div className="mb-6">
        <h2 id="industry-waves" className="text-2xl sm:text-3xl font-bold text-slate-100">
          Industry Adoption Waves
        </h2>
        <p className="mt-2 text-slate-400">How different industries adopted AI and what to expect next.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((it: IndustryCard) => (
          <article
            key={it.id}
            className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition-all hover:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/80">
                {iconFor(it.id)}
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{it.name}</h3>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <strong className="text-slate-100">Early AI use:</strong>
                <p className="mt-1">{it.earlyAIUse}</p>
              </div>

              <div>
                <strong className="text-slate-100">Current AI use:</strong>
                <p className="mt-1">{it.currentAIUse}</p>
              </div>

              <div>
                <strong className="text-slate-100">Agentic AI future:</strong>
                <p className="mt-1">{it.agenticAIFuture}</p>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <strong className="text-slate-100">Main risks</strong>
                  <ul className="mt-1 list-inside list-disc text-slate-400">
                    {it.mainRisks.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-slate-100">Main opportunity</strong>
                  <p className="mt-1 text-emerald-400/90">{it.mainOpportunity}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
