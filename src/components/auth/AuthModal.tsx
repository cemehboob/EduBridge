import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Calendar,
  Shield,
  GraduationCap,
  Users,
  BookOpenCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, UserRole, FontScale } from '../../types';
import { sound } from '../../utils/audio';
import { calculateAge, calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLogin,
  onRegister
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDob, setRegDob] = useState('2004-09-18');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regTargetExam, setRegTargetExam] = useState('IELTS Academic');
  const [regLanguage, setRegLanguage] = useState('Spanish');

  if (!isOpen) return null;

  // Single click login is strictly allowed ONLY for the root system administrator
  const adminUser = users.find((u) => u.role === 'admin');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = loginIdentifier.trim().toLowerCase();
    if (!cleanId || !loginPassword.trim()) {
      setErrorMsg('Please enter both your username/email and password.');
      return;
    }

    const user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === cleanId) ||
        u.email.toLowerCase() === cleanId ||
        u.name.toLowerCase() === cleanId
    );

    if (!user) {
      sound.playError();
      setErrorMsg(`No account found for "${loginIdentifier.trim()}". Please verify your username or email.`);
      return;
    }

    if (user.status === 'disabled') {
      sound.playError();
      setErrorMsg('This account has been disabled by the system administrator.');
      return;
    }

    if (user.password !== loginPassword) {
      sound.playError();
      setErrorMsg('Incorrect password. Please verify your credentials.');
      return;
    }

    sound.playSuccess();
    onLogin(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = regName.trim();
    const cleanUsername = (regUsername.trim() || cleanName.toLowerCase().replace(/\s+/g, '.')).toLowerCase();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !regPassword.trim() || !regDob) {
      setErrorMsg('Please fill in all required fields including Date of Birth.');
      return;
    }

    // 1. Strict Unique Full Name Validation
    const duplicateName = users.find(
      (u) => u.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicateName) {
      sound.playError();
      setErrorMsg(`A user with the name "${cleanName}" already exists on this machine. Each user must have a unique name.`);
      return;
    }

    // 2. Strict Unique Username Validation
    const duplicateUsername = users.find(
      (u) => (u.username || u.email.split('@')[0] || '').toLowerCase() === cleanUsername
    );
    if (duplicateUsername) {
      sound.playError();
      setErrorMsg(`The username "${cleanUsername}" is already taken. Please choose another username.`);
      return;
    }

    // 3. Strict Unique Email Validation
    const duplicateEmail = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (duplicateEmail) {
      sound.playError();
      setErrorMsg(`An account with email "${cleanEmail}" already exists. Please log in with your password.`);
      return;
    }

    const cohort = calculateCohortFromDob(regDob);
    const eduLevel = calculateEducationLevel(regDob);
    const defaultScale: FontScale = cohort === 'senior' ? 'xlarge' : 'standard';

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: regPassword,
      dateOfBirth: regDob,
      role: regRole,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      preferences: {
        preferredLanguage: regLanguage,
        dailyGoalXp: 100,
        targetExam: regTargetExam,
        targetExamDate: '2026-11-20',
        targetBand: '8.0 Band',
        targetCareer: 'AI & Machine Learning Engineer',
        theme: 'system',
        soundEnabled: true,
        emailNotifications: true,
        ageCohort: cohort,
        educationLevel: eduLevel,
        fontScale: defaultScale
      },
      profileStats: {
        currentStreak: 1,
        highestStreak: 1,
        xp: 100,
        level: 1,
        league: 'Bronze',
        hearts: 5,
        maxHearts: 5,
        todayXp: 0
      }
    };

    sound.playSuccess();
    onRegister(newUser);
    onClose();
  };

  const handleAdminQuickLogin = (admin: UserAccount) => {
    sound.playClick();
    onLogin(admin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-sm">
              EB
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">EduBridge Authentication</h3>
              <p className="text-xs text-slate-500">Secure JSON User Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => { sound.playClick(); setTab('login'); setErrorMsg(null); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              tab === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Password
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('register'); setErrorMsg(null); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              tab === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
              {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                🔒 <strong>Secure Account Access:</strong> All learners, parents, and teachers must sign in with their unique username and password.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Username or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. alex.rivera or alex.rivera@edubridge.org"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In with Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Single-Click Login: STRICTLY RESERVED FOR ROOT ADMINISTRATOR ONLY */}
              {adminUser && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Single-Click Login (Admin Only)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Single-click login is available only for the root system administrator. Learners and teachers must use their username and password.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAdminQuickLogin(adminUser)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Single-Click Sign In as {adminUser.name}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  🔒 Verified legal identity: cannot be modified once registered.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Unique Username
                </label>
                <div className="relative">
                  <span className="text-slate-400 font-bold text-sm absolute left-3.5 top-2.5">@</span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder={regName ? regName.toLowerCase().replace(/\s+/g, '.') : 'jordan.lee'}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Used for sign in. Must be unique on this machine.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jordan@edubridge.org"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth (DOB)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  🔒 Establishes developmental age cohort: locked permanently after registration.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">User Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" /> },
                    { role: 'parent', label: 'Parent', icon: <Users className="w-4 h-4" /> },
                    { role: 'teacher', label: 'Teacher', icon: <BookOpenCheck className="w-4 h-4" /> }
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRegRole(r.role as UserRole)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                        regRole === r.role
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Preferences */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Exam</label>
                  <select
                    value={regTargetExam}
                    onChange={(e) => setRegTargetExam(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="PTE Academic">PTE Academic</option>
                    <option value="TOEFL iBT">TOEFL iBT</option>
                    <option value="OET Healthcare">OET Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Language Track</label>
                  <select
                    value={regLanguage}
                    onChange={(e) => setRegLanguage(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="Academic English">Academic English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration &amp; Connect</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
