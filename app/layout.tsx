import './globals.css'
import type { ReactNode, Metadata } from 'react'
import PWARegister from '../components/PWARegister'

export const metadata: Metadata = {
  title: 'AI Career Shield - Disruption Risk & Insulation Tracker',
  description:
    'Analyze your job profile vulnerability against the modern AI disruption timeline. Explore AI evolution, industry waves, and protect your career with personalized insulation scoring.',
  keywords:
    'AI career shield, job automation risk, AI disruption, career insulation, resume vulnerability score, artificial intelligence timeline',
  author: 'AI Career Shield',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'AI Career Shield - Disruption Risk & Insulation Tracker',
    description:
      'Analyze your job profile vulnerability against the modern AI disruption timeline.',
    type: 'website',
    url: 'https://future-trace.com',
    siteName: 'AI Career Shield',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Career Shield - Disruption Risk & Insulation Tracker',
    description:
      'Analyze your job profile vulnerability against the modern AI disruption timeline.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Career Shield',
    description:
      'Disruption risk and insulation tracker — analyze job vulnerability against AI automation and explore the evolution of artificial intelligence.',
    inLanguage: 'en-US',
    applicationCategory: 'BusinessApplication',
    author: {
      '@type': 'Organization',
      name: 'AI Career Shield',
    },
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
