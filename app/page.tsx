import type { Metadata } from 'next'
import BrandLogo from '../components/BrandLogo'
import HomePageShell from '../components/HomePageShell'
import HomeTimelineSection from '../components/HomeTimelineSection'
import HomeWhatComesNextHighlights from '../components/HomeWhatComesNextHighlights'

export const metadata: Metadata = {
  title: 'Future Trace - Career Intelligence for the AI Age',
  description: 'Career Intelligence for the AI Age — analyze, adapt, and protect your professional path.',
  alternates: {
    canonical: 'https://future-trace.com',
  },
}

export default function HomePage() {
  return (
    <HomePageShell>
    <div className="mx-auto w-full max-w-7xl text-textSecondary">
      <header className="mb-8 flex items-center gap-4 sm:gap-5">
        <div className="flex h-24 w-24 shrink-0 animate-home-logo-enter items-center justify-center sm:h-32 sm:w-32">
          <BrandLogo size={128} className="h-full w-full" priority />
        </div>
        <div className="animate-home-title-enter [animation-delay:140ms]">
          <p className="text-2xl font-bold tracking-tight text-textPrimary sm:text-3xl">Future Trace</p>
          <p className="mt-0.5 text-base text-textSecondary sm:text-lg">
            Career Intelligence for the AI Age
          </p>
        </div>
      </header>

      <HomeTimelineSection />

      <HomeWhatComesNextHighlights />

      <footer
        className="mt-16 border-t border-trace-border pt-8 text-sm text-slate-400"
        role="contentinfo"
      >
        <p className="mb-2 text-slate-300">Future Trace — Career Intelligence for the AI Age.</p>
        <p className="text-xs">© 2026 Future Trace. All rights reserved.</p>
      </footer>
    </div>
    </HomePageShell>
  )
}
