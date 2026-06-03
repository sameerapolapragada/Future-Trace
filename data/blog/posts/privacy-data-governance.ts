import type { BlogArticle } from '../types'

const article: BlogArticle = {
  slug: 'privacy-data-governance',
  title: 'Privacy & Data Governance in the Agentic Era',
  excerpt:
    'How consent, retention, and access controls must evolve when AI agents act across tools and datasets on a user’s behalf.',
  publishedAt: '2026-05-08',
  readMinutes: 5,
  body: [
    'Agentic systems amplify data governance risk because they can chain together queries, APIs, and documents faster than traditional workflows.',
    'Minimize stored inputs, define clear retention windows, and document which models and tools may access each data class.',
    'For individuals, understanding what career data you share with AI services — and how long it is kept — is a core part of professional risk management.',
  ],
  published: true,
}

export default article
