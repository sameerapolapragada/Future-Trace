'use client'

import SignOutButton from '@/components/SignOutButton'
import CareerRoadmapCard from '@/components/CareerRoadmapCard'
import DashboardNav from '@/components/DashboardNav'
import NewAnalysisInputView from '@/components/NewAnalysisInputView'
import PremiumUpgradeButton from '@/components/PremiumUpgradeButton'
import { buildRoadmapSummary, scoreExposureLabel, scoreGaugeColor } from '@/lib/analyzeResume'
import { buildDefaultCareerRoadmap, buildRoadmapShareText, parseCareerRoadmap } from '@/lib/careerRoadmap'
import type { CareerRoadmap } from '@/types/careerRoadmap'
import { triggerComplianceLog } from '@/utils/supabase/compliance'
import { createClient } from '@/utils/supabase/client'
import {
  Bell,
  Check,
  ChevronRight,
  Download,
  History,
  Info,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  PersonStanding,
  RefreshCw,
  Settings,
  Share2,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { ChangeEvent, DragEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type DashboardView = 'shield' | 'profile'

type ScanRow = {
  id: string
  overall_score: number
  created_at: string
  free_summary?: string | null
  job_title?: string | null
  career_roadmap?: CareerRoadmap | null
}

function DashboardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-8 w-48 rounded-md bg-sky-950/80" />
      <div className="h-4 w-64 rounded-md bg-sky-950/60" />
      <div className="rounded-2xl border border-sky-900/40 bg-trace-surface/50 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-sky-950/60" />
          <div className="h-20 rounded-xl bg-sky-950/50" />
        </div>
        <div className="mx-auto mt-4 h-8 w-40 rounded-full bg-sky-950/60" />
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="h-24 rounded-xl bg-sky-950/60" />
          <div className="h-24 rounded-xl bg-sky-950/50" />
        </div>
        <div className="mt-5 h-28 rounded-xl bg-sky-950/40" />
      </div>
    </div>
  )
}

const LOADING_CAPTIONS = [
  'Mapping your current role to destination pathways...',
  'Estimating transition milestones and timeline...',
  'Building your personalized career route...',
]

const PREMIUM_PLACEHOLDER_LINES = [
  'Bullet 1 · Automate-prone reporting workflows flagged in Q2 task cluster',
  'Bullet 2 · CRM scheduling patterns overlap with emerging agent tooling',
  'Bullet 3 · Leadership narrative underweighted vs. execution-heavy phrasing',
  'Day 4 · Stakeholder synthesis micro-lesson (12 min)',
  'Day 8 · Cross-functional decision framing drill',
  'Day 14 · AI-resistant portfolio artifact workshop',
]

type ShieldTab = 'analysis' | 'history'

type ShieldPhase = 'form' | 'loading' | 'results'

type ScanResult = {
  jobTitle: string
  summary: string
  roadmap: CareerRoadmap
  score: number
}

type AnalysisResultCardProps = {
  roadmap: CareerRoadmap
  isPremium: boolean
  userId: string | null
}

