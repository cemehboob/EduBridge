export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
export type ExamType = 'IELTS' | 'PTE' | 'TOEFL' | 'OET' | 'DET' | 'Cambridge English';

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
  sections: ExamSection[];
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
  childName: string;
  avatar: string;
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
