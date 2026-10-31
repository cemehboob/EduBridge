import { UserAccount, FeatureFlag, UserFeedbackTicket, UserGuideArticle } from '../types';

export const initialUsers: UserAccount[] = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '2004-09-18',
    role: 'student',
    status: 'active',
    createdAt: '2026-08-15',
    lastLoginAt: '2026-10-31 05:15:20',
    preferences: {
      preferredLanguage: 'Spanish',
      dailyGoalXp: 100,
      targetExam: 'IELTS Academic',
      targetExamDate: '2026-11-20',
      targetBand: '8.0 Band',
      targetCareer: 'AI & Machine Learning Engineer',
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'academy',
      educationLevel: 'High School & College Prep (Ages 15–24)',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 14,
      highestStreak: 21,
      xp: 3420,
      level: 8,
      league: 'Ruby',
      hearts: 5,
      maxHearts: 5,
      todayXp: 45
    }
  },
  {
    id: 'usr_student_early',
    name: 'Leo Chen (Age 7)',
    email: 'leo.chen@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '2019-03-12',
    role: 'student',
    status: 'active',
    createdAt: '2026-09-01',
    lastLoginAt: '2026-10-31 04:10:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 50,
      targetExam: 'Primary Phonics & Reading',
      targetBand: 'Star Reader Tier 1',
      targetCareer: 'Astronaut Explorer',
      theme: 'light',
      soundEnabled: true,
      emailNotifications: false,
      ageCohort: 'early',
      educationLevel: 'Early Primary & Phonics (Ages 5–8)',
      fontScale: 'large'
    },
    profileStats: {
      currentStreak: 8,
      highestStreak: 10,
      xp: 1250,
      level: 4,
      league: 'Gold',
      hearts: 5,
      maxHearts: 5,
      todayXp: 50
    }
  },
  {
    id: 'usr_student_junior',
    name: 'Maya Patel (Age 12)',
    email: 'maya.patel@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '2014-06-25',
    role: 'student',
    status: 'active',
    createdAt: '2026-08-20',
    lastLoginAt: '2026-10-31 03:30:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 80,
      targetExam: 'Middle School STEM Olympiad',
      targetBand: 'Gold Division',
      targetCareer: 'Biomedical Scientist',
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'junior',
      educationLevel: 'Elementary & Middle School (Ages 9–14)',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 19,
      highestStreak: 25,
      xp: 4800,
      level: 11,
      league: 'Sapphire',
      hearts: 5,
      maxHearts: 5,
      todayXp: 60
    }
  },
  {
    id: 'usr_student_pro',
    name: 'David Sterling (Executive)',
    email: 'david.sterling@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '1990-08-14',
    role: 'student',
    status: 'active',
    createdAt: '2026-07-05',
    lastLoginAt: '2026-10-30 22:15:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 120,
      targetExam: 'Executive Business Fluency',
      targetBand: 'Senior Leadership Register',
      targetCareer: 'Chief Technology Officer',
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'pro',
      educationLevel: 'Professional & Career Fluency (Ages 25–54)',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 32,
      highestStreak: 45,
      xp: 8900,
      level: 14,
      league: 'Diamond',
      hearts: 5,
      maxHearts: 5,
      todayXp: 80
    }
  },
  {
    id: 'usr_student_senior',
    name: 'Evelyn Vance (Lifelong)',
    email: 'evelyn.vance@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '1954-04-10',
    role: 'student',
    status: 'active',
    createdAt: '2026-06-12',
    lastLoginAt: '2026-10-31 01:20:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 40,
      targetExam: 'Cognitive Reserve & Vitality',
      targetBand: 'Lifelong Wisdom Guild',
      targetCareer: 'Memoir Writer & Historian',
      theme: 'light',
      soundEnabled: true,
      emailNotifications: false,
      ageCohort: 'senior',
      educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
      fontScale: 'xlarge'
    },
    profileStats: {
      currentStreak: 65,
      highestStreak: 70,
      xp: 6200,
      level: 12,
      league: 'Diamond',
      hearts: 5,
      maxHearts: 5,
      todayXp: 40
    }
  },
  {
    id: 'usr_parent_02',
    name: 'Eleanor Rivera',
    email: 'eleanor.rivera@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '1978-04-22',
    role: 'parent',
    status: 'active',
    createdAt: '2026-08-16',
    lastLoginAt: '2026-10-30 19:40:11',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 50,
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'pro',
      educationLevel: 'Parent & Family Guardian',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 5,
      highestStreak: 12,
      xp: 850,
      level: 3,
      league: 'Silver',
      hearts: 5,
      maxHearts: 5,
      todayXp: 0
    }
  },
  {
    id: 'usr_teacher_03',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '1985-11-03',
    role: 'teacher',
    status: 'active',
    createdAt: '2026-07-10',
    lastLoginAt: '2026-10-31 03:50:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 80,
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'pro',
      educationLevel: 'Educator & Curriculum Studio',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 45,
      highestStreak: 60,
      xp: 9800,
      level: 15,
      league: 'Diamond',
      hearts: 5,
      maxHearts: 5,
      todayXp: 30
    }
  },
  {
    id: 'usr_admin_04',
    name: 'System Administrator (Root)',
    email: 'admin@edubridge.org',
    password: 'AdminPassword2026!',
    dateOfBirth: '1989-01-15',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01',
    lastLoginAt: '2026-10-31 05:22:00',
    preferences: {
      preferredLanguage: 'English',
      dailyGoalXp: 120,
      theme: 'system',
      soundEnabled: true,
      emailNotifications: true,
      ageCohort: 'pro',
      educationLevel: 'System Administration & Security',
      fontScale: 'standard'
    },
    profileStats: {
      currentStreak: 90,
      highestStreak: 90,
      xp: 15400,
      level: 20,
      league: 'Diamond',
      hearts: 5,
      maxHearts: 5,
      todayXp: 100
    }
  }
];

