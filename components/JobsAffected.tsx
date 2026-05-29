"use client"

import { jobGroups } from '../data/jobs'
import { Briefcase, ShieldCheck, Users, Zap } from 'lucide-react'

const iconFor = (id: string) => {
  switch (id) {
    case 'highly-exposed':
      return <Zap className="h-5 w-5 text-rose-400" />
    case 'moderately-exposed':
      return <Users className="h-5 w-5 text-amber-400" />
    case 'ai-augmented':
      return <Briefcase className="h-5 w-5 text-indigo-400" />
    case 'ai-resilient':
      return <ShieldCheck className="h-5 w-5 text-emerald-400" />
    default:
      return <Briefcase className="h-5 w-5 text-slate-400" />
  }
}

export default function JobsAffected() {
  return (
    <section aria-labelledby="jobs-affected" className="mb-12">
      <div className="mb-6">
        <h2 id="jobs-affected" className="text-2xl sm:text-3xl font-bold text-slate-100">
          Jobs Affected by AI Evolution
        </h2>
        <p className="mt-2 text-slate-400">
          Grouped view of roles based on their likely exposure to AI automation and augmentation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {jobGroups.map((g) => (
          <article
            key={g.id}
            className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition-all hover:border-slate-700"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950/80">
                {iconFor(g.id)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{g.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{g.description}</p>
              </div>
            </div>

            <div className="mt-4">
              <ul className="space-y-2">
                {g.examples.map((e) => (
                  <li key={e.role} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-indigo-400" />
                    <div>
                      <div className="font-medium text-slate-100">{e.role}</div>
                      {e.note && <div className="text-sm text-slate-400">{e.note}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
