export type TimelinePreviewItem = {
  id: string
  era: string
  title: string
  tag: string
  icon:
    | 'symbolic'
    | 'ml'
    | 'transformers'
    | 'generative'
    | 'rag'
    | 'agents'
    | 'workflows'
    | 'future'
}

/** Curated home-grid milestones */
export const timelinePreviewItems: TimelinePreviewItem[] = [
  { id: 'symbolic-ai', era: '1950–60', title: 'Symbolic AI', tag: 'Rule-based', icon: 'symbolic' },
  { id: 'machine-learning', era: '1990–2000', title: 'Machine Learning', tag: 'Statistical ML', icon: 'ml' },
  { id: 'transformers', era: '2017', title: 'Transformers', tag: 'Architecture', icon: 'transformers' },
  { id: 'generative-ai', era: '2022–23', title: 'Generative AI', tag: 'LLMs', icon: 'generative' },
  { id: 'rag-copilots', era: '2023', title: 'RAG & Copilots', tag: 'Retrieval', icon: 'rag' },
  { id: 'ai-agents', era: '2024', title: 'AI Agents', tag: 'Agentic', icon: 'agents' },
  { id: 'agentic-workflows', era: '2025', title: 'Agentic Workflows', tag: 'Orchestration', icon: 'workflows' },
  { id: 'autonomous-systems', era: 'Future', title: 'Autonomous Systems', tag: 'Multi-agent', icon: 'future' },
]