export const initialFeatureFlags: FeatureFlag[] = [
  {
    id: 'ff_ielts_pte',
    key: 'module_exam_simulator',
    name: 'E2Language IELTS & PTE Mock Simulator',
    description: 'Enables timed simulation, score predictor, and rubric analytics across all 4 modules.',
    enabled: true,
    category: 'EXAM_PREP'
  },
  {
    id: 'ff_ollama_ai',
    key: 'module_ai_tutor',
    name: 'Bridge AI Multi-Model Mentorship',
    description: 'Enables Ollama self-hosted models: Phi-4, Qwen 3, DeepSeek 8B, and Llama 3.3.',
    enabled: true,
    category: 'AI_MODELS'
  },
  {
    id: 'ff_voice_tts_stt',
    key: 'module_voice_speech',
    name: 'Piper TTS & Whisper STT Speech Engine',
    description: 'Enables browser audio pronunciation readout and oral microphone recording.',
    enabled: true,
    category: 'VOICE_PIPER'
  },
  {
    id: 'ff_career_hub',
    key: 'module_career_portfolio',
    name: 'Skill-to-Income Hub & ATS Resume Builder',
    description: 'Provides freelance rate benchmarks, verifiable credential IDs, and printable CVs.',
    enabled: true,
    category: 'CAREER_HUB'
  },
  {
    id: 'ff_offline_pwa',
    key: 'module_offline_storage',
    name: 'Offline-First JSON Data Storage & PWA',
    description: 'Caches courses, tests, and vocabulary in IndexedDB / LocalStorage for zero-latency offline use.',
    enabled: true,
    category: 'OFFLINE_MODE'
  }
];

