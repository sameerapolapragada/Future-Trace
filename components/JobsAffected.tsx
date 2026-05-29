'use client'

import { careerRoles, type CareerRole, type RiskLevel } from '@/data/careerImpact'
import { Briefcase, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const riskCategories: { level: RiskLevel; label: string }[] = [
  { level: 'high', label: 'High Risk' },
  { level: 'medium', label: 'Medium Risk' },
  { level: 'low', label: 'Low Risk' },
]

function riskBadgeStyles(level: RiskLevel) {
  switch (level) {
    case 'high':
      return {
        badge: 'border-rose-500/40 bg-rose-950/40 text-rose-400',
        bar: 'bg-rose-400',
        header: 'text-rose-400',
        border: 'border-rose-500/30',
      }
    case 'medium':
      return {
        badge: 'border-orange-500/40 bg-orange-950/40 text-orange-400',
        bar: 'bg-orange-400',
        header: 'text-orange-400',
        border: 'border-orange-500/30',
      }
    case 'low':
      return {
        badge: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400',
        bar: 'bg-emerald-400',
        header: 'text-emerald-400',
        border: 'border-emerald-500/30',
      }
  }
}

function riskLabel(level: RiskLevel) {
  switch (level) {
    case 'high':
      return 'High Risk'
    case 'medium':
      return 'Medium Risk'
    case 'low':
      return 'Low Risk'
  }
}

function MetricBar({
  label,
  value,
  barClassName,
}: {
  label: string
  value: number
  barClassName: string
}) {
  return (
    <div>
      <div className="mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function EvolutionTimeline({ role }: { role: CareerRole }) {
  const phases = [
    { key: 'early', label: 'Early AI', phase: role.evolution.earlyAI, dot: 'bg-slate-500', title: 'text-slate-400' },
    { key: 'current', label: 'Current AI', phase: role.evolution.currentAI, dot: 'bg-sky-400', title: 'text-sky-400' },
    {
      key: 'future',
      label: 'Agentic Future',
      phase: role.evolution.agenticFuture,
      dot: 'bg-cyan-400',
      title: 'text-cyan-400',
    },
  ] as const

  return (
    <div className="mt-5">
      <h4 className="text-sm font-semibold text-slate-100">Evolution Timeline</h4>
      <div className="relative mt-3 space-y-4 pl-1">
        <div className="absolute bottom-2 left-[5px] top-2 w-px bg-sky-900/50" aria-hidden />
        {phases.map(({ key, label, phase, dot, title }) => (
          <div key={key} className="relative flex gap-3">
            <div className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
            <div className="min-w-0">
              <p className={`text-xs font-semibold ${title}`}>
                {label} ({phase.era})
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {phase.items.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RoleAccordion({ role }: { role: CareerRole }) {
  const [open, setOpen] = useState(false)
  const styles = riskBadgeStyles(role.riskLevel)

  return (
    <article id={role.id} className="scroll-mt-24 overflow-hidden rounded-lg border border-sky-900/30 bg-trace-surface/30">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-trace-surface/80 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-900/30 bg-black/60">
          <Briefcase className="h-4 w-4 text-sky-400" aria-hidden />
        </div>
        <h3 className="min-w-0 flex-1 text-sm font-semibold text-slate-100">{role.role}</h3>
        <span
          className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline ${styles.badge}`}
        >
          {riskLabel(role.riskLevel)}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-sky-900/30 px-4 py-4">
          <div className="space-y-3">
            <MetricBar label="Disruption Risk" value={role.disruptionRisk} barClassName={styles.bar} />
            <MetricBar
              label="Automation Potential"
              value={role.automationPotential}
              barClassName="bg-cyan-400"
            />
          </div>
          <EvolutionTimeline role={role} />
        </div>
      )}
    </article>
  )
}

function RiskCategoryAccordion({ level, label }: { level: RiskLevel; label: string }) {
  const [open, setOpen] = useState(false)
  const styles = riskBadgeStyles(level)
  const roles = careerRoles.filter((role) => role.riskLevel === level)

  if (roles.length === 0) return null

  return (
    <section className={`overflow-hidden rounded-lg border bg-trace-surface/50 ${styles.border}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-trace-surface/80 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset"
      >
        <h2 className={`flex-1 text-base font-semibold ${styles.header}`}>{label}</h2>
        <span className="text-xs text-slate-500">
          {roles.length} {roles.length === 1 ? 'role' : 'roles'}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="flex flex-col gap-2 border-t border-sky-900/30 p-3">
          {roles.map((role) => (
            <RoleAccordion key={role.id} role={role} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function JobsAffected() {
  return (
    <div aria-label="Career impact analyses" className="flex flex-col gap-3">
      {riskCategories.map(({ level, label }) => (
        <RiskCategoryAccordion key={level} level={level} label={label} />
      ))}
    </div>
  )
}
