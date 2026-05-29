import type { BlogArticle } from '../types'

const article: BlogArticle = {
  slug: 'human-oversight-control',
  title: 'Human Oversight & Control in Autonomous Workflows',
  excerpt:
    'Design patterns for keeping people in the loop when agents orchestrate multi-step business and career-critical processes.',
  publishedAt: '2026-03-30',
  readMinutes: 4,
  body: [
    'Full autonomy is rarely appropriate for high-stakes decisions. Effective systems define clear handoff points where humans approve, override, or escalate.',
    'Human-in-the-loop design includes role-based permissions, activity logs, and kill switches when agent behavior drifts from policy.',
    'As workflows become more autonomous, oversight skills — auditing agent traces and interpreting uncertainty — become valuable career capabilities.',
  ],
  published: true,
}

export default article
