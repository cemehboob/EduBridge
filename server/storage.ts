import fs from 'fs';
import path from 'path';
import {
  UserAccount,
  UserActivityRecord,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  IncompleteAttemptRecord,
  AttemptDetailResponse
} from '../src/types';
import { initialUsers } from '../src/data/userManagementData';
import { initialActivities, initialQuestionAttempts } from '../src/data/activityData';

// Determine persistent data directory (use /tmp in serverless / read-only runtimes like Vercel)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless
  ? path.resolve('/tmp', 'server_vault')
  : path.resolve(process.cwd(), 'data/server_vault');

// Ensure directory exists without crashing on read-only environments
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e: any) {
  console.warn('[ServerStorage] Directory initialization note:', e.message);
}

// In-process mutex queue for safe concurrent atomic writes
class WriteMutex {
  private queue: Promise<void> = Promise.resolve();

  async dispatch<T>(fn: () => T | Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue = this.queue.then(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }
}

const mutex = new WriteMutex();

// In-memory memory fallback store if disk is read-only
const memoryVault = new Map<string, any>();

function readJsonFile<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      if (memoryVault.has(filename)) {
        return memoryVault.get(filename);
      }
      writeJsonFileSync(filename, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw.trim()) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    if (memoryVault.has(filename)) {
      return memoryVault.get(filename);
    }
    return fallback;
  }
}

