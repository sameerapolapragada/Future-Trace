import type { BlogArticle } from '../types'

const article: BlogArticle = {
  slug: 'bias-detection-mitigation',
  title: 'Bias Detection & Mitigation in AI Workflows',
  excerpt:
    'Practical steps teams can take to catch skewed training data, proxy variables, and uneven automation impacts across job families.',
  publishedAt: '2026-04-12',
  readMinutes: 5,
  body: [
    'Bias often enters through historical data, ambiguous labels, and uneven adoption of automation across teams.',
    'Regular audits, disaggregated metrics, and diverse review panels reduce the chance that AI systems reinforce existing inequities.',
    'Workers should monitor whether AI tools disproportionately automate tasks in their function — a signal that reskilling priorities may shift quickly.',
  ],
  published: true,
}

export default article
