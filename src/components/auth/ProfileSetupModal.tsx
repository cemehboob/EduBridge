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
  Save
} from 'lucide-react';
import { UserAccount } from '../../types';
import { sound } from '../../utils/audio';

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
  const [password, setPassword] = useState(user.password);
  const [dob, setDob] = useState(user.dateOfBirth);
  const [prefLanguage, setPrefLanguage] = useState(user.preferences.preferredLanguage);
  const [targetExam, setTargetExam] = useState(user.preferences.targetExam || 'IELTS Academic');
  const [targetBand, setTargetBand] = useState(user.preferences.targetBand || '8.0 Band');
  const [targetCareer, setTargetCareer] = useState(user.preferences.targetCareer || 'AI & Machine Learning Engineer');
  const [dailyGoalXp, setDailyGoalXp] = useState(user.preferences.dailyGoalXp);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    const updated: UserAccount = {
      ...user,
      name: name.trim(),
      password: password.trim(),
      dateOfBirth: dob,
      preferences: {
        ...user.preferences,
        preferredLanguage: prefLanguage,
        targetExam,
        targetBand,
        targetCareer,
        dailyGoalXp
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
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
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
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Registered Email (Read-Only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Password & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date of Birth (DOB)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
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
