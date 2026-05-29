'use client'

import SignOutButton from '@/components/SignOutButton'
import { scoreGaugeColor } from '@/lib/analyzeResume'
import { triggerComplianceLog } from '@/utils/supabase/compliance'
import { createClient } from '@/utils/supabase/client'
import {
  Activity,
  Download,
  Loader2,
  Shield,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type DashboardView = 'shield' | 'profile'

type ScanRow = {
  id: string
  overall_score: number
  created_at: string
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-1 pt-2">
      <div className="h-8 w-48 rounded-md bg-slate-800" />
      <div className="h-4 w-64 rounded-md bg-slate-800/80" />
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mx-auto h-32 w-32 rounded-full bg-slate-800" />
        <div className="mx-auto mt-4 h-4 w-40 rounded bg-slate-800" />
        <div className="mx-auto mt-2 h-3 w-28 rounded bg-slate-800/80" />
      </div>
      <div className="space-y-3">
        <div className="h-12 rounded-lg bg-slate-800" />
        <div className="h-24 rounded-lg bg-slate-800/70" />
      </div>
    </div>
  )
}

const STRIPE_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? 'https://buy.stripe.com/test_placeholder'

const LOADING_CAPTIONS = [
  'Ingesting historical data timeline...',
  'Evaluating automation task vectors...',
  'Generating profile insulation report...',
]

const PREMIUM_PLACEHOLDER_LINES = [
  'Bullet 1 · Automate-prone reporting workflows flagged in Q2 task cluster',
  'Bullet 2 · CRM scheduling patterns overlap with emerging agent tooling',
  'Bullet 3 · Leadership narrative underweighted vs. execution-heavy phrasing',
  'Day 4 · Stakeholder synthesis micro-lesson (12 min)',
  'Day 8 · Cross-functional decision framing drill',
  'Day 14 · AI-resistant portfolio artifact workshop',
]

type ShieldPhase = 'form' | 'loading' | 'results'

type ScanResult = {
  score: number
  jobTitle: string
  summary: string
}

function scoreTone(score: number) {
  if (score <= 35) return 'text-emerald-400'
  if (score <= 70) return 'text-amber-400'
  return 'text-red-400'
}

function ScoreGauge({ score, jobTitle }: { score: number; jobTitle: string }) {
  const radius = 70
  const arcLength = Math.PI * radius
  const offset = arcLength * (1 - score / 100)
  const stroke = scoreGaugeColor(score)

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg viewBox="0 0 200 120" className="h-auto w-full" aria-hidden>
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke="#1e293b"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 30 100 A 70 70 0 0 1 170 100"
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-1">
        <span className={`text-5xl font-bold tabular-nums ${scoreTone(score)}`}>{score}%</span>
        <span className="mt-1 text-sm font-medium text-slate-300">AI Vulnerable</span>
        <span className="mt-0.5 text-xs text-slate-500">{jobTitle}</span>
      </div>
    </div>
  )
}

type RateLimitModalProps = {
  open: boolean
  onClose: () => void
}

