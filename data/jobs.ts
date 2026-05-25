export type JobGroup = {
  id: string
  title: string
  description: string
  examples: { role: string; note?: string }[]
}

export const jobGroups: JobGroup[] = [
  {
    id: 'highly-exposed',
    title: 'Highly exposed',
    description: 'Roles with a high share of routine or predictable tasks that can be automated end-to-end.',
    examples: [
      { role: 'Customer support agent', note: 'FAQ handling and first-level triage are commonly automated.' },
      { role: 'Salesforce admin', note: 'Routine configuration and reporting tasks may be automated.' }
    ]
  },
  {
    id: 'moderately-exposed',
    title: 'Moderately exposed',
    description: 'Roles that will see significant task automation but retain human oversight and judgement.',
    examples: [
      { role: 'Data analyst', note: 'Automated reporting and exploratory analysis; humans focus on interpretation.' },
      { role: 'Marketing specialist', note: 'Content generation and segmentation assisted by AI.' },
      { role: 'Legal assistant', note: 'Document review can be accelerated; lawyers keep final decisions.' },
      { role: 'Healthcare administrator', note: 'Scheduling and workflows assisted by intelligent agents.' }
    ]
  },
  {
    id: 'ai-augmented',
    title: 'AI-augmented',
    description: 'Skilled roles enhanced by AI tools that increase productivity and creativity.',
    examples: [
      { role: 'Software developer', note: 'AI pair-programming and test generation speed up development.' },
      { role: 'Teacher', note: 'Personalized tutoring agents and automated grading augment teaching.' },
      { role: 'Project manager', note: 'AI helps with scheduling, risk detection, and progress summaries.' }
    ]
  },
  {
    id: 'ai-resilient',
    title: 'AI-resilient',
    description: 'Roles that require complex human judgement, ethics, or system-level oversight and are likely to grow in importance.',
    examples: [
      { role: 'AI governance analyst', note: 'Oversight, auditing, and policy work for AI deployments.' },
      { role: 'Senior legal counsel', note: 'High-stakes legal judgment and liability assessment.' }
    ]
  }
]
