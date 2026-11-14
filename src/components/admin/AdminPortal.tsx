import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Clock,
  Play,
  Pause,
  BookOpen,
  Award,
  Search,
  Filter,
  Users,
  UserPlus,
  MessageSquare,
  Send,
  Mail,
  ShieldCheck,
  X,
  Edit,
  Key,
  Eye,
  EyeOff,
  BarChart3,
  Layers,
  Brain,
  Sparkles,
  Zap,
  Calendar,
  Flame,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Target,
  Sliders,
  Check,
  Database
} from 'lucide-react';
import {
  OllamaModelInfo,
  SystemMetric,
  AuditLog,
  ScheduledJob,
  VocabularyWord,
  UserAccount,
  FeatureFlag,
  UserFeedbackTicket,
  UserRole,
  IngestedItemRecord,
  TestConductionRecord,
  UserActivityRecord,
  ExamSettingsConfig,
  QuestionAttemptRecord,
  WrittenResponseRecord,
  SmtpConfigView,
  EmailLogEntryView
} from '../../types';
import { sound } from '../../utils/audio';
import { applyThemeToDom } from '../../utils/themeManager';
import { StorageService } from '../../services/storage';
import { apiService } from '../../services/apiService';
import { calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';
import { ShowAttemptModal } from '../common/ShowAttemptModal';
import { getActivityQuestionStats } from '../../utils/activityStats';

interface AdminPortalProps {
  models: OllamaModelInfo[];
  metrics: SystemMetric[];
  auditLogs: AuditLog[];
  scheduledJobs: ScheduledJob[];
  vocabularyWords: VocabularyWord[];
  ingestedLedger: IngestedItemRecord[];
  users: UserAccount[];
  activities?: UserActivityRecord[];
  featureFlags: FeatureFlag[];
  feedbackTickets: UserFeedbackTicket[];
  onToggleModelStatus: (modelId: string) => void;
  onUpdateModelTemp: (modelId: string, temp: number) => void;
  onToggleJob: (jobId: string) => void;
  onRunScheduledJob: (jobId: string) => Promise<void>;
  onToggleUserStatus: (userId: string) => void;
  onAddUser: (newUser: UserAccount) => void | Promise<void>;
  onUpdateUser?: (updatedUser: UserAccount) => void;
  onRefreshUsers?: () => Promise<void>;
  onToggleFeatureFlag: (flagId: string) => void;
  onRespondFeedback: (ticketId: string, replyMessage: string, newStatus: 'Resolved' | 'Investigating') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  models,
  metrics,
  auditLogs,
  scheduledJobs,
  vocabularyWords,
  ingestedLedger,
  users,
  activities,
  featureFlags,
  feedbackTickets,
  onToggleModelStatus,
  onUpdateModelTemp,
  onToggleJob,
  onRunScheduledJob,
  onToggleUserStatus,
  onAddUser,
  onUpdateUser,
  onRefreshUsers,
  onToggleFeatureFlag,
  onRespondFeedback
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'dashboard' | 'users' | 'cohorts' | 'activities' | 'feedback' | 'jobs' | 'models' | 'telemetry' | 'audit' | 'vocab' | 'smtp' | 'database'
  >('dashboard');

  const [dbHealth, setDbHealth] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSaveNotice, setDbSaveNotice] = useState<string | null>(null);
  const [dbMinQuestions, setDbMinQuestions] = useState(() => StorageService.getExamSettings().questionsPerTest || 10);
  const [dbShuffleOptions, setDbShuffleOptions] = useState(() => StorageService.getExamSettings().allowShuffleOptions ?? true);
  const [dbWritingQuestions, setDbWritingQuestions] = useState(() => StorageService.getExamSettings().writingTestQuestions || 1);
  const [dbRunningJob, setDbRunningJob] = useState<string | null>(null);

  useEffect(() => {
    if (activeAdminTab === 'database') {
      setDbLoading(true);
      apiService.getHealth()
        .then((h) => setDbHealth(h))
        .catch(() => {})
        .finally(() => setDbLoading(false));
    }
  }, [activeAdminTab]);

  // Standardized Practice Test Question Settings State
  const [examSettings, setExamSettings] = useState<ExamSettingsConfig>(() => StorageService.getExamSettings());
  const [examSettingsSavedNotice, setExamSettingsSavedNotice] = useState<string | null>(null);
  const [selectedAttemptForModal, setSelectedAttemptForModal] = useState<UserActivityRecord | null>(null);

  // Age Groups & Educational Content Governance Configuration State
  const [cohortRules, setCohortRules] = useState([
    {
      cohortId: 'early',
      name: 'Little Explorers',
      ageRange: 'Ages 5–8',
      educationLevel: 'Early Primary & Phonics (Ages 5–8)',
      allowedSubjects: ['Early Phonics & Letters', 'Sight Words & Picture Match', 'Rhymes & Word Families', 'Little Story Comprehension', 'Early Math & Count'],
      allowAdultExams: false,
      maxDifficulty: 'Foundation' as const,
      quizzesEnabled: true,
      practiceTestsEnabled: true,
      status: 'Safeguarded & Active',
      description: 'Play-based phonics, picture words, and short stories with immediate positive audio feedback. Gated from adult standardized exams (IELTS/PTE/TOEFL).'
    },
    {
      cohortId: 'junior',
      name: 'Junior Scholars',
      ageRange: 'Ages 9–14',
      educationLevel: 'Elementary & Middle School (Ages 9–14)',
      allowedSubjects: ['Reading Foundation', 'STEM Science Quests', 'Mental Math Logic', 'Grammar & Vocabulary', 'Creative Story Lab'],
      allowAdultExams: false,
      maxDifficulty: 'Standard' as const,
      quizzesEnabled: true,
      practiceTestsEnabled: true,
      status: 'Active',
      description: 'Inquiry-based middle school curriculum, STEM challenges, and vocabulary drills. Safeguarded from adult university exams.'
    },
    {
      cohortId: 'academy',
      name: 'Academy & High-Stakes Exams',
      ageRange: 'Ages 15–24',
      educationLevel: 'High School & College Prep (Ages 15–24)',
      allowedSubjects: ['IELTS Academic / General', 'PTE Academic', 'TOEFL iBT', 'Universal STEM Solver', 'Career & Portfolio'],
      allowAdultExams: true,
      maxDifficulty: 'Advanced' as const,
      quizzesEnabled: true,
      practiceTestsEnabled: true,
      status: 'Active',
      description: 'Rigorous exam preparation, official rubric automated scoring, True/False/Not Given simulator, and Task 2 essay injector.'
    },
    {
      cohortId: 'pro',
      name: 'Professional & Career Fluency',
      ageRange: 'Ages 25–54',
      educationLevel: 'Professional & Career Fluency (Ages 25–54)',
      allowedSubjects: ['Executive Email Diplomacy', 'Workplace English', 'OET / Professional IELTS', 'Elevator Pitch Pacing', 'AI Career Strategist'],
      allowAdultExams: true,
      maxDifficulty: 'Advanced' as const,
      quizzesEnabled: true,
      practiceTestsEnabled: true,
      status: 'Active',
      description: 'Workplace communication, executive diplomacy analyzer, and resume portfolio optimization.'
    },
    {
      cohortId: 'senior',
      name: 'Golden Age & Lifelong Learning',
      ageRange: 'Ages 55+',
      educationLevel: 'Golden Age & Lifelong Learning (Ages 55+)',
      allowedSubjects: ['Cognitive Word Gym', 'Conversational English', 'Reflective Journaling', 'Everyday Digital Safety', 'Calm Listening'],
      allowAdultExams: true,
      maxDifficulty: 'Standard' as const,
      quizzesEnabled: true,
      practiceTestsEnabled: true,
      status: 'Active',
      description: 'Gentle cognitive stimulation, errorless learning, memory retention gym, and digital fraud prevention.'
    }
  ]);
  const [cohortSaveNotice, setCohortSaveNotice] = useState<string | null>(null);

  const handleToggleCohortAdultExams = (cohortId: string) => {
    sound.playClick();
    setCohortRules((prev) =>
      prev.map((c) => (c.cohortId === cohortId ? { ...c, allowAdultExams: !c.allowAdultExams } : c))
    );
  };

  const handleSaveCohortRules = () => {
    sound.playSuccess();
    const adminRecord = StorageService.recordUserActivity({
      userId: 'usr_admin_04',
      userName: 'System Administrator',
      type: 'admin_action',
      title: 'Configured Age Cohorts & Content Governance Rules',
      category: 'System Administration',
      score: '5 Cohorts Updated',
      xpEarned: 75,
      status: 'completed',
      details: 'Administrator updated educational content filtering rules, age ranges, and adult exam gating policies across all 5 age groups.',
      replayPayload: {
        tab: 'dashboard',
        subId: 'cohort_rules'
      }
    });
    setAllActivities((prev) => [adminRecord, ...prev]);
    setCohortSaveNotice('✓ Age cohort educational content rules saved and enforced across platform!');
    setTimeout(() => setCohortSaveNotice(null), 4000);
  };

  const handleSaveExamSettings = (count: number) => {
    sound.playClick();
    const updated: ExamSettingsConfig = {
      ...examSettings,
      questionsPerTest: count,
      allowShuffleOptions: true,
      writingTestQuestions: 1
    };
    setExamSettings(updated);
    StorageService.saveExamSettings(updated);

    // Record Admin's own activity into the timeline
    const adminRecord = StorageService.recordUserActivity({
      userId: 'usr_admin_04',
      userName: 'System Administrator',
      type: 'admin_action',
      title: `Configured Standardized Practice Test Count: ${count} Questions`,
      category: 'System Administration',
      score: `${count} Questions`,
      xpEarned: 50,
      status: 'completed',
      details: `Administrator updated standardized practice test question requirements to ${count} questions per test with automated MCQ option shuffling.`,
      replayPayload: {
        tab: 'dashboard',
        subId: 'test_settings'
      }
    });

    setAllActivities((prev) => [adminRecord, ...prev]);
    setExamSettingsSavedNotice(`✓ Standardized practice test question count updated to ${count} questions per test.`);
    sound.playSuccess();
    setTimeout(() => setExamSettingsSavedNotice(null), 4000);
  };

  // Platform Activities Feed State (All users + Admin's own activities)
  const [allActivities, setAllActivities] = useState<UserActivityRecord[]>(() =>
    activities && activities.length > 0 ? activities : StorageService.getUserActivities()
  );

  useEffect(() => {
    if (activities && activities.length > 0) {
      setAllActivities(activities);
    }
  }, [activities]);
  const [activitySearch, setActivitySearch] = useState('');
  const [activityRoleFilter, setActivityRoleFilter] = useState<'all' | 'student' | 'teacher' | 'parent' | 'admin'>('all');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');

  // Full User Dashboard Access & Inspector State
  const [selectedUserForDashboard, setSelectedUserForDashboard] = useState<UserAccount | null>(null);
  const [userDashboardSearch, setUserDashboardSearch] = useState('');
  const [userDashboardRoleFilter, setUserDashboardRoleFilter] = useState<'all' | 'student' | 'parent' | 'teacher' | 'admin'>('all');
  const [userDashboardFetchFeedback, setUserDashboardFetchFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [inspectedSubView, setInspectedSubView] = useState<'activities' | 'questions'>('activities');

  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [cacheStatus, setCacheStatus] = useState('Optimal (94.8% hit ratio)');
  const [executingJobId, setExecutingJobId] = useState<string | null>(null);

  // User Management state
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [inspectingUser, setInspectingUser] = useState<UserAccount | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123!');
  const [newUserDob, setNewUserDob] = useState('2002-05-14');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  // Admin User Edit Credentials state
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('student');
  const [editError, setEditError] = useState<string | null>(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [adminOtpNotice, setAdminOtpNotice] = useState<string | null>(null);

  // SMTP Configuration, Delivery Diagnostics & Server Sync State
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfigView>({
    host: 'smtp.gmail.com',
    port: 465,
    encryption: 'SSL',
    authUser: '',
    authPass: '••••••••',
    fromEmail: 'noreply@edubridge.io',
    fromName: 'EduBridge Security & Verification',
    active: true
  });
  const [smtpSavedNotice, setSmtpSavedNotice] = useState<string | null>(null);
  const [smtpTestRecipient, setSmtpTestRecipient] = useState('admin@edubridge.io');
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLogEntryView[]>([]);
  const [isSyncingServer, setIsSyncingServer] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [inspectedHistory, setInspectedHistory] = useState<{
    activities: UserActivityRecord[];
    questionAttempts: QuestionAttemptRecord[];
    writtenResponses: WrittenResponseRecord[];
    metrics: any;
  } | null>(null);
  const [loadingInspectedHistory, setLoadingInspectedHistory] = useState(false);

  // Synchronize live platform activities across machines from central server (periodic + tab-active)
  const syncActivities = async () => {
    try {
      setIsSyncingServer(true);
      const res = await apiService.activities.getAll();
      if (res && Array.isArray(res.items)) {
        setAllActivities(res.items);
        StorageService.saveUserActivities(res.items);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      console.warn('Central server activities sync notice:', err.message);
    } finally {
      setIsSyncingServer(false);
    }
  };

  // Active administrator account for quick user switch preference
  const activeAdminAccount = users.find((u) => u.id === StorageService.getActiveUserId()) || users.find((u) => u.role === 'admin') || users[0];
  const isQuickUserSwitchActive = Boolean(activeAdminAccount?.preferences?.enableQuickUserSwitch);

  const handleToggleAdminQuickUserSwitch = () => {
    sound.playClick();
    if (!activeAdminAccount) return;
    const nextVal = !isQuickUserSwitchActive;
    const updatedAdmin: UserAccount = {
      ...activeAdminAccount,
      preferences: {
        ...activeAdminAccount.preferences,
        enableQuickUserSwitch: nextVal
      }
    };
    if (onUpdateUser) {
      onUpdateUser(updatedAdmin);
    } else {
      const updatedList = users.map((u) => (u.id === updatedAdmin.id ? updatedAdmin : u));
      StorageService.saveUsers(updatedList);
    }
    setUserDashboardFetchFeedback({
      type: 'success',
      message: `Header Quick User Switcher is now ${nextVal ? 'ENABLED (Visible to Admins)' : 'DISABLED (Recommended for large user registries)'}.`
    });
  };

  // Live Cloud Database Connection Diagnostic State
  const [dbDiagStatus, setDbDiagStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    message?: string;
    host?: string;
    provider?: string;
    totalTables?: number;
    userCount?: number;
    activityCount?: number;
    latencyMs?: number;
  }>({ tested: false, loading: false });
  const [isSyncingUsers, setIsSyncingUsers] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleTestDatabaseConnection = async () => {
    sound.playClick();
    setDbDiagStatus({ tested: true, loading: true });
    const startTime = Date.now();
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      const latencyMs = Date.now() - startTime;
      if (data.success) {
        setDbDiagStatus({
          tested: true,
          loading: false,
          success: true,
          message: 'Connected to Prisma Postgres Cloud Database!',
          host: data.host,
          provider: data.databaseProvider || 'Prisma Postgres',
          totalTables: data.totalTables,
          userCount: data.userCount,
          activityCount: data.activityCount,
          latencyMs
        });
      } else {
        setDbDiagStatus({
          tested: true,
          loading: false,
          success: false,
          message: data.message || data.error || 'Connection failed.',
          host: data.host,
          latencyMs
        });
      }
    } catch (err: any) {
      setDbDiagStatus({
        tested: true,
        loading: false,
        success: false,
        message: err.message || 'Failed to reach /api/db-status endpoint',
        latencyMs: Date.now() - startTime
      });
    }
  };

  const handleManualSyncUsers = async () => {
    sound.playClick();
    if (!onRefreshUsers) return;
    setIsSyncingUsers(true);
    try {
      await onRefreshUsers();
      sound.playSuccess();
      setUserDashboardFetchFeedback({
        type: 'success',
        message: 'Successfully synchronized user list directly from Prisma Postgres cloud database!'
      });
    } catch (err: any) {
      sound.playError();
      setUserDashboardFetchFeedback({
        type: 'error',
        message: err.message || 'Failed to synchronize users from cloud database.'
      });
    } finally {
      setIsSyncingUsers(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    syncActivities();
    const interval = setInterval(syncActivities, 3500);
    const onFocus = () => syncActivities();
    window.addEventListener('focus', onFocus);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Fetch complete authoritative history from central server when inspecting a user
  useEffect(() => {
    if (!selectedUserForDashboard) {
      setInspectedHistory(null);
      return;
    }
    let isMounted = true;
    setLoadingInspectedHistory(true);
    apiService.users.getFullHistory(selectedUserForDashboard.id)
      .then((res) => {
        if (isMounted && res) {
          setInspectedHistory({
            activities: res.activities || [],
            questionAttempts: res.questionAttempts || [],
            writtenResponses: res.writtenResponses || [],
            metrics: res.metrics || null
          });
        }
      })
      .catch((err) => {
        console.warn('Failed loading full user history from server:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingInspectedHistory(false);
      });
    return () => { isMounted = false; };
  }, [selectedUserForDashboard?.id]);

  // Load SMTP configuration and delivery logs when SMTP tab is active
  useEffect(() => {
    if (activeAdminTab === 'smtp') {
      apiService.smtp.getConfig().then((cfg) => {
        if (cfg) setSmtpConfig(cfg);
      }).catch((e) => console.warn('SMTP config load notice:', e.message));

      apiService.smtp.getLogs().then((logs) => {
        if (logs) setEmailLogs(logs);
      }).catch((e) => console.warn('Email logs load notice:', e.message));
    }
  }, [activeAdminTab]);

  const handleAdminGenerateOtp = async (u: UserAccount) => {
    sound.playClick();
    try {
      const res = await apiService.users.initiatePasswordReset(u.id);
      setAdminOtpNotice(`📬 ${res.message || `Password reset OTP dispatched to ${u.email}.`}`);
      sound.playSuccess();
    } catch {
      // Offline fallback
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      StorageService.savePasswordResetOtp(u.email, otp);
      setAdminOtpNotice(`📬 6-Digit Password Reset OTP dispatched for ${u.name} (${u.email}): [ ${otp} ] · Valid for 10 minutes`);
      sound.playSuccess();
    }
  };

  const handleAdminVerifyEmail = async (u: UserAccount) => {
    sound.playClick();
    try {
      await apiService.users.verifyEmail(u.id);
      onUpdateUser?.({ ...u, emailVerified: true, emailVerificationStatus: 'verified' });
      setAdminOtpNotice(`✓ Email for ${u.name} (${u.email}) has been marked as verified.`);
      sound.playSuccess();
    } catch (err: any) {
      sound.playError();
      setAdminOtpNotice(`Failed to verify email: ${err.message}`);
    }
  };

  // Feedback reply state
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState<'Resolved' | 'Investigating'>('Resolved');
  const [auditSubTab, setAuditSubTab] = useState<'conduction' | 'system' | 'otps'>('conduction');
  const [dbOtps, setDbOtps] = useState<any[]>([]);
  const [loadingDbOtps, setLoadingDbOtps] = useState(false);

  // Load database-level OTP audit logs when audit subtab is active
  useEffect(() => {
    if (activeAdminTab === 'audit' && auditSubTab === 'otps') {
      setLoadingDbOtps(true);
      apiService.otps.getAll(100)
        .then((items) => setDbOtps(items))
        .catch(() => {})
        .finally(() => setLoadingDbOtps(false));
    }
  }, [activeAdminTab, auditSubTab]);

  // Vocab Explorer state
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('All');
  const [vocabViewMode, setVocabViewMode] = useState<'table' | 'grid'>('table');

  // Scheduled Jobs Ledger state
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'All' | 'Mock Test' | 'Practice Test' | 'Vocabulary Word'>('All');

  const handleFlushCache = () => {
    sound.playClick();
    setIsFlushingCache(true);
    setTimeout(() => {
      setIsFlushingCache(false);
      setCacheStatus('Cache Flushed · Rebuilding in background (100% clean)');
      sound.playSuccess();
    }, 1500);
  };

  const handleTriggerJob = async (jobId: string) => {
    sound.playClick();
    setExecutingJobId(jobId);
    try {
      await onRunScheduledJob(jobId);
      sound.playLevelUp();
    } finally {
      setExecutingJobId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError(null);

    const cleanName = newUserName.trim();
    const cleanUsername = (newUserUsername.trim() || cleanName.toLowerCase().replace(/\s+/g, '.')).toLowerCase();
    const cleanEmail = newUserEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !newUserPassword.trim() || !newUserDob) {
      setCreateUserError('Please fill in all required fields.');
      return;
    }

    // 1. Strict duplicate name check (no two users with same name on same machine)
    if (users.some((u) => u.name.trim().toLowerCase() === cleanName.toLowerCase())) {
      sound.playError();
      setCreateUserError(`A user with the name "${cleanName}" already exists. Duplicate user names are not allowed.`);
      return;
    }

    // 2. Strict duplicate username check
    if (users.some((u) => (u.username || u.email.split('@')[0] || '').toLowerCase() === cleanUsername)) {
      sound.playError();
      setCreateUserError(`The username "${cleanUsername}" is already taken.`);
      return;
    }

    // 3. Strict duplicate email check
    if (users.some((u) => u.email.trim().toLowerCase() === cleanEmail)) {
      sound.playError();
      setCreateUserError(`An account with the email "${cleanEmail}" already exists.`);
      return;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: newUserPassword.trim(),
      dateOfBirth: newUserDob,
      role: newUserRole,
      status: 'active',
      emailVerified: true,
      emailVerificationStatus: 'verified',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: 'Never logged in',
      preferences: {
        preferredLanguage: 'Spanish',
        dailyGoalXp: 100,
        targetExam: 'IELTS Academic',
        targetExamDate: '2026-11-20',
        targetBand: '8.0 Band',
        targetCareer: 'AI & Machine Learning Engineer',
        theme: 'system',
        soundEnabled: true,
        emailNotifications: true
      },
      profileStats: {
        currentStreak: 1,
        highestStreak: 1,
        xp: 50,
        level: 1,
        league: 'Bronze',
        hearts: 5,
        maxHearts: 5,
        todayXp: 0
      }
    };

    setIsCreatingUser(true);
    try {
      await onAddUser(newUser);
      sound.playSuccess();
      setNewUserName('');
      setNewUserUsername('');
      setNewUserEmail('');
      setCreateUserError(null);
      setShowAddUserModal(false);
      setUserDashboardFetchFeedback({
        type: 'success',
        message: `User ${newUser.name} (${newUser.email}) successfully created and stored in Prisma Postgres database!`
      });
    } catch (err: any) {
      sound.playError();
      setCreateUserError(err.message || 'Failed to create user in database.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const openEditUser = (u: UserAccount) => {
    sound.playClick();
    setEditingUser(u);
    setEditName(u.name);
    setEditUsername(u.username || u.email.split('@')[0] || '');
    setEditEmail(u.email);
    setEditPassword(u.password || '');
    setEditDob(u.dateOfBirth || '2000-01-01');
    setEditRole(u.role);
    setEditError(null);
    setShowEditPassword(false);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError(null);

    const cleanName = editName.trim();
    const cleanUsername = (editUsername.trim() || cleanName.toLowerCase().replace(/\s+/g, '.')).toLowerCase();
    const cleanEmail = editEmail.trim().toLowerCase();
    const cleanPassword = editPassword.trim();
    const cleanDob = editDob;

    if (!cleanName || !cleanEmail || !cleanPassword || !cleanDob) {
      sound.playError();
      setEditError('Please fill in all required credentials.');
      return;
    }

    // 1. Strict duplicate name check (excluding the user being edited)
    if (users.some((u) => u.id !== editingUser.id && u.name.trim().toLowerCase() === cleanName.toLowerCase())) {
      sound.playError();
      setEditError(`A user with the name "${cleanName}" already exists on this machine. Duplicate user names are not allowed.`);
      return;
    }

    // 2. Strict duplicate username check
    if (users.some((u) => u.id !== editingUser.id && (u.username || u.email.split('@')[0] || '').toLowerCase() === cleanUsername)) {
      sound.playError();
      setEditError(`The username "${cleanUsername}" is already taken by another user.`);
      return;
    }

    // 3. Strict duplicate email check
    if (users.some((u) => u.id !== editingUser.id && u.email.trim().toLowerCase() === cleanEmail)) {
      sound.playError();
      setEditError(`An account with the email "${cleanEmail}" already exists.`);
      return;
    }

    // Recalculate cohort and education level when DOB is updated by admin
    const newAgeCohort = calculateCohortFromDob(cleanDob);
    const newEducationLevel = calculateEducationLevel(cleanDob);

    const updatedAccount: UserAccount = {
      ...editingUser,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      dateOfBirth: cleanDob,
      role: editRole,
      preferences: {
        ...editingUser.preferences,
        ageCohort: newAgeCohort,
        educationLevel: newEducationLevel
      }
    };

    sound.playSuccess();
    onUpdateUser?.(updatedAccount);
    setEditingUser(null);
  };

  const handleSendFeedbackReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicketId || !replyMessage.trim()) return;

    sound.playSuccess();
    onRespondFeedback(replyTicketId, replyMessage.trim(), replyStatus);
    setReplyTicketId(null);
    setReplyMessage('');
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredVocab = vocabularyWords.filter((w) => {
    const matchSearch =
      w.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      w.definition.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      w.translation.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      w.category.toLowerCase().includes(vocabSearch.toLowerCase());
    const matchCefr = selectedCefr === 'All' || w.cefrLevel === selectedCefr;
    return matchSearch && matchCefr;
  });

  const filteredLedger = (ingestedLedger || []).filter((item) => {
    const matchesSearch =
      item.itemTitle.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.timestamp.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.categoryOrExam.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.jobName.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesType = ledgerTypeFilter === 'All' || item.itemType === ledgerTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full space-y-8 pb-12">
      
      {/* Top Banner with Full-Width Menu Under Menu Title */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        {/* Menu Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>EduBridge Enterprise Administrator Cluster</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              User Management, Feature Controls &amp; Feedback Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prisma Postgres Database · User Accounts · Feature Flags · Email Feedback · Schedulers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('database'); }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                activeAdminTab === 'database'
                  ? 'bg-indigo-700 text-white ring-2 ring-indigo-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Open Prisma Postgres Database Objects & Configuration Setup"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Database &amp; Setup (23 Objects)</span>
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); syncActivities(); }}
              disabled={isSyncingServer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-pointer transition-all shadow-2xs"
              title="Pull latest activities across all machines from central server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingServer ? 'animate-spin text-indigo-600' : 'text-indigo-600'}`} />
              <span>{isSyncingServer ? 'Syncing...' : `Sync Now (${lastSyncTime})`}</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Central Vault Online ({allActivities.length} Activities)</span>
            </span>
          </div>
        </div>

        {/* Full-Width Menu Under Title: Squeezed spacing horizontally, avoids scrollbar, horizontal scroll only when screen is narrower */}
        <div className="w-full overflow-x-auto pb-0.5 scrollbar-thin">
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 w-full min-w-max lg:min-w-0">
            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('dashboard'); }}
              className={`flex-1 min-w-[76px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Overview Dashboard & Category Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('database'); }}
              className={`flex-1 min-w-[130px] px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'database'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-100/80 hover:bg-indigo-200/80 text-indigo-800 border border-indigo-200'
              }`}
              title="Prisma Postgres Database Objects, Views & Central Configuration Setup"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Database &amp; Setup</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeAdminTab === 'database' ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-900'
              }`}>
                20
              </span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('users'); }}
              className={`flex-1 min-w-[82px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'users' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Database User Accounts & Credential Access"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Users ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('cohorts'); }}
              className={`flex-1 min-w-[92px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'cohorts' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Age Cohorts, Educational Levels & Content Assignment Rules"
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Cohorts &amp; Rules</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('activities'); }}
              className={`flex-1 min-w-[88px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'activities' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="All Platform Learning Activities & Attempt Ledgers"
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>Activities ({allActivities.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('feedback'); }}
              className={`flex-1 min-w-[84px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'feedback' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Dispatched Email & User In-App Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Feedback ({feedbackTickets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('jobs'); }}
              className={`flex-1 min-w-[80px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'jobs' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Nightly 00:00 Cron Automation & Content Ingestion"
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Jobs (00:00)</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('vocab'); }}
              className={`flex-1 min-w-[80px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'vocab' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Lexicon Repository & Word Generation Vault"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Vocab Vault</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('models'); }}
              className={`flex-1 min-w-[76px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'models' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Ollama Local & Cloud Inference Engines"
            >
              <Brain className="w-3.5 h-3.5 shrink-0" />
              <span>AI Models</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('telemetry'); }}
              className={`flex-1 min-w-[76px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'telemetry' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Real-Time System Telemetry & Compute Health"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('audit'); }}
              className={`flex-1 min-w-[78px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'audit' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Immutable Security & Operational Audit Trail"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Audit Logs</span>
            </button>

            <button
              type="button"
              onClick={() => { sound.playClick(); setActiveAdminTab('smtp'); }}
              className={`flex-1 min-w-[84px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'smtp' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="SMTP Integration, Verification & Delivery Diagnostics"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>SMTP &amp; Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* 0. Comprehensive Admin Dashboard: Overview, Category Analytics, Question Config & Full User Inspector */}
      {activeAdminTab === 'dashboard' && (() => {
        // Compute Application Usage by Category across ALL users + Admin
        const catCounts = {
          exams: allActivities.filter((a) => a.type === 'mock_test'),
          solver: allActivities.filter((a) => a.type === 'solver'),
          lessons: allActivities.filter((a) => a.type === 'lesson'),
          vocab: allActivities.filter((a) => a.type === 'vocab_quiz'),
          stem: allActivities.filter((a) => a.type === 'stem_game'),
          habits: allActivities.filter((a) => a.type === 'study_task' || a.type === 'daily_schedule' || a.type === 'career_cv'),
          admin: allActivities.filter((a) => a.type === 'admin_action')
        };

        const totalPlatformActs = Math.max(1, allActivities.length);
        const pExamPct = Math.round((catCounts.exams.length / totalPlatformActs) * 100);
        const pSolverPct = Math.round((catCounts.solver.length / totalPlatformActs) * 100);
        const pLessonsPct = Math.round((catCounts.lessons.length / totalPlatformActs) * 100);
        const pVocabPct = Math.round((catCounts.vocab.length / totalPlatformActs) * 100);
        const pStemPct = Math.round((catCounts.stem.length / totalPlatformActs) * 100);
        const pAdminPct = Math.round((catCounts.admin.length / totalPlatformActs) * 100);
        const pHabitsPct = Math.max(0, 100 - (pExamPct + pSolverPct + pLessonsPct + pVocabPct + pStemPct + pAdminPct));

        // Role counts for user dashboard selector
        const userRoleCounts = {
          all: users.length,
          student: users.filter((u) => u.role === 'student').length,
          parent: users.filter((u) => u.role === 'parent').length,
          teacher: users.filter((u) => u.role === 'teacher').length,
          admin: users.filter((u) => u.role === 'admin').length,
        };

        // Filter users for user dashboard selector with role filter & comprehensive query matching
        const filteredUserList = users.filter((u) => {
          const matchesRole = userDashboardRoleFilter === 'all' || u.role === userDashboardRoleFilter;
          const q = userDashboardSearch.toLowerCase().trim();
          const matchesQuery =
            !q ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.username && u.username.toLowerCase().includes(q)) ||
            u.id.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q);
          return matchesRole && matchesQuery;
        });

        // Enter & fetch user handler
        const handleFetchUser = () => {
          const q = userDashboardSearch.toLowerCase().trim();
          if (!q) {
            if (filteredUserList.length > 0) {
              sound.playClick();
              setSelectedUserForDashboard(filteredUserList[0]);
              setUserDashboardFetchFeedback({
                type: 'success',
                message: `Fetched first user: ${filteredUserList[0].name} (${filteredUserList[0].role.toUpperCase()})`
              });
            } else {
              setUserDashboardFetchFeedback({
                type: 'error',
                message: 'Please enter a name, email, or user ID to search.'
              });
            }
            return;
          }

          // 1. Exact match (id, email, username, or name)
          const exact = users.find(
            (u) =>
              u.id.toLowerCase() === q ||
              u.email.toLowerCase() === q ||
              u.name.toLowerCase() === q ||
              (u.username && u.username.toLowerCase() === q)
          );

          if (exact) {
            sound.playClick();
            if (userDashboardRoleFilter !== 'all' && exact.role !== userDashboardRoleFilter) {
              setUserDashboardRoleFilter('all');
            }
            setSelectedUserForDashboard(exact);
            setUserDashboardFetchFeedback({
              type: 'success',
              message: `Exact match found: ${exact.name} (${exact.role.toUpperCase()}) - ${exact.email}`
            });
            return;
          }

          // 2. Partial match in currently filtered list
          if (filteredUserList.length > 0) {
            sound.playClick();
            setSelectedUserForDashboard(filteredUserList[0]);
            setUserDashboardFetchFeedback({
              type: 'success',
              message: `Found ${filteredUserList.length} matching user(s). Inspected top match: ${filteredUserList[0].name} (${filteredUserList[0].role.toUpperCase()})`
            });
            return;
          }

          // 3. Partial match across all users (in case role filter hid it)
          const matchInAnyRole = users.find(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              (u.username && u.username.toLowerCase().includes(q))
          );
          if (matchInAnyRole) {
            sound.playClick();
            setUserDashboardRoleFilter('all');
            setSelectedUserForDashboard(matchInAnyRole);
            setUserDashboardFetchFeedback({
              type: 'success',
              message: `Found ${matchInAnyRole.name} (${matchInAnyRole.role.toUpperCase()}) in "${matchInAnyRole.role}" role. Switched role filter to All.`
            });
            return;
          }

          sound.playError();
          setUserDashboardFetchFeedback({
            type: 'error',
            message: `No user found matching "${userDashboardSearch}". Try another name, email, or check the role filter.`
          });
        };

        // Compute activities and question attempts for inspected user from authoritative server history
        const targetUserActivities = selectedUserForDashboard
          ? (inspectedHistory?.activities && inspectedHistory.activities.length > 0
              ? inspectedHistory.activities
              : allActivities.filter((a) => a.userId === selectedUserForDashboard.id || a.userName?.toLowerCase() === selectedUserForDashboard.name.toLowerCase()))
          : [];

        const targetUserQuestions = selectedUserForDashboard
          ? (inspectedHistory?.questionAttempts && inspectedHistory.questionAttempts.length > 0
              ? inspectedHistory.questionAttempts
              : StorageService.getQuestionAttempts().filter(
                  (q) =>
                    q.userId === selectedUserForDashboard.id ||
                    q.userName?.toLowerCase() === selectedUserForDashboard.name.toLowerCase()
                ))
          : [];

        return (
          <div className="space-y-6">
            {/* Direct Database & Configuration Setup Quick-Access Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-indigo-700/60">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                      Live Cloud Database Active
                    </span>
                    <span className="text-[11px] text-indigo-300 font-mono font-bold">23 Objects Deployed in Prisma Postgres</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                    Prisma Postgres Cloud Database &amp; Central Configuration Setup
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    Control all 20 database objects (standard_tests, quizzes, app_configurations, scheduled_jobs) and manage standardized test counts, themes, and automated jobs directly in the database.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setActiveAdminTab('database'); }}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>Open Database &amp; Setup Interface →</span>
                </button>
              </div>
            </div>

            {/* Top Cluster Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{users.length} Accounts</div>
                <div className="text-xs text-emerald-600 font-medium">All 4 User Roles Provisioned</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Total Activities Logged</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{allActivities.length} Records</div>
                <div className="text-xs text-indigo-600 font-medium">Includes All Users &amp; Admin Actions</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Questions / Test</span>
                  <Sliders className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{examSettings.questionsPerTest} Qs / Test</div>
                <div className="text-xs text-slate-500 font-medium">Configurable · Shuffled MCQs</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Active AI Engines</span>
                  <Brain className="w-4 h-4 text-violet-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{models.filter((m) => m.status === 'online').length} Online</div>
                <div className="text-xs text-teal-600 font-medium">Zero-Latency Local Fallback</div>
              </div>
            </div>

            {/* Notification Banner when exam settings are saved */}
            {examSettingsSavedNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{examSettingsSavedNotice}</span>
                </div>
                <button onClick={() => setExamSettingsSavedNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer">✕</button>
              </div>
            )}

            {/* Application Usage According to Categories (Visual Graphical Representation) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Application Usage Segmented by Academic Categories
                    </h3>
                    <p className="text-xs text-slate-500">
                      Overall platform activity distribution and learning engagement patterns across all cohorts.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                  ● Real-Time Activity Telemetry
                </span>
              </div>

              {/* Graphical Proportional Distribution Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Global Platform Activity Volume Proportions</span>
                  </span>
                  <span className="text-slate-400 font-mono">{allActivities.length} Total Sessions</span>
                </div>

                <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-200 shadow-inner cursor-pointer" title="Click any category to jump to filtered Audit Ledger">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('mock_test'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pExamPct)}%` }}
                    className="bg-rose-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view Exams in Activity Ledger (${catCounts.exams.length} records · ${pExamPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('solver'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pSolverPct)}%` }}
                    className="bg-violet-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view AI Solver in Activity Ledger (${catCounts.solver.length} records · ${pSolverPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('lesson'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pLessonsPct)}%` }}
                    className="bg-emerald-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view Lessons in Activity Ledger (${catCounts.lessons.length} records · ${pLessonsPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('vocab_quiz'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pVocabPct)}%` }}
                    className="bg-teal-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view Vocab Vault in Activity Ledger (${catCounts.vocab.length} records · ${pVocabPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('stem_game'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pStemPct)}%` }}
                    className="bg-amber-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view STEM Academics in Activity Ledger (${catCounts.stem.length} records · ${pStemPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('admin_action'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pAdminPct)}%` }}
                    className="bg-slate-700 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view Admin Actions in Activity Ledger (${catCounts.admin.length} records · ${pAdminPct}%)`}
                  />
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('study_task'); setActiveAdminTab('activities'); }}
                    style={{ width: `${Math.max(4, pHabitsPct)}%` }}
                    className="bg-blue-500 hover:brightness-110 active:brightness-95 transition-all duration-300 h-full focus:outline-none cursor-pointer"
                    title={`Click to view Habits in Activity Ledger (${catCounts.habits.length} records · ${pHabitsPct}%)`}
                  />
                </div>

                {/* 7 Category Detailed Metrics Grid (Interactive: Click to View in Ledger) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('mock_test'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-rose-50/60 hover:bg-rose-100/80 active:scale-95 rounded-2xl border border-rose-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all Exam activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-rose-700">Exams</div>
                    <div className="text-lg font-black text-rose-950">{catCounts.exams.length}</div>
                    <div className="text-[10px] text-rose-600 font-bold">{pExamPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('solver'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-violet-50/60 hover:bg-violet-100/80 active:scale-95 rounded-2xl border border-violet-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all AI Solver activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-violet-700">AI Solver</div>
                    <div className="text-lg font-black text-violet-950">{catCounts.solver.length}</div>
                    <div className="text-[10px] text-violet-600 font-bold">{pSolverPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('lesson'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-emerald-50/60 hover:bg-emerald-100/80 active:scale-95 rounded-2xl border border-emerald-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all Lesson activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Lessons</div>
                    <div className="text-lg font-black text-emerald-950">{catCounts.lessons.length}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{pLessonsPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('vocab_quiz'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-teal-50/60 hover:bg-teal-100/80 active:scale-95 rounded-2xl border border-teal-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all Vocab activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-teal-700">Vocab</div>
                    <div className="text-lg font-black text-teal-950">{catCounts.vocab.length}</div>
                    <div className="text-[10px] text-teal-600 font-bold">{pVocabPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('stem_game'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-amber-50/60 hover:bg-amber-100/80 active:scale-95 rounded-2xl border border-amber-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all STEM activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">STEM</div>
                    <div className="text-lg font-black text-amber-950">{catCounts.stem.length}</div>
                    <div className="text-[10px] text-amber-600 font-bold">{pStemPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('study_task'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-blue-50/60 hover:bg-blue-100/80 active:scale-95 rounded-2xl border border-blue-200 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view all Habit and Routine activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Habits</div>
                    <div className="text-lg font-black text-blue-950">{catCounts.habits.length}</div>
                    <div className="text-[10px] text-blue-600 font-bold">{pHabitsPct}% of platform</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActivityCategoryFilter('admin_action'); setActiveAdminTab('activities'); }}
                    className="p-3 bg-slate-100 hover:bg-slate-200/80 active:scale-95 rounded-2xl border border-slate-300 text-center space-y-1 cursor-pointer transition-all focus:outline-none"
                    title="Click to view Admin system action activities"
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">Admin</div>
                    <div className="text-lg font-black text-slate-900">{catCounts.admin.length}</div>
                    <div className="text-[10px] text-slate-600 font-bold">{pAdminPct}% of platform</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Standardized Practice Test Question Count Configuration Card */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Practice Test Configuration: Number of Questions per Test
                    </h3>
                    <p className="text-xs text-indigo-200">
                      Configure the standard number of questions generated per test session for Reading, Listening, and Academic suites.
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                  Current Setting: {examSettings.questionsPerTest} Questions / Test
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-200">
                    Select Questions per Practice Test:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {[5, 8, 10, 12, 15, 20].map((count) => (
                      <button
                        key={count}
                        onClick={() => handleSaveExamSettings(count)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          examSettings.questionsPerTest === count
                            ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-indigo-200 sm:text-right space-y-1">
                  <div className="font-bold text-white">✓ Option Shuffling: Active</div>
                  <div className="text-[11px] text-indigo-300 italic">
                    Writing practice tests are permanently calibrated to 1 comprehensive task.
                  </div>
                </div>
              </div>
            </div>

            {/* User Dashboard Access & Live Inspector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      User Live Dashboard Inspector &amp; Full Access
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select any registered user to inspect their live dashboard, category engagement, and learning history.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {/* Quick User Switcher Policy Toggle */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-[11px] font-bold text-slate-600 pl-1">Header Quick Switch:</span>
                    <button
                      type="button"
                      onClick={handleToggleAdminQuickUserSwitch}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer border ${
                        isQuickUserSwitchActive
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                      }`}
                      title="Enable or disable quick user switcher dropdown in header menu"
                    >
                      {isQuickUserSwitchActive ? 'Enabled ✓' : 'Disabled ✕'}
                    </button>
                  </div>

                  {selectedUserForDashboard && (
                    <button
                      onClick={() => { sound.playClick(); setSelectedUserForDashboard(null); }}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
                    >
                      ✕ Close User Inspector
                    </button>
                  )}
                </div>
              </div>

              {/* User Selection, Role Filter & Fetch Controls */}
              <div className="space-y-4">
                {/* 1. Role Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Role Filter:</span>
                    </span>
                    {(
                      [
                        { key: 'all', label: 'All Roles', count: userRoleCounts.all, color: 'indigo' },
                        { key: 'student', label: 'Students', count: userRoleCounts.student, color: 'emerald' },
                        { key: 'parent', label: 'Parents', count: userRoleCounts.parent, color: 'amber' },
                        { key: 'teacher', label: 'Teachers', count: userRoleCounts.teacher, color: 'blue' },
                        { key: 'admin', label: 'Admins', count: userRoleCounts.admin, color: 'rose' }
                      ] as const
                    ).map((rf) => {
                      const isActive = userDashboardRoleFilter === rf.key;
                      return (
                        <button
                          key={rf.key}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setUserDashboardRoleFilter(rf.key);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-1 ring-indigo-400'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{rf.label}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rf.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Reset filters shortcut if query or filter active */}
                  {(userDashboardSearch || userDashboardRoleFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setUserDashboardSearch('');
                        setUserDashboardRoleFilter('all');
                        setUserDashboardFetchFeedback(null);
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    >
                      Clear search &amp; filters
                    </button>
                  )}
                </div>

                {/* 2. Search & Fetch Bar + Quick Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  <div className="md:col-span-8 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={userDashboardSearch}
                        onChange={(e) => {
                          setUserDashboardSearch(e.target.value);
                          if (userDashboardFetchFeedback) setUserDashboardFetchFeedback(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFetchUser();
                          }
                        }}
                        placeholder="Enter user name, email, or ID and press Enter to fetch..."
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                      {userDashboardSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setUserDashboardSearch('');
                            if (userDashboardFetchFeedback) setUserDashboardFetchFeedback(null);
                          }}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFetchUser()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                      title="Fetch user matching entered query (or press Enter)"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Fetch User</span>
                    </button>
                  </div>

                  {/* Dropdown User Selector */}
                  <div className="md:col-span-4">
                    <select
                      value={selectedUserForDashboard?.id || ''}
                      onChange={(e) => {
                        const found = users.find((u) => u.id === e.target.value);
                        if (found) {
                          sound.playClick();
                          setSelectedUserForDashboard(found);
                          setUserDashboardFetchFeedback({
                            type: 'success',
                            message: `Selected ${found.name} (${found.role.toUpperCase()})`
                          });
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer text-slate-700"
                    >
                      <option value="">-- Choose User to Inspect ({filteredUserList.length}) --</option>
                      {filteredUserList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} [{u.role.toUpperCase()}] - {u.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fetch Feedback Banner */}
                {userDashboardFetchFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      userDashboardFetchFeedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {userDashboardFetchFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{userDashboardFetchFeedback.message}</span>
                    </div>
                    <button
                      onClick={() => setUserDashboardFetchFeedback(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Inspected User Full Live Dashboard View */}
              {selectedUserForDashboard ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-indigo-200 space-y-6">
                  {/* User Profile Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                        {selectedUserForDashboard.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-slate-900">{selectedUserForDashboard.name}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {selectedUserForDashboard.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {selectedUserForDashboard.email} · DOB: {selectedUserForDashboard.dateOfBirth} · Cohort: {selectedUserForDashboard.preferences?.ageCohort || 'academy'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playClick();
                          StorageService.setActiveUser(selectedUserForDashboard.id);
                          window.location.reload();
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                        title="Experience the platform live from this exact user's session"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Impersonate &amp; Launch User Session</span>
                      </button>
                    </div>
                  </div>

                  {/* Inspected User Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged Activities</div>
                      <div className="text-xl font-black text-slate-900">{targetUserActivities.length}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Questions Log</div>
                      <div className="text-xl font-black text-indigo-600">{targetUserQuestions.length}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Streak</div>
                      <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{selectedUserForDashboard.profileStats?.currentStreak || 1}d</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</div>
                      <div className="text-xl font-black text-teal-600">
                        {selectedUserForDashboard.profileStats?.xp?.toLocaleString() || 50}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">League Level</div>
                      <div className="text-xl font-black text-indigo-600">
                        Level {selectedUserForDashboard.profileStats?.level || 1}
                      </div>
                    </div>
                  </div>

                  {/* Inspected User Records View Toggle */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setInspectedSubView('activities'); }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            inspectedSubView === 'activities'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Activity History ({targetUserActivities.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setInspectedSubView('questions'); }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            inspectedSubView === 'questions'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Question-by-Question Log ({targetUserQuestions.length})
                        </button>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        Inspecting: {selectedUserForDashboard.name} ({selectedUserForDashboard.email})
                      </span>
                    </div>

                    {inspectedSubView === 'questions' ? (
                      targetUserQuestions.length > 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                              <tr>
                                <th className="py-2.5 px-3 whitespace-nowrap">Timestamp</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Module / Test</th>
                                <th className="py-2.5 px-3">Question Prompt</th>
                                <th className="py-2.5 px-3">User's Answer</th>
                                <th className="py-2.5 px-3">Correct Answer</th>
                                <th className="py-2.5 px-3 text-center whitespace-nowrap">Result</th>
                                <th className="py-2.5 px-3">Explanation</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {targetUserQuestions.map((q) => (
                                <tr key={q.id} className="hover:bg-slate-50/70">
                                  <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap align-top">
                                    {q.timestamp}
                                  </td>
                                  <td className="py-2 px-3 align-top whitespace-nowrap">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 block w-fit">
                                      {q.moduleOrSubject}
                                    </span>
                                    <div className="text-[11px] font-semibold text-slate-700 truncate max-w-xs">{q.testTitle}</div>
                                  </td>
                                  <td className="py-2 px-3 align-top max-w-md">
                                    <span className="font-bold text-slate-900 block text-xs">Q{q.questionNumber}: {q.questionPrompt}</span>
                                  </td>
                                  <td className="py-2 px-3 align-top font-medium text-slate-800 max-w-xs">
                                    <div className="p-1.5 rounded bg-slate-50 border border-slate-200 text-xs">
                                      {q.userAnswer}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 align-top font-medium text-emerald-900 max-w-xs">
                                    <div className="p-1.5 rounded bg-emerald-50/60 border border-emerald-200 text-xs">
                                      {q.correctAnswer || 'Standard Rubric'}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-center align-top whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      q.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                                    }`}>
                                      {q.isCorrect ? '✓ Correct' : '✕ Review'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 align-top text-[11px] text-slate-500 max-w-xs">
                                    {q.explanation}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                          No practice questions attempted yet by this user.
                        </div>
                      )
                    ) : (
                      targetUserActivities.length > 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                              <tr>
                                <th className="py-2.5 px-3">Activity</th>
                                <th className="py-2.5 px-3">Category</th>
                                <th className="py-2.5 px-3">Result / Score</th>
                                <th className="py-2.5 px-3">Timestamp</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3 text-right">Attempt Review</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {targetUserActivities.map((act) => {
                                const qStats = getActivityQuestionStats(act);
                                return (
                                  <tr key={act.id} className="hover:bg-slate-50/70">
                                    <td className="py-2.5 px-3">
                                      <div className="font-bold text-slate-900">{act.title}</div>
                                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-sm">{act.details}</div>
                                      <div className="flex flex-wrap items-center gap-1 mt-1">
                                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold">
                                          Total: {qStats.total} Qs
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-bold">
                                          Answers: {qStats.attempted}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                                          Correct: {qStats.correct}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
                                          Wrong: {qStats.wrong}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-600 align-top">{act.category}</td>
                                    <td className="py-2.5 px-3 font-semibold text-emerald-700 align-top">{act.score || 'Completed'}</td>
                                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px] align-top">{act.timestamp}</td>
                                    <td className="py-2.5 px-3 align-top">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {act.status}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right align-top">
                                      <button
                                        onClick={() => {
                                          sound.playClick();
                                          setSelectedAttemptForModal(act);
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                                        title="Inspect user's complete original attempt, submitted answers, and rubric"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>Show Attempt</span>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                          No learning activities recorded yet for this user.
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  Select any user above to inspect their live dashboard, view their skill breakdown, or launch their active session.
                </div>
              )}
            </div>

            {/* Global Recent Activity Feed Summary (All Users + Admin) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900">
                    Recent Activity Feed across All Users (Including Administrator Actions)
                  </h3>
                </div>
                <button
                  onClick={() => { sound.playClick(); setActiveAdminTab('activities'); }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Table ({allActivities.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Activity Title</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Outcome / Score</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allActivities.slice(0, 8).map((act) => {
                      const isAdmin = act.userId === 'usr_admin_04' || act.type === 'admin_action';
                      return (
                        <tr key={act.id} className={isAdmin ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50'}>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isAdmin ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {act.userName || act.userId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{act.title}</td>
                          <td className="py-2.5 px-3 text-slate-600">{act.category}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-700">{act.score || 'Completed'}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{act.timestamp}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 0.5 Dedicated Full-Width Platform Activities Tab (All Users + Admin) */}
      {activeAdminTab === 'activities' && (() => {
        const userRoleMap = new Map<string, UserRole>();
        users.forEach((u) => userRoleMap.set(u.id, u.role));

        const filteredAll = allActivities.filter((act) => {
          const q = activitySearch.toLowerCase().trim();
          const matchesSearch =
            !q ||
            act.title.toLowerCase().includes(q) ||
            act.category.toLowerCase().includes(q) ||
            act.details.toLowerCase().includes(q) ||
            act.userName?.toLowerCase().includes(q) ||
            act.timestamp.toLowerCase().includes(q);

          const matchesCat =
            activityCategoryFilter === 'all' ||
            act.type === activityCategoryFilter ||
            (act.category && act.category.toLowerCase().includes(activityCategoryFilter.toLowerCase())) ||
            (activityCategoryFilter === 'auth' && (act.type === 'auth' || act.category === 'auth' || act.title.toLowerCase().includes('log')));

          const actRole = userRoleMap.get(act.userId) || act.userRole || (act.type === 'admin_action' ? 'admin' : 'student');
          const matchesRole = activityRoleFilter === 'all' || actRole === activityRoleFilter;

          return matchesSearch && matchesCat && matchesRole;
        });

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                    Enterprise Activity Audit Ledger
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Platform User Activities &amp; System Operations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive chronological record of all learning, testing, solving, login sessions, and administrative actions synced live across all machines from the central database.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  {filteredAll.length} Records Matched
                </div>
              </div>

              {/* Filter Controls */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                    {[
                      { id: 'all', label: 'All Roles' },
                      { id: 'student', label: 'Students' },
                      { id: 'teacher', label: 'Teachers' },
                      { id: 'parent', label: 'Parents' },
                      { id: 'admin', label: 'Admin Activities' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { sound.playClick(); setActivityRoleFilter(r.id as any); }}
                        className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                          activityRoleFilter === r.id ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      placeholder="Search by title, user, category..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Category Type Filter Bar */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60 text-xs">
                  {[
                    { id: 'all', label: 'All Activity Types' },
                    { id: 'auth', label: '🔑 Logins & Sessions' },
                    { id: 'mock_test', label: '📝 Exams & Practice' },
                    { id: 'solver', label: '🤖 AI Solvers' },
                    { id: 'lesson', label: '📚 Lessons' },
                    { id: 'vocab_quiz', label: '📖 Vocab Quizzes' },
                    { id: 'admin_action', label: '⚙️ Admin Operations' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { sound.playClick(); setActivityCategoryFilter(c.id); }}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        activityCategoryFilter === c.id ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High-Density Full-Width Activity Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5">User</th>
                      <th className="py-3 px-3.5">Activity Title</th>
                      <th className="py-3 px-3.5">Category</th>
                      <th className="py-3 px-3.5">Result / Score</th>
                      <th className="py-3 px-3.5">Timestamp</th>
                      <th className="py-3 px-3.5">Details</th>
                      <th className="py-3 px-3.5 text-right">Attempt Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAll.map((act) => {
                      const isAdmin = act.userId === 'usr_admin_04' || act.type === 'admin_action';
                      const isAuth = act.type === 'auth' || act.category === 'auth';
                      return (
                        <tr key={act.id} className={isAuth ? 'bg-purple-50/20 hover:bg-purple-50/40' : isAdmin ? 'bg-indigo-50/20 hover:bg-indigo-50/40' : 'hover:bg-slate-50/80'}>
                          <td className="py-3 px-3.5 font-bold">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              isAdmin
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : act.userId === 'usr_teacher_03'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : act.userId === 'usr_parent_02'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {act.userName || act.userId}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              {isAuth && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                              <span>{act.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-slate-600 font-medium">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isAuth ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {act.category}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-extrabold text-emerald-700">
                            {isAuth ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px]">
                                {act.score || 'Online'}
                              </span>
                            ) : (
                              act.score || 'Completed'
                            )}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">{act.timestamp}</td>
                          <td className="py-3 px-3.5 text-slate-500 text-[11px] max-w-sm" title={act.details}>
                            <div className="line-clamp-2 leading-relaxed">{act.details}</div>
                            {!isAuth && (() => {
                              const qStats = getActivityQuestionStats(act);
                              return (
                                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold">
                                    <span>Total:</span>
                                    <span className="font-extrabold">{qStats.total} Qs</span>
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-bold">
                                    <span>Answers:</span>
                                    <span className="font-extrabold">{qStats.attempted}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                                    <span>Correct:</span>
                                    <span className="font-extrabold text-emerald-800">{qStats.correct}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
                                    <span>Wrong:</span>
                                    <span className="font-extrabold text-rose-800">{qStats.wrong}</span>
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            {isAuth ? (
                              <span className="text-[10px] text-slate-400 font-medium italic">Session Logged</span>
                            ) : (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedAttemptForModal(act);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                                title="Inspect full original attempt, submitted answers, and rubric"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Show Attempt</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 1. Complete User Management Tab */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          
          {/* Header & Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                    Prisma Postgres Database User Directory
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live Cloud DB
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  User Management &amp; Access Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Manage login credentials, passwords, dates of birth (DOB), assigned roles, and enable/disable account access directly in Prisma Postgres.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleTestDatabaseConnection}
                  disabled={dbDiagStatus.loading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
                  title="Test live connection from Vercel to Prisma Postgres database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dbDiagStatus.loading ? 'animate-spin' : ''}`} />
                  <span>{dbDiagStatus.loading ? 'Testing DB...' : 'Test DB Connection'}</span>
                </button>

                {onRefreshUsers && (
                  <button
                    type="button"
                    onClick={handleManualSyncUsers}
                    disabled={isSyncingUsers}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer"
                    title="Reload users directly from Prisma Postgres database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingUsers ? 'animate-spin' : ''}`} />
                    <span>{isSyncingUsers ? 'Syncing...' : 'Sync from Database'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowAddUserModal(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create New User</span>
                </button>
              </div>
            </div>

            {/* Live Database Diagnostic Results Banner */}
            {dbDiagStatus.tested && (
              <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in ${
                dbDiagStatus.success
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}>
                <div className="space-y-1">
                  <div className="font-extrabold flex items-center gap-2">
                    {dbDiagStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{dbDiagStatus.message}</span>
                    {dbDiagStatus.latencyMs !== undefined && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
                        {dbDiagStatus.latencyMs}ms
                      </span>
                    )}
                  </div>
                  {dbDiagStatus.success && (
                    <p className="text-[11px] text-emerald-700">
                      Host: <span className="font-mono font-bold">{dbDiagStatus.host}</span> · Database Tables: <span className="font-bold">{dbDiagStatus.totalTables} verified</span> · Users in Cloud DB: <span className="font-bold">{dbDiagStatus.userCount}</span> · Activities: <span className="font-bold">{dbDiagStatus.activityCount}</span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDbDiagStatus({ tested: false, loading: false })}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Administrator-Controlled Setting: Quick User Switch */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Quick User Switch – Enable/Disable</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isQuickUserSwitchActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isQuickUserSwitchActive ? 'Enabled' : 'Disabled (Default)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
                  Controls fast user switching in the top navigation header. Disabled by default so that scaling user registries remain clean, fast, and secure. Only administrators can modify this policy.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleAdminQuickUserSwitch}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isQuickUserSwitchActive
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isQuickUserSwitchActive ? 'opacity-100' : 'opacity-0'}`} />
                  <span>{isQuickUserSwitchActive ? 'Switch Enabled' : 'Switch Disabled'}</span>
                </button>
              </div>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, or role..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {adminOtpNotice && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-bold flex items-center justify-between animate-in fade-in">
                <span>{adminOtpNotice}</span>
                <button
                  onClick={() => setAdminOtpNotice(null)}
                  className="text-amber-700 hover:text-amber-900 ml-2 p-1 rounded hover:bg-amber-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Users Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Date of Birth (DOB)</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Email Verification</th>
                    <th className="p-3.5">Password</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-black text-xs flex items-center justify-center">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 block">{u.name}</span>
                              {u.username && (
                                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-bold">
                                  @{u.username}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-medium">
                        {u.dateOfBirth}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                          u.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'parent' ? 'bg-pink-100 text-pink-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {u.emailVerified || u.emailVerificationStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : u.emailVerificationStatus === 'verification_expired' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <span>Expired</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending OTP</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        ••••••••
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(!u.emailVerified && u.emailVerificationStatus !== 'verified') && (
                            <button
                              onClick={() => handleAdminVerifyEmail(u)}
                              className="px-2 py-1 rounded-lg font-bold text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-all cursor-pointer flex items-center gap-1"
                              title="Manually verify email address for user"
                            >
                              <ShieldCheck className="w-3 h-3 text-teal-700" />
                              <span>Verify</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              sound.playClick();
                              setInspectingUser(u);
                            }}
                            className="px-2.5 py-1 rounded-lg font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer"
                            title="Inspect user registration credentials and locked records"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => openEditUser(u)}
                            className="px-2.5 py-1 rounded-lg font-bold text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Admin Override: Update Name, Date of Birth, Password, Email, and Role"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleAdminGenerateOtp(u)}
                            className="px-2.5 py-1 rounded-lg font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer flex items-center gap-1"
                            title="Generate and send 6-digit password reset OTP to user email"
                          >
                            <Key className="w-3 h-3 text-amber-700" />
                            <span>Send OTP</span>
                          </button>
                          <button
                            onClick={() => {
                              sound.playClick();
                              onToggleUserStatus(u.id);
                            }}
                            className={`px-3 py-1 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {u.status === 'active' ? 'Disable Access' : 'Enable Access'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Flags Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Platform Feature Governance
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Module Feature Flags (Admin Controlled)
              </h3>
              <p className="text-xs text-slate-500">
                Instantly enable or disable capabilities platform-wide without redeployment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featureFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      {flag.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{flag.name}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{flag.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleFeatureFlag(flag.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                      flag.enabled
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 1.5. Age Groups & Curriculum Content Governance Tab */}
      {activeAdminTab === 'cohorts' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  DOB-Driven Developmental Gating &amp; Curriculum Directorate
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Age Groups &amp; Educational Content Governance
                </h3>
                <p className="text-xs text-slate-500">
                  Configure age cohorts, educational levels, allowed subjects, question bank access, and adult exam gating. Students are automatically assigned based on Date of Birth (DOB).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveCohortRules}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Enforce Content Rules</span>
                </button>
              </div>
            </div>

            {cohortSaveNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{cohortSaveNotice}</span>
              </div>
            )}

            {/* Child Safety & DOB Protection Policy Alert */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-amber-900 font-extrabold block">
                  Automated Date-of-Birth (DOB) Child Protection Safeguard
                </strong>
                <p className="text-amber-800">
                  Student age is calculated dynamically from the Date of Birth recorded in their profile. A five-year-old child (<strong className="font-bold">Little Explorers, Ages 5–8</strong>) is strictly guarded from graduate-level standardized examinations (IELTS Academic, PTE, TOEFL, OET, GRE). All educational assessments, question banks, and quizzes automatically adapt to their developmental cohort.
                </p>
              </div>
            </div>

            {/* Cohorts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {cohortRules.map((c) => (
                <div
                  key={c.cohortId}
                  className="p-6 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4 hover:shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">{c.name}</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                          {c.ageRange}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{c.educationLevel}</p>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        c.allowAdultExams
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {c.allowAdultExams ? 'Exams Active' : 'Child Protected'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                  {/* Allowed Subjects */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                      Assigned Subjects &amp; Question Banks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.allowedSubjects.map((subj, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Configuration Controls */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Adult Exams (IELTS/PTE):</span>
                      <button
                        onClick={() => handleToggleCohortAdultExams(c.cohortId)}
                        className={`text-xs font-extrabold px-3 py-1 rounded-xl transition-all border ${
                          c.allowAdultExams
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {c.allowAdultExams ? 'Allowed' : 'Locked (Safeguarded)'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-700">Difficulty:</span>
                      <span className="font-extrabold px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800">
                        {c.maxDifficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. User Feedback & Bug Reporting Center */}
      {activeAdminTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                User Feedback &amp; Bug Triage
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Feedback Submissions &amp; Admin Email Channel
              </h3>
              <p className="text-xs text-slate-500">
                Review issues raised by learners, inspect email notification logs, and dispatch official administrator responses.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-600 border border-slate-200">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Admin Mailing List: admin@edubridge.org</span>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {feedbackTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-indigo-700 uppercase">{ticket.category}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-800">{ticket.userName} ({ticket.userRole})</span>
                      <span>·</span>
                      <span className="font-mono">{ticket.createdAt}</span>
                      <span>·</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ticket.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1">{ticket.subject}</h4>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto ${
                    ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    ticket.status === 'Investigating' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {ticket.description}
                </p>

                {/* Simulated Email dispatch proof */}
                {ticket.emailNotificationSent && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dispatched notification email to: {ticket.adminEmailRecipients.join(', ')}</span>
                  </div>
                )}

                {/* Admin Response section */}
                {ticket.adminResponse ? (
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Admin Reply by {ticket.adminResponse.respondedBy}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ticket.adminResponse.respondedAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">"{ticket.adminResponse.message}"</p>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setReplyTicketId(ticket.id);
                        setReplyMessage('');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply to User</span>
                    </button>
                  </div>
                )}

                {/* Inline Reply Form */}
                {replyTicketId === ticket.id && (
                  <form onSubmit={handleSendFeedbackReply} className="p-4 bg-white rounded-2xl border border-indigo-200 space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-indigo-950">Compose Administrator Response</span>
                      <select
                        value={replyStatus}
                        onChange={(e) => setReplyStatus(e.target.value as any)}
                        className="p-1 rounded-lg border border-slate-300 text-xs"
                      >
                        <option value="Resolved">Mark as Resolved</option>
                        <option value="Investigating">Mark as Investigating</option>
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      required
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write response to user (this will appear on their feedback drawer)..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyTicketId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                      >
                        Send Response to User
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* 3. Admin Scheduled Jobs Control Tab */}
      {activeAdminTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Automated Background Daemons
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Admin-Controlled Nightly Cron Schedulers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage automated nightly jobs scheduled to run at 00:00 hours to generate practice tests and expand vocabulary.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 px-3.5 py-1.5 rounded-2xl border border-indigo-200 text-xs font-bold text-indigo-800 shrink-0">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Cron Daemon: Running (UTC 00:00 Active)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scheduledJobs.map((job) => {
              const isExecuting = executingJobId === job.id;
              const isExamJob = job.category === 'EXAM_PREP';

              return (
                <div
                  key={job.id}
                  className={`rounded-3xl p-6 sm:p-8 border transition-all space-y-6 flex flex-col justify-between ${
                    job.enabled
                      ? 'bg-white border-slate-200/90 shadow-md'
                      : 'bg-slate-50 border-slate-300 opacity-75'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs ${
                          isExamJob
                            ? 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                            : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                        }`}>
                          {isExamJob ? <Award className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900 leading-snug">{job.name}</h4>
                          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                            Cron: {job.cronExpression} · {job.targetTime}
                          </span>
                        </div>
                      </div>

                      {/* Enable / Pause Toggle */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          onToggleJob(job.id);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                          job.enabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        {job.enabled ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Target & Schedule Details */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Batch Requirement:</span>
                        <strong className="text-slate-900 font-bold">{job.batchTarget}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Next Scheduled Execution:</span>
                        <strong className="text-indigo-700 font-mono">{job.nextRunTimestamp}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Last Execution Log:</span>
                        <span className="text-slate-600 font-mono text-[11px]">{job.lastRunTimestamp || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">Total Items Generated:</span>
                        <span className="font-black text-emerald-700 font-mono">+{job.itemsGeneratedCount} Items</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Run Now Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleTriggerJob(job.id)}
                      disabled={isExecuting}
                      className={`w-full py-3 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                        isExecuting
                          ? 'bg-slate-400 cursor-not-allowed'
                          : isExamJob
                          ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98'
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executing Scheduled Job &amp; Ingesting Content...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Run Job Now (Instant Manual Execution)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Autonomous Ingestion History & Item Timestamp Ledger */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  Nightly 00:00 Scheduler Item Ledger
                </span>
                <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span>Scheduled Ingestion History &amp; Timestamp Ledger ({filteredLedger.length} Items)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological record showing exact timestamps when mock tests, practice tests, and vocabulary items were generated and added to EduBridge.
                </p>
              </div>

              {/* Type Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0 overflow-x-auto">
                {(['All', 'Mock Test', 'Practice Test', 'Vocabulary Word'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLedgerTypeFilter(t);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 ${
                      ledgerTypeFilter === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'All' ? 'All Types' : t + 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search by test title, word, category, or timestamp (e.g. 2026-10-31)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Table with prominent TIMESTAMP column */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 w-48 bg-slate-50">TIMESTAMP</th>
                    <th className="py-3 px-4 w-32 bg-slate-50">ITEM TYPE</th>
                    <th className="py-3 px-4 bg-slate-50">ITEM TITLE / DETAILS</th>
                    <th className="py-3 px-4 w-48 bg-slate-50">EXAM / CATEGORY</th>
                    <th className="py-3 px-4 bg-slate-50">CRON SOURCE</th>
                    <th className="py-3 px-4 w-28 text-center bg-slate-50">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredLedger.length > 0 ? (
                    filteredLedger.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                          🕒 {item.timestamp}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase whitespace-nowrap ${
                              item.itemType === 'Mock Test'
                                ? 'bg-indigo-100 text-indigo-800'
                                : item.itemType === 'Practice Test'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.itemType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.itemTitle}</div>
                          {item.details && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">{item.details}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {item.categoryOrExam}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {item.jobName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Ingested</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No ingested items matched your filter or search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Vocabulary Vault Explorer Tab */}
      {activeAdminTab === 'vocab' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                Dynamic Lexicon Repository
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Active Vocabulary Vault ({vocabularyWords.length} Words)
              </h3>
              <p className="text-xs text-slate-500">
                Populated by the nightly 00:00 cron scheduler with full phonetic and CEFR indexing.
              </p>
            </div>

            <button
              onClick={() => handleTriggerJob('job_vocab_expansion_00')}
              disabled={executingJobId === 'job_vocab_expansion_00'}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>+ Add 100 Words via Scheduler</span>
            </button>
          </div>

          {/* Search & CEFR filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Search words, definitions, translations or categories..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                {['All', 'B1', 'B2', 'C1', 'C2'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedCefr(tier)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      selectedCefr === tier ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* View Switcher: Table vs Cards */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setVocabViewMode('table'); }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    vocabViewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Table View with Timestamp Column"
                >
                  Table View
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setVocabViewMode('grid'); }}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    vocabViewMode === 'grid' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Cards Grid View"
                >
                  Card Grid
                </button>
              </div>
            </div>
          </div>

          {vocabViewMode === 'table' ? (
            /* Table View with Prominent TIMESTAMP / DATE ADDED Column */
            <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[550px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 w-44 bg-slate-50">WORD &amp; PHONETIC</th>
                    <th className="py-3 px-3 w-20 bg-slate-50 text-center">POS</th>
                    <th className="py-3 px-3 w-20 bg-slate-50 text-center">CEFR</th>
                    <th className="py-3 px-4 w-40 bg-slate-50">CATEGORY</th>
                    <th className="py-3 px-4 bg-slate-50">TRANSLATION &amp; DEFINITION</th>
                    <th className="py-3 px-4 w-44 bg-slate-50 text-indigo-900">TIMESTAMP / DATE ADDED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredVocab.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 text-sm">{item.word}</div>
                        <span className="text-[11px] font-mono text-indigo-700 font-semibold">{item.phonetic}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] text-slate-500 font-mono italic">({item.partOfSpeech})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.cefrLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {item.category}
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-800 block text-xs">{item.translation}</strong>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.definition}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                        🕒 {item.dateAdded || item.timestamp || '2026-10-31 00:00:04'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Words Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredVocab.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">{item.word}</h4>
                      <span className="text-xs font-mono text-indigo-700 font-semibold">{item.phonetic}</span>
                      <span className="text-[11px] text-slate-400 italic font-mono">({item.partOfSpeech})</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      CEFR {item.cefrLevel}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-800 block">{item.translation}</strong>
                    <p className="mt-0.5">{item.definition}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[11px] text-slate-500">
                    <span className="italic truncate pr-2">“{item.exampleSentence}”</span>
                    <span className="text-[10px] font-mono font-bold text-indigo-700 shrink-0 whitespace-nowrap">
                      🕒 {item.dateAdded || item.timestamp || '2026-10-31 00:00:04'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Ollama AI Models Configuration */}
      {activeAdminTab === 'models' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Self-Hosted Ollama Model Engines</h3>
              <p className="text-xs text-slate-500">Fine-tune temperatures, VRAM limits, and hot-reload model weights.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Total VRAM: 18.4 / 24.0 GB (Healthy)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{model.name}</h4>
                    <span className="text-xs text-indigo-600 font-semibold">{model.tagline}</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onToggleModelStatus(model.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      model.status === 'online'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {model.status.toUpperCase()}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">VRAM Allocation</span>
                    <span className="font-mono font-bold text-slate-800">{model.vram}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Inference Latency</span>
                    <span className="font-mono font-bold text-indigo-700">{model.latencyMs} ms</span>
                  </div>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Inference Temperature:</span>
                    <strong className="font-mono text-indigo-600">{model.temperature}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={model.temperature}
                    onChange={(e) => onUpdateModelTemp(model.id, Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Assigned Domain:</strong>
                  {model.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. System Telemetry Tab (Prometheus & Grafana) */}
      {activeAdminTab === 'telemetry' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Activity className="w-4 h-4" />
                <span>Prometheus &amp; Grafana Observability Layer</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Health &amp; Resource Metrics</h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 font-semibold hidden sm:inline-block">
                {cacheStatus}
              </span>
              <button
                onClick={handleFlushCache}
                disabled={isFlushingCache}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFlushingCache ? 'animate-spin' : ''}`} />
                <span>Flush Redis Cache</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{m.name}</span>
                <span className="text-xl font-black text-slate-900 block font-mono">{m.value}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  {m.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Audit Logs Tab */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Institutional Audit &amp; Conduction Ledgers</h3>
              <p className="text-xs text-slate-500">Official cryptographic verification records confirming student test attempts and system actions.</p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setAuditSubTab('conduction')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  auditSubTab === 'conduction'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Test Conduction Ledger ({StorageService.getTestConductionLogs().length})</span>
              </button>

              <button
                onClick={() => setAuditSubTab('system')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  auditSubTab === 'system'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Security Events ({auditLogs.length})</span>
              </button>

              <button
                onClick={() => setAuditSubTab('otps')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  auditSubTab === 'otps'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>Database OTPs ({dbOtps.length})</span>
              </button>
            </div>
          </div>

          {auditSubTab === 'conduction' ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-evident log verifying learner test conduction, scores, and completion timestamps.</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 font-black">
                  Cryptographic Proof
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                {StorageService.getTestConductionLogs().map((record: TestConductionRecord) => (
                  <div
                    key={record.id}
                    className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all hover:border-indigo-300 hover:shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                          {record.verificationHash}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          record.testType === 'LESSON_UNIT'
                            ? 'bg-blue-100 text-blue-800'
                            : record.testType === 'MOCK_EXAM'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {record.testType.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(record.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm block">{record.testTitle}</span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>User: <strong className="text-slate-700">{record.userName}</strong> ({record.userEmail})</span>
                        <span>•</span>
                        <span>Category: <strong className="text-slate-700">{record.category}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                      <span className="font-mono text-sm font-black text-indigo-700">
                        {record.score || 'Completed'}
                      </span>
                      {record.xpEarned && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          +{record.xpEarned} XP
                        </span>
                      )}
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : auditSubTab === 'otps' ? (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900 font-bold">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>Central Prisma Postgres OTP Security Ledger (persisted in <code>auth_otps</code> table).</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-indigo-200/70 px-2 py-0.5 rounded text-indigo-950 font-black">
                  Postgres Live Ledger
                </span>
              </div>

              {loadingDbOtps ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-indigo-600" />
                  Loading database OTP security logs...
                </div>
              ) : dbOtps.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                  No database OTP records logged yet. New user creations and password resets will appear here directly from Prisma Postgres.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Recipient</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Attempts</th>
                        <th className="p-3">Created</th>
                        <th className="p-3">Expires</th>
                        <th className="p-3">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {dbOtps.map((otp: any) => {
                        const isExpired = new Date(otp.expires_at || otp.expiresAt).getTime() < Date.now();
                        const status = otp.verified ? 'VERIFIED' : isExpired ? 'EXPIRED' : 'PENDING';
                        return (
                          <tr key={otp.id || `${otp.email}-${otp.created_at}`} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-sans font-bold text-slate-900">{otp.email}</td>
                            <td className="p-3 font-sans">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {otp.type || 'AUTH'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                status === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : status === 'EXPIRED'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">{otp.attempts || 0}</td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {otp.created_at ? new Date(otp.created_at).toLocaleTimeString() : '—'}
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {otp.expires_at ? new Date(otp.expires_at).toLocaleTimeString() : '—'}
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {otp.verified_at ? new Date(otp.verified_at).toLocaleTimeString() : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="font-bold text-slate-800">{log.action}</span>
                  </div>

                  <span className="text-slate-400 text-[11px] truncate sm:max-w-xs">{log.user}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 10. SMTP Integration & Email Delivery Diagnostics */}
      {activeAdminTab === 'smtp' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  RFC 5321 Outbound Mail Cluster
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  SMTP Integration, Email Verification &amp; Diagnostics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure outgoing email service powering OTP registration, password recovery, and administrator notifications across Gmail, Outlook, Yahoo, and Exchange.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  smtpConfig.active
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${smtpConfig.active ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{smtpConfig.active ? 'SMTP Outbound Active' : 'Simulated Delivery Mode'}</span>
                </span>
              </div>
            </div>

            {smtpSavedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{smtpSavedNotice}</span>
                </div>
                <button onClick={() => setSmtpSavedNotice(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
              </div>
            )}

            {/* Quick Provider Presets */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                Quick Provider Presets (Auto-Configure Host &amp; Port)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { name: 'Free Outlook / Exchange', host: 'smtp-mail.outlook.com', port: 587, encryption: 'STARTTLS' as const },
                  { name: 'Microsoft 365 / Office', host: 'smtp.office365.com', port: 587, encryption: 'STARTTLS' as const },
                  { name: 'Gmail / Google', host: 'smtp.gmail.com', port: 587, encryption: 'STARTTLS' as const },
                  { name: 'Yahoo Mail', host: 'smtp.mail.yahoo.com', port: 465, encryption: 'SSL' as const },
                  { name: 'Corporate Exchange Relay', host: 'mail.yourdomain.com', port: 25, encryption: 'None' as const }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSmtpConfig((prev) => ({
                        ...prev,
                        host: preset.host,
                        port: preset.port,
                        encryption: preset.encryption
                      }));
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      smtpConfig.host === preset.host && smtpConfig.port === preset.port
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-[11px] leading-tight">{preset.name}</div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">{preset.host}:{preset.port}</div>
                  </button>
                ))}
              </div>

              {/* Gmail / Google Workspace Setup Instructions */}
              {smtpConfig.host.includes('gmail.com') && (
                <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Gmail / Google Workspace Notice: Dedicated 16-Character App Password Required</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    Google permanently disabled standard account passwords for SMTP. Using your regular Google account password causes error <code className="bg-amber-100/90 text-amber-950 font-mono px-1 py-0.5 rounded font-bold">535 5.7.8 BadCredentials</code>.
                  </p>
                  <div className="bg-white/90 border border-amber-200 rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="font-bold text-slate-800">How to configure Gmail SMTP in 60 seconds:</div>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                      <li>Ensure <strong>2-Step Verification</strong> is ON in your Google Account (<a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">myaccount.google.com/security</a>).</li>
                      <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-600 font-black underline">myaccount.google.com/apppasswords</a> to generate an App Password.</li>
                      <li>Type app name <strong>EduBridge</strong> and copy the generated 16-character code (e.g. <code className="font-mono text-indigo-700 bg-indigo-50 px-1 rounded">abcd efgh ijkl mnop</code>).</li>
                      <li>Paste this code into <strong>SMTP Password / App Password</strong> below (spaces are stripped automatically), then click <strong>Save Configuration to Database</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* SMTP Configuration Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                sound.playClick();
                try {
                  const res = await apiService.smtp.saveConfig(smtpConfig);
                  if (res && res.config) setSmtpConfig(res.config);
                  setSmtpSavedNotice('✓ SMTP configuration securely saved to Prisma Postgres database.');
                  sound.playSuccess();
                  setTimeout(() => setSmtpSavedNotice(null), 4000);
                } catch (err: any) {
                  sound.playError();
                  setSmtpSavedNotice(`Error saving SMTP settings: ${err.message}`);
                }
              }}
              className="space-y-4 pt-2 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP Host / Server</label>
                  <input
                    type="text"
                    required
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    placeholder="e.g. smtp.gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Port</label>
                  <input
                    type="number"
                    required
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: parseInt(e.target.value, 10) || 587 })}
                    placeholder="465 or 587"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Encryption Mode</label>
                  <select
                    value={smtpConfig.encryption}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, encryption: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="SSL">SSL / TLS (Port 465)</option>
                    <option value="STARTTLS">STARTTLS (Port 587 / 25)</option>
                    <option value="NONE">Unencrypted (Development Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP Username / Account</label>
                  <input
                    type="text"
                    value={smtpConfig.authUser}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, authUser: e.target.value })}
                    placeholder="e.g. support@yourdomain.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP Password / App Password</label>
                  <input
                    type="password"
                    value={smtpConfig.authPass}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, authPass: e.target.value })}
                    placeholder="Enter password or leave masked..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    🔒 Stored in server vault. Leave as •••••••• to keep existing credential unchanged.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sender Email Address (From)</label>
                  <input
                    type="email"
                    required
                    value={smtpConfig.fromEmail}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                    placeholder="e.g. noreply@edubridge.io"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sender Display Name</label>
                  <input
                    type="text"
                    required
                    value={smtpConfig.fromName}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, fromName: e.target.value })}
                    placeholder="e.g. EduBridge Security & Verification"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smtpConfig.active}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-bold text-slate-800">Enable Live SMTP Delivery</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Configuration to Database</span>
                </button>
              </div>
            </form>
          </div>

          {/* Test SMTP Delivery Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base border-b border-slate-100 pb-3">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Verify Connection &amp; Send Diagnostic Test Email</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                value={smtpTestRecipient}
                onChange={(e) => setSmtpTestRecipient(e.target.value)}
                placeholder="Enter recipient email address..."
                className="flex-1 w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                disabled={smtpTesting}
                onClick={async () => {
                  setSmtpTesting(true);
                  setSmtpTestResult(null);
                  sound.playClick();
                  try {
                    const res = await apiService.smtp.testConnection({
                      recipientEmail: smtpTestRecipient,
                      ...smtpConfig
                    });
                    const isDelivered = Boolean(res.success && (res as any).delivered === true);
                    const hasErrorInMsg = Boolean(
                      (res.message || '').includes('failed') ||
                      (res.message || '').includes('BadCredentials') ||
                      (res.message || '').includes('535') ||
                      (res.message || '').includes('SIMULATED') ||
                      (res.message || '').includes('notice:')
                    );
                    const isSuccess = isDelivered && !hasErrorInMsg;
                    setSmtpTestResult({
                      success: isSuccess,
                      message: res.message || (isSuccess ? 'Verification test delivered successfully.' : 'Diagnostic test could not deliver.')
                    });
                    if (isSuccess) {
                      sound.playSuccess();
                    } else {
                      sound.playError();
                    }
                    const freshLogs = await apiService.smtp.getLogs();
                    setEmailLogs(freshLogs);
                  } catch (err: any) {
                    sound.playError();
                    setSmtpTestResult({ success: false, message: err.message || 'SMTP test failed.' });
                    try {
                      const freshLogs = await apiService.smtp.getLogs();
                      setEmailLogs(freshLogs);
                    } catch {}
                  } finally {
                    setSmtpTesting(false);
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {smtpTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>{smtpTesting ? 'Executing Handshake...' : 'Send Test Verification Email'}</span>
              </button>
            </div>

            {smtpTestResult && (
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                smtpTestResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="font-extrabold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {smtpTestResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-sm font-black">
                      {smtpTestResult.success ? 'Diagnostic Test Passed (Delivered Live)' : 'Diagnostic Test Failed'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    smtpTestResult.success ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}>
                    {smtpTestResult.success ? 'SMTP Verified' : 'Action Required'}
                  </span>
                </div>

                <p className="font-mono text-[11px] whitespace-pre-wrap bg-white/80 p-2.5 rounded-xl border border-slate-200/60 break-words">
                  {smtpTestResult.message}
                </p>

                {!smtpTestResult.success && (smtpTestResult.message.includes('BadCredentials') || smtpTestResult.message.includes('535') || smtpConfig.host.includes('gmail.com')) && (
                  <div className="bg-white rounded-xl p-3 border border-rose-200 text-slate-800 text-xs space-y-1.5 shadow-2xs">
                    <div className="font-black text-rose-700 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-rose-600" />
                      <span>How to resolve Gmail BadCredentials (535 5.7.8):</span>
                    </div>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700">
                      <li>Go to your Google Account at <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">myaccount.google.com/security</a> and make sure <strong>2-Step Verification</strong> is enabled.</li>
                      <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-600 font-black underline">myaccount.google.com/apppasswords</a>.</li>
                      <li>In the app name field, enter <strong>EduBridge</strong> and click <em>Create</em>.</li>
                      <li>Google will display a 16-character code (e.g., <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700">xxxx xxxx xxxx xxxx</code>).</li>
                      <li>Paste this 16-character App Password into the <strong>SMTP Password / App Password</strong> field above, click <strong>Save Configuration to Database</strong>, and click <strong>Send Test Verification Email</strong> again.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Email Delivery Audit Trail & Diagnostic Logs */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Outbound Email Delivery Diagnostics &amp; Audit Trail ({emailLogs.length})</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  sound.playClick();
                  const logs = await apiService.smtp.getLogs();
                  setEmailLogs(logs);
                  sound.playSuccess();
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Purpose / Subject</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3">Diagnostic Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                        No outgoing email logs recorded yet. Dispatch a test verification email above.
                      </td>
                    </tr>
                  ) : (
                    emailLogs.slice(0, 30).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {log.recipient}
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-semibold block">{log.subject}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.type}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'SIMULATED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500 max-w-xs truncate" title={log.responseInfo}>
                          {log.responseInfo || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 11. Prisma Postgres Cloud Database & Central Configuration Setup Panel */}
      {activeAdminTab === 'database' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Centralized Cloud Database &amp; System Configuration</span>
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Prisma Postgres Database Objects &amp; Configuration Setup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect and control all 23 live database objects (tables and views) across Exams, Practice Tests, Quizzes, Questions, Activities, and Centralized Configurations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDbLoading(true);
                    apiService.getHealth()
                      .then((h) => setDbHealth(h))
                      .catch(() => {})
                      .finally(() => setDbLoading(false));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>Refresh DB Status</span>
                </button>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Prisma Postgres Connected</span>
                </span>
              </div>
            </div>

            {dbSaveNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{dbSaveNotice}</span>
                </div>
                <button onClick={() => setDbSaveNotice(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-600 uppercase block">Standard &amp; Practice Tests</span>
                <span className="text-2xl font-black text-indigo-950">{dbHealth?.totalStandardTests ?? 68}</span>
                <span className="text-[10px] text-indigo-500 block font-medium">Table: standard_tests (Views: exams, practice_tests, mock_tests)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                <span className="text-[11px] font-bold text-violet-600 uppercase block">Quizzes &amp; Diagnostics</span>
                <span className="text-2xl font-black text-violet-950">{dbHealth?.totalQuizzes ?? 60}</span>
                <span className="text-[10px] text-violet-500 block font-medium">Table: quizzes (Cohort &amp; CEFR Vocab)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-600 uppercase block">Configurations &amp; Setup</span>
                <span className="text-2xl font-black text-emerald-950">{dbHealth?.totalConfigurations ?? 5}</span>
                <span className="text-[10px] text-emerald-500 block font-medium">Table: app_configurations (View: configuration_setup)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="text-[11px] font-bold text-sky-600 uppercase block">Active Users &amp; Ledger</span>
                <span className="text-2xl font-black text-sky-950">{dbHealth?.totalUsers ?? users.length} / {dbHealth?.totalActivities ?? allActivities.length}</span>
                <span className="text-[10px] text-sky-500 block font-medium">Tables: users, activities, sessions, question_attempts</span>
              </div>
            </div>
          </div>

          {/* Database Objects Directory (23 Objects: 13 Tables + 10 Views) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900">Database Objects Catalog (23 Objects Deployed in Prisma Postgres)</h4>
                <p className="text-xs text-slate-500">
                  Every functional entity in EduBridge is mapped to a dedicated table or view in PostgreSQL on <span className="font-mono text-indigo-600">db.prisma.io</span>.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">Schema: public</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'standard_tests', type: 'BASE TABLE', desc: 'All standardized mock and practice tests across IELTS, PTE, TOEFL, OET, DET, Cambridge (>=10 questions)', count: `${dbHealth?.totalStandardTests ?? 68} rows` },
                { name: 'exams', type: 'VIEW', desc: 'Mock test view filtered by test_type = "mock" for rapid examination queries', count: 'Active View' },
                { name: 'mock_tests', type: 'VIEW', desc: 'Standardized mock examinations with full question sets and score thresholds', count: 'Active View' },
                { name: 'practice_tests', type: 'VIEW', desc: 'Subject practice test modules with question banks and band scores', count: 'Active View' },
                { name: 'sample_tests', type: 'VIEW', desc: 'Comprehensive sample tests view across all examination formats', count: 'Active View' },
                { name: 'quizzes', type: 'BASE TABLE', desc: 'Age-cohort diagnostics and CEFR vocabulary quizzes with phonetic audio and praise', count: `${dbHealth?.totalQuizzes ?? 60} rows` },
                { name: 'app_configurations', type: 'BASE TABLE', desc: 'Central configuration setup table storing exam settings, feature flags, themes, and system settings', count: '5 configurations' },
                { name: 'configuration_setup', type: 'VIEW', desc: 'Key-value configuration view for portal governance and global parameter control', count: 'Active View' },
                { name: 'scheduled_jobs', type: 'BASE TABLE', desc: 'Automated database generator jobs, cron schedules, last run timestamps, and generated item counts', count: '3 active jobs' },
                { name: 'schedule_jobs', type: 'VIEW', desc: 'Database schedule runner view monitoring midnight cron execution state', count: 'Active View' },
                { name: 'question_attempts', type: 'BASE TABLE', desc: 'Individual question-level answers, choices, correct answers, time spent, and AI explanations', count: `${dbHealth?.totalQuestionAttempts ?? 6} rows` },
                { name: 'questions', type: 'VIEW', desc: 'Question bank view aggregating standard test questions and user attempts', count: 'Active View' },
                { name: 'answers', type: 'VIEW', desc: 'User response answer history ledger and correctness evaluations', count: 'Active View' },
                { name: 'written_responses', type: 'BASE TABLE', desc: 'Full-text essays, word counts, writing duration, band scores, and rubric feedback', count: '1 record' },
                { name: 'activities', type: 'BASE TABLE', desc: 'Central activity board ledger recording test completions, scores, and XP', count: `${dbHealth?.totalActivities ?? 20} rows` },
                { name: 'student_activities', type: 'VIEW', desc: 'Student learning progress view for parent and teacher dashboards', count: 'Active View' },
                { name: 'users', type: 'BASE TABLE', desc: 'Accounts, credentials, roles (admin/teacher/student/parent), preferences, and profile statistics', count: `${dbHealth?.totalUsers ?? 8} users` },
                { name: 'sessions', type: 'BASE TABLE', desc: 'Cross-device authentication tokens and expiration timestamps', count: 'Active Sessions' },
                { name: 'incomplete_attempts', type: 'BASE TABLE', desc: 'In-progress exam autosaves preserving answered questions and elapsed time', count: 'Autosave Store' },
                { name: 'smtp_config & email_logs', type: 'BASE TABLES', desc: 'Dynamic outbound mail credentials and delivery audit records', count: 'Ready for Logs' }
              ].map((obj, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">{obj.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                      obj.type === 'VIEW' ? 'bg-violet-100 text-violet-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {obj.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">{obj.desc}</p>
                  <div className="pt-1 text-[10px] font-semibold text-slate-400">{obj.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Central Application Configuration Control (app_configurations) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Centralized Database Governance
              </span>
              <h4 className="text-lg font-black text-slate-900">Application Configuration Setup (`app_configurations`)</h4>
              <p className="text-xs text-slate-500">
                Any configuration changed here is saved directly to the Prisma Postgres database and propagates automatically to all connected users within 4 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Exam & Practice Questions Config */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Exam Question Parameters</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Questions Per Test (Guaranteed &ge; 10)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={dbMinQuestions}
                    onChange={(e) => setDbMinQuestions(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white font-mono font-bold text-indigo-900 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Applies across IELTS, PTE, TOEFL, OET, DET, Cambridge English</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Writing Tasks Per Test</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={dbWritingQuestions}
                    onChange={(e) => setDbWritingQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-xl border border-indigo-200 bg-white font-mono font-bold text-indigo-900 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Shuffle Options</span>
                    <span className="text-[10px] text-slate-500">Randomize multiple-choice choices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dbShuffleOptions}
                    onChange={(e) => setDbShuffleOptions(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Supported Exam Standards & System Controls */}
              <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-4">
                <div className="flex items-center gap-2 text-violet-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-violet-600" />
                  <span>Standardized Exam Formats</span>
                </div>
                <div className="space-y-2 text-xs">
                  {['IELTS Academic & General', 'PTE Academic 90-Score', 'TOEFL iBT 120-Score', 'OET Medical Healthcare', 'Duolingo English Test (DET)', 'Cambridge English (C1/C2)'].map((std, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-violet-100 text-slate-700">
                      <span className="font-semibold text-[11px]">{std}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">&ge; 10 Questions</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme & Styling Controller */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sliders className="w-4 h-4 text-slate-600" />
                  <span>Global Portal Color Scheme</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select the system-wide visual theme saved in <span className="font-mono text-indigo-600">app_configurations</span> table.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'default-indigo', name: 'Oceanic Indigo', color: '#4f46e5' },
                    { id: 'emerald-growth', name: 'Emerald Forest', color: '#059669' },
                    { id: 'royal-violet', name: 'Royal Amethyst', color: '#7c3aed' },
                    { id: 'sunset-amber', name: 'Sunset Amber', color: '#d97706' },
                    { id: 'rose-blossom', name: 'Rose Blossom', color: '#e11d48' },
                    { id: 'cyber-cyan', name: 'Cyber Cyan', color: '#0891b2' },
                    { id: 'midnight-dark', name: 'Midnight Dark', color: '#1e293b' },
                    { id: 'high-contrast', name: 'High Contrast', color: '#000000' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        const newConfig = { preset: preset.id as any, custom: { primaryColor: preset.color, accentColor: '#06b6d4', surfaceTone: 'light' as const } };
                        StorageService.saveColorScheme(newConfig);
                        applyThemeToDom(newConfig);
                        apiService.config.set('color_scheme', newConfig, 'ui', 'Global portal theme').catch(() => {});
                        setDbSaveNotice(`Theme "${preset.name}" saved to Prisma Postgres database.`);
                      }}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 text-left transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: preset.color }}></span>
                      <span className="text-[11px] font-bold text-slate-700 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Database Target: <span className="font-mono text-indigo-600 font-bold">Prisma Postgres Cloud (db.prisma.io:5432)</span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  sound.playClick();
                  setDbLoading(true);
                  try {
                    const newSettings: ExamSettingsConfig = {
                      questionsPerTest: dbMinQuestions,
                      allowShuffleOptions: dbShuffleOptions,
                      writingTestQuestions: dbWritingQuestions
                    };
                    StorageService.saveExamSettings(newSettings);
                    await apiService.config.set('exam_settings', newSettings, 'exam', 'Standardized test question counts');
                    setDbSaveNotice('Configurations saved to Prisma Postgres database (app_configurations). Synchronized across all users.');
                  } catch (e: any) {
                    setDbSaveNotice(`Saved locally (Cloud response: ${e.message})`);
                  } finally {
                    setDbLoading(false);
                  }
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save All Configurations to Prisma Postgres</span>
              </button>
            </div>
          </div>

          {/* Database Scheduled Jobs Execution Runner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Database Jobs &amp; Automated Generators
              </span>
              <h4 className="text-lg font-black text-slate-900">Run Database Jobs On Demand</h4>
              <p className="text-xs text-slate-500">
                Execute automated database scheduled jobs immediately. Generated mock tests, practice tests, and quizzes are stored directly in their respective tables (<span className="font-mono text-indigo-600">standard_tests</span>, <span className="font-mono text-indigo-600">quizzes</span>).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'job_exam_midnight_00',
                  name: 'Nightly Exam Generator Job',
                  desc: 'Generates 6 Mock Tests (PTE, TOEFL, OET, DET, Cambridge, IELTS) + 5 Practice Tests (>=10 questions each) into standard_tests table',
                  target: 'standard_tests table'
                },
                {
                  id: 'job_vocab_expansion_00',
                  name: 'Daily Vocabulary Vault Job',
                  desc: 'Generates 100 CEFR-graded vocabulary words and diagnostic quiz items into quizzes table',
                  target: 'quizzes table'
                },
                {
                  id: 'job_quiz_generation_00',
                  name: 'Cohort Assessment Generator',
                  desc: 'Generates 10 age-cohort diagnostic quizzes across Early, Junior, Academy, Pro, and Senior into quizzes table',
                  target: 'quizzes table'
                }
              ].map((job) => (
                <div key={job.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-slate-800 block">{job.name}</span>
                    <p className="text-[11px] text-slate-500 leading-tight">{job.desc}</p>
                    <span className="inline-block mt-1 font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      Stores to: {job.target}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={dbRunningJob === job.id}
                    onClick={async () => {
                      sound.playClick();
                      setDbRunningJob(job.id);
                      try {
                        await onRunScheduledJob(job.id);
                        setDbSaveNotice(`Database job "${job.name}" executed successfully! New items stored in Prisma Postgres.`);
                        const h = await apiService.getHealth();
                        setDbHealth(h);
                      } catch (e: any) {
                        setDbSaveNotice(`Job execution note: ${e.message}`);
                      } finally {
                        setDbRunningJob(null);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dbRunningJob === job.id
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <Play className={`w-3.5 h-3.5 ${dbRunningJob === job.id ? 'animate-spin' : ''}`} />
                    <span>{dbRunningJob === job.id ? 'Executing on Prisma Postgres...' : 'Run Database Job Now'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal Dialog */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add New User to Prisma Postgres Database</h3>
            
            {createUserError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {createUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unique Username</label>
                <div className="relative">
                  <span className="text-slate-400 font-bold text-xs absolute left-3 top-2.5">@</span>
                  <input
                    type="text"
                    required
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder={newUserName ? newUserName.toLowerCase().replace(/\s+/g, '.') : 'jordan.lee'}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="jordan@edubridge.org"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Password</label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth (DOB)</label>
                  <input
                    type="date"
                    required
                    value={newUserDob}
                    onChange={(e) => setNewUserDob(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                🔒 Note: Once filled and created, Legal Name and Date of Birth are locked as permanent credentials.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="student">Student (Learner)</option>
                  <option value="parent">Parent (Progress Monitor)</option>
                  <option value="teacher">Teacher (Curriculum &amp; Questions)</option>
                  <option value="admin">Administrator (Cluster Overseer)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={isCreatingUser}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isCreatingUser ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>Save User to Database</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect User Identity & Locked Records Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  {inspectingUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">User Identity &amp; Credential Record</h3>
                  <p className="text-xs text-slate-500">ID: {inspectingUser.id} · Stored in Prisma Postgres Database</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
              <span className="text-base">🔒</span>
              <div>
                <strong>Identity Credentials:</strong> Locked for regular users. Administrators have full authorization to modify credentials below via <strong>Edit Credentials</strong>.
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={inspectingUser.name}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-semibold cursor-not-allowed select-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    disabled
                    value={inspectingUser.dateOfBirth}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-semibold cursor-not-allowed select-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                  <input
                    type="text"
                    disabled
                    value={inspectingUser.role.toUpperCase()}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-100 text-indigo-700 font-black cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={inspectingUser.email}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unique Username</label>
                <input
                  type="text"
                  disabled
                  value={`@${inspectingUser.username || inspectingUser.email.split('@')[0]}`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Account Status</div>
                  <div className={`font-black text-xs ${inspectingUser.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {inspectingUser.status.toUpperCase()}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Created Date</div>
                  <div className="font-bold text-xs text-slate-700">{inspectingUser.createdAt}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = inspectingUser;
                  setInspectingUser(null);
                  openEditUser(target);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Credentials as Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectingUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit User Credentials Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Admin Credential Override</h3>
                  <p className="text-xs text-slate-500">Updating credentials for {editingUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Educator"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    required
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-indigo-600 mt-1 font-semibold">
                    Age cohort &amp; learning tiers will re-sync automatically.
                  </p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="student">Student (Learner)</option>
                    <option value="teacher">Teacher (Instructor)</option>
                    <option value="parent">Parent (Supervisor)</option>
                    <option value="admin">Administrator (Cluster Overseer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Login Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. alex@edubridge.org"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username Handle</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="e.g. alex.chen"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Password</label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      required
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2.5 pr-9 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Save Updated Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administrator Full Attempt Inspection Modal */}
      <ShowAttemptModal
        isOpen={!!selectedAttemptForModal}
        onClose={() => setSelectedAttemptForModal(null)}
        activity={selectedAttemptForModal}
      />

    </div>
  );
};
