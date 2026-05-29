import type { BlogArticle } from './types'
import biasDetectionMitigation from './posts/bias-detection-mitigation'
import explainabilityTransparency from './posts/explainability-transparency'
import humanOversightControl from './posts/human-oversight-control'
import privacyDataGovernance from './posts/privacy-data-governance'
import smarterVsTrustworthyAi from './posts/smarter-vs-trustworthy-ai'

/**
 * Add new posts incrementally:
 * 1. Copy data/blog/posts/_template.ts → data/blog/posts/your-slug.ts
 * 2. Fill in content (keep published: false while drafting)
 * 3. Import the file below and append it to blogPostRegistry
 * 4. Set published: true when ready to ship
 */
export const blogPostRegistry: BlogArticle[] = [
  smarterVsTrustworthyAi,
  privacyDataGovernance,
  explainabilityTransparency,
  biasDetectionMitigation,
  humanOversightControl,
]
