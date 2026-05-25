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

      <section aria-labelledby="intro-section" className="mb-8">
        <h2 id="intro-section" className="text-2xl font-bold">From Rules to Autonomous Systems</h2>
        <p className="mt-3 text-slate-700">
          This timeline explains the evolution of artificial intelligence in approachable terms.
          Starting with handcrafted rule-based systems, we move through probabilistic learning,
          deep neural networks, transformer-based models, retrieval-augmented generation (RAG),
          and the rise of AI agents and multi-agent systems.
        </p>
      </section>

      <Timeline />

      <IndustryWaves />

      <JobsAffected />

      <WhatComesNext />

      <footer className="mt-12 text-sm text-slate-500" role="contentinfo">
        <p>Static-data driven educational sample — edit `/data/timeline.ts` and `/data/industries.ts` to extend.</p>
      </footer>
    </>
  )
}
