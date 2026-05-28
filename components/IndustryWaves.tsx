"use client"

import { industries, type IndustryCard } from '../data/industries'
import { Heart, BarChart2, Users, Headphones, BookOpen, Scale, Code, Megaphone } from 'lucide-react'

const iconFor = (id: string) => {
  switch (id) {
    case 'healthcare':
      return <Heart className="w-6 h-6 text-rose-500" />
    case 'finance':
      return <BarChart2 className="w-6 h-6 text-emerald-600" />
    case 'crm-sales':
      return <Users className="w-6 h-6 text-sky-600" />
    case 'customer-support':
      return <Headphones className="w-6 h-6 text-indigo-600" />
    case 'education':
      return <BookOpen className="w-6 h-6 text-violet-600" />
    case 'legal':
      return <Scale className="w-6 h-6 text-slate-700" />
    case 'software-engineering':
      return <Code className="w-6 h-6 text-sky-700" />
    case 'marketing':
      return <Megaphone className="w-6 h-6 text-orange-500" />
    default:
      return <Users className="w-6 h-6 text-slate-500" />
  }
}

export default function IndustryWaves() {
  return (
    <section aria-labelledby="industry-waves" className="mb-12">
      <div className="mb-6">
        <h2 id="industry-waves" className="text-2xl sm:text-3xl font-bold text-slate-900">Industry Adoption Waves</h2>
        <p className="mt-2 text-slate-600">How different industries adopted AI and what to expect next.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {industries.map((it: IndustryCard) => (
          <article key={it.id} className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all hover:border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                {iconFor(it.id)}
              </div>
              <h3 className="text-lg font-semibold">{it.name}</h3>
            </div>

            <div className="mt-4 text-slate-700 space-y-3 text-sm">
              <div>
                <strong>Early AI use:</strong>
                <p className="mt-1">{it.earlyAIUse}</p>
              </div>

              <div>
                <strong>Current AI use:</strong>
                <p className="mt-1">{it.currentAIUse}</p>
              </div>

              <div>
                <strong>Agentic AI future:</strong>
                <p className="mt-1">{it.agenticAIFuture}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div>
                  <strong>Main risks</strong>
                  <ul className="list-disc list-inside mt-1 text-slate-600">
                    {it.mainRisks.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Main opportunity</strong>
                  <p className="mt-1 text-slate-600">{it.mainOpportunity}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
