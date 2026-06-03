'use client'

import HorizonMenuLines from '@/components/HorizonMenuLines'
import { createClient } from '@/utils/supabase/client'
import { Home, Loader2, LogOut, Shield, User, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type MatcherPageMenuProps = {
  onOpenProfile: () => void
  onOpenTransitionPath: () => void
}

export default function MatcherPageMenu({
  onOpenProfile,
  onOpenTransitionPath,
}: MatcherPageMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  function closePanel() {
    setIsOpen(false)
  }

  async function handleSignOut() {
    setSigningOut(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        setSigningOut(false)
        return
      }

      router.push('/auth')
      router.refresh()
    } catch {
      setSigningOut(false)
    }
  }

  const itemClassName =
    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-black/10'

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation panel"
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] md:bg-black/40"
          onClick={closePanel}
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-sm flex-col shadow-2xl transition-transform duration-300 ease-out sm:max-w-xs ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--horizon-accent-gradient)' }}
        aria-label="Dashboard menu"
        id="matcher-page-menu"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-950">Menu</p>
          <button
            type="button"
            onClick={closePanel}
            className="rounded-lg p-2 text-slate-950 transition hover:bg-black/10"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Dashboard navigation">
          <ul className="space-y-2">
            <li>
              <Link href="/" onClick={closePanel} className={itemClassName}>
                <Home className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                Home
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  closePanel()
                  onOpenTransitionPath()
                }}
                className={itemClassName}
              >
                <Shield className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                AI Career Transition Path
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  closePanel()
                  onOpenProfile()
                }}
                className={itemClassName}
              >
                <User className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                Profile
              </button>
            </li>
            <li className="pt-2">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className={`${itemClassName} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-80" aria-hidden />
                ) : (
                  <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                )}
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <button
        type="button"
        onClick={isOpen ? closePanel : () => setIsOpen(true)}
        className={`fixed right-0 top-28 z-[52] flex items-center justify-center rounded-l-xl px-3 py-4 shadow-lg transition-all duration-300 ${
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        style={{ background: 'var(--horizon-accent-gradient)' }}
        aria-label={isOpen ? 'Close navigation panel' : 'Open navigation panel'}
        aria-expanded={isOpen}
        aria-controls="matcher-page-menu"
      >
        <HorizonMenuLines />
      </button>
    </>
  )
}
