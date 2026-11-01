import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Calendar,
  Globe,
  Award,
  Zap,
  Briefcase,
  CheckCircle2,
  Shield,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Sliders,
  Check,
  Layout
} from 'lucide-react';
import { UserAccount, AgeCohortId, FontScale, VisibleModulesConfig, VoicePersona, ColorSchemeConfig } from '../../types';
import { sound } from '../../utils/audio';
import { calculateAge, calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';
import { VoicePersonaSelector } from '../common/VoicePersonaSelector';
import { ColorSchemeSelector } from '../common/ColorSchemeSelector';
import { StorageService } from '../../services/storage';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdateUser: (updated: UserAccount) => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser
}) => {
  const [name, setName] = useState(user.name);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [dob, setDob] = useState(user.dateOfBirth);

  // Identity Lock: Name and Date of Birth are disabled if already filled by user while user creation
  const isNameDisabled = Boolean(user.name && user.name.trim().length > 0);
  const isDobDisabled = Boolean(user.dateOfBirth && user.dateOfBirth.trim().length > 0);
  const [ageCohort, setAgeCohort] = useState<AgeCohortId>(
    user.preferences.ageCohort || calculateCohortFromDob(user.dateOfBirth)
  );
  const [fontScale, setFontScale] = useState<FontScale>(
    user.preferences.fontScale || 'standard'
  );
  const [simplifiedInterface, setSimplifiedInterface] = useState<boolean>(
    user.preferences.simplifiedInterface !== undefined
      ? user.preferences.simplifiedInterface
      : (ageCohort === 'early' || ageCohort === 'junior')
  );
  const [visibleModules, setVisibleModules] = useState<Required<VisibleModulesConfig>>({
    dashboard: user.preferences.visibleModules?.dashboard ?? true,
    cohorts: user.preferences.visibleModules?.cohorts ?? true,
    solver: user.preferences.visibleModules?.solver ?? true,
    language: user.preferences.visibleModules?.language ?? true,
    exam: user.preferences.visibleModules?.exam ?? (ageCohort !== 'early'),
    vocab_quiz: user.preferences.visibleModules?.vocab_quiz ?? true,
    academic: user.preferences.visibleModules?.academic ?? (ageCohort !== 'early'),
    tutor: user.preferences.visibleModules?.tutor ?? true,
    planner: user.preferences.visibleModules?.planner ?? (ageCohort !== 'early' && ageCohort !== 'junior'),
    career: user.preferences.visibleModules?.career ?? (ageCohort !== 'early' && ageCohort !== 'junior'),
    leaderboard: user.preferences.visibleModules?.leaderboard ?? true,
    badges: user.preferences.visibleModules?.badges ?? true
  });
  const [showModuleCustomizer, setShowModuleCustomizer] = useState(false);
  const [prefLanguage, setPrefLanguage] = useState(user.preferences.preferredLanguage);
  const [targetExam, setTargetExam] = useState(user.preferences.targetExam || 'IELTS Academic');
  const [targetBand, setTargetBand] = useState(user.preferences.targetBand || '8.0 Band');
  const [targetCareer, setTargetCareer] = useState(user.preferences.targetCareer || 'AI & Machine Learning Engineer');
  const [dailyGoalXp, setDailyGoalXp] = useState(user.preferences.dailyGoalXp);
  const [personaVoice, setPersonaVoice] = useState<VoicePersona>(user.preferences.personaVoice || 'woman');
  const [colorScheme, setColorScheme] = useState<ColorSchemeConfig>(
    user.preferences.colorScheme || StorageService.getColorScheme()
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isChangingPassword && newPassword.trim() && newPassword.trim().length < 6) {
      sound.playError();
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    setPasswordError(null);

    sound.playSuccess();

    // Preserve original name and date of birth if already filled by user during creation
    const isNameDisabled = Boolean(user.name && user.name.trim().length > 0);
    const isDobDisabled = Boolean(user.dateOfBirth && user.dateOfBirth.trim().length > 0);
    const finalName = isNameDisabled ? user.name : (name.trim() || user.name);
    const finalDob = isDobDisabled ? user.dateOfBirth : (dob || user.dateOfBirth);

    const calculatedEdu = calculateEducationLevel(finalDob);

    const updated: UserAccount = {
      ...user,
      name: finalName,
      password: isChangingPassword && newPassword.trim() ? newPassword.trim() : user.password,
      dateOfBirth: finalDob,
      preferences: {
        ...user.preferences,
        preferredLanguage: prefLanguage,
        targetExam,
        targetBand,
        targetCareer,
        dailyGoalXp,
        ageCohort,
        educationLevel: calculatedEdu,
        fontScale,
        simplifiedInterface,
        visibleModules,
        personaVoice,
        colorScheme
      }
    };

    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-black text-xs flex items-center justify-center ring-2 ring-indigo-500/30">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Account Preferences &amp; Profile</h3>
              <p className="text-xs text-slate-500">Stored in EduBridge JSON Repository</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {isSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preferences and credentials saved successfully to JSON!</span>
            </div>
          )}

          {/* Role & Status Pill */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-600">Assigned System Role:</span>
            <span className="px-2.5 py-1 rounded-lg font-black text-indigo-700 bg-white border border-indigo-200 uppercase text-[11px]">
              {user.role}
            </span>
          </div>

          {/* Full Name & Email */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  Full Legal Name {isNameDisabled && <span className="text-[10px] font-normal text-slate-400">(Read-Only)</span>}
                </label>
                {isNameDisabled && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    🔒 Locked · Set during User Creation
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  disabled={isNameDisabled}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs transition-all ${
                    isNameDisabled
                      ? 'border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed select-none'
                      : 'border border-slate-300 focus:ring-2 focus:ring-indigo-500'
                  }`}
                  title={isNameDisabled ? 'Legal name was set during user creation and cannot be changed' : undefined}
                />
              </div>
              {isNameDisabled && (
                <p className="text-[10px] text-slate-400 mt-1">
                  Legal name was registered during account creation and is locked to maintain certificate and portfolio integrity.
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered Email (Read-Only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>

          {/* Date of Birth & Live Developmental Age */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Date of Birth (DOB) {isDobDisabled && <span className="text-[10px] font-normal text-slate-400">(Read-Only)</span>}
              </label>
              {isDobDisabled && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  🔒 Locked · Set during User Creation
                </span>
              )}
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                required
                disabled={isDobDisabled}
                value={dob}
                onChange={(e) => {
                  if (!isDobDisabled) {
                    setDob(e.target.value);
                    const inferred = calculateCohortFromDob(e.target.value);
                    setAgeCohort(inferred);
                  }
                }}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs transition-all ${
                  isDobDisabled
                    ? 'border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed select-none'
                    : 'border border-slate-300 focus:ring-2 focus:ring-indigo-500'
                }`}
                title={isDobDisabled ? 'Date of birth was verified during account creation and cannot be changed' : undefined}
              />
            </div>
            {isDobDisabled && (
              <p className="text-[10px] text-slate-400 mt-1">
                Date of birth was registered during account creation to verify age cohort and curriculum pathways.
              </p>
            )}
            <div className="mt-1.5 text-[11px] text-indigo-700 font-bold flex items-center gap-1.5">
              <span>Calculated Age: {calculateAge(dob)} years old</span>
              <span>•</span>
              <span className="text-slate-600">{calculateEducationLevel(dob)}</span>
            </div>
          </div>

          {/* Account Security & Password Management (Password is never exposed) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Account Credentials &amp; Security</span>
                  <span className="text-[10px] text-slate-500 font-medium">Password is encrypted &amp; hidden</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsChangingPassword(!isChangingPassword);
                  setPasswordError(null);
                }}
                className="px-3 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5 animate-in fade-in duration-150">
                <label className="font-bold text-slate-700 block text-[11px]">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)..."
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setShowNewPassword(!showNewPassword);
                    }}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] font-bold text-rose-600">{passwordError}</p>
                )}
                <p className="text-[10px] text-slate-500">
                  Leave blank to keep your current secure password.
                </p>
              </div>
            )}
          </div>

          {/* Developmental Stage & Accessibility Scaling */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
              Developmental Cohort &amp; Accessibility Scale
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Developmental Stage Cohort</label>
                <select
                  value={ageCohort}
                  onChange={(e) => {
                    const nextCohort = e.target.value as AgeCohortId;
                    setAgeCohort(nextCohort);
                    if (nextCohort === 'early' || nextCohort === 'junior') {
                      setSimplifiedInterface(true);
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="early">🧸 Little Explorers (Ages 5–8 Phonics)</option>
                  <option value="junior">🎒 Junior Scholars (Ages 9–14 STEM)</option>
                  <option value="academy">🎓 Academy &amp; Exams (Ages 15–24 IELTS)</option>
                  <option value="pro">💼 Professional Fluency (Ages 25–54)</option>
                  <option value="senior">🌿 Golden Age (Ages 55+ Vitality)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Font Scaling</label>
                <select
                  value={fontScale}
                  onChange={(e) => setFontScale(e.target.value as FontScale)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="standard">Standard (A - Default)</option>
                  <option value="large">Large (A+ - Enhanced Readability)</option>
                  <option value="xlarge">Extra Large (A++ - Senior &amp; Low-Vision)</option>
                </select>
              </div>
            </div>

            {/* Voice Persona Options */}
            <div className="pt-2 border-t border-slate-100">
              <VoicePersonaSelector
                compact={false}
                showPreviewButton={true}
                onPersonaChange={(p) => setPersonaVoice(p)}
              />
            </div>

            {/* Color Scheme & Theme Template Selection */}
            <div className="pt-3 border-t border-slate-100">
              <ColorSchemeSelector
                currentScheme={colorScheme}
                onChangeScheme={(newScheme) => setColorScheme(newScheme)}
              />
            </div>
          </div>

          {/* Interface Mode & Menu Visibility Controls */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px] flex items-center justify-between">
              <span>Display Simplicity &amp; Menu Controls</span>
              <span className="text-[10px] text-indigo-600 font-bold lowercase">age &amp; preference tailored</span>
            </span>

            {/* Simplified Kid-Friendly Mode Toggle */}
            <div 
              onClick={() => {
                sound.playClick();
                setSimplifiedInterface(!simplifiedInterface);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                simplifiedInterface 
                  ? 'bg-amber-50/80 border-amber-300 shadow-2xs' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  simplifiedInterface ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {simplifiedInterface ? '🧸 Simple Child-Friendly Mode Active' : '⚙️ Standard Full Interface Active'}
                    </span>
                    {(ageCohort === 'early' || ageCohort === 'junior') && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                        Recommended for You
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {simplifiedInterface 
                      ? 'Streamlines navigation into large, easy-to-use learning buttons without complex technical menus.'
                      : 'Enables all modules including full exam prep, calculus, study planner, and career roadmaps.'}
                  </p>
                </div>
              </div>

              <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 shrink-0 ${
                simplifiedInterface ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}>
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform" />
              </div>
            </div>

            {/* Customize Visible Modules Dropdown */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowModuleCustomizer(!showModuleCustomizer);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Enable / Disable Menu Options ({Object.values(visibleModules).filter(Boolean).length}/10 Active)</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{showModuleCustomizer ? '▲ Hide' : '▼ Customize'}</span>
              </button>

              {showModuleCustomizer && (
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'cohorts', label: '🧸 Story & Phonics Arena' },
                    { key: 'solver', label: '💡 AI Universal Question Solver' },
                    { key: 'language', label: '🌳 Language Learning Tree' },
                    { key: 'vocab_quiz', label: '🧠 Vocabulary Quiz Hub' },
                    { key: 'exam', label: '🎯 Practice Tests & Simulators' },
                    { key: 'academic', label: '🔬 STEM Academics (Math/Sci)' },
                    { key: 'tutor', label: '🤖 AI Mentor & Tutor Chat' },
                    { key: 'planner', label: '📅 Daily Study Planner' },
                    { key: 'career', label: '💼 Career & Resume Hub' },
                    { key: 'leaderboard', label: '🏆 Leaderboards & League' },
                    { key: 'badges', label: '🏅 Badges & Honors' }
                  ].map(({ key, label }) => {
                    const isEnabled = visibleModules[key as keyof VisibleModulesConfig];
                    return (
                      <label 
                        key={key} 
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 cursor-pointer hover:border-indigo-300 transition-all"
                      >
                        <span className="font-semibold text-slate-800 text-[11px]">{label}</span>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => {
                            sound.playClick();
                            setVisibleModules(prev => ({ ...prev, [key]: !prev[key as keyof VisibleModulesConfig] }));
                          }}
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
              Learning Goals &amp; Language Setup
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Language</label>
                <select
                  value={prefLanguage}
                  onChange={(e) => setPrefLanguage(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="Academic English">Academic English</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Exam</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="IELTS Academic">IELTS Academic</option>
                  <option value="PTE Academic">PTE Academic</option>
                  <option value="TOEFL iBT">TOEFL iBT</option>
                  <option value="OET Healthcare">OET Healthcare</option>
                  <option value="DET English">DET English</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Score / Band</label>
                <input
                  type="text"
                  value={targetBand}
                  onChange={(e) => setTargetBand(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Daily XP Goal ({dailyGoalXp} XP)</label>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="10"
                  value={dailyGoalXp}
                  onChange={(e) => setDailyGoalXp(Number(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Career Aspiration Track</label>
              <input
                type="text"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
