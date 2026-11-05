export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type FontScale = 'standard' | 'large' | 'xlarge';

export type AgeCohortId = 'early' | 'junior' | 'academy' | 'pro' | 'senior';

export type OllamaModelKey = 'phi-4-mini' | 'qwen-3-8b' | 'deepseek-8b' | 'llama-3.3-8b';

export interface OllamaModelInfo {
  id: OllamaModelKey;
  name: string;
  tagline: string;
  specialty: string;
  vram: string;
  status: 'online' | 'standby' | 'loading';
  latencyMs: number;
  temperature: number;
}

export type ColorSchemePreset =
  | 'default-indigo'
  | 'emerald-growth'
  | 'royal-violet'
  | 'sunset-amber'
  | 'rose-blossom'
  | 'cyber-cyan'
  | 'midnight-dark'
  | 'high-contrast'
  | 'custom';

export interface CustomColorPalette {
  primaryColor: string;
  accentColor: string;
  surfaceTone: 'light' | 'soft' | 'dark' | 'warm';
}

export interface ColorSchemeConfig {
  preset: ColorSchemePreset;
  custom?: CustomColorPalette;
  appliedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentStreak: number;
  highestStreak: number;
  xp: number;
  level: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby' | 'Diamond';
  hearts: number;
  maxHearts: number;
  dailyGoalXp: number;
  todayXp: number;
  targetExam?: string;
  targetExamDate?: string;
  targetBand?: string;
  targetCareer?: string;
  joinedDate: string;
  preferredLanguage: string;
  dateOfBirth?: string;
  ageCohort?: AgeCohortId;
  educationLevel?: string;
  simplifiedInterface?: boolean;
  visibleModules?: VisibleModulesConfig;
  personaVoice?: VoicePersona;
  colorScheme?: ColorSchemeConfig;
}

export interface VisibleModulesConfig {
  dashboard?: boolean;
  cohorts?: boolean;
  solver?: boolean;
  language?: boolean;
  exam?: boolean;
  vocab_quiz?: boolean;
  academic?: boolean;
  tutor?: boolean;
  planner?: boolean;
  career?: boolean;
  leaderboard?: boolean;
  badges?: boolean;
}

// Language Module
export type ExerciseType = 'flashcard' | 'multiple-choice' | 'listening' | 'speaking' | 'grammar-fill' | 'dialogue';

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  prompt: string;
  targetWord?: string;
  translation?: string;
  phonetic?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  audioText?: string;
  contextSentence?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  score?: number;
  exercises: ExerciseItem[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: Lesson[];
  locked: boolean;
}

// Exam Preparation Module (E2Language style)
export type VoicePersona = 'man' | 'woman' | 'boy' | 'girl';

export interface IngestedItemRecord {
  id: string;
  timestamp: string;
  jobId: string;
  jobName: string;
  itemType: 'Mock Test' | 'Practice Test' | 'Vocabulary Word';
  itemTitle: string;
  categoryOrExam: string;
  details?: string;
}

export type ExamType = 'IELTS Academic' | 'IELTS General Training' | 'IELTS' | 'PTE' | 'TOEFL' | 'OET' | 'DET' | 'Cambridge English';

export interface PracticeTestQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  sampleAnswer?: string;
  subject?: string;
}

export interface IELTSPracticeTest {
  id: string;
  category: 'IELTS Academic' | 'IELTS General Training';
  module: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  title: string;
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
  durationMinutes: number;
  questionCount: number;
  subject?: string;
  questions?: PracticeTestQuestion[];
  prompt: string;
  passage?: string;
  audioTranscript?: string;
  options?: string[];
  correctAnswer?: string;
  sampleAnswer?: string;
  explanation?: string;
  completed?: boolean;
  dateAdded?: string;
  timestamp?: string;
  lastAttemptedAt?: string;
  attemptCount?: number;
}

export interface ExamSection {
  id: string;
  name: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  durationMinutes: number;
  questionsCount: number;
  samplePrompt: string;
  rubric: {
    criteria: string;
    weight: string;
    description: string;
  }[];
}

