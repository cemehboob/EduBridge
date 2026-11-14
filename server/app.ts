import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { DbStorage, initializeDatabase, seedInitialData } from './db';
import { executeJobOnDatabase, executeAllDatabaseScheduledJobs } from './scheduler';
import { UserAccount, UserActivityRecord } from '../src/types';
import { EmailService } from './emailService';

// Lazy / background initialization of Prisma Postgres database on server startup
let dbInitialized = false;
export async function ensureDbInitialized(): Promise<void> {
  if (dbInitialized) return;
  try {
    await initializeDatabase();
    await seedInitialData();
    dbInitialized = true;
  } catch (err: any) {
    console.warn('[EduBridge DB Init Note]', err.message);
  }
}

// Trigger background initialization at runtime (avoid network calls during static build bundling)
if (!process.env.npm_lifecycle_event?.includes('build') && !process.argv.some((a) => a.includes('build'))) {
  ensureDbInitialized().catch(() => {});
}

// Alias DbStorage as ServerStorage for minimal code change throughout
const ServerStorage = {
  getSessions: () => DbStorage.getSessions(),
  saveSession: (s: any) => DbStorage.saveSession(s),
  findSession: (t: string) => DbStorage.findSession(t),
  removeSession: (t: string) => DbStorage.removeSession(t),
  getUsers: () => DbStorage.getUsers(),
  getUserById: (id: string) => DbStorage.getUserById(id),
  getUserByIdentifier: (id: string) => DbStorage.getUserByIdentifier(id),
  createUser: (u: UserAccount) => DbStorage.createUser(u),
  updateUser: (id: string, updates: Partial<UserAccount>) => DbStorage.updateUser(id, updates),
  getActivities: (filter?: any) => DbStorage.getActivities(filter),
  getActivityById: (id: string) => DbStorage.getActivityById(id),
  saveActivity: (a: any) => DbStorage.saveActivity(a),
  getQuestionAttempts: (filter?: any) => DbStorage.getQuestionAttempts(filter),
  saveQuestionAttempt: (q: any) => DbStorage.saveQuestionAttempt(q),
  saveBatchQuestionAttempts: (qs: any[]) => DbStorage.saveBatchQuestionAttempts(qs),
  getWrittenResponses: (filter?: any) => DbStorage.getWrittenResponses(filter),
  saveWrittenResponse: (w: any) => DbStorage.saveWrittenResponse(w),
  getIncompleteAttempt: (uid: string, tid?: string) => DbStorage.getIncompleteAttempt(uid, tid),
  saveIncompleteAttempt: (a: any) => DbStorage.saveIncompleteAttempt(a),
  clearIncompleteAttempt: (uid: string, tid?: string) => DbStorage.clearIncompleteAttempt(uid, tid),
  getAttemptDetail: (id: string, uid?: string, role?: string) => DbStorage.getAttemptDetail(id, uid, role),
  getUserFullHistory: (uid: string) => DbStorage.getUserFullHistory(uid),
  getHealthStats: () => DbStorage.getHealthStats(),
  getStandardTests: (filter?: any) => DbStorage.getStandardTests(filter),
  getStandardTestById: (id: string) => DbStorage.getStandardTestById(id),
  saveStandardTest: (t: any) => DbStorage.saveStandardTest(t),
  deleteStandardTest: (id: string) => DbStorage.deleteStandardTest(id),
  getQuizzes: (filter?: any) => DbStorage.getQuizzes(filter),
  getQuizById: (id: string) => DbStorage.getQuizById(id),
  saveQuiz: (q: any) => DbStorage.saveQuiz(q),
  saveBatchQuizzes: (qs: any[]) => DbStorage.saveBatchQuizzes(qs),
  getAllConfigurations: () => DbStorage.getAllConfigurations(),
  getConfiguration: (k: string) => DbStorage.getConfiguration(k),
  setConfiguration: (k: string, v: any, cat?: string, desc?: string, by?: string) => DbStorage.setConfiguration(k, v, cat, desc, by),
  getScheduledJobs: () => DbStorage.getScheduledJobs(),
  updateScheduledJob: (id: string, updates: any) => DbStorage.updateScheduledJob(id, updates),
  createOtp: (r: any) => DbStorage.createOtp(r),
  getOtp: (e: string, t: any) => DbStorage.getOtp(e, t),
  incrementOtpAttempts: (id: string) => DbStorage.incrementOtpAttempts(id),
  markOtpVerified: (id: string) => DbStorage.markOtpVerified(id),
  invalidateOtp: (id: string) => DbStorage.invalidateOtp(id),
  getOtpLogs: (l?: number) => DbStorage.getOtpLogs(l)
};

export const serverApp = express();

// Enable CORS and JSON parsing
serverApp.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token, x-user-id, x-client-device');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

serverApp.use(express.json({ limit: '15mb' }));
serverApp.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure database tables and initial data are verified on cold-start requests
serverApp.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!dbInitialized && process.env.DATABASE_URL) {
    await ensureDbInitialized().catch(() => {});
  }
  next();
});

