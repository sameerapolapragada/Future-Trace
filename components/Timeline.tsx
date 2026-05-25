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
  Robot,
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
  if (c.includes('agentic') || c.includes('agent')) return <Robot className="w-5 h-5" />
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
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm border ${
                filter === f ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto w-full sm:w-64">
          <label className="sr-only">Search timeline</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search year, title, industry, job, category..."
            className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((m) => {
          const isOpen = openId === m.id
          return (
            <article
              key={m.id}
              className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="w-full text-left flex flex-col sm:flex-row sm:items-start gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-slate-50 border border-slate-100">
                    {categoryIcon(m.technologyCategory)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{m.title}</h3>
                      <span className="text-sm text-slate-500">{m.year}</span>
                    </div>
                    <p className="mt-2 text-slate-700">{m.shortDescription}</p>
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
                <div className="mt-4 border-t pt-4 text-sm text-slate-700 grid gap-3 sm:grid-cols-2">
                  <div>
                    <h4 className="font-medium">Why it mattered</h4>
                    <p className="mt-1 text-slate-600">{m.whyItMattered}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Future implication</h4>
                    <p className="mt-1 text-slate-600">{m.futureImplication}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Industries impacted</h4>
                    <ul className="list-disc list-inside mt-1 text-slate-600">
                      {m.industriesImpacted.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Jobs affected</h4>
                    <ul className="list-disc list-inside mt-1 text-slate-600">
                      {m.jobsAffected.map((j) => (
                        <li key={j}>{j}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          )
        })}

        {visible.length === 0 && (
          <div className="p-6 bg-white border border-slate-100 rounded-md text-slate-600">No results match your filters or search.</div>
        )}
      </div>
    </section>
  )
}
