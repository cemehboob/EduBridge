import React from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  profile: UserProfile;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isOnline: boolean;
  onOpenSyncModal: () => void;
  onCelebrateStreak?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeRole,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  isOnline,
  onOpenSyncModal,
  onCelebrateStreak
}) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'student', label: 'Learner', icon: <GraduationCap className="w-4 h-4" /> },
    { role: 'parent', label: 'Parent Portal', icon: <Users className="w-4 h-4" /> },
    { role: 'teacher', label: 'Teacher Studio', icon: <BookOpenCheck className="w-4 h-4" /> },
    { role: 'admin', label: 'Admin Cluster', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Role Switcher */}
          <nav aria-label="Portal Navigation" className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            {roles.map((r) => {
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    sound.playClick();
                    onRoleChange(r.role);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {r.icon}
                  <span className="hidden md:inline">{r.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Gamification Stats & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
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
              className="hidden lg:flex items-center gap-1 text-rose-600 font-bold text-sm bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60"
              title={`${profile.hearts} of ${profile.maxHearts} hearts available`}
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{profile.hearts}/{profile.maxHearts}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title={soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Offline / Storage Backup Sync Modal Trigger */}
            <button
              onClick={onOpenSyncModal}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to view offline storage and backup options"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span className="hidden sm:inline">{isOnline ? 'Offline-Ready' : 'Offline Mode'}</span>
            </button>

            {/* Profile Avatar */}
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
