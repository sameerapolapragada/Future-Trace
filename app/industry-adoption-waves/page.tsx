import IndustryAdoptionWavesGrid from '@/components/IndustryAdoptionWavesGrid'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Industry Adoption Waves | Future Trace',
  description: 'How industries adopted AI over time—from healthcare to finance, software, and marketing.',
}

export default function IndustryAdoptionWavesPage() {
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
        <h1 className="mt-4 text-2xl font-bold text-textPrimary sm:text-3xl">Industry Adoption Waves</h1>
        <p className="mt-1 text-sm text-textSecondary sm:text-base">
          How industries adopted AI over time
        </p>
      </header>

      <section aria-label="Industry adoption overview">
        <IndustryAdoptionWavesGrid />
      </section>

      <p className="mt-8 text-center">
        <Link
          href="/industries"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:text-highlight"
        >
          Explore full industry analysis
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
    </div>
  )
}
