import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ServerStorage } from './storage';
import { UserAccount } from '../src/types';

export const serverApp = express();

// Enable CORS and JSON parsing
serverApp.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

serverApp.use(express.json({ limit: '15mb' }));
serverApp.use(express.urlencoded({ extended: true, limit: '15mb' }));

// In-memory session token store (mapping token -> { userId, createdAt, expiresAt })
interface SessionInfo {
  token: string;
  userId: string;
  userRole: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionInfo>();

// Seed permanent testing tokens for seed users (for automated tests and cross-device testing)
const TEST_TOKENS: Record<string, string> = {
  'usr_admin_01': 'test_token_admin_david_kim_secure',
  'usr_student_01': 'test_token_student_alex_rivera_secure',
  'usr_teacher_01': 'test_token_teacher_dr_vance_secure',
  'usr_parent_01': 'test_token_parent_maria_santos_secure'
};

Object.entries(TEST_TOKENS).forEach(([userId, token]) => {
  const user = ServerStorage.getUserById(userId);
  if (user) {
    activeSessions.set(token, {
      token,
      userId: user.id,
      userRole: user.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 3600 * 1000 // 30 days
    });
  }
});

function createSessionToken(user: UserAccount): string {
  const token = `eb_tok_${crypto.randomUUID().replace(/-/g, '')}`;
  activeSessions.set(token, {
    token,
    userId: user.id,
    userRole: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 3600 * 1000 // 7 days
  });
  return token;
}

// Authentication Middleware
export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token: string | undefined;

  if (typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
    return;
  }

  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ success: false, error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  const user = ServerStorage.getUserById(session.userId);
  if (!user || user.status === 'disabled') {
    res.status(403).json({ success: false, error: 'Account disabled or not found.' });
    return;
  }

  req.user = user;
  next();
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden: Administrator privileges required.' });
    return;
  }
  next();
};

// ==================== HEALTH ====================
serverApp.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    ...ServerStorage.getHealthStats()
  });
});

// ==================== AUTHENTICATION ====================
serverApp.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dateOfBirth, role, preferences } = req.body;

    if (!name || !email || !password || !dateOfBirth) {
      res.status(400).json({ success: false, error: 'Name, email, password, and dateOfBirth are required.' });
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanName.toLowerCase().replace(/\s+/g, '.')).trim().toLowerCase();

    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: password.trim(),
      dateOfBirth,
      role: role || 'student',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      lastLoginAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
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
        fontScale: 'standard',
        simplifiedInterface: false,
        ...preferences
      },
      profileStats: {
        currentStreak: 1,
        highestStreak: 1,
        xp: 50,
        level: 1,
        league: 'Bronze',
        hearts: 5,
        maxHearts: 5,
        todayXp: 50
      }
    };

    const created = await ServerStorage.createUser(newUser);
    const token = createSessionToken(created);

    res.status(201).json({
      success: true,
      user: created,
      token
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Registration failed.' });
  }
});

serverApp.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ success: false, error: 'Identifier and password are required.' });
      return;
    }

    const user = ServerStorage.getUserByIdentifier(identifier);
    if (!user) {
      res.status(404).json({ success: false, error: `No account found for "${identifier}".` });
      return;
    }

    if (user.status === 'disabled') {
      res.status(403).json({ success: false, error: 'This account has been disabled by the system administrator.' });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ success: false, error: 'Incorrect password.' });
      return;
    }

    // Update lastLoginAt
    const updated = await ServerStorage.updateUser(user.id, {
      lastLoginAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    });

    const token = createSessionToken(updated);
    res.json({
      success: true,
      user: updated,
      token
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Login failed.' });
  }
});

serverApp.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

serverApp.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token: string | undefined;
  if (typeof authHeader === 'string') {
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  }
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ==================== USER MANAGEMENT ====================
serverApp.get('/api/users', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = ServerStorage.getUsers();
  // Decorate with activity counts
  const decorated = users.map((u) => {
    const activities = ServerStorage.getActivities({ userId: u.id }).items;
    const qAttempts = ServerStorage.getQuestionAttempts({ userId: u.id });
    const correct = qAttempts.filter((q) => q.isCorrect).length;
    return {
      ...u,
      metrics: {
        totalActivities: activities.length,
        totalPracticeTests: activities.filter((a) => a.type === 'practice_test').length,
        totalQuizzes: activities.filter((a) => a.type === 'quiz').length,
        totalMockTests: activities.filter((a) => a.type === 'mock_test').length,
        averageAccuracy: qAttempts.length > 0 ? `${Math.round((correct / qAttempts.length) * 100)}%` : 'N/A'
      }
    };
  });
  res.json({ success: true, items: decorated, total: decorated.length });
});

serverApp.get('/api/users/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  // Non-admins can only retrieve their own profile
  if (req.user?.role !== 'admin' && req.user?.id !== id) {
    res.status(403).json({ success: false, error: 'Unauthorized to view this user profile.' });
    return;
  }
  const user = ServerStorage.getUserById(id);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }
  res.json({ success: true, user });
});

serverApp.put('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      res.status(403).json({ success: false, error: 'Unauthorized to update this user profile.' });
      return;
    }
    const updated = await ServerStorage.updateUser(id, req.body);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== ACTIVITIES ====================
