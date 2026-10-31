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
  ChatMessage,
  ScheduledJob,
  VocabularyWord,
  UserAccount,
  FeatureFlag,
  UserFeedbackTicket,
  UserGuideArticle,
  FontScale,
  AgeCohortId,
  IELTSPracticeTest,
  IngestedItemRecord,
  VoicePersona,
  TestConductionRecord,
  ColorSchemeConfig
} from '../types';
import { ieltsAcademicUnits } from '../data/ieltsUnitsData';
import { DEFAULT_COLOR_SCHEME } from '../utils/themeManager';
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
import { initialScheduledJobs, generateOneHundredWordsBatch, getInitialIngestedItemsLedger } from './scheduleJobService';
import { initialUsers, initialFeatureFlags, initialFeedbackTickets, initialUserGuideArticles } from '../data/userManagementData';
import { userAccountToProfile, calculateCohortFromDob } from '../utils/userProfile';

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
  SCHEDULED_JOBS: 'edubridge_scheduled_jobs_v1',
  VOCABULARY_WORDS: 'edubridge_vocab_words_v1',
  USERS: 'edubridge_users_json_v1',
  ACTIVE_USER_ID: 'edubridge_active_user_id_v1',
  FEATURE_FLAGS: 'edubridge_feature_flags_v1',
  FEEDBACK_TICKETS: 'edubridge_feedback_tickets_v1',
  USER_GUIDE: 'edubridge_user_guide_v1',
  FONT_SCALE: 'edubridge_font_scale_v1',
  ACTIVE_COHORT: 'edubridge_active_cohort_v1',
  PRACTICE_TESTS: 'edubridge_practice_tests_v1',
  INGESTED_LEDGER: 'edubridge_ingested_ledger_v1',
  VOICE_PERSONA: 'edubridge_voice_persona_v1',
  IELTS_UNITS: 'edubridge_ielts_units_v1',
  TEST_CONDUCTION_LOGS: 'edubridge_test_conduction_logs_v1',
  COLOR_SCHEME: 'edubridge_color_scheme_v1',
  LAST_SYNC: 'edubridge_last_sync_timestamp'
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
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
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error(`[EduBridge Storage] Failed to save key ${key}:`, e);
  }
}

export const initialTestConductionLogs: TestConductionRecord[] = [
  {
    id: 'tc_init_01',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userEmail: 'alex.chen@edubridge.edu',
    userName: 'Alex Chen',
    userRole: 'student',
    cohort: 'academy',
    testType: 'LESSON_UNIT',
    testId: 'ielts_lesson_2_1',
    testTitle: 'Academic Writing Task 1: Describing Surges, Declines & Fluctuations',
    category: 'IELTS Academic Track (Band 8.0+)',
    score: '96%',
    xpEarned: 30,
    status: 'COMPLETED',
    verificationHash: 'EB-VERIFIED-7A89F1',
    details: 'Completed Task 1 trend identification and vocabulary exercises.'
  },
  {
    id: 'tc_init_02',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    userEmail: 'alex.chen@edubridge.edu',
    userName: 'Alex Chen',
    userRole: 'student',
    cohort: 'academy',
    testType: 'LESSON_UNIT',
    testId: 'ielts_lesson_3_1',
    testTitle: 'Academic Writing Task 2: Formulating Nuanced Thesis Statements',
    category: 'IELTS Academic Track (Band 8.0+)',
    score: '94%',
    xpEarned: 35,
    status: 'COMPLETED',
    verificationHash: 'EB-VERIFIED-5F11A4',
    details: 'Constructed cohesive thesis and counter-argument framework.'
  },
  {
    id: 'tc_init_03',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    userEmail: 'alex.chen@edubridge.edu',
    userName: 'Alex Chen',
    userRole: 'student',
    cohort: 'academy',
    testType: 'LESSON_UNIT',
    testId: 'ielts_lesson_1_2',
    testTitle: 'Formal Verb Collocations & Argument Validation',
    category: 'IELTS Academic Track (Band 8.0+)',
    score: '95%',
    xpEarned: 35,
    status: 'COMPLETED',
    verificationHash: 'EB-VERIFIED-3B42C9',
    details: 'Passed verbal collocations and pronunciation oral drill.'
  },
  {
    id: 'tc_init_04',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    userEmail: 'alex.chen@edubridge.edu',
    userName: 'Alex Chen',
    userRole: 'student',
    cohort: 'academy',
    testType: 'PRACTICE_TEST',
    testId: 'ielts_acad_reading_1',
    testTitle: 'IELTS Academic Reading Practice Test #1',
    category: 'IELTS Academic',
    score: '100% (Correct)',
    xpEarned: 25,
    status: 'COMPLETED',
    verificationHash: 'EB-VERIFIED-9E11F4',
    details: 'Skimming and empirical inference validated against authentic rubric.'
  }
];

