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

  return (
    <section id="timeline">
      <div className="flex flex-col gap-4">
        {entries.map((m) => {
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
      </div>
    </section>
  )
}
