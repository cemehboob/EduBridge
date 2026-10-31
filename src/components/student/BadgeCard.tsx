import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  Flame,
  Trophy,
  BookOpen,
  Zap,
  Shield,
  Crown,
  Sparkles,
  Star,
  Medal,
  GraduationCap,
  Globe,
  Lock,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  Gift
} from 'lucide-react';
import { AchievementBadge, BadgeTier } from '../../types';

interface BadgeCardProps {
  badge: AchievementBadge;
  onSelectBadge: (badge: AchievementBadge) => void;
  onLearnMoreWords?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onSelectBadge, onLearnMoreWords }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const renderIcon = (name: AchievementBadge['iconName'], className: string) => {
    switch (name) {
      case 'Award': return <Award className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Medal': return <Medal className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Globe': return <Globe className={className} />;
      default: return <Award className={className} />;
    }
  };

  const getTierStyles = (tier: BadgeTier) => {
    switch (tier) {
      case 'Legendary':
        return {
          pill: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs',
          ring: 'ring-2 ring-amber-400/80 shadow-amber-500/20 shadow-lg',
          glow: 'from-amber-400/20 to-purple-500/20',
          text: 'text-amber-500'
        };
      case 'Diamond':
        return {
          pill: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs',
          ring: 'ring-2 ring-cyan-400/70 shadow-cyan-500/20 shadow-md',
          glow: 'from-cyan-400/20 to-blue-500/20',
          text: 'text-cyan-600'
        };
      case 'Platinum':
        return {
          pill: 'bg-slate-700 text-slate-100 border border-slate-500',
          ring: 'ring-2 ring-slate-400 shadow-slate-400/20 shadow-md',
          glow: 'from-slate-300/20 to-indigo-500/20',
          text: 'text-slate-700'
        };
      case 'Gold':
        return {
          pill: 'bg-amber-500 text-amber-950 font-black',
          ring: 'ring-2 ring-amber-400 shadow-amber-400/20 shadow-md',
          glow: 'from-amber-400/20 to-yellow-500/20',
          text: 'text-amber-600'
        };
      case 'Silver':
        return {
          pill: 'bg-slate-300 text-slate-800',
          ring: 'ring-1 ring-slate-300 shadow-xs',
          glow: 'from-slate-200/20 to-slate-400/20',
          text: 'text-slate-600'
        };
      case 'Bronze':
      default:
        return {
          pill: 'bg-amber-800 text-amber-100',
          ring: 'ring-1 ring-amber-700/50 shadow-xs',
          glow: 'from-amber-700/15 to-orange-800/15',
          text: 'text-amber-800'
        };
    }
  };

  const tierStyle = getTierStyles(badge.tier);
  const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

  return (
    <div
      ref={cardRef}
      className="relative group select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge Medallion Card */}
      <div
        onClick={() => {
          onSelectBadge(badge);
        }}
        tabIndex={0}
        role="button"
        aria-label={`Badge: ${badge.title}. ${badge.unlocked ? 'Unlocked' : 'Locked'}. Click for criteria details.`}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`relative w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
          badge.unlocked
            ? `bg-white hover:bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:shadow-md ${tierStyle.ring}`
            : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60 opacity-85'
        }`}
      >
        {/* Ambient Glow for unlocked */}
        {badge.unlocked && (
          <div
            className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${tierStyle.glow} blur-xl pointer-events-none opacity-60`}
          />
        )}

        {/* Card Header: Medallion Icon & Tier */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="relative">
              {/* Medallion Shape */}
              <div
                className={`w-13 h-13 rounded-2xl p-0.5 shadow-sm transition-transform group-hover:scale-105 ${
                  badge.unlocked
                    ? `bg-gradient-to-br ${badge.gradientClass}`
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-slate-950/20 text-white backdrop-blur-xs'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {badge.unlocked ? (
                    renderIcon(badge.iconName, 'w-6 h-6 drop-shadow-xs')
                  ) : (
                    <div className="relative">
                      {renderIcon(badge.iconName, 'w-6 h-6 opacity-40')}
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute -bottom-1 -right-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge Glyph */}
              {badge.unlocked ? (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 bg-slate-500 text-white p-0.5 rounded-full ring-2 ring-white shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Tier & XP Chip */}
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold ${tierStyle.pill}`}>
                {badge.tier}
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 flex items-center gap-0.5">
                <Gift className="w-2.5 h-2.5 text-amber-600" />
                <span>+{badge.xpReward} XP</span>
              </span>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-0.5 mb-2">
            <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
              {badge.title}
            </h4>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {badge.subtitle}
            </p>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {badge.description}
          </p>
        </div>

        {/* Card Footer: Progress Bar & Info trigger */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500">
              {badge.unlocked ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="text-slate-600 font-medium">Progress</span>
              )}
            </span>
            <span className="font-mono font-bold text-slate-700">
              {badge.currentValue} / {badge.targetValue} {badge.unit}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                badge.unlocked
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Action indicator */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
              <Info className="w-3 h-3" />
              <span>Hover / Tap for criteria</span>
            </span>

            {badge.id === 'badge_words_1000' && !badge.unlocked && onLearnMoreWords && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnMoreWords();
                }}
                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Attempt authentic vocabulary practice questions to earn verified words"
              >
                <span>Practice Quiz</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Explaining Criteria */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] w-72 sm:w-80 p-4 rounded-2xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-700/80 pointer-events-auto text-left animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900" />

          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${badge.gradientClass} text-white shadow-xs`}>
                {renderIcon(badge.iconName, 'w-4 h-4')}
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-white leading-tight">{badge.title}</h5>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {badge.tier} Tier · {badge.rarity}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              +{badge.xpReward} XP
            </span>
          </div>

          {/* Criteria Box */}
          <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700 space-y-1 mb-2.5">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Unlock Criteria</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {badge.criteria}
            </p>
          </div>

          {/* Live Progress in Tooltip */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-medium">Milestone Progress:</span>
              <span className="font-mono font-bold text-slate-200">
                {badge.currentValue} / {badge.targetValue} {badge.unit} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  badge.unlocked ? 'bg-emerald-400' : 'bg-indigo-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Status:</span>
              {badge.unlocked ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{badge.unlockedAt || 'Unlocked!'}</span>
                </span>
              ) : (
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>
                    {badge.targetValue - badge.currentValue} {badge.unit} remaining
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Quick tip */}
          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <span>Tap card to view full achievement certificate</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      )}
    </div>
  );
};
