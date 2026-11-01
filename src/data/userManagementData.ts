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
    id: 'guide_activity_board',
    title: 'Activity Board & Past/Current History',
    category: 'Activity & Progress',
    icon: 'History',
    minRole: 'student',
    summary: 'First-page landing dashboard tracking real-time and historical learning activities with exact timestamps, status indicators, and one-click "Perform Activity Again" replay.',
    keywords: ['activity board', 'timeline', 'history', 'timestamp', 'perform again', 'dashboard', 'replay', 'recent activities', 'past activities'],
    screenshotUrl: '/assets/guide/activity_timeline_history.jpg',
    screenshotCaption: 'Activity Board & Timeline: Real-time and historical learning activities with ISO timestamps, status badges, and one-click "Perform Activity Again" replay.',
    imagePlaceholder: {
      title: 'Activity Board & Timeline Architecture',
      caption: 'Chronological activity stream with timestamps, activity status, and direct replay actions.',
      badge: 'Landing Dashboard',
      accentColor: 'from-indigo-600 to-cyan-700'
    },
    contentSections: [
      {
        heading: '1. Top-Level First Page Landing & Real-Time Timeline',
        text: 'The Activity Board is positioned as the primary landing dashboard at the very top of EduBridge. It maintains a persistent chronological record of all your current and past learning activities, such as completed mock tests, vocabulary practice, question solver queries, and milestone completions.',
        steps: [
          'Log in to instantly view your Activity Board as the primary home screen.',
          'Every study event records an immutable date and time stamp (e.g. "Nov 1, 2026, 10:15 PM") stored in the local JSON activity ledger.',
          'Filter between "All Activities", "Completed", "In Progress", or "Milestones" to inspect your learning trajectory.'
        ]
      },
      {
        heading: '2. One-Click Replay: "Perform Activity Again"',
        text: 'Learners can repeat any past exercise, exam, or quiz upon their ease. Every recorded timeline card features a dedicated "Perform Again" action button that reopens the exact activity directly, allowing continuous reinforcement.',
        tip: 'Repeating an activity reinforces cognitive memory and contributes toward your daily XP study goal without overwriting your original completion history.'
      }
    ]
  },
  {
    id: 'guide_dashboard_landing',
    title: 'First-Page Landing Dashboard & Adaptive Hierarchy',
    category: 'Platform Basics',
    icon: 'Layers',
    minRole: 'student',
    summary: 'The Activity Board & History sits at the top of the first page under menu as the primary home view, followed by Adventure Hub, Streak Momentum, and Milestone Badges.',
    keywords: ['dashboard', 'first page', 'landing', 'hierarchy', 'menu', 'history', 'adventure hub', 'streak'],
    screenshotUrl: '/assets/guide/dashboard_top_landing.jpg',
    screenshotCaption: 'Landing Hierarchy: Dashboard & History positioned at the very top under menu, followed by Adventure Hub, Streak Habit, and Milestone Badges.',
    contentSections: [
      {
        heading: '1. Structured Visual Hierarchy: Dashboard & History First',
        text: 'EduBridge structures the user experience with an intuitive top-down hierarchy. As soon as you log in, the Activity Board & History is presented at the very top of the page immediately below the main navigation menu.',
        steps: [
          'The first object visible under the navigation menu is your live Activity Board.',
          'Directly beneath the Activity Board, learners find their Kid Adventure Hub or Academic Course Tracks.',
          'The Daily Streak Habit counter and Milestone Badges showcase follow in clean, symmetric sequence.'
        ]
      },
      {
        heading: '2. Zero Clutter & Symmetric Layout',
        text: 'All dashboard cards adapt symmetrically across desktop, tablet, and mobile viewport sizes, giving learners instant visibility into their historical study momentum.',
        tip: 'Collapsing or expanding components preserves screen real estate while keeping all critical learning tools within a single scrollable view.'
      }
    ]
  },
  {
    id: 'guide_age_cohorts',
    title: 'Age Cohorts & DOB-Driven Developmental Gating',
    category: 'Developmental Cohorts',
    icon: 'Users',
    minRole: 'student',
    summary: 'Date of Birth strictly calculates developmental age, dynamically showing/hiding modules, games, and difficulty across Ages 3–7, 8–10, Teens, Career, and Golden Age.',
    keywords: ['age cohort', 'dob', 'date of birth', 'early', 'junior', 'teen', 'academy', 'pro', 'senior', 'age gating', 'show hide'],
    screenshotUrl: '/assets/guide/age_gating_cohort_modules.jpg',
    screenshotCaption: 'Dynamic Age-Gating Architecture: Date of Birth strictly calculates developmental age, dynamically showing/hiding modules, games, and difficulty.',
    contentSections: [
      {
        heading: '1. Automatic Age Calculation from Registered Date of Birth',
        text: 'EduBridge calculates a learner’s exact developmental stage from their registered Date of Birth (DOB). Rather than forcing users into arbitrary grade categories, the interface dynamically shows, hides, enables, or disables features based on cognitive readiness.',
        steps: [
          '🧸 Ages 3–7 (Early Explorers): Kid-friendly adventure center, large tactile buttons, phonics soundboards, illustrated word builders. Advanced calculus and timed mock exams are cleanly locked.',
          '🎒 Ages 8–10 (Junior Scholars): Interactive STEM challenges, Junior games arena, house teams, daily study schedule, and junior science puzzles.',
          '🎓 Ages 11–17 (Teens & Academy): Standardized exam prep (IELTS/SAT/PTE), rigorous calculus, Socratic AI mentorship, and academic roadmaps.',
          '💼 Ages 18–54 (Career & Executive): Professional business fluency, CV enhancement, executive case analysis, and industry vocabulary.',
          '🌿 Ages 55+ (Golden Age Scholars): Cognitive reserve exercises, memoir writing, and enlarged high-contrast typography.'
        ]
      },
      {
        heading: '2. Dynamic Gating & Child Protection',
        text: 'Interactive games and objects are automatically gated according to age group. When a 7-year-old is logged in, complex university prep tools are hidden or locked, providing a safe, joyful, and focused learning environment.',
        tip: 'Administrators and parents can review and adjust registered DOB settings anytime to align with a child’s developmental milestones.'
      }
    ]
  },
  {
    id: 'guide_auth_security',
    title: 'Secure Password Verification & 6-Digit Email OTP Reset',
    category: 'Platform Basics',
    icon: 'Lock',
    minRole: 'student',
    summary: 'Passwords are verified strictly from the server/JSON storage layer with zero single-click cache bypasses, featuring automated 6-digit email OTP password recovery.',
    keywords: ['password', 'otp', '6-digit', 'email reset', 'security', 'verification', 'authentication', 'no bypass'],
    screenshotUrl: '/assets/guide/otp_password_reset_security.jpg',
    screenshotCaption: 'Enterprise Security: Secure password verification and 6-digit email OTP password reset with 15-minute token expiration.',
    contentSections: [
      {
        heading: '1. Strict Server-Side Password Verification',
        text: 'EduBridge enforces enterprise security standards: all passwords must be entered explicitly and verified against the secure database store. Single-click user bypasses and cached-click logins are prohibited across the platform.',
        steps: [
          'Enter your registered email/username and secure password.',
          'Credentials are authenticated directly against the encrypted local JSON store.',
          'Failed attempts provide clear, security-conscious validation messages.'
        ]
      },
      {
        heading: '2. Automated 6-Digit Email OTP Password Recovery',
        text: 'If a user forgets their password, they can click "Forgot Password" on the sign-in modal to trigger a 6-digit One-Time Password (OTP) dispatched to their registered email address.',
        steps: [
          'Enter your registered email address in the password recovery prompt.',
          'A cryptographic 6-digit OTP code is generated with a strict 15-minute expiration window.',
          'Input the 6-digit code and submit your new secure password.',
          'The credentials ledger is updated and all active sessions are re-secured.'
        ],
        tip: 'The 6-digit OTP flow operates 100% offline within your local EduBridge instance without requiring third-party cloud mail delivery dependencies.'
      }
    ]
  },
  {
    id: 'guide_admin_user_management',
    title: 'Admin User Credential & Role Management',
    category: 'Administration & Security',
    icon: 'ShieldCheck',
    minRole: 'admin',
    summary: 'Administrators can securely update user credentials, date of birth, password, full name, and email address with automatic cohort recalculation.',
    keywords: ['admin', 'credentials', 'password', 'dob', 'name', 'email', 'user management', 'recalculation'],
    screenshotUrl: '/assets/guide/admin_user_credentials_management.jpg',
    screenshotCaption: 'Administrator Directorate: Comprehensive credential editing for Name, Email, Password, and Date of Birth with live cohort recalculation.',
    contentSections: [
      {
        heading: '1. Administrative Credential Updates',
        text: 'Root administrators possess comprehensive control over all system accounts. Through the User Management Directorate, an administrator can inspect, edit, and update critical account attributes:',
        steps: [
          'Update User Full Name and Username.',
          'Modify registered Email Address.',
          'Reset or assign a new secure Password.',
          'Update Date of Birth (DOB).'
        ]
      },
      {
        heading: '2. Automatic Cohort Recalculation upon DOB Modification',
        text: 'When an administrator updates a user’s Date of Birth, EduBridge automatically recalculates the user’s age, age cohort (Early, Junior, Academy, Pro, Senior), education level, and visible module permissions in real time.',
        tip: 'All administrative credential updates are recorded in the immutable administrative security audit log.'
      }
    ]
  },
  {
    id: 'guide_interactive_classroom',
    title: 'Interactive Digital Classroom & Speech Listening',
    category: 'AI Problem Solving',
    icon: 'Volume2',
    minRole: 'student',
    summary: 'Classroom interface that understands user queries in a human way, proactively suggests options or asks for missing parameters, and reads results aloud naturally.',
    keywords: ['classroom', 'ai query', 'proactive', 'clarification', 'listening', 'speech', 'spoken audio', 'human understanding'],
    screenshotUrl: '/assets/guide/classroom_speech_listening.jpg',
    screenshotCaption: 'Interactive Digital Classroom: Human-like problem understanding, proactive clarification questions, and natural speech reading.',
    contentSections: [
      {
        heading: '1. Human-Like Problem Understanding & Cognitive Analysis',
        text: 'The Interactive Digital Classroom evaluates questions like an experienced human tutor. If a user submits a broad or incomplete query (e.g. "calculate density" or "find kinetic energy"), the AI analyzes the missing parameters and offers targeted clarification prompts rather than guessing.',
        steps: [
          'Type or dictate an academic query into the classroom prompt.',
          'The AI detects core intent (e.g., Density ρ = m / V) and presents clickable parameter presets.',
          'Select suggested values or enter custom quantities to reach the verified solution.'
        ]
      },
      {
        heading: '2. Natural Spoken Audio Listening',
        text: 'Click the listening option to hear the step-by-step result and final answer read aloud. Scientific notation, exponents, and fractions are converted into fluent, natural spoken sentences so auditory learners can internalize mathematical proofs effortlessly.',
        tip: 'You can customize your preferred speaker voice (Man, Woman, Boy, Girl) from the top-right persona selector.'
      }
    ]
  },
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
    title: 'AI-Powered Universal Question Solver & Classroom',
    category: 'AI Problem Solving',
    icon: 'BrainCircuit',
    minRole: 'student',
    summary: 'Ask academic and real-world questions using Keyboard, Digital Pen, Voice Speech, or Image OCR with human-like understanding, proactive clarification, step-by-step breakdown, and spoken audio reading.',
    keywords: ['solver', 'math', 'physics', 'chemistry', 'biology', 'handwriting', 'ocr', 'voice', 'palette', 'explanation', 'clarification', 'human', 'listen'],
    screenshotUrl: '/assets/guide/ai_solver_proactive_clarification.jpg',
    screenshotCaption: 'AI Cognitive Question Solver: Formula Quick Palette, Handwriting Canvas, Multilingual Voice, and Proactive Clarification.',
    contentSections: [
      {
        heading: '1. Human-Like Problem Understanding & Proactive Clarification',
        text: 'EduBridge cognitive AI evaluates questions in a natural, human-like manner. If a submitted problem lacks key parameters, coefficients, or contextual constraints (e.g., asking to solve an unspecified quadratic or ambiguous word problem), the tutor proactively asks targeted clarification questions before producing the final deduction.',
        steps: [
          'Submit a question in natural language, mathematical notation, or conversational prompt.',
          'If information is missing, the AI suggests options or asks specific questions to establish the needed parameters.',
          'Once clarified, the solver delivers verified reasoning steps, intermediate working, and final conclusion.'
        ],
        tip: 'Click the "Listen to Explanation" audio speaker button to have the verified answer and step-by-step rationale read aloud with articulate pronunciation.'
      },
      {
        heading: '2. Multimodal Question Input Methods',
        text: 'EduBridge functions as an intelligent digital classroom providing 4 distinct input methods with maximum workspace area:',
        steps: [
          'Keyboard Editor: Type equations, scientific notation, and prompts with the formula quick palette (powers, roots, fractions, Greek letters, chemical formulas).',
          'Digital Pen Canvas: Use your mouse, laptop touchpad, or touchscreen stylus as a digital pen to handwrite formulas and equations.',
          'Multilingual Voice Speech: Click the microphone to verbally dictate questions in any of 12 supported languages with live transcription.',
          'Image / Diagram OCR: Upload photos or captures of diagrams, printed worksheets, or handwritten problems for visual text extraction.'
        ]
      },
      {
        heading: '3. Two-Column Workspace: Persistent Explanation & Answer Palette',
        text: 'The interface is ergonomically organized into two focused columns: the comprehensive step-by-step solution remains anchored on the left workspace, while the verified final answer, core formulas, voice narration, and common mistakes appear in the right Answer Palette.',
        tip: 'The listening audio feature reads directly from the verified result, allowing auditory learners to internalize complex solutions effortlessly.'
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
    title: 'Standardized Exam Prep & Multi-Question Tests Suite',
    category: 'Exam Prep',
    icon: 'Award',
    minRole: 'student',
    summary: 'Practice Tests Hub featuring at least 10 in-depth questions per practice test under the same subject, question stepper [1] [2] ... [10], aggregate score evaluations, and dual AI 10-Question Synthesizers.',
    keywords: ['ielts', 'pte', 'toefl', 'oet', 'det', 'cambridge', 'mock', 'reading', 'writing', 'speaking', 'listening', 'practice hub', '10 questions', 'stepper', 'synthesizer'],
    screenshotUrl: '/assets/guide/multi_question_exam_prep.jpg',
    screenshotCaption: 'Standardized Exam Prep with Practice Tests Hub: At least 10 Questions under the Same Subject, Question Stepper [1]..[10], and Dual AI Synthesizers.',
    imagePlaceholder: {
      title: 'Standardized Test Simulator & Practice Hub',
      caption: 'Practice Tests Hub with 10-question sets, audio transcripts, countdown clock, and rubric score prediction.',
      badge: 'Multi-Exam Simulator',
      accentColor: 'from-amber-600 to-orange-700'
    },
    contentSections: [
      {
        heading: '1. Multi-Question Sets (At least 10 Questions Per Test)',
        text: 'All practice tests across IELTS, PTE, TOEFL, OET, DET, and Cambridge English feature at least 10 comprehensive questions grouped under the same subject area, related to each other for deep contextual understanding. An interactive Question Stepper ([1] [2] ... [10]) lets learners freely move between questions, review flagged answers, and submit for overall score calculation.',
        steps: [
          'Choose your target exam from the exam selector pills (PTE, TOEFL, OET, DET, Cambridge, IELTS).',
          'Switch between Reading, Listening, Writing, and Speaking modules.',
          'Navigate through questions 1 to 10 using the question stepper buttons.',
          'Submit individual questions or evaluate the complete 10-question set for your aggregate band score.'
        ]
      },
      {
        heading: '2. Dual AI 10-Question Synthesizers: Same-Subject & Mix & Match',
        text: 'Generate fresh 10-question standardized tests on demand with single-click AI synthesizers: "AI Generate 10 Same-Subject Questions" (cohesive thematic questions exploring one domain in depth) or "AI Generate 10 Mix & Match Questions" (diverse variety of questions testing multiple skills).',
        tip: 'All practice tests and AI-synthesized tests are permanently stored in your offline JSON test bank.'
      },
      {
        heading: '3. Official Timed Mock Exam Simulator',
        text: 'Experience authentic test-day pacing with section-by-section countdown timers, essay word counters, and automatic band score prediction rubrics.',
        tip: 'All practice tests and mock simulations are cached offline, allowing study sessions anywhere without internet connectivity.'
      }
    ]
  },
  {
    id: 'guide_resource_vault',
    title: 'Universal Resource Vault & Symmetric Theming',
    category: 'Study Materials & Vault',
    icon: 'BookOpen',
    minRole: 'student',
    summary: 'Explore printable study sheets, formula cheat sheets, and cognitive exercises across all 5 age cohorts (Ages 5–100+) with symmetric light/dark readability and direct printing.',
    keywords: ['resource vault', 'printable', 'cheat sheet', 'study sheets', 'offline', 'dark mode', 'high contrast', 'symmetric', 'oled'],
    screenshotUrl: '/assets/guide/resource_vault_dark_light.png',
    screenshotCaption: 'Universal Resource Vault: Printable study sheets across all 5 age cohorts with symmetric light & Midnight OLED dark mode.',
    imagePlaceholder: {
      title: 'Universal Resource Vault & Study Guides',
      caption: 'Curated printable reference documents and cheat sheets formatted for clean physical printout.',
      badge: 'Resource Vault',
      accentColor: 'from-emerald-600 to-indigo-700'
    },
    contentSections: [
      {
        heading: '1. Printable Study Sheets Across 5 Age Cohorts',
        text: 'The Resource Vault provides authentic printable study guides, formula cheat sheets, phonics charts, and cognitive vitality exercises tailored to each age cohort from Early Childhood (Ages 5–8) up to Golden Age Scholars (Ages 55+).',
        steps: [
          'Open the Resource Vault from the Cohort arena or navigation bar.',
          'Select a study sheet (e.g. Phonics & Sight Words, STEM Formulas, Essay Structures, Executive Frameworks).',
          'Click "Print / Download PDF" to generate a clean, printer-friendly study reference.'
        ]
      },
      {
        heading: '2. Symmetric Color Architecture & Dark Mode Readability',
        text: 'EduBridge uses a symmetric theming engine across all 8 color schemes (Oceanic Indigo, Emerald Forest, Royal Amethyst, Sunset Terracotta, Rose Blossom, Cyberpunk Cyan, Midnight OLED, and High-Contrast Ink). In dark mode, all document preview boxes, cards, and text use high-contrast luminous styling (.resource-vault-sheet) ensuring text is always 100% visible with zero black-on-black or white-on-white clipping.',
        tip: 'Modifications to color schemes adapt symmetrically throughout the app without one component breaking another.'
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
