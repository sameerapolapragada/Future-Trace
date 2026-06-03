'use client'

import { scoreExposureLabel, scoreGaugeColor } from '@/lib/analyzeResume'
import { exposureRiskBadgeClass } from '@/theme/statusBadges'
import type { MatcherScanResponse, TransitionRole } from '@/types/matcherScan'
import { RefreshCw } from 'lucide-react'

function formatSalaryRange(min: number, max: number): string {
  const fmt = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  return `${fmt(min)} – ${fmt(max)}`
}

function transitionRankLabel(rank: number, total: number): string {
  if (rank === 1) return '#1 · Fewest skills to learn'
  if (rank === total) return `#${rank} · Most skills to learn`
  return `#${rank}`
}

function TransitionRoleCard({
  role,
  rank,
  total,
}: {
  role: TransitionRole
  rank: number
  total: number
}) {
  return (
    <article className="rounded-xl border border-trace-border bg-trace-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            {transitionRankLabel(rank, total)}
          </p>
          <h4 className="mt-1 text-base font-semibold text-textPrimary">{role.title}</h4>
        </div>
        <span className="rounded-full border border-accent/30 bg-accentMuted px-2.5 py-1 text-xs font-semibold text-accent">
          {role.matchPercent}% match
        </span>
      </div>
      <p className="mt-3 text-sm text-textSecondary">{formatSalaryRange(role.salaryRangeMin, role.salaryRangeMax)}</p>
      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
          Technical skill gaps
        </p>
        <ul className="mt-2 space-y-1.5">
          {role.skillGaps.map((gap) => (
            <li key={gap} className="flex gap-2 text-sm text-textSecondary">
              <span className="text-accent">•</span>
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function MarketRiskGauge({
  score,
  rationale,
  targetRole,
}: {
  score: number
  rationale: string
  targetRole: string
}) {
  const riskLabel = scoreExposureLabel(score)
  const scoreColor = scoreGaugeColor(score)
  const riskBadgeClass = exposureRiskBadgeClass(riskLabel)

  return (
    <section className="horizon-card p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
        Target role
      </p>
      <h3 className="mt-2 text-lg font-semibold text-textPrimary">{targetRole}</h3>

      <div className="mt-6 flex flex-col gap-5 border-t border-borderMuted pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
            Market risk score
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums" style={{ color: scoreColor }}>
            {score}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:max-w-md">
          <div
            className="h-2.5 overflow-hidden rounded-full bg-borderMuted"
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Market risk score ${score} out of 100`}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${score}%`, backgroundColor: scoreColor }}
            />
          </div>
          <span
            className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${riskBadgeClass}`}
          >
            {riskLabel}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-textSecondary">{rationale}</p>
    </section>
  )
}

type MatcherResultsViewProps = {
  result: MatcherScanResponse
  onRunAnotherScan: () => void
}

export default function MatcherResultsView({ result, onRunAnotherScan }: MatcherResultsViewProps) {
  const roles = result.matchedRoles.slice(0, 5)

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <MarketRiskGauge
        score={result.marketRiskScore}
        rationale={result.riskRationale}
        targetRole={result.targetRole}
      />

      {roles.length > 0 ? (
        <section aria-labelledby="transition-roles-heading">
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-textSecondary">
              Immediate transitions
            </p>
            <h3 id="transition-roles-heading" className="mt-1 text-lg font-semibold text-textPrimary">
              5 close roles you can move into now
            </h3>
            <p className="mt-1 text-sm text-textSecondary">
              Ranked by how much new technical skill you would need — #1 is the smallest jump, #5
              is the largest.
            </p>
          </div>

          <ol className="grid list-none gap-4 p-0">
            {roles.map((role, index) => (
              <li key={`${role.title}-${index}`}>
                <TransitionRoleCard
                  role={role}
                  rank={index + 1}
                  total={roles.length}
                />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <button
        type="button"
        onClick={onRunAnotherScan}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-trace-border bg-trace-surface py-3 text-sm font-medium text-textSecondary transition hover:bg-trace-raised"
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
        Run Another Scan
      </button>
    </section>
  )
}