function ShareAnalysisMenu({
  roadmap,
  onClose,
}: {
  roadmap: CareerRoadmap
  onClose: () => void
}) {
  const shareText = buildRoadmapShareText(roadmap)

  const channels = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'reddit',
      label: 'Reddit',
      href: `https://www.reddit.com/submit?title=${encodeURIComponent('AI Career Transition Pathway')}&selftext=true&text=${encodeURIComponent(shareText)}`,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`,
    },
  ] as const

  return (
    <div
      role="menu"
      aria-label="Share analysis"
      className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-sky-900/40 bg-trace-surface shadow-lg shadow-black/40"
    >
      {channels.map((channel) => (
        <a
          key={channel.id}
          role="menuitem"
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2.5 border-b border-sky-900/30 px-3 py-2.5 text-sm text-slate-200 transition last:border-b-0 hover:bg-sky-950/40 hover:text-slate-50"
        >
          {channel.id === 'linkedin' ? (
            <Linkedin className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
          ) : (
            <Share2 className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
          )}
          {channel.label}
        </a>
      ))}
    </div>
  )
}

function AnalysisResultCard({
  roadmap,
  isPremium,
  userId,
}: AnalysisResultCardProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!shareOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShareOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShareOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [shareOpen])

  const shareButton = (
    <div ref={shareRef} className="relative">
      <button
        type="button"
        onClick={() => setShareOpen((open) => !open)}
        aria-label="Share pathway"
        aria-expanded={shareOpen}
        aria-haspopup="menu"
        className="rounded-lg border border-sky-900/40 bg-black/40 p-2 text-slate-400 backdrop-blur transition hover:border-sky-700/50 hover:text-slate-100"
      >
        <Share2 className="h-4 w-4" aria-hidden />
      </button>
      {shareOpen ? <ShareAnalysisMenu roadmap={roadmap} onClose={() => setShareOpen(false)} /> : null}
    </div>
  )

  return (
    <CareerRoadmapCard
      roadmap={roadmap}
      variant="workspace"
      actions={shareButton}
      isPremium={isPremium}
      userId={userId}
    />
  )
}

function MethodologyDataTransparencyCard() {
  return (
    <aside
      aria-labelledby="methodology-heading"
      className="rounded-xl border border-sky-900/40 bg-trace-surface/40 p-4 text-xs text-slate-400"
    >
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden />
        <div className="min-w-0">
          <h4 id="methodology-heading" className="text-xs font-semibold leading-snug text-slate-100">
            How Your Transition Pathway Is Built
          </h4>
          <p className="mt-2 leading-relaxed">
            Your roadmap maps current role signals, destination requirements, and skill gaps into a
            sequenced transition route — not a single replacement percentage.
          </p>
          <ul className="mt-3 list-none space-y-2.5 leading-relaxed">
            <li>
              <span className="font-semibold text-slate-200">O*NET occupational tasks</span>
              {' — '}
              role capability requirements for each stage of your recommended route.
            </li>
            <li>
              <span className="font-semibold text-slate-200">Labor market trend signals</span>
              {' — '}
              industry momentum shaping realistic journey timelines.
            </li>
            <li>
              <span className="font-semibold text-slate-200">Resume skill extraction</span>
              {' — '}
              milestone and leverage-point callouts derived from your stated experience.
            </li>
          </ul>
          <Link
            href="/methodology"
            className="mt-3 inline-flex items-center gap-0.5 font-medium text-sky-400 transition hover:text-sky-300"
          >
            View Technical Whitepaper Documentation
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  )
}

function TemporaryScanNotice() {
  return (
    <p className="rounded-xl border border-sky-900/30 bg-trace-surface/30 px-4 py-3 text-xs leading-relaxed text-slate-500">
      This roadmap preview is temporary. Upgrade to premium to save your resume, unlock historical
      tracking, and get your full 30-day action plan.
    </p>
  )
}

function scanRowToResult(scan: ScanRow, fallbackJobRole: string): ScanResult {
  const jobTitle = scan.job_title?.trim() || fallbackJobRole.trim() || 'Your role'
  const storedRoadmap = parseCareerRoadmap(scan.career_roadmap)
  const roadmap =
    storedRoadmap ??
    buildDefaultCareerRoadmap(fallbackJobRole || jobTitle, jobTitle)

  return {
    jobTitle,
    summary: scan.free_summary?.trim() || buildRoadmapSummary(roadmap),
    roadmap,
    score: scan.overall_score,
  }
}

type HistoryEntry = {
  id: string
  result: ScanResult
  createdAt: string
}

function formatHistoryTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function HistoryEmptyState({ onStartAnalysis }: { onStartAnalysis: () => void }) {
  return (
    <section
      aria-labelledby="history-empty-heading"
      className="flex flex-col items-center rounded-2xl border border-dashed border-sky-900/35 bg-trace-surface/25 px-6 py-16 text-center"
    >
      <History className="h-9 w-9 text-slate-600" aria-hidden />
      <h2 id="history-empty-heading" className="sr-only">
        No career roadmaps yet
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
        No career roadmaps generated yet. Go to New Analysis to build your first AI transition path.
      </p>
      <button
        type="button"
        onClick={onStartAnalysis}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:from-sky-500 hover:to-cyan-500"
      >
        Go to New Analysis
      </button>
    </section>
  )
}

function PastAnalysisSelector({
  entries,
  selectedEntryId,
  onSelectEntry,
}: {
  entries: HistoryEntry[]
  selectedEntryId: string | null
  onSelectEntry: (entryId: string) => void
}) {
  const activeEntryId = selectedEntryId ?? entries[0]?.id ?? ''

  return (
    <div className="w-full sm:ml-auto sm:w-auto sm:min-w-[220px] sm:max-w-xs">
      <label
        htmlFor="past-analysis-role"
        className="mb-1.5 block text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-right"
      >
        Past analysis
      </label>
      <select
        id="past-analysis-role"
        value={activeEntryId}
        onChange={(event) => onSelectEntry(event.target.value)}
        className="w-full rounded-xl border border-sky-900/40 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25"
      >
        {entries.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {entry.result.jobTitle} · {formatHistoryTimestamp(entry.createdAt)}
          </option>
        ))}
      </select>
    </div>
  )
}

function TargetRoleSummaryBar({ result }: { result: ScanResult }) {
  const score = result.score
  const riskLabel = scoreExposureLabel(score)
  const scoreColor = scoreGaugeColor(score)
  const riskBadgeClass =
    riskLabel === 'Vulnerable'
      ? 'border-red-500/40 bg-red-950/30 text-red-300'
      : riskLabel === 'At Risk'
        ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
        : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'

  return (
    <aside className="rounded-xl border border-sky-900/40 bg-trace-surface/50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-400/80">
        Target role summary
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-slate-50">
        {result.roadmap.destinationPosition}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-sky-900/30 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Exposure score
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums" style={{ color: scoreColor }}>
            {score}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${riskBadgeClass}`}
        >
          {riskLabel}
        </span>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">{result.summary}</p>
    </aside>
  )
}