export interface MockTest {
  id: string;
  exam: ExamType;
  title: string;
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
  totalDurationMin: number;
  targetBandRequirement: string;
  subject?: string;
  sections: ExamSection[];
  dateAdded?: string;
  timestamp?: string;
  lastAttemptedAt?: string;
  attemptCount?: number;
  questions: {
    id: string;
    section: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
    instruction: string;
    passage?: string;
    audioTranscript?: string;
    questionText: string;
    options?: string[];
    correctAnswer?: string;
    modelAnswer?: string;
    subject?: string;
  }[];
}

export interface ExamAttempt {
  id: string;
  mockTestId: string;
  exam: ExamType;
  date: string;
  predictedScore: string;
  sectionScores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  feedback: {
    fluency: string;
    lexicalResource: string;
    grammar: string;
    taskAchievement: string;
    strengths: string[];
    weaknesses: string[];
    recommendedNextStep: string;
  };
}

// Academic Learning Module (Khan Academy style)
export type AcademicSubject = 'Mathematics' | 'Science' | 'Technology';

export interface AcademicTopic {
  id: string;
  subject: AcademicSubject;
  subCategory: string; // e.g. "Calculus", "Physics", "AI & ML", "Data Structures"
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Mastery';
  masteryPercent: number;
  keyConcepts: string[];
  summary: string;
  formulaOrSnippet?: string;
  practiceProblem: {
    question: string;
    options: string[];
    correctIndex: number;
    stepByStepSolution: string[];
  };
}

// AI Tutor "Bridge"
export type TutorMode = 'socratic' | 'deep-explain' | 'quiz-me' | 'study-plan';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bridge';
  modelUsed?: OllamaModelKey;
  mode?: TutorMode;
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  reasoningSteps?: string[];
}

// Study Planner
export interface DailyTask {
  id: string;
  timeSlot: string;
  title: string;
  module: 'Language' | 'Exam Prep' | 'Academic' | 'Career';
  durationMin: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Normal';
}

export interface RevisionItem {
  id: string;
  concept: string;
  subject: string;
  retentionScore: number; // 0 - 100
  intervalStage: '1-Day' | '3-Day' | '7-Day' | '14-Day' | '30-Day';
  dueDate: string;
  isOverdue: boolean;
}

// Career Navigator & Portfolio
export interface CareerRoadmap {
  id: string;
  title: string;
  roleCategory: string;
  avgSalary: string;
  freelanceRate: string;
  demandGrowth: string;
  overview: string;
  milestones: {
    stage: string;
    skills: string[];
    targetProject: string;
    completed: boolean;
  }[];
  certifications: string[];
}

export interface ResumeData {
  fullName: string;
  headline: string;
  summary: string;
  skills: string[];
  experiences: {
    role: string;
    company: string;
    period: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  verifiedCertificates: {
    title: string;
    issuer: string;
    issuedDate: string;
    credentialId: string;
  }[];
}

export interface CertificateItem {
  id: string;
  title: string;
  recipientName: string;
  issueDate: string;
  credentialId: string;
  skillsDemonstrated: string[];
  gradeScore: string;
  verificationHash: string;
}

// Parent Portal
export interface ChildProgress {
  childId?: string;
  childName: string;
  weeklyHours: number;
  weeklyTargetHours: number;
  xpEarnedThisWeek: number;
  currentStreakDays: number;
  strengths: string[];
  areasNeedingSupport: string[];
  recentActivities: {
    timestamp: string;
    activity: string;
    result: string;
  }[];
  parentAdvice: string;
}

// Teacher Portal
export interface CourseAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  avgScore: number;
  status: 'Active' | 'Graded' | 'Draft';
}

export interface QuestionBankItem {
  id: string;
  question: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Multiple Choice' | 'Essay' | 'Code' | 'Oral';
  tags: string[];
}

// Admin Portal
export interface SystemMetric {
  name: string;
  value: string;
  change: string;
  status: 'healthy' | 'warning' | 'optimal';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'AUTH' | 'AI_INFERENCE' | 'EXAM_EVAL' | 'DATABASE_SYNC' | 'RBAC_CHANGE';
  status: 'SUCCESS' | 'INFO' | 'WARN';
}

