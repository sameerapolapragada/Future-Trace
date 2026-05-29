'use client'

import SignOutButton from '@/components/SignOutButton'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (userError || !user) {
        setError('Unable to load your session. Please sign in again.')
        setLoading(false)
        return
      }

      setUserId(user.id)
      setEmail(user.email ?? '')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name, job_role')
        .eq('id', user.id)
        .maybeSingle()

      if (cancelled) return

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (profile) {
        setEmail(profile.email)
        setFullName(profile.full_name ?? '')
        setCurrentRole(profile.job_role ?? '')
      }

      setLoading(false)
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim() || null,
        job_role: currentRole.trim() || null,
      })
      .eq('id', userId)

    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    window.setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your AI Career Shield account</p>
      </header>

      <section aria-labelledby="profile-tab-heading" className="w-full">
        <div className="mb-6 inline-flex rounded-lg bg-slate-900/80 p-1 ring-1 ring-slate-800">
          <span className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            Profile
          </span>
        </div>

        <h2 id="profile-tab-heading" className="sr-only">
          Profile settings
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" aria-label="Loading profile" />
          </div>
        ) : (
          <div className="space-y-6">
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            ) : null}

            {success ? (
              <div
                role="status"
                className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
              >
                Profile updated successfully.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  value={email}
                  className="w-full cursor-not-allowed rounded-md border border-slate-800 bg-slate-900/60 p-3 text-slate-400"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="mt-1.5 text-xs text-slate-500">
                  Email is managed by authentication and cannot be changed here.
                </p>
              </div>

              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={saving}
                  placeholder="Your name"
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="currentRole" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Current role
                </label>
                <input
                  id="currentRole"
                  name="currentRole"
                  type="text"
                  autoComplete="organization-title"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  disabled={saving}
                  placeholder="e.g. Product Manager"
                  className="w-full rounded-md border border-slate-800 bg-slate-900 p-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !userId}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    <span>Updating profile…</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>

            <div className="border-t border-slate-800 pt-6">
              <SignOutButton />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
