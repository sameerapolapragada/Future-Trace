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
  if (c.includes('rule')) return <Cpu className="h-5 w-5 text-highlight" />
  if (c.includes('stat') || c.includes('ml')) return <Zap className="h-5 w-5 text-highlight" />
  if (c.includes('deep')) return <Brain className="h-5 w-5 text-highlight" />
  if (c.includes('transform')) return <Layers className="h-5 w-5 text-highlight" />
  if (c.includes('generat') || c.includes('llm')) return <FileText className="h-5 w-5 text-highlight" />
  if (c.includes('retriev') || c.includes('rag')) return <Database className="h-5 w-5 text-highlight" />
  if (c.includes('agentic') || c.includes('agent')) return <Brain className="h-5 w-5 text-highlight" />
  if (c.includes('multi')) return <Users className="h-5 w-5 text-highlight" />
  return <Cpu className="h-5 w-5 text-highlight" />
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
      <div className="mb-6 rounded-lg border border-trace-border bg-trace-surface p-4 backdrop-blur-sm">
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Filter by technology
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'border border-sky-400 bg-accent text-white'
                    : 'border border-trace-border bg-slate-100 text-slate-300 hover:border-trace-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="timeline-search"
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Search
          </label>
          <input
            id="timeline-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search year, title, industry, job role, technology..."
            className="mt-2 w-full rounded-md border border-trace-border bg-slate-100 px-3 py-2 text-sm text-trace-foreground placeholder-slate-500 backdrop-blur-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-highlight"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((m) => {
          const isOpen = openId === m.id
          return (
            <article
              key={m.id}
              className="rounded-lg border border-trace-border bg-trace-surface p-4 backdrop-blur-sm transition-all hover:border-trace-border sm:p-5"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="flex w-full flex-col gap-3 rounded px-1 py-0.5 text-left focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-white sm:flex-row sm:items-start"
              >
                <div className="flex flex-1 items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-trace-border bg-slate-100">
                    {categoryIcon(m.technologyCategory)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="text-base font-semibold text-trace-foreground sm:text-lg">{m.title}</h3>
                      <span className="text-xs font-medium text-slate-400 sm:text-sm">{m.year}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-300">{m.shortDescription}</p>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:ml-6">
                  <span className="hidden items-center gap-2 rounded-full border border-trace-border bg-slate-100 px-3 py-1 text-sm text-slate-300 sm:inline-flex">
                    {categoryIcon(m.technologyCategory)}
                    <span>{m.technologyCategory}</span>
                  </span>
                  <svg
                    className={`h-5 w-5 transform text-slate-400 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 grid gap-4 border-t border-trace-border pt-4 text-sm sm:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-trace-foreground">Why it mattered</h4>
                    <p className="mt-2 leading-relaxed text-slate-300">{m.whyItMattered}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trace-foreground">Future implication</h4>
                    <p className="mt-2 leading-relaxed text-slate-300">{m.futureImplication}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trace-foreground">Industries impacted</h4>
                    <ul className="mt-2 space-y-1 text-slate-300">
                      {m.industriesImpacted.map((i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 text-highlight">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trace-foreground">Jobs affected</h4>
                    <ul className="mt-2 space-y-1 text-slate-300">
                      {m.jobsAffected.map((j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="mt-1.5 text-highlight">•</span>
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
          <div className="rounded-lg border border-trace-border bg-trace-surface p-8 text-center backdrop-blur-sm">
            <p className="font-medium text-trace-foreground">No results found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </section>
  )
}