export const StorageService = {
  getProfile: (): UserProfile => {
    const active = StorageService.getActiveUser();
    if (active) {
      const userKey = `edubridge_profile_${active.id}`;
      const saved = safeGet<UserProfile | null>(userKey, null);
      if (saved) return saved;
      return userAccountToProfile(active);
    }
    return safeGet<UserProfile>(KEYS.PROFILE, initialProfile);
  },
  saveProfile: (p: UserProfile): void => {
    safeSet(KEYS.PROFILE, p);
    if (p.id) {
      safeSet(`edubridge_profile_${p.id}`, p);
    }
  },

  getUnits: (): Unit[] => {
    const units = safeGet<Unit[]>(KEYS.UNITS, initialUnits);
    return units.map((u, idx, arr) => {
      if (idx > 0 && arr[idx - 1].lessons.every((l) => l.completed)) {
        return { ...u, locked: false };
      }
      return u;
    });
  },
  saveUnits: (u: Unit[]): void => safeSet(KEYS.UNITS, u),

  getIeltsUnits: (): Unit[] => {
    const units = safeGet<Unit[]>(KEYS.IELTS_UNITS, ieltsAcademicUnits);
    return units.map((u, idx, arr) => {
      if (idx > 0 && arr[idx - 1].lessons.every((l) => l.completed)) {
        return { ...u, locked: false };
      }
      return u;
    });
  },
  saveIeltsUnits: (u: Unit[]): void => safeSet(KEYS.IELTS_UNITS, u),

  getTestConductionLogs: (): TestConductionRecord[] => {
    return safeGet<TestConductionRecord[]>(KEYS.TEST_CONDUCTION_LOGS, initialTestConductionLogs);
  },
  saveTestConductionLogs: (logs: TestConductionRecord[]): void => safeSet(KEYS.TEST_CONDUCTION_LOGS, logs),
  recordTestConduction: (data: Omit<TestConductionRecord, 'id' | 'timestamp' | 'verificationHash'>): TestConductionRecord => {
    const timestamp = new Date().toISOString();
    const hash = 'EB-VERIFIED-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const record: TestConductionRecord = {
      ...data,
      id: `tc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      verificationHash: hash
    };
    const existing = StorageService.getTestConductionLogs();
    const updated = [record, ...existing];
    StorageService.saveTestConductionLogs(updated);

    // Also add to system audit logs so it appears in Admin Portal
    const auditRecord: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp,
      user: data.userName || data.userEmail || 'Student',
      action: `CONDUCTED_${data.testType}: ${data.testTitle} (${data.score || 'Completed'}) [${hash}]`,
      category: 'EXAM_EVAL',
      status: 'SUCCESS'
    };
    const currentAudit = StorageService.getAuditLogs();
    StorageService.saveAuditLogs([auditRecord, ...currentAudit]);

    return record;
  },

  getMockTests: (): MockTest[] => {
    const existing = safeGet<MockTest[]>(KEYS.MOCK_TESTS, mockTests);
    const existingIds = new Set(existing.map((t) => t.id));
    const missing = mockTests.filter((t) => !existingIds.has(t.id));
    if (missing.length > 0) {
      const merged = [...existing, ...missing];
      safeSet(KEYS.MOCK_TESTS, merged);
      return merged;
    }
    return existing;
  },
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

  getScheduledJobs: (): ScheduledJob[] => safeGet<ScheduledJob[]>(KEYS.SCHEDULED_JOBS, initialScheduledJobs),
  saveScheduledJobs: (j: ScheduledJob[]): void => safeSet(KEYS.SCHEDULED_JOBS, j),

  getVocabularyWords: (): VocabularyWord[] => safeGet<VocabularyWord[]>(KEYS.VOCABULARY_WORDS, generateOneHundredWordsBatch(1)),
  saveVocabularyWords: (w: VocabularyWord[]): void => safeSet(KEYS.VOCABULARY_WORDS, w),

  getPracticeTests: (): IELTSPracticeTest[] => safeGet<IELTSPracticeTest[]>(KEYS.PRACTICE_TESTS, []),
  savePracticeTests: (tests: IELTSPracticeTest[]): void => safeSet(KEYS.PRACTICE_TESTS, tests),

  getIngestedItemsLedger: (): IngestedItemRecord[] => safeGet<IngestedItemRecord[]>(KEYS.INGESTED_LEDGER, getInitialIngestedItemsLedger()),
  saveIngestedItemsLedger: (ledger: IngestedItemRecord[]): void => safeSet(KEYS.INGESTED_LEDGER, ledger),

  getVoicePersona: (): VoicePersona => {
    const active = StorageService.getActiveUser();
    if (active?.preferences?.personaVoice) return active.preferences.personaVoice;
    try {
      const raw = localStorage.getItem(KEYS.VOICE_PERSONA) as VoicePersona | null;
      if (raw && ['man', 'woman', 'boy', 'girl'].includes(raw)) return raw;
    } catch {}
    return 'woman';
  },
  saveVoicePersona: (persona: VoicePersona): void => {
    try {
      localStorage.setItem(KEYS.VOICE_PERSONA, persona);
    } catch {}
    const active = StorageService.getActiveUser();
    if (active) {
      active.preferences = {
        ...active.preferences,
        personaVoice: persona
      };
      StorageService.saveUsers(StorageService.getUsers().map((u) => (u.id === active.id ? active : u)));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edubridge:persona-changed', { detail: { persona } }));
    }
  },

  // User Management stored in JSON
  getUsers: (): UserAccount[] => safeGet<UserAccount[]>(KEYS.USERS, initialUsers),
  saveUsers: (users: UserAccount[]): void => safeSet(KEYS.USERS, users),

  getActiveUserId: (): string | null => {
    try {
      return localStorage.getItem(KEYS.ACTIVE_USER_ID) || 'usr_student_01';
    } catch {
      return 'usr_student_01';
    }
  },
  setActiveUserId: (id: string | null): void => {
    try {
      if (id) localStorage.setItem(KEYS.ACTIVE_USER_ID, id);
      else localStorage.removeItem(KEYS.ACTIVE_USER_ID);
    } catch {}
  },

  getActiveUser: (): UserAccount | null => {
    const all = StorageService.getUsers();
    const activeId = StorageService.getActiveUserId();
    return all.find((u) => u.id === activeId) || all[0] || null;
  },
  setActiveUser: (id: string | null): void => {
    StorageService.setActiveUserId(id);
  },

  getFeatureFlags: (): FeatureFlag[] => safeGet<FeatureFlag[]>(KEYS.FEATURE_FLAGS, initialFeatureFlags),
  saveFeatureFlags: (flags: FeatureFlag[]): void => safeSet(KEYS.FEATURE_FLAGS, flags),

  getFeedbackTickets: (): UserFeedbackTicket[] => safeGet<UserFeedbackTicket[]>(KEYS.FEEDBACK_TICKETS, initialFeedbackTickets),
  saveFeedbackTickets: (tickets: UserFeedbackTicket[]): void => safeSet(KEYS.FEEDBACK_TICKETS, tickets),

  getUserGuideArticles: (): UserGuideArticle[] => safeGet<UserGuideArticle[]>(KEYS.USER_GUIDE, initialUserGuideArticles),

  getLastSync: (): string => localStorage.getItem(KEYS.LAST_SYNC) || new Date().toISOString(),

  // Font Scale & Cohort with active user synchronization
  getFontScale: (): FontScale => {
    const active = StorageService.getActiveUser();
    if (active?.preferences?.fontScale) {
      return active.preferences.fontScale;
    }
    return safeGet<FontScale>(KEYS.FONT_SCALE, 'standard');
  },
  saveFontScale: (scale: FontScale): void => {
    safeSet(KEYS.FONT_SCALE, scale);
    const active = StorageService.getActiveUser();
    if (active) {
      const allUsers = StorageService.getUsers().map((u) =>
        u.id === active.id ? { ...u, preferences: { ...u.preferences, fontScale: scale } } : u
      );
      safeSet(KEYS.USERS, allUsers);
    }
  },

  getActiveCohort: (): AgeCohortId => {
    const active = StorageService.getActiveUser();
    if (active?.preferences?.ageCohort) {
      return active.preferences.ageCohort;
    }
    if (active?.dateOfBirth) {
      return calculateCohortFromDob(active.dateOfBirth);
    }
    return safeGet<AgeCohortId>(KEYS.ACTIVE_COHORT, 'academy');
  },
  saveActiveCohort: (cohort: AgeCohortId): void => {
    safeSet(KEYS.ACTIVE_COHORT, cohort);
    const active = StorageService.getActiveUser();
    if (active) {
      const allUsers = StorageService.getUsers().map((u) =>
        u.id === active.id ? { ...u, preferences: { ...u.preferences, ageCohort: cohort } } : u
      );
      safeSet(KEYS.USERS, allUsers);
    }
  },

  getColorScheme: (): ColorSchemeConfig => safeGet<ColorSchemeConfig>(KEYS.COLOR_SCHEME, DEFAULT_COLOR_SCHEME),
  saveColorScheme: (scheme: ColorSchemeConfig): void => safeSet(KEYS.COLOR_SCHEME, scheme),

  exportAllData: (): string => {
    const backup = {
      profile: StorageService.getProfile(),
      units: StorageService.getUnits(),
      ieltsUnits: StorageService.getIeltsUnits(),
      testConductionLogs: StorageService.getTestConductionLogs(),
      colorScheme: StorageService.getColorScheme(),
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
      if (parsed.ieltsUnits) StorageService.saveIeltsUnits(parsed.ieltsUnits);
      if (parsed.testConductionLogs) StorageService.saveTestConductionLogs(parsed.testConductionLogs);
      if (parsed.colorScheme) StorageService.saveColorScheme(parsed.colorScheme);
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
