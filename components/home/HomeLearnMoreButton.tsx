'use client'

import { useHomeRightPanel } from '@/components/home/HomeRightPanelContext'
import { ChevronRight } from 'lucide-react'

export default function HomeLearnMoreButton() {
  const { openPanel } = useHomeRightPanel()

  return (
    <button
      type="button"
      onClick={openPanel}
      className="inline-flex items-center gap-1 rounded-lg border border-trace-border bg-trace-surface px-5 py-2.5 text-sm font-medium text-highlight transition hover:border-sky-600/50 hover:bg-trace-surface hover:text-accent"
    >
      Learn More
      <ChevronRight className="h-4 w-4" aria-hidden />
    </button>
  )
}
