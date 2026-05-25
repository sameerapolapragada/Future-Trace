export type TimelineEntry = {
  id: string
  title: string
  period: string
  summary: string
  details?: string
}

export const timeline: TimelineEntry[] = [
  {
    id: 'rule-based',
    title: 'Rule-based Systems',
    period: '1950s–1980s',
    summary: 'Early AI relied on handcrafted rules and symbolic logic to encode expert knowledge.',
    details:
      'Systems like expert systems and logic programming solved narrowly defined tasks by applying human-authored rules.'
  },
  {
    id: 'ml',
    title: 'Statistical Machine Learning',
    period: '1990s–2010s',
    summary: 'Shift from rules to learning from data using statistical models like SVMs and decision trees.',
    details: 'Emphasis moved to generalization from data, features, and probabilistic models.'
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    period: '2010s–present',
    summary: 'Deep neural networks enabled breakthroughs in perception and representation learning.',
    details: 'Large-scale supervised and unsupervised neural nets powered advances in vision, speech, and NLP.'
  },
  {
    id: 'transformers',
    title: 'Transformers & Large Models',
    period: '2017–present',
    summary: 'Transformer architectures revolutionized sequence modeling and scaled to large models.',
    details: 'Self-attention mechanisms allowed efficient learning of long-range dependencies and scaling of compute and data.'
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    period: '2020s',
    summary: 'Combining retrieval with generation to ground models in external knowledge.',
    details: 'RAG workflows improve factuality by providing context from search or databases to generative models.'
  },
  {
    id: 'agents',
    title: 'AI Agents',
    period: '2020s',
    summary: 'Autonomous agents combine planning, tools, and language models to perform complex tasks.',
    details: 'Agents orchestrate model calls, tool use, and environment interactions to accomplish goals.'
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Systems',
    period: '2020s–present',
    summary: 'Multiple agents collaborate or compete to solve problems and scale capabilities.',
    details: 'Research explores coordination, emergent behaviour, and task decomposition among agents.'
  }
]