export type TestConductionType = 'LESSON_UNIT' | 'MOCK_EXAM' | 'PRACTICE_TEST' | 'VOCAB_QUIZ' | 'QUESTION_SOLVER';

export interface TestConductionRecord {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: string;
  cohort?: string;
  testType: TestConductionType;
  testId: string;
  testTitle: string;
  category: string;
  score?: number | string;
  xpEarned?: number;
  status: 'COMPLETED' | 'PASSED' | 'SUBMITTED';
  verificationHash: string;
  details?: string;
}

export interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  cronExpression: string; // e.g. "0 0 * * *" (Night 00:00)
  targetTime: string;
  category: 'EXAM_PREP' | 'VOCABULARY';
  enabled: boolean;
  lastRunTimestamp?: string;
  nextRunTimestamp: string;
  itemsGeneratedCount: number;
  status: 'idle' | 'running' | 'completed' | 'paused';
  batchTarget: string; // "At least 5 Mock Tests (IELTS & PTE)" or "At least 100 Words"
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  definition: string;
  exampleSentence?: string;
  example?: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  dateAdded: string;
  timestamp?: string;
  synonyms?: string[];
  antonyms?: string[];
}

// User Management in JSON
export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  password: string; // simulated credentials
  dateOfBirth: string; // e.g. "2002-05-14"
  role: UserRole;
  status: 'active' | 'disabled';
  emailVerified?: boolean;
  emailVerificationStatus?: 'verified' | 'pending_verification' | 'verification_expired';
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    preferredLanguage: string;
    dailyGoalXp: number;
    targetExam?: string;
    targetExamDate?: string;
    targetBand?: string;
    targetCareer?: string;
    theme: 'light' | 'dark' | 'system';
    soundEnabled: boolean;
    emailNotifications: boolean;
    ageCohort?: AgeCohortId;
    educationLevel?: string;
    fontScale?: FontScale;
    simplifiedInterface?: boolean;
    visibleModules?: VisibleModulesConfig;
    personaVoice?: VoicePersona;
    colorScheme?: ColorSchemeConfig;
  };
  profileStats: {
    currentStreak: number;
    highestStreak: number;
    xp: number;
    level: number;
    league: 'Bronze' | 'Silver' | 'Gold' | 'Sapphire' | 'Ruby' | 'Diamond';
    hearts: number;
    maxHearts: number;
    todayXp: number;
  };
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'AI_MODELS' | 'EXAM_PREP' | 'VOICE_PIPER' | 'CAREER_HUB' | 'OFFLINE_MODE';
}

// User Activity Board & History Tracking
export type ActivityType =
  | 'lesson'
  | 'mock_test'
  | 'vocab_quiz'
  | 'solver'
  | 'stem_game'
  | 'study_task'
  | 'career_cv'
  | 'daily_schedule'
  | 'practice_test'
  | 'quiz'
  | 'admin_action';

export interface SmtpConfigView {
  host: string;
  port: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  authUser?: string;
  authPass?: string;
  fromEmail: string;
  fromName: string;
  encryption: 'STARTTLS' | 'SSL/TLS' | 'None' | 'SSL' | 'NONE';
  timeoutSec?: number;
  isConfigured?: boolean;
  active?: boolean;
  lastTestedAt?: string;
  lastTestStatus?: 'SUCCESS' | 'FAILED';
  lastTestError?: string;
}

export interface EmailLogEntryView {
  id: string;
  timestamp: string;
  recipient: string;
  type: string;
  subject: string;
  provider?: string;
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  error?: string;
  durationMs?: number;
  responseInfo?: string;
}

export interface ExamSettingsConfig {
  questionsPerTest: number; // default: 10, configurable from Admin Portal
  allowShuffleOptions: boolean; // default: true
  writingTestQuestions: number; // strictly: 1
}

