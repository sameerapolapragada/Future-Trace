'use client'

import { createClient } from '../../../utils/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/reset-password`

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccessMessage(
        'Reset instructions sent. Open the link in your email inbox to choose a new password.'
      )
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-50">Forgot your password?</h2>
      <p className="mt-2 text-sm text-slate-400">
        Enter your email and we&apos;ll send a link to reset your password.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
        >
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>Sending…</span>
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/auth" className="text-sm font-medium text-sky-400 hover:text-sky-300">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
