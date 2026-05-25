import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'AI Evolution Timeline',
  description: 'An educational timeline showing the evolution of artificial intelligence.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