export const initialFeedbackTickets: UserFeedbackTicket[] = [
  {
    id: 'fb_101',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@edubridge.org',
    userRole: 'student',
    category: 'Feature Request',
    priority: 'Medium',
    subject: 'Add dark mode toggle for late-night exam practice',
    description: 'When practicing IELTS reading passages late in the evening, having an explicit dark mode toggle in the header would improve eye comfort significantly.',
    createdAt: '2026-10-30 22:15:00',
    status: 'Resolved',
    adminResponse: {
      respondedBy: 'System Administrator (Root)',
      respondedAt: '2026-10-31 01:30:00',
      message: 'Great suggestion Alex! We have added dark mode color tokens into our Tailwind layer and linked it to your user preferences profile.'
    },
    emailNotificationSent: true,
    adminEmailRecipients: ['admin@edubridge.org', 'dev-lead@edubridge.org']
  },
  {
    id: 'fb_102',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@edubridge.org',
    userRole: 'student',
    category: 'Bug Report',
    priority: 'High',
    subject: 'Whisper STT mic permissions prompt on mobile Safari',
    description: 'On mobile Safari, the microphone button required two taps before speech recognition was granted. Audio input worked correctly after that.',
    createdAt: '2026-10-31 03:20:10',
    status: 'Investigating',
    adminResponse: {
      respondedBy: 'System Administrator (Root)',
      respondedAt: '2026-10-31 04:10:00',
      message: 'Thank you for the detailed report! We are adjusting our Web Speech user gesture handler to ensure single-tap audio activation.'
    },
    emailNotificationSent: true,
    adminEmailRecipients: ['admin@edubridge.org', 'dev-lead@edubridge.org']
  }
];

