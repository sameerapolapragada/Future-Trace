'use client'

import SignOutButton from '@/components/SignOutButton'
import CareerRoadmapCard from '@/components/CareerRoadmapCard'
import DashboardNav from '@/components/DashboardNav'
import NewAnalysisInputView from '@/components/NewAnalysisInputView'
import PremiumUpgradeButton from '@/components/PremiumUpgradeButton'
import { buildRoadmapSummary, scoreExposureLabel, scoreGaugeColor } from '@/lib/analyzeResume'
import { buildDefaultCareerRoadmap, buildRoadmapShareText, parseCareerRoadmap } from '@/lib/careerRoadmap'
import {
  formatBlueprintDurationLabel,
  MACRO_PROGRESS_SECTION_LABEL,
  MICRO_SPRINT_WORKSPACE_LABEL,
} from '@/lib/careerJourneyLabels'
import { formatJobTitle } from '@/lib/formatJobTitle'
import { exposureRiskBadgeClass } from '@/theme/statusBadges'
import type { CareerRoadmap } from '@/types/careerRoadmap'
import { triggerComplianceLog } from '@/utils/supabase/compliance'
import { createClient } from '@/utils/supabase/client'
import {
  Bell,
  ChevronRight,
  Download,
  History,
  Info,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  Map as MapIcon,
  RefreshCw,
  Settings,
  Share2,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { ChangeEvent, DragEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
      <div className="h-8 w-48 rounded-md bg-accentMuted" />
      <div className="h-4 w-64 rounded-md bg-accentMuted" />
      <div className="rounded-2xl border border-trace-border bg-trace-surface p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-accentMuted" />
          <div className="h-20 rounded-xl bg-accentMuted" />
        </div>
        <div className="mx-auto mt-4 h-8 w-40 rounded-full bg-accentMuted" />
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <div className="h-24 rounded-xl bg-accentMuted" />
          <div className="h-24 rounded-xl bg-accentMuted" />
        </div>
        <div className="mt-5 h-28 rounded-xl bg-accentMuted" />
      </div>
    </div>
  )
}

