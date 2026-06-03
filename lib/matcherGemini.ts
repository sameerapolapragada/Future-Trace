import type { MatcherScanPayload, TransitionRole } from '@/types/matcherScan'

const GEMINI_MODEL = 'gemini-1.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const MATCHED_ROLES_SCHEMA = `"matched_roles": [
    {
      "title": string,
      "salaryRangeMin": number (USD annual, e.g. 85000),
      "salaryRangeMax": number,
      "matchPercent": number (0-100),
      "skillGaps": string[] (2-4 specific technical skills to learn)
    }
  ]`

const MATCHED_ROLES_RULES = `- matched_roles MUST contain EXACTLY 5 alternative roles the user can transition into immediately from currentRole.
- Order the array rank 1 → 5: index 0 is #1 (fewest new skills to learn, highest matchPercent), index 4 is #5 (most new skills to learn, lowest matchPercent).
- Rank by ascending skill gap (highest matchPercent first).
- Use realistic US salary ranges and specific technical skill gaps.`

const FREE_SYSTEM = `You are a career transition analyst for Future Trace.
Return ONLY valid JSON matching this schema:
{
  "market_risk_score": number (0-100 integer),
  "risk_rationale": string (2-4 sentences),
  ${MATCHED_ROLES_SCHEMA}
}
Rules:
- Include market_risk_score and risk_rationale for the currentRole → targetRole pair.
${MATCHED_ROLES_RULES}
- Use resume excerpt when provided; otherwise infer reasonable gaps from currentRole.`

const PAID_SYSTEM = `You are a career transition strategist for Future Trace.
Return ONLY valid JSON matching this schema:
{
  "market_risk_score": number (0-100 integer),
  "risk_rationale": string (2-4 sentences),
  ${MATCHED_ROLES_SCHEMA}
}
Rules:
- Include market_risk_score and risk_rationale for the currentRole → targetRole pair.
${MATCHED_ROLES_RULES}`

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function parseTransitionRole(value: unknown): TransitionRole | null {
  if (!isRecord(value)) return null
  const skillGaps = value.skillGaps ?? value.skill_gaps
  const salaryRangeMin = value.salaryRangeMin ?? value.salary_range_min
  const salaryRangeMax = value.salaryRangeMax ?? value.salary_range_max
  const matchPercent = value.matchPercent ?? value.match_percent

  if (
    typeof value.title !== 'string' ||
    typeof salaryRangeMin !== 'number' ||
    typeof salaryRangeMax !== 'number' ||
    typeof matchPercent !== 'number' ||
    !Array.isArray(skillGaps)
  ) {
    return null
  }

  const gaps = skillGaps.filter((g): g is string => typeof g === 'string' && g.trim().length > 0)
  if (gaps.length === 0) return null

  return {
    title: value.title.trim(),
    salaryRangeMin: Number(salaryRangeMin),
    salaryRangeMax: Number(salaryRangeMax),
    matchPercent: Math.round(Number(matchPercent)),
    skillGaps: gaps.map((g) => g.trim()),
  }
}

export function parseMatcherScanPayload(raw: unknown): MatcherScanPayload {
  if (!isRecord(raw)) {
    throw new Error('Invalid Gemini response shape')
  }

  const scoreRaw = raw.market_risk_score ?? raw.marketRiskScore
  const rationaleRaw = raw.risk_rationale ?? raw.riskRationale
  const rolesRaw = raw.matched_roles ?? raw.matchedRoles

  if (typeof scoreRaw !== 'number' || typeof rationaleRaw !== 'string') {
    throw new Error('Gemini response missing market risk fields')
  }

  const marketRiskScore = Math.min(100, Math.max(0, Math.round(scoreRaw)))
  const riskRationale = rationaleRaw.trim()

  if (!Array.isArray(rolesRaw)) {
    throw new Error('Scan response missing matched_roles array')
  }

  const matchedRoles = rolesRaw
    .map(parseTransitionRole)
    .filter((role): role is TransitionRole => role !== null)
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5)

  if (matchedRoles.length !== 5) {
    throw new Error(`Expected exactly 5 matched roles, received ${matchedRoles.length}`)
  }

  return { marketRiskScore, riskRationale, matchedRoles }
}

async function callGemini(systemInstruction: string, userPrompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.35,
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 240)}`)
  }

  const body = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const text = body.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  return JSON.parse(text) as unknown
}

export async function runMatcherGeminiScan(input: {
  currentRole: string
  targetRole: string
  resumeExcerpt?: string
  paid: boolean
}): Promise<MatcherScanPayload> {
  const resumeLine = input.resumeExcerpt
    ? `Resume excerpt (use for skill-gap analysis):\n${input.resumeExcerpt.slice(0, 4000)}`
    : 'No resume excerpt provided — infer reasonable gaps from role titles.'

  const userPrompt = [
    `Current role: ${input.currentRole}`,
    `Target role: ${input.targetRole}`,
    resumeLine,
    'Return market risk score, rationale, and exactly 5 ranked transition roles (#1 fewest skills to learn → #5 most skills to learn).',
  ].join('\n\n')

  const raw = await callGemini(input.paid ? PAID_SYSTEM : FREE_SYSTEM, userPrompt)
  return parseMatcherScanPayload(raw)
}
