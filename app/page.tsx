import type { Metadata } from 'next'
import Hero from '../components/Hero'
import Header from '../components/Header'
import Timeline from '../components/Timeline'
import IndustryWaves from '../components/IndustryWaves'
import JobsAffected from '../components/JobsAffected'
import WhatComesNext from '../components/WhatComesNext'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://future-trace.com'
  }
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Header />

      <section aria-labelledby="intro-section" className="mb-12">
        <h2 id="intro-section" className="text-2xl sm:text-3xl font-bold text-slate-900">From Rules to Autonomous Systems</h2>
        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          This timeline explains the evolution of artificial intelligence in approachable terms.
          Starting with handcrafted rule-based systems, we move through probabilistic learning,
          deep neural networks, transformer-based models, retrieval-augmented generation (RAG),
          and the rise of AI agents and multi-agent systems.
        </p>
      </section>

      <section aria-labelledby="timeline-section" className="mb-12">
        <h2 id="timeline-section" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Timeline</h2>
        <Timeline />
      </section>

      <IndustryWaves />

      <JobsAffected />

      <WhatComesNext />

      <footer className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500" role="contentinfo">
        <p className="mb-2">Static-data driven educational resource. Edit data files to extend.</p>
        <p className="text-xs">© 2026 Future Trace. AI Evolution Timeline is a free educational feature.</p>
      </footer>
    </>
  )
}
