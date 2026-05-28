export type Milestone = {
  id: string
  year: string
  title: string
  shortDescription: string
  whyItMattered: string
  industriesImpacted: string[]
  jobsAffected: string[]
  technologyCategory: string
  futureImplication: string
}

export const milestones: Milestone[] = [
  {
    id: 'turing-test',
    year: '1950s',
    title: 'Turing Test',
    shortDescription: 'Alan Turing proposes an operational test for machine intelligence.',
    whyItMattered: 'Framed intelligence as observable behaviour and sparked foundational debate about machine cognition.',
    industriesImpacted: ['Academia', 'Philosophy', 'Early computing'],
    jobsAffected: ['Researchers', 'Philosophers'],
    technologyCategory: 'Conceptual / Foundational',
    futureImplication: 'Set the conceptual baseline for AI research and public expectations.'
  },
  {
    id: 'symbolic-ai',
    year: '1960s',
    title: 'Symbolic AI',
    shortDescription: 'AI based on symbolic reasoning, logic, and knowledge representation.',
    whyItMattered: 'Enabled early demonstrations of reasoning, planning, and problem solving with explicit rules.',
    industriesImpacted: ['Defense', 'Government research', 'Industrial automation'],
    jobsAffected: ['Knowledge engineers', 'Programmers'],
    technologyCategory: 'Rule-based / Symbolic',
    futureImplication: 'Provided tools and languages for encoding expert knowledge and influenced later hybrid approaches.'
  },
  {
    id: 'expert-systems',
    year: '1970s–1980s',
    title: 'Expert Systems',
    shortDescription: 'Production systems that encoded domain expertise (e.g., MYCIN, DENDRAL).',
    whyItMattered: 'Delivered practical business value by automating specialist decision-making in narrow domains.',
    industriesImpacted: ['Healthcare', 'Oil & Gas', 'Finance'],
    jobsAffected: ['Domain experts', 'Consultants'],
    technologyCategory: 'Rule-based / Expert Systems',
    futureImplication: 'Showed commercial viability for AI in enterprises and exposed limits of brittle rule sets.'
  },
  {
    id: 'stat-ml',
    year: '1990s',
    title: 'Statistical Machine Learning',
    shortDescription: 'Shift to data-driven models: SVMs, decision trees, Bayesian methods.',
    whyItMattered: 'Moved focus from handcrafted rules to learning patterns from data, improving generalization.',
    industriesImpacted: ['Finance', 'Retail', 'Telecom'],
    jobsAffected: ['Data analysts', 'Statisticians', 'Software engineers'],
    technologyCategory: 'Statistical / ML',
    futureImplication: 'Laid groundwork for scalable predictive systems and analytics-driven business models.'
  },
  {
    id: 'big-data-nn',
    year: '2000s',
    title: 'Big Data & Neural Networks',
    shortDescription: 'Growing datasets and compute rekindled interest in neural networks and large-scale training.',
    whyItMattered: 'Enabled models to learn richer representations from massive data, improving performance across tasks.',
    industriesImpacted: ['Internet services', 'Advertising', 'E-commerce'],
    jobsAffected: ['Data engineers', 'ML engineers', 'System architects'],
    technologyCategory: 'Neural Networks / Infrastructure',
    futureImplication: 'Prepared the infrastructure and tooling needed for deep learning scale and productionization.'
  },
  {
    id: 'deep-learning-2012',
    year: '2012',
    title: 'Deep Learning Breakthrough',
    shortDescription: 'Deep convolutional networks dramatically improve image recognition (e.g., ImageNet).',
    whyItMattered: 'Demonstrated that deep architectures plus GPUs produce significant real-world performance gains.',
    industriesImpacted: ['Healthcare', 'Automotive', 'Security', 'Media'],
    jobsAffected: ['Researchers', 'Engineers', 'Radiologists (tools)'],
    technologyCategory: 'Deep Learning',
    futureImplication: 'Catalyzed investment and productization of neural models across domains.'
  },
  {
    id: 'transformers-2017',
    year: '2017',
    title: 'Transformers',
    shortDescription: 'Introduction of the Transformer architecture enabling scalable sequence modeling.',
    whyItMattered: 'Self-attention improved handling of long-range dependencies and enabled massive model scaling.',
    industriesImpacted: ['NLP', 'Search', 'AI platforms'],
    jobsAffected: ['NLP engineers', 'Research scientists'],
    technologyCategory: 'Model Architecture',
    futureImplication: 'Became the backbone for large language models and multimodal systems.'
  },
  {
    id: 'pretraining-2020',
    year: '2020',
    title: 'Large-scale Pretraining',
    shortDescription: 'Pretraining on vast corpora produces versatile foundation models.',
    whyItMattered: 'Allowed transfer learning across tasks, reducing need for task-specific datasets.',
    industriesImpacted: ['Technology', 'Media', 'Education'],
    jobsAffected: ['Platform engineers', 'Content creators', 'Teachers (tools)'],
    technologyCategory: 'Foundation Models / Pretraining',
    futureImplication: 'Enabled rapid application development via fine-tuning and prompting.'
  },
  {
    id: 'chatgpt-2022',
    year: '2022',
    title: 'ChatGPT & Generative AI Adoption',
    shortDescription: 'Public-facing generative models accelerate mainstream use and adoption.',
    whyItMattered: 'Greatly expanded public awareness and commercial interest in generative capabilities.',
    industriesImpacted: ['Customer support', 'Marketing', 'Software development'],
    jobsAffected: ['Writers', 'Support agents', 'Developers'],
    technologyCategory: 'Generative AI / LLMs',
    futureImplication: 'Drove fast adoption cycles and the creation of new AI-powered workflows.'
  },
  {
    id: 'rag-2023',
    year: '2023',
    title: 'RAG & Enterprise Copilots',
    shortDescription: 'Combining retrieval with generation to build context-aware copilots for enterprises.',
    whyItMattered: 'Improved factuality and domain relevance of generated output for real-world applications.',
    industriesImpacted: ['Enterprise software', 'Legal', 'Healthcare'],
    jobsAffected: ['Knowledge workers', 'Analysts', 'Legal assistants'],
    technologyCategory: 'Retrieval-Augmented Generation',
    futureImplication: 'Became a standard pattern for grounding models on private data and building safe assistants.'
  },
  {
    id: 'ai-agents-2024',
    year: '2024',
    title: 'AI Agents',
    shortDescription: 'Agents that autonomously plan, call tools, and manage multi-step tasks emerge in production.',
    whyItMattered: 'Shifted AI from single-call assistants to multi-step, autonomous workflows.',
    industriesImpacted: ['Automation', 'Robotics', 'Customer operations'],
    jobsAffected: ['Automation engineers', 'Operations staff', 'Support specialists'],
    technologyCategory: 'Agentic Systems',
    futureImplication: 'Enables higher-level automation and integration with real-world systems and APIs.'
  },
  {
    id: 'agentic-workflows-2025',
    year: '2025',
    title: 'Agentic Workflows',
    shortDescription: 'Workflows composed of specialized agents collaborate to complete complex business processes.',
    whyItMattered: 'Introduced modular, reusable automation blocks that could be orchestrated at scale.',
    industriesImpacted: ['Enterprise IT', 'Supply chain', 'Finance'],
    jobsAffected: ['Process designers', 'Solutions architects', 'IT operators'],
    technologyCategory: 'Workflow Orchestration / Multi-agent',
    futureImplication: 'Paves way for business process transformation and new operator roles focused on agent oversight.'
  },
  {
    id: 'multi-agent-2030-2035',
    year: '2030–2035',
    title: 'Projected Multi-Agent Enterprise Systems',
    shortDescription: 'Large-scale multi-agent systems coordinate across organizations and domains.',
    whyItMattered: 'Expected to enable emergent capabilities, complex coordination, and scalable specialization.',
    industriesImpacted: ['Enterprise systems', 'Logistics', 'Healthcare', 'Smart cities'],
    jobsAffected: ['System integrators', 'AI safety engineers', 'Policy specialists'],
    technologyCategory: 'Multi-Agent Systems / Distributed AI',
    futureImplication: 'Will require governance, safety, and new architectures for reliable multi-agent coordination.'
  }
]

