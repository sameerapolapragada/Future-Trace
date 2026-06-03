/** Hands-on build blueprint shape for premium sprint task drawer UI. */

export interface BlueprintStep {
  title: string
  instruction: string
  codeSnippet?: string
  codeLanguage?: string
}

export type SprintTaskType = 'technical' | 'discovery' | 'metrics' | 'integration'

export interface SprintResourceLink {
  label: string
  url: string
}

/** Normalized task view for accordion drawer rendering. */
export interface Task {
  id: string
  title: string
  type: SprintTaskType
  duration: string
  whyThisMatters: string
  goal: string
  steps: BlueprintStep[]
  resources: SprintResourceLink[]
}
