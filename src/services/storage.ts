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
  AuditLog,
  DailyTask,
  RevisionItem,
  ChatMessage
} from '../types';
import {
  initialProfile,
  initialUnits,
  mockTests,
  academicTopics,
  ollamaModels,
  careerRoadmaps,
  initialResume,
  sampleCertificates,
  sampleChildProgress,
  sampleAssignments,
  sampleQuestionBank,
  initialAuditLogs,
  initialDailyTasks,
  initialRevisions
} from '../data/initialData';

const KEYS = {
  PROFILE: 'edubridge_profile_v1',
  UNITS: 'edubridge_units_v1',
  MOCK_TESTS: 'edubridge_mocktests_v1',
  ACADEMIC_TOPICS: 'edubridge_academics_v1',
  OLLAMA_MODELS: 'edubridge_models_v1',
  CAREERS: 'edubridge_careers_v1',
  RESUME: 'edubridge_resume_v1',
  CERTIFICATES: 'edubridge_certificates_v1',
  CHILD_PROGRESS: 'edubridge_child_progress_v1',
  ASSIGNMENTS: 'edubridge_assignments_v1',
  QUESTION_BANK: 'edubridge_question_bank_v1',
  AUDIT_LOGS: 'edubridge_audit_logs_v1',
  DAILY_TASKS: 'edubridge_daily_tasks_v1',
  REVISIONS: 'edubridge_revisions_v1',
  CHAT_MESSAGES: 'edubridge_chat_messages_v1',
  LAST_SYNC: 'edubridge_last_sync_timestamp'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[EduBridge Storage] Failed to load key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error(`[EduBridge Storage] Failed to save key ${key}:`, e);
  }
}

