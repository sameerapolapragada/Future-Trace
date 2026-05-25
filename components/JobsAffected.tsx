"use client"

import { jobGroups } from '../data/jobs'
import { Briefcase, ShieldCheck, Users, Zap } from 'lucide-react'

const iconFor = (id: string) => {
  switch (id) {
    case 'highly-exposed':
      return <Zap className="w-5 h-5 text-rose-500" />
    case 'moderately-exposed':
      return <Users className="w-5 h-5 text-amber-500" />
    case 'ai-augmented':
      return <Briefcase className="w-5 h-5 text-sky-600" />
    case 'ai-resilient':
      return <ShieldCheck className="w-5 h-5 text-emerald-600" />
    default:
      return <Briefcase className="w-5 h-5 text-slate-500" />
  }
}

export default function JobsAffected() {
  return (
    <section aria-labelledby="jobs-affected" className="mb-12">
      <div className="mb-6">
        <h2 id="jobs-affected" className="text-2xl sm:text-3xl font-bold text-slate-900">Jobs Affected by AI Evolution</h2>
        <p className="mt-2 text-slate-600">Grouped view of roles based on their likely exposure to AI automation and augmentation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobGroups.map((g) => (
          <article key={g.id} className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-all hover:border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100">
                {iconFor(g.id)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{g.title}</h3>
                <p className="text-slate-600 mt-1 text-sm">{g.description}</p>
              </div>
            </div>

            <div className="mt-4">
              <ul className="space-y-2">
                {g.examples.map((e) => (
                  <li key={e.role} className="flex items-start gap-3">
                    <span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-400" />
                    <div>
                      <div className="font-medium">{e.role}</div>
                      {e.note && <div className="text-sm text-slate-600">{e.note}</div>}
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