export interface UserActivityRecord {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  title: string;
  category: string;
  timestamp: string; // e.g. "2026-11-01 19:30:15"
  relativeTime?: string;
  score?: number | string;
  xpEarned?: number;
  status: 'completed' | 'in_progress' | 'reviewed';
  details: string;
  examType?: string; // e.g. "IELTS Academic", "PTE Academic", "TOEFL", "General English"
  module?: string; // e.g. "Reading", "Writing", "Listening", "Speaking"
  attemptNumber?: number;
  startedAt?: string;
  completedAt?: string;
  totalQuestions?: number;
  attemptedQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  durationSec?: number;
  maxScore?: number | string;
  percentage?: number;
  evaluation?: string;
  feedback?: string;
  replayPayload: {
    tab: string;
    subId?: string;
    query?: string;
    metadata?: Record<string, any>;
  };
}

export interface QuestionAttemptRecord {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  testId: string;
  testTitle: string;
  moduleOrSubject: string; // e.g. "IELTS Reading", "IELTS Writing", "GRE Verbal", "Mathematics", "Vocabulary"
  questionNumber: number;
  questionPrompt: string;
  options?: string[];
  userAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  score?: string | number;
  maxScore?: string | number;
  timeSpentSec?: number;
  isSkipped?: boolean;
  explanation?: string;
  aiFeedback?: string;
  instructions?: string;
  timestamp: string; // "YYYY-MM-DD HH:mm:ss"
}

export interface WrittenResponseRecord {
  id: string;
  userId: string;
  userName: string;
  activityId: string;
  attemptId: string;
  questionId: string;
  taskTitle: string;
  taskPrompt: string;
  instructions?: string;
  sourcePassage?: string;
  writtenText: string;
  wordCount: number;
  characterCount: number;
  writingDurationSec?: number;
  evaluation?: {
    taskAchievement?: string;
    coherenceCohesion?: string;
    lexicalResource?: string;
    grammaticalAccuracy?: string;
    bandScore?: string | number;
  };
  score?: string | number;
  feedback?: string;
  corrections?: string[];
  vocabularyRecommendations?: string[];
  revisions?: {
    version: number;
    timestamp: string;
    text: string;
    wordCount: number;
  }[];
  timestamp: string;
}

export interface IncompleteAttemptRecord {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  examType: string;
  module: string;
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  essayText?: string;
  elapsedSeconds: number;
  lastSavedAt: string;
}

export interface AttemptDetailResponse {
  activity: UserActivityRecord;
  questions: QuestionAttemptRecord[];
  writtenResponse?: WrittenResponseRecord;
  summary: {
    scoreText: string;
    percentage: number;
    timeSpent: string;
    accuracyText: string;
    evaluationBadge: string;
  };
}

export interface PasswordResetRecord {
  email: string;
  otp: string; // 6-digit verification code
  createdAt: number; // Date.now()
  expiresAt: number; // Date.now() + 10 mins
  used: boolean;
}

// User Feedback & Support Mechanism
export interface UserFeedbackTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  category: 'Bug Report' | 'Feature Request' | 'Content Improvement' | 'General Inquiry';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  description: string;
  createdAt: string;
  status: 'Pending Review' | 'Investigating' | 'Resolved';
  adminResponse?: {
    respondedBy: string;
    respondedAt: string;
    message: string;
  };
  emailNotificationSent: boolean;
  adminEmailRecipients: string[];
}

// Complete Role-Aware User Guide
export interface UserGuideArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  minRole: UserRole; // 'student', 'parent', 'teacher', 'admin'
  summary: string;
  keywords: string[];
  screenshotUrl?: string;
  screenshotCaption?: string;
  imagePlaceholder?: {
    title: string;
    caption: string;
    badge: string;
    accentColor: string;
  };
  contentSections: {
    heading: string;
    text: string;
    steps?: string[];
    tip?: string;
  }[];
}

// Badge & Achievement System
export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Legendary';
export type BadgeCategory = 'all' | 'habits' | 'vocabulary' | 'leaderboard' | 'exams' | 'ai';

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  criteria: string; // Explicit unlocking criteria for tooltips
  category: 'habits' | 'vocabulary' | 'leaderboard' | 'exams' | 'ai';
  tier: BadgeTier;
  iconName: 'Award' | 'Flame' | 'Trophy' | 'BookOpen' | 'Zap' | 'Shield' | 'Crown' | 'Sparkles' | 'Star' | 'Medal' | 'GraduationCap' | 'Globe';
  gradientClass: string;
  borderClass: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  rarity: string;
}

