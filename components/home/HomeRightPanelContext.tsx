'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type HomeRightPanelContextValue = {
  isOpen: boolean
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
}

const HomeRightPanelContext = createContext<HomeRightPanelContextValue | null>(null)

export function HomeRightPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPanel = useCallback(() => setIsOpen(true), [])
  const closePanel = useCallback(() => setIsOpen(false), [])
  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), [])

  const value = useMemo(
    () => ({ isOpen, openPanel, closePanel, togglePanel }),
    [isOpen, openPanel, closePanel, togglePanel]
  )

  return <HomeRightPanelContext.Provider value={value}>{children}</HomeRightPanelContext.Provider>
}

export function useHomeRightPanel() {
  const ctx = useContext(HomeRightPanelContext)
  if (!ctx) {
    throw new Error('useHomeRightPanel must be used within HomeRightPanelProvider')
  }
  return ctx
}