serverApp.get('/api/activities', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { userId, examType, module, category, status, search, limit, offset } = req.query;

  // Regular users are locked to their own userId
  const effectiveUserId = req.user?.role === 'admin' && typeof userId === 'string' ? userId : req.user?.id;

  const result = ServerStorage.getActivities({
    userId: effectiveUserId,
    examType: typeof examType === 'string' ? examType : undefined,
    module: typeof module === 'string' ? module : undefined,
    category: typeof category === 'string' ? category : undefined,
    status: typeof status === 'string' ? status : undefined,
    search: typeof search === 'string' ? search : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined
  });

  res.json({ success: true, ...result });
});

serverApp.post('/api/activities', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activityData = req.body;
    // Enforce ownership
    if (req.user?.role !== 'admin') {
      activityData.userId = req.user?.id;
      activityData.userName = req.user?.name;
    }
    const saved = await ServerStorage.saveActivity(activityData);
    res.status(201).json({ success: true, activity: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

serverApp.get('/api/activities/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const activity = ServerStorage.getActivityById(req.params.id);
  if (!activity) {
    res.status(404).json({ success: false, error: 'Activity not found.' });
    return;
  }
  if (req.user?.role !== 'admin' && activity.userId !== req.user?.id) {
    res.status(403).json({ success: false, error: 'Unauthorized to view this activity.' });
    return;
  }
  res.json({ success: true, activity });
});

// ==================== "SHOW ATTEMPT" ENDPOINT ====================
serverApp.get('/api/activities/:id/show-attempt', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const detail = ServerStorage.getAttemptDetail(id, req.user?.id, req.user?.role);
    res.json({ success: true, data: detail });
  } catch (err: any) {
    const statusCode = err.statusCode || (err.message.includes('not found') ? 404 : 403);
    res.status(statusCode).json({ success: false, error: err.message });
  }
});

// ==================== QUESTION ATTEMPTS ====================
serverApp.get('/api/attempts/questions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { userId, testId, activityId } = req.query;
  const effectiveUserId = req.user?.role === 'admin' && typeof userId === 'string' ? userId : req.user?.id;

  const questions = ServerStorage.getQuestionAttempts({
    userId: effectiveUserId,
    testId: typeof testId === 'string' ? testId : undefined,
    activityId: typeof activityId === 'string' ? activityId : undefined
  });

  res.json({ success: true, items: questions, total: questions.length });
});

serverApp.post('/api/attempts/questions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;
    if (Array.isArray(payload)) {
      // Batch save
      const sanitized = payload.map((q) => ({
        ...q,
        userId: req.user?.role === 'admin' ? q.userId || req.user?.id : req.user?.id,
        userName: req.user?.role === 'admin' ? q.userName || req.user?.name : req.user?.name
      }));
      const saved = await ServerStorage.saveBatchQuestionAttempts(sanitized);
      res.status(201).json({ success: true, count: saved.length, items: saved });
    } else {
      // Single save
      const single = {
        ...payload,
        userId: req.user?.role === 'admin' ? payload.userId || req.user?.id : req.user?.id,
        userName: req.user?.role === 'admin' ? payload.userName || req.user?.name : req.user?.name
      };
      const saved = await ServerStorage.saveQuestionAttempt(single);
      res.status(201).json({ success: true, item: saved });
    }
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== WRITTEN RESPONSES ====================
serverApp.get('/api/attempts/written', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { userId, activityId } = req.query;
  const effectiveUserId = req.user?.role === 'admin' && typeof userId === 'string' ? userId : req.user?.id;

  const responses = ServerStorage.getWrittenResponses({
    userId: effectiveUserId,
    activityId: typeof activityId === 'string' ? activityId : undefined
  });

  res.json({ success: true, items: responses, total: responses.length });
});

serverApp.post('/api/attempts/written', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    const sanitized = {
      ...data,
      userId: req.user?.role === 'admin' ? data.userId || req.user?.id : req.user?.id,
      userName: req.user?.role === 'admin' ? data.userName || req.user?.name : req.user?.name
    };
    const saved = await ServerStorage.saveWrittenResponse(sanitized);
    res.status(201).json({ success: true, item: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== AUTOSAVE & RECOVERY ====================
serverApp.get('/api/attempts/autosave/:userId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const { testId } = req.query;

  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    res.status(403).json({ success: false, error: 'Unauthorized to access this autosave record.' });
    return;
  }

  const attempt = ServerStorage.getIncompleteAttempt(userId, typeof testId === 'string' ? testId : undefined);
  res.json({ success: true, attempt });
});

serverApp.post('/api/attempts/autosave', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    const sanitized = {
      ...data,
      userId: req.user?.role === 'admin' ? data.userId || req.user?.id : req.user?.id
    };
    const saved = await ServerStorage.saveIncompleteAttempt(sanitized);
    res.json({ success: true, attempt: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

serverApp.delete('/api/attempts/autosave/:userId/:testId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, testId } = req.params;
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      res.status(403).json({ success: false, error: 'Unauthorized.' });
      return;
    }
    await ServerStorage.clearIncompleteAttempt(userId, testId);
    res.json({ success: true, message: 'Autosave record cleared.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== ADMIN FULL USER HISTORY INSPECTOR ====================
serverApp.get('/api/admin/users/:userId/full-history', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const history = ServerStorage.getUserFullHistory(userId);
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});
