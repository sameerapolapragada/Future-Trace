'use client'

import HomeRightPanel from '@/components/home/HomeRightPanel'
import { HomeRightPanelProvider } from '@/components/home/HomeRightPanelContext'
import type { ReactNode } from 'react'

export default function HomePageShell({ children }: { children: ReactNode }) {
  return (
    <HomeRightPanelProvider>
      {children}
      <HomeRightPanel />
    </HomeRightPanelProvider>
  )
}
