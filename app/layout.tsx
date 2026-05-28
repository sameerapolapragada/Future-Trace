import './globals.css'
import type { ReactNode, Metadata } from 'react'
import PWARegister from '../components/PWARegister'

export const metadata: Metadata = {
  title: 'AI Evolution Timeline: From Rule-Based AI to AI Agents',
  description: 'Explore how AI evolved from symbolic systems and machine learning to transformers, generative AI, RAG, AI agents, and multi-agent systems. An educational timeline of AI breakthroughs from 1950s to 2030s.',
  keywords: 'AI evolution, artificial intelligence, machine learning, deep learning, transformers, generative AI, RAG, AI agents, multi-agent systems',
  author: 'Future Trace',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'AI Evolution Timeline: From Rule-Based AI to AI Agents',
    description: 'Explore how AI evolved from symbolic systems and machine learning to transformers, generative AI, RAG, AI agents, and multi-agent systems.',
    type: 'website',
    url: 'https://future-trace.com',
    siteName: 'Future Trace',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Evolution Timeline: From Rule-Based AI to AI Agents',
    description: 'Educational timeline of AI breakthroughs from 1950s to 2030s'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalWebpage',
    name: 'AI Evolution Timeline',
    description: 'An educational resource explaining the evolution of artificial intelligence from rule-based systems to multi-agent systems.',
    inLanguage: 'en-US',
    author: {
      '@type': 'Organization',
      name: 'Future Trace'
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-900 antialiased">
        <PWARegister />
        {/* Phone frame on md+; full-bleed native width on small viewports */}
        <div className="relative mx-auto flex min-h-screen w-full max-w-none flex-col bg-slate-950 md:max-w-md md:border-x md:border-slate-800 md:shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <main className="min-h-screen w-full flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
