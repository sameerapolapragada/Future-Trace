'use client'

import { createClient } from '../../../utils/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useState } from 'react'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function establishSession() {
      const code = searchParams.get('code')
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError(exchangeError.message)
          setCheckingSession(false)
          return
        }
        setSessionReady(true)
        setCheckingSession(false)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setSessionReady(true)
        setCheckingSession(false)
        return
      }

      setError('This reset link is invalid or has expired. Request a new one from sign in.')
      setCheckingSession(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setSessionReady(true)
        setCheckingSession(false)
        setError(null)
      }
    })

    void establishSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [searchParams])

  useEffect(() => {
    if (countdown === null) return

    if (countdown <= 0) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sessionReady) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setCountdown(3)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-highlight" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-50">Set a new password</h2>
      <p className="mt-2 text-sm text-slate-400">
        Choose a strong password for your Future Trace account.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {countdown !== null ? (
        <div
          role="status"
          className="mt-4 rounded-lg border border-accent/30 bg-accentMuted px-4 py-3 text-sm text-accent"
        >
          Password updated. Redirecting to your dashboard in {countdown} second
          {countdown === 1 ? '' : 's'}…
        </div>
      ) : null}

      {sessionReady && countdown === null ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-slate-300">
              New secure password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-trace-border bg-trace-surface px-4 py-3 text-trace-foreground placeholder:text-slate-500 outline-none transition focus:border-highlight focus:ring-2 focus:ring-highlight/40 disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accentHover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>Saving…</span>
              </>
            ) : (
              'Save new password'
            )}
          </button>
        </form>
      ) : null}

      {!sessionReady && !checkingSession ? (
        <p className="mt-6 text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-accent hover:text-highlight"
          >
            Request a new reset link
          </Link>
        </p>
      ) : null}

      <p className="mt-6 text-center">
        <Link href="/auth" className="text-sm font-medium text-accent hover:text-highlight">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

function ResetPasswordFallback() {
  return (
    <div className="flex w-full items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-highlight" aria-label="Loading" />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