// Persistent & In-memory session token store (mapping token -> { userId, createdAt, expiresAt })
interface SessionInfo {
  token: string;
  userId: string;
  userRole: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionInfo>();

// Load persisted sessions from DB on startup (async background)
DbStorage.getSessions().then((persistedSessions) => {
  persistedSessions.forEach((sess) => {
    if (Date.now() <= sess.expiresAt) {
      activeSessions.set(sess.token, sess as SessionInfo);
    }
  });
}).catch(() => {/* DB may not be ready yet — sessions will be loaded on first auth request */});

// Seed permanent testing tokens for seed users (async)
async function seedTestTokens() {
  const TEST_TOKENS: Record<string, string> = {
    'usr_admin_01': 'test_token_admin_david_kim_secure',
    'usr_student_01': 'test_token_student_alex_rivera_secure',
    'usr_teacher_01': 'test_token_teacher_dr_vance_secure',
    'usr_parent_01': 'test_token_parent_maria_santos_secure'
  };

  for (const [userId, token] of Object.entries(TEST_TOKENS)) {
    try {
      const user = await DbStorage.getUserById(userId);
      if (user) {
        const sessionRecord: SessionInfo = {
          token,
          userId: user.id,
          userRole: user.role,
          createdAt: Date.now(),
          expiresAt: Date.now() + 365 * 24 * 3600 * 1000
        };
        activeSessions.set(token, sessionRecord);
        await DbStorage.saveSession(sessionRecord);
      }
    } catch {}
  }
}
// Seed test tokens after DB is initialized (unref so timer does not block process exit)
if (!process.env.npm_lifecycle_event?.includes('build') && !process.argv.some((a) => a.includes('build'))) {
  const tokenTimer = setTimeout(() => seedTestTokens().catch(() => {}), 3000);
  if (tokenTimer.unref) tokenTimer.unref();
}

async function createSessionToken(user: UserAccount): Promise<string> {
  const token = `eb_tok_${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionRecord: SessionInfo = {
    token,
    userId: user.id,
    userRole: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 3600 * 1000 // 30 days
  };
  activeSessions.set(token, sessionRecord);
  try {
    await DbStorage.saveSession(sessionRecord);
  } catch (err: any) {
    console.warn('[ServerApp] Failed saving session to DB:', err.message);
  }
  return token;
}

// In-memory OTP Store for email verification and password reset
interface OtpRecord {
  id: string;
  email: string;
  otpHash: string;
  rawOtp?: string;
  purpose: 'REGISTRATION' | 'PASSWORD_RESET';
  createdAt: number;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  lastSentAt: number;
  resendAvailableAt: number;
  consumed: boolean;
  registrationData?: Partial<UserAccount>;
}

const activeOtps = new Map<string, OtpRecord>();

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

// Authentication Middleware
export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token: string | undefined;

  if (typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // 1. Verify token against activeSessions or persistent DB
  if (token) {
    let session = activeSessions.get(token);
    if (!session) {
      try {
        const persisted = await DbStorage.findSession(token);
        if (persisted) {
          session = { token, ...persisted } as SessionInfo;
          activeSessions.set(token, session);
        }
      } catch {}
    }

    if (session && Date.now() <= session.expiresAt) {
      try {
        const user = await DbStorage.getUserById(session.userId);
        if (user && user.status !== 'disabled') {
          req.user = user;
          return next();
        }
      } catch {}
    }
  }

  // 2. Fallback: x-user-id header from trusted device/browser
  const userIdHeader = req.headers['x-user-id'];
  if (typeof userIdHeader === 'string' && userIdHeader.trim()) {
    const cleanId = userIdHeader.trim();
    try {
      const user = await DbStorage.getUserById(cleanId) || await DbStorage.getUserByIdentifier(cleanId);
      if (user && user.status !== 'disabled') {
        req.user = user;
        return next();
      }
    } catch {}
  }

  if (!token && !userIdHeader) {
    res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
    return;
  }

  res.status(401).json({ success: false, error: 'Session expired or invalid. Please sign in again.' });
};

// Permissive Authentication Middleware for Cross-Machine Activity Logging & Real-Time Sync
const authenticateTokenOptional = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token: string | undefined;

  if (typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  // 1. Verify token against activeSessions or persistent DB
  if (token) {
    let session = activeSessions.get(token);
    if (!session) {
      try {
        const persisted = await DbStorage.findSession(token);
        if (persisted) {
          session = { token, ...persisted } as SessionInfo;
          activeSessions.set(token, session);
        }
      } catch {}
    }

    if (session && Date.now() <= session.expiresAt) {
      try {
        const user = await DbStorage.getUserById(session.userId);
        if (user && user.status !== 'disabled') {
          req.user = user;
          return next();
        }
      } catch {}
    }
  }

  // 2. Fallback: x-user-id header from trusted device/browser
  const userIdHeader = req.headers['x-user-id'];
  if (typeof userIdHeader === 'string' && userIdHeader.trim()) {
    const cleanId = userIdHeader.trim();
    try {
      const user = await DbStorage.getUserById(cleanId) || await DbStorage.getUserByIdentifier(cleanId);
      if (user && user.status !== 'disabled') {
        req.user = user;
        return next();
      }
    } catch {}
  }

  // Allow through so cross-machine telemetry and activity sync are never dropped
  return next();
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden: Administrator privileges required.' });
    return;
  }
  next();
};

// ==================== HEALTH ====================
serverApp.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const stats = await DbStorage.getHealthStats();
    res.json({ success: true, ...stats });
  } catch (err: any) {
    res.json({ success: true, status: 'starting', storageVault: 'Prisma Postgres', serverTime: new Date().toISOString() });
  }
});

// ==================== AUTHENTICATION ====================
serverApp.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dateOfBirth, role, preferences, otp } = req.body;

    if (!name || !email || !password || !dateOfBirth) {
      res.status(400).json({ success: false, error: 'Name, email, password, and dateOfBirth are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Enforce strict OTP verification to prevent unauthorized account creation
    if (!otp) {
      res.status(400).json({
        success: false,
        error: 'Registration requires 6-digit email OTP verification. Please request a verification code via /api/auth/register/request-otp.'
      });
      return;
    }

    const cleanOtp = String(otp).trim();
    const record = await DbStorage.getOtp(cleanEmail, 'REGISTRATION');
    if (!record) {
      res.status(400).json({
        success: false,
        error: 'No active registration OTP found for this email. Please request a new verification code.'
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      await DbStorage.invalidateOtp(record.id);
      res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.'
      });
      return;
    }

    if (record.attempts >= record.maxAttempts) {
      await DbStorage.invalidateOtp(record.id);
      res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this verification code has been invalidated. Please request a new one.'
      });
      return;
    }

    if (hashOtp(cleanOtp) !== record.otpHash) {
      const newAttempts = await DbStorage.incrementOtpAttempts(record.id);
      const remaining = Math.max(0, record.maxAttempts - newAttempts);
      res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining} attempts remaining.`
      });
      return;
    }

    // OTP is valid! Mark verified in database
    await DbStorage.markOtpVerified(record.id);

    const cleanName = name.trim();
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
      emailVerified: true,
      emailVerificationStatus: 'verified',
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

    const created = await DbStorage.createUser(newUser);
    const token = await createSessionToken(created);

    // Record registration activity in the database activities table
    try {
      const regActivity: UserActivityRecord = {
        id: `act_reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: created.id,
        userName: created.name,
        userRole: created.role,
        cohort: created.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        title: `${created.name} Registered Account`,
        action: `New ${created.role.toUpperCase()} registered on EduBridge`,
        module: 'Authentication',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed',
        score: 'Registered',
        details: `${created.name} (${created.email}) created account as ${created.role.toUpperCase()}. User initialized in system.`,
        relativeTime: 'Just now'
      };
      await DbStorage.saveActivity(regActivity);
    } catch (actErr: any) {
      console.warn('[ServerApp] Registration activity recording note:', actErr.message);
    }

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

    const user = await DbStorage.getUserByIdentifier(identifier);
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
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updated = await DbStorage.updateUser(user.id, {
      lastLoginAt: nowIso
    });

    const token = await createSessionToken(updated);

    // Record login activity in the database activities table for live multi-machine admin visibility
    try {
      const loginActivity: UserActivityRecord = {
        id: `act_login_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: updated.id,
        userName: updated.name,
        userRole: updated.role,
        cohort: updated.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        title: `${updated.name} Logged In`,
        action: `Signed in to EduBridge platform (${updated.role.toUpperCase()})`,
        module: 'Authentication',
        timestamp: nowIso,
        status: 'completed',
        score: 'Online',
        details: `${updated.name} (${updated.email}) authenticated as ${updated.role.toUpperCase()}. User is now online and active in the system.`,
        relativeTime: 'Just now'
      };
      await DbStorage.saveActivity(loginActivity);
    } catch (actErr: any) {
      console.warn('[ServerApp] Login activity recording note:', actErr.message);
    }

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

