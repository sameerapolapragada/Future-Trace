import {
  ANALYZE_ROADMAP_SYSTEM_INSTRUCTIONS,
  buildAnalyzeRoadmapUserPrompt,
  PREMIUM_ROADMAP_TASKS_JSON_SCHEMA,
  type AnalyzeRoadmapUserContext,
} from '@/lib/analyzeRoadmapPrompt'
import type { PremiumExecutionTask, PremiumRoadmapTasksPayload } from '@/types/premiumRoadmapResources'

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = 'gpt-4o-mini'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isOfficialDocLink(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    typeof value.label === 'string' &&
    value.label.trim().length > 0 &&
    typeof value.url === 'string' &&
    /^https:\/\/.+/i.test(value.url.trim())
  )
}

function isTaskResources(value: unknown): boolean {
  if (!isRecord(value)) return false
  const actionSteps = value.actionSteps
  const officialDocumentation = value.officialDocumentation
  return (
    typeof value.conceptExplanation === 'string' &&
    value.conceptExplanation.trim().length > 0 &&
    Array.isArray(actionSteps) &&
    actionSteps.length >= 2 &&
    actionSteps.every((step) => typeof step === 'string' && step.trim().length > 0) &&
    Array.isArray(officialDocumentation) &&
    officialDocumentation.length >= 1 &&
    officialDocumentation.every(isOfficialDocLink)
  )
}

export function parsePremiumRoadmapTasksPayload(raw: unknown): PremiumRoadmapTasksPayload {
  if (!isRecord(raw) || !Array.isArray(raw.tasks)) {
    throw new Error('LLM response missing tasks array')
  }

  const tasks: PremiumExecutionTask[] = []

  for (const item of raw.tasks) {
    if (!isRecord(item)) {
      throw new Error('Invalid task entry in LLM response')
    }

    if (
      typeof item.id !== 'string' ||
      typeof item.text !== 'string' ||
      item.completed !== false ||
      !isTaskResources(item.resources)
    ) {
      throw new Error(`Task "${String(item.id)}" does not match premium resources schema`)
    }

    const resources = item.resources as Record<string, unknown>
    const actionSteps = resources.actionSteps as unknown[]
    const officialDocumentation = resources.officialDocumentation as unknown[]

    tasks.push({
      id: item.id.trim(),
      text: item.text.trim(),
      completed: false,
      resources: {
        conceptExplanation: String(resources.conceptExplanation).trim(),
        actionSteps: actionSteps.map((step) => String(step).trim()),
        officialDocumentation: officialDocumentation.map((doc) => {
          const row = doc as Record<string, unknown>
          return {
            label: String(row.label).trim(),
            url: String(row.url).trim(),
          }
        }),
      },
    })
  }

  if (tasks.length === 0) {
    throw new Error('LLM returned zero tasks')
  }

  return { tasks }
}

export async function generatePremiumRoadmapTasks(
  context: AnalyzeRoadmapUserContext
): Promise<PremiumRoadmapTasksPayload> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const model = process.env.OPENAI_ANALYZE_ROADMAP_MODEL?.trim() || DEFAULT_MODEL
  const userPrompt = buildAnalyzeRoadmapUserPrompt(context)

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'premium_roadmap_tasks',
          strict: true,
          schema: PREMIUM_ROADMAP_TASKS_JSON_SCHEMA,
        },
      },
      messages: [
        { role: 'system', content: ANALYZE_ROADMAP_SYSTEM_INSTRUCTIONS },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  const body = (await response.json()) as {
    error?: { message?: string }
    choices?: Array<{ message?: { content?: string } }>
  }

  if (!response.ok) {
    const message = body.error?.message ?? `OpenAI request failed (${response.status})`
    throw new Error(message)
  }

  const content = body.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('OpenAI returned an empty completion')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('OpenAI returned invalid JSON')
  }

  return parsePremiumRoadmapTasksPayload(parsed)
}
