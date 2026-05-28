'use client'

import { createClient } from '../utils/supabase/client'
import { Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        setLoading(false)
        return
      }

      router.push('/auth')
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <LogOut className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      )}
      <span>Sign Out</span>
    </button>
  )
}
