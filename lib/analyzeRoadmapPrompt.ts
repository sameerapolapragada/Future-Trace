/**
 * LLM system instructions and JSON schema for premium roadmap technical execution resources.
 * Output shape is fixed — every task must include a full `resources` object.
 */

export const PREMIUM_ROADMAP_TASKS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Stable snake-case or kebab-case task identifier.' },
          text: { type: 'string', description: 'Core task description the user executes.' },
          completed: { type: 'boolean', description: 'Always false for newly generated tasks.' },
          resources: {
            type: 'object',
            properties: {
              conceptExplanation: {
                type: 'string',
                description:
                  'Clear, concise, jargon-free overview of the concept and why it matters for this transition.',
              },
              actionSteps: {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Ordered, highly technical implementation steps prefixed with Step N:. Include commands, config keys, APIs, and validation checks.',
              },
              officialDocumentation: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    url: { type: 'string', description: 'HTTPS URL to official vendor or standards documentation.' },
                  },
                  required: ['label', 'url'],
                  additionalProperties: false,
                },
              },
            },
            required: ['conceptExplanation', 'actionSteps', 'officialDocumentation'],
            additionalProperties: false,
          },
        },
        required: ['id', 'text', 'completed', 'resources'],
        additionalProperties: false,
      },
    },
  },
  required: ['tasks'],
  additionalProperties: false,
} as const

export const ANALYZE_ROADMAP_SYSTEM_INSTRUCTIONS = `You are Future Trace's Premium Technical Execution Engine.

Your sole responsibility is to produce structured, implementation-ready task resources for a user's 30-day sprint workspace inside an AI career transition roadmap. Do not produce motivational copy, career coaching, or high-level strategy. Focus exclusively on detailed technical execution.

## Output contract
Return valid JSON matching the provided schema. The root object must contain a "tasks" array.

Every task object MUST include:
- "id": stable identifier (lowercase, hyphen-separated, e.g. "sf-p1-t1")
- "text": the core task description (one clear outcome the user can verify)
- "completed": always false for newly generated tasks
- "resources": a complete object with ALL three fields below

## resources object (required on every task)

### conceptExplanation
- 2–4 sentences, jargon-free but technically accurate.
- Explain what the concept is and why mastering it is critical for this specific milestone and role transition.
- Tie the concept to the user's current → target role context when provided.

### actionSteps
- Provide 3–6 ordered steps.
- Each step MUST start with "Step 1:", "Step 2:", etc.
- Steps must be highly technical, accurate, and actionable so the user can implement from their dashboard workspace without guesswork.
- Prefer concrete artifacts: CLI commands, file paths, environment variables, API endpoints, schema fields, IAM permissions, test assertions, and acceptance checks.
- Avoid vague advice ("learn more about X", "research Y"). Replace with verifiable actions ("Run \`npm test --filter=api\` and confirm exit code 0").
- When a task spans tools (Salesforce, AWS, Python, etc.), name the exact product surfaces and configuration locations.

### officialDocumentation
- Provide 1–3 links per task.
- Each entry: { "label": "Human-readable doc title", "url": "https://..." }
- URLs must point to official vendor documentation, standards bodies, or authoritative open-source project docs — not blogs or aggregators.
- Use HTTPS URLs only.

## Quality bar
- Tasks must ladder up to the active milestone chapter and 30-day sprint window.
- Assume the user is a working professional executing in evenings/weekends; optimize for copy-pasteable setup and measurable checkpoints.
- If task seeds are provided, preserve their intent and ids; enrich with resources. If no seeds, generate 4 execution tasks per request unless told otherwise.
- Never omit the resources object on any task.
- Never return markdown fences or commentary outside JSON.`

export type AnalyzeRoadmapUserContext = {
  currentPosition: string
  destinationPosition: string
  milestoneTitle: string
  phaseLabel: string
  chapterLabel?: string
  sprintFocus?: string
  resumeExcerpt?: string
  taskCount?: number
  taskSeeds?: Array<{ id: string; text: string }>
}

export function buildAnalyzeRoadmapUserPrompt(context: AnalyzeRoadmapUserContext): string {
  const taskCount = context.taskCount ?? context.taskSeeds?.length ?? 4
  const seedsBlock =
    context.taskSeeds && context.taskSeeds.length > 0
      ? `\nTask seeds (preserve ids; set completed to false; add full resources for each):\n${JSON.stringify(context.taskSeeds, null, 2)}`
      : `\nGenerate exactly ${taskCount} distinct execution tasks with new stable ids.`

  return `Generate premium technical execution tasks for this milestone.

Current role: ${context.currentPosition}
Target role: ${context.destinationPosition}
Milestone: ${context.milestoneTitle}
Phase: ${context.phaseLabel}
${context.chapterLabel ? `Chapter: ${context.chapterLabel}` : ''}
${context.sprintFocus ? `Active 30-day sprint focus: ${context.sprintFocus}` : ''}
${context.resumeExcerpt ? `\nResume context (use for tooling/stack specificity):\n${context.resumeExcerpt.slice(0, 2000)}` : ''}
${seedsBlock}

Return JSON only with the tasks array. Every task must include id, text, completed (false), and a complete resources object (conceptExplanation, actionSteps, officialDocumentation).`
}