export const StorageService = {
  getProfile: (): UserProfile => safeGet<UserProfile>(KEYS.PROFILE, initialProfile),
  saveProfile: (p: UserProfile): void => safeSet(KEYS.PROFILE, p),

  getUnits: (): Unit[] => safeGet<Unit[]>(KEYS.UNITS, initialUnits),
  saveUnits: (u: Unit[]): void => safeSet(KEYS.UNITS, u),

  getMockTests: (): MockTest[] => safeGet<MockTest[]>(KEYS.MOCK_TESTS, mockTests),
  saveMockTests: (m: MockTest[]): void => safeSet(KEYS.MOCK_TESTS, m),

  getAcademicTopics: (): AcademicTopic[] => safeGet<AcademicTopic[]>(KEYS.ACADEMIC_TOPICS, academicTopics),
  saveAcademicTopics: (a: AcademicTopic[]): void => safeSet(KEYS.ACADEMIC_TOPICS, a),

  getOllamaModels: (): OllamaModelInfo[] => safeGet<OllamaModelInfo[]>(KEYS.OLLAMA_MODELS, ollamaModels),
  saveOllamaModels: (m: OllamaModelInfo[]): void => safeSet(KEYS.OLLAMA_MODELS, m),

  getCareerRoadmaps: (): CareerRoadmap[] => safeGet<CareerRoadmap[]>(KEYS.CAREERS, careerRoadmaps),
  saveCareerRoadmaps: (c: CareerRoadmap[]): void => safeSet(KEYS.CAREERS, c),

  getResume: (): ResumeData => safeGet<ResumeData>(KEYS.RESUME, initialResume),
  saveResume: (r: ResumeData): void => safeSet(KEYS.RESUME, r),

  getCertificates: (): CertificateItem[] => safeGet<CertificateItem[]>(KEYS.CERTIFICATES, sampleCertificates),
  saveCertificates: (c: CertificateItem[]): void => safeSet(KEYS.CERTIFICATES, c),

  getChildProgress: (): ChildProgress => safeGet<ChildProgress>(KEYS.CHILD_PROGRESS, sampleChildProgress),
  saveChildProgress: (cp: ChildProgress): void => safeSet(KEYS.CHILD_PROGRESS, cp),

  getAssignments: (): CourseAssignment[] => safeGet<CourseAssignment[]>(KEYS.ASSIGNMENTS, sampleAssignments),
  saveAssignments: (as: CourseAssignment[]): void => safeSet(KEYS.ASSIGNMENTS, as),

  getQuestionBank: (): QuestionBankItem[] => safeGet<QuestionBankItem[]>(KEYS.QUESTION_BANK, sampleQuestionBank),
  saveQuestionBank: (qb: QuestionBankItem[]): void => safeSet(KEYS.QUESTION_BANK, qb),

  getAuditLogs: (): AuditLog[] => safeGet<AuditLog[]>(KEYS.AUDIT_LOGS, initialAuditLogs),
  saveAuditLogs: (logs: AuditLog[]): void => safeSet(KEYS.AUDIT_LOGS, logs),

  getDailyTasks: (): DailyTask[] => safeGet<DailyTask[]>(KEYS.DAILY_TASKS, initialDailyTasks),
  saveDailyTasks: (tasks: DailyTask[]): void => safeSet(KEYS.DAILY_TASKS, tasks),

  getRevisions: (): RevisionItem[] => safeGet<RevisionItem[]>(KEYS.REVISIONS, initialRevisions),
  saveRevisions: (revs: RevisionItem[]): void => safeSet(KEYS.REVISIONS, revs),

  getChatMessages: (): ChatMessage[] => safeGet<ChatMessage[]>(KEYS.CHAT_MESSAGES, [
    {
      id: 'welcome_1',
      sender: 'bridge',
      modelUsed: 'qwen-3-8b',
      mode: 'socratic',
      content: `Hello Alex! I am Bridge, your personal AI mentor powered by self-hosted open-source models.\n\nWhether you need grammar drills with Phi-4, academic Socratic tutoring with Qwen 3, mathematical proofs with DeepSeek, or career strategy with Llama 3.3, I'm here to guide you step-by-step. What would you like to master today?`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Guide me through IELTS Task 2 writing structure',
        'Help me understand calculus gradient descent intuitively',
        'Practice conversational Spanish ordering at a café',
        'Review my AI engineer portfolio for freelance gigs'
      ]
    }
  ]),
  saveChatMessages: (msgs: ChatMessage[]): void => safeSet(KEYS.CHAT_MESSAGES, msgs),

  getLastSync: (): string => localStorage.getItem(KEYS.LAST_SYNC) || new Date().toISOString(),

  // Backup & Restore
  exportAllData: (): string => {
    const backup = {
      profile: StorageService.getProfile(),
      units: StorageService.getUnits(),
      mockTests: StorageService.getMockTests(),
      academics: StorageService.getAcademicTopics(),
      careers: StorageService.getCareerRoadmaps(),
      resume: StorageService.getResume(),
      certificates: StorageService.getCertificates(),
      dailyTasks: StorageService.getDailyTasks(),
      revisions: StorageService.getRevisions(),
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(backup, null, 2);
  },

  importData: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) StorageService.saveProfile(parsed.profile);
      if (parsed.units) StorageService.saveUnits(parsed.units);
      if (parsed.mockTests) StorageService.saveMockTests(parsed.mockTests);
      if (parsed.academics) StorageService.saveAcademicTopics(parsed.academics);
      if (parsed.careers) StorageService.saveCareerRoadmaps(parsed.careers);
      if (parsed.resume) StorageService.saveResume(parsed.resume);
      if (parsed.certificates) StorageService.saveCertificates(parsed.certificates);
      if (parsed.dailyTasks) StorageService.saveDailyTasks(parsed.dailyTasks);
      if (parsed.revisions) StorageService.saveRevisions(parsed.revisions);
      return true;
    } catch (e) {
      console.error('[EduBridge Storage] Import failed:', e);
      return false;
    }
  },

  resetToDefault: (): void => {
    localStorage.clear();
    location.reload();
  }
};