serverApp.post('/api/auth/logout', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers['authorization'] || req.headers['x-auth-token'];
  let token: string | undefined;
  if (typeof authHeader === 'string') {
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  }
  if (token) {
    activeSessions.delete(token);
    try {
      await DbStorage.removeSession(token);
    } catch {}
  }

  // Record logout activity in database
  if (req.user) {
    try {
      const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const logoutActivity: UserActivityRecord = {
        id: `act_logout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        cohort: req.user.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        title: `${req.user.name} Logged Out`,
        action: `Signed out of EduBridge platform (${req.user.role.toUpperCase()})`,
        module: 'Authentication',
        timestamp: nowIso,
        status: 'completed',
        score: 'Offline',
        details: `${req.user.name} signed out and ended session.`,
        relativeTime: 'Just now'
      };
      await DbStorage.saveActivity(logoutActivity);
    } catch {}
  }

  res.json({ success: true, message: 'Logged out successfully.' });
});

// Automatic Cross-Machine Session Synchronization
serverApp.post('/api/auth/session-sync', async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body;
    let user: UserAccount | null = null;
    if (userId) user = await DbStorage.getUserById(userId);
    if (!user && email) user = await DbStorage.getUserByIdentifier(email);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found in central server repository.' });
      return;
    }

    if (user.status === 'disabled') {
      res.status(403).json({ success: false, error: 'User account has been disabled.' });
      return;
    }

    const token = await createSessionToken(user);
    res.json({ success: true, user, token });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Session synchronization failed.' });
  }
});

// ==================== OTP AUTHENTICATION & VERIFICATION ====================

// Request Registration OTP
serverApp.post('/api/auth/register/request-otp', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, dateOfBirth, role, preferences } = req.body;

    if (!name || !email || !password || !dateOfBirth) {
      res.status(400).json({ success: false, error: 'Name, email, password, and dateOfBirth are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ success: false, error: 'Invalid email address format.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await DbStorage.getUserByIdentifier(cleanEmail);
    if (existingUser) {
      res.status(409).json({ success: false, error: `An account with email "${cleanEmail}" is already registered. Please sign in instead.` });
      return;
    }

    const cleanName = name.trim();
    const cleanUsername = (username || cleanName.toLowerCase().replace(/\s+/g, '.')).trim().toLowerCase();

    // Rate-limiting: minimum 60 seconds between OTP requests per email stored in database
    const existingOtp = await DbStorage.getOtp(cleanEmail, 'REGISTRATION');
    if (existingOtp && Date.now() - existingOtp.lastSentAt < 60000) {
      const waitSecs = Math.ceil((60000 - (Date.now() - existingOtp.lastSentAt)) / 1000);
      res.status(429).json({
        success: false,
        error: `Please wait ${waitSecs} seconds before requesting another verification code.`
      });
      return;
    }

    // Generate 6-digit cryptographic random OTP
    const otp = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
    const now = Date.now();

    // Store OTP record directly in database table auth_otps
    await DbStorage.createOtp({
      id: `otp_${now}_${crypto.randomBytes(3).toString('hex')}`,
      email: cleanEmail,
      type: 'REGISTRATION',
      otpCode: otp,
      otpHash: hashOtp(otp),
      attempts: 0,
      maxAttempts: 5,
      expiresAt: now + 10 * 60 * 1000, // 10 minutes
      createdAt: now,
      lastSentAt: now,
      status: 'active',
      metadata: {
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: password.trim(),
        dateOfBirth,
        role: role || 'student',
        preferences
      }
    });

    const emailSent = await EmailService.sendRegistrationOtp(cleanEmail, cleanName, otp);

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox and enter the code to complete registration.`,
      email: cleanEmail,
      expiresInSeconds: 600,
      deliveryStatus: emailSent ? 'dispatched' : 'simulated'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to dispatch registration OTP.' });
  }
});

// Verify Registration OTP & Complete Account Setup
serverApp.post('/api/auth/register/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, error: 'Email and 6-digit verification code are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Look up active OTP from database table auth_otps
    const record = await DbStorage.getOtp(cleanEmail, 'REGISTRATION');

    if (!record) {
      res.status(400).json({
        success: false,
        error: 'No active verification code found for this email. Please request a new code.'
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      await DbStorage.invalidateOtp(record.id);
      res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.'
      });
      return;
    }

    if (record.attempts >= record.maxAttempts) {
      await DbStorage.invalidateOtp(record.id);
      res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this verification code has been invalidated. Please request a new one.'
      });
      return;
    }

    if (hashOtp(cleanOtp) !== record.otpHash) {
      const newAttempts = await DbStorage.incrementOtpAttempts(record.id);
      const remaining = Math.max(0, record.maxAttempts - newAttempts);
      res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining} attempts remaining.`
      });
      return;
    }

    // OTP is valid! Mark verified in database
    await DbStorage.markOtpVerified(record.id);

    const regData = record.metadata!;
    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name: regData.name!,
      username: regData.username!,
      email: regData.email!,
      password: regData.password!,
      dateOfBirth: regData.dateOfBirth!,
      role: regData.role || 'student',
      status: 'active',
      emailVerified: true,
      emailVerificationStatus: 'verified',
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
        ...regData.preferences
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

    const created = await DbStorage.createUser(newUser);
    const token = await createSessionToken(created);

    // Record registration activity in the database activities table
    try {
      const regActivity: UserActivityRecord = {
        id: `act_reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: created.id,
        userName: created.name,
        userRole: created.role,
        cohort: created.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        title: `${created.name} Verified Email & Registered`,
        action: `New ${created.role.toUpperCase()} registered with verified OTP on EduBridge`,
        module: 'Authentication',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed',
        score: 'Verified & Registered',
        details: `${created.name} (${created.email}) verified OTP code and activated account.`,
        relativeTime: 'Just now'
      };
      await DbStorage.saveActivity(regActivity);
    } catch (actErr: any) {
      console.warn('[ServerApp] Registration activity recording note:', actErr.message);
    }

    // Send welcome confirmation asynchronously
    EmailService.sendRegistrationConfirmation(created.email, created.name).catch((e) =>
      console.warn('Welcome email dispatch note:', e)
    );

    res.status(201).json({
      success: true,
      message: 'Email successfully verified and account created.',
      user: created,
      token
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Verification failed.' });
  }
});

