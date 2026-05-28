export type IndustryCard = {
  id: string
  name: string
  earlyAIUse: string
  currentAIUse: string
  agenticAIFuture: string
  mainRisks: string[]
  mainOpportunity: string
}

export const industries: IndustryCard[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    earlyAIUse: 'Expert systems and diagnostic rule engines supported clinical decision-making.',
    currentAIUse: 'Medical imaging, diagnostic assistance, operational optimization, and patient triage.',
    agenticAIFuture: 'Autonomous agents coordinating patient flows, personalized treatment plans, and continuous monitoring.',
    mainRisks: ['Data privacy and consent', 'Bias in diagnostic models', 'Regulatory gaps'],
    mainOpportunity: 'Improve diagnostic accuracy, reduce time-to-treatment, and expand access to care.'
  },
  {
    id: 'finance',
    name: 'Finance',
    earlyAIUse: 'Rule-based trading strategies and fraud detection using heuristics.',
    currentAIUse: 'Algorithmic trading, credit scoring, risk modeling, and anti-money laundering systems.',
    agenticAIFuture: 'Autonomous portfolio managers, real-time risk agents, and automated compliance assistants.',
    mainRisks: ['Market manipulation', 'Model opacity', 'Systemic risks'],
    mainOpportunity: 'Faster, more accurate risk assessments and personalized financial services.'
  },
  {
    id: 'crm-sales',
    name: 'CRM / Sales',
    earlyAIUse: 'Rule-driven lead scoring and email templates to support sales workflows.',
    currentAIUse: 'Predictive lead scoring, personalized outreach, and conversational assistants.',
    agenticAIFuture: 'Sales copilots autonomously handling outreach, negotiation support, and pipeline management.',
    mainRisks: ['Automation fatigue', 'over-personalization privacy concerns'],
    mainOpportunity: 'Scale personalized selling and increase conversion through intelligent automation.'
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    earlyAIUse: 'Interactive voice response (IVR) systems and scripted chatbots for FAQs.',
    currentAIUse: 'AI chatbots, sentiment analysis, and intelligent routing to human agents.',
    agenticAIFuture: 'Autonomous support agents resolving end-to-end tickets and coordinating with backend systems.',
    mainRisks: ['Poor handling of complex cases', 'customer frustration'],
    mainOpportunity: 'Reduce resolution time and free human agents for higher-value interactions.'
  },
  {
    id: 'education',
    name: 'Education',
    earlyAIUse: 'Adaptive tutoring prototypes and rule-based intelligent tutoring systems.',
    currentAIUse: 'Personalized learning paths, automated grading, and tutoring assistants.',
    agenticAIFuture: 'Personal learning agents that craft curricula, mentor students, and monitor progress.',
    mainRisks: ['Equity and access', 'over-reliance on automated feedback'],
    mainOpportunity: 'Personalized, scalable education and continual skill development.'
  },
  {
    id: 'legal',
    name: 'Legal',
    earlyAIUse: 'Document search and rule-based contract analysis tools.',
    currentAIUse: 'Contract review, legal research assistants, and document automation.',
    agenticAIFuture: 'Autonomous agents preparing briefs, managing discovery, and assisting compliance workflows.',
    mainRisks: ['Misinterpretation of law', 'liability and compliance concerns'],
    mainOpportunity: 'Faster, cheaper legal services and improved access to legal help.'
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    earlyAIUse: 'Code templates and static analysis tools assisting developers.',
    currentAIUse: 'AI pair programmers, code completion, and automated testing assistants.',
    agenticAIFuture: 'Autonomous engineering agents that design modules, generate tests, and maintain CI/CD pipelines.',
    mainRisks: ['Automation of complex design decisions', 'security of generated code'],
    mainOpportunity: 'Higher developer productivity and faster iteration cycles.'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    earlyAIUse: 'Rule-based segmentation and basic campaign automation.',
    currentAIUse: 'Content generation, audience targeting, and campaign optimization using ML.',
    agenticAIFuture: 'Autonomous marketing agents running experiments, optimizing spend, and generating tailored content in real time.',
    mainRisks: ['Misinformation from generated content', 'brand safety issues'],
    mainOpportunity: 'Scale creative production and personalize customer experiences at massive scale.'
  }
]
