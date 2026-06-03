import { trustChallengeBullets } from '@/data/whatComesNext'
import { ChevronRight, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomeWhatComesNextHighlights() {
  return (
    <section aria-label="What comes next highlights" className="mb-10 space-y-4">
      <aside className="rounded-xl border border-borderMuted bg-gradient-to-br from-accentMuted via-surface to-accentMuted p-5 shadow-horizon sm:p-6">
        <Shield className="h-8 w-8 text-accent" aria-hidden />
        <h2 className="mt-3 text-base font-semibold leading-snug text-textPrimary sm:text-lg">
          The Next Challenge is Making Smarter AI, Not Just Trustworthy AI
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-textSecondary sm:text-sm">
          Building systems capable of reasoning, learning autonomously, and acting with sound
          judgment beyond human supervision.
        </p>
        <ul className="mt-4 space-y-2">
          {trustChallengeBullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-xs text-textSecondary sm:text-sm">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-highlight" aria-hidden />
              {bullet}
            </li>
          ))}
        </ul>
        <Link
          href="/blog"
          className="mt-5 flex w-full items-center justify-center rounded-lg border border-borderMuted bg-accentMuted px-4 py-2.5 text-sm font-medium text-highlight transition hover:border-accent hover:text-accent"
        >
          Learn More
        </Link>
      </aside>

      <div className="rounded-xl border border-borderMuted bg-gradient-to-br from-accentMuted via-surface to-accentMuted px-5 py-6 text-center shadow-horizon sm:px-8 sm:py-8">
        <h2 className="text-base font-semibold text-textPrimary sm:text-lg">
          Understand Your Career Trajectory
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-textSecondary sm:text-sm">
          Get a personalized analysis of how AI evolution impacts your specific role, industry, and
          skill set.
        </p>
        <Link href="/auth" className="btn-primary mt-4 inline-flex items-center gap-1 px-5 py-2.5">
          Get Your Analysis
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
