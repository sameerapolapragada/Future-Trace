export type TimelineDotColor = 'grey' | 'blue' | 'purple'

export type TimelineDisplayItem = {
  id: string
  period: string
  era: string
  title: string
  description: string
  dotColor: TimelineDotColor
}

export const timelineDisplayItems: TimelineDisplayItem[] = [
  {
    id: 'rule-based',
    period: '1950-1970',
    era: 'Foundation',
    title: 'Rule-Based Systems',
    description: 'Early AI systems using explicit if-then rules and symbolic logic.',
    dotColor: 'grey',
  },
  {
    id: 'expert-systems',
    period: '1970-1990',
    era: 'Commercial AI',
    title: 'Expert Systems',
    description: 'AI systems capturing domain expertise in specific fields.',
    dotColor: 'blue',
  },
  {
    id: 'machine-learning',
    period: '1980-2000',
    era: 'Paradigm Shift',
    title: 'Machine Learning',
    description: 'Systems that learn patterns from data instead of explicit programming.',
    dotColor: 'purple',
  },
  {
    id: 'neural-networks',
    period: '1986-2006',
    era: 'Architecture',
    title: 'Neural Networks',
    description:
      'Brain-inspired models with interconnected nodes learning hierarchical patterns.',
    dotColor: 'blue',
  },
  {
    id: 'deep-learning',
    period: '2012-Present',
    era: 'Revolution',
    title: 'Deep Learning',
    description: 'Multi-layered neural networks achieving superhuman performance.',
    dotColor: 'blue',
  },
  {
    id: 'transformers',
    period: '2017-Present',
    era: 'Foundation',
    title: 'Transformers',
    description: 'Attention-based architecture revolutionizing language understanding.',
    dotColor: 'blue',
  },
  {
    id: 'generative-ai',
    period: '2022-Present',
    era: 'Creative AI',
    title: 'Generative AI',
    description: 'AI systems creating novel content across text, images, video, and code.',
    dotColor: 'purple',
  },
  {
    id: 'rag',
    period: '2023-Present',
    era: 'Hybrid Systems',
    title: 'RAG',
    description: 'Combining language models with real-time knowledge retrieval.',
    dotColor: 'blue',
  },
  {
    id: 'ai-agents',
    period: '2023-Present',
    era: 'Autonomous AI',
    title: 'AI Agents',
    description: 'Autonomous systems that plan, use tools, and execute multi-step tasks.',
    dotColor: 'purple',
  },
  {
    id: 'multi-agent',
    period: '2024-Present',
    era: 'Collaborative AI',
    title: 'Multi-Agent Systems',
    description: 'Multiple AI agents collaborating to solve complex problems.',
    dotColor: 'grey',
  },
]