// Request Password Reset OTP
serverApp.post('/api/auth/password-reset/request-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email address is required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await DbStorage.getUserByIdentifier(cleanEmail);
    if (!user) {
      res.status(404).json({ success: false, error: `No registered account found with email "${cleanEmail}".` });
      return;
    }

    // Rate-limiting: minimum 60 seconds between OTP requests per email in database
    const existingOtp = await DbStorage.getOtp(cleanEmail, 'PASSWORD_RESET');
    if (existingOtp && Date.now() - existingOtp.lastSentAt < 60000) {
      const waitSecs = Math.ceil((60000 - (Date.now() - existingOtp.lastSentAt)) / 1000);
      res.status(429).json({
        success: false,
        error: `Please wait ${waitSecs} seconds before requesting another password reset code.`
      });
      return;
    }

    const otp = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
    const now = Date.now();

    // Store password reset OTP directly in database table auth_otps
    await DbStorage.createOtp({
      id: `otp_${now}_${crypto.randomBytes(3).toString('hex')}`,
      email: cleanEmail,
      type: 'PASSWORD_RESET',
      otpCode: otp,
      otpHash: hashOtp(otp),
      attempts: 0,
      maxAttempts: 5,
      expiresAt: now + 10 * 60 * 1000,
      createdAt: now,
      lastSentAt: now,
      status: 'active',
      metadata: { userId: user.id, userName: user.name }
    });

    const emailSent = await EmailService.sendPasswordResetOtp(cleanEmail, user.name, otp);

    res.json({
      success: true,
      message: `A password reset code has been dispatched to ${cleanEmail}. Please check your email inbox and enter the 6-digit code.`,
      expiresInSeconds: 600,
      deliveryStatus: emailSent ? 'dispatched' : 'simulated'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to dispatch password reset code.' });
  }
});

