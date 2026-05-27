import { timelineDisplayItems } from './timelineDisplay'

export const latestAiShift = {
  tag: 'ENTERPRISE AI',
  title: 'OpenAI releases advanced agent framework for enterprise workflows',
  summary:
    'New capabilities let teams deploy autonomous agents that plan, call tools, and complete multi-step business tasks.',
  category: 'AI Agents',
  impact: 'High Impact',
  updatedLabel: 'Updated May 20',
}

function periodStartYear(period: string) {
  const match = period.match(/\d{4}/)
  return match?.[0] ?? period
}

export const timelineOverview = timelineDisplayItems.map((item) => ({
  id: item.id,
  year: periodStartYear(item.period),
  label: item.title,
}))

export const timelineLastUpdated = 'Last updated May 2026'
