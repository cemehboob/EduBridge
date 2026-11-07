import {
  UserProfile,
  Unit,
  MockTest,
  AcademicTopic,
  OllamaModelInfo,
  CareerRoadmap,
  ResumeData,
  CertificateItem,
  ChildProgress,
  CourseAssignment,
  QuestionBankItem,
  SystemMetric,
  AuditLog,
  DailyTask,
  RevisionItem
} from '../types';
import { multiExamMockTests } from './multiExamMockTestsData';
import { shuffleOptions, shuffleIndexedOptions } from '../utils/questionShuffler';

export const initialProfile: UserProfile = {
  id: 'user_edubridge_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@edubridge.org',
  role: 'student',
  currentStreak: 14,
  highestStreak: 21,
  xp: 3420,
  level: 8,
  league: 'Ruby',
  hearts: 5,
  maxHearts: 5,
  dailyGoalXp: 100,
  todayXp: 45,
  targetExam: 'IELTS Academic',
  targetExamDate: '2026-11-20',
  targetBand: '8.0 Band',
  targetCareer: 'AI & Machine Learning Engineer',
  joinedDate: 'August 2026',
  preferredLanguage: 'Academic English (IELTS Band 8.0)'
};

export const ollamaModels: OllamaModelInfo[] = [
  {
    id: 'phi-4-mini',
    name: 'Phi-4 Mini (3.8B)',
    tagline: 'Ultra-fast grammar, phonetic verification & flashcards',
    specialty: 'Grammar analysis, syntax correction, rapid vocabulary drills',
    vram: '2.4 GB',
    status: 'online',
    latencyMs: 38,
    temperature: 0.3
  },
  {
    id: 'qwen-3-8b',
    name: 'Qwen 3 (8B Instruct)',
    tagline: 'Primary pedagogical tutor & multimodal dialogue',
    specialty: 'Interactive Socratic tutoring, concept analogies, essay coaching',
    vram: '5.6 GB',
    status: 'online',
    latencyMs: 74,
    temperature: 0.6
  },
  {
    id: 'deepseek-8b',
    name: 'DeepSeek R1 (8B Reasoner)',
    tagline: 'Rigorous chain-of-thought proofs & algorithmic logic',
    specialty: 'Calculus, mathematical step-by-step proofs, code analysis',
    vram: '5.8 GB',
    status: 'online',
    latencyMs: 86,
    temperature: 0.2
  },
  {
    id: 'llama-3.3-8b',
    name: 'Llama 3.3 (8B Versatile)',
    tagline: 'Career navigation, ATS resume tuning & industry roadmaps',
    specialty: 'Freelance rate benchmarks, portfolio feedback, interview prep',
    vram: '5.4 GB',
    status: 'online',
    latencyMs: 68,
    temperature: 0.7
  }
];