// Verify Password Reset OTP & Update Password
serverApp.post('/api/auth/password-reset/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword, validateOnly } = req.body;
    if (!email || !otp) {
      res.status(400).json({ success: false, error: 'Email address and 6-digit verification code are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Look up password reset OTP from database table auth_otps
    const record = await DbStorage.getOtp(cleanEmail, 'PASSWORD_RESET');

    if (!record) {
      res.status(400).json({
        success: false,
        error: 'No active password reset request found for this email. Please request a new code.'
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      await DbStorage.invalidateOtp(record.id);
      res.status(400).json({
        success: false,
        error: 'Password reset code has expired. Please request a new code.'
      });
      return;
    }

    if (record.attempts >= record.maxAttempts) {
      await DbStorage.invalidateOtp(record.id);
      res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this reset code has been invalidated. Please request a new code.'
      });
      return;
    }

    if (hashOtp(cleanOtp) !== record.otpHash) {
      const newAttempts = await DbStorage.incrementOtpAttempts(record.id);
      const remaining = Math.max(0, record.maxAttempts - newAttempts);
      res.status(400).json({
        success: false,
        error: `Incorrect reset code. ${remaining} attempts remaining.`
      });
      return;
    }

    // Code is valid! If user is pre-validating before typing new password, return success
    if (validateOnly || !newPassword) {
      res.json({
        success: true,
        verified: true,
        message: 'Verification code confirmed. You can now set your new password.'
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      return;
    }

    // Code is valid and new password provided! Mark verified in database
    await DbStorage.markOtpVerified(record.id);

    const user = await DbStorage.getUserByIdentifier(cleanEmail);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    await DbStorage.updateUser(user.id, {
      password: newPassword.trim(),
      emailVerified: true,
      emailVerificationStatus: 'verified'
    });

    // Record password reset activity in database
    try {
      const resetActivity: UserActivityRecord = {
        id: `act_pwd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        cohort: user.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        title: `${user.name} Reset Password`,
        action: `Password reset verified via OTP and updated in database`,
        module: 'Authentication',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed',
        score: 'Password Updated',
        details: `${user.name} (${user.email}) successfully reset account password with verified OTP.`,
        relativeTime: 'Just now'
      };
      await DbStorage.saveActivity(resetActivity);
    } catch (actErr: any) {
      console.warn('[ServerApp] Password reset activity recording note:', actErr.message);
    }

    EmailService.sendPasswordResetConfirmation(user.email, user.name).catch((e) =>
      console.warn('Confirmation email dispatch note:', e)
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Password reset failed.' });
  }
});

// ==================== USER MANAGEMENT ====================
serverApp.get('/api/users', authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await DbStorage.getUsers();
    const decorated = await Promise.all(users.map(async (u) => {
      const [activitiesResult, qAttempts] = await Promise.all([
        DbStorage.getActivities({ userId: u.id }),
        DbStorage.getQuestionAttempts({ userId: u.id })
      ]);
      const activities = activitiesResult.items;
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
    }));
    res.json({ success: true, items: decorated, total: decorated.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create user directly at the database level
serverApp.post('/api/users', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, username, email, password, dateOfBirth, role, status, preferences, profileStats } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
      return;
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanName.toLowerCase().replace(/\s+/g, '.')).trim().toLowerCase();

    // Check duplicate in database
    const existing = await DbStorage.getUserByIdentifier(cleanEmail);
    if (existing) {
      res.status(409).json({ success: false, error: `An account with email "${cleanEmail}" already exists.` });
      return;
    }

    const newUser: UserAccount = {
      id: req.body.id || `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: password.trim(),
      dateOfBirth: dateOfBirth || '2004-01-01',
      role: role || 'student',
      status: status || 'active',
      emailVerified: true,
      emailVerificationStatus: 'verified',
      createdAt: req.body.createdAt || new Date().toISOString().slice(0, 10),
      lastLoginAt: req.body.lastLoginAt || 'Never logged in',
      preferences: {
        preferredLanguage: 'Academic English',
        dailyGoalXp: 100,
        targetExam: 'IELTS Academic',
        theme: 'system',
        soundEnabled: true,
        emailNotifications: true,
        ...(preferences || {})
      },
      profileStats: {
        currentStreak: 1,
        highestStreak: 1,
        xp: 50,
        level: 1,
        league: 'Bronze',
        hearts: 5,
        maxHearts: 5,
        todayXp: 0,
        ...(profileStats || {})
      }
    };

    const created = await DbStorage.createUser(newUser);

    // Save admin provisioning activity log directly to database activities table
    try {
      await DbStorage.saveActivity({
        id: `act_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        userId: req.user?.id || 'usr_root_admin',
        userName: req.user?.name || 'System Administrator',
        userRole: 'admin',
        type: 'admin_action',
        title: `Admin Created User Account: ${created.name}`,
        category: 'RBAC_CHANGE',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'completed',
        details: `Created user account ${created.email} (${created.role.toUpperCase()}) directly in Prisma Postgres database table users.`,
        replayPayload: { tab: 'admin', subId: 'users' }
      });
    } catch {}

    res.status(201).json({ success: true, user: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin OTP Audit Logs endpoint directly from database auth_otps table
serverApp.get('/api/admin/otps', authenticateTokenOptional, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const otps = await DbStorage.getOtpLogs(100);
    res.json({ success: true, items: otps, total: otps.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.get('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  // Non-admins can only retrieve their own profile
  if (req.user?.role !== 'admin' && req.user?.id !== id) {
    res.status(403).json({ success: false, error: 'Unauthorized to view this user profile.' });
    return;
  }
  try {
    const user = await DbStorage.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.put('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      res.status(403).json({ success: false, error: 'Unauthorized to update this user profile.' });
      return;
    }
    // Only administrators are permitted to toggle enableQuickUserSwitch
    if (req.body.preferences && req.body.preferences.enableQuickUserSwitch !== undefined && req.user?.role !== 'admin') {
      delete req.body.preferences.enableQuickUserSwitch;
    }
    const updated = await DbStorage.updateUser(id, req.body);
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== ACTIVITIES ====================
serverApp.get('/api/activities', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, examType, module, category, status, search, limit, offset } = req.query;

    const effectiveUserId =
      typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : req.user && req.user.role !== 'admin'
        ? req.user.id
        : undefined;

    const result = await DbStorage.getActivities({
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
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/activities', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activityData = req.body;
    activityData.userId = activityData.userId || req.user?.id || 'usr_student_01';
    activityData.userName = activityData.userName || req.user?.name || 'EduBridge Learner';
    activityData.timestamp = activityData.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);
    const saved = await DbStorage.saveActivity(activityData);
    res.status(201).json({ success: true, activity: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/activities/batch', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;
    const activitiesList = Array.isArray(payload) ? payload : (payload.activities || []);
    const savedList = [];
    for (const act of activitiesList) {
      const sanitized = {
        ...act,
        userId: act.userId || req.user?.id || 'usr_student_01',
        userName: act.userName || req.user?.name || 'EduBridge Learner',
        timestamp: act.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      const s = await DbStorage.saveActivity(sanitized);
      savedList.push(s);
    }
    res.status(201).json({ success: true, count: savedList.length, activities: savedList });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

serverApp.get('/api/activities/:id', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activity = await DbStorage.getActivityById(req.params.id);
    if (!activity) {
      res.status(404).json({ success: false, error: 'Activity not found.' });
      return;
    }
    if (req.user && req.user.role !== 'admin' && activity.userId !== req.user.id) {
      res.status(403).json({ success: false, error: 'Unauthorized to view this activity.' });
      return;
    }
    res.json({ success: true, activity });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== "SHOW ATTEMPT" ENDPOINT ====================
serverApp.get('/api/activities/:id/show-attempt', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const detail = await DbStorage.getAttemptDetail(id, req.user?.id, req.user?.role);
    res.json({ success: true, data: detail });
  } catch (err: any) {
    const statusCode = (err as any).statusCode || (err.message.includes('not found') ? 404 : 403);
    res.status(statusCode).json({ success: false, error: err.message });
  }
});

// ==================== QUESTION ATTEMPTS ====================
serverApp.get('/api/attempts/questions', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, testId, activityId } = req.query;
    const effectiveUserId =
      typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : req.user && req.user.role !== 'admin'
        ? req.user.id
        : undefined;

    const questions = await DbStorage.getQuestionAttempts({
      userId: effectiveUserId,
      testId: typeof testId === 'string' ? testId : undefined,
      activityId: typeof activityId === 'string' ? activityId : undefined
    });

    res.json({ success: true, items: questions, total: questions.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/attempts/questions', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;
    if (Array.isArray(payload)) {
      const sanitized = payload.map((q) => ({
        ...q,
        userId: q.userId || req.user?.id || 'usr_student_01',
        userName: q.userName || req.user?.name || 'EduBridge Learner'
      }));
      const saved = await DbStorage.saveBatchQuestionAttempts(sanitized);
      res.status(201).json({ success: true, count: saved.length, items: saved });
    } else {
      const single = {
        ...payload,
        userId: payload.userId || req.user?.id || 'usr_student_01',
        userName: payload.userName || req.user?.name || 'EduBridge Learner'
      };
      const saved = await DbStorage.saveQuestionAttempt(single);
      res.status(201).json({ success: true, item: saved });
    }
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== WRITTEN RESPONSES ====================
serverApp.get('/api/attempts/written', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, activityId } = req.query;
    const effectiveUserId =
      typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : req.user && req.user.role !== 'admin'
        ? req.user.id
        : undefined;

    const responses = await DbStorage.getWrittenResponses({
      userId: effectiveUserId,
      activityId: typeof activityId === 'string' ? activityId : undefined
    });

    res.json({ success: true, items: responses, total: responses.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/attempts/written', authenticateTokenOptional, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    const sanitized = {
      ...data,
      userId: req.user?.role === 'admin' ? data.userId || req.user?.id : req.user?.id,
      userName: req.user?.role === 'admin' ? data.userName || req.user?.name : req.user?.name
    };
    const saved = await DbStorage.saveWrittenResponse(sanitized);
    res.status(201).json({ success: true, item: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== AUTOSAVE & RECOVERY ====================
serverApp.get('/api/attempts/autosave/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { testId } = req.query;

    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      res.status(403).json({ success: false, error: 'Unauthorized to access this autosave record.' });
      return;
    }

    const attempt = await DbStorage.getIncompleteAttempt(userId, typeof testId === 'string' ? testId : undefined);
    res.json({ success: true, attempt });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/attempts/autosave', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    const sanitized = {
      ...data,
      userId: req.user?.role === 'admin' ? data.userId || req.user?.id : req.user?.id
    };
    const saved = await DbStorage.saveIncompleteAttempt(sanitized);
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
    await DbStorage.clearIncompleteAttempt(userId, testId);
    res.json({ success: true, message: 'Autosave record cleared.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==================== ADMIN FULL USER HISTORY INSPECTOR ====================
serverApp.get('/api/admin/users/:userId/full-history', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const history = await DbStorage.getUserFullHistory(userId);
    res.json({ success: true, data: history });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// ==================== ADMIN USER ACTIONS (RESET & VERIFY) ====================

// Admin-Initiated Password Reset (securely dispatches reset OTP to user email without exposing OTP or password)
serverApp.post('/api/admin/users/:id/initiate-reset', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await DbStorage.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const cleanEmail = user.email.toLowerCase();
    const otp = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
    const now = Date.now();

    // Store admin-initiated password reset OTP directly in database table auth_otps
    await DbStorage.createOtp({
      id: `otp_${now}_${crypto.randomBytes(3).toString('hex')}`,
      email: cleanEmail,
      type: 'PASSWORD_RESET',
      otpCode: otp,
      otpHash: hashOtp(otp),
      attempts: 0,
      maxAttempts: 5,
      expiresAt: now + 15 * 60 * 1000, // 15 mins for admin-initiated
      createdAt: now,
      lastSentAt: now,
      status: 'active',
      metadata: { userId: user.id, userName: user.name, initiatedBy: 'admin' }
    });

    await EmailService.sendPasswordResetOtp(cleanEmail, user.name, otp);

    res.json({
      success: true,
      message: `Password reset OTP has been securely dispatched to the user's registered email (${cleanEmail}). The user can complete password reset using this code.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to dispatch reset code.' });
  }
});

// Admin Manual Email Verification
serverApp.post('/api/admin/users/:id/verify-email', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await DbStorage.updateUser(id, {
      emailVerified: true,
      emailVerificationStatus: 'verified'
    });
    res.json({
      success: true,
      user: updated,
      message: `Email for ${updated.name} has been marked as verified.`
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Verification update failed.' });
  }
});

// ==================== SMTP INTEGRATION & EMAIL DIAGNOSTICS ====================

// Get SMTP Configuration (safe view with masked credentials)
serverApp.get('/api/admin/smtp', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    config: EmailService.getConfig()
  });
});

// Update SMTP Configuration
serverApp.post('/api/admin/smtp', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await EmailService.saveConfig(req.body);
    res.json({
      success: true,
      message: 'SMTP settings updated successfully.',
      config: updated
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Failed to update SMTP settings.' });
  }
});

// Send Test Email / Verify SMTP Connection
serverApp.post('/api/admin/smtp/test', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientEmail, ...smtpOverrides } = req.body;
    const targetEmail = recipientEmail || req.user?.email || 'admin@edubridge.io';
    const result = await EmailService.sendTestEmail(targetEmail, smtpOverrides);
    if (!result.success || result.delivered === false) {
      return res.status(400).json({
        success: false,
        delivered: false,
        message: result.info,
        error: result.info,
        logs: EmailService.getLogs().slice(0, 5)
      });
    }
    res.json({
      success: true,
      delivered: true,
      message: result.info,
      logs: EmailService.getLogs().slice(0, 5)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'SMTP test execution failed.'
    });
  }
});

