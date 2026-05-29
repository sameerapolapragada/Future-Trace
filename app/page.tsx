import type { Metadata } from 'next'
import Hero from '../components/Hero'
import Header from '../components/Header'
import Timeline from '../components/Timeline'
import IndustryWaves from '../components/IndustryWaves'
import JobsAffected from '../components/JobsAffected'
import WhatComesNext from '../components/WhatComesNext'

export const metadata: Metadata = {
  title: 'AI Career Shield - Disruption Risk & Insulation Tracker',
  description:
    'Analyze your job profile vulnerability against the modern AI disruption timeline.',
  alternates: {
    canonical: 'https://future-trace.com',
  },
}

export default function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-300">
      <Hero />

      <Header />

      <section aria-labelledby="intro-section" className="mb-12">
        <h2 id="intro-section" className="text-2xl sm:text-3xl font-bold text-slate-100">
          From Rules to Autonomous Systems
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          This timeline explains the evolution of artificial intelligence in approachable terms.
          Starting with handcrafted rule-based systems, we move through probabilistic learning,
          deep neural networks, transformer-based models, retrieval-augmented generation (RAG),
          and the rise of AI agents and multi-agent systems.
        </p>
      </section>

      <section aria-labelledby="timeline-section" className="mb-12">
        <h2 id="timeline-section" className="mb-6 text-2xl sm:text-3xl font-bold text-slate-100">
          Timeline
        </h2>
        <Timeline />
      </section>

      <IndustryWaves />

      <JobsAffected />

      <WhatComesNext />

      <footer
        className="mt-16 border-t border-slate-800 pt-8 text-sm text-slate-400"
        role="contentinfo"
      >
        <p className="mb-2 text-slate-300">
          AI Career Shield — educational timeline and career insulation intelligence.
        </p>
        <p className="text-xs">© 2026 AI Career Shield. All rights reserved.</p>
      </footer>
    </div>
  )
}
