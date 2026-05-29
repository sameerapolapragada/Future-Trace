import IndustryWaves from '@/components/IndustryWaves'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Industry Adoption Waves | Future Trace',
  description: 'Explore how different industries adopted AI and what to expect next.',
}

export default function IndustriesPage() {
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
        <h1 className="mt-4 text-2xl font-bold text-slate-100">Industry Adoption Waves</h1>
        <p className="mt-1 text-sm text-slate-400">
          How different industries adopted AI and what to expect next
        </p>
      </header>

      <IndustryWaves />
    </div>
  )
}