// Get Email Delivery Diagnostics Logs
serverApp.get('/api/admin/smtp/logs', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    logs: EmailService.getLogs()
  });
});

// ==========================================
// STANDARD & PRACTICE TESTS ENDPOINTS (PRISMA POSTGRES DB)
// ==========================================

serverApp.get('/api/tests', async (req: Request, res: Response) => {
  try {
    const filter = {
      testStandard: req.query.testStandard as string | undefined,
      testType: req.query.testType as string | undefined,
      subject: req.query.subject as string | undefined,
      category: req.query.category as string | undefined,
      difficulty: req.query.difficulty as string | undefined,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : undefined
    };
    const items = await DbStorage.getStandardTests(filter);
    res.json({ success: true, items, total: items.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch tests' });
  }
});

serverApp.get('/api/tests/:id', async (req: Request, res: Response) => {
  try {
    const test = await DbStorage.getStandardTestById(req.params.id);
    if (!test) {
      res.status(404).json({ success: false, error: 'Test not found' });
      return;
    }
    res.json({ success: true, test });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch test' });
  }
});

serverApp.post('/api/tests', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (Array.isArray(body)) {
      const savedList = [];
      for (const t of body) {
        if (t && t.id) {
          const s = await DbStorage.saveStandardTest(t);
          savedList.push(s);
        }
      }
      res.json({ success: true, count: savedList.length, items: savedList });
      return;
    }
    if (!body || !body.id) {
      res.status(400).json({ success: false, error: 'Valid test object with id required' });
      return;
    }
    const saved = await DbStorage.saveStandardTest(body);
    res.json({ success: true, test: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to save test' });
  }
});

serverApp.delete('/api/tests/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await DbStorage.deleteStandardTest(req.params.id);
    res.json({ success: true, message: 'Test deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to delete test' });
  }
});

