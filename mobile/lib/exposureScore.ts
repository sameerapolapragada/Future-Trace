export type ExposureLevel = 'Low' | 'Medium' | 'High'

export type ExposureResult = {
  score: number
  level: ExposureLevel
  summary: string
  suggestions: string[]
}

const highRiskTerms = [
  'support',
  'customer service',
  'data entry',
  'bookkeeping',
  'transcription',
  'copywriter',
  'content writer',
  'salesforce admin',
  'receptionist',
]

const mediumRiskTerms = [
  'analyst',
  'marketing',
  'legal assistant',
  'paralegal',
  'designer',
  'accountant',
  'recruiter',
  'teacher',
  'journalist',
]

const resilientTerms = [
  'governance',
  'counsel',
  'surgeon',
  'nurse',
  'electrician',
  'plumber',
  'executive',
  'director',
  'security engineer',
]

const industryBoost: Record<string, number> = {
  technology: 8,
  software: 10,
  finance: 6,
  marketing: 12,
  healthcare: 4,
  education: 5,
  retail: 14,
  customer: 18,
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

export function calculateExposure(role: string, industry: string): ExposureResult {
  const roleText = role.trim().toLowerCase()
  const industryText = industry.trim().toLowerCase()

  let score = 42

  if (includesAny(roleText, highRiskTerms)) score += 28
  else if (includesAny(roleText, mediumRiskTerms)) score += 14
  else if (includesAny(roleText, resilientTerms)) score -= 18

  for (const [key, boost] of Object.entries(industryBoost)) {
    if (industryText.includes(key)) {
      score += boost
    }
  }

  score = Math.max(8, Math.min(92, score))

  let level: ExposureLevel = 'Medium'
  if (score >= 68) level = 'High'
  else if (score <= 40) level = 'Low'

  const summary =
    level === 'High'
      ? `${role || 'This role'} shows strong automation pressure in ${industry || 'your industry'}. Focus on oversight, strategy, and AI-augmented skills.`
      : level === 'Medium'
        ? `${role || 'This role'} has a mix of automatable tasks and human judgment. Upskill toward tools, analysis, and cross-functional work.`
        : `${role || 'This role'} is relatively resilient in ${industry || 'your industry'}, with growth potential in governance and human-led decisions.`

  const suggestions =
    level === 'High'
      ? [
          'Learn prompt engineering and workflow automation basics.',
          'Move toward customer success strategy or AI operations roles.',
          'Build a portfolio showing human oversight of AI systems.',
        ]
      : level === 'Medium'
        ? [
            'Use AI tools daily to increase output and stay competitive.',
            'Specialize in interpretation, QA, or domain expertise.',
            'Track industry-specific AI adoption in your field.',
          ]
        : [
            'Deepen leadership, compliance, or specialized technical skills.',
            'Explore AI governance and human-in-the-loop career paths.',
            'Mentor teams adopting AI responsibly.',
          ]

  return { score, level, summary, suggestions }
}