const LOADING_CAPTIONS = [
  'Mapping your current role to destination pathways...',
  'Estimating transition milestones and timeline...',
  'Building your personalized career route...',
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
  onPremiumStatusChange?: (isPremium: boolean) => void
  premiumRefreshToken?: number
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
      className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-trace-border bg-trace-surface shadow-lg shadow-black/40"
    >
      {channels.map((channel) => (
        <a
          key={channel.id}
          role="menuitem"
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2.5 border-b border-trace-border px-3 py-2.5 text-sm text-textSecondary transition-all duration-200 last:border-b-0 hover:bg-accentMuted hover:text-textPrimary"
        >
          {channel.id === 'linkedin' ? (
            <Linkedin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          ) : (
            <Share2 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
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
  onPremiumStatusChange,
  premiumRefreshToken,
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
        className="rounded-lg border border-trace-border bg-slate-100 p-2 text-textSecondary backdrop-blur transition hover:border-borderMuted hover:text-textPrimary"
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
      onPremiumStatusChange={onPremiumStatusChange}
      premiumRefreshToken={premiumRefreshToken}
    />
  )
}

function MethodologyDataTransparencyCard() {
  return (
    <aside
      aria-labelledby="methodology-heading"
      className="rounded-xl border border-trace-border bg-trace-surface p-4 text-xs text-textSecondary"
    >
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0">
          <h4 id="methodology-heading" className="text-xs font-semibold leading-snug text-textPrimary">
            How Your Transition Pathway Is Built
          </h4>
          <p className="mt-2 leading-relaxed">
            Your roadmap maps current role signals, destination requirements, and skill gaps into a
            sequenced transition route — not a single replacement percentage.
          </p>
          <ul className="mt-3 list-none space-y-2.5 leading-relaxed">
            <li>
              <span className="font-semibold text-textPrimary">O*NET occupational tasks</span>
              {' — '}
              role capability requirements for each stage of your recommended route.
            </li>
            <li>
              <span className="font-semibold text-textPrimary">Labor market trend signals</span>
              {' — '}
              industry momentum shaping realistic journey timelines.
            </li>
            <li>
              <span className="font-semibold text-textPrimary">Resume skill extraction</span>
              {' — '}
              milestone and leverage-point callouts derived from your stated experience.
            </li>
          </ul>
          <Link
            href="/methodology"
            className="mt-3 inline-flex items-center gap-0.5 font-medium text-accent transition hover:text-accent"
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
    <p className="rounded-xl border border-borderMuted bg-surface px-4 py-3 text-xs leading-relaxed text-textSecondary">
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

function formatHistoryMonthYear(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    year: 'numeric',
  })
}

function historyRoleKey(entry: HistoryEntry): string {
  const title =
    entry.result.jobTitle.trim() ||
    entry.result.roadmap.destinationPosition.trim() ||
    'analysis'
  return title.toLowerCase()
}

function dedupeHistoryEntriesByRole(entries: HistoryEntry[]): HistoryEntry[] {
  const latestByRole = new Map<string, HistoryEntry>()

  for (const entry of entries) {
    const key = historyRoleKey(entry)
    const existing = latestByRole.get(key)

    if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
      latestByRole.set(key, entry)
    }
  }

  return [...latestByRole.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

function formatPastAnalysisLabel(entry: HistoryEntry): string {
  return `${entry.result.jobTitle} · ${formatHistoryMonthYear(entry.createdAt)}`
}

function HistoryEmptyState({ onStartAnalysis }: { onStartAnalysis: () => void }) {
  return (
    <section
      aria-labelledby="history-empty-heading"
      className="flex flex-col items-center rounded-2xl border border-dashed border-trace-border bg-trace-surface px-6 py-16 text-center"
    >
      <History className="h-9 w-9 text-slate-600" aria-hidden />
      <h2 id="history-empty-heading" className="sr-only">
        No career roadmaps yet
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-textSecondary">
        No career roadmaps generated yet. Go to New Analysis to build your first AI transition path.
      </p>
      <button
        type="button"
        onClick={onStartAnalysis}
        className="btn-primary mt-6 inline-flex items-center justify-center"
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
        className="mb-1.5 block text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-textSecondary sm:text-right"
      >
        Past analysis
      </label>
      <select
        id="past-analysis-role"
        value={activeEntryId}
        onChange={(event) => onSelectEntry(event.target.value)}
        className="w-full rounded-xl border border-trace-border bg-surface border border-trace-border px-4 py-2.5 text-sm font-medium text-textPrimary outline-none transition focus:border-accent focus:ring-2 focus:ring-highlight/25"
      >
        {entries.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {formatPastAnalysisLabel(entry)}
          </option>
        ))}
      </select>
    </div>
  )
}

function JourneyScopeLegend() {
  return (
    <aside aria-labelledby="journey-scope-heading" className="horizon-card p-6">
      <h4
        id="journey-scope-heading"
        className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary"
      >
        Your journey at a glance
      </h4>
      <dl className="mt-4 space-y-4 text-xs leading-relaxed">
        <div>
          <dt className="font-semibold text-accent">{MACRO_PROGRESS_SECTION_LABEL}</dt>
          <dd className="mt-1 text-textSecondary">
            Full transition blueprint — estimated months and four sequential capability milestones.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-accent">{MICRO_SPRINT_WORKSPACE_LABEL}</dt>
          <dd className="mt-1 text-textSecondary">
            Your immediate 30-day window for sprint tasks and leverage actions inside the active
            milestone.
          </dd>
        </div>
      </dl>
    </aside>
  )
}

function MacroBlueprintDurationBar({ roadmap }: { roadmap: CareerRoadmap }) {
  const totalMonths = roadmap.estimatedJourneyMonths
  const activeMonth = 1
  const progress = Math.min(100, Math.round((activeMonth / totalMonths) * 100))

  return (
    <div
      role="status"
      aria-label={`${formatBlueprintDurationLabel(totalMonths)}. Month ${activeMonth} of ${totalMonths}.`}
      className="horizon-card px-6 py-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="min-w-0 text-sm font-semibold text-textPrimary">
          {formatBlueprintDurationLabel(totalMonths)}
        </p>
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-xs">
          <div
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-borderMuted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Blueprint progress: month ${activeMonth} of ${totalMonths}`}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="shrink-0 text-[11px] tabular-nums text-textSecondary">
            Month <span className="font-semibold text-textPrimary">{activeMonth}</span> of{' '}
            <span className="font-semibold text-textPrimary">{totalMonths}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function TargetRoleSummaryBar({ result }: { result: ScanResult }) {
  const score = result.score
  const riskLabel = scoreExposureLabel(score)
  const scoreColor = scoreGaugeColor(score)
  const riskBadgeClass = exposureRiskBadgeClass(riskLabel)

  return (
    <aside className="horizon-card p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
        Target role summary
      </p>
      <p className="mt-2 text-sm font-semibold leading-snug text-textPrimary">
        {result.roadmap.destinationPosition}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-borderMuted pt-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-textSecondary">
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
      <p className="mt-4 text-xs leading-relaxed text-textSecondary">{result.summary}</p>
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
  onPremiumStatusChange,
  premiumRefreshToken,
}: {
  entries: HistoryEntry[]
  selectedEntryId: string | null
  onStartAnalysis: () => void
  isPremium: boolean
  userId: string | null
  onRunAnotherScan: () => void
  onPremiumStatusChange: (isPremium: boolean) => void
  premiumRefreshToken: number
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
          onPremiumStatusChange={onPremiumStatusChange}
          premiumRefreshToken={premiumRefreshToken}
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
      className="horizon-card px-6 py-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
        <p className="min-w-0 truncate text-sm font-semibold text-textPrimary sm:flex-1 sm:text-right">
          {roadmap.currentPosition}
        </p>

        <div className="flex shrink-0 items-center justify-center gap-1" aria-hidden>
          <ChevronRight className="h-4 w-4 text-accent" strokeWidth={2.5} />
        </div>

        <p className="min-w-0 truncate text-sm font-semibold text-textPrimary sm:flex-1">
          {roadmap.destinationPosition}
        </p>
      </div>
    </div>
  )
}

function SidebarPremiumUpgrade({
  isPremium,
  onPremiumStatusChange,
  premiumRefreshToken,
}: {
  isPremium: boolean
  onPremiumStatusChange: (isPremium: boolean) => void
  premiumRefreshToken: number
}) {
  if (isPremium) return null

  return (
    <div>
      <PremiumUpgradeButton
        isPremium={isPremium}
        onPremiumStatusChange={onPremiumStatusChange}
        refreshToken={premiumRefreshToken}
      />
      <p className="mt-2 text-center text-[11px] text-slate-500">$29/month · Cancel anytime</p>
    </div>
  )
}

function AnalysisResultsLayout({
  result,
  isPremium,
  userId,
  onRunAnotherScan,
  onPremiumStatusChange,
  premiumRefreshToken,
}: {
  result: ScanResult
  isPremium: boolean
  userId: string | null
  onRunAnotherScan: () => void
  onPremiumStatusChange: (isPremium: boolean) => void
  premiumRefreshToken: number
}) {
  return (
    <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6">
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-textSecondary">
          {MACRO_PROGRESS_SECTION_LABEL}
        </p>
        <RoleTransitionStatusBar roadmap={result.roadmap} />
        <MacroBlueprintDurationBar roadmap={result.roadmap} />
        <AnalysisResultCard
          roadmap={result.roadmap}
          isPremium={isPremium}
          userId={userId}
          onPremiumStatusChange={onPremiumStatusChange}
          premiumRefreshToken={premiumRefreshToken}
        />
      </div>

      <div className="flex flex-col gap-4">
        <JourneyScopeLegend />
        <TargetRoleSummaryBar result={result} />
        <button
          type="button"
          onClick={onRunAnotherScan}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-trace-border bg-trace-surface py-3 text-sm font-medium text-textSecondary transition hover:bg-trace-raised"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Run Another Scan
        </button>
        {!isPremium ? (
          <SidebarPremiumUpgrade
            isPremium={isPremium}
            onPremiumStatusChange={onPremiumStatusChange}
            premiumRefreshToken={premiumRefreshToken}
          />
        ) : null}
        {!isPremium ? <TemporaryScanNotice /> : null}
        <MethodologyDataTransparencyCard />
      </div>
    </section>
  )
}

const FIELD_INPUT_CLASS =
  'trace-input w-full p-3 text-sm caret-accent transition disabled:cursor-not-allowed disabled:opacity-60'

const FIELD_INPUT_READONLY_CLASS =
  'trace-input w-full p-3 pr-10 text-sm text-textSecondary outline-none disabled:cursor-not-allowed'

type ShieldViewProps = {
  userId: string | null
  fullName: string
  jobRole: string
  isPremium: boolean
  recentScans: ScanRow[]
  onScanComplete: () => void
  onPremiumStatusChange: (isPremium: boolean) => void
  premiumRefreshToken: number
}

function ShieldView({
  userId,
  fullName,
  jobRole,
  isPremium,
  recentScans,
  onScanComplete,
  onPremiumStatusChange,
  premiumRefreshToken,
}: ShieldViewProps) {
  const [phase, setPhase] = useState<ShieldPhase>('form')
  const [resumeText, setResumeText] = useState('')
  const [currentJobTitle, setCurrentJobTitle] = useState(() => formatJobTitle(jobRole))
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
  const [scanBalanceRefreshToken, setScanBalanceRefreshToken] = useState(0)
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

    return dedupeHistoryEntriesByRole(
      entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
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
    setCurrentJobTitle((prev) => (prev.trim() ? prev : formatJobTitle(jobRole)))
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
    const trimmedCurrent = formatJobTitle(currentJobTitle)
    const trimmedTitle = formatJobTitle(targetJobTitle)
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

    setCurrentJobTitle(trimmedCurrent)
    setTargetJobTitle(trimmedTitle)

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
      onScanComplete()
      setScanBalanceRefreshToken((token) => token + 1)
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Shield className="h-6 w-6 shrink-0 text-accent" aria-hidden />
              <h1 className="text-xl font-bold text-textPrimary md:text-2xl">AI Career Shield</h1>
            </div>
            <p className="mt-1.5 text-sm text-textSecondary">
              Analyze your AI exposure risk and career resilience.
            </p>
            {isPremium ? (
              <span className="horizon-badge-active mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                Pro
              </span>
            ) : null}
          </div>

          {isPremium ? (
            <Link
              href="/dashboard/roadmap"
              className="btn-primary w-full gap-2 sm:w-auto"
            >
              <MapIcon className="h-4 w-4 shrink-0" aria-hidden />
              View Your Roadmap
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ) : null}
        </div>
      </header>

      <div className="flex flex-col gap-4 border-b border-borderMuted pb-0 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setShieldTab('analysis')
            setSelectedHistoryEntryId(null)
          }}
          className={`horizon-interactive rounded-lg px-4 py-2 text-sm font-medium ${
            shieldTab === 'analysis'
              ? 'horizon-nav-active'
              : 'text-textSecondary hover:bg-accentMuted/60 hover:text-textPrimary'
          }`}
        >
          New Analysis
        </button>
        <button
          type="button"
          onClick={() => setShieldTab('history')}
          className={`horizon-interactive rounded-lg px-4 py-2 text-sm font-medium ${
            shieldTab === 'history'
              ? 'horizon-nav-active'
              : 'text-textSecondary hover:bg-accentMuted/60 hover:text-textPrimary'
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
          onPremiumStatusChange={onPremiumStatusChange}
          premiumRefreshToken={premiumRefreshToken}
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
          scanBalanceRefreshToken={scanBalanceRefreshToken}
        />
      ) : null}

      {shieldTab === 'analysis' && phase === 'loading' ? (
        <section
          className="flex flex-col items-center rounded-2xl border border-trace-border bg-trace-surface px-6 py-14 text-center ring-1 ring-sky-900/40/50"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-trace-border border-t-sky-300" />
            <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-sky-200/60 [animation-direction:reverse] [animation-duration:1.4s]" />
          </div>
          <p className="mt-8 text-sm font-medium text-textPrimary">Analyzing your profile</p>
          <p
            key={loadingCaptionIndex}
            className="mt-2 max-w-xs animate-pulse text-xs text-textSecondary"
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
          onPremiumStatusChange={onPremiumStatusChange}
          premiumRefreshToken={premiumRefreshToken}
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
  onPremiumStatusChange: (isPremium: boolean) => void
  premiumRefreshToken: number
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
        enabled ? 'bg-accent' : 'bg-slate-700'
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
  onPremiumStatusChange,
  premiumRefreshToken,
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
        <h1 className="text-xl font-bold text-textPrimary md:text-2xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-textSecondary">Manage your account settings and preferences</p>
      </header>

      {success ? (
        <div
          role="status"
          className="rounded-lg border border-accent/30 bg-accentMuted px-4 py-3 text-sm text-accent"
        >
          Profile updated successfully.
        </div>
      ) : null}

      {complianceError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {complianceError}
        </div>
      ) : null}

      {complianceSuccess ? (
        <div
          role="status"
          className="rounded-lg border border-accent/30 bg-accentMuted px-4 py-3 text-sm text-accent"
        >
          {complianceSuccess}
        </div>
      ) : null}

      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
      <aside className="rounded-xl border border-trace-border bg-trace-surface p-5 md:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-700 shadow-lg shadow-orange-900/40">
            <span className="text-xl font-bold text-white">
              {profileAvatarInitials(fullName, email)}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-textPrimary">{displayName}</h2>
          <p className="mt-0.5 text-sm text-textSecondary">{email}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-trace-border bg-accentMuted px-3 py-1 text-xs font-medium text-accent">
            <Shield className="h-3.5 w-3.5 text-accent" aria-hidden />
            {isPremium ? 'Premium Account' : 'Free Account'}
          </span>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-trace-border pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-textSecondary">Scans this month</dt>
            <dd className="font-medium text-textPrimary">{scansThisMonth}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-textSecondary">Member since</dt>
            <dd className="font-medium text-textPrimary">{formatMemberSince(memberSince)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-textSecondary">Last scan</dt>
            <dd className="font-medium text-textPrimary">{formatLastScan(lastScanAt)}</dd>
          </div>
        </dl>

        {!isPremium ? (
          <PremiumUpgradeButton
            className="btn-primary mt-5 flex w-full items-center justify-center gap-2"
            isPremium={isPremium}
            onPremiumStatusChange={onPremiumStatusChange}
            refreshToken={premiumRefreshToken}
          />
        ) : null}
      </aside>

      <div className="flex flex-col gap-6 md:col-span-2">
      <section className="rounded-xl border border-trace-border bg-trace-surface p-5">
        <div className="mb-4 flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-textPrimary">Personal Information</h2>
            <p className="mt-0.5 text-xs text-textSecondary">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-textPrimary">
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
            <label htmlFor="profileEmail" className="mb-1.5 block text-xs font-medium text-textPrimary">
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
            <label htmlFor="currentRole" className="mb-1.5 block text-xs font-medium text-textPrimary">
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
            className="btn-primary flex w-full items-center justify-center gap-2"
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

      <section className="rounded-xl border border-trace-border bg-trace-surface p-5">
        <div className="mb-4 flex items-start gap-3">
          <Settings className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold text-textPrimary">Preferences</h2>
            <p className="mt-0.5 text-xs text-slate-500">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Bell className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              <div>
                <p className="text-sm font-medium text-textPrimary">Email Notifications</p>
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
                <p className="text-sm font-medium text-textPrimary">Weekly Reports</p>
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

      <section className="rounded-xl border border-trace-border bg-trace-surface p-5">
        <div className="mb-3 flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <h2 id="compliance-heading" className="text-sm font-semibold text-textPrimary">
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
            className="flex w-full items-center gap-3 rounded-lg border border-trace-border bg-trace-surface px-3 py-3 text-left transition hover:border-trace-border hover:bg-accentMuted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-textPrimary">Export My Data</span>
              <span className="block text-xs text-slate-500">Download all your PII records</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          </button>

          <button
            type="button"
            onClick={handlePermanentDeletion}
            disabled={deleteLoading || !userId}
            className="flex w-full items-center gap-3 rounded-lg border border-red-900/40 bg-red-50 px-3 py-3 text-left transition hover:border-red-800/50 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="border-t border-trace-border pt-4">
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
  const [premiumRefreshToken, setPremiumRefreshToken] = useState(0)
  const [premiumWelcome, setPremiumWelcome] = useState(false)
  const [recentScans, setRecentScans] = useState<ScanRow[]>([])
  const [scansThisMonth, setScansThisMonth] = useState(0)
  const [memberSince, setMemberSince] = useState<string | null>(null)
  const [lastScanAt, setLastScanAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePremiumStatusChange = useCallback((premium: boolean) => {
    setIsPremium(premium)
  }, [])

  const refreshPremiumStatus = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) return false

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('[Dashboard] Failed to refresh premium status:', profileError.message)
      return false
    }

    const premium = profile?.is_premium ?? false
    setIsPremium(premium)
    return premium
  }, [])

  const confirmPremiumCheckout = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      const payload = (await response.json()) as { isPremium?: boolean; error?: string }

      if (!response.ok) {
        console.error('[Dashboard] Checkout confirm failed:', payload.error)
        return false
      }

      if (payload.isPremium) {
        setIsPremium(true)
        setPremiumWelcome(true)
        return true
      }

      return false
    } catch (error) {
      console.error('[Dashboard] Checkout confirm failed:', error)
      return false
    }
  }, [])

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
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const checkoutSuccess =
      params.get('success') === 'true' || params.get('checkout') === 'success'
    const sessionId = params.get('session_id')

    if (!checkoutSuccess) return

    async function handleCheckoutReturn() {
      if (sessionId) {
        await confirmPremiumCheckout(sessionId)
      }
      const premium = await refreshPremiumStatus()
      if (premium) {
        setPremiumWelcome(true)
      }
      setPremiumRefreshToken((token) => token + 1)
    }

    void handleCheckoutReturn()

    const retryTimers = [2000, 5000, 10000].map((delay) =>
      window.setTimeout(() => {
        void handleCheckoutReturn()
      }, delay)
    )

    window.history.replaceState({}, '', '/dashboard')

    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [confirmPremiumCheckout, refreshPremiumStatus])

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

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const sessionId = params.get('session_id')
        const checkoutSuccess =
          params.get('success') === 'true' || params.get('checkout') === 'success'

        if (checkoutSuccess && sessionId) {
          const activated = await confirmPremiumCheckout(sessionId)
          if (activated) {
            setPremiumWelcome(true)
          }
        }
      }

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

        if (!profile.is_premium) {
          try {
            const syncResponse = await fetch('/api/checkout/sync', { method: 'POST' })
            const syncPayload = (await syncResponse.json()) as {
              isPremium?: boolean
              synced?: boolean
            }
            if (syncResponse.ok && syncPayload.isPremium) {
              setIsPremium(true)
              if (syncPayload.synced) {
                setPremiumWelcome(true)
              }
            }
          } catch (syncError) {
            console.error('[Dashboard] Premium sync failed:', syncError)
          }
        }
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
  }, [confirmPremiumCheckout])

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
    <div className="relative -mx-4 -my-8 min-h-screen text-textSecondary sm:-mx-6 md:-mx-8 md:-my-12">
      <DashboardNav view={view} onViewChange={setView} />

      <div className="w-full min-h-screen p-4 md:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 pb-24 md:pb-8">
          {error ? (
            <div
              role="alert"
              className="alert-anomaly text-sm"
            >
              {error}
            </div>
          ) : null}

          {premiumWelcome && isPremium ? (
            <div
              role="status"
              className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accentMuted px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-accent">Premium activated</p>
                <p className="mt-1 text-sm text-textSecondary">
                  Your full transition plan is unlocked. Open your interactive roadmap or review saved
                  analyses in History.
                </p>
              </div>
              <Link
                href="/dashboard/roadmap"
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-2"
              >
                <MapIcon className="h-4 w-4" aria-hidden />
                View Your Roadmap
              </Link>
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
              onPremiumStatusChange={handlePremiumStatusChange}
              premiumRefreshToken={premiumRefreshToken}
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
              onPremiumStatusChange={handlePremiumStatusChange}
              premiumRefreshToken={premiumRefreshToken}
            />
          )}
        </div>
      </div>
    </div>
  )
}