function HistoryTabPanel({
  entries,
  selectedEntryId,
  onStartAnalysis,
  isPremium,
  userId,
  onRunAnotherScan,
}: {
  entries: HistoryEntry[]
  selectedEntryId: string | null
  onStartAnalysis: () => void
  isPremium: boolean
  userId: string | null
  onRunAnotherScan: () => void
}) {
  if (entries.length === 0) {
    return <HistoryEmptyState onStartAnalysis={onStartAnalysis} />
  }

  const selectedEntry =
    entries.find((entry) => entry.id === selectedEntryId) ?? entries[0] ?? null

  return (
    <section aria-labelledby="scan-history-heading" className="flex flex-col gap-6">
      <h2 id="scan-history-heading" className="sr-only">
        Scan history
      </h2>

      {selectedEntry ? (
        <AnalysisResultsLayout
          result={selectedEntry.result}
          isPremium={isPremium}
          userId={userId}
          onRunAnotherScan={onRunAnotherScan}
        />
      ) : null}
    </section>
  )
}

function RoleTransitionStatusBar({ roadmap }: { roadmap: CareerRoadmap }) {
  return (
    <div
      role="group"
      aria-label={`Career transition from ${roadmap.currentPosition} to ${roadmap.destinationPosition}`}
      className="relative overflow-hidden rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-950/35 via-slate-950/90 to-sky-950/35 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(56,189,248,0.08)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
        aria-hidden
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <p className="min-w-0 truncate text-sm font-semibold text-slate-100 sm:flex-1 sm:text-right">
          {roadmap.currentPosition}
        </p>

        <div className="flex shrink-0 items-center justify-center gap-1" aria-hidden>
          <div className="hidden h-px w-5 bg-gradient-to-r from-slate-600 to-sky-500 sm:block" />
          <ChevronRight className="h-4 w-4 text-sky-400" strokeWidth={2.5} />
          <div className="hidden h-px w-5 bg-gradient-to-r from-sky-500 to-sky-400 sm:block" />
        </div>

        <p className="min-w-0 truncate text-sm font-semibold text-sky-100 sm:flex-1">
          {roadmap.destinationPosition}
        </p>
      </div>
    </div>
  )
}

