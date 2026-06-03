import WhatComesNextContent from '@/components/WhatComesNextContent'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'What Comes Next | Future Trace',
  description:
    'The next steps in AI evolution—agents, workflows, governance, and the challenges ahead.',
}

export default function WhatComesNextPage() {
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
        <h1 className="mt-4 text-2xl font-bold text-textPrimary sm:text-3xl">What Comes Next?</h1>
        <p className="mt-1 text-sm text-textSecondary sm:text-base">
          Overview of the next steps in AI evolution and the challenges ahead
        </p>
      </header>

      <section aria-label="What comes next in AI">
        <WhatComesNextContent />
      </section>
    </div>
  )
}
