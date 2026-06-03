import {
  buildMobileMatcherUserPrompt,
  MOBILE_MATCHER_SYSTEM_INSTRUCTIONS,
  type MobileMatcherUserContext,
} from '@/lib/mobileMatcherPrompt'
import type { MobileMatcherResult } from '@/types/mobileMatcher'

const DEFAULT_MODEL = 'gemini-1.5-flash'
const GEMINI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  error?: { message?: string }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function countSentences(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter((part) => part.trim().length > 0).length
}

export function parseMobileMatcherPayload(raw: unknown): MobileMatcherResult {
  if (!isRecord(raw)) {
    throw new Error('LLM response is not an object')
  }

  const score = raw.market_risk_score
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error('LLM response missing valid market_risk_score')
  }

  const riskRationale =
    typeof raw.risk_rationale === 'string' ? raw.risk_rationale.trim() : ''
  if (!riskRationale) {
    throw new Error('LLM response missing risk_rationale')
  }

  if (countSentences(riskRationale) < 2) {
    throw new Error('risk_rationale must contain at least two sentences')
  }

  if (!Array.isArray(raw.pivot_roles) || raw.pivot_roles.length !== 3) {
    throw new Error('LLM response must include exactly three pivot_roles')
  }

  const pivot_roles = raw.pivot_roles.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Invalid pivot_roles entry at index ${index}`)
    }

    const title = typeof item.title === 'string' ? item.title.trim() : ''
    const salary_range =
      typeof item.salary_range === 'string' ? item.salary_range.trim() : ''
    const match_percent = item.match_percent

    if (!title || !salary_range) {
      throw new Error(`pivot_roles[${index}] missing title or salary_range`)
    }

    if (
      typeof match_percent !== 'number' ||
      !Number.isFinite(match_percent) ||
      match_percent < 0 ||
      match_percent > 100
    ) {
      throw new Error(`pivot_roles[${index}] missing valid match_percent`)
    }

    if (!Array.isArray(item.skills_missing) || item.skills_missing.length < 2) {
      throw new Error(`pivot_roles[${index}] missing skills_missing`)
    }

    const skills_missing = item.skills_missing
      .map((skill) => (typeof skill === 'string' ? skill.trim() : ''))
      .filter(Boolean)

    if (skills_missing.length < 2) {
      throw new Error(`pivot_roles[${index}] skills_missing must contain strings`)
    }

    return {
      title,
      salary_range,
      match_percent: Math.round(match_percent),
      skills_missing,
    }
  })

  return {
    market_risk_score: Math.round(score),
    risk_rationale: riskRationale,
    pivot_roles,
  }
}

export async function generateMobileMatcherWithGemini(
  context: MobileMatcherUserContext
): Promise<MobileMatcherResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = process.env.GEMINI_MATCHER_MODEL?.trim() || DEFAULT_MODEL
  const userPrompt = buildMobileMatcherUserPrompt(context)

  const url = `${GEMINI_GENERATE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: MOBILE_MATCHER_SYSTEM_INSTRUCTIONS }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.25,
        responseMimeType: 'application/json',
      },
    }),
  })

  const body = (await response.json()) as GeminiGenerateResponse

  if (!response.ok) {
    const message = body.error?.message ?? `Gemini request failed (${response.status})`
    throw new Error(message)
  }

  const text = body.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned an empty completion')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Gemini returned invalid JSON')
  }

  return parseMobileMatcherPayload(parsed)
}
