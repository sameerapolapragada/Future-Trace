'use client'

import { createClient } from '../../utils/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useMemo, useState } from 'react'

type AuthMode = 'signin' | 'signup'

function safeRedirectTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }
  return value
}

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = useMemo(
    () => safeRedirectTo(searchParams.get('redirectTo')),
    [searchParams]
  )

  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isSignUp = mode === 'signup'

  function switchMode(next: AuthMode) {
    setMode(next)
    setError(null)
    setSuccessMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const supabase = createClient()

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          return
        }

        setSuccessMessage(
          'Account created. Check your inbox for a verification link, then sign in to continue.'
        )
        setMode('signin')
        setPassword('')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex rounded-xl bg-trace-surface/80 p-1 ring-1 ring-sky-900/40">
        <button
          type="button"
          onClick={() => switchMode('signin')}
          disabled={loading}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            !isSignUp
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode('signup')}
          disabled={loading}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            isSignUp
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Create Account
        </button>
      </div>

      <h2 className="text-lg font-semibold text-slate-50">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        {isSignUp
          ? 'Career Intelligence for the AI Age — create your Future Trace account.'
          : 'Sign in to continue to your dashboard.'}
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
        {isSignUp ? (
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-sky-800/50 bg-trace-surface px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none ring-sky-400/0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60"
              placeholder="Jane Doe"
            />
          </div>
        ) : null}

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
            className="w-full rounded-lg border border-sky-800/50 bg-trace-surface px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-sky-800/50 bg-trace-surface px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40 disabled:opacity-60"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>{isSignUp ? 'Creating account…' : 'Signing in…'}</span>
            </>
          ) : (
            <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Forgot your password?
        </Link>
      </p>
    </div>
  )
}

function AuthPageFallback() {
  return (
    <div className="flex w-full items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-sky-300" aria-label="Loading" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPageContent />
    </Suspense>
  )
}
