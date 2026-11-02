import React, { useState } from 'react';
import {
  ShieldAlert,
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
  Check
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
  QuestionAttemptRecord
} from '../../types';
import { sound } from '../../utils/audio';
import { StorageService } from '../../services/storage';
import { calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';

interface AdminPortalProps {
  models: OllamaModelInfo[];
  metrics: SystemMetric[];
  auditLogs: AuditLog[];
  scheduledJobs: ScheduledJob[];
  vocabularyWords: VocabularyWord[];
  ingestedLedger: IngestedItemRecord[];
  users: UserAccount[];
  featureFlags: FeatureFlag[];
  feedbackTickets: UserFeedbackTicket[];
  onToggleModelStatus: (modelId: string) => void;
  onUpdateModelTemp: (modelId: string, temp: number) => void;
  onToggleJob: (jobId: string) => void;
  onRunScheduledJob: (jobId: string) => Promise<void>;
  onToggleUserStatus: (userId: string) => void;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser?: (updatedUser: UserAccount) => void;
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
  featureFlags,
  feedbackTickets,
  onToggleModelStatus,
  onUpdateModelTemp,
  onToggleJob,
  onRunScheduledJob,
  onToggleUserStatus,
  onAddUser,
  onUpdateUser,
  onToggleFeatureFlag,
  onRespondFeedback
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'dashboard' | 'users' | 'activities' | 'feedback' | 'jobs' | 'models' | 'telemetry' | 'audit' | 'vocab'
  >('dashboard');

  // Standardized Practice Test Question Settings State
  const [examSettings, setExamSettings] = useState<ExamSettingsConfig>(() => StorageService.getExamSettings());
  const [examSettingsSavedNotice, setExamSettingsSavedNotice] = useState<string | null>(null);

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
  const [allActivities, setAllActivities] = useState<UserActivityRecord[]>(() => StorageService.getUserActivities());
  const [activitySearch, setActivitySearch] = useState('');
  const [activityRoleFilter, setActivityRoleFilter] = useState<'all' | 'student' | 'teacher' | 'parent' | 'admin'>('all');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');

  // Full User Dashboard Access & Inspector State
  const [selectedUserForDashboard, setSelectedUserForDashboard] = useState<UserAccount | null>(null);
  const [userDashboardSearch, setUserDashboardSearch] = useState('');
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

  const handleAdminGenerateOtp = (u: UserAccount) => {
    sound.playClick();
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    StorageService.savePasswordResetOtp(u.email, otp);
    setAdminOtpNotice(`📬 6-Digit Password Reset OTP dispatched for ${u.name} (${u.email}): [ ${otp} ] · Valid for 10 minutes`);
    sound.playSuccess();
  };

  // Feedback reply state
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState<'Resolved' | 'Investigating'>('Resolved');
  const [auditSubTab, setAuditSubTab] = useState<'conduction' | 'system'>('conduction');

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

  const handleCreateUser = (e: React.FormEvent) => {
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
      setCreateUserError(`A user with the name "${cleanName}" already exists on this machine. Duplicate user names are not allowed.`);
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

    sound.playSuccess();
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: newUserPassword.trim(),
      dateOfBirth: newUserDob,
      role: newUserRole,
      status: 'active',
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

    onAddUser(newUser);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    setCreateUserError(null);
    setShowAddUserModal(false);
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
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <ShieldAlert className="w-4 h-4" />
            <span>EduBridge Enterprise Administrator Cluster</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            User Management, Feature Controls &amp; Feedback Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            JSON User Accounts · Feature Flags · Email Dispatched Feedback · 00:00 Cron Schedulers
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('dashboard'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('users'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'users' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('activities'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'activities' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>All User Activities ({allActivities.length})</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('feedback'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'feedback' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>User Feedback ({feedbackTickets.length})</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('jobs'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'jobs' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Jobs (00:00)
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('vocab'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'vocab' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vocabulary Vault
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('models'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'models' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ollama AI Models
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('telemetry'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'telemetry' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Telemetry
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('audit'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeAdminTab === 'audit' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs
          </button>
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

        // Filter users for user dashboard selector
        const filteredUserList = users.filter((u) => {
          const q = userDashboardSearch.toLowerCase().trim();
          return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
        });

        // Compute activities and question attempts for inspected user
        const targetUserActivities = selectedUserForDashboard
          ? allActivities.filter((a) => a.userId === selectedUserForDashboard.id || a.userName?.toLowerCase() === selectedUserForDashboard.name.toLowerCase())
          : [];

        const targetUserQuestions = selectedUserForDashboard
          ? StorageService.getQuestionAttempts().filter(
              (q) =>
                q.userId === selectedUserForDashboard.id ||
                q.userName?.toLowerCase() === selectedUserForDashboard.name.toLowerCase()
            )
          : [];

        return (
          <div className="space-y-6">
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
                {selectedUserForDashboard && (
                  <button
                    onClick={() => { sound.playClick(); setSelectedUserForDashboard(null); }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer self-start sm:self-auto"
                  >
                    ✕ Close User Inspector
                  </button>
                )}
              </div>

              {/* User Selection & Search Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={userDashboardSearch}
                    onChange={(e) => setUserDashboardSearch(e.target.value)}
                    placeholder="Search user by name, email, or role..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>

                <div className="md:col-span-8 flex flex-wrap items-center gap-1.5 overflow-x-auto">
                  {filteredUserList.map((u) => {
                    const isSelected = selectedUserForDashboard?.id === u.id;
                    const roleColor =
                      u.role === 'admin'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : u.role === 'teacher'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : u.role === 'parent'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedUserForDashboard(u);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{u.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md border font-black uppercase ${isSelected ? 'bg-white/20 text-white border-white/30' : roleColor}`}>
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { sound.playClick(); setInspectedSubView('activities'); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            inspectedSubView === 'activities'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Activity History ({targetUserActivities.length})
                        </button>
                        <button
                          onClick={() => { sound.playClick(); setInspectedSubView('questions'); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {targetUserActivities.map((act) => (
                                <tr key={act.id} className="hover:bg-slate-50/70">
                                  <td className="py-2.5 px-3 font-bold text-slate-900">{act.title}</td>
                                  <td className="py-2.5 px-3 text-slate-600">{act.category}</td>
                                  <td className="py-2.5 px-3 font-semibold text-emerald-700">{act.score || 'Completed'}</td>
                                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{act.timestamp}</td>
                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      {act.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
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
        const filteredAll = allActivities.filter((act) => {
          const q = activitySearch.toLowerCase().trim();
          const matchesSearch =
            !q ||
            act.title.toLowerCase().includes(q) ||
            act.category.toLowerCase().includes(q) ||
            act.details.toLowerCase().includes(q) ||
            act.userName?.toLowerCase().includes(q) ||
            act.timestamp.toLowerCase().includes(q);

          const matchesCat = activityCategoryFilter === 'all' || act.type === activityCategoryFilter;

          const matchesRole =
            activityRoleFilter === 'all' ||
            (activityRoleFilter === 'admin' && (act.userId === 'usr_admin_04' || act.type === 'admin_action')) ||
            (activityRoleFilter === 'teacher' && act.userId === 'usr_teacher_03') ||
            (activityRoleFilter === 'parent' && act.userId === 'usr_parent_02') ||
            (activityRoleFilter === 'student' && act.userId !== 'usr_admin_04' && act.userId !== 'usr_teacher_03' && act.userId !== 'usr_parent_02' && act.type !== 'admin_action');

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
                    Comprehensive chronological record of all learning, testing, solving, and administrative actions performed across EduBridge.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  {filteredAll.length} Records Matched
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                  {[
                    { id: 'all', label: 'All Roles' },
                    { id: 'student', label: 'Students' },
                    { id: 'teacher', label: 'Teachers' },
                    { id: 'parent', label: 'Parents' },
                    { id: 'admin', label: 'Admin Activities' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { sound.playClick(); setActivityRoleFilter(r.id as any); }}
                      className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAll.map((act) => {
                      const isAdmin = act.userId === 'usr_admin_04' || act.type === 'admin_action';
                      return (
                        <tr key={act.id} className={isAdmin ? 'bg-indigo-50/20 hover:bg-indigo-50/40' : 'hover:bg-slate-50/80'}>
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
                          <td className="py-3 px-3.5 font-bold text-slate-900">{act.title}</td>
                          <td className="py-3 px-3.5 text-slate-600 font-medium">{act.category}</td>
                          <td className="py-3 px-3.5 font-extrabold text-emerald-700">{act.score || 'Completed'}</td>
                          <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">{act.timestamp}</td>
                          <td className="py-3 px-3.5 text-slate-500 text-[11px] max-w-xs truncate" title={act.details}>
                            {act.details}
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
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                  JSON-Stored User Directory
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  User Management &amp; Access Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Manage login credentials, passwords, dates of birth (DOB), assigned roles, and enable/disable account access.
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddUserModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New User</span>
              </button>
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
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0 overflow-x-auto">
                {(['All', 'Mock Test', 'Practice Test', 'Vocabulary Word'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setLedgerTypeFilter(t);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
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

      {/* Add User Modal Dialog */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add New User to JSON Repository</h3>
            
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
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
                >
                  Save User to JSON
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
                  <p className="text-xs text-slate-500">ID: {inspectingUser.id} · Stored in JSON</p>
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
                  placeholder="e.g. Alex Chen"
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

    </div>
  );
};
