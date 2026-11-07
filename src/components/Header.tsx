import React, { useState, useRef, useEffect } from 'react';
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
  UserPlus,
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
  isKidMode?: boolean;
  onToggleKidMode?: () => void;
  onNavigateHome?: () => void;
  availableUsers?: UserAccount[];
  onSwitchUser?: (user: UserAccount) => void;
  onOpenRegister?: () => void;
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
  feedbackTicketCount = 0,
  isKidMode = false,
  onToggleKidMode,
  onNavigateHome,
  availableUsers = [],
  onSwitchUser,
  onOpenRegister
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close User Menu automatically whenever a click or touch occurs outside of userMenuRef
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Tagline - Linked to Homepage (stops any ongoing test/practice/quiz) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNavigateHome?.();
            }}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl p-1 -m-1 transition-all cursor-pointer select-none"
            title="Return to EduBridge Homepage (stops any ongoing test/practice/quiz)"
            aria-label="EduBridge Homepage"
            data-testid="header-home-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all">
              EB
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight text-lg">
                  EduBridge
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Self-Hosted Core
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Bridging Learning, Skills and Future Success</p>
            </div>
          </button>

          {/* Role Navigation Bar */}
          <nav aria-label="Portal Navigation" className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            {!currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-slate-900">EduBridge Public Hub</span>
                <span className="hidden lg:inline text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                  Autonomous AI Core
                </span>
              </div>
            ) : isAdmin ? (
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
            {/* Gamification metrics - shown primarily in student view when logged in */}
            {currentUser && activeRole === 'student' && (
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

            {/* Curated Resource Vault Button (Only for Signed-In Users) */}
            {currentUser && (
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
            )}

            {/* Offline Status Pill - Strictly Scoped to Administrator Level Only */}
            {isAdmin && (
              <button
                onClick={onOpenSyncModal}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
                title="Admin Offline Storage, Backup & Multi-Machine Sync Console"
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
                <span className="hidden md:inline">{isOnline ? 'Offline-Ready' : 'Offline Mode'}</span>
              </button>
            )}

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

            {/* Feedback / Bug Report Button (Only for Signed-In Users) */}
            {currentUser && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenFeedbackModal();
                }}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer"
                title="Feedback &amp; Admin Bug Report Mechanism"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span className="hidden lg:inline">Feedback</span>
                {feedbackTicketCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
                )}
              </button>
            )}

            {/* Mode Switcher (Only for Signed-In Users) */}
            {currentUser && onToggleKidMode && (
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleKidMode();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer shadow-2xs ${
                  isKidMode
                    ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-xs ring-1 ring-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
                title={isKidMode ? 'Switch to Full Academic Suite' : 'Switch to 5-Year-Old Kid Mode'}
              >
                <span className="text-sm">{isKidMode ? '🧸' : '⚙️'}</span>
                <span className="hidden sm:inline">{isKidMode ? 'Kid Mode' : 'Full Mode'}</span>
              </button>
            )}

            {/* User Account / Profile Menu on the Right Side */}
            <div ref={userMenuRef} className="relative ml-auto sm:ml-1">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left cursor-pointer"
                  title="Click to expand User Account & Switcher Menu"
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
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${roleBadgeColors[currentUser.role]}`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {onOpenRegister && (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onOpenRegister();
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-2xs transition-all cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Create Account</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenAuthModal();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* User Dropdown Menu - Auto-dismisses when clicking outside */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 text-xs animate-in fade-in zoom-in-95">
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

                  {/* Quick User Switcher Section (Direct Switch between Registered Users) */}
                  {availableUsers && availableUsers.length > 1 && (
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Quick Switch User:
                      </span>
                      <div className="space-y-1">
                        {availableUsers
                          .filter((u) => u.id !== currentUser.id)
                          .slice(0, 4)
                          .map((u) => (
                            <button
                              key={u.id}
                              onClick={() => {
                                sound.playClick();
                                setIsUserMenuOpen(false);
                                if (onSwitchUser) onSwitchUser(u);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[9px] flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  {u.name.slice(0, 2).toUpperCase()}
                                </span>
                                <span className="font-semibold text-slate-800 text-[11px] truncate">{u.name}</span>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border shrink-0 ${roleBadgeColors[u.role]}`}>
                                {u.role}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsUserMenuOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer text-left transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Profile &amp; Preferences</div>
                        <div className="text-[10px] text-slate-400 font-normal">Theme presets, password security, exam targets</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsUserMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer text-left transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Switch Account / Sign In</div>
                        <div className="text-[10px] text-slate-400 font-normal">Switch between Learner, Parent, Teacher, Admin</div>
                      </div>
                    </button>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-1 mt-1 border-t border-slate-100 px-1">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

