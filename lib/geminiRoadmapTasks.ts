import {
  ANALYZE_ROADMAP_SYSTEM_INSTRUCTIONS,
  buildAnalyzeRoadmapUserPrompt,
  type AnalyzeRoadmapUserContext,
} from '@/lib/analyzeRoadmapPrompt'
import { parsePremiumRoadmapTasksPayload } from '@/lib/analyzeRoadmap'
import type { PremiumRoadmapTasksPayload } from '@/types/premiumRoadmapResources'

const DEFAULT_MODEL = 'gemini-1.5-flash'
const GEMINI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

const GEMINI_ROADMAP_EXTRA_INSTRUCTIONS = `

## Code-heavy output (Gemini)
- In actionSteps, include copy-pasteable bash/shell blocks using markdown fenced code where helpful, e.g. Step 2: Run:
\`\`\`bash
npm install && npm run build
\`\`\`
- Prefer real documentation URLs (vendor docs, MDN, GitHub official repos).
- Keep the response as strict JSON only (no prose outside the JSON object).`

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  error?: { message?: string }
}

export async function generatePremiumRoadmapTasksWithGemini(
  context: AnalyzeRoadmapUserContext
): Promise<PremiumRoadmapTasksPayload> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const model = process.env.GEMINI_ROADMAP_MODEL?.trim() || DEFAULT_MODEL
  const userPrompt = buildAnalyzeRoadmapUserPrompt(context)
  const systemText = ANALYZE_ROADMAP_SYSTEM_INSTRUCTIONS + GEMINI_ROADMAP_EXTRA_INSTRUCTIONS

  const url = `${GEMINI_GENERATE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.2,
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

  return parsePremiumRoadmapTasksPayload(parsed)
}
