import { UserAccount, FeatureFlag, UserFeedbackTicket, UserGuideArticle } from '../types';

export const initialUsers: UserAccount[] = [
  {
    id: 'usr_student_01',
    name: 'Alex Rivera',
    username: 'alex.rivera',
    email: 'alex.rivera@edubridge.org',
    password: 'Password123!',
    dateOfBirth: '2004-09-18',
    role: 'student',
    status: 'active',
    createdAt: '2026-08-15',
    lastLoginAt: '2026-10-31 05:15:20',
    preferences: {
      preferredLanguage: 'Academic English (IELTS Band 8.0)',
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
      fontScale: 'standard',
      simplifiedInterface: false
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
    username: 'leo.chen',
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
      fontScale: 'large',
      simplifiedInterface: true
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
    username: 'maya.patel',
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
      fontScale: 'standard',
      simplifiedInterface: true
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
    username: 'david.sterling',
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
    username: 'evelyn.vance',
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
    username: 'eleanor.rivera',
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
    username: 'marcus.vance',
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
    username: 'admin',
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
    subject: 'Whisper STT mic permissions prompt on Safari Web browser',
    description: 'On Safari browser, the microphone button required two clicks before speech recognition was granted. Audio input worked correctly after that.',
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
    screenshotUrl: '/assets/guide/getting_started_dashboard.jpg',
    screenshotCaption: 'Getting Started with EduBridge: Student Learning Dashboard with Daily Study Target, Day 1 Streak Habit, Verified Conduction Ledger, and Course Track Units.',
    imagePlaceholder: {
      title: 'EduBridge Dashboard Architecture',
      caption: 'Visual overview of language trees, exam simulators, and AI mentorship.',
      badge: 'Core UI',
      accentColor: 'from-indigo-600 to-blue-700'
    },
    contentSections: [
      {
        heading: '1. User Authentication & Profile Security',
        text: 'EduBridge uses self-hosted credentials stored in secure local JSON databases. Each user maintains an individual profile containing their date of birth, preferred language, target career, and study goals.',
        steps: [
          'Log in using your registered email and password.',
          'Open "My Profile & Preferences" to update your target exam, daily XP goals, and age-tailored pacing.',
          'Your study progress and vocabulary mastery are automatically synchronized and backed up locally.'
        ]
      },
      {
        heading: '2. Daily Streak & XP Momentum',
        text: 'Daily consistency forms the backbone of intellectual retention. Complete at least one exercise or test daily to preserve your streak counter.',
        tip: 'Hitting your daily XP goal (e.g., 100 XP) triggers celebratory fireworks once per day and cements your league standing!'
      }
    ]
  },
  {
    id: 'guide_question_solver',
    title: 'AI-Powered Universal Question Solver',
    category: 'AI Problem Solving',
    icon: 'BrainCircuit',
    minRole: 'student',
    summary: 'Ask academic and real-world questions using Keyboard, Digital Pen, Voice Speech, or Image OCR with step-by-step verified explanations and Answer Palette.',
    keywords: ['solver', 'math', 'physics', 'chemistry', 'biology', 'handwriting', 'ocr', 'voice', 'palette', 'explanation'],
    screenshotUrl: '/assets/guide/solver_multimodal_overview.jpg',
    screenshotCaption: 'Interactive Digital Classroom Workspace with Formula Quick Palette, Handwriting Canvas, Multilingual Voice, and Verified Step-by-Step Breakdown.',
    contentSections: [
      {
        heading: '1. Multimodal Question Input Methods',
        text: 'EduBridge functions as an intelligent digital classroom providing 4 distinct input methods with maximum workspace area:',
        steps: [
          'Keyboard Editor: Type equations, scientific notation, and prompts with the formula quick palette (powers, roots, fractions, Greek letters, chemical formulas).',
          'Digital Pen Canvas: Use your mouse, laptop touchpad, or touchscreen stylus as a digital pen to handwrite formulas and equations.',
          'Multilingual Voice Speech: Click the microphone to verbally dictate questions in any of 12 supported languages with live transcription.',
          'Image / Diagram OCR: Upload photos or captures of diagrams, printed worksheets, or handwritten problems for visual text extraction.'
        ]
      },
      {
        heading: '2. Two-Column Workspace: Persistent Explanation & Answer Palette',
        text: 'The interface is ergonomically organized into two focused columns: the comprehensive step-by-step solution remains anchored on the left workspace, while the verified final answer, core formulas, voice narration, and common mistakes appear in the right Answer Palette.',
        tip: 'If a question lacks necessary parameters (e.g. asking to solve an unspecified quadratic), the AI tutor prompts a helpful clarification question rather than guessing.'
      }
    ]
  },
  {
    id: 'guide_essay_writer',
    title: 'AI Essay Generation & Document Export',
    category: 'AI Problem Solving',
    icon: 'FileText',
    minRole: 'student',
    summary: 'Generate full-text complete academic essays with structured paragraphs, verified reasoning steps, and instant PDF/DOC export download.',
    keywords: ['essay', 'composition', 'writing', 'paragraphs', 'export', 'pdf', 'doc', 'palette'],
    screenshotUrl: '/assets/guide/solver_essay_export.jpg',
    screenshotCaption: 'Complete Text Essay Generator delivering structured paragraphs in the Answer Palette with Instant PDF and Word Document Export.',
    contentSections: [
      {
        heading: '1. Generating Comprehensive Full-Length Essays',
        text: 'When you ask EduBridge to write an essay (e.g. "write an essay on my friend" or Task 2 topics), the solver produces a complete, full-text academic composition with an engaging introduction, body paragraphs with evidence, and a cohesive conclusion.',
        steps: [
          'Enter your essay prompt or topic in the Universal Question Solver.',
          'Click "Solve Question" to generate the structured essay.',
          'The complete essay is presented directly inside the dedicated Answer Palette.',
          'Step-by-step writing architecture breakdown remains visible on the left workspace.'
        ]
      },
      {
        heading: '2. One-Click PDF and Document Export',
        text: 'For extended compositions and study references, click the "Download PDF File" or "Download Word Doc" buttons to export formatted study materials directly to your device for offline reading or school submission.',
        tip: 'Exported PDFs include formatted headers, word count metrics, and analytical rubrics suitable for academic review.'
      }
    ]
  },
  {
    id: 'guide_streak_heatmap',
    title: 'Streak Correction & Study Habit Heatmap',
    category: 'Study Habits & Analytics',
    icon: 'Flame',
    minRole: 'student',
    summary: 'First-day streak correctly marked as Closed (not Expired), Habit Shield protection, and collapsible interactive monthly study habit heatmap.',
    keywords: ['streak', 'closed', 'heatmap', 'calendar', 'collapse', 'habit shield', 'badges', 'xp'],
    screenshotUrl: '/assets/guide/streak_habit_heatmap.jpg',
    screenshotCaption: '1-Day Streak marked as Closed, Active Momentum Banner, Habit Shield Freezes, and Collapsible Monthly Heatmap.',
    contentSections: [
      {
        heading: '1. Corrected First-Day Streak Status ("Closed")',
        text: 'To ensure accurate habit tracking, a newly created streak day transitions to "Closed" upon completion rather than "Expired", preserving your initial study day momentum across reloads and timezones.',
        steps: [
          'Day 1 of a new streak is explicitly tagged as "Closed" with green verification.',
          'Subsequent study days advance your continuous flame momentum counter.',
          'Habit Shields (Freeze Ready) protect your streak if you miss a study session.'
        ]
      },
      {
        heading: '2. Collapsible Monthly Study Heatmap',
        text: 'The 31-day activity calendar defaults to a clean, collapsed state to maximize screen space for learning. Users can toggle "Expand Month Calendar" anytime to view their day-by-day XP distribution and study intensity.',
        tip: 'Click any calendar square in the expanded heatmap to inspect the exact lessons, XP earned, and completion timestamps for that day!'
      }
    ]
  },
  {
    id: 'guide_persona_voice',
    title: 'Persona Voice Options & Speech Synthesis',
    category: 'Speech & Audio',
    icon: 'Volume2',
    minRole: 'student',
    summary: 'Select and customize your preferred voice persona (Man, Woman, Boy, Girl) seamlessly across all speech reading and listening features.',
    keywords: ['voice', 'persona', 'man', 'woman', 'boy', 'girl', 'tts', 'audio', 'cadence', 'pitch'],
    screenshotUrl: '/assets/guide/user_preferences_interface.jpg',
    screenshotCaption: 'Active Voice Persona & Cadence: Select between Man, Woman, Boy, and Girl voices with synchronized playback across all modules.',
    contentSections: [
      {
        heading: '1. Voice Persona Timbre & Pacing',
        text: 'EduBridge provides 4 distinct persona voices tailored to learner preferences and developmental age:',
        steps: [
          '👨 Man: Deep, articulate, confident adult male cadence (pitch 0.88, rate 0.98).',
          '👩 Woman: Warm, expressive, natural adult female cadence (pitch 1.08, rate 0.98).',
          '👦 Boy: Energetic, curious, youthful boy timbre (pitch 1.25, rate 1.04).',
          '👧 Girl: Cheerful, bright, sweet youthful girl timbre (pitch 1.35, rate 1.04).'
        ]
      },
      {
        heading: '2. Ubiquitous Voice Controls Across the Application',
        text: 'The Voice Persona selector is visible and accessible wherever audio is available: in the Universal Question Solver voice explanation bar, in Exam Prep listening simulations, in interactive lesson vocabulary audio, and in User Preferences.',
        tip: 'Selecting a voice persona updates your setting globally across all modules and saves it to your account profile.'
      }
    ]
  },
  {
    id: 'guide_preferences_simplification',
    title: 'User Preferences & Personalized Color Schemes',
    category: 'Platform Basics',
    icon: 'Sliders',
    minRole: 'student',
    summary: 'Customize your visual theme template, color schemes, child-friendly mode, module visibility, and persona voices.',
    keywords: ['preferences', 'color scheme', 'theme', 'template', 'kid mode', 'simplified', 'dob', 'age cohort', 'visible modules', 'voice persona'],
    screenshotUrl: '/assets/guide/user_preferences_interface.jpg',
    screenshotCaption: 'Preferences Interface: Color Scheme Templates (Emerald, Violet, Sunset, Midnight, Custom), Child-Friendly Mode, and Persona Voices.',
    contentSections: [
      {
        heading: '1. Personalized Color Schemes & Theme Templates',
        text: 'EduBridge allows learners to configure their ideal visual environment. You can choose from 8 curated study theme templates or design a custom color scheme:',
        steps: [
          'Oceanic Indigo: Default classic balance of deep indigo and teal focus tones.',
          'Emerald Forest: Soothing natural greens designed to prevent cognitive fatigue during lengthy reading.',
          'Royal Amethyst: Regal violet and magenta accents for creative writing and literature.',
          'Sunset Terracotta: Warm low-blue-light palette engineered for relaxed evening study.',
          'Rose Blossom: High-energy raspberry and coral tones that stimulate active recall.',
          'Cyberpunk Cyan: High-tech electric blue and slate for coding and STEM disciplines.',
          'Midnight OLED: Deep slate dark mode with luminous neon accents for night study.',
          'High-Contrast Ink: Stark black and white monochrome with bold borders for maximum visual clarity.',
          'Custom Color Palette: Pick your exact primary hex color, accent tone, and surface background.'
        ],
        tip: 'Color scheme changes are permanently saved in your User Profile preferences so a single update transforms your workspace across all sessions.'
      },
      {
        heading: '2. Child-Friendly Mode for Young Learners',
        text: 'For early learners (Ages 5-8 and 9-14), EduBridge provides a simplified interface mode that replaces technical menus with large, friendly buttons, phonics soundboards, and illustrated word builders.',
        steps: [
          'Open "My Profile & Preferences" from the top navigation.',
          'Toggle "Simple Child-Friendly Mode" on or off.',
          'Young learners see playful visual cues, while advanced learners access calculus, timed mock exams, and career roadmaps.'
        ]
      },
      {
        heading: '3. Modular Visibility Customizer',
        text: 'Every student and parent has complete control over which modules appear in the navigation bar. You can individually enable or disable Cohorts, Question Solver, Language Trees, Exam Prep, Vocabulary Quizzes, AI Tutor, and Leaderboards.',
        tip: 'Disabling a module hides its navigation tab without deleting your saved progress or XP history.'
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
    screenshotUrl: '/assets/guide/dashboard_language_tree.jpg',
    screenshotCaption: 'Interactive Skill Trees with Duolingo-Style Stepping Nodes, Unit Modules, and Audio Pronunciation.',
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
    title: 'Standardized Exam Prep & Practice Tests Hub',
    category: 'Exam Prep',
    icon: 'Award',
    minRole: 'student',
    summary: 'Practice Tests Hub with 1,100+ tests across PTE, TOEFL, OET, DET, Cambridge English & IELTS, plus timed mock exams and instant rubric analytics.',
    keywords: ['ielts', 'pte', 'toefl', 'oet', 'det', 'cambridge', 'mock', 'reading', 'writing', 'speaking', 'listening', 'practice hub'],
    screenshotUrl: '/assets/guide/standardized_test_prep.jpg',
    screenshotCaption: 'Standardized Test Prep with Practice Tests Hub (1,100+ Tests across PTE, TOEFL, OET, DET, Cambridge & IELTS), Passages, Answers, and Explanations.',
    imagePlaceholder: {
      title: 'Standardized Test Simulator & Practice Hub',
      caption: 'Practice Tests Hub with 1,100+ sets, audio transcripts, countdown clock, and rubric score prediction.',
      badge: 'Multi-Exam Simulator',
      accentColor: 'from-amber-600 to-orange-700'
    },
    contentSections: [
      {
        heading: '1. Practice Tests Hub (1,100+ Authentic Tests)',
        text: 'Access over 1,100 verified practice tests spanning IELTS Academic, General Training, PTE, TOEFL, OET, DET, and Cambridge English. Tests include authentic academic reading excerpts, Piper audio transcripts, multiple-choice questions, and detailed paragraph-referenced explanations.',
        steps: [
          'Choose your target exam from the exam selector pills (PTE, TOEFL, OET, DET, Cambridge, IELTS).',
          'Switch between Reading, Listening, Writing, and Speaking modules.',
          'Solve questions and click "Submit Practice Answer" for instant validation, audio feedback, and analytical reasoning.'
        ]
      },
      {
        heading: '2. Official Timed Mock Exam Simulator',
        text: 'Experience authentic test-day pacing with section-by-section countdown timers, essay word counters, and automatic band score prediction rubrics.',
        tip: 'All practice tests and mock simulations are cached offline, allowing study sessions anywhere without internet connectivity.'
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
    screenshotUrl: '/assets/guide/ai_tutor_socratic.jpg',
    screenshotCaption: 'Bridge AI Mentor with 4 Ollama Models (Phi-4, Qwen 3, DeepSeek, Llama 3.3) and Socratic Dialogue.',
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
    screenshotUrl: '/assets/guide/parent_portal_oversight.jpg',
    screenshotCaption: 'Parental Growth & Safety Oversight with Study Hour Guardrails, Cognitive Radar, and Encouragement Messenger.',
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
    screenshotUrl: '/assets/guide/streak_habit_heatmap.jpg',
    screenshotCaption: 'Milestone Badges & Honors Grid with Unlocked Medallions, Criteria Breakdown, and XP Rewards.',
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
    screenshotUrl: '/assets/guide/teacher_studio_curriculum.jpg',
    screenshotCaption: 'Teacher Studio with Item Master Question Bank, Cohort Assignments, and Rubric Directorate.',
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
    screenshotUrl: '/assets/guide/admin_infrastructure_schedulers.jpg',
    screenshotCaption: 'Enterprise Admin Portal with Nightly 00:00 Schedulers, Ingestion Timestamp Ledger, and Vocabulary Vault.',
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
  },
  {
    id: 'guide_data_storage',
    title: 'Data Storage Architecture & System Database Confirmation',
    category: 'System Setup & DevSecOps',
    icon: 'Layers',
    minRole: 'student',
    summary: 'Complete guide explaining where all system data is stored: client-side JSON database layer, structured source files, and production PostgreSQL / Redis stores.',
    keywords: ['database', 'storage', 'json', 'postgres', 'redis', 'localstorage', 'backup', 'data files'],
    screenshotUrl: '/assets/guide/admin_infrastructure_schedulers.jpg',
    screenshotCaption: 'EduBridge Data Architecture: Client-Side JSON Database Keys, Seed Fixtures, and Production Enterprise Stores.',
    contentSections: [
      {
        heading: '1. Current Application Storage Layer (JSON Database in LocalStorage)',
        text: 'The web application operates on a high-speed, offline-first client-side JSON database layer managed through StorageService (src/services/storage.ts). All application records are serialized into structured JSON format in browser local storage under versioned keys:',
        steps: [
          'edubridge_users_json_v1: User credentials, roles (Student, Parent, Teacher, Admin), dates of birth, and personalized preferences.',
          'edubridge_mocktests_v1 & edubridge_practice_tests_v1: All official timed mock exams and 1,100+ practice tests with passages and explanations.',
          'edubridge_vocab_words_v1: Dynamic Lexicon Vault with 300+ CEFR-indexed academic and STEM words.',
          'edubridge_ingested_ledger_v1: Complete chronological ledger recording exact timestamps for every generated test and word.',
          'edubridge_scheduled_jobs_v1: Nightly 00:00 UTC cron jobs configuration, status, and execution counters.',
          'edubridge_audit_logs_v1: Immutable administrative security and system audit events.'
        ]
      },
      {
        heading: '2. Source Seed & Static Data Files',
        text: 'Baseline datasets and initial fixtures are stored in modular TypeScript/JSON data files in the src/data/ directory:',
        steps: [
          'src/data/userManagementData.ts: Initial user accounts, feature flags, feedback tickets, and user guide articles.',
          'src/data/authenticIeltsPracticeData.ts: Authentic IELTS reading passages, listening transcripts, and rubrics.',
          'src/data/multiExamMockTestsData.ts: Standardized test patterns for PTE, TOEFL, OET, DET, and Cambridge English.',
          'src/data/ageCohortsData.ts: Age-cohort developmental curricula, essay templates, and cue cards.'
        ]
      },
      {
        heading: '3. Production Enterprise Database Architecture (Docker Stack)',
        text: 'For server-side multi-node deployments, EduBridge is backed by an enterprise open-source containerized stack:',
        steps: [
          'PostgreSQL 17: Relational source-of-truth database storing user schemas, test attempts, and school rosters.',
          'Redis 7: High-throughput memory cache powering real-time leaderboard calculations and active session tokens.',
          'MinIO: S3-compatible object storage storing audio listening files, PDF resumes, and achievement certificates.'
        ],
        tip: 'All client-side JSON data can be exported to a single backup file or reset via the System Telemetry & Maintenance tab in the Admin Portal.'
      }
    ]
  }
];
