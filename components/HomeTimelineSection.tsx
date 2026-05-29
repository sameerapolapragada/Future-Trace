import EvolutionTimelinePreview from '@/components/EvolutionTimelinePreview'
import HomeStats from '@/components/HomeStats'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function HomeTimelineSection() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/auth"
          className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500"
        >
          Get Your Analysis
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 rounded-lg border border-sky-800/50 bg-trace-surface/40 px-5 py-2.5 text-sm font-medium text-sky-300 transition hover:border-sky-600/50 hover:bg-trace-surface/60 hover:text-sky-200"
        >
          Learn More
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <HomeStats />
      <EvolutionTimelinePreview />
    </>
  )
}