export const initialUserGuideArticles: UserGuideArticle[] = [
  {
    id: 'guide_getting_started',
    title: 'Getting Started with EduBridge',
    category: 'Platform Basics',
    icon: 'Sparkles',
    minRole: 'student',
    summary: 'Master your credentials, profile preferences, daily study goals, and offline learning capabilities.',
    keywords: ['login', 'account', 'profile', 'password', 'dob', 'preferences', 'streak', 'xp'],
    imagePlaceholder: {
      title: 'EduBridge Dashboard Architecture',
      caption: 'Visual overview of language trees, exam simulators, and AI mentorship.',
      badge: 'Core UI',
      accentColor: 'from-indigo-600 to-blue-700'
    },
    contentSections: [
      {
        heading: '1. User Authentication & Profile Security',
        text: 'EduBridge uses self-hosted credentials stored in secure local JSON databases. Each user maintains an individual profile containing their date of birth, preferred language, and learning target goals.',
        steps: [
          'Log in using your registered email and password.',
          'Open "My Profile & Preferences" to update your target exam and daily XP goals.',
          'Your study progress is automatically backed up locally.'
        ]
      },
      {
        heading: '2. Daily Streak & XP Mechanics',
        text: 'Learning retention thrives on daily consistency. Complete at least one exercise or practice set daily to preserve your flame streak counter.',
        tip: 'Hitting your daily XP goal (e.g., 100 XP) triggers multi-stage celebratory fireworks and reinforces your Ruby League standing!'
      }
    ]
  },
  {
    id: 'guide_language_tree',
    title: 'Language Learning & Skill Trees',
    category: 'Language Module',
    icon: 'TreePine',
    minRole: 'student',
    summary: 'Duolingo-inspired interactive units, vocabulary flashcards, Piper speech playback, and oral recording.',
    keywords: ['language', 'spanish', 'units', 'flashcards', 'pronunciation', 'piper', 'whisper'],
    imagePlaceholder: {
      title: 'Skill Tree & Stepping Nodes',
      caption: 'Branching unit structure with interactive lesson exercises.',
      badge: 'Duolingo Style',
      accentColor: 'from-emerald-600 to-teal-700'
    },
    contentSections: [
      {
        heading: '1. Navigating Lesson Trees',
        text: 'Units are organized sequentially. As you master Unit 1 (Social Greetings & Phonetics), Unit 2 (Daily Logistics) and advanced discourse units unlock automatically.',
        steps: [
          'Click on any active lesson circle (+20 XP, +30 XP).',
          'Practice flashcards, audio listening, grammar fill-in, and speaking exercises.',
          'Your phonetic accuracy is evaluated in real time.'
        ]
      }
    ]
  },
  {
    id: 'guide_exam_prep',
    title: 'Standardized Exam Simulator (IELTS & PTE)',
    category: 'Exam Prep',
    icon: 'Award',
    minRole: 'student',
    summary: 'E2Language-inspired timed mock tests, band score prediction, and rubric analytics across all 4 modules.',
    keywords: ['ielts', 'pte', 'toefl', 'oet', 'mock', 'reading', 'writing', 'speaking', 'listening', 'band'],
    imagePlaceholder: {
      title: 'IELTS / PTE Timed Exam Simulator',
      caption: 'Test-day countdown timer, essay word counter, and band score evaluation report.',
      badge: 'E2Language Style',
      accentColor: 'from-amber-600 to-orange-700'
    },
    contentSections: [
      {
        heading: '1. Launching Timed Mock Tests',
        text: 'Simulate official test-day conditions with automated countdown timing across Reading, Writing, Speaking, and Listening.',
        steps: [
          'Select your target exam (IELTS, PTE, TOEFL, OET, DET).',
          'Click "Launch Timed Mock Test" to initiate the countdown clock.',
          'Compose essays using the built-in word counter.',
          'Click "Submit & Predict Band Score" for instant rubric feedback.'
        ]
      }
    ]
  },
  {
    id: 'guide_ai_tutor',
    title: 'Bridge AI Mentor & Multi-Model Tuning',
    category: 'AI Tutoring',
    icon: 'Bot',
    minRole: 'student',
    summary: 'How to utilize Phi-4 Mini, Qwen 3, DeepSeek 8B, and Llama 3.3 for Socratic learning.',
    keywords: ['ai', 'bridge', 'ollama', 'phi', 'qwen', 'deepseek', 'llama', 'socratic'],
    imagePlaceholder: {
      title: 'Bridge AI Multi-Model Intelligence',
      caption: 'Socratic mentor interface with chain-of-thought mathematical reasoning steps.',
      badge: 'Ollama 4-Tier',
      accentColor: 'from-purple-600 to-indigo-800'
    },
    contentSections: [
      {
        heading: '1. Model Specializations',
        text: 'Bridge provides 4 distinct open-source model engines tailored to specific cognitive tasks:',
        steps: [
          'Phi-4 Mini (3.8B): Grammar analysis, phonetics, rapid flashcard verification.',
          'Qwen 3 (8B): Primary Socratic tutor; asks guiding questions instead of flat answers.',
          'DeepSeek R1 (8B): Rigorous mathematical proofs, calculus, and code logic.',
          'Llama 3.3 (8B): Career strategist, resume review, and freelance market pricing.'
        ]
      }
    ]
  },
  {
    id: 'guide_parent_portal',
    title: 'Parent Portal & Child Oversight',
    category: 'Parent Guidance',
    icon: 'Users',
    minRole: 'parent',
    summary: 'Monitor study hours, cognitive growth radars, screen time limits, and deliver encouraging praise.',
    keywords: ['parent', 'child', 'hours', 'limits', 'reports', 'praise', 'safety'],
    imagePlaceholder: {
      title: 'Parental Growth & Safety Oversight',
      caption: 'Screen time guardrails, weekly cognitive reports, and encouragement messenger.',
      badge: 'Parent Portal',
      accentColor: 'from-pink-600 to-rose-700'
    },
    contentSections: [
      {
        heading: '1. Study Hour Guardrails',
        text: 'Set healthy daily screen-time study caps (e.g., 3.5 hours). When reached, the system gently encourages the learner to take an offline restorative pause.',
        steps: [
          'Review weekly study hour distribution across Language, Exams, and STEM.',
          'Read AI-generated pedagogical advice identifying strengths and areas needing support.',
          'Send personalized words of praise directly to the child’s study screen.'
        ]
      }
    ]
  },
  {
    id: 'guide_badges_system',
    title: 'Milestone Badges & Honors System',
    category: 'Gamification & Honors',
    icon: 'Medal',
    minRole: 'student',
    summary: 'Earn prestigious commemorative achievement badges for vocabulary milestones, unbroken streaks, and top leaderboard finishes.',
    keywords: ['badge', 'achievement', 'milestone', '1000 words', '7-day streak', 'top of leaderboard', 'criteria', 'xp', 'tooltip'],
    imagePlaceholder: {
      title: 'Milestone Badges & Honors Showcase',
      caption: 'Visual medallion grid with interactive criteria tooltips and real-time progress indicators.',
      badge: 'Honors Vault',
      accentColor: 'from-amber-500 via-rose-500 to-indigo-600'
    },
    contentSections: [
      {
        heading: '1. Unlocking Milestone Badges',
        text: 'EduBridge celebrates significant intellectual and habit achievements across multiple learning disciplines. Badges feature metallic tiers ranging from Bronze to Legendary, awarding bonus Experience Points (XP) upon unlock.',
        steps: [
          '1000 Words Learned: Study, review, and master 1,000 active vocabulary words in your language vault.',
          '7-Day Streak: Maintain an unbroken daily study habit for 7 consecutive calendar days.',
          'Top of Leaderboard: Climb the ranks and secure a top 3 podium finish in your weekly league tournament.'
        ]
      },
      {
        heading: '2. Interactive Criteria Tooltips & Visual Grid',
        text: 'Hover or tap on any badge card in the Visual Grid to view an in-depth breakdown of the unlocking requirements, current progress percentage, and rarity rating.',
        tip: 'Tap on any unlocked badge medallion to launch a commemorative celebration or inspect your achievement certificate!'
      }
    ]
  },
  {
    id: 'guide_teacher_studio',
    title: 'Teacher Studio & Curriculum Management',
    category: 'Teacher Tools',
    icon: 'BookOpenCheck',
    minRole: 'teacher',
    summary: 'Construct courses, manage question banks, assign cohort homework, and analyze grade distributions.',
    keywords: ['teacher', 'course', 'question bank', 'assignments', 'cohort', 'grading'],
    imagePlaceholder: {
      title: 'Teacher Studio & Assessment Directorate',
      caption: 'Cohort submission tracking, rubric builder, and item master question bank.',
      badge: 'Teacher Studio',
      accentColor: 'from-blue-600 to-cyan-700'
    },
    contentSections: [
      {
        heading: '1. Curating the Item Master Question Bank',
        text: 'Teachers can add and tag question items across difficulty levels (Easy, Medium, Hard) and assessment types (Multiple Choice, Essay, Code, Oral).',
        steps: [
          'Create questions with customized tags.',
          'Deploy cohort assignments with specific deadlines.',
          'Track student submission percentages and average band scores.'
        ]
      }
    ]
  },
  {
    id: 'guide_admin_infrastructure',
    title: 'Enterprise Architecture & Admin Cluster (Confidential)',
    category: 'System Setup & DevSecOps',
    icon: 'ShieldAlert',
    minRole: 'admin',
    summary: 'Production Docker Compose stack, PostgreSQL 17, Redis, MinIO, Ollama VRAM allocation, and cron schedulers.',
    keywords: ['admin', 'docker', 'postgres', 'redis', 'minio', 'ollama', 'vram', 'cron', 'audit', 'rbac'],
    imagePlaceholder: {
      title: 'Docker Compose Self-Hosted Infrastructure',
      caption: 'Multi-service architecture connecting NGINX, NestJS, PostgreSQL 17, Redis, and Ollama.',
      badge: 'Admin Only',
      accentColor: 'from-slate-900 to-rose-900'
    },
    contentSections: [
      {
        heading: '1. Self-Hosted Infrastructure Architecture',
        text: 'EduBridge runs on a self-hosted modular monolith designed for zero cloud AI API fees and absolute data sovereignty.',
        steps: [
          'PostgreSQL 17: Relational source-of-truth database for users, courses, and exam attempts.',
          'Redis: Low-latency caching layer for active sessions and frequent leaderboard queries.',
          'MinIO: S3-compatible object storage for audio files, PDF resumes, and certificates.',
          'Ollama Cluster: Local GPU-accelerated inference serving Phi-4, Qwen 3, DeepSeek, and Llama 3.3.'
        ]
      },
      {
        heading: '2. Nightly 00:00 Cron Schedulers',
        text: 'Admins maintain control over autonomous background workers scheduled at 00:00 UTC:',
        steps: [
          'Mock Exam Daemon: Automatically generates at least 5 IELTS/PTE full practice tests.',
          'Vocabulary Expansion Daemon: Automatically enriches the lexicon with 100+ CEFR-tagged words.',
          'Audit Log Ledger: All administrative actions are permanently committed to an immutable log.'
        ]
      }
    ]
  }
];
