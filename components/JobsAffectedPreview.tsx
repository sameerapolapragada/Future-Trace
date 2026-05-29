'use client'

import { careerRolesPreview, type CareerRole, type CareerRoleIcon } from '@/data/careerImpact'
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Headphones,
  Laptop,
  Scale,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

function RoleIcon({ type }: { type: CareerRoleIcon }) {
  const className = 'h-5 w-5 text-slate-300'

  switch (type) {
    case 'laptop':
      return <Laptop className={className} />
    case 'smartphone':
      return <Smartphone className={className} />
    case 'chart':
      return <BarChart3 className={className} />
    case 'target':
      return <Target className={className} />
    case 'headphones':
      return <Headphones className={className} />
    case 'scale':
      return <Scale className={className} />
    case 'code':
      return <Laptop className={className} />
    case 'shield':
      return <ShieldCheck className={className} />
    default:
      return <Laptop className={className} />
  }
}

function riskStyles(role: CareerRole) {
  switch (role.riskLevel) {
    case 'high':
      return { bar: 'bg-rose-400', label: 'text-rose-400', status: 'High Risk' }
    case 'medium':
      return { bar: 'bg-orange-400', label: 'text-orange-400', status: 'Medium Risk' }
    case 'low':
      return { bar: 'bg-emerald-400', label: 'text-emerald-400', status: 'Low Risk' }
  }
}

export function CareerImpactCard({ role }: { role: CareerRole }) {
  const styles = riskStyles(role)

  return (
    <article className="min-w-[9.25rem] flex-shrink-0 rounded-xl border border-sky-900/30 bg-trace-surface/40 px-3 pb-3 pt-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-900/30 bg-black/60">
        <RoleIcon type={role.icon} />
      </div>

      <div className="relative z-10 my-3 flex justify-center">
        <div className="h-2.5 w-2.5 rounded-full border-2 border-sky-400 bg-black" aria-hidden />
      </div>

      <h3 className="text-center text-sm font-semibold leading-tight text-slate-100">{role.role}</h3>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${role.disruptionRisk}%` }}
        />
      </div>

      <p className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${styles.label}`}>
        {role.riskLevel === 'high' ? (
          <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
        ) : (
          <ArrowRight className="h-3 w-3 shrink-0" aria-hidden />
        )}
        {styles.status}
      </p>
    </article>
  )
}

export default function JobsAffectedPreview() {
  return (
    <section aria-labelledby="jobs-affected-heading" className="mb-10">
      <div className="text-center">
        <h2 id="jobs-affected-heading" className="text-lg font-semibold tracking-tight text-slate-100">
          Jobs Affected by AI Evolution
        </h2>
        <p className="mt-1 text-xs text-slate-500">Click on any role to see detailed impact analysis</p>
      </div>

      <div className="relative mt-6">
        <div
          className="pointer-events-none absolute left-6 right-6 z-0 h-px bg-sky-700/50"
          style={{ top: '3.75rem' }}
          aria-hidden
        />
        <div className="relative z-10 -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {careerRolesPreview.map((role) => (
            <Link key={role.id} href={`/jobs#${role.id}`} className="block transition hover:opacity-90">
              <CareerImpactCard role={role} />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 rounded-lg border border-sky-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-600/50 hover:text-white"
        >
          View All Career Analyses
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
