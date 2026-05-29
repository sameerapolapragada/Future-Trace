import { Briefcase, Cpu, TrendingUp } from 'lucide-react'

const stats = [
  {
    id: 'years',
    value: '75+ Years',
    description: 'AI evolution tracked from 1950s to agentic workflows',
    icon: TrendingUp,
    iconClass: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
  },
  {
    id: 'industries',
    value: '12+ Industries',
    description: 'From healthcare to finance, software to marketing',
    icon: Briefcase,
    iconClass: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
  },
  {
    id: 'waves',
    value: '8 Tech Waves',
    description: 'Rule-based AI to multi-agent autonomous systems',
    icon: Cpu,
    iconClass: 'text-sky-400',
    iconBg: 'bg-sky-400/10',
  },
] as const

export default function HomeStats() {
  return (
    <section aria-label="Platform highlights" className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <article
            key={stat.id}
            className="rounded-xl border border-sky-900/30 bg-trace-surface/80 p-4 backdrop-blur-sm"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.iconBg}`}>
              <Icon className={`h-5 w-5 ${stat.iconClass}`} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">{stat.value}</h2>
            <p className="mt-1 text-sm leading-snug text-slate-400">{stat.description}</p>
          </article>
        )
      })}
    </section>
  )
}
