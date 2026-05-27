export type ScoreJobOption = {
  id: string
  title: string
  defaultIndustry: string
  searchVolume?: string
}

/** Roles people often search when worried about AI replacing their job. */
export const popularPanicJobs: ScoreJobOption[] = [
  { id: 'software-engineer', title: 'Software Engineer', defaultIndustry: 'Technology' },
  { id: 'data-analyst', title: 'Data Analyst', defaultIndustry: 'Technology' },
  { id: 'customer-support', title: 'Customer Support', defaultIndustry: 'Retail' },
  { id: 'graphic-designer', title: 'Graphic Designer', defaultIndustry: 'Media' },
  { id: 'content-writer', title: 'Content Writer', defaultIndustry: 'Media' },
  { id: 'accountant', title: 'Accountant', defaultIndustry: 'Finance' },
  { id: 'marketing-manager', title: 'Marketing Manager', defaultIndustry: 'Marketing' },
  { id: 'salesforce-admin', title: 'Salesforce Admin', defaultIndustry: 'Technology' },
  { id: 'financial-analyst', title: 'Financial Analyst', defaultIndustry: 'Finance' },
  { id: 'ux-designer', title: 'UX Designer', defaultIndustry: 'Technology' },
]

export const mostSearchedToday: ScoreJobOption[] = [
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    defaultIndustry: 'Technology',
    searchVolume: '12.4k searches',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    defaultIndustry: 'Technology',
    searchVolume: '8.2k searches',
  },
  {
    id: 'ux-designer-trending',
    title: 'UX Designer',
    defaultIndustry: 'Technology',
    searchVolume: '6.1k searches',
  },
]

export const allScoreJobOptions: ScoreJobOption[] = [
  ...popularPanicJobs,
  ...mostSearchedToday.filter(
    (job) => !popularPanicJobs.some((popular) => popular.title === job.title)
  ),
]
