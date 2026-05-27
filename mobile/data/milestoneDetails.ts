export type MilestoneDetail = {
  id: string
  impactBadge: string
  impactLevel?: 'foundational' | 'high' | 'transformative' | 'revolutionary'
  period: string
  periodColor?: string
  title: string
  era: string
  summary: string
  tagTheme?: 'amber' | 'orange'
  whyChanged: {
    title: string
    subtitle: string
    points: { label: string; heading: string; body: string; color: string }[]
  }
  beforeAfter: {
    before: string[]
    after: string[]
  }
  technicalBreakthrough: string
  keyTechnologies: string[]
  realWorldExamples: { title: string; description: string }[]
  industries: string[]
  lookingForward: string
  whatCameNext: { title: string; body: string; color: string }[]
  nextMilestone?: { period: string; title: string; id: string }
}

export const milestoneDetails: Record<string, MilestoneDetail> = {
  'rule-based': {
    id: 'rule-based',
    impactBadge: 'FOUNDATIONAL IMPACT',
    impactLevel: 'foundational',
    period: '1956-1970',
    title: 'Rule-Based Systems',
    era: 'Foundation',
    summary: 'Early AI systems using explicit if-then rules and symbolic logic.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Computers began to reason using human-readable logic instead of only performing calculations.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'AI shifted from pure mathematics to practical applications and knowledge representation.',
          color: '#38BDF8',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Interpretability made rule-based AI attractive for medical diagnosis, legal reasoning, and planning.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Computers only calculated',
        'No logical reasoning',
        'Pure number crunching',
        'No decision-making ability',
      ],
      after: [
        'Symbolic reasoning systems',
        'Logic-based decisions',
        'Knowledge representation',
        'Expert-level problem solving',
      ],
    },
    technicalBreakthrough:
      'Symbolic reasoning, predicate logic, and inference engines let machines manipulate structured knowledge and draw conclusions from explicit rules.',
    keyTechnologies: [
      'Predicate Logic',
      'Inference Engines',
      'Knowledge Bases',
      'Rule-Based Systems',
      'Symbolic Reasoning',
    ],
    realWorldExamples: [
      {
        title: 'Logic Theorist',
        description: 'First AI program to prove mathematical theorems',
      },
      {
        title: 'General Problem Solver',
        description: 'Early reasoning system for problem-solving',
      },
      {
        title: 'SHRDLU',
        description: 'Natural language understanding in blocks world',
      },
      {
        title: 'DENDRAL',
        description: 'Chemical analysis expert system',
      },
    ],
    industries: ['Academia', 'Mathematics', 'Logic Research'],
    lookingForward:
      'Laid groundwork for expert systems and demonstrated both the power and limitations of hand-coded knowledge.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Rule-based systems evolved into expert systems that could encode domain knowledge at scale.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Early systems were isolated with no ability to communicate or share knowledge.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Knowledge was modularized and encoded into reusable rule sets for specific domains.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Large rule bases became difficult to maintain, test, and keep consistent over time.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Transparency was a strength, but brittleness limited reliability in open-world settings.',
      },
    ],
    nextMilestone: {
      period: '1970-1990',
      title: 'Expert Systems',
      id: 'expert-systems',
    },
  },
  'expert-systems': {
    id: 'expert-systems',
    impactBadge: 'HIGH IMPACT',
    impactLevel: 'high',
    period: '1970-1990',
    periodColor: '#22D3EE',
    title: 'Expert Systems',
    era: 'Commercial AI',
    summary: 'AI systems capturing domain expertise in specific fields.',
    tagTheme: 'orange',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Systems like MYCIN and XCON proved AI could match human experts in narrow, high-value domains.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'AI shifted from academic curiosity to a billion-dollar commercial industry with real deployments.',
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Measurable ROI, capturing knowledge from retiring experts, and 24/7 scalable expertise drove enterprise adoption.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Rule-based prototypes only',
        'Academic curiosity',
        'Limited commercial value',
        'Knowledge locked in experts',
      ],
      after: [
        'Billion-dollar AI industry',
        'Commercial deployment',
        'Scalable expertise',
        'Measurable business ROI',
      ],
    },
    technicalBreakthrough:
      'Knowledge bases combined with inference engines, separating domain knowledge from reasoning mechanisms.',
    keyTechnologies: [
      'Knowledge Engineering',
      'Inference Rules',
      'Forward Chaining',
      'Backward Chaining',
      'Expert Knowledge Capture',
    ],
    realWorldExamples: [
      {
        title: 'MYCIN',
        description: 'Medical diagnosis for blood infections',
      },
      {
        title: 'XCON',
        description: "DEC's computer configuration system",
      },
      {
        title: 'PROSPECTOR',
        description: 'Geological exploration advisor',
      },
      {
        title: 'DENDRAL',
        description: 'Chemical structure analysis',
      },
    ],
    industries: ['Healthcare', 'Finance', 'Manufacturing', 'Diagnostics'],
    lookingForward:
      'Showed scalability limits of hand-coded knowledge, driving the need for learning-based approaches.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Expert systems proved AI could handle real business functions, but maintenance costs and brittleness limited scale.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Expert systems were silos that could not easily share knowledge across domains or organizations.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Incompatible inference engines and knowledge formats prevented true interoperable AI ecosystems.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Liability and accountability became critical when expert systems made high-stakes mistakes like wrong diagnoses.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Transparency of expert systems set a gold standard for explainability compared to later black-box models.',
      },
    ],
    nextMilestone: {
      period: '1980-2000',
      title: 'Machine Learning',
      id: 'machine-learning',
    },
  },
  'machine-learning': {
    id: 'machine-learning',
    impactBadge: 'TRANSFORMATIVE IMPACT',
    impactLevel: 'transformative',
    period: '1980-2000',
    periodColor: '#46A2FF',
    title: 'Machine Learning',
    era: 'Paradigm Shift',
    summary: 'Systems that learn patterns from data instead of explicit programming.',
    tagTheme: 'orange',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Machine learning freed AI from knowledge engineering bottlenecks by automatically discovering patterns from examples.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'AI shifted from symbolic reasoning to statistical learning, where weak methods with lots of data outperformed handcrafted knowledge.',
          color: '#38BDF8',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'ML scaled where expert systems failed, improving automatically with more data and handling messy real-world information.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Hand-coded rules',
        'Manual knowledge engineering',
        'Brittle expert systems',
        'Expensive to update',
      ],
      after: [
        'Data-driven learning',
        'Automatic pattern discovery',
        'Scalable with data',
        'Self-improving systems',
      ],
    },
    technicalBreakthrough:
      'Decision trees, support vector machines, and statistical learning theory replaced manual rule creation.',
    keyTechnologies: [
      'Decision Trees',
      'Support Vector Machines',
      'Random Forests',
      'Gradient Boosting',
      'Statistical Learning Theory',
    ],
    realWorldExamples: [
      {
        title: 'Spam Filters',
        description: "Gmail's ML-based email classification",
      },
      {
        title: 'Netflix Recommendations',
        description: 'Collaborative filtering for content',
      },
      {
        title: 'Credit Scoring',
        description: 'Automated loan approval systems',
      },
      {
        title: 'Fraud Detection',
        description: 'Banking transaction monitoring',
      },
    ],
    industries: ['Email Filtering', 'Banking', 'Recommendation Systems', 'Robotics'],
    lookingForward:
      'Enabled AI to tackle problems too complex for human experts to explicitly codify.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'ML systems could improve from experience, but still required significant human oversight and retraining.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Ensemble models emerged, but systems still lacked dynamic real-time collaboration across tasks.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Frameworks like scikit-learn and TensorFlow standardized how teams built and deployed models.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Algorithmic bias and discrimination from skewed training data raised urgent regulatory questions.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'The shift from interpretable rules to statistical patterns created a growing transparency crisis.',
      },
    ],
    nextMilestone: {
      period: '1986-2006',
      title: 'Neural Networks',
      id: 'neural-networks',
    },
  },
  'neural-networks': {
    id: 'neural-networks',
    impactBadge: 'HIGH IMPACT',
    impactLevel: 'high',
    period: '1986-2006',
    periodColor: '#22D3EE',
    title: 'Neural Networks',
    era: 'Architecture',
    summary:
      'Brain-inspired models with interconnected nodes learning hierarchical patterns.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Backpropagation enabled training multi-layer networks, eliminating the need for manual feature engineering.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Brain-inspired architectures could learn complex non-linear patterns that traditional algorithms struggled with.',
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Could handle high-dimensional data like images and speech where manual feature design was impractical.',
          color: '#46A2FF',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Manual feature engineering',
        'Shallow learning models',
        'Limited pattern complexity',
        'Human-designed features',
      ],
      after: [
        'Automatic feature learning',
        'Hierarchical representations',
        'Complex pattern recognition',
        'End-to-end learning',
      ],
    },
    technicalBreakthrough:
      'Backpropagation algorithm enabled training multi-layer networks, though limited by compute and data.',
    keyTechnologies: [
      'Backpropagation',
      'Multi-Layer Perceptrons',
      'Activation Functions',
      'Gradient Descent',
      'Artificial Neurons',
    ],
    realWorldExamples: [
      {
        title: 'Handwriting Recognition',
        description: 'Check reading and postal automation',
      },
      {
        title: 'Speech Recognition',
        description: 'Early voice-to-text systems',
      },
      {
        title: 'Character Recognition',
        description: 'OCR technology',
      },
      {
        title: 'Pattern Classification',
        description: 'Industrial quality control',
      },
    ],
    industries: ['Pattern Recognition', 'Speech Processing', 'Computer Vision'],
    lookingForward:
      'Foundation for deep learning revolution once sufficient compute and data became available.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Neural networks could learn complex patterns but were too unstable and compute-hungry for production business systems in the 1990s—promising but impractical for autonomous operations.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Network architectures remained isolated—each trained separately. No framework existed for neural networks to share learned representations or coordinate on joint tasks.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'The mathematical universality of neural networks hinted they could someday handle any task, but computational limits meant specialized algorithms still outperformed general networks.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: "Neural networks' black box nature raised early concerns about accountability, but limited real-world deployment meant these remained theoretical rather than urgent policy questions.",
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Researchers recognized the interpretability problem early but lacked tools to visualize or explain what hidden layers learned, setting up the explainable AI challenges we face at scale today.',
      },
    ],
    nextMilestone: {
      period: '2012-Present',
      title: 'Deep Learning',
      id: 'deep-learning',
    },
  },
  'deep-learning': {
    id: 'deep-learning',
    impactBadge: 'REVOLUTIONARY IMPACT',
    impactLevel: 'revolutionary',
    period: '2012-Present',
    periodColor: '#46A2FF',
    title: 'Deep Learning',
    era: 'Revolution',
    summary: 'Multi-layered neural networks achieving superhuman performance.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: "AlexNet's 2012 ImageNet victory proved deep neural networks could outperform hand-crafted features, sparking the modern AI revolution.",
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Triggered the modern AI boom—every major tech company pivoted to deep learning, investing billions in GPU infrastructure and talent.',
          color: '#38BDF8',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Delivered measurable ROI in speech recognition, self-driving cars, and medical diagnosis—transforming AI from academic curiosity to boardroom priority.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Limited neural networks',
        'Compute bottlenecks',
        'Sub-human performance',
        'Academic curiosity',
      ],
      after: [
        'Deep multi-layer networks',
        'GPU acceleration',
        'Superhuman accuracy',
        'Production deployment',
      ],
    },
    technicalBreakthrough:
      'GPU acceleration, massive datasets, and architectural innovations like CNNs and RNNs enabled training networks with millions of parameters.',
    keyTechnologies: [
      'Convolutional Neural Networks',
      'Recurrent Neural Networks',
      'GPU Computing',
      'Batch Normalization',
      'Dropout Regularization',
    ],
    realWorldExamples: [
      {
        title: 'AlexNet',
        description: 'ImageNet breakthrough in 2012',
      },
      {
        title: 'Google Photos',
        description: 'Automated image tagging and search',
      },
      {
        title: 'Tesla Autopilot',
        description: 'Computer vision for self-driving',
      },
      {
        title: 'DeepMind AlphaGo',
        description: 'Superhuman game playing',
      },
    ],
    industries: [
      'Image Recognition',
      'Autonomous Vehicles',
      'Voice Assistants',
      'Medical Imaging',
    ],
    lookingForward:
      'Demonstrated that scale (data + compute + parameters) drives capability, setting stage for foundation models.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Deep learning enabled autonomous vehicles, factories, and warehouses—showing AI could operate critical physical infrastructure 24/7 with superhuman consistency and minimal supervision.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Transfer learning emerged—networks trained on one task could share learned features with others, enabling the first real knowledge sharing between AI systems at scale.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Pre-trained models became commodities—download a state-of-the-art vision model, fine-tune it for your task, plug it into your pipeline. The AI ecosystem was born.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Facial recognition, deepfakes, and autonomous weapons showed deep learning could be weaponized. Governments struggled to regulate technology evolving faster than policy could adapt.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Adversarial examples revealed deep networks were fragile—tiny pixel changes could fool them completely. This sparked research into robust, verifiable AI systems we can trust in critical applications.',
      },
    ],
    nextMilestone: {
      period: '2017-Present',
      title: 'Transformers',
      id: 'transformers',
    },
  },
  transformers: {
    id: 'transformers',
    impactBadge: 'REVOLUTIONARY IMPACT',
    impactLevel: 'revolutionary',
    period: '2017-Present',
    periodColor: '#46A2FF',
    title: 'Transformers',
    era: 'Foundation',
    summary: 'Attention-based architecture revolutionizing language understanding.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: "The 'Attention Is All You Need' paper showed you could ditch recurrence entirely. Transformers processed entire sequences in parallel, trained 10-100x faster than LSTMs, and scaled to billions of parameters—something RNNs could never achieve.",
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Made foundation models possible. Before transformers, language models topped out at millions of parameters. After, we went from BERT (110M) to GPT-3 (175B) to models with trillions of parameters. Transformers became the universal architecture for not just language, but vision, audio, and multimodal AI.',
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Researchers flocked to transformers because they were easier to train (no vanishing gradients), more parallelizable (faster on GPUs), and more effective (captured long-range dependencies better). Companies adopted them because they could finally build models that understood context at human-like depth.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Sequential RNN processing',
        'Slow training times',
        'Limited to millions of parameters',
        'Vanishing gradient problems',
      ],
      after: [
        'Parallel attention mechanisms',
        '10-100x faster training',
        'Billions of parameters',
        'Foundation model revolution',
      ],
    },
    technicalBreakthrough:
      'Self-attention mechanism replaced recurrence, enabling parallel training and capturing long-range dependencies.',
    keyTechnologies: [
      'Self-Attention',
      'Multi-Head Attention',
      'Positional Encoding',
      'Layer Normalization',
      'Scaled Dot-Product Attention',
    ],
    realWorldExamples: [
      {
        title: 'GPT Series',
        description: "OpenAI's language generation models",
      },
      {
        title: 'BERT',
        description: "Google's bidirectional language understanding",
      },
      {
        title: 'Google Translate',
        description: 'Neural machine translation',
      },
      {
        title: 'GitHub Copilot',
        description: 'AI-powered code completion',
      },
    ],
    industries: ['NLP', 'Translation', 'Code Generation', 'Search'],
    lookingForward:
      'Became the architecture powering GPT, BERT, and all modern large language models.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Transformers enabled the language understanding necessary for AI to comprehend business context, make strategic decisions from documents, and communicate across organizational boundaries.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Natural language became the universal interface—allowing different AI systems to collaborate through shared understanding rather than hard-coded protocols.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Foundation models built on transformers can now be fine-tuned for any workflow, creating a common substrate for specialized AI tools to interoperate.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: "Massive parameter counts made these models opaque black boxes, raising questions about bias, fairness, and the ability to audit trillion-parameter decisions.",
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Research into attention visualization, prompt engineering, and model interpretability aims to make transformer-based systems more transparent and controllable despite their complexity.',
      },
    ],
    nextMilestone: {
      period: '2022-Present',
      title: 'Generative AI',
      id: 'generative-ai',
    },
  },
  'generative-ai': {
    id: 'generative-ai',
    impactBadge: 'TRANSFORMATIVE IMPACT',
    impactLevel: 'transformative',
    period: '2022-Present',
    periodColor: '#46A2FF',
    title: 'Generative AI',
    era: 'Creative AI',
    summary: 'AI systems creating novel content across text, images, video, and code.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'ChatGPT showed that AI could be genuinely useful to everyone, not just specialists. A billion people could now ask an AI for help in plain language. Midjourney and Stable Diffusion let anyone generate professional-quality images from text descriptions.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: "Shifted AI from 'predict' to 'create.' Instead of categorizing existing content, AI now generates novel text, images, code, music, and video. This sparked both unprecedented excitement (productivity gains, creative tools) and concern (misinformation, job displacement, copyright).",
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Viral adoption happened because the UX was magical—natural language input, instant creative output. Companies adopted generative AI to automate writing, design, coding, and customer service. The technology went from research labs to production in months, not years.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'AI predicted and classified',
        'Analysis-only tools',
        'Experts-only interfaces',
        'Narrow use cases',
      ],
      after: [
        'AI creates and generates',
        'Creative partner',
        'Natural language for everyone',
        'Universal productivity tool',
      ],
    },
    technicalBreakthrough:
      'Large-scale pre-training on internet data, followed by fine-tuning and RLHF for human preference alignment.',
    keyTechnologies: [
      'Large Language Models',
      'Diffusion Models',
      'RLHF Alignment',
      'Prompt Engineering',
      'Fine-Tuning',
    ],
    realWorldExamples: [
      {
        title: 'ChatGPT',
        description: 'Conversational AI for everyone',
      },
      {
        title: 'Midjourney',
        description: 'Text-to-image generation',
      },
      {
        title: 'Stable Diffusion',
        description: 'Open-source image synthesis',
      },
      {
        title: 'GitHub Copilot',
        description: 'AI pair programmer',
      },
      {
        title: 'Jasper AI',
        description: 'Marketing content generation',
      },
    ],
    industries: ['Marketing', 'Design', 'Entertainment', 'Education', 'Software Development'],
    lookingForward:
      'Shifted AI from analysis tool to creative partner, raising questions about creativity and authenticity.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Generative AI enables companies to automate entire creative workflows—from market research to content production to A/B testing—with minimal human intervention.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Imagine one AI generating code while another AI reviews it, a third tests it, and a fourth writes documentation—all collaborating through generated artifacts.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Generative models can produce outputs in any format (text, code, images, video), making them universal translators between different workflow tools and systems.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Copyright disputes, deepfakes, misinformation, and job displacement—generative AI forces society to rethink ownership, authenticity, and the nature of creative work.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Watermarking, provenance tracking, and human-in-the-loop validation systems aim to ensure generated content is identifiable, attributable, and aligned with human values.',
      },
    ],
    nextMilestone: {
      period: '2023-Present',
      title: 'RAG (Retrieval-Augmented Generation)',
      id: 'rag',
    },
  },
  rag: {
    id: 'rag',
    impactBadge: 'HIGH IMPACT',
    impactLevel: 'high',
    period: '2023-Present',
    periodColor: '#22D3EE',
    title: 'RAG (Retrieval-Augmented Generation)',
    era: 'Hybrid Systems',
    summary: 'Combining language models with real-time knowledge retrieval.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'RAG fixed the two biggest LLM problems—hallucinations and knowledge cutoffs—by letting models search external databases and cite real sources at inference time.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Bridged the gap between impressive foundation models and production-ready systems. Companies could deploy AI on proprietary data without expensive fine-tuning or retraining.',
          color: '#38BDF8',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Enterprise adoption exploded because RAG delivered accuracy with verifiable citations—critical for legal, medical, customer support, and internal knowledge applications.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'LLMs hallucinated facts',
        'Knowledge cutoff dates',
        'No source citations',
        'Unreliable for enterprise',
      ],
      after: [
        'Grounded in real sources',
        'Real-time knowledge access',
        'Verifiable citations',
        'Enterprise-ready accuracy',
      ],
    },
    technicalBreakthrough:
      'Vector databases and semantic search integrated with LLMs, enabling dynamic context injection at inference time.',
    keyTechnologies: [
      'Vector Databases',
      'Semantic Search',
      'Embedding Models',
      'Context Injection',
      'Document Retrieval',
    ],
    realWorldExamples: [
      {
        title: 'Perplexity AI',
        description: 'Search with source citations',
      },
      {
        title: 'Notion AI',
        description: 'Knowledge base integration',
      },
      {
        title: 'Glean',
        description: 'Enterprise search with LLMs',
      },
      {
        title: 'You.com',
        description: 'AI search with references',
      },
    ],
    industries: ['Customer Support', 'Research', 'Legal Tech', 'Enterprise Search'],
    lookingForward:
      'Standard architecture for production AI applications requiring accuracy and up-to-date information.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'RAG enables AI systems to operate on company knowledge bases without retraining—making enterprise AI that stays current with business changes and can answer with verifiable sources.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Imagine multiple specialized AI agents sharing access to a common RAG knowledge layer—each querying and contributing to organizational memory, creating collective AI intelligence.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'RAG separates knowledge from reasoning, so you can swap knowledge bases or language models independently—mix-and-match architectures become possible across workflow tools.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'Who owns the retrieved knowledge? How do you audit what the AI accessed? RAG makes AI decisions more traceable but raises new questions about data access and intellectual property.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Source citations and retrieval transparency make RAG inherently more auditable than pure generation—you can verify claims, trace reasoning, and update knowledge without retraining.',
      },
    ],
    nextMilestone: {
      period: '2023-Present',
      title: 'AI Agents',
      id: 'ai-agents',
    },
  },
  'ai-agents': {
    id: 'ai-agents',
    impactBadge: 'TRANSFORMATIVE IMPACT',
    impactLevel: 'transformative',
    period: '2023-Present',
    periodColor: '#46A2FF',
    title: 'AI Agents',
    era: 'Autonomous AI',
    summary: 'Autonomous systems that plan, use tools, and execute multi-step tasks.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Function calling let LLMs escape the chat box. Agents could browse the web, write code, query databases, and call APIs automatically—moving from assistant to operator.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Enabled autonomous workflows. Instead of humans prompting step-by-step, agents can decompose goals, plan sequences, use tools, and self-correct errors via loops.',
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Organizations wanted to automate entire workflows, not just one response. Developers adopted agents to reduce repetitive work and gain large productivity boosts.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Passive Q&A chatbots',
        'Manual task orchestration',
        'No tool use',
        'Human-in-the-loop required',
      ],
      after: [
        'Autonomous task execution',
        'Self-planning workflows',
        'Tool-using agents',
        'End-to-end automation',
      ],
    },
    technicalBreakthrough:
      'Function calling, chain-of-thought style reasoning loops, and tool APIs enabled LLMs to interact with external systems.',
    keyTechnologies: [
      'Function Calling',
      'Chain-of-Thought',
      'ReAct Framework',
      'Tool Use APIs',
      'Self-Reflection',
    ],
    realWorldExamples: [
      {
        title: 'ChatGPT Plugins',
        description: 'LLM with internet and tool access',
      },
      {
        title: 'AutoGPT',
        description: 'Autonomous goal-driven agent',
      },
      {
        title: 'LangChain Agents',
        description: 'Framework for building AI agents',
      },
      {
        title: 'Adept ACT-1',
        description: 'AI agents for computer tasks',
      },
    ],
    industries: ['Software Development', 'Data Analysis', 'Workflow Automation', 'Research'],
    lookingForward:
      'Pathway to AI systems that can handle complex, open-ended tasks with minimal human intervention.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'AI agents could run entire business processes inside clear guardrails, handling procurement, HR workflows, and support operations with limited supervision.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Single agents hit complexity limits; teams of specialized agents emerged where each one handles part of a problem and coordinates through shared memory.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Agent marketplaces allow companies to combine pre-built specialist agents for accounting, legal review, and operations into custom pipelines.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: 'When an agent makes an unauthorized API call or expensive mistake, responsibility and auditability become critical enterprise requirements.',
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Sandboxing, approval gates, and human override mechanisms keep autonomous agents safe enough for production systems.',
      },
    ],
    nextMilestone: {
      period: '2024-Present',
      title: 'Multi-Agent Systems',
      id: 'multi-agent',
    },
  },
  'multi-agent': {
    id: 'multi-agent',
    impactBadge: 'EMERGING IMPACT',
    impactLevel: 'high',
    period: '2024-Present',
    periodColor: '#22D3EE',
    title: 'Multi-Agent Systems',
    era: 'Collaborative AI',
    summary: 'Multiple AI agents collaborating to solve complex problems.',
    whyChanged: {
      title: 'Why This Changed AI',
      subtitle: 'HISTORICAL SIGNIFICANCE',
      points: [
        {
          label: 'THE BREAKTHROUGH',
          heading: 'THE BREAKTHROUGH',
          body: 'Single AI agents hit capability ceilings on complex tasks. Multi-agent systems break work into specialized subtasks, with each agent focusing on what it does best.',
          color: '#3B82F6',
        },
        {
          label: 'HOW IT CHANGED EVERYTHING',
          heading: 'HOW IT CHANGED EVERYTHING',
          body: 'Moved AI from monolithic models to collaborative ecosystems. Instead of one superintelligent agent, teams can coordinate, verify each other, and iterate toward better outcomes.',
          color: '#60A5FA',
        },
        {
          label: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          heading: 'WHY RESEARCHERS & COMPANIES ADOPTED IT',
          body: 'Multi-agent systems are modular, easier to interpret, and simpler to improve incrementally by upgrading one specialist agent at a time.',
          color: '#60A5FA',
        },
      ],
    },
    beforeAfter: {
      before: [
        'Single AI systems',
        'Isolated workflows',
        'Limited collaboration',
        'Difficult orchestration',
      ],
      after: [
        'Collaborative AI agents',
        'Autonomous coordination',
        'Scalable workflows',
        'Specialized AI teams',
      ],
    },
    technicalBreakthrough:
      'Agent orchestration frameworks, inter-agent communication protocols, and role-based specialization.',
    keyTechnologies: [
      'Agent Orchestration',
      'Tool Calling',
      'Planning Systems',
      'Memory Layers',
      'Multi-Agent Communication',
      'Workflow Routing',
    ],
    realWorldExamples: [
      {
        title: 'AutoGen',
        description: 'Microsoft multi-agent conversation framework',
      },
      {
        title: 'CrewAI',
        description: 'Role-based AI agent teams for complex tasks',
      },
      {
        title: 'Devin',
        description: 'Autonomous AI software engineer',
      },
      {
        title: 'OpenAI Swarm',
        description: 'Lightweight multi-agent orchestration',
      },
      {
        title: 'Enterprise AI Copilots',
        description: 'Custom agent systems for business workflows',
      },
    ],
    industries: ['Software Engineering', 'Scientific Research', 'Business Operations', 'Healthcare'],
    lookingForward:
      'Could enable AI systems to match and exceed human organizational capabilities in knowledge work.',
    whatCameNext: [
      {
        title: 'Autonomous Enterprises',
        color: '#22D3EE',
        body: 'Companies run entire departments with coordinated AI agent teams, making strategic decisions and executing operations with minimal human oversight.',
      },
      {
        title: 'AI-to-AI Collaboration',
        color: '#60A5FA',
        body: 'Agent ecosystems where specialized AIs negotiate, delegate, and collaborate at scale—an AI economy where agents hire other agents to complete projects.',
      },
      {
        title: 'Workflow Ecosystems',
        color: '#60A5FA',
        body: 'Plug-and-play marketplaces let teams assemble custom AI agents for any task, with agents and tools integrating seamlessly.',
      },
      {
        title: 'Governance Challenges',
        color: '#46A2FF',
        body: "When a multi-agent system makes a mistake, accountability and built-in guardrails become the defining governance question.",
      },
      {
        title: 'Trustworthy AI Systems',
        color: '#18BEE6',
        body: 'Verifiable agent credentials, transparent decision trails, and inter-agent verification help prevent cascading failures in high-stakes systems.',
      },
    ],
  },
}

export function getMilestoneDetail(id: string): MilestoneDetail | null {
  return milestoneDetails[id] ?? null
}
