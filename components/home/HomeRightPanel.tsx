'use client'

import HorizonMenuLines from '@/components/HorizonMenuLines'
import { useHomeRightPanel } from '@/components/home/HomeRightPanelContext'
import { BookOpen, Briefcase, Cpu, Layers, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  label: string
  icon: LucideIcon
  href: string
}

const SECTION_NAV: NavItem[] = [
  { label: 'AI Evolution Timeline', icon: Cpu, href: '/ai-evolution-timeline' },
  { label: 'Industry Adoption Waves', icon: Layers, href: '/industry-adoption-waves' },
  { label: 'Jobs Affected by AI Evolution', icon: Briefcase, href: '/jobs-affected-by-ai' },
  { label: 'What Comes Next', icon: Sparkles, href: '/what-comes-next' },
]

export default function HomeRightPanel() {
  const { isOpen, openPanel, closePanel } = useHomeRightPanel()

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation panel"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:bg-black/40"
          onClick={closePanel}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--horizon-accent-gradient)' }}
        aria-label="Explore Future Trace"
        id="home-right-panel"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-950">Explore</p>
          <button
            type="button"
            onClick={closePanel}
            className="rounded-lg p-2 text-slate-950 transition hover:bg-black/10"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Home page sections">
          <ul className="space-y-2">
            {SECTION_NAV.map((item) => {
              const Icon = item.icon
              const className =
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-black/10'

              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={closePanel} className={className}>
                    <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li className="pt-2">
              <Link
                href="/blog"
                onClick={closePanel}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-950 transition hover:bg-black/10"
              >
                <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <button
        type="button"
        onClick={isOpen ? closePanel : openPanel}
        className={`fixed right-0 top-28 z-[45] flex items-center justify-center rounded-l-xl px-3 py-4 shadow-lg transition-all duration-300 ${
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{ background: 'var(--horizon-accent-gradient)' }}
        aria-label={isOpen ? 'Close navigation panel' : 'Open navigation panel'}
        aria-expanded={isOpen}
        aria-controls="home-right-panel"
      >
        <HorizonMenuLines />
      </button>
    </>
  )
}