// ==========================================
// QUIZZES ENDPOINTS (PRISMA POSTGRES DB)
// ==========================================

serverApp.get('/api/quizzes', async (req: Request, res: Response) => {
  try {
    const filter = {
      cohort: req.query.cohort as string | undefined,
      category: req.query.category as string | undefined,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : undefined
    };
    const items = await DbStorage.getQuizzes(filter);
    res.json({ success: true, items, total: items.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch quizzes' });
  }
});

serverApp.get('/api/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const quiz = await DbStorage.getQuizById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz question not found' });
      return;
    }
    res.json({ success: true, quiz });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch quiz' });
  }
});

serverApp.post('/api/quizzes', async (req: Request, res: Response) => {
  try {
    const quiz = req.body;
    if (!quiz || !quiz.id) {
      res.status(400).json({ success: false, error: 'Valid quiz object with id required' });
      return;
    }
    const saved = await DbStorage.saveQuiz(quiz);
    res.json({ success: true, quiz: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to save quiz' });
  }
});

serverApp.post('/api/quizzes/batch', async (req: Request, res: Response) => {
  try {
    const list = Array.isArray(req.body) ? req.body : req.body.quizzes;
    if (!Array.isArray(list)) {
      res.status(400).json({ success: false, error: 'Array of quiz questions required' });
      return;
    }
    const saved = await DbStorage.saveBatchQuizzes(list);
    res.json({ success: true, count: saved.length, items: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to batch save quizzes' });
  }
});

// ==========================================
// APPLICATION CONFIGURATIONS ENDPOINTS (PRISMA POSTGRES DB)
// ==========================================

serverApp.get('/api/configurations', async (_req: Request, res: Response) => {
  try {
    const configurations = await DbStorage.getAllConfigurations();
    res.json({ success: true, configurations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch configurations' });
  }
});

serverApp.get('/api/configurations/:key', async (req: Request, res: Response) => {
  try {
    const value = await DbStorage.getConfiguration(req.params.key);
    if (value === null || value === undefined) {
      res.status(404).json({ success: false, error: `Configuration "${req.params.key}" not found` });
      return;
    }
    res.json({ success: true, key: req.params.key, value });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch configuration' });
  }
});

const saveConfigHandler = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const { value, category, description } = req.body;
    const finalValue = value !== undefined ? value : req.body;
    await DbStorage.setConfiguration(key, finalValue, category || 'general', description || '', 'admin');
    res.json({ success: true, key, value: finalValue });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to save configuration' });
  }
};

serverApp.post('/api/configurations/:key', saveConfigHandler);
serverApp.put('/api/configurations/:key', saveConfigHandler);

// ==========================================
// SCHEDULED JOBS ENDPOINTS (PRISMA POSTGRES DB)
// ==========================================

serverApp.get('/api/jobs', async (_req: Request, res: Response) => {
  try {
    const items = await DbStorage.getScheduledJobs();
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch jobs' });
  }
});

serverApp.put('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    await DbStorage.updateScheduledJob(req.params.id, req.body);
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to update job' });
  }
});

serverApp.post('/api/jobs/:id/run', async (req: Request, res: Response) => {
  try {
    const result = await executeJobOnDatabase(req.params.id);
    res.json({
      success: true,
      message: `Job ${req.params.id} executed successfully. Generated ${result.itemsGenerated} items stored in database.`,
      result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to trigger job run' });
  }
});

// ==========================================
// VERCEL CRON & AUTOMATED SCHEDULER ENGINE
// ==========================================

let lastServerCronDate = '';

export async function executeServerScheduledJobs(): Promise<{
  timestamp: string;
  jobsExecuted: string[];
  mockTestsGenerated: number;
  practiceTestsGenerated: number;
  vocabQuizzesGenerated: number;
  totalItemsGenerated: number;
}> {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  lastServerCronDate = timestamp.slice(0, 10);

  console.log(`[Server Scheduler] Auto-executing nightly database scheduled jobs at ${timestamp}...`);

  const summary = await executeAllDatabaseScheduledJobs();

  return {
    timestamp,
    jobsExecuted: summary.results.map((r) => r.jobId),
    mockTestsGenerated: summary.totalMockTests,
    practiceTestsGenerated: summary.totalPracticeTests,
    vocabQuizzesGenerated: summary.totalQuizzes,
    totalItemsGenerated: summary.totalMockTests + summary.totalPracticeTests + summary.totalQuizzes
  };
}

// Vercel Cron Endpoint (supports GET & POST for Vercel Cron invocation)
serverApp.all('/api/cron/scheduled-jobs', async (_req: Request, res: Response) => {
  try {
    const result = await executeServerScheduledJobs();
    res.json({
      success: true,
      message: 'EduBridge Vercel Cron executed successfully. Multi-exam tests and vocabulary expanded.',
      ...result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Cron job execution failed.' });
  }
});

serverApp.all('/api/cron', async (_req: Request, res: Response) => {
  try {
    const result = await executeServerScheduledJobs();
    res.json({
      success: true,
      message: 'EduBridge Vercel Cron executed successfully.',
      ...result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Cron execution failed.' });
  }
});

// Global Express error handler: prevent any route error from crashing the serverless worker
serverApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[EduBridge Server Error]:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
});

// Server background interval check (runs automatically every 60 seconds on server / daemons, unref to avoid blocking build/exit)
if (
  process.env.NODE_ENV !== 'test' &&
  !process.env.npm_lifecycle_event?.includes('build') &&
  !process.argv.some((a) => a.includes('build'))
) {
  const schedulerTimer = setInterval(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastServerCronDate !== today) {
      executeServerScheduledJobs().catch((e) => console.warn('[Server Scheduler] Auto-run note:', e.message));
    }
  }, 60000);
  if (schedulerTimer.unref) schedulerTimer.unref();
}

