import React from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  PartyPopper,
  X
} from 'lucide-react';
import { triggerCelebration } from '../../utils/celebration';
import { sound } from '../../utils/audio';

export type CelebrationType = 'goal_reached' | 'streak_completed';

interface CelebrationModalProps {
  type: CelebrationType;
  title: string;
  subtitle: string;
  xpEarnedToday: number;
  goalXp: number;
  streakDays: number;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  type,
  title,
  subtitle,
  xpEarnedToday,
  goalXp,
  streakDays,
  onClose
}) => {
  const isStreak = type === 'streak_completed';

  const handleLaunchMoreConfetti = () => {
    sound.playClick();
    triggerCelebration(isStreak ? 'streak' : 'daily_goal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 text-center p-6 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon */}
        <div className="flex justify-center pt-2">
          {isStreak ? (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg animate-bounce">
              <Flame className="w-10 h-10 fill-white" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg animate-bounce">
              <Trophy className="w-10 h-10 fill-white" />
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milestone Unlocked</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Today's XP</span>
            <div className="flex items-center justify-center gap-1 text-lg font-black text-amber-900">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{xpEarnedToday} / {goalXp}</span>
            </div>
          </div>

          <div className="p-3 bg-orange-50/80 rounded-2xl border border-orange-200">
            <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider block">Active Streak</span>
            <div className="flex items-center justify-center gap-1 text-lg font-black text-orange-900">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleLaunchMoreConfetti}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <PartyPopper className="w-4 h-4" />
            <span>More Confetti! 🎉</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