export const initialUnits: Unit[] = [
  {
    id: 'unit_1',
    unitNumber: 1,
    title: 'Foundations & Social Greetings',
    description: 'Master core greetings, polite introductions, and foundational phonetics.',
    color: 'from-emerald-600 to-teal-700',
    icon: 'Sparkles',
    locked: false,
    lessons: [
      {
        id: 'lesson_1_1',
        title: 'Essential Greetings & Courtesy',
        description: 'Learn Buenos días, Mucho gusto, and polite inquiries.',
        xpReward: 20,
        completed: true,
        score: 100,
        exercises: [
          {
            id: 'ex_1',
            type: 'flashcard',
            prompt: 'What does "Mucho gusto" mean in English?',
            targetWord: 'Mucho gusto',
            phonetic: '[ˈmu.tʃo ˈɣus.to]',
            translation: 'Nice to meet you / Pleased to meet you',
            options: ['Nice to meet you', 'Goodbye forever', 'Where is the library', 'Good night'],
            correctAnswer: 'Nice to meet you',
            explanation: '"Mucho gusto" is the most common polite way to express pleasure upon being introduced.',
            audioText: 'Mucho gusto en conocerte'
          },
          {
            id: 'ex_2',
            type: 'listening',
            prompt: 'Listen to the audio clip and select the correct greeting:',
            audioText: 'Buenos días, ¿cómo está usted hoy?',
            options: [
              'Good morning, how are you today?',
              'Good evening, what time is it?',
              'See you tomorrow morning',
              'Thank you very much, sir'
            ],
            correctAnswer: 'Good morning, how are you today?',
            explanation: '"Buenos días" means good morning, and "¿cómo está usted hoy?" is formal for how are you today.'
          },
          {
            id: 'ex_3',
            type: 'speaking',
            prompt: 'Say this sentence out loud with accurate pronunciation:',
            targetWord: 'Es un placer aprender contigo',
            phonetic: '[es un plaˈseɾ apɾenˈdeɾ konˈti.ɣo]',
            translation: 'It is a pleasure to learn with you',
            correctAnswer: 'Es un placer aprender contigo',
            explanation: 'Focus on clean vowels: e, u, a, e, o. Do not turn final "e" into a diphthong.',
            audioText: 'Es un placer aprender contigo'
          },
          {
            id: 'ex_4',
            type: 'grammar-fill',
            prompt: 'Complete the sentence with the correct conjugation of ser:',
            contextSentence: 'Ella _____ una profesora muy dedicada.',
            options: ['es', 'son', 'somos', 'eres'],
            correctAnswer: 'es',
            explanation: 'The third person singular of ser (present tense) is "es".'
          }
        ]
      },
      {
        id: 'lesson_1_2',
        title: 'Asking For Directions & Inquiries',
        description: 'Navigate public transit, train stations, and asking "¿Dónde está?".',
        xpReward: 25,
        completed: true,
        score: 95,
        exercises: [
          {
            id: 'ex_5',
            type: 'multiple-choice',
            prompt: 'How do you ask "Where is the central station?" in Spanish?',
            options: [
              '¿Dónde está la estación central?',
              '¿Cuándo llega el tren?',
              '¿Cuánto cuesta este billete?',
              '¿Por qué está cerrada la puerta?'
            ],
            correctAnswer: '¿Dónde está la estación central?',
            explanation: '"¿Dónde está...?" is used for specific physical locations.'
          },
          {
            id: 'ex_6',
            type: 'dialogue',
            prompt: 'Respond politely to: "Perdón, ¿la biblioteca queda cerca de aquí?"',
            options: [
              'Sí, camine dos cuadras derecho y gire a la izquierda.',
              'No me gustan los libros.',
              'Ayer fui a dormir temprano.',
              'El tren sale a las tres.'
            ],
            correctAnswer: 'Sí, camine dos cuadras derecho y gire a la izquierda.',
            explanation: 'This gives a coherent navigational direction in formal polite speech.'
          }
        ]
      },
      {
        id: 'lesson_1_3',
        title: 'Ordering Food & Local Cafés',
        description: 'Handle café interactions, dietary preferences, and billing.',
        xpReward: 30,
        completed: false,
        exercises: [
          {
            id: 'ex_7',
            type: 'flashcard',
            prompt: 'Translate the café order expression: "Quisiera un café con leche"',
            targetWord: 'Quisiera un café con leche',
            phonetic: '[kiˈsje.ɾa un kaˈfe kon ˈle.tʃe]',
            translation: 'I would like a coffee with milk',
            options: ['I would like a coffee with milk', 'I don’t want milk', 'Where is the milk?', 'Please give me cold tea'],
            correctAnswer: 'I would like a coffee with milk',
            explanation: '"Quisiera" is polite conditional subjunctive used for ordering courteously.',
            audioText: 'Quisiera un café con leche, por favor.'
          },
          {
            id: 'ex_8',
            type: 'speaking',
            prompt: 'Practice requesting the check politely:',
            targetWord: 'La cuenta, por favor',
            phonetic: '[la ˈkwen.ta poɾ faˈβoɾ]',
            translation: 'The check, please',
            correctAnswer: 'La cuenta, por favor',
            explanation: 'Universal standard phrase in restaurants across the Hispanic world.',
            audioText: 'La cuenta, por favor.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit_2',
    unitNumber: 2,
    title: 'Daily Schedules & Time Logistics',
    description: 'Express schedules, daily routines, habits and reflexive verbs.',
    color: 'from-blue-600 to-indigo-700',
    icon: 'Clock',
    locked: false,
    lessons: [
      {
        id: 'lesson_2_1',
        title: 'Telling Time & Meeting Schedules',
        description: 'Understand "Son las tres y media" and calendar events.',
        xpReward: 25,
        completed: false,
        exercises: [
          {
            id: 'ex_9',
            type: 'multiple-choice',
            prompt: 'What time is "Son las cuatro menos cuarto"?',
            options: ['3:45', '4:15', '4:45', '3:15'],
            correctAnswer: '3:45',
            explanation: 'Literally "It is four minus a quarter", which corresponds to 3:45.'
          }
        ]
      },
      {
        id: 'lesson_2_2',
        title: 'Reflexive Verbs & Morning Habits',
        description: 'Use despertarse, levantarse, and prepararse correctly.',
        xpReward: 30,
        completed: false,
        exercises: [
          {
            id: 'ex_10',
            type: 'grammar-fill',
            prompt: 'Fill in the blank: "Todos los días yo _____ temprano."',
            contextSentence: 'Todos los días yo _____ (levantarse) temprano.',
            options: ['me levanto', 'se levanta', 'nos levantamos', 'te levantas'],
            correctAnswer: 'me levanto',
            explanation: 'Reflexive first-person singular requires the pronoun "me" and the "o" verb ending.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit_3',
    unitNumber: 3,
    title: 'Academic Discourse & Argumentation',
    description: 'Structure academic essays, thesis statements, and debate opinions.',
    color: 'from-violet-600 to-purple-800',
    icon: 'GraduationCap',
    locked: false,
    lessons: [
      {
        id: 'lesson_3_1',
        title: 'Discourse Markers & Connectors',
        description: 'Learn sin embargo, por consiguiente, and en cambio.',
        xpReward: 35,
        completed: false,
        exercises: [
          {
            id: 'ex_11',
            type: 'multiple-choice',
            prompt: 'Which connector means "Consequently / Therefore"?',
            options: ['Por consiguiente', 'Sin embargo', 'A pesar de que', 'En lugar de'],
            correctAnswer: 'Por consiguiente',
            explanation: '"Por consiguiente" denotes logical result or deduction in formal prose.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit_4',
    unitNumber: 4,
    title: 'Professional Collaboration & Workplace',
    description: 'Negotiate project scopes, deliverables, and enterprise communication.',
    color: 'from-amber-600 to-orange-700',
    icon: 'Briefcase',
    locked: true,
    lessons: []
  }
];

export const mockTests: MockTest[] = multiExamMockTests.map((test) => ({
  ...test,
  questions: test.questions.map((q) => ({
    ...q,
    options: q.options ? shuffleOptions(q.options, q.correctAnswer) : undefined
  }))
}));

const rawAcademicTopics: AcademicTopic[] = [
  {
    id: 'math_calc_01',
    subject: 'Mathematics',
    subCategory: 'Calculus',
    title: 'Derivatives & Gradient Optimization',
    level: 'Intermediate',
    masteryPercent: 78,
    keyConcepts: [
      'Instantaneous Rate of Change',
      'The Power & Chain Rules',
      'Gradient Descent in Machine Learning',
      'Local vs. Global Extrema'
    ],
    summary: 'The derivative quantifies how a function changes as its input changes. In multidimensional vector spaces, the gradient vector points in the direction of steepest ascent, forming the cornerstone of neural network backpropagation.',
    formulaOrSnippet: `f'(x) = lim_{h -> 0} (f(x+h) - f(x)) / h\n∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]^T`,
    practiceProblem: {
      question: 'Find the derivative of f(x) = 3x^3 - 5x^2 + 7x - 12 at x = 2.',
      options: ['23', '27', '31', '19'],
      correctIndex: 0,
      stepByStepSolution: [
        'Apply the power rule d/dx [x^n] = n * x^(n-1).',
        'f\'(x) = d/dx [3x^3] - d/dx [5x^2] + d/dx [7x] - d/dx [12].',
        'f\'(x) = 9x^2 - 10x + 7.',
        'Substitute x = 2: 9(2)^2 - 10(2) + 7 = 9(4) - 20 + 7 = 36 - 20 + 7 = 23.'
      ]
    }
  },
  {
    id: 'math_stat_02',
    subject: 'Mathematics',
    subCategory: 'Statistics',
    title: 'Bayesian Inference & Conditional Probability',
    level: 'Mastery',
    masteryPercent: 65,
    keyConcepts: [
      'Prior Probability P(A)',
      'Likelihood P(B|A)',
      'Marginal Evidence P(B)',
      'Posterior Probability P(A|B)'
    ],
    summary: 'Bayes theorem provides a mathematical formula for updating our beliefs in light of new incoming empirical evidence, transforming subjective uncertainty into rigorous probabilistic reasoning.',
    formulaOrSnippet: `P(A|B) = [ P(B|A) * P(A) ] / P(B)`,
    practiceProblem: {
      question: 'If a rare disease has a prevalence of 1% (P(D)=0.01), a diagnostic test is 95% accurate (True Positive=0.95), and false positive rate is 5%, what is the posterior probability P(D|Positive)?',
      options: ['16.1%', '95.0%', '50.0%', '82.4%'],
      correctIndex: 0,
      stepByStepSolution: [
        'Calculate numerator: P(Positive|D) * P(D) = 0.95 * 0.01 = 0.0095.',
        'Calculate total P(Positive) = P(Positive|D)*P(D) + P(Positive|No D)*P(No D) = 0.0095 + (0.05 * 0.99) = 0.0095 + 0.0495 = 0.0590.',
        'Divide: 0.0095 / 0.0590 ≈ 0.1610 (16.1%).',
        'Even with a 95% accurate test, rarity of the condition means most positives are false positives.'
      ]
    }
  },
  {
    id: 'sci_phys_01',
    subject: 'Science',
    subCategory: 'Physics',
    title: 'Special Relativity & Time Dilation',
    level: 'Intermediate',
    masteryPercent: 82,
    keyConcepts: [
      'Invariance of the Speed of Light (c)',
      'Lorentz Factor (γ)',
      'Proper Time vs. Observer Time',
      'Muon Atmospheric Decay Verification'
    ],
    summary: 'Because the speed of light in vacuum is identical for all inertial observers, time itself must elapse at different rates depending on relative velocity between coordinate frames.',
    formulaOrSnippet: `Δt' = γ * Δt_0  where γ = 1 / sqrt(1 - v^2/c^2)`,
    practiceProblem: {
      question: 'A spacecraft travels at 0.8c relative to Earth. For an observer on Earth, how much time passes when 6 hours elapse on the spaceship clock?',
      options: ['10 hours', '7.5 hours', '4.8 hours', '12 hours'],
      correctIndex: 0,
      stepByStepSolution: [
        'Calculate gamma: γ = 1 / sqrt(1 - (0.8)^2) = 1 / sqrt(1 - 0.64) = 1 / sqrt(0.36) = 1 / 0.6 = 1.6667.',
        'Earth time Δt = γ * Δt_0 = (5/3) * 6 hours = 10 hours.',
        'Thus, 10 hours pass on Earth while only 6 hours tick on the moving ship.'
      ]
    }
  },
  {
    id: 'tech_prog_01',
    subject: 'Technology',
    subCategory: 'Programming',
    title: 'Event Loop & Asynchronous JavaScript Concurrency',
    level: 'Mastery',
    masteryPercent: 92,
    keyConcepts: [
      'Call Stack & Web APIs',
      'Microtask Queue (Promises, queueMicrotask)',
      'Macrotask Queue (setTimeout, setImmediate, I/O)',
      'Render Queue & Frame Budgeting'
    ],
    summary: 'JavaScript executes on a single-threaded runtime backed by a non-blocking event loop. Understanding the precedence of microtasks over macrotasks prevents UI thread starvation and memory leaks.',
    formulaOrSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2`,
    practiceProblem: {
      question: 'In what exact sequence will the logs execute in the snippet above?',
      options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 3, 4, 2', '1, 4, 2, 3'],
      correctIndex: 0,
      stepByStepSolution: [
        'Synchronous code runs first: "1" then "4" are printed immediately.',
        'Microtask queue is emptied before any macrotask: Promise.then callback prints "3".',
        'Finally, macrotask queue executes setTimeout callback which prints "2".',
        'Final order: 1, 4, 3, 2.'
      ]
    }
  },
  {
    id: 'tech_ai_02',
    subject: 'Technology',
    subCategory: 'AI & Machine Learning',
    title: 'Transformer Architecture & Self-Attention',
    level: 'Mastery',
    masteryPercent: 70,
    keyConcepts: [
      'Scaled Dot-Product Attention',
      'Multi-Head Attention Projections',
      'Rotary Positional Embeddings (RoPE)',
      'KV Caching in Inference'
    ],
    summary: 'The Transformer mechanism calculates attention weights across all tokens in parallel, enabling language models to capture long-range contextual relationships far surpassing legacy RNNs.',
    formulaOrSnippet: `Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V`,
    practiceProblem: {
      question: 'Why do we scale the dot-product of Query and Key vectors by sqrt(d_k)?',
      options: [
        'To prevent softmax gradients from vanishing due to extremely large magnitudes',
        'To reduce matrix memory footprint',
        'To enforce orthogonality between tokens',
        'To eliminate negative eigenvalue components'
      ],
      correctIndex: 0,
      stepByStepSolution: [
        'For large projection dimensions d_k, the dot products grow large in magnitude.',
        'This pushes the softmax function into regions where it has extremely small gradients (vanishing gradient problem).',
        'Dividing by sqrt(d_k) stabilizes the variance around 1, ensuring healthy backpropagation gradients.'
      ]
    }
  }
];

export const academicTopics: AcademicTopic[] = rawAcademicTopics.map((topic) => {
  const shuffled = shuffleIndexedOptions(topic.practiceProblem.options, topic.practiceProblem.correctIndex);
  return {
    ...topic,
    practiceProblem: {
      ...topic.practiceProblem,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex
    }
  };
});

export const careerRoadmaps: CareerRoadmap[] = [
  {
    id: 'cr_ai_engineer',
    title: 'AI & Machine Learning Systems Architect',
    roleCategory: 'Engineering & Intelligence',
    avgSalary: '$145,000 / yr',
    freelanceRate: '$85 – $150 / hr',
    demandGrowth: '+38% YoY',
    overview: 'Design, fine-tune, and deploy self-hosted open-source language models (Ollama, vLLM, DeepSeek), build agentic orchestration pipelines, and construct scalable vector retrieval systems.',
    milestones: [
      {
        stage: 'Foundations of Mathematics & Linear Algebra',
        skills: ['Matrix Decomposition', 'Multivariable Calculus', 'Probability Distributions'],
        targetProject: 'Construct a neural network from scratch using NumPy with manual backpropagation',
        completed: true
      },
      {
        stage: 'Transformer Mechanics & LLM Fine-Tuning',
        skills: ['LoRA / QLoRA', 'HuggingFace Transformers', 'KV-Caching', 'vLLM Serving'],
        targetProject: 'Fine-tune an 8B open model on domain-specific medical/legal QA datasets',
        completed: true
      },
      {
        stage: 'Agentic Workflows & Enterprise RAG',
        skills: ['LangChain / LlamaIndex', 'Hybrid Search (Dense + BM25)', 'Function Calling', 'Ollama Deployments'],
        targetProject: 'Deploy an offline-first enterprise multi-agent documentation assistant',
        completed: false
      },
      {
        stage: 'Production Optimization & High-Throughput Inference',
        skills: ['Triton Server', 'Model Quantization (GGUF, AWQ)', 'Prometheus Telemetry'],
        targetProject: 'Scale a multi-node cluster serving 100 concurrent requests with p95 < 200ms',
        completed: false
      }
    ],
    certifications: [
      'EduBridge Certified AI Systems Engineer (ECASE-01)',
      'Open-Source LLM Deployment Specialist',
      'Enterprise Vector Retrieval Architect'
    ]
  },
  {
    id: 'cr_fullstack_dev',
    title: 'Full-Stack Modern Web & Cloud Architect',
    roleCategory: 'Software Engineering',
    avgSalary: '$125,000 / yr',
    freelanceRate: '$70 – $130 / hr',
    demandGrowth: '+24% YoY',
    overview: 'Build high-performance full-stack web applications combining React, TypeScript, NestJS, PostgreSQL 17, Redis caching, and Docker Compose deployments.',
    milestones: [
      {
        stage: 'TypeScript Mastery & Frontend Architecture',
        skills: ['React 19', 'Zustand State', 'Tailwind CSS', 'PWA Offline Sync'],
        targetProject: 'Build an offline-first real-time collaborative canvas and task management suite',
        completed: true
      },
      {
        stage: 'Scalable NestJS Monolith & Relational DBs',
        skills: ['NestJS', 'PostgreSQL 17', 'Prisma / Drizzle ORM', 'Redis Cache Invalidation'],
        targetProject: 'Architect an enterprise RBAC API with rate-limiting, audit logs, and JWT auth',
        completed: false
      },
      {
        stage: 'DevOps, Docker & Observability',
        skills: ['Docker Compose', 'NGINX Reverse Proxy', 'Prometheus', 'Grafana Dashboards'],
        targetProject: 'Deploy a self-hosted high-availability stack with zero-downtime updates',
        completed: false
      }
    ],
    certifications: [
      'EduBridge Certified Full-Stack Architect',
      'PostgreSQL Performance & Database Tuning',
      'Production Docker & Container Security'
    ]
  },
  {
    id: 'cr_oet_nurse',
    title: 'Global Healthcare Practitioner (OET / IELTS Nurse)',
    roleCategory: 'Healthcare & Clinical Practice',
    avgSalary: '$92,000 / yr (UK/US/AUS)',
    freelanceRate: '$55 – $95 / hr',
    demandGrowth: '+31% YoY',
    overview: 'Prepare international nurses and medical staff for overseas practice through rigorous OET/IELTS medical communication, clinical dialogue, and patient advocacy documentation.',
    milestones: [
      {
        stage: 'Clinical Vocabulary & Patient Communication',
        skills: ['OET Speaking Roleplay', 'Empathetic Phrasing', 'Medical Terminology'],
        targetProject: 'Pass 10 simulated high-pressure emergency department patient intake scenarios',
        completed: true
      },
      {
        stage: 'Medical Referral Letter Writing',
        skills: ['Discharge Summaries', 'Referral Formats', 'Grammar Precision'],
        targetProject: 'Complete 15 verified medical referral essays with AI band feedback >= B grade',
        completed: false
      }
    ],
    certifications: [
      'OET Grade B+ Clinical Readiness Certificate',
      'International Healthcare Communication Credential'
    ]
  }
];

export const initialResume: ResumeData = {
  fullName: 'Alex Rivera',
  headline: 'Full-Stack & Applied AI Engineer | Top 5% EduBridge Scholar',
  summary: 'Motivated technologist and multilingual learner specializing in high-performance web systems and open-source AI infrastructure. Demonstrated expertise in TypeScript, React, PostgreSQL, and Ollama model deployment with a 14-day study streak and verified mastery certifications.',
  skills: [
    'TypeScript',
    'React 19',
    'NestJS',
    'PostgreSQL 17',
    'Redis',
    'Docker & Docker Compose',
    'Ollama & Open-Source LLMs',
    'Calculus & Applied Statistics',
    'IELTS Academic 8.0 Level English',
    'Conversational Spanish (B2)'
  ],
  experiences: [
    {
      role: 'Junior Software Engineer Intern',
      company: 'OmniVenture Tech Labs',
      period: 'Jan 2026 – Present',
      achievements: [
        'Built full-stack micro-dashboard reducing page load latency by 42% using Redis caching.',
        'Integrated local Ollama inference service for automatic semantic tagging of customer tickets.',
        'Collaborated with senior architects on Dockerized microservices and automated CI/CD.'
      ]
    },
    {
      role: 'Undergraduate Research Assistant',
      company: 'Computational Intelligence Institute',
      period: 'Sep 2025 – Dec 2025',
      achievements: [
        'Assisted in data curation and validation for DeepSeek reasoning benchmarks in physics.',
        'Implemented interactive mathematical visualization widgets for classroom instruction.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.S. in Computer Science & Applied Mathematics',
      institution: 'State Polytechnic Institute',
      year: '2023 – 2027 (Expected)'
    }
  ],
  verifiedCertificates: [
    {
      title: 'EduBridge Certified AI Systems Engineer (Foundation)',
      issuer: 'EduBridge Open-Source Institute',
      issuedDate: 'October 2026',
      credentialId: 'EDU-AI-88392-VERIFIED'
    },
    {
      title: 'Advanced Calculus & Optimization for Machine Learning',
      issuer: 'EduBridge Academic Directorate',
      issuedDate: 'September 2026',
      credentialId: 'EDU-MTH-44910-VERIFIED'
    }
  ]
};

export const sampleCertificates: CertificateItem[] = [
  {
    id: 'cert_1',
    title: 'EduBridge Certified AI Systems Engineer (Foundation)',
    recipientName: 'Alex Rivera',
    issueDate: 'October 15, 2026',
    credentialId: 'EDU-AI-88392-VERIFIED',
    skillsDemonstrated: [
      'Ollama Model Integration',
      'Transformer Architecture & Attention',
      'Prompt Engineering & Socratic Systems',
      'Vector Databases & Semantic Retrieval'
    ],
    gradeScore: '98% (Honors Distinction)',
    verificationHash: '0x7f9a1b4c92e8d3110fa983cc4b6702e1b8c6f'
  },
  {
    id: 'cert_2',
    title: 'Advanced Calculus & Optimization for Machine Learning',
    recipientName: 'Alex Rivera',
    issueDate: 'September 28, 2026',
    credentialId: 'EDU-MTH-44910-VERIFIED',
    skillsDemonstrated: [
      'Gradient Descent & Backprop',
      'Multivariate Derivatives',
      'Matrix Decomposition',
      'Bayesian Probability'
    ],
    gradeScore: '94% (Distinction)',
    verificationHash: '0x3c2e1189ab04f981dc90b334aaef0919241ba'
  }
];

export const sampleChildProgress: ChildProgress = {
  childName: 'Alex Rivera',
  weeklyHours: 18.5,
  weeklyTargetHours: 20.0,
  xpEarnedThisWeek: 840,
  currentStreakDays: 14,
  strengths: [
    'Outstanding consistency in Language Unit 1 (100% accuracy)',
    'High engagement in Calculus gradient descent practice',
    'Active daily interaction with AI Mentor Bridge'
  ],
  areasNeedingSupport: [
    'IELTS Reading inference under tight time constraints (needs 3 more timed sets)',
    'Bayesian statistics word problem formulation'
  ],
  recentActivities: [
    { timestamp: 'Today, 08:30 AM', activity: 'Completed Spanish Dialogue Simulation', result: '+35 XP (Perfect)' },
    { timestamp: 'Yesterday, 07:15 PM', activity: 'IELTS Academic Reading Test #104', result: 'Band 7.5 Predicted' },
    { timestamp: 'Yesterday, 04:00 PM', activity: 'DeepSeek Math Problem Solving session', result: 'Mastery 78%' }
  ],
  parentAdvice: 'Alex is showing great dedication to Spanish and AI engineering! Consider scheduling 20 minutes on Friday for untimed Bayesian statistics review to reinforce confidence.'
};

export const sampleAssignments: CourseAssignment[] = [
  {
    id: 'asg_1',
    title: 'IELTS Task 2 Academic Essay: AI in Higher Education',
    subject: 'Exam Prep (IELTS)',
    dueDate: '2026-11-05',
    totalStudents: 32,
    submittedCount: 28,
    avgScore: 7.2,
    status: 'Active'
  },
  {
    id: 'asg_2',
    title: 'Calculus Optimization Problem Set #4: Gradient Descent',
    subject: 'Mathematics',
    dueDate: '2026-11-08',
    totalStudents: 32,
    submittedCount: 19,
    avgScore: 84.5,
    status: 'Active'
  },
  {
    id: 'asg_3',
    title: 'Spanish Unit 1 Speaking Dialogue: Ordering in a Café',
    subject: 'Language Learning',
    dueDate: '2026-10-30',
    totalStudents: 32,
    submittedCount: 32,
    avgScore: 92.0,
    status: 'Graded'
  }
];

export const sampleQuestionBank: QuestionBankItem[] = [
  {
    id: 'qb_1',
    question: 'How does scaled dot-product attention prevent vanishing gradients in transformers?',
    subject: 'Technology (AI)',
    difficulty: 'Hard',
    type: 'Multiple Choice',
    tags: ['Transformer', 'Attention', 'Deep Learning']
  },
  {
    id: 'qb_2',
    question: 'Write an IELTS Task 2 conclusion synthesizing both perspectives without introducing new evidence.',
    subject: 'Exam Prep (IELTS)',
    difficulty: 'Medium',
    type: 'Essay',
    tags: ['Writing', 'Cohesion', 'Band 8']
  },
  {
    id: 'qb_3',
    question: 'Pronounce the Spanish phrase "Mucho gusto en conocerte" with native rhythm and stress.',
    subject: 'Language Learning',
    difficulty: 'Easy',
    type: 'Oral',
    tags: ['Spanish', 'Speaking', 'Phonetics']
  },
  {
    id: 'qb_4',
    question: 'Solve for local extrema of f(x) = 2x^3 - 9x^2 + 12x + 1.',
    subject: 'Mathematics',
    difficulty: 'Medium',
    type: 'Multiple Choice',
    tags: ['Calculus', 'Derivatives', 'Optimization']
  }
];

export const systemMetrics: SystemMetric[] = [
  { name: 'Ollama Cluster Latency', value: '62 ms (avg)', change: '-12% p95', status: 'optimal' },
  { name: 'Self-Hosted Inference VRAM', value: '18.4 / 24.0 GB', change: '76% allocated', status: 'healthy' },
  { name: 'PostgreSQL 17 Connection Pool', value: '42 / 200 conns', change: 'Normal', status: 'optimal' },
  { name: 'Redis Cache Hit Ratio', value: '94.8%', change: '+3.2%', status: 'optimal' },
  { name: 'MinIO Object Storage', value: '14.2 GB used', change: '4.8 GB audio/PDFs', status: 'healthy' },
  { name: 'Meilisearch Query P99', value: '4.2 ms', change: 'Instantaneous', status: 'optimal' }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-31 04:30:12',
    user: 'alex.rivera@edubridge.org',
    action: 'AI_INFERENCE_REQUEST: DeepSeek 8B Reasoner on Calculus derivatives',
    category: 'AI_INFERENCE',
    status: 'SUCCESS'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-31 04:15:40',
    user: 'system_cron',
    action: 'SPACED_REPETITION_QUEUE_RECALC: Ebbinghaus curve adjusted for 142 items',
    category: 'DATABASE_SYNC',
    status: 'INFO'
  },
  {
    id: 'log_03',
    timestamp: '2026-10-31 03:52:19',
    user: 'teacher_martinez@edubridge.org',
    action: 'QUESTION_BANK_CREATE: Added 4 IELTS academic writing rubric checks',
    category: 'EXAM_EVAL',
    status: 'SUCCESS'
  },
  {
    id: 'log_04',
    timestamp: '2026-10-31 02:10:04',
    user: 'admin@edubridge.org',
    action: 'OLLAMA_MODEL_RELOAD: Qwen 3 8B context window expanded to 16k tokens',
    category: 'AI_INFERENCE',
    status: 'SUCCESS'
  }
];

export const initialDailyTasks: DailyTask[] = [
  {
    id: 'task_1',
    timeSlot: '08:00 AM - 08:30 AM',
    title: 'Spanish Unit 1 Flashcard & Speaking Workout',
    module: 'Language',
    durationMin: 30,
    completed: true,
    priority: 'High'
  },
  {
    id: 'task_2',
    timeSlot: '11:00 AM - 11:45 AM',
    title: 'IELTS Academic Timed Reading Passage #104',
    module: 'Exam Prep',
    durationMin: 45,
    completed: false,
    priority: 'High'
  },
  {
    id: 'task_3',
    timeSlot: '02:00 PM - 02:45 PM',
    title: 'Calculus Derivative Rules with DeepSeek 8B Step-by-Step',
    module: 'Academic',
    durationMin: 45,
    completed: false,
    priority: 'Medium'
  },
  {
    id: 'task_4',
    timeSlot: '05:30 PM - 06:00 PM',
    title: 'Update AI Portfolio & Certifications for Upwork Profile',
    module: 'Career',
    durationMin: 30,
    completed: false,
    priority: 'Normal'
  }
];

export const initialRevisions: RevisionItem[] = [
  {
    id: 'rev_1',
    concept: 'Spanish Reflexive Pronouns (me, te, se, nos)',
    subject: 'Language',
    retentionScore: 92,
    intervalStage: '7-Day',
    dueDate: 'Today',
    isOverdue: false
  },
  {
    id: 'rev_2',
    concept: 'IELTS Task 2 Complex Linking Phrases (Notwithstanding, Insofar as)',
    subject: 'Exam Prep',
    retentionScore: 68,
    intervalStage: '3-Day',
    dueDate: 'Today',
    isOverdue: true
  },
  {
    id: 'rev_3',
    concept: 'Chain Rule for Multivariable Composite Functions',
    subject: 'Mathematics',
    retentionScore: 84,
    intervalStage: '14-Day',
    dueDate: 'In 2 days',
    isOverdue: false
  },
  {
    id: 'rev_4',
    concept: 'Transformer Self-Attention Scaling Factor (sqrt(d_k))',
    subject: 'Technology',
    retentionScore: 88,
    intervalStage: '30-Day',
    dueDate: 'In 5 days',
    isOverdue: false
  }
];
