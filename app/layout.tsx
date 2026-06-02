import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import PWARegister from '../components/PWARegister'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Future Trace - Career Intelligence for the AI Age',
  description:
    'Future Trace — Career Intelligence for the AI Age. Analyze job vulnerability, explore AI evolution, and build career resilience with personalized scoring.',
  keywords:
    'Future Trace, career intelligence, AI age, job automation risk, career insulation, resume vulnerability score, artificial intelligence timeline',
  authors: [{ name: 'Future Trace' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Future Trace - Career Intelligence for the AI Age',
    description: 'Career Intelligence for the AI Age — analyze, adapt, and protect your professional path.',
    type: 'website',
    url: 'https://future-trace.com',
    siteName: 'Future Trace',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Future Trace - Career Intelligence for the AI Age',
    description: 'Career Intelligence for the AI Age — analyze, adapt, and protect your professional path.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Future Trace',
    description: 'Career Intelligence for the AI Age — analyze job vulnerability and build career resilience.',
    inLanguage: 'en-US',
    applicationCategory: 'BusinessApplication',
    author: {
      '@type': 'Organization',
      name: 'Future Trace',
    },
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen font-sans text-textPrimary antialiased`}>
        <PWARegister />
        <div className="relative z-[1] flex min-h-screen w-full flex-col">
          <main className="min-h-screen w-full flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12 sm:py-10 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
