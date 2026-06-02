export type WhatComesNextTag = 'now' | 'emerging' | 'critical'

export type WhatComesNextItem = {
  id: string
  title: string
  description: string
  tag?: WhatComesNextTag
  icon:
    | 'copilot'
    | 'agent'
    | 'multi-agent'
    | 'workflow'
    | 'governance'
    | 'traceability'
    | 'human-loop'
}

export const whatComesNextItems: WhatComesNextItem[] = [
  {
    id: 'ai-copilots',
    title: 'AI Copilots',
    description: 'Assist users by integrating across applications and conversational interfaces.',
    tag: 'now',
    icon: 'copilot',
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    description: 'Autonomous agents that plan, call tools, and complete tasks with minimal supervision.',
    tag: 'emerging',
    icon: 'agent',
  },
  {
    id: 'multi-agent-systems',
    title: 'Multi-Agent Systems',
    description: 'Collections of specialized agents collaborating to solve complex, distributed problems.',
    icon: 'multi-agent',
  },
  {
    id: 'autonomous-workflows',
    title: 'Autonomous Workflows',
    description: 'End-to-end orchestrated processes that execute, monitor, and optimize themselves.',
    icon: 'workflow',
  },
  {
    id: 'ai-governance',
    title: 'AI Governance',
    description: 'Policies, auditing, and infrastructure to ensure AI systems are safe, fair, and compliant.',
    tag: 'critical',
    icon: 'governance',
  },
  {
    id: 'decision-traceability',
    title: 'Decision Traceability',
    description: 'Recording reasoning, data sources, and actions for auditing and post-hoc review.',
    tag: 'critical',
    icon: 'traceability',
  },
  {
    id: 'human-in-the-loop',
    title: 'Human-in-the-Loop',
    description: 'Coupling automated systems with human oversight, escalation for ambiguous cases.',
    tag: 'critical',
    icon: 'human-loop',
  },
]

export const trustChallengeBullets = [
  'Privacy & Data Governance',
  'Explainability & Transparency',
  'Bias Detection & Mitigation',
  'Human Oversight & Control',
]
