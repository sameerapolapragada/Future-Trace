import type { TimelineEntry } from '../data/timeline'
import { timeline } from '../data/timeline'
import { Cpu, Layers, Brain, Database, Robot, Users, Zap } from 'lucide-react'

const iconFor = (id: string) => {
  switch (id) {
    case 'rule-based':
      return <Cpu className="w-6 h-6 text-sky-600" />
    case 'ml':
      return <Zap className="w-6 h-6 text-green-600" />
    case 'deep-learning':
      return <Brain className="w-6 h-6 text-pink-600" />
    case 'transformers':
      return <Layers className="w-6 h-6 text-violet-600" />
    case 'rag':
      return <Database className="w-6 h-6 text-orange-600" />
    case 'agents':
      return <Robot className="w-6 h-6 text-emerald-600" />
    case 'multi-agent':
      return <Users className="w-6 h-6 text-amber-600" />
    default:
      return <Cpu className="w-6 h-6 text-slate-600" />
  }
}

export default function Timeline({ entries = timeline }: { entries?: TimelineEntry[] }) {
  return (
    <section id="timeline">
      <div className="space-y-6">
        {entries.map((e) => (
          <article key={e.id} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-start gap-4">
              <div className="shrink-0">{iconFor(e.id)}</div>
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold">{e.title}</h3>
                  <span className="text-sm text-slate-500">{e.period}</span>
                </div>
                <p className="mt-2 text-slate-700">{e.summary}</p>
                {e.details && <p className="mt-3 text-sm text-slate-500">{e.details}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
