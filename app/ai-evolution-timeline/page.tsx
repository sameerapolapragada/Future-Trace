import AIEvolutionTimelineMilestones from '@/components/AIEvolutionTimelineMilestones'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Evolution Timeline | Future Trace',
  description:
    'Key milestones in AI development—from symbolic systems to agentic workflows and autonomous futures.',
}

export default function AIEvolutionTimelinePage() {
  return (
    <div className="mx-auto w-full max-w-7xl text-textSecondary">
      <header className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:text-highlight"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-textPrimary sm:text-3xl">AI Evolution Timeline</h1>
        <p className="mt-1 text-sm text-textSecondary sm:text-base">
          Key milestones in AI development
        </p>
      </header>

      <section aria-label="AI evolution milestones">
        <AIEvolutionTimelineMilestones />
      </section>

      <p className="mt-8 text-center">
        <Link
          href="/timeline"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-highlight"
        >
          Explore the full interactive timeline
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
    </div>
  )
}
