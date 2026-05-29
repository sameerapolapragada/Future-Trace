import JobsAffected from '@/components/JobsAffected'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Career Impact Analysis | Future Trace',
  description: 'Explore how AI is transforming different roles and their disruption risk levels.',
}

export default function JobsPage() {
  return (
    <div className="bg-black text-slate-300">
      <header className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 transition hover:text-sky-300"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-100">Career Impact Analysis</h1>
        <p className="mt-1 text-sm text-slate-400">
          Explore how AI is transforming different roles and their disruption risk levels
        </p>
      </header>

      <JobsAffected />
    </div>
  )
}
