import type { Milestone } from '@/data/timeline'
import type { Ionicons } from '@expo/vector-icons'

export const TIMELINE_FILTERS = [
  'All',
  'Rule-Based AI',
  'Machine Learning',
  'Deep Learning',
  'Transformers',
  'Generative AI',
  'RAG',
  'AI Agents',
  'Multi-Agent Systems',
] as const

export type TimelineFilter = (typeof TIMELINE_FILTERS)[number]

export function matchesTimelineFilter(m: Milestone, filter: TimelineFilter): boolean {
  if (filter === 'All') return true
  const f = filter.toLowerCase()
  const cat = m.technologyCategory.toLowerCase()
  if (f === 'rule-based ai') return cat.includes('rule') || cat.includes('symbol') || cat.includes('expert')
  if (f === 'machine learning') return cat.includes('ml') || cat.includes('stat')
  if (f === 'deep learning') return cat.includes('deep')
  if (f === 'transformers') return cat.includes('transform')
  if (f === 'generative ai') return cat.includes('generat') || cat.includes('foundation') || cat.includes('llm')
  if (f === 'rag') return cat.includes('retriev') || cat.includes('rag')
  if (f === 'ai agents') return cat.includes('agent') || cat.includes('agentic')
  if (f === 'multi-agent systems') return cat.includes('multi')
  return true
}

export function matchesTimelineQuery(m: Milestone, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (m.year.toLowerCase().includes(q)) return true
  if (m.title.toLowerCase().includes(q)) return true
  if (m.technologyCategory.toLowerCase().includes(q)) return true
  if (m.industriesImpacted.some((i) => i.toLowerCase().includes(q))) return true
  if (m.jobsAffected.some((j) => j.toLowerCase().includes(q))) return true
  return false
}

export function timelineCategoryIcon(category: string): keyof typeof Ionicons.glyphMap {
  const c = category.toLowerCase()
  if (c.includes('rule') || c.includes('symbol') || c.includes('expert') || c.includes('conceptual')) {
    return 'hardware-chip-outline'
  }
  if (c.includes('stat') || c.includes('ml')) return 'pulse-outline'
  if (c.includes('deep') || c.includes('neural')) return 'git-network-outline'
  if (c.includes('transform') || c.includes('architecture') || c.includes('foundation')) {
    return 'layers-outline'
  }
  if (c.includes('generat') || c.includes('llm')) return 'document-text-outline'
  if (c.includes('retriev') || c.includes('rag')) return 'server-outline'
  if (c.includes('agentic') || c.includes('agent') || c.includes('workflow')) {
    return 'flash-outline'
  }
  if (c.includes('multi')) return 'people-outline'
  return 'hardware-chip-outline'
}
