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
  X
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
  TestConductionRecord
} from '../../types';
import { sound } from '../../utils/audio';
import { StorageService } from '../../services/storage';

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
  onToggleFeatureFlag,
  onRespondFeedback
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'users' | 'feedback' | 'jobs' | 'models' | 'telemetry' | 'audit' | 'vocab'
  >('users');

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
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8 pb-12">
      
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
            onClick={() => { sound.playClick(); setActiveAdminTab('users'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'users' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('feedback'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeAdminTab === 'feedback' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>User Feedback ({feedbackTickets.length})</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('jobs'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'jobs' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Jobs (00:00)
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('vocab'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'vocab' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vocabulary Vault
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('models'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'models' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ollama AI Models
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('telemetry'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'telemetry' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Telemetry
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveAdminTab('audit'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeAdminTab === 'audit' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

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
                <strong>Immutable Identity Credentials:</strong> Name and Date of Birth were populated during user creation/registration and are permanently disabled from modification to protect learning history and certificates.
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Full Legal Name</label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 Disabled (Set during User Creation)
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={inspectingUser.name}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-semibold cursor-not-allowed select-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Date of Birth</label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      🔒 Disabled
                    </span>
                  </div>
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
                <label className="font-bold text-slate-700 block mb-1">Registered Email (Read-Only)</label>
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

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectingUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
