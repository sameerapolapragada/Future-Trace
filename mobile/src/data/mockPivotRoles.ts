export type PivotRoleCard = {
  id: string
  title: string
  salaryRange: string
  matchPercent: number
  skillsMissing: string[]
}

export const MOCK_PIVOT_ROLES: PivotRoleCard[] = [
  {
    id: 'pivot-1',
    title: 'AI Product Operations Lead',
    salaryRange: '$145k – $185k',
    matchPercent: 91,
    skillsMissing: ['Prompt systems design', 'LLM evaluation frameworks', 'Cross-functional AI governance'],
  },
  {
    id: 'pivot-2',
    title: 'Revenue Intelligence Architect',
    salaryRange: '$132k – $168k',
    matchPercent: 87,
    skillsMissing: ['Forecast automation', 'Executive narrative synthesis', 'Agent workflow orchestration'],
  },
  {
    id: 'pivot-3',
    title: 'Customer Journey AI Strategist',
    salaryRange: '$128k – $159k',
    matchPercent: 84,
    skillsMissing: ['Lifecycle experimentation', 'Personalization ops', 'Human-in-the-loop QA playbooks'],
  },
]
