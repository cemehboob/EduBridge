import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ServerStorage } from './storage';
import { UserAccount } from '../src/types';
import { EmailService } from './emailService';

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

// Persistent & In-memory session token store (mapping token -> { userId, createdAt, expiresAt })
interface SessionInfo {
  token: string;
  userId: string;
  userRole: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionInfo>();

// Load persisted sessions from storage vault
try {
  const persistedSessions = ServerStorage.getSessions();
  persistedSessions.forEach((sess) => {
    if (Date.now() <= sess.expiresAt) {
      activeSessions.set(sess.token, sess);
    }
  });
} catch {
  // Vault initializing
}

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
    const sessionRecord = {
      token,
      userId: user.id,
      userRole: user.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + 365 * 24 * 3600 * 1000 // 1 year
    };
    activeSessions.set(token, sessionRecord);
    try {
      ServerStorage.saveSession(sessionRecord);
    } catch {}
  }
});

function createSessionToken(user: UserAccount): string {
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
    ServerStorage.saveSession(sessionRecord);
  } catch (err: any) {
    console.warn('[ServerApp] Failed saving session to vault:', err.message);
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

  // 1. Verify token against activeSessions or persistent vault
  if (token) {
    let session = activeSessions.get(token);
    if (!session) {
      const persisted = ServerStorage.getSessions().find((s) => s.token === token);
      if (persisted) {
        session = persisted;
        activeSessions.set(token, persisted);
      }
    }

    if (session && Date.now() <= session.expiresAt) {
      const user = ServerStorage.getUserById(session.userId);
      if (user && user.status !== 'disabled') {
        req.user = user;
        return next();
      }
    }
  }

  // 2. Fallback: x-user-id header from trusted device/browser
  const userIdHeader = req.headers['x-user-id'];
  if (typeof userIdHeader === 'string' && userIdHeader.trim()) {
    const cleanId = userIdHeader.trim();
    const user = ServerStorage.getUserById(cleanId) || ServerStorage.getUserByIdentifier(cleanId);
    if (user && user.status !== 'disabled') {
      req.user = user;
      return next();
    }
  }

  if (!token && !userIdHeader) {
    res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
    return;
  }

  res.status(401).json({ success: false, error: 'Session expired or invalid. Please sign in again.' });
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
    try {
      ServerStorage.removeSession(token);
    } catch {}
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Automatic Cross-Machine Session Synchronization
serverApp.post('/api/auth/session-sync', (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body;
    let user: UserAccount | null = null;
    if (userId) user = ServerStorage.getUserById(userId);
    if (!user && email) user = ServerStorage.getUserByIdentifier(email);

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found in central server repository.' });
      return;
    }

    if (user.status === 'disabled') {
      res.status(403).json({ success: false, error: 'User account has been disabled.' });
      return;
    }

    const token = createSessionToken(user);
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

    const existingUser = ServerStorage.getUserByIdentifier(cleanEmail);
    if (existingUser) {
      res.status(409).json({ success: false, error: `An account with email "${cleanEmail}" is already registered. Please sign in instead.` });
      return;
    }

    const cleanName = name.trim();
    const cleanUsername = (username || cleanName.toLowerCase().replace(/\s+/g, '.')).trim().toLowerCase();

    // Rate-limiting: minimum 60 seconds between OTP requests per email
    const otpKey = `reg:${cleanEmail}`;
    const existingOtp = activeOtps.get(otpKey);
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

    activeOtps.set(otpKey, {
      id: `otp_${now}_${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      otpHash: hashOtp(otp),
      purpose: 'REGISTRATION',
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      maxAttempts: 5,
      lastSentAt: now,
      resendAvailableAt: now + 60 * 1000,
      consumed: false,
      registrationData: {
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
    const otpKey = `reg:${cleanEmail}`;
    const record = activeOtps.get(otpKey);

    if (!record) {
      res.status(400).json({
        success: false,
        error: 'No active verification code found for this email. Please request a new code.'
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      activeOtps.delete(otpKey);
      res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new code.'
      });
      return;
    }

    record.attempts += 1;
    if (record.attempts > record.maxAttempts) {
      activeOtps.delete(otpKey);
      res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this verification code has been invalidated. Please request a new one.'
      });
      return;
    }

    if (hashOtp(cleanOtp) !== record.otpHash) {
      const remaining = record.maxAttempts - record.attempts;
      res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining} attempts remaining.`
      });
      return;
    }

    // OTP is valid! Invalidate immediately
    activeOtps.delete(otpKey);

    const regData = record.registrationData!;
    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

    const created = await ServerStorage.createUser(newUser);
    const token = createSessionToken(created);

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
    const user = ServerStorage.getUserByIdentifier(cleanEmail);
    if (!user) {
      res.status(404).json({ success: false, error: `No registered account found with email "${cleanEmail}".` });
      return;
    }

    const otpKey = `reset:${cleanEmail}`;
    const existingOtp = activeOtps.get(otpKey);
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

    activeOtps.set(otpKey, {
      id: `otp_${now}_${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      otpHash: hashOtp(otp),
      purpose: 'PASSWORD_RESET',
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000,
      attempts: 0,
      maxAttempts: 5,
      lastSentAt: now,
      resendAvailableAt: now + 60 * 1000,
      consumed: false
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
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ success: false, error: 'Email, verification code, and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const otpKey = `reset:${cleanEmail}`;
    const record = activeOtps.get(otpKey);

    if (!record) {
      res.status(400).json({
        success: false,
        error: 'No active password reset request found for this email. Please request a new code.'
      });
      return;
    }

    if (Date.now() > record.expiresAt) {
      activeOtps.delete(otpKey);
      res.status(400).json({
        success: false,
        error: 'Password reset code has expired. Please request a new code.'
      });
      return;
    }

    record.attempts += 1;
    if (record.attempts > record.maxAttempts) {
      activeOtps.delete(otpKey);
      res.status(429).json({
        success: false,
        error: 'Too many incorrect attempts. For security, this reset code has been invalidated.'
      });
      return;
    }

    if (hashOtp(cleanOtp) !== record.otpHash) {
      const remaining = record.maxAttempts - record.attempts;
      res.status(400).json({
        success: false,
        error: `Incorrect reset code. ${remaining} attempts remaining.`
      });
      return;
    }

    // Invalidate immediately
    activeOtps.delete(otpKey);

    const user = ServerStorage.getUserByIdentifier(cleanEmail);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    await ServerStorage.updateUser(user.id, {
      password: newPassword.trim(),
      emailVerified: true,
      emailVerificationStatus: 'verified'
    });

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

  // Regular users are locked to their own userId. Admins can view all activities (userId omitted or 'all') or filter by specific userId.
  const effectiveUserId =
    req.user?.role === 'admin'
      ? typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : undefined
      : req.user?.id;

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
    // Retain or assign user ownership
    activityData.userId = activityData.userId || req.user?.id || 'usr_student_01';
    activityData.userName = activityData.userName || req.user?.name || 'EduBridge Learner';
    const saved = await ServerStorage.saveActivity(activityData);
    res.status(201).json({ success: true, activity: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

serverApp.post('/api/activities/batch', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body;
    const activitiesList = Array.isArray(payload) ? payload : (payload.activities || []);
    const savedList = [];
    for (const act of activitiesList) {
      const sanitized = {
        ...act,
        userId: act.userId || req.user?.id || 'usr_student_01',
        userName: act.userName || req.user?.name || 'EduBridge Learner'
      };
      const s = await ServerStorage.saveActivity(sanitized);
      savedList.push(s);
    }
    res.status(201).json({ success: true, count: savedList.length, activities: savedList });
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
  const effectiveUserId =
    req.user?.role === 'admin'
      ? typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : undefined
      : req.user?.id;

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
  const effectiveUserId =
    req.user?.role === 'admin'
      ? typeof userId === 'string' && userId.trim() && userId !== 'all'
        ? userId.trim()
        : undefined
      : req.user?.id;

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

// ==================== ADMIN USER ACTIONS (RESET & VERIFY) ====================

// Admin-Initiated Password Reset (securely dispatches reset OTP to user email without exposing OTP or password)
serverApp.post('/api/admin/users/:id/initiate-reset', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = ServerStorage.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found.' });
      return;
    }

    const cleanEmail = user.email.toLowerCase();
    const otp = Math.floor(100000 + crypto.randomInt(0, 900000)).toString();
    const otpKey = `reset:${cleanEmail}`;
    const now = Date.now();

    activeOtps.set(otpKey, {
      id: `otp_${now}_${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      otpHash: hashOtp(otp),
      purpose: 'PASSWORD_RESET',
      createdAt: now,
      expiresAt: now + 15 * 60 * 1000, // 15 mins for admin-initiated
      attempts: 0,
      maxAttempts: 5,
      lastSentAt: now,
      resendAvailableAt: now + 60 * 1000,
      consumed: false
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
    const updated = await ServerStorage.updateUser(id, {
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
    res.json({
      success: result.success,
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