function RateLimitModal({ open, onClose }: RateLimitModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rate-limit-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="rate-limit-title" className="text-lg font-semibold text-slate-50">
            Free Daily Scan Limit Reached
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          You can calculate a new iteration score variation in 24 hours, or upgrade instantly to
          premium to bypass all processing limits.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={STRIPE_CHECKOUT_URL}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Upgrade to Premium
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-700 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

type ShieldViewProps = {
  fullName: string
  jobRole: string
  isPremium: boolean
  recentScans: ScanRow[]
  onScanComplete: () => void
}

function ShieldView({
  fullName,
  jobRole,
  isPremium,
  recentScans,
  onScanComplete,
}: ShieldViewProps) {
  const displayName = fullName.trim() || 'Career Shield member'
  const [phase, setPhase] = useState<ShieldPhase>('form')
  const [resumeText, setResumeText] = useState('')
  const [targetJobTitle, setTargetJobTitle] = useState(jobRole)
  const [loadingCaptionIndex, setLoadingCaptionIndex] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [rateLimitOpen, setRateLimitOpen] = useState(false)

  useEffect(() => {
    setTargetJobTitle((prev) => (prev.trim() ? prev : jobRole))
  }, [jobRole])

  useEffect(() => {
    if (phase !== 'loading') return

    const interval = window.setInterval(() => {
      setLoadingCaptionIndex((prev) => (prev + 1) % LOADING_CAPTIONS.length)
    }, 2200)

    return () => window.clearInterval(interval)
  }, [phase])

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedResume = resumeText.trim()
    const trimmedTitle = targetJobTitle.trim()

    if (!trimmedResume || trimmedResume.length < 40) {
      setFormError('Paste your resume or LinkedIn skills summary (at least 40 characters).')
      return
    }

    if (!trimmedTitle) {
      setFormError('Enter your target job title.')
      return
    }

    setPhase('loading')
    setLoadingCaptionIndex(0)

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: trimmedResume, jobTitle: trimmedTitle }),
      })

      const payload = (await response.json()) as {
        error?: string
        score?: number
        jobTitle?: string
        summary?: string
      }

      if (response.status === 429) {
        setPhase('form')
        setRateLimitOpen(true)
        return
      }

      if (!response.ok) {
        setPhase('form')
        setFormError(payload.error ?? 'Analysis failed. Please try again.')
        return
      }

      setResult({
        score: payload.score ?? 0,
        jobTitle: payload.jobTitle ?? trimmedTitle,
        summary: payload.summary ?? '',
      })
      setPhase('results')
      onScanComplete()
    } catch {
      setPhase('form')
      setFormError('Network error. Check your connection and try again.')
    }
  }

  function resetToForm() {
    setPhase('form')
    setFormError(null)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-50">Shield</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track AI exposure risk for {displayName}
          {jobRole ? ` · ${jobRole}` : ''}
        </p>
        {isPremium ? (
          <span className="mt-2 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
            Pro
          </span>
        ) : null}
      </header>

      {phase === 'form' ? (
        <section className="space-y-4 transition-opacity duration-300">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="resumeText" className="mb-1.5 block text-sm font-medium text-slate-300">
                Resume or skills summary
              </label>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 ring-1 ring-slate-800/60 transition focus-within:border-indigo-500/60 focus-within:ring-indigo-500/30">
                <textarea
                  id="resumeText"
                  name="resumeText"
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Copy-paste your resume, or drop in your LinkedIn skills summary and recent role bullets..."
                  className="w-full resize-none rounded-xl bg-transparent p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="targetJobTitle" className="mb-1.5 block text-sm font-medium text-slate-300">
                Target job title
              </label>
              <input
                id="targetJobTitle"
                name="targetJobTitle"
                type="text"
                autoComplete="organization-title"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {formError ? (
              <p role="alert" className="text-sm text-red-400">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Calculate My AI Insulation Index
            </button>
          </form>
        </section>
      ) : null}

      {phase === 'loading' ? (
        <section
          className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-14 text-center ring-1 ring-slate-800/50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-400" />
            <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-indigo-300/60 [animation-direction:reverse] [animation-duration:1.4s]" />
          </div>
          <p className="mt-8 text-sm font-medium text-slate-200">Analyzing your profile</p>
          <p
            key={loadingCaptionIndex}
            className="mt-2 max-w-xs animate-pulse text-xs text-slate-400"
          >
            {LOADING_CAPTIONS[loadingCaptionIndex]}
          </p>
        </section>
      ) : null}

      {phase === 'results' && result ? (
        <section className="space-y-6 transition-opacity duration-500">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-8 ring-1 ring-slate-800/50">
            <ScoreGauge score={result.score} jobTitle={result.jobTitle} />
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="text-sm font-semibold text-slate-200">Analysis summary</h2>
            <p className="text-sm leading-relaxed text-slate-400">{result.summary}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-100">
                Your 30-Day Automated Insulation Shield Pipeline
              </h3>
            </div>

            <div className="relative p-5">
              <div
                className={`space-y-2 ${!isPremium ? 'blur-sm pointer-events-none select-none' : ''}`}
                aria-hidden={!isPremium}
              >
                {PREMIUM_PLACEHOLDER_LINES.map((line) => (
                  <p key={line} className="text-sm text-slate-500">
                    {line}
                  </p>
                ))}
              </div>

              {!isPremium ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-sm rounded-xl border border-indigo-500/30 bg-slate-950/90 p-5 shadow-xl backdrop-blur-md">
                    <h4 className="text-base font-semibold leading-snug text-slate-50">
                      We located 3 critical vulnerabilities in your current career skills path.
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Unlock the explicit, line-by-line resume bullet point audit alongside a
                      personalized daily mobile macro-learning roadmap to reduce your risk rating
                      below 15%.
                    </p>
                    <a
                      href={STRIPE_CHECKOUT_URL}
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                      Claim My 30-Day Shield for $29/mo
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={resetToForm}
            className="w-full rounded-xl border border-slate-700 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Run another scan
          </button>
        </section>
      ) : null}

      {phase !== 'loading' ? (
        <section aria-labelledby="recent-scans-heading">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-400" aria-hidden />
            <h2 id="recent-scans-heading" className="text-sm font-semibold text-slate-200">
              Recent scans
            </h2>
          </div>
          {recentScans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-slate-600" aria-hidden />
              <p className="mt-2 text-sm text-slate-400">No scan history yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Your vulnerability metrics will appear here after your first run.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentScans.map((scan) => (
                <li
                  key={scan.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <span className="text-sm text-slate-300">
                    {new Date(scan.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${scoreTone(scan.overall_score)}`}
                  >
                    {scan.overall_score}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <RateLimitModal open={rateLimitOpen} onClose={() => setRateLimitOpen(false)} />
    </div>
  )
}

type ProfileViewProps = {
  email: string
  fullName: string
  currentRole: string
  isPremium: boolean
  saving: boolean
  success: boolean
  userId: string | null
  onFullNameChange: (value: string) => void
  onCurrentRoleChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function profileAvatarInitials(fullName: string, email: string): string {
  const trimmed = fullName.trim()
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return trimmed.slice(0, 2).toUpperCase()
  }

  return (email[0] ?? '?').toUpperCase()
}

function ProfileView({
  email,
  fullName,
  currentRole,
  isPremium,
  saving,
  success,
  userId,
  onFullNameChange,
  onCurrentRoleChange,
  onSubmit,
}: ProfileViewProps) {
  const router = useRouter()
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [complianceError, setComplianceError] = useState<string | null>(null)
  const [complianceSuccess, setComplianceSuccess] = useState<string | null>(null)

  async function handleExportPii() {
    if (!userId) return

    const confirmed = window.confirm(
      'Download a portable copy of your personal data record (profile and scan history)?'
    )
    if (!confirmed) return

    setExportLoading(true)
    setComplianceError(null)
    setComplianceSuccess(null)

    const { error: logError } = await triggerComplianceLog('DATA_EXPORT', userId)
    if (logError) {
      setComplianceError(logError)
      setExportLoading(false)
      return
    }

    const supabase = createClient()
    const [{ data: profile, error: profileError }, { data: scans, error: scansError }] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('ai_scan_history')
          .select('id, overall_score, free_summary, created_at')
          .eq('profile_id', userId)
          .order('created_at', { ascending: false }),
      ])

    if (profileError || scansError) {
      setComplianceError(profileError?.message ?? scansError?.message ?? 'Export failed')
      setExportLoading(false)
      return
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      scanHistory: scans ?? [],
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `future-trace-pii-export-${userId.slice(0, 8)}.json`
    anchor.click()
    URL.revokeObjectURL(url)

    setComplianceSuccess('Your personal data export has started downloading.')
    setExportLoading(false)
    window.setTimeout(() => setComplianceSuccess(null), 5000)
  }

  async function handlePermanentDeletion() {
    if (!userId) return

    const confirmed = window.confirm(
      'Permanently delete your profile and all associated scan data? This action cannot be undone.'
    )
    if (!confirmed) return

    setDeleteLoading(true)
    setComplianceError(null)
    setComplianceSuccess(null)

    const { error: logError } = await triggerComplianceLog('ACCOUNT_DELETION', userId)
    if (logError) {
      setComplianceError(logError)
      setDeleteLoading(false)
      return
    }

    const response = await fetch('/api/delete-account', { method: 'POST' })
    const body = (await response.json()) as { error?: string }

    if (!response.ok) {
      setComplianceError(body.error ?? 'Account deletion failed')
      setDeleteLoading(false)
      return
    }

    const supabase = createClient()
    await supabase.auth.signOut()

    router.push('/auth')
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <div className="flex-1 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-50">Profile</h1>
          <p className="mt-1 text-sm text-slate-400">Account settings and preferences</p>
        </header>

        <section className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-8 text-center ring-1 ring-slate-800/50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-indigo-500/40 bg-gradient-to-br from-slate-800 to-slate-950 shadow-inner">
            {fullName.trim() ? (
              <span className="text-xl font-semibold text-indigo-200">
                {profileAvatarInitials(fullName, email)}
              </span>
            ) : (
              <User className="h-9 w-9 text-indigo-300/80" aria-hidden />
            )}
          </div>

          <p className="mt-4 text-sm font-medium text-slate-300">{email}</p>

          <div className="mt-3">
            {isPremium ? (
              <span className="inline-flex items-center rounded-full border border-indigo-400/50 bg-indigo-500/20 px-3 py-1 text-[11px] font-bold tracking-wide text-indigo-200 shadow-[0_0_18px_rgba(99,102,241,0.45)]">
                PREMIUM INSULATED MEMBER
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-400">
                FREE ACCOUNT STATUS
              </span>
            )}
          </div>

          {fullName.trim() ? (
            <h2 className="mt-3 text-lg font-semibold text-slate-100">{fullName}</h2>
          ) : null}
        </section>

        {success ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
          >
            Profile updated successfully.
          </div>
        ) : null}

        {complianceError ? (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
          >
            {complianceError}
          </div>
        ) : null}

        {complianceSuccess ? (
          <div
            role="status"
            className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200"
          >
            {complianceSuccess}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold text-slate-200">Profile details</h2>

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
              onChange={(e) => onFullNameChange(e.target.value)}
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
              onChange={(e) => onCurrentRoleChange(e.target.value)}
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

        <section
          aria-labelledby="compliance-heading"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
        >
          <h2 id="compliance-heading" className="text-sm font-semibold text-slate-200">
            Data Privacy &amp; Portability Options (GDPR / CCPA Compliant)
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Request a portable export of your stored profile data, or permanently remove your
            account and associated scan records from our systems.
          </p>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={handleExportPii}
              disabled={exportLoading || !userId}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Download className="h-4 w-4 text-slate-400" aria-hidden />
              )}
              Export My PII Record Data
            </button>

            <button
              type="button"
              onClick={handlePermanentDeletion}
              disabled={deleteLoading || !userId}
              className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteLoading ? 'Deleting account…' : 'Permanently Delete My Personal Profile'}
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8 border-t border-slate-800 pt-6">
        <SignOutButton />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [view, setView] = useState<DashboardView>('shield')
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [recentScans, setRecentScans] = useState<ScanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const refreshScans = useCallback(async () => {
    if (!userId) return

    const supabase = createClient()
    const { data: scans } = await supabase
      .from('ai_scan_history')
      .select('id, overall_score, created_at')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (scans?.length) {
      setRecentScans(scans)
    }
  }, [userId])

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
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
        .select('email, full_name, job_role, is_premium')
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
        setIsPremium(profile.is_premium ?? false)
      }

      const { data: scans, error: scansError } = await supabase
        .from('ai_scan_history')
        .select('id, overall_score, created_at')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (cancelled) return

      if (!scansError && scans?.length) {
        setRecentScans(scans)
      }

      setLoading(false)
    }

    void loadDashboard()

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
    <div className="relative min-h-[calc(100vh-4rem)] pb-24">
      <div className="py-4">
        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <DashboardSkeleton />
        ) : view === 'shield' ? (
          <ShieldView
            fullName={fullName}
            jobRole={currentRole}
            isPremium={isPremium}
            recentScans={recentScans}
            onScanComplete={refreshScans}
          />
        ) : (
          <ProfileView
            email={email}
            fullName={fullName}
            currentRole={currentRole}
            isPremium={isPremium}
            saving={saving}
            success={success}
            userId={userId}
            onFullNameChange={setFullName}
            onCurrentRoleChange={setCurrentRole}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
      >
        <div className="flex w-full max-w-md justify-around border-t border-slate-800 bg-slate-900/95 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setView('shield')}
            aria-current={view === 'shield' ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 px-6 text-xs font-medium transition ${
              view === 'shield' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-5 w-5" aria-hidden />
            <span>Shield</span>
          </button>
          <button
            type="button"
            onClick={() => setView('profile')}
            aria-current={view === 'profile' ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 px-6 text-xs font-medium transition ${
              view === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-5 w-5" aria-hidden />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
