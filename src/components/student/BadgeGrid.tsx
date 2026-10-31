import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  Zap,
  BookOpen,
  Filter,
  ArrowRight,
  TrendingUp,
  Share2,
  X,
  Medal,
  Clock,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { AchievementBadge, BadgeCategory, UserProfile, VocabularyWord, Unit, MockTest } from '../../types';
import { BadgeCard } from './BadgeCard';
import { BadgeService } from '../../services/badgeService';
import { sound } from '../../utils/audio';
import { triggerCelebration } from '../../utils/celebration';

interface BadgeGridProps {
  profile: UserProfile;
  vocabularyWords?: VocabularyWord[];
  units?: Unit[];
  mockTests?: MockTest[];
  currentRank?: number;
  onCelebrate?: (type: 'streak' | 'daily_goal') => void;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  profile,
  vocabularyWords = [],
  units = [],
  mockTests = [],
  currentRank = 3,
  onCelebrate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadgeForModal, setSelectedBadgeForModal] = useState<AchievementBadge | null>(null);
  const [wordsPracticeBonus, setWordsPracticeBonus] = useState(0);

  // Compute live badge states
  const allBadges = useMemo(() => {
    return BadgeService.computeBadges(profile, vocabularyWords, units, mockTests, currentRank);
  }, [profile, vocabularyWords, units, mockTests, currentRank, wordsPracticeBonus]);

  // Overall statistics
  const totalBadgesCount = allBadges.length;
  const unlockedBadges = allBadges.filter((b) => b.unlocked);
  const unlockedCount = unlockedBadges.length;
  const lockedCount = totalBadgesCount - unlockedCount;
  const totalXpEarnedFromBadges = unlockedBadges.reduce((sum, b) => sum + b.xpReward, 0);
  const overallCompletionPercent = Math.round((unlockedCount / totalBadgesCount) * 100);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return allBadges.filter((badge) => {
      // Category filter
      if (selectedCategory !== 'all' && badge.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'unlocked' && !badge.unlocked) return false;
      if (statusFilter === 'locked' && badge.unlocked) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = badge.title.toLowerCase().includes(q);
        const matchesCriteria = badge.criteria.toLowerCase().includes(q);
        const matchesDesc = badge.description.toLowerCase().includes(q);
        const matchesTier = badge.tier.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCriteria && !matchesDesc && !matchesTier) {
          return false;
        }
      }
      return true;
    });
  }, [allBadges, selectedCategory, statusFilter, searchQuery]);

  // Interactive handler to practice words and advance toward the '1000 Words Learned' badge
  const handleSimulateWordPractice = (increment = 50) => {
    sound.playSuccess();
    const newCount = BadgeService.incrementLearnedWords(increment, vocabularyWords);
    setWordsPracticeBonus((prev) => prev + increment);

    // If just crossed 1,000 words milestone, launch full celebration!
    if (newCount >= 1000) {
      triggerCelebration('daily_goal');
      if (onCelebrate) onCelebrate('daily_goal');
    }
  };

  const handleCardClick = (badge: AchievementBadge) => {
    sound.playClick();
    setSelectedBadgeForModal(badge);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Statistics Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Achievement Hall of Fame</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated Live
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Milestone Badges &amp; Learning Honors
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Earn commemorative achievement badges by building consistent study habits, mastering vocabulary, securing top leaderboard rankings, and excelling in exam simulations.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Unlocked</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {unlockedCount} <span className="text-xs font-sans text-slate-400 font-normal">/ {totalBadgesCount}</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold mt-1">
                {overallCompletionPercent}% Completed
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bonus XP</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                +{totalXpEarnedFromBadges.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-200/80 font-semibold mt-1">
                Claimed from Badges
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Active Streak</span>
              </div>
              <div className="text-2xl font-black text-orange-400 font-mono">
                {profile.currentStreak} <span className="text-xs font-sans text-slate-400 font-normal">Days</span>
              </div>
              <div className="text-[10px] text-orange-300 font-semibold mt-1">
                Streak Titan Active
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Milestone Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Milestone 1: 1000 Words */}
          {(() => {
            const b = allBadges.find((x) => x.id === 'badge_words_1000');
            if (!b) return null;
            const pct = Math.min(100, Math.round((b.currentValue / b.targetValue) * 100));
            return (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{b.title}</span>
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${b.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {b.unlocked ? 'Unlocked' : `${b.currentValue} / ${b.targetValue}`}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{b.unlocked ? 'Mastered!' : `${b.targetValue - b.currentValue} words remaining`}</span>
                  {!b.unlocked && (
                    <button
                      onClick={() => handleSimulateWordPractice(50)}
                      className="text-[10px] text-cyan-300 hover:text-white font-bold underline cursor-pointer"
                    >
                      +50 Words Drill
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Milestone 2: 7-Day Streak */}
          {(() => {
            const b = allBadges.find((x) => x.id === 'badge_streak_7');
            if (!b) return null;
            return (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{b.title}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                    Earned ({profile.currentStreak}d)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Gold Tier Milestone Achieved</span>
                  <span className="text-amber-400 font-bold">+{b.xpReward} XP</span>
                </div>
              </div>
            );
          })()}

          {/* Milestone 3: Top of Leaderboard */}
          {(() => {
            const b = allBadges.find((x) => x.id === 'badge_top_leaderboard');
            if (!b) return null;
            return (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-rose-400" />
                    <span>{b.title}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                    Rank #{currentRank} (Podium)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ruby League Promotion Zone</span>
                  <span className="text-rose-400 font-bold">+{b.xpReward} XP</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Filter and Search Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Badges', count: totalBadgesCount },
              { id: 'habits', label: 'Streaks & Habits', count: allBadges.filter((b) => b.category === 'habits').length },
              { id: 'vocabulary', label: 'Vocabulary & Words', count: allBadges.filter((b) => b.category === 'vocabulary').length },
              { id: 'leaderboard', label: 'Leaderboard & XP', count: allBadges.filter((b) => b.category === 'leaderboard').length },
              { id: 'exams', label: 'Exams & STEM', count: allBadges.filter((b) => b.category === 'exams').length },
              { id: 'ai', label: 'AI & Offline', count: allBadges.filter((b) => b.category === 'ai').length }
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat.id as BadgeCategory);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    active ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Segmented Control */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  setStatusFilter('all');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({totalBadgesCount})
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setStatusFilter('unlocked');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'unlocked' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Earned ({unlockedCount})
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setStatusFilter('locked');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === 'locked' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                In Progress ({lockedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Drill Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search badges by title, criteria, or tier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-500 font-medium">
              Showing {filteredBadges.length} of {totalBadgesCount} badges
            </span>
            <button
              onClick={() => handleSimulateWordPractice(50)}
              title="Practice 50 new vocabulary words in the flashcard drill engine"
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simulate +50 Words Drill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Badge Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onSelectBadge={handleCardClick}
              onLearnMoreWords={() => handleSimulateWordPractice(50)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-extrabold text-slate-800 text-base">No Badges Match Your Filters</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, switching categories, or clearing the status filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Detailed Badge Modal (Appears when any badge is clicked) */}
      {selectedBadgeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-br ${selectedBadgeForModal.gradientClass} text-white relative`}>
              <button
                onClick={() => setSelectedBadgeForModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {selectedBadgeForModal.tier} Tier Milestone
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedBadgeForModal.title}</h3>
                  <p className="text-xs text-white/80">{selectedBadgeForModal.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  About This Milestone
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedBadgeForModal.description}
                </p>
              </div>

              {/* Exact Criteria Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Official Unlock Criteria</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {selectedBadgeForModal.criteria}
                </p>
              </div>

              {/* Progress & Status */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block text-[11px]">Current Progress</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {selectedBadgeForModal.currentValue} / {selectedBadgeForModal.targetValue} {selectedBadgeForModal.unit}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {Math.min(100, Math.round((selectedBadgeForModal.currentValue / selectedBadgeForModal.targetValue) * 100))}% target achieved
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block text-[11px]">XP Reward</span>
                  <span className="font-mono font-black text-amber-600 text-sm">
                    +{selectedBadgeForModal.xpReward} XP
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {selectedBadgeForModal.rarity}
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl flex items-center justify-between border text-xs font-semibold">
                <span className="text-slate-600">Milestone Status:</span>
                {selectedBadgeForModal.unlocked ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedBadgeForModal.unlockedAt || 'Achievement Unlocked'}</span>
                  </span>
                ) : (
                  <span className="text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 font-bold">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>In Progress ({selectedBadgeForModal.targetValue - selectedBadgeForModal.currentValue} {selectedBadgeForModal.unit} to go)</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                {selectedBadgeForModal.unlocked ? (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      triggerCelebration('streak');
                      if (onCelebrate) onCelebrate('streak');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Celebrate with Fireworks! 🎉</span>
                  </button>
                ) : (
                  selectedBadgeForModal.id === 'badge_words_1000' && (
                    <button
                      onClick={() => {
                        handleSimulateWordPractice(50);
                        setSelectedBadgeForModal(null);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Practice 50 Words Now</span>
                    </button>
                  )
                )}

                <button
                  onClick={() => setSelectedBadgeForModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