function writeJsonFileSync<T>(filename: string, data: T): void {
  memoryVault.set(filename, data);
  try {
    const filePath = path.join(DATA_DIR, filename);
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`;
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, serialized, 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err: any) {
    // Non-fatal fallback to in-memory store
  }
}

// Initial seed written response for Alex Rivera
const initialWrittenResponses: WrittenResponseRecord[] = [
  {
    id: 'wres_alex_01',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    activityId: 'act_alex_03',
    attemptId: 'att_alex_w1',
    questionId: 'q_ielts_w2_01',
    taskTitle: 'IELTS Academic Writing Task 2: Advanced Cohesion',
    taskPrompt: 'Some people believe that technological advances in artificial intelligence will eliminate human jobs and reduce individual agency. Others contend that AI democratizes creative production and empowers professionals. Discuss both views and give your opinion.',
    instructions: 'Write at least 250 words. Present a well-developed argument with relevant supporting examples and academic register.',
    writtenText: 'Throughout contemporary industrial history, transformative technological disruptions have perpetually ignited intense debates regarding societal equilibrium and human agency. While skeptics assert that synthetic intelligence will inevitably eradicate skilled occupations, proponents counter that emerging computational tools democratize creative problem-solving. This essay will examine both perspectives before establishing that generative systems augment rather than supplant human intellect.\n\nOn the one hand, valid concerns exist regarding labor displacement. Automated diagnostic algorithms and quantitative trading architectures operate at computational velocities unattainable by human practitioners. If organizations implement automation primarily for operational cost reduction without investing in workforce re-skilling, localized economic dislocation will undoubtedly manifest.\n\nNevertheless, historical precedent illustrates that mechanical instruments liberate human capital from routine tasks to focus on higher-order synthesis. In medicine, machine learning models analyze complex radiographic imagery, thereby granting clinicians greater temporal bandwidth to formulate compassionate therapeutic strategies. Similarly, in software engineering, automated code assistants relieve engineers of repetitive boilerplate syntax, empowering them to architect resilient systemic infrastructures.\n\nIn conclusion, while technological disruption presents genuine labor challenges requiring proactive governance, generative intelligence fundamentally serves as an amplifier of human capacity rather than its replacement.',
    wordCount: 262,
    characterCount: 1782,
    writingDurationSec: 1680,
    evaluation: {
      taskAchievement: 'Band 8.5: Fully addresses all parts of the prompt with well-developed ideas and substantiated examples.',
      coherenceCohesion: 'Band 8.5: Cohesive devices are used naturally; logical paragraph progression is maintained throughout.',
      lexicalResource: 'Band 8.5: Sophisticated lexical items used with high precision ("computational velocities", "temporal bandwidth", "localized economic dislocation").',
      grammaticalAccuracy: 'Band 8.5: Wide range of complex sentence structures with accurate punctuation and consistent academic register.',
      bandScore: '8.5 Band'
    },
    score: '8.5 Band',
    feedback: 'Exemplary essay demonstrating formal academic vocabulary, nuanced thesis defense, and cohesive counter-argumentation.',
    corrections: [
      'Minor: Ensure consistent British/American orthography across all paragraphs.'
    ],
    vocabularyRecommendations: [
      'Consider using "paradigm shift" or "epistemic framework" for further lexical sophistication.'
    ],
    timestamp: '2026-11-01 15:30:00'
  }
];

export interface SessionRecord {
  token: string;
  userId: string;
  userRole: string;
  createdAt: number;
  expiresAt: number;
}

export const ServerStorage = {
  // --- Initialization & Health ---
  initialize: () => {
    // Seed users if file is missing
    const users = readJsonFile<UserAccount[]>('users.json', initialUsers);
    if (!users || users.length === 0) {
      writeJsonFileSync('users.json', initialUsers);
    }
    // Seed activities
    const acts = readJsonFile<UserActivityRecord[]>('activities.json', initialActivities);
    if (!acts || acts.length === 0) {
      writeJsonFileSync('activities.json', initialActivities);
    }
    // Seed question attempts
    const qAtts = readJsonFile<QuestionAttemptRecord[]>('question_attempts.json', initialQuestionAttempts);
    if (!qAtts || qAtts.length === 0) {
      writeJsonFileSync('question_attempts.json', initialQuestionAttempts);
    }
    // Seed written responses
    const wRes = readJsonFile<WrittenResponseRecord[]>('written_responses.json', initialWrittenResponses);
    if (!wRes || wRes.length === 0) {
      writeJsonFileSync('written_responses.json', initialWrittenResponses);
    }
    // Seed incomplete attempts
    readJsonFile<IncompleteAttemptRecord[]>('incomplete_attempts.json', []);
    console.log('[ServerStorage] Server storage vault initialized at:', DATA_DIR);
  },

  getHealthStats: () => {
    const users = readJsonFile<UserAccount[]>('users.json', []);
    const acts = readJsonFile<UserActivityRecord[]>('activities.json', []);
    const qAtts = readJsonFile<QuestionAttemptRecord[]>('question_attempts.json', []);
    const wRes = readJsonFile<WrittenResponseRecord[]>('written_responses.json', []);
    const incAtts = readJsonFile<IncompleteAttemptRecord[]>('incomplete_attempts.json', []);
    return {
      status: 'healthy',
      storageVault: DATA_DIR,
      totalUsers: users.length,
      totalActivities: acts.length,
      totalQuestionAttempts: qAtts.length,
      totalWrittenResponses: wRes.length,
      activeIncompleteAttempts: incAtts.length,
      serverTime: new Date().toISOString()
    };
  },

  // --- Session Persistence ---
  getSessions: (): SessionRecord[] => {
    return readJsonFile<SessionRecord[]>('sessions.json', []);
  },

  saveSession: (session: SessionRecord): void => {
    const sessions = ServerStorage.getSessions().filter((s) => s.token !== session.token && Date.now() <= s.expiresAt);
    sessions.push(session);
    writeJsonFileSync('sessions.json', sessions);
  },

  removeSession: (token: string): void => {
    const sessions = ServerStorage.getSessions().filter((s) => s.token !== token);
    writeJsonFileSync('sessions.json', sessions);
  },

  // --- User Management ---
  getUsers: (): UserAccount[] => {
    return readJsonFile<UserAccount[]>('users.json', initialUsers);
  },

  getUserById: (id: string): UserAccount | null => {
    const users = readJsonFile<UserAccount[]>('users.json', initialUsers);
    return users.find((u) => u.id === id) || null;
  },

  getUserByIdentifier: (identifier: string): UserAccount | null => {
    const clean = identifier.trim().toLowerCase();
    const users = readJsonFile<UserAccount[]>('users.json', initialUsers);
    return (
      users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === clean) ||
          u.email.toLowerCase() === clean ||
          u.name.toLowerCase() === clean
      ) || null
    );
  },

  createUser: async (user: UserAccount): Promise<UserAccount> => {
    return mutex.dispatch(() => {
      const users = readJsonFile<UserAccount[]>('users.json', initialUsers);
      const cleanEmail = user.email.trim().toLowerCase();
      const cleanUsername = (user.username || '').trim().toLowerCase();
      const cleanName = user.name.trim().toLowerCase();

      // Enforce strict uniqueness across devices
      const existing = users.find(
        (u) =>
          u.id === user.id ||
          u.email.toLowerCase() === cleanEmail ||
          (u.username && u.username.toLowerCase() === cleanUsername) ||
          u.name.trim().toLowerCase() === cleanName
      );

      if (existing) {
        throw new Error(`An account already exists with this email, username, or name.`);
      }

      const serverUser: UserAccount = {
        ...user,
        createdAt: user.createdAt || new Date().toISOString().slice(0, 10),
        lastLoginAt: user.lastLoginAt || new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      users.unshift(serverUser);
      writeJsonFileSync('users.json', users);
      return serverUser;
    });
  },

  updateUser: async (id: string, updates: Partial<UserAccount>): Promise<UserAccount> => {
    return mutex.dispatch(() => {
      const users = readJsonFile<UserAccount[]>('users.json', initialUsers);
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error(`User not found with id ${id}`);
      }
      const updated = {
        ...users[index],
        ...updates,
        id: users[index].id // immutable id
      };
      users[index] = updated;
      writeJsonFileSync('users.json', users);
      return updated;
    });
  },

  // --- Activities ---
  getActivities: (filter?: {
    userId?: string;
    examType?: string;
    module?: string;
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { items: UserActivityRecord[]; total: number } => {
    let acts = readJsonFile<UserActivityRecord[]>('activities.json', initialActivities);

    if (filter?.userId) {
      acts = acts.filter((a) => a.userId === filter.userId);
    }
    if (filter?.examType && filter.examType !== 'all') {
      const et = filter.examType.toLowerCase();
      acts = acts.filter((a) => (a.examType || '').toLowerCase().includes(et) || a.category.toLowerCase().includes(et));
    }
    if (filter?.module && filter.module !== 'all') {
      const m = filter.module.toLowerCase();
      acts = acts.filter((a) => (a.module || '').toLowerCase().includes(m) || a.title.toLowerCase().includes(m));
    }
    if (filter?.category && filter.category !== 'all') {
      const c = filter.category.toLowerCase();
      acts = acts.filter((a) => a.category.toLowerCase().includes(c));
    }
    if (filter?.status && filter.status !== 'all') {
      acts = acts.filter((a) => a.status === filter.status);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      acts = acts.filter((a) => a.title.toLowerCase().includes(s) || a.details.toLowerCase().includes(s));
    }

    // Sort by timestamp descending
    acts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = acts.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || total;
    const paginated = acts.slice(offset, offset + limit);

    return { items: paginated, total };
  },

  getActivityById: (id: string): UserActivityRecord | null => {
    const acts = readJsonFile<UserActivityRecord[]>('activities.json', initialActivities);
    return acts.find((a) => a.id === id) || null;
  },

  saveActivity: async (activity: UserActivityRecord): Promise<UserActivityRecord> => {
    return mutex.dispatch(() => {
      const acts = readJsonFile<UserActivityRecord[]>('activities.json', initialActivities);
      const index = acts.findIndex((a) => a.id === activity.id);
      const serverAct: UserActivityRecord = {
        ...activity,
        id: activity.id || `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: activity.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      if (index >= 0) {
        acts[index] = serverAct;
      } else {
        acts.unshift(serverAct);
      }
      writeJsonFileSync('activities.json', acts);
      return serverAct;
    });
  },

  // --- Question Attempts ---
  getQuestionAttempts: (filter?: {
    userId?: string;
    testId?: string;
    activityId?: string;
  }): QuestionAttemptRecord[] => {
    let attempts = readJsonFile<QuestionAttemptRecord[]>('question_attempts.json', initialQuestionAttempts);
    if (filter?.userId) {
      attempts = attempts.filter((q) => q.userId === filter.userId);
    }
    if (filter?.testId) {
      attempts = attempts.filter((q) => q.testId === filter.testId);
    }
    // Sort descending by timestamp then by questionNumber
    attempts.sort((a, b) => {
      const timeDiff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.questionNumber - b.questionNumber;
    });
    return attempts;
  },

  saveQuestionAttempt: async (attempt: QuestionAttemptRecord): Promise<QuestionAttemptRecord> => {
    return mutex.dispatch(() => {
      const attempts = readJsonFile<QuestionAttemptRecord[]>('question_attempts.json', initialQuestionAttempts);
      const serverAttempt: QuestionAttemptRecord = {
        ...attempt,
        id: attempt.id || `qatt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: attempt.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      attempts.unshift(serverAttempt);
      writeJsonFileSync('question_attempts.json', attempts);
      return serverAttempt;
    });
  },

  saveBatchQuestionAttempts: async (newAttempts: QuestionAttemptRecord[]): Promise<QuestionAttemptRecord[]> => {
    return mutex.dispatch(() => {
      const attempts = readJsonFile<QuestionAttemptRecord[]>('question_attempts.json', initialQuestionAttempts);
      const stamped = newAttempts.map((q) => ({
        ...q,
        id: q.id || `qatt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: q.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
      }));
      attempts.unshift(...stamped);
      writeJsonFileSync('question_attempts.json', attempts);
      return stamped;
    });
  },

  // --- Written Responses ---
  getWrittenResponses: (filter?: {
    userId?: string;
    activityId?: string;
  }): WrittenResponseRecord[] => {
    let list = readJsonFile<WrittenResponseRecord[]>('written_responses.json', initialWrittenResponses);
    if (filter?.userId) {
      list = list.filter((w) => w.userId === filter.userId);
    }
    if (filter?.activityId) {
      list = list.filter((w) => w.activityId === filter.activityId);
    }
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list;
  },

  saveWrittenResponse: async (response: WrittenResponseRecord): Promise<WrittenResponseRecord> => {
    return mutex.dispatch(() => {
      const list = readJsonFile<WrittenResponseRecord[]>('written_responses.json', initialWrittenResponses);
      const index = list.findIndex((w) => w.id === response.id);
      const serverRecord: WrittenResponseRecord = {
        ...response,
        id: response.id || `wres_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: response.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      if (index >= 0) {
        list[index] = serverRecord;
      } else {
        list.unshift(serverRecord);
      }
      writeJsonFileSync('written_responses.json', list);
      return serverRecord;
    });
  },

  // --- Autosave & Incomplete Attempt Recovery ---
  getIncompleteAttempt: (userId: string, testId?: string): IncompleteAttemptRecord | null => {
    const list = readJsonFile<IncompleteAttemptRecord[]>('incomplete_attempts.json', []);
    if (testId) {
      return list.find((item) => item.userId === userId && item.testId === testId) || null;
    }
    // Return latest incomplete attempt for this user
    const userAttempts = list.filter((item) => item.userId === userId);
    userAttempts.sort((a, b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime());
    return userAttempts[0] || null;
  },

  saveIncompleteAttempt: async (attempt: IncompleteAttemptRecord): Promise<IncompleteAttemptRecord> => {
    return mutex.dispatch(() => {
      const list = readJsonFile<IncompleteAttemptRecord[]>('incomplete_attempts.json', []);
      const index = list.findIndex((item) => item.userId === attempt.userId && item.testId === attempt.testId);
      const serverAttempt: IncompleteAttemptRecord = {
        ...attempt,
        id: attempt.id || `inc_${attempt.userId}_${attempt.testId}`,
        lastSavedAt: new Date().toISOString()
      };

      if (index >= 0) {
        list[index] = serverAttempt;
      } else {
        list.unshift(serverAttempt);
      }
      writeJsonFileSync('incomplete_attempts.json', list);
      return serverAttempt;
    });
  },

  clearIncompleteAttempt: async (userId: string, testId?: string): Promise<boolean> => {
    return mutex.dispatch(() => {
      let list = readJsonFile<IncompleteAttemptRecord[]>('incomplete_attempts.json', []);
      if (testId) {
        list = list.filter((item) => !(item.userId === userId && item.testId === testId));
      } else {
        list = list.filter((item) => item.userId !== userId);
      }
      writeJsonFileSync('incomplete_attempts.json', list);
      return true;
    });
  },

  // --- "Show Attempt" Reconstructed Attempt Detail ---
  getAttemptDetail: (
    activityId: string,
    requestingUserId?: string,
    requestingUserRole?: string
  ): AttemptDetailResponse => {
    const activity = ServerStorage.getActivityById(activityId);
    if (!activity) {
      throw new Error(`Activity not found: ${activityId}`);
    }

    // Security & Authorization check:
    // Only the owner of the activity or an administrator can access this attempt
    if (requestingUserRole !== 'admin' && requestingUserId && activity.userId !== requestingUserId) {
      const err = new Error('Unauthorized: You do not have permission to view another user’s attempt.');
      (err as any).statusCode = 403;
      throw err;
    }

    // Match question attempts by testId / subId or activityId
    const testId = activity.replayPayload?.subId || activity.id;
    let questions = ServerStorage.getQuestionAttempts({ userId: activity.userId, testId });
    if (questions.length === 0) {
      // Search all question attempts for this user that match the activity timestamp range or title
      const allUserQuestions = ServerStorage.getQuestionAttempts({ userId: activity.userId });
      questions = allUserQuestions.filter(
        (q) => q.testId === testId || q.testTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15))
      );
    }

    // Match written response
    let written = ServerStorage.getWrittenResponses({ userId: activity.userId, activityId });
    if (written.length === 0) {
      const allWritten = ServerStorage.getWrittenResponses({ userId: activity.userId });
      written = allWritten.filter(
        (w) => w.activityId === activity.id || (testId && w.taskTitle.toLowerCase().includes(activity.title.toLowerCase().slice(0, 15)))
      );
    }
    const writtenResponse = written[0] || undefined;

    // Calculate summary statistics
    const totalQ = questions.length || 1;
    const correctQ = questions.filter((q) => q.isCorrect).length;
    const percentage = questions.length > 0 ? Math.round((correctQ / totalQ) * 100) : 100;
    const scoreText = typeof activity.score === 'string' ? activity.score : `${activity.score || percentage}%`;

    return {
      activity,
      questions,
      writtenResponse,
      summary: {
        scoreText,
        percentage,
        timeSpent: activity.durationSec ? `${Math.round(activity.durationSec / 60)} mins` : 'Timed Session',
        accuracyText: `${correctQ} / ${totalQ} Correct`,
        evaluationBadge: percentage >= 80 ? 'Mastery Achieved' : percentage >= 60 ? 'Proficient' : 'Needs Practice'
      }
    };
  },

  // --- Admin User Full History Inspector ---
  getUserFullHistory: (userId: string) => {
    const user = ServerStorage.getUserById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    const activities = ServerStorage.getActivities({ userId }).items;
    const questionAttempts = ServerStorage.getQuestionAttempts({ userId });
    const writtenResponses = ServerStorage.getWrittenResponses({ userId });
    const incompleteAttempt = ServerStorage.getIncompleteAttempt(userId);

    // Compute aggregated metrics
    const totalActivities = activities.length;
    const totalPracticeTests = activities.filter((a) => a.type === 'practice_test').length;
    const totalQuizzes = activities.filter((a) => a.type === 'quiz').length;
    const totalMockTests = activities.filter((a) => a.type === 'mock_test').length;
    const totalQuestions = questionAttempts.length;
    const correctQuestions = questionAttempts.filter((q) => q.isCorrect).length;
    const overallAccuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return {
      user,
      metrics: {
        totalActivities,
        totalPracticeTests,
        totalQuizzes,
        totalMockTests,
        totalQuestions,
        correctQuestions,
        overallAccuracy: `${overallAccuracy}%`
      },
      activities,
      questionAttempts,
      writtenResponses,
      incompleteAttempt
    };
  }
};

// Initialize server storage safely upon loading
try {
  ServerStorage.initialize();
} catch (e: any) {
  console.warn('[ServerStorage] Safe load note:', e.message);
}

