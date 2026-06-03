'use client'

import { scoreGaugeColor } from '@/lib/analyzeResume'
import { History } from 'lucide-react'

export type MatcherFreeHistoryEntry = {
  id: string
  targetRole: string
  marketRiskScore: number
  createdAt: string
}

type MatcherFreeHistoryListProps = {
  entries: MatcherFreeHistoryEntry[]
  onStartAnalysis: () => void
}

function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MatcherFreeHistoryList({
  entries,
  onStartAnalysis,
}: MatcherFreeHistoryListProps) {
  if (entries.length === 0) {
    return (
      <section
        aria-labelledby="matcher-history-empty-heading"
        className="flex flex-col items-center rounded-2xl border border-dashed border-trace-border bg-trace-surface px-6 py-16 text-center"
      >
        <History className="h-9 w-9 text-slate-600" aria-hidden />
        <h2 id="matcher-history-empty-heading" className="mt-4 text-sm font-semibold text-textPrimary">
          No scans yet
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-textSecondary">
          Run your first Career Matcher analysis to see target roles and risk scores here.
        </p>
        <button
          type="button"
          onClick={onStartAnalysis}
          className="btn-primary mt-6 inline-flex items-center justify-center"
        >
          Go to Career Matcher
        </button>
      </section>
    )
  }

  return (
    <section aria-labelledby="matcher-history-heading" className="flex flex-col gap-4">
      <h2 id="matcher-history-heading" className="text-sm font-semibold text-textPrimary">
        Scan history
      </h2>
      <ul className="divide-y divide-borderMuted overflow-hidden rounded-xl border border-trace-border bg-trace-surface">
        {entries.map((entry) => (
          <li key={entry.id} className="px-4 py-4">
            <p className="text-sm font-medium text-textPrimary">
              <span className="font-semibold">{entry.targetRole}</span>
              <span className="text-textSecondary"> – Risk Score </span>
              <span className="font-bold tabular-nums" style={{ color: scoreGaugeColor(entry.marketRiskScore) }}>
                {entry.marketRiskScore}
              </span>
            </p>
            <p className="mt-1 text-xs text-textSecondary">{formatHistoryDate(entry.createdAt)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
