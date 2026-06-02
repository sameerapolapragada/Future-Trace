import JobsAffectedByAIGrid from '@/components/JobsAffectedByAIGrid'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jobs Affected by AI Evolution | Future Trace',
  description:
    'See how AI disruption affects roles across industries—with risk levels from high to low.',
}

export default function JobsAffectedByAIPage() {
  return (
    <div className="mx-auto w-full max-w-7xl text-textSecondary">
      <header className="mb-8 text-center sm:text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-highlight"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-textPrimary sm:text-3xl">
          Jobs Affected by AI Evolution
        </h1>
        <p className="mt-1 text-sm text-textSecondary sm:text-base">
          Click on any role to see detailed impact analysis
        </p>
      </header>

      <section aria-label="Career roles affected by AI">
        <JobsAffectedByAIGrid />
      </section>

      <p className="mt-8 text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-highlight"
        >
          View all career analyses
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
    </div>
  )
}
