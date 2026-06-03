import AsyncStorage from '@react-native-async-storage/async-storage'
import type { MobileMatcherResult } from '@/types/mobileMatcher'
import { apiFetch, getSupabaseAccessToken } from './apiClient'

const LOCAL_HISTORY_KEY = '@future-trace/scan-history'

export type MobileMatcherApiResponse = MobileMatcherResult

export type UserResumeScanRecord = {
  id: string
  current_role_input?: string | null
  target_role_input: string
  calculated_risk_score: number
  tier?: string | null
  gaps_summary?: string | null
  created_at: string
}

export type LocalScanInput = {
  currentRole: string
  targetRole: string
  calculatedRiskScore: number
  tier?: string
  gapsSummary?: string | null
}

async function readLocalScans(): Promise<UserResumeScanRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UserResumeScanRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalScans(scans: UserResumeScanRecord[]) {
  await AsyncStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(scans))
}

export async function appendLocalScan(input: LocalScanInput): Promise<UserResumeScanRecord> {
  const existing = await readLocalScans()
  const record: UserResumeScanRecord = {
    id: `local-${Date.now()}`,
    current_role_input: input.currentRole || null,
    target_role_input: input.targetRole,
    calculated_risk_score: input.calculatedRiskScore,
    tier: input.tier ?? 'free',
    gaps_summary: input.gapsSummary ?? null,
    created_at: new Date().toISOString(),
  }

  await writeLocalScans([record, ...existing].slice(0, 50))
  return record
}

async function fetchRemoteScans(): Promise<UserResumeScanRecord[]> {
  try {
    const response = await apiFetch('/api/mobile/scans')
    if (!response.ok) return []
    const payload = (await response.json()) as { scans?: UserResumeScanRecord[] }
    return payload.scans ?? []
  } catch {
    return []
  }
}

function mergeScans(
  remote: UserResumeScanRecord[],
  local: UserResumeScanRecord[]
): UserResumeScanRecord[] {
  const seen = new Set<string>()
  const merged: UserResumeScanRecord[] = []

  for (const scan of [...remote, ...local]) {
    const key = `${scan.target_role_input}|${scan.calculated_risk_score}|${scan.created_at}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(scan)
  }

  return merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function loadScanHistory(): Promise<UserResumeScanRecord[]> {
  const [remote, local] = await Promise.all([fetchRemoteScans(), readLocalScans()])
  return mergeScans(remote, local)
}

export async function persistScanAfterAnalysis(input: LocalScanInput): Promise<void> {
  const accessToken = await getSupabaseAccessToken()
  if (!accessToken) {
    await appendLocalScan(input)
  }
}

export async function runMobileMatcher(input: {
  currentRole: string
  targetRole: string
  resumeText: string
}): Promise<MobileMatcherApiResponse> {
  const response = await apiFetch('/api/mobile/matcher', {
    method: 'POST',
    body: JSON.stringify({
      current_role: input.currentRole,
      target_role: input.targetRole,
      resume_text: input.resumeText,
    }),
  })

  const payload = (await response.json()) as MobileMatcherApiResponse & { error?: string }

  if (!response.ok) {
    throw new Error(payload.error ?? 'Analysis request failed.')
  }

  if (typeof payload.market_risk_score !== 'number') {
    throw new Error('Analysis response was missing a risk score.')
  }

  return payload
}

export function summarizeMatcherGaps(result: MobileMatcherApiResponse): string | null {
  const skills = result.pivot_roles?.flatMap((role) => role.skills_missing).filter(Boolean) ?? []
  if (skills.length === 0) return null
  return [...new Set(skills)].slice(0, 6).join(', ')
}
