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
import { UserAccount, UserRole } from '../../types';
import { sound } from '../../utils/audio';

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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDob, setRegDob] = useState('2004-09-18');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regTargetExam, setRegTargetExam] = useState('IELTS Academic');
  const [regLanguage, setRegLanguage] = useState('Spanish');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!user) {
      sound.playError();
      setErrorMsg('No user account found with this email address.');
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

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regDob) {
      setErrorMsg('Please fill in all required fields including Date of Birth.');
      return;
    }

    const existing = users.find(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (existing) {
      sound.playError();
      setErrorMsg('An account with this email address already exists. Please log in.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      dateOfBirth: regDob,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
        emailNotifications: true
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

  const handleQuickLogin = (demoUser: UserAccount) => {
    sound.playClick();
    onLogin(demoUser);
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
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@edubridge.org"
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
                    placeholder="Enter password..."
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
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick One-Click Demo Role Accounts */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                  Or One-Click Demo Sign-In
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {users.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-white text-left transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                          <p className="text-[10px] text-indigo-600 font-semibold uppercase">{u.role}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
