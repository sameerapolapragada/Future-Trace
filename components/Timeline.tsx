"use client"

import { useState } from 'react'
import type { Milestone } from '../data/timeline'
import { milestones } from '../data/timeline'
import {
  Cpu,
  Zap,
  Brain,
  Layers,
  FileText,
  Database,
  Users
} from 'lucide-react'

function categoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('rule')) return <Cpu className="w-5 h-5" />
  if (c.includes('stat') || c.includes('ml')) return <Zap className="w-5 h-5" />
  if (c.includes('deep')) return <Brain className="w-5 h-5" />
  if (c.includes('transform')) return <Layers className="w-5 h-5" />
  if (c.includes('generat') || c.includes('llm')) return <FileText className="w-5 h-5" />
  if (c.includes('retriev') || c.includes('rag')) return <Database className="w-5 h-5" />
  if (c.includes('agentic') || c.includes('agent')) return <Brain className="w-5 h-5" />
  if (c.includes('multi')) return <Users className="w-5 h-5" />
  return <Cpu className="w-5 h-5" />
}

export default function Timeline({ entries = milestones }: { entries?: Milestone[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState<string>('')

  const filters = [
    'All',
    'Rule-Based AI',
    'Machine Learning',
    'Deep Learning',
    'Transformers',
    'Generative AI',
    'RAG',
    'AI Agents',
    'Multi-Agent Systems'
  ]

  function matchesFilter(m: Milestone) {
    if (filter === 'All') return true
    const f = filter.toLowerCase()
    const cat = m.technologyCategory.toLowerCase()
    if (f === 'rule-based ai') return cat.includes('rule') || cat.includes('symbol') || cat.includes('expert')
    if (f === 'machine learning') return cat.includes('ml') || cat.includes('stat')
    if (f === 'deep learning') return cat.includes('deep')
    if (f === 'transformers') return cat.includes('transform')
    if (f === 'generative ai') return cat.includes('generat') || cat.includes('foundation') || cat.includes('llm')
    if (f === 'rag') return cat.includes('retriev') || cat.includes('rag')
    if (f === 'ai agents') return cat.includes('agent') || cat.includes('agentic')
    if (f === 'multi-agent systems') return cat.includes('multi')
    return true
  }

  function matchesQuery(m: Milestone) {
    const q = query.trim().toLowerCase()
    if (!q) return true
    if (m.year.toLowerCase().includes(q)) return true
    if (m.title.toLowerCase().includes(q)) return true
    if (m.technologyCategory.toLowerCase().includes(q)) return true
    if (m.industriesImpacted.some((i) => i.toLowerCase().includes(q))) return true
    if (m.jobsAffected.some((j) => j.toLowerCase().includes(q))) return true
    return false
  }

  const visible = entries.filter((m) => matchesFilter(m) && matchesQuery(m))

  return (
    <section id="timeline">
      <div className="mb-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Filter by technology</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-sky-600 text-white border border-sky-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="timeline-search" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Search
          </label>
          <input
            id="timeline-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search year, title, industry, job role, technology..."
            className="w-full mt-2 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((m) => {
          const isOpen = openId === m.id
          return (
            <article
              key={m.id}
              className="bg-white border border-slate-100 rounded-lg shadow-sm p-4 sm:p-5 transition-all hover:shadow-md hover:border-slate-200"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="w-full text-left flex flex-col sm:flex-row sm:items-start gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded px-1 py-0.5"
              >
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-50 border border-slate-200 flex-shrink-0 mt-0.5">
                    {categoryIcon(m.technologyCategory)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900">{m.title}</h3>
                      <span className="text-xs sm:text-sm text-slate-500 font-medium">{m.year}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{m.shortDescription}</p>
                  </div>
                </div>

                <div className="ml-auto sm:ml-6 flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-slate-50 text-slate-700 border border-slate-100">
                    {categoryIcon(m.technologyCategory)}
                    <span>{m.technologyCategory}</span>
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-sm grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-slate-900">Why it mattered</h4>
                    <p className="mt-2 text-slate-600 leading-relaxed">{m.whyItMattered}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">Future implication</h4>
                    <p className="mt-2 text-slate-600 leading-relaxed">{m.futureImplication}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">Industries impacted</h4>
                    <ul className="mt-2 space-y-1 text-slate-600">
                      {m.industriesImpacted.map((i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1.5">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">Jobs affected</h4>
                    <ul className="mt-2 space-y-1 text-slate-600">
                      {m.jobsAffected.map((j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1.5">•</span>
                          <span>{j}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          )
        })}

        {visible.length === 0 && (
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-lg text-center text-slate-600">
            <p className="font-medium">No results found</p>
            <p className="mt-1 text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </section>
  )
}
