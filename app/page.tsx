import type { Metadata } from 'next'
import Image from 'next/image'
import HomeTimelineSection from '../components/HomeTimelineSection'
import IndustryWavesPreview from '../components/IndustryWavesPreview'
import JobsAffectedPreview from '../components/JobsAffectedPreview'
import WhatComesNext from '../components/WhatComesNext'

export const metadata: Metadata = {
  title: 'Future Trace - Career Intelligence for the AI Age',
  description: 'Career Intelligence for the AI Age — analyze, adapt, and protect your professional path.',
  alternates: {
    canonical: 'https://future-trace.com',
  },
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-black text-slate-300">
      <header className="mb-8 flex items-center gap-4 sm:gap-5">
        <div className="flex h-16 w-16 shrink-0 animate-home-logo-enter items-center justify-center sm:h-20 sm:w-20">
          <Image
            src="/icon-192x192.png"
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <div className="animate-home-title-enter [animation-delay:140ms]">
          <p className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">Future Trace</p>
          <p className="mt-0.5 text-base text-slate-400 sm:text-lg">
            Career Intelligence for the AI Age
          </p>
        </div>
      </header>

      <HomeTimelineSection />

      <IndustryWavesPreview />

      <JobsAffectedPreview />

      <WhatComesNext />

      <footer
        className="mt-16 border-t border-sky-900/40 pt-8 text-sm text-slate-400"
        role="contentinfo"
      >
        <p className="mb-2 text-slate-300">Future Trace — Career Intelligence for the AI Age.</p>
        <p className="text-xs">© 2026 Future Trace. All rights reserved.</p>
      </footer>
    </div>
  )
}