function NextUpStatusBar({ roadmap }: { roadmap: CareerRoadmap }) {
  const skillSprint = roadmap.immediate30DayTarget ?? '1-Month Skill Sprint'
  const runwayMonths = roadmap.estimatedJourneyMonths
  const activeMonth = 1
  const runwayProgress = Math.min(100, Math.round((activeMonth / runwayMonths) * 100))

  return (
    <div
      role="status"
      aria-label={`Next up: ${skillSprint}. Career runway: ${runwayMonths} months.`}
      className="relative overflow-hidden rounded-xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/35 via-slate-950/90 to-sky-950/35 px-4 py-3 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.08)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
        aria-hidden
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="shrink-0 rounded-md border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Next up
          </span>
          <PersonStanding className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
          <p className="truncate text-sm font-semibold text-slate-100">{skillSprint}</p>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:w-[min(100%,16rem)] sm:shrink-0">
          <div
            className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-800/90"
            role="progressbar"
            aria-valuenow={runwayProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Career runway progress: month ${activeMonth} of ${runwayMonths}`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
              style={{ width: `${runwayProgress}%` }}
            />
          </div>
          <p className="shrink-0 text-[11px] tabular-nums text-slate-400">
            <span className="font-semibold text-slate-200">{runwayMonths}</span> mo runway
          </p>
        </div>
      </div>
    </div>
  )
}

function SidebarPremiumUpgrade() {
  return (
    <div>
      <PremiumUpgradeButton />
      <p className="mt-2 text-center text-[11px] text-slate-500">$29/month · Cancel anytime</p>
    </div>
  )
}

function AnalysisResultsLayout({
  result,
  isPremium,
  userId,
  onRunAnotherScan,
}: {
  result: ScanResult
  isPremium: boolean
  userId: string | null
  onRunAnotherScan: () => void
}) {
  return (
    <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6">
      <div className="flex min-w-0 flex-col gap-3">
        <RoleTransitionStatusBar roadmap={result.roadmap} />
        <NextUpStatusBar roadmap={result.roadmap} />
        <AnalysisResultCard
          roadmap={result.roadmap}
          isPremium={isPremium}
          userId={userId}
        />
        {isPremium ? (
          <div className="rounded-2xl border border-sky-900/40 bg-trace-surface/50 p-5">
            <h3 className="text-sm font-semibold text-slate-100">Your 30-day pathway actions</h3>
            <div className="mt-4">
              <PathwayActionChecklist isPremium={isPremium} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <TargetRoleSummaryBar result={result} />
        <button
          type="button"
          onClick={onRunAnotherScan}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-800/50 bg-trace-surface/40 py-3 text-sm font-medium text-slate-300 transition hover:bg-trace-raised"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Run Another Scan
        </button>
        {!isPremium ? <SidebarPremiumUpgrade /> : null}
        {!isPremium ? <TemporaryScanNotice /> : null}
        <MethodologyDataTransparencyCard />
      </div>
    </section>
  )
}

const FIELD_INPUT_CLASS =
  'w-full rounded-lg border border-sky-900/40 bg-slate-900 p-3 text-sm text-slate-100 caret-sky-400 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed disabled:opacity-60'

const FIELD_INPUT_READONLY_CLASS =
  'w-full rounded-lg border border-sky-900/40 bg-slate-950 p-3 pr-10 text-sm text-slate-400 outline-none disabled:cursor-not-allowed'

function PathwayActionChecklist({ isPremium }: { isPremium: boolean }) {
  return (
    <ul className="space-y-3">
      {PREMIUM_PLACEHOLDER_LINES.map((line, index) => {
        const completed = isPremium && index < 2

        return (
          <li
            key={line}
            className="flex items-start gap-3 rounded-lg border border-sky-900/30 bg-trace-surface/40 px-3 py-2.5"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                completed
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-sky-800/50 bg-trace-surface/60 text-transparent'
              }`}
              aria-hidden
            >
              <Check className="h-3 w-3" />
            </span>
            <span className={`text-sm leading-relaxed ${completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
              {line}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

type ShieldViewProps = {
  userId: string | null
  fullName: string
  jobRole: string
  isPremium: boolean
  recentScans: ScanRow[]
  onScanComplete: () => void
}

function ShieldView({
  userId,
  fullName,
  jobRole,
  isPremium,
  recentScans,
  onScanComplete,
}: ShieldViewProps) {
  const [phase, setPhase] = useState<ShieldPhase>('form')
  const [resumeText, setResumeText] = useState('')
  const [currentJobTitle, setCurrentJobTitle] = useState(jobRole)
  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [loadingCaptionIndex, setLoadingCaptionIndex] = useState(0)
  const [roadmapData, setRoadmapData] = useState<CareerRoadmap | null>(null)
  const [roadmapSummary, setRoadmapSummary] = useState('')
  const [analyzedJobTitle, setAnalyzedJobTitle] = useState('')
  const [analyzedScore, setAnalyzedScore] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [shieldTab, setShieldTab] = useState<ShieldTab>('analysis')
  const [lastScanDate, setLastScanDate] = useState<string | null>(null)
  const [selectedHistoryEntryId, setSelectedHistoryEntryId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentSessionResult: ScanResult | null = roadmapData
    ? {
        jobTitle: analyzedJobTitle,
        summary: roadmapSummary,
        roadmap: roadmapData,
        score: analyzedScore ?? 0,
      }
    : null

  const historyEntries = useMemo(() => {
    const entries: HistoryEntry[] = []

    if (currentSessionResult) {
      entries.push({
        id: '__session__',
        result: currentSessionResult,
        createdAt: lastScanDate ?? new Date().toISOString(),
      })
    }

    for (const scan of recentScans) {
      entries.push({
        id: scan.id,
        result: scanRowToResult(scan, jobRole),
        createdAt: scan.created_at,
      })
    }

    return entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [currentSessionResult, lastScanDate, recentScans, jobRole])

  function goToNewAnalysis() {
    setShieldTab('analysis')
    setSelectedHistoryEntryId(null)
  }

  function startNewAnalysis() {
    resetToForm()
    setSelectedHistoryEntryId(null)
    setShieldTab('analysis')
  }

  useEffect(() => {
    if (shieldTab !== 'history' || historyEntries.length === 0) return

    const hasValidSelection =
      selectedHistoryEntryId !== null &&
      historyEntries.some((entry) => entry.id === selectedHistoryEntryId)

    if (!hasValidSelection) {
      setSelectedHistoryEntryId(historyEntries[0].id)
    }
  }, [shieldTab, historyEntries, selectedHistoryEntryId])

  useEffect(() => {
    setCurrentJobTitle((prev) => (prev.trim() ? prev : jobRole))
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
    const trimmedCurrent = currentJobTitle.trim()
    const trimmedTitle = targetJobTitle.trim()
    const hasFile = uploadedFile !== null
    const hasText = trimmedResume.length >= 40

    if (!hasFile && !hasText) {
      setFormError('Upload your resume or paste at least 40 characters of text.')
      return
    }

    if (!trimmedCurrent) {
      setFormError('Enter your current job title.')
      return
    }

    if (!trimmedTitle) {
      setFormError('Enter your target job title.')
      return
    }

    setPhase('loading')
    setLoadingCaptionIndex(0)

    try {
      // In-memory only — file bytes go straight to the API; no Supabase Storage upload.
      const formData = new FormData()
      formData.append('jobTitle', trimmedTitle)
      formData.append('currentJobTitle', trimmedCurrent)
      if (hasFile) {
        formData.append('file', uploadedFile)
      } else {
        formData.append('resumeText', trimmedResume)
      }

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as {
        error?: string
        score?: number
        jobTitle?: string
        summary?: string
        fullSummary?: string
        roadmap?: CareerRoadmap
        isPremium?: boolean
      }

      if (!response.ok) {
        setPhase('form')
        setFormError(payload.error ?? 'Analysis failed. Please try again.')
        return
      }

      const roadmap =
        payload.roadmap ??
        buildDefaultCareerRoadmap(trimmedCurrent, payload.jobTitle ?? trimmedTitle)

      const summary = payload.summary ?? buildRoadmapSummary(roadmap)
      const jobTitle = payload.jobTitle ?? trimmedTitle

      setRoadmapData(roadmap)
      setRoadmapSummary(summary)
      setAnalyzedJobTitle(jobTitle)
      setAnalyzedScore(typeof payload.score === 'number' ? payload.score : 0)
      setLastScanDate(new Date().toISOString())
      setSelectedHistoryEntryId(null)
      setPhase('results')
      if (payload.isPremium) {
        onScanComplete()
      }
    } catch {
      setPhase('form')
      setFormError('Network error. Check your connection and try again.')
    }
  }

  function resetToForm() {
    setPhase('form')
    setFormError(null)
    setRoadmapData(null)
    setRoadmapSummary('')
    setAnalyzedJobTitle('')
    setAnalyzedScore(null)
  }

  function selectResumeFile(file: File) {
    setFormError(null)
    setUploadedFile(file)
    setUploadedFileName(file.name)
    setResumeText('')
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      selectResumeFile(file)
    }
  }

  function onDropResumeFile(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    setIsDraggingFile(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      selectResumeFile(file)
    }
  }

  function clearUploadedFile() {
    setUploadedFileName(null)
    setUploadedFile(null)
    setResumeText('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex items-center gap-2.5">
          <Shield className="h-6 w-6 shrink-0 text-sky-400" aria-hidden />
          <h1 className="text-xl font-bold text-slate-50 md:text-2xl">AI Career Shield</h1>
        </div>
        <p className="mt-1.5 text-sm text-slate-400">
          Analyze your AI exposure risk and career resilience.
        </p>
        {isPremium ? (
          <span className="mt-2 inline-block rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
            Pro
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 border-b border-sky-900/40 pb-0 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-6">
        <button
          type="button"
          onClick={() => {
            setShieldTab('analysis')
            setSelectedHistoryEntryId(null)
          }}
          className={`border-b-2 pb-2.5 text-sm font-medium transition ${
            shieldTab === 'analysis'
              ? 'border-sky-600 text-sky-300'
              : 'border-transparent text-slate-500 hover:text-slate-200'
          }`}
        >
          New Analysis
        </button>
        <button
          type="button"
          onClick={() => setShieldTab('history')}
          className={`border-b-2 pb-2.5 text-sm font-medium transition ${
            shieldTab === 'history'
              ? 'border-sky-600 text-sky-300'
              : 'border-transparent text-slate-500 hover:text-slate-200'
          }`}
        >
          History
        </button>
        </div>

        {shieldTab === 'history' && historyEntries.length > 0 ? (
          <PastAnalysisSelector
            entries={historyEntries}
            selectedEntryId={selectedHistoryEntryId}
            onSelectEntry={setSelectedHistoryEntryId}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
      {shieldTab === 'history' ? (
        <HistoryTabPanel
          entries={historyEntries}
          selectedEntryId={selectedHistoryEntryId}
          onStartAnalysis={goToNewAnalysis}
          isPremium={isPremium}
          userId={userId}
          onRunAnotherScan={startNewAnalysis}
        />
      ) : null}

      {shieldTab === 'analysis' && roadmapData === null && phase === 'form' ? (
        <NewAnalysisInputView
          resumeText={resumeText}
          currentJobTitle={currentJobTitle}
          targetJobTitle={targetJobTitle}
          uploadedFileName={uploadedFileName}
          isDraggingFile={isDraggingFile}
          formError={formError}
          fileInputRef={fileInputRef}
          hasUploadedFile={uploadedFile !== null}
          onResumeTextChange={(value) => {
            setResumeText(value)
            if (uploadedFileName) {
              setUploadedFileName(null)
              setUploadedFile(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }
          }}
          onCurrentJobTitleChange={setCurrentJobTitle}
          onTargetJobTitleChange={setTargetJobTitle}
          onFileInputChange={onFileInputChange}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDraggingFile(true)
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={onDropResumeFile}
          onOpenFilePicker={() => fileInputRef.current?.click()}
          onClearFile={clearUploadedFile}
          onSubmit={handleAnalyze}
        />
      ) : null}

      {shieldTab === 'analysis' && phase === 'loading' ? (
        <section
          className="flex flex-col items-center rounded-2xl border border-sky-900/40 bg-trace-surface/70 px-6 py-14 text-center ring-1 ring-sky-900/40/50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-sky-900/40 border-t-sky-300" />
            <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-sky-200/60 [animation-direction:reverse] [animation-duration:1.4s]" />
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

      {shieldTab === 'analysis' && roadmapData !== null && phase === 'results' && currentSessionResult ? (
        <AnalysisResultsLayout
          result={currentSessionResult}
          isPremium={isPremium}
          userId={userId}
          onRunAnotherScan={startNewAnalysis}
        />
      ) : null}
      </div>
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
  scansThisMonth: number
  memberSince: string | null
  lastScanAt: string | null
  onFullNameChange: (value: string) => void
  onCurrentRoleChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function formatMemberSince(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function formatLastScan(iso: string | null): string {
  if (!iso) return 'Never'
  const date = new Date(iso)
  const today = new Date()
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today'
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function PreferenceToggle({
  enabled,
  onToggle,
  label,
}: {
  enabled: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        enabled ? 'bg-sky-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          enabled ? 'left-[1.375rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
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
  scansThisMonth,
  memberSince,
  lastScanAt,
  onFullNameChange,
  onCurrentRoleChange,
  onSubmit,
}: ProfileViewProps) {
  const router = useRouter()
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [complianceError, setComplianceError] = useState<string | null>(null)
  const [complianceSuccess, setComplianceSuccess] = useState<string | null>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)

  const displayName = fullName.trim() || email.split('@')[0] || 'Member'

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
          .select('id, overall_score, free_summary, created_at, career_roadmap')
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
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-bold text-slate-50 md:text-2xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your account settings and preferences</p>
      </header>

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

      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
      <aside className="rounded-xl border border-sky-900/40 bg-trace-surface/50 p-5 md:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-950/40">
            <span className="text-xl font-bold text-white">
              {profileAvatarInitials(fullName, email)}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-100">{displayName}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{email}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sky-800/50 bg-sky-950/60 px-3 py-1 text-xs font-medium text-sky-200">
            <Shield className="h-3.5 w-3.5 text-sky-400" aria-hidden />
            {isPremium ? 'Premium Account' : 'Free Account'}
          </span>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-sky-900/30 pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Scans this month</dt>
            <dd className="font-medium text-slate-100">{scansThisMonth}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-100">{formatMemberSince(memberSince)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Last scan</dt>
            <dd className="font-medium text-slate-100">{formatLastScan(lastScanAt)}</dd>
          </div>
        </dl>

        {!isPremium ? (
          <PremiumUpgradeButton className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-70" />
        ) : null}
      </aside>

      <div className="flex flex-col gap-6 md:col-span-2">
      <section className="rounded-xl border border-sky-900/40 bg-trace-surface/50 p-5">
        <div className="mb-4 flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Personal Information</h2>
            <p className="mt-0.5 text-xs text-slate-500">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-slate-400">
              Full Name
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
              className={FIELD_INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="profileEmail" className="mb-1.5 block text-xs font-medium text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <input
                id="profileEmail"
                type="email"
                value={email}
                readOnly
                disabled
                className={FIELD_INPUT_READONLY_CLASS}
              />
              <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="currentRole" className="mb-1.5 block text-xs font-medium text-slate-400">
              Current Role
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
              className={FIELD_INPUT_CLASS}
            />
          </div>

          <button
            type="submit"
            disabled={saving || !userId}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 py-3 text-sm font-semibold text-white transition hover:from-cyan-500 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-sky-900/40 bg-trace-surface/50 p-5">
        <div className="mb-4 flex items-start gap-3">
          <Settings className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Preferences</h2>
            <p className="mt-0.5 text-xs text-slate-500">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              <div>
                <p className="text-sm font-medium text-slate-200">Email Notifications</p>
                <p className="text-xs text-slate-500">Receive updates about your scans</p>
              </div>
            </div>
            <PreferenceToggle
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications((prev) => !prev)}
              label="Email notifications"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              <div>
                <p className="text-sm font-medium text-slate-200">Weekly Reports</p>
                <p className="text-xs text-slate-500">Get weekly career insights</p>
              </div>
            </div>
            <PreferenceToggle
              enabled={weeklyReports}
              onToggle={() => setWeeklyReports((prev) => !prev)}
              label="Weekly reports"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-sky-900/40 bg-trace-surface/50 p-5">
        <div className="mb-3 flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <div>
            <h2 id="compliance-heading" className="text-sm font-semibold text-slate-100">
              Data Privacy &amp; Portability
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">GDPR / CCPA Compliant</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Export a portable copy of your personal data, or permanently delete your account and
          associated records from our systems.
        </p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleExportPii}
            disabled={exportLoading || !userId}
            className="flex w-full items-center gap-3 rounded-lg border border-sky-900/40 bg-trace-surface/30 px-3 py-3 text-left transition hover:border-sky-800/50 hover:bg-sky-950/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4 shrink-0 text-sky-400" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-slate-200">Export My Data</span>
              <span className="block text-xs text-slate-500">Download all your PII records</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          </button>

          <button
            type="button"
            onClick={handlePermanentDeletion}
            disabled={deleteLoading || !userId}
            className="flex w-full items-center gap-3 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-3 text-left transition hover:border-red-800/50 hover:bg-red-950/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-red-400">Delete My Account</span>
              <span className="block text-xs text-red-400/70">Permanently remove your profile</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
          </button>
        </div>
      </section>
      </div>
      </div>

      <div className="border-t border-sky-900/40 pt-4">
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
  const [scansThisMonth, setScansThisMonth] = useState(0)
  const [memberSince, setMemberSince] = useState<string | null>(null)
  const [lastScanAt, setLastScanAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const refreshScans = useCallback(async () => {
    if (!userId) return

    const supabase = createClient()
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [{ data: scans }, { count }, { data: latestScan }] = await Promise.all([
      supabase
        .from('ai_scan_history')
        .select('id, overall_score, created_at, free_summary, job_title, career_roadmap')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(25),
      supabase
        .from('ai_scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', userId)
        .gte('created_at', startOfMonth.toISOString()),
      supabase
        .from('ai_scan_history')
        .select('created_at')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    setRecentScans(scans ?? [])

    setScansThisMonth(count ?? 0)
    setLastScanAt(latestScan?.created_at ?? null)
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
      setMemberSince(user.created_at ?? null)

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

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const [{ data: scans, error: scansError }, { count }, { data: latestScan }] =
        await Promise.all([
          supabase
            .from('ai_scan_history')
            .select('id, overall_score, created_at, free_summary, job_title, career_roadmap')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false })
            .limit(25),
          supabase
            .from('ai_scan_history')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', user.id)
            .gte('created_at', startOfMonth.toISOString()),
          supabase
            .from('ai_scan_history')
            .select('created_at')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])

      if (cancelled) return

      if (!scansError) {
        setRecentScans(scans ?? [])
      }

      setScansThisMonth(count ?? 0)
      setLastScanAt(latestScan?.created_at ?? null)

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
    <div className="relative -mx-4 -my-8 min-h-screen bg-black text-slate-300 sm:-mx-6 md:-mx-8 md:-my-12">
      <DashboardNav view={view} onViewChange={setView} />

      <div className="w-full min-h-screen p-4 md:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-24 md:pb-8">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          ) : null}

          {loading ? (
            <DashboardSkeleton />
          ) : view === 'shield' ? (
            <ShieldView
              userId={userId}
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
              scansThisMonth={scansThisMonth}
              memberSince={memberSince}
              lastScanAt={lastScanAt}
              onFullNameChange={setFullName}
              onCurrentRoleChange={setCurrentRole}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
