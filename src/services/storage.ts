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
  ColorSchemeConfig,
  UserActivityRecord,
  PasswordResetRecord,
  ExamSettingsConfig,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  IncompleteAttemptRecord,
  AttemptDetailResponse
} from '../types';
import { initialActivities, initialQuestionAttempts } from '../data/activityData';
import { apiService } from './apiService';
import { ieltsAcademicUnits } from '../data/ieltsUnitsData';
import { DEFAULT_COLOR_SCHEME, applyThemeToDom } from '../utils/themeManager';
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
import {
  initialScheduledJobs,
  generateOneHundredWordsBatch,
  getInitialIngestedItemsLedger,
  buildTenPracticeTestQuestions
} from './scheduleJobService';
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
  SYSTEM_SETUP: 'edubridge_system_setup_v1',
  ACTIVITIES: 'edubridge_user_activities_v1',
  QUESTION_ATTEMPTS: 'edubridge_question_attempts_v1',
  WRITTEN_RESPONSES: 'edubridge_written_responses_v1',
  INCOMPLETE_ATTEMPTS: 'edubridge_incomplete_attempts_v1',
  PASSWORD_RESETS: 'edubridge_password_resets_v1',
  EXAM_SETTINGS: 'edubridge_exam_settings_v1',
  ATTEMPTED_TEST_IDS: 'edubridge_attempted_test_ids_v1',
  ATTEMPTED_QUIZ_IDS: 'edubridge_attempted_quiz_ids_v1',
  LAST_SYNC: 'edubridge_last_sync_timestamp',
  PENDING_ACTIVITIES: 'edubridge_pending_activities_queue_v1',
  PENDING_QUESTIONS: 'edubridge_pending_questions_queue_v1'
};

const inMemoryStore = new Map<string, string>();

