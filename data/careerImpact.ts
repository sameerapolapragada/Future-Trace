export type RiskTrend = 'stable' | 'rising'

export type RiskLevel = 'high' | 'medium' | 'low'

export type CareerRoleIcon =
  | 'laptop'
  | 'smartphone'
  | 'chart'
  | 'target'
  | 'headphones'
  | 'scale'
  | 'code'
  | 'shield'

export type EvolutionPhase = {
  era: string
  items: string[]
}

export type CareerRole = {
  id: string
  role: string
  impactPercent: number
  riskTrend: RiskTrend
  icon: CareerRoleIcon
  riskLevel: RiskLevel
  disruptionRisk: number
  automationPotential: number
  evolution: {
    earlyAI: EvolutionPhase
    currentAI: EvolutionPhase
    agenticFuture: EvolutionPhase
  }
}

export const careerRoles: CareerRole[] = [
  {
    id: 'software-engineer',
    role: 'Software Engineer',
    impactPercent: 55,
    riskTrend: 'stable',
    icon: 'laptop',
    riskLevel: 'medium',
    disruptionRisk: 55,
    automationPotential: 45,
    evolution: {
      earlyAI: { era: '2010', items: ['Code completion', 'Static analysis'] },
      currentAI: { era: '2020', items: ['AI-assisted coding', 'Automated testing'] },
      agenticFuture: { era: '2025+', items: ['Autonomous debugging', 'Self-optimizing systems'] },
    },
  },
  {
    id: 'marketing-specialist',
    role: 'Marketing Specialist',
    impactPercent: 75,
    riskTrend: 'rising',
    icon: 'smartphone',
    riskLevel: 'high',
    disruptionRisk: 75,
    automationPotential: 55,
    evolution: {
      earlyAI: { era: '2010', items: ['Basic segmentation', 'Automation'] },
      currentAI: { era: '2020', items: ['Content generation', 'Audience targeting'] },
      agenticFuture: { era: '2025+', items: ['Autonomous campaign management', 'Real-time optimization'] },
    },
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    impactPercent: 80,
    riskTrend: 'rising',
    icon: 'chart',
    riskLevel: 'high',
    disruptionRisk: 85,
    automationPotential: 70,
    evolution: {
      earlyAI: { era: '2010', items: ['Basic BI tools'] },
      currentAI: { era: '2020', items: ['AI-powered insights', 'Automated reporting'] },
      agenticFuture: { era: '2025+', items: ['Autonomous analysis pipelines', 'Predictive models'] },
    },
  },
  {
    id: 'product-manager',
    role: 'Product Manager',
    impactPercent: 50,
    riskTrend: 'stable',
    icon: 'target',
    riskLevel: 'medium',
    disruptionRisk: 50,
    automationPotential: 35,
    evolution: {
      earlyAI: { era: '2010', items: ['User analytics'] },
      currentAI: { era: '2020', items: ['AI-driven prioritization', 'Market analysis'] },
      agenticFuture: { era: '2025+', items: ['Autonomous roadmap generation', 'Adaptive planning'] },
    },
  },
  {
    id: 'customer-support-agent',
    role: 'Customer Support Agent',
    impactPercent: 85,
    riskTrend: 'rising',
    icon: 'headphones',
    riskLevel: 'high',
    disruptionRisk: 88,
    automationPotential: 80,
    evolution: {
      earlyAI: { era: '2010', items: ['IVR systems', 'Scripted chatbots'] },
      currentAI: { era: '2020', items: ['AI chatbots', 'Sentiment routing'] },
      agenticFuture: { era: '2025+', items: ['End-to-end ticket resolution', 'Proactive support agents'] },
    },
  },
  {
    id: 'legal-assistant',
    role: 'Legal Assistant',
    impactPercent: 70,
    riskTrend: 'rising',
    icon: 'scale',
    riskLevel: 'high',
    disruptionRisk: 72,
    automationPotential: 58,
    evolution: {
      earlyAI: { era: '2010', items: ['Document search', 'Template automation'] },
      currentAI: { era: '2020', items: ['Contract review', 'Legal research assistants'] },
      agenticFuture: { era: '2025+', items: ['Discovery management agents', 'Compliance workflow automation'] },
    },
  },
  {
    id: 'salesforce-admin',
    role: 'Salesforce Admin',
    impactPercent: 65,
    riskTrend: 'rising',
    icon: 'code',
    riskLevel: 'medium',
    disruptionRisk: 65,
    automationPotential: 60,
    evolution: {
      earlyAI: { era: '2010', items: ['Workflow rules', 'Report templates'] },
      currentAI: { era: '2020', items: ['AI configuration assistants', 'Automated reporting'] },
      agenticFuture: { era: '2025+', items: ['Self-maintaining CRM configs', 'Autonomous data hygiene'] },
    },
  },
  {
    id: 'ai-governance-analyst',
    role: 'AI Governance Analyst',
    impactPercent: 25,
    riskTrend: 'stable',
    icon: 'shield',
    riskLevel: 'low',
    disruptionRisk: 25,
    automationPotential: 30,
    evolution: {
      earlyAI: { era: '2010', items: ['Manual policy audits', 'Compliance checklists'] },
      currentAI: { era: '2020', items: ['Model monitoring tools', 'Risk assessment dashboards'] },
      agenticFuture: { era: '2025+', items: ['Autonomous compliance agents', 'Real-time policy enforcement'] },
    },
  },
]

/** First four roles shown on the home page preview */
export const careerRolesPreview = careerRoles.slice(0, 4)
