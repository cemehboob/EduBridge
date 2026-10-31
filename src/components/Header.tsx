import React, { useState } from 'react';
import {
  Flame,
  Heart,
  Zap,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  GraduationCap,
  Users,
  BookOpenCheck,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  User,
  SlidersHorizontal,
  LogOut,
  LogIn,
  ChevronDown,
  Calendar,
  Lock,
  BookOpen,
  Type
} from 'lucide-react';
import { UserProfile, UserRole, UserAccount, FontScale } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  profile: UserProfile;
  currentUser: UserAccount | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isOnline: boolean;
  onOpenSyncModal: () => void;
  onCelebrateStreak?: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenFeedbackModal: () => void;
  onOpenGuideModal: () => void;
  onOpenResourceVault: () => void;
  fontScale: FontScale;
  onFontScaleChange: (scale: FontScale) => void;
  onLogout: () => void;
  feedbackTicketCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentUser,
  activeRole,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  isOnline,
  onOpenSyncModal,
  onCelebrateStreak,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenFeedbackModal,
  onOpenGuideModal,
  onOpenResourceVault,
  fontScale,
  onFontScaleChange,
  onLogout,
  feedbackTicketCount = 0
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const allRoles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'student', label: 'Learner', icon: <GraduationCap className="w-4 h-4" /> },
    { role: 'parent', label: 'Parent Portal', icon: <Users className="w-4 h-4" /> },
    { role: 'teacher', label: 'Teacher Studio', icon: <BookOpenCheck className="w-4 h-4" /> },
    { role: 'admin', label: 'Admin Cluster', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  // Role visibility boundary:
  // If user is Admin, they can inspect and switch between all portals.
  // If user is a student, parent, or teacher, only their authorized role is accessible;
  // Admin Cluster is strictly inaccessible and hidden.
  const isAdmin = currentUser?.role === 'admin';
  const visibleRoles = isAdmin
    ? allRoles
    : allRoles.filter((r) => r.role === (currentUser?.role || 'student'));

  const roleBadgeColors: Record<UserRole, string> = {
    student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    parent: 'bg-amber-50 text-amber-700 border-amber-200',
    teacher: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              EB
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">EduBridge</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Self-Hosted Core
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Bridging Learning, Skills and Future Success</p>
            </div>
          </div>

          {/* Role Navigation Bar */}
          <nav aria-label="Portal Navigation" className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            {isAdmin ? (
              visibleRoles.map((r) => {
                const isActive = activeRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      sound.playClick();
                      onRoleChange(r.role);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {r.icon}
                    <span className="hidden md:inline">{r.label}</span>
                  </button>
                );
              })
            ) : (
              // Non-admin view: single authorized portal indicator with strict RBAC badge
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-bold text-slate-900 capitalize">{currentUser?.role || 'Learner'} Portal</span>
                <span className="hidden lg:inline text-[10px] text-slate-400 font-normal border-l border-slate-300 pl-2">
                  Role-Scoped View
                </span>
              </div>
            )}
          </nav>

          {/* Gamification Stats, Tools & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gamification metrics - shown primarily in student view */}
            {activeRole === 'student' && (
              <>
                {/* Streak */}
                <button
                  onClick={() => {
                    sound.playClick();
                    if (onCelebrateStreak) onCelebrateStreak();
                  }}
                  className="flex items-center gap-1.5 text-amber-600 font-bold text-sm bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200/80 transition-all active:scale-95 cursor-pointer"
                  title={`${profile.currentStreak} day streak! Click to celebrate with fireworks.`}
                >
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>{profile.currentStreak}</span>
                </button>

                {/* XP */}
                <div
                  className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60"
                  title={`${profile.xp} total XP accumulated`}
                >
                  <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                  <span>{profile.xp}</span>
                </div>

                {/* Hearts */}
                <div
                  className="hidden xl:flex items-center gap-1 text-rose-600 font-bold text-sm bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60"
                  title={`${profile.hearts} of ${profile.maxHearts} hearts available`}
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{profile.hearts}/{profile.maxHearts}</span>
                </div>
              </>
            )}

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dynamic Font Scaler (Accessibility First: A / A+ / A++) */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200" title="Dynamic Font Scaler (Accessibility First)">
              <button
                onClick={() => {
                  sound.playClick();
                  onFontScaleChange('standard');
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${
                  fontScale === 'standard' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Standard Text Size (A)"
              >
                A
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onFontScaleChange('large');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                  fontScale === 'large' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Large Text Size (A+)"
              >
                A+
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onFontScaleChange('xlarge');
                }}
                className={`px-2 py-1 rounded-lg text-sm font-black transition-all ${
                  fontScale === 'xlarge' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Senior & Low-Vision Extra Large (A++)"
              >
                A++
              </button>
            </div>

            {/* Curated Resource Vault Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenResourceVault();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
              title="Open Universal Resource Vault (Printable Study Guides & Reference Sheets)"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">Resource Vault</span>
            </button>

            {/* Offline Status Pill */}
            <button
              onClick={onOpenSyncModal}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to view offline storage and backup options"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden md:inline">{isOnline ? 'Offline-Ready' : 'Offline Mode'}</span>
            </button>

            {/* User Guide Button (Windows Style) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenGuideModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer"
              title="Open Windows-Style User Manual & Architecture Docs"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline">User Guide</span>
            </button>

            {/* Feedback / Bug Report Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenFeedbackModal();
              }}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer"
              title="Feedback & Admin Bug Report Mechanism"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Feedback</span>
              {feedbackTicketCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-black text-[10px] flex items-center justify-center ring-2 ring-indigo-500/30">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                      <span>{currentUser.name.split(' ')[0]}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${roleBadgeColors[currentUser.role]}`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && currentUser && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 text-xs">
                    {/* User Header Details */}
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                        <span className={`px-1.5 py-0.5 rounded font-semibold border ${roleBadgeColors[currentUser.role]}`}>
                          Role: {currentUser.role}
                        </span>
                        {currentUser.dateOfBirth && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            DOB: {currentUser.dateOfBirth}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenProfileModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div>Profile &amp; Preferences</div>
                          <div className="text-[10px] text-slate-400 font-normal">Color scheme, themes, password, DOB, exam targets</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAuthModal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div>Switch Account / Sign In</div>
                          <div className="text-[10px] text-slate-400 font-normal">Switch between Learner, Parent, Teacher, Admin</div>
                        </div>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100 px-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