// ==========================================
// Universal Age Cohorts & Accessibility (Ages 5 to 100+)
// ==========================================

export interface AgeCohortInfo {
  id: AgeCohortId;
  name: string;
  ageRange: string;
  icon: string;
  badge: string;
  bestPractice: string;
  cognitiveFocus: string;
  description: string;
  accentColor: string;
  bgGradient: string;
}

// 1. Ages 5-8: Little Explorers
export interface PhonicsCard {
  id: string;
  letter: string;
  phoneme: string;
  word: string;
  icon: string;
  soundType: 'vowel' | 'consonant' | 'blend';
  promptText: string;
  exampleSentence: string;
}

export interface WordBuilderItem {
  id: string;
  targetWord: string;
  category: string;
  icon: string;
  hint: string;
  scrambledLetters: string[];
}

export interface PictureStory {
  id: string;
  title: string;
  coverEmoji: string;
  theme: string;
  pages: {
    pageNumber: number;
    text: string;
    emojiScene: string;
  }[];
  comprehensionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    praise: string;
  };
}

// 2. Ages 9-14: Junior Scholars
export interface ScienceQuest {
  id: string;
  title: string;
  topic: string;
  readingPassage: string;
  dictionary: Record<string, string>;
  comprehensionQuestions: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface CreativeStoryStarter {
  id: string;
  genre: string;
  prompt: string;
  starterSentence: string;
  helperWords: string[];
}

export interface MentalMathChallenge {
  id: string;
  problem: string;
  options: number[];
  correctAnswer: number;
  mentalTrick: string;
}

export interface SpacedRepetitionCard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  explanation: string;
  mastered: boolean;
}

// 3. Ages 15-24: Academy & High-Stakes Exams
export interface TFNGExercise {
  id: string;
  passageTitle: string;
  passageSnippet: string;
  statement: string;
  answer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
  rubricRationale: string;
  strategyTip: string;
}

export interface Band9EssayTemplate {
  id: string;
  title: string;
  category: 'Introduction Hook' | 'Body Paragraph Counter-Argument' | 'Conclusion Synthesis' | 'Lexical Discourse Formula';
  templateSnippet: string;
  instructions: string;
  rubricAlignment: string;
}

export interface CueCardItem {
  id: string;
  topicTitle: string;
  cuePoints: string[];
  prepTimeSec: number;
  speakTimeSec: number;
  sampleBand9Response: string;
  pronunciationNotes: string;
}

// 4. Ages 25-54: Professional Fluency
export interface EmailDiplomacyScenario {
  id: string;
  title: string;
  corporateContext: string;
  rawDraft: string;
  diplomaticRewrite: string;
  politenessScore: number;
  assertivenessScore: number;
  clarityScore: number;
  tacticalNotes: string;
}

export interface ElevatorPitchPrompt {
  id: string;
  title: string;
  scenario: string;
  targetSeconds: number;
  bulletPoints: string[];
  modelScript: string;
  wpmTarget: string;
}

// 5. Ages 55+: Golden Age
export interface MemoryGymPair {
  id: string;
  wordA: string;
  wordB: string;
  semanticConnection: string;
  icon: string;
}

export interface ReminiscencePrompt {
  id: string;
  title: string;
  category: string;
  promptText: string;
  reflectiveQuestion: string;
}

export interface DigitalSafetyGuide {
  id: string;
  title: string;
  threatType: 'Phishing Email' | 'Fake SMS Alert' | 'Password & 2FA' | 'Safe Browsing';
  description: string;
  redFlags: string[];
  safeActionProtocol: string;
  interactiveScenario: {
    previewText: string;
    isScam: boolean;
    explanation: string;
  };
}

// Resource Vault
export interface ResourceVaultItem {
  id: string;
  cohort: AgeCohortId;
  cohortLabel: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  printableContent: string;
  downloadFilename: string;
}


