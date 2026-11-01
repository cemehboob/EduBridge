import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Key,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserAccount, UserRole, FontScale } from '../../types';
import { sound } from '../../utils/audio';
import { StorageService } from '../../services/storage';
import { calculateAge, calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  onResetPassword?: (email: string, newPassword: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLogin,
  onRegister,
  onResetPassword
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  // Forgot password & 6-digit OTP state
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [simulatedEmailNotice, setSimulatedEmailNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // OTP resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
      setErrorMsg('Incorrect password. Please verify your credentials or click "Forgot Password?".');
      return;
    }

    sound.playSuccess();
    onLogin(user);
    onClose();
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      sound.playError();
      setErrorMsg(`No account found for "${cleanEmail}". Please check the spelling or create a new account.`);
      return;
    }

    // Generate 6-digit numeric OTP code
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    StorageService.savePasswordResetOtp(cleanEmail, generatedOtp);

    setSimulatedEmailNotice(
      `📬 Dispatched to ${cleanEmail}: Your 6-Digit EduBridge Password Reset OTP is [ ${generatedOtp} ] (Expires in 10 minutes)`
    );
    setEnteredOtp(generatedOtp); // Pre-fill for convenient inspection in offline sandbox
    setResendCooldown(60);
    sound.playSuccess();
    setForgotStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    const cleanOtp = enteredOtp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code sent to your email.');
      return;
    }

    const record = StorageService.getPasswordResetOtp(cleanEmail);
    if (!record || record.otp !== cleanOtp) {
      sound.playError();
      setErrorMsg('Invalid or expired 6-digit code. Please request a new code.');
      return;
    }

    sound.playSuccess();
    setForgotStep('new_password');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both entries.');
      return;
    }

    const cleanEmail = forgotEmail.trim().toLowerCase();
    onResetPassword?.(cleanEmail, newPassword);
    StorageService.clearPasswordResetOtp(cleanEmail);

    sound.playLevelUp();
    setSuccessMsg('Your password has been reset successfully! Please sign in with your new password.');
    setLoginIdentifier(cleanEmail);
    setLoginPassword('');
    setTab('login');
    setForgotStep('email');
    setSimulatedEmailNotice(null);
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

        {/* Tab Switcher: Login vs Register vs Forgot Password */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => { sound.playClick(); setTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              tab === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Password
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              tab === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
          {tab === 'forgot_password' && (
            <button
              className="pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 border-amber-600 text-amber-700"
            >
              Reset Password (OTP)
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                🔒 <strong>Strict Password Authentication:</strong> Single-click bypasses are disabled. All learners, parents, teachers, and administrators must authenticate with their verified password.
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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Account Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTab('forgot_password');
                      setForgotStep('email');
                      setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
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
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify Credentials &amp; Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : tab === 'forgot_password' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Secure 6-Digit OTP Password Reset</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Enter your registered email address to receive an instant 6-digit one-time passcode (OTP) for password recovery.
                </p>
              </div>

              {simulatedEmailNotice && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 space-y-2 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>Simulated Email Delivery Dispatch</span>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-indigo-100 text-indigo-800 break-all">
                    {simulatedEmailNotice}
                  </div>
                </div>
              )}

              {/* Step 1: Enter Email */}
              {forgotStep === 'email' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. alex.rivera@edubridge.org"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTab('login');
                      }}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send 6-Digit OTP</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verify 6-digit OTP */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 748192"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-slate-300 text-lg font-mono tracking-widest text-center font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Check your email ({forgotEmail}) for the 6-digit verification code.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleSendOtp}
                      className={`text-xs font-bold flex items-center gap-1 ${
                        resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify 6-Digit Code</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === 'new_password' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      New Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)..."
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password..."
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save New Password &amp; Continue</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
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