function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch {
        // Fallback to in-memory store
      }
    }
    if (inMemoryStore.has(key)) {
      return JSON.parse(inMemoryStore.get(key)!);
    }
    return fallback;
  } catch (e) {
    console.warn(`[EduBridge Storage] Failed to load key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    inMemoryStore.set(key, serialized);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, serialized);
        localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
      } catch {
        // storage quota exceeded or disabled in sandbox/node
      }
    }
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

    // Automatically record and synchronize User Activity with central database
    const activeUser = StorageService.getActiveUser();
    StorageService.recordUserActivity({
      userId: activeUser?.id || 'usr_student_01',
      userName: data.userName || activeUser?.name || 'EduBridge Learner',
      userRole: (data.userRole || activeUser?.role || 'student') as any,
      cohort: (data.cohort || activeUser?.cohort || 'academy') as any,
      type: data.testType === 'PRACTICE_TEST' ? 'practice_test' : 'mock_test',
      title: data.testTitle,
      category: data.category || `${data.testType} · Examination`,
      score: data.score || 'Completed',
      xpEarned: data.xpEarned || 50,
      status: data.status === 'COMPLETED' ? 'completed' : 'in_progress',
      details: data.details || `Completed ${data.testType} "${data.testTitle}" with verification hash ${hash}. Result: ${data.score}.`
    });

    return record;
  },

  getMockTests: (): MockTest[] => {
    let existing = safeGet<MockTest[]>(KEYS.MOCK_TESTS, mockTests);
    let updated = false;
    existing = existing.map((t) => {
      const base = mockTests.find((b) => b.id === t.id);
      if (base && (!t.questions || t.questions.length < 10)) {
        updated = true;
        return { ...t, ...base, questions: base.questions, subject: base.subject };
      }
      return t;
    });
    const existingIds = new Set(existing.map((t) => t.id));
    const missing = mockTests.filter((t) => !existingIds.has(t.id));
    if (missing.length > 0 || updated) {
      const merged = [...existing, ...missing];
      safeSet(KEYS.MOCK_TESTS, merged);
      return merged;
    }
    return existing;
  },
  saveMockTests: (m: MockTest[]): void => {
    safeSet(KEYS.MOCK_TESTS, m);
    try {
      if (m && m.length > 0) {
        // Persist latest mock test to database standard_tests table
        apiService.tests.save(m[m.length - 1]).catch(() => {});
      }
    } catch {}
  },

  moveMockTestToEnd: (testId: string): MockTest[] => {
    const tests = StorageService.getMockTests();
    const target = tests.find((t) => t.id === testId);
    if (!target) return tests;
    const remaining = tests.filter((t) => t.id !== testId);
    const updated: MockTest[] = [
      ...remaining,
      {
        ...target,
        lastAttemptedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        attemptCount: (target.attemptCount || 0) + 1
      }
    ];
    StorageService.saveMockTests(updated);
    StorageService.recordAttemptedTest(testId);
    return updated;
  },

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

  getScheduledJobs: (): ScheduledJob[] => {
    let saved = safeGet<ScheduledJob[]>(KEYS.SCHEDULED_JOBS, initialScheduledJobs);
    let updated = false;
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 10);
    saved = saved.map((j) => {
      if (j.lastRunTimestamp && j.lastRunTimestamp.includes('2026-10-31')) {
        updated = true;
        return {
          ...j,
          lastRunTimestamp: `Last executed: ${nowIso} 00:00:02`,
          status: 'completed' as const
        };
      }
      return j;
    });
    if (updated) {
      safeSet(KEYS.SCHEDULED_JOBS, saved);
    }
    return saved;
  },
  saveScheduledJobs: (j: ScheduledJob[]): void => safeSet(KEYS.SCHEDULED_JOBS, j),

  getVocabularyWords: (): VocabularyWord[] => safeGet<VocabularyWord[]>(KEYS.VOCABULARY_WORDS, generateOneHundredWordsBatch(1)),
  saveVocabularyWords: (w: VocabularyWord[]): void => safeSet(KEYS.VOCABULARY_WORDS, w),

  getPracticeTests: (): IELTSPracticeTest[] => {
    let list = safeGet<IELTSPracticeTest[]>(KEYS.PRACTICE_TESTS, []);
    let updated = false;
    list = list.map((pt) => {
      if (!pt.questions || pt.questions.length < 10) {
        updated = true;
        const subject = pt.subject || pt.title || 'Academic Discourse & Applied Practice';
        const questions = buildTenPracticeTestQuestions(
          pt.id,
          pt.module,
          subject,
          pt.prompt || `In the context of ${subject}, evaluate primary methodological assertions.`,
          pt.options,
          pt.correctAnswer,
          pt.explanation
        );
        return {
          ...pt,
          subject,
          questionCount: questions.length,
          questions
        };
      }
      return pt;
    });
    if (updated) {
      safeSet(KEYS.PRACTICE_TESTS, list);
    }
    return list;
  },
  savePracticeTests: (tests: IELTSPracticeTest[]): void => {
    safeSet(KEYS.PRACTICE_TESTS, tests);
    try {
      if (tests && tests.length > 0) {
        // Persist latest practice test to database standard_tests table
        apiService.tests.save(tests[0]).catch(() => {});
      }
    } catch {}
  },

  saveCohortQuizQuestions: (quizzes: any[]): void => {
    safeSet('edubridge_cohort_quizzes_v1', quizzes);
    try {
      if (quizzes && quizzes.length > 0) {
        // Persist new quiz questions to database quizzes table
        apiService.quizzes.saveBatch(quizzes).catch(() => {});
      }
    } catch {}
  },

  movePracticeTestToEnd: (testId: string, currentList?: IELTSPracticeTest[]): IELTSPracticeTest[] => {
    const tests = currentList && currentList.length > 0 ? currentList : StorageService.getPracticeTests();
    const target = tests.find((t) => t.id === testId);
    if (!target) return tests;
    const remaining = tests.filter((t) => t.id !== testId);
    const updated: IELTSPracticeTest[] = [
      ...remaining,
      {
        ...target,
        completed: true,
        lastAttemptedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        attemptCount: (target.attemptCount || 0) + 1
      }
    ];
    StorageService.savePracticeTests(updated);
    StorageService.recordAttemptedTest(testId);
    return updated;
  },

  getAttemptedTestIds: (): string[] => safeGet<string[]>(KEYS.ATTEMPTED_TEST_IDS, []),
  recordAttemptedTest: (testId: string): void => {
    const list = safeGet<string[]>(KEYS.ATTEMPTED_TEST_IDS, []);
    const filtered = list.filter((id) => id !== testId);
    safeSet(KEYS.ATTEMPTED_TEST_IDS, [...filtered, testId]);
  },

  getAttemptedCohortQuizIds: (): string[] => safeGet<string[]>(KEYS.ATTEMPTED_QUIZ_IDS, []),
  recordAttemptedCohortQuizIds: (ids: string[]): void => {
    const existing = safeGet<string[]>(KEYS.ATTEMPTED_QUIZ_IDS, []);
    const idSet = new Set(ids);
    const remaining = existing.filter((id) => !idSet.has(id));
    safeSet(KEYS.ATTEMPTED_QUIZ_IDS, [...remaining, ...ids]);
  },

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

  // User Management stored in JSON with strict unique name & username deduplication
  getUsers: (): UserAccount[] => {
    const raw = safeGet<UserAccount[]>(KEYS.USERS, initialUsers);
    const seenNames = new Set<string>();
    const seenUsernames = new Set<string>();
    const seenEmails = new Set<string>();
    const seenIds = new Set<string>();
    const deduplicated: UserAccount[] = [];

    for (const u of raw) {
      const cleanName = (u.name || '').trim().toLowerCase();
      const cleanEmail = (u.email || '').trim().toLowerCase();
      const cleanUsername = (u.username || u.email.split('@')[0] || '').trim().toLowerCase();
      const cleanId = u.id || `usr_${Math.random()}`;

      // Prevent duplicate users with same name, username, email, or id on this machine
      if (seenNames.has(cleanName) || seenUsernames.has(cleanUsername) || seenEmails.has(cleanEmail) || seenIds.has(cleanId)) {
        continue;
      }

      seenNames.add(cleanName);
      seenUsernames.add(cleanUsername);
      seenEmails.add(cleanEmail);
      seenIds.add(cleanId);

      deduplicated.push({
        ...u,
        username: u.username || cleanUsername
      });
    }

    if (deduplicated.length !== raw.length) {
      safeSet(KEYS.USERS, deduplicated);
    }
    return deduplicated;
  },
  saveUsers: (users: UserAccount[]): void => safeSet(KEYS.USERS, users),

  getActiveUserId: (): string | null => {
    try {
      return localStorage.getItem(KEYS.ACTIVE_USER_ID) || null;
    } catch {
      return null;
    }
  },
  setActiveUserId: (id: string | null): void => {
    try {
      if (id) {
        localStorage.setItem(KEYS.ACTIVE_USER_ID, id);
        localStorage.setItem('edubridge_active_user_id', id);
      } else {
        localStorage.removeItem(KEYS.ACTIVE_USER_ID);
        localStorage.removeItem('edubridge_active_user_id');
      }
    } catch {}
  },

  getActiveUser: (): UserAccount | null => {
    const activeId = StorageService.getActiveUserId();
    if (!activeId) return null;
    const all = StorageService.getUsers();
    return all.find((u) => u.id === activeId) || null;
  },
  setActiveUser: (id: string | null): void => {
    StorageService.setActiveUserId(id);
  },

  getFeatureFlags: (): FeatureFlag[] => safeGet<FeatureFlag[]>(KEYS.FEATURE_FLAGS, initialFeatureFlags),
  saveFeatureFlags: (flags: FeatureFlag[]): void => {
    safeSet(KEYS.FEATURE_FLAGS, flags);
    apiService.config.set('feature_flags', flags, 'features', 'System feature flags').catch(() => {});
  },

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
  saveColorScheme: (scheme: ColorSchemeConfig): void => {
    safeSet(KEYS.COLOR_SCHEME, scheme);
    apiService.config.set('color_scheme', scheme, 'ui', 'Global portal theme').catch(() => {});
  },

  // Standardized Exam & Practice Test Configuration
  getExamSettings: (): ExamSettingsConfig => {
    return safeGet<ExamSettingsConfig>(KEYS.EXAM_SETTINGS, {
      questionsPerTest: 10,
      allowShuffleOptions: true,
      writingTestQuestions: 1
    });
  },
  saveExamSettings: (settings: ExamSettingsConfig): void => {
    safeSet(KEYS.EXAM_SETTINGS, settings);
    apiService.config.set('exam_settings', settings, 'exam', 'Standardized test question counts').catch(() => {});
  },

  // Cloud Synchronization for Application Configurations & Tests
  syncConfigurationsFromCloud: async (): Promise<void> => {
    try {
      const configs = await apiService.config.getAll();
      if (configs.exam_settings) {
        safeSet(KEYS.EXAM_SETTINGS, configs.exam_settings);
      }
      if (configs.feature_flags && Array.isArray(configs.feature_flags)) {
        safeSet(KEYS.FEATURE_FLAGS, configs.feature_flags);
      }
      if (configs.color_scheme) {
        safeSet(KEYS.COLOR_SCHEME, configs.color_scheme);
        try {
          applyThemeToDom(configs.color_scheme);
        } catch {}
      }
      if (configs.system_setup) {
        safeSet(KEYS.SYSTEM_SETUP, configs.system_setup);
      }
    } catch {
      // Offline fallback
    }
  },

  syncTestsFromCloud: async (): Promise<void> => {
    try {
      const cloudTests = await apiService.tests.getAll();
      if (cloudTests && cloudTests.length > 0) {
        const mockCloud = cloudTests.filter((t) => t.testType === 'mock');
        const practiceCloud = cloudTests.filter((t) => t.testType === 'practice');
        if (mockCloud.length > 0) {
          const currentMocks = StorageService.getMockTests();
          const currentMap = new Map(currentMocks.map((t) => [t.id, t]));
          mockCloud.forEach((t) => currentMap.set(t.id, { ...currentMap.get(t.id), ...t }));
          safeSet(KEYS.MOCK_TESTS, Array.from(currentMap.values()));
        }
        if (practiceCloud.length > 0) {
          const currentPractice = StorageService.getPracticeTests();
          const currentMap = new Map(currentPractice.map((t) => [t.id, t]));
          practiceCloud.forEach((t) => currentMap.set(t.id, { ...currentMap.get(t.id), ...t }));
          safeSet(KEYS.PRACTICE_TESTS, Array.from(currentMap.values()));
        }
      }
    } catch {
      // Offline fallback
    }
  },

  // User Activities (Chronological History & Dashboard Board)
  getUserActivities: (userId?: string): UserActivityRecord[] => {
    const all = safeGet<UserActivityRecord[]>(KEYS.ACTIVITIES, initialActivities);
    if (!userId) return all;
    return all.filter((a) => a.userId === userId);
  },

  saveUserActivities: (activities: UserActivityRecord[]): void => {
    safeSet(KEYS.ACTIVITIES, activities);
  },

  // Cross-Device Activity & Question Pending Sync Queue
  getPendingActivitiesQueue: (): UserActivityRecord[] => {
    return safeGet<UserActivityRecord[]>(KEYS.PENDING_ACTIVITIES, []);
  },

  enqueuePendingActivity: (act: UserActivityRecord): void => {
    const queue = StorageService.getPendingActivitiesQueue();
    if (!queue.some((a) => a.id === act.id)) {
      safeSet(KEYS.PENDING_ACTIVITIES, [...queue, act]);
    }
  },

  clearPendingActivitiesQueue: (): void => {
    safeSet(KEYS.PENDING_ACTIVITIES, []);
  },

  getPendingQuestionsQueue: (): QuestionAttemptRecord[] => {
    return safeGet<QuestionAttemptRecord[]>(KEYS.PENDING_QUESTIONS, []);
  },

  enqueuePendingQuestions: (attempts: QuestionAttemptRecord[]): void => {
    const queue = StorageService.getPendingQuestionsQueue();
    const existingIds = new Set(queue.map((q) => q.id));
    const newItems = attempts.filter((a) => !existingIds.has(a.id));
    safeSet(KEYS.PENDING_QUESTIONS, [...queue, ...newItems]);
  },

  clearPendingQuestionsQueue: (): void => {
    safeSet(KEYS.PENDING_QUESTIONS, []);
  },

  flushPendingSyncQueue: async (): Promise<{ flushedActivities: number; flushedQuestions: number }> => {
    let flushedActs = 0;
    let flushedQs = 0;

    const pendingActs = StorageService.getPendingActivitiesQueue();
    if (pendingActs.length > 0) {
      try {
        await apiService.activities.saveBatch(pendingActs);
        flushedActs = pendingActs.length;
        StorageService.clearPendingActivitiesQueue();
      } catch (e: any) {
        console.warn('[EduBridge Storage] Pending activities flush deferred:', e.message);
      }
    }

    const pendingQs = StorageService.getPendingQuestionsQueue();
    if (pendingQs.length > 0) {
      try {
        await apiService.attempts.saveQuestions(pendingQs);
        flushedQs = pendingQs.length;
        StorageService.clearPendingQuestionsQueue();
      } catch (e: any) {
        console.warn('[EduBridge Storage] Pending question attempts flush deferred:', e.message);
      }
    }

    return { flushedActivities: flushedActs, flushedQuestions: flushedQs };
  },

  recordUserActivity: (act: Omit<UserActivityRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): UserActivityRecord => {
    const existing = StorageService.getUserActivities();
    const newRecord: UserActivityRecord = {
      ...act,
      id: act.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: act.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
      relativeTime: 'Just now'
    };
    const updated = [newRecord, ...existing];
    StorageService.saveUserActivities(updated);

    // Asynchronously synchronize with centralized server storage (enqueued on network blip)
    apiService.activities.save(newRecord).catch((e) => {
      console.warn('[EduBridge Storage] Background server sync deferred, enqueued for retry:', e.message);
      StorageService.enqueuePendingActivity(newRecord);
    });

    return newRecord;
  },

  // Practice Question Attempts History & Diagnostics
  getQuestionAttempts: (userId?: string): QuestionAttemptRecord[] => {
    const all = safeGet<QuestionAttemptRecord[]>(KEYS.QUESTION_ATTEMPTS, initialQuestionAttempts);
    if (!userId) return all;
    return all.filter((q) => q.userId === userId);
  },

  saveQuestionAttempts: (attempts: QuestionAttemptRecord[]): void => {
    safeSet(KEYS.QUESTION_ATTEMPTS, attempts);
  },

  recordQuestionAttempt: (
    att: Omit<QuestionAttemptRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): QuestionAttemptRecord => {
    const existing = StorageService.getQuestionAttempts();
    const newRecord: QuestionAttemptRecord = {
      ...att,
      id: att.id || `q_att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: att.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    const updated = [newRecord, ...existing];
    StorageService.saveQuestionAttempts(updated);

    // Asynchronously synchronize with centralized server (enqueued on network blip)
    apiService.attempts.saveQuestions(newRecord).catch((e) => {
      console.warn('[EduBridge Storage] Background server sync for question attempt deferred:', e.message);
      StorageService.enqueuePendingQuestions([newRecord]);
    });

    return newRecord;
  },

  recordBatchQuestionAttempts: (
    batch: (Omit<QuestionAttemptRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string })[]
  ): QuestionAttemptRecord[] => {
    const existing = StorageService.getQuestionAttempts();
    const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newRecords: QuestionAttemptRecord[] = batch.map((att, idx) => ({
      ...att,
      id: att.id || `q_att_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: att.timestamp || nowTimestamp
    }));
    const updated = [...newRecords, ...existing];
    StorageService.saveQuestionAttempts(updated);

    // Asynchronously synchronize batch with centralized server
    apiService.attempts.saveQuestions(newRecords).catch((e) => {
      console.warn('[EduBridge Storage] Background batch question sync deferred:', e.message);
      StorageService.enqueuePendingQuestions(newRecords);
    });

    return newRecords;
  },

  // Written Responses (Essays, Paragraphs, Letters)
  getWrittenResponses: (userId?: string): WrittenResponseRecord[] => {
    const all = safeGet<WrittenResponseRecord[]>(KEYS.WRITTEN_RESPONSES, []);
    if (!userId) return all;
    return all.filter((w) => w.userId === userId);
  },

  saveWrittenResponses: (responses: WrittenResponseRecord[]): void => {
    safeSet(KEYS.WRITTEN_RESPONSES, responses);
  },

  recordWrittenResponse: (response: WrittenResponseRecord): WrittenResponseRecord => {
    const existing = StorageService.getWrittenResponses();
    const newRecord: WrittenResponseRecord = {
      ...response,
      id: response.id || `wres_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: response.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    const updated = [newRecord, ...existing];
    StorageService.saveWrittenResponses(updated);

    // Synchronize with server
    apiService.attempts.saveWritten(newRecord).catch((e) => {
      console.warn('[EduBridge Storage] Background server sync for written response notice:', e.message);
    });

    return newRecord;
  },

  // Autosave & Cross-Device Incomplete Attempt Recovery
  getIncompleteAttempt: (userId: string, testId?: string): IncompleteAttemptRecord | null => {
    const list = safeGet<IncompleteAttemptRecord[]>(KEYS.INCOMPLETE_ATTEMPTS, []);
    if (testId) {
      return list.find((item) => item.userId === userId && item.testId === testId) || null;
    }
    const userAttempts = list.filter((item) => item.userId === userId);
    userAttempts.sort((a, b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime());
    return userAttempts[0] || null;
  },

  saveIncompleteAttempt: (attempt: IncompleteAttemptRecord): IncompleteAttemptRecord => {
    const list = safeGet<IncompleteAttemptRecord[]>(KEYS.INCOMPLETE_ATTEMPTS, []);
    const index = list.findIndex((item) => item.userId === attempt.userId && item.testId === attempt.testId);
    const updatedAttempt: IncompleteAttemptRecord = {
      ...attempt,
      lastSavedAt: new Date().toISOString()
    };
    if (index >= 0) {
      list[index] = updatedAttempt;
    } else {
      list.unshift(updatedAttempt);
    }
    safeSet(KEYS.INCOMPLETE_ATTEMPTS, list);

    // Synchronize autosave with server
    apiService.attempts.saveAutosave(updatedAttempt).catch(() => {});

    return updatedAttempt;
  },

  clearIncompleteAttempt: (userId: string, testId: string): void => {
    const list = safeGet<IncompleteAttemptRecord[]>(KEYS.INCOMPLETE_ATTEMPTS, []);
    const filtered = list.filter((item) => !(item.userId === userId && item.testId === testId));
    safeSet(KEYS.INCOMPLETE_ATTEMPTS, filtered);

    // Clear on server
    apiService.attempts.clearAutosave(userId, testId).catch(() => {});
  },

  // Reconstruct "Show Attempt" Detail
  getAttemptDetail: async (activityId: string): Promise<AttemptDetailResponse> => {
    try {
      // 1. Attempt to fetch authoritative record from server
      const serverDetail = await apiService.activities.getAttemptDetail(activityId);
      if (serverDetail && serverDetail.activity) {
        return serverDetail;
      }
    } catch (e: any) {
      console.warn('[EduBridge Storage] Server attempt detail lookup notice:', e.message);
    }

    // 2. Fallback to local storage reconstruction
    const allActivities = StorageService.getUserActivities();
    const activity = allActivities.find((a) => a.id === activityId);
    if (!activity) {
      throw new Error(`Activity ${activityId} not found`);
    }

    const testId = activity.replayPayload?.subId || activity.id;
    const allQuestions = StorageService.getQuestionAttempts(activity.userId);
    let matchedQuestions = allQuestions.filter((q) => q.testId === testId);
    if (matchedQuestions.length === 0) {
      matchedQuestions = allQuestions.filter(
        (q) => q.testTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15))
      );
    }

    const allWritten = StorageService.getWrittenResponses(activity.userId);
    const matchedWritten = allWritten.find(
      (w) => w.activityId === activity.id || (testId && w.taskTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15)))
    );

    const totalQ = matchedQuestions.length || 1;
    const correctQ = matchedQuestions.filter((q) => q.isCorrect).length;
    const percentage = matchedQuestions.length > 0 ? Math.round((correctQ / totalQ) * 100) : 100;
    const scoreText = typeof activity.score === 'string' ? activity.score : `${activity.score || percentage}%`;

    return {
      activity,
      questions: matchedQuestions,
      writtenResponse: matchedWritten,
      summary: {
        scoreText,
        percentage,
        timeSpent: activity.durationSec ? `${Math.round(activity.durationSec / 60)} mins` : 'Timed Session',
        accuracyText: `${correctQ} / ${totalQ} Correct`,
        evaluationBadge: percentage >= 80 ? 'Mastery Achieved' : percentage >= 60 ? 'Proficient' : 'Needs Practice'
      }
    };
  },

  // Centralized Server Synchronization (Restores local cache from server upon login or cache clear)
  syncUserFromServer: async (userId: string): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        const modulePath = '../../server/storage';
        const { ServerStorage } = await import(/* @vite-ignore */ modulePath);
        const acts = ServerStorage.getActivities({ userId }).items;
        const qAtts = ServerStorage.getQuestionAttempts({ userId });
        const wRes = ServerStorage.getWrittenResponses({ userId });

        const currentActivities = StorageService.getUserActivities().filter((a) => a.userId !== userId);
        StorageService.saveUserActivities([...acts, ...currentActivities]);

        const currentQuestions = StorageService.getQuestionAttempts().filter((q) => q.userId !== userId);
        StorageService.saveQuestionAttempts([...qAtts, ...currentQuestions]);

        const currentWritten = StorageService.getWrittenResponses().filter((w) => w.userId !== userId);
        StorageService.saveWrittenResponses([...wRes, ...currentWritten]);
        return;
      }

      const [activitiesRes, questionsRes, writtenRes] = await Promise.allSettled([
        apiService.activities.getAll({ userId }),
        apiService.attempts.getQuestions({ userId }),
        apiService.attempts.getWritten({ userId })
      ]);

      if (activitiesRes.status === 'fulfilled' && activitiesRes.value?.items) {
        const serverActivities = activitiesRes.value.items;
        const currentActivities = StorageService.getUserActivities().filter((a) => a.userId !== userId);
        StorageService.saveUserActivities([...serverActivities, ...currentActivities]);
      }

      if (questionsRes.status === 'fulfilled' && questionsRes.value) {
        const serverQuestions = questionsRes.value;
        const currentQuestions = StorageService.getQuestionAttempts().filter((q) => q.userId !== userId);
        StorageService.saveQuestionAttempts([...serverQuestions, ...currentQuestions]);
      }

      if (writtenRes.status === 'fulfilled' && writtenRes.value) {
        const serverWritten = writtenRes.value;
        const currentWritten = StorageService.getWrittenResponses().filter((w) => w.userId !== userId);
        StorageService.saveWrittenResponses([...serverWritten, ...currentWritten]);
      }
      console.log(`[EduBridge Storage] Successfully synchronized user ${userId} learning history from central server.`);
    } catch (e: any) {
      console.warn(`[EduBridge Storage] Note on server sync for user ${userId}:`, e.message);
    }
  },

  // Centralized Server Synchronization for Platform Administrators (fetches all users' activities)
  syncAllPlatformActivitiesFromServer: async (): Promise<UserActivityRecord[]> => {
    try {
      if (typeof window === 'undefined') {
        const modulePath = '../../server/storage';
        const { ServerStorage } = await import(/* @vite-ignore */ modulePath);
        const acts = ServerStorage.getActivities().items;
        StorageService.saveUserActivities(acts);
        return acts;
      }

      const res = await apiService.activities.getAll();
      if (res && res.items) {
        StorageService.saveUserActivities(res.items);
        return res.items;
      }
    } catch (e: any) {
      console.warn('[EduBridge Storage] Note on platform activities sync:', e.message);
    }
    return StorageService.getUserActivities();
  },

  // Password Reset 6-Digit OTP Management
  savePasswordResetOtp: (email: string, otp: string): void => {
    const resets = safeGet<PasswordResetRecord[]>(KEYS.PASSWORD_RESETS, []);
    const cleanEmail = email.trim().toLowerCase();
    const newRecord: PasswordResetRecord = {
      email: cleanEmail,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
      used: false
    };
    // Keep only most recent OTP for this email
    const filtered = resets.filter((r) => r.email !== cleanEmail);
    filtered.unshift(newRecord);
    safeSet(KEYS.PASSWORD_RESETS, filtered);
  },

  getPasswordResetOtp: (email: string): PasswordResetRecord | null => {
    const resets = safeGet<PasswordResetRecord[]>(KEYS.PASSWORD_RESETS, []);
    const cleanEmail = email.trim().toLowerCase();
    const found = resets.find((r) => r.email === cleanEmail && !r.used);
    if (!found) return null;
    if (Date.now() > found.expiresAt) return null; // expired
    return found;
  },

  clearPasswordResetOtp: (email: string): void => {
    const resets = safeGet<PasswordResetRecord[]>(KEYS.PASSWORD_RESETS, []);
    const cleanEmail = email.trim().toLowerCase();
    const updated = resets.map((r) => (r.email === cleanEmail ? { ...r, used: true } : r));
    safeSet(KEYS.PASSWORD_RESETS, updated);
  },

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
      activities: StorageService.getUserActivities(),
      questionAttempts: StorageService.getQuestionAttempts(),
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
      if (parsed.activities) StorageService.saveUserActivities(parsed.activities);
      if (parsed.questionAttempts) StorageService.saveQuestionAttempts(parsed.questionAttempts);
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
