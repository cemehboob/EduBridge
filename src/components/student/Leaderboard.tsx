import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Globe,
  GraduationCap,
  Crown,
  Shield,
  Medal,
  Clock,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { sound } from '../../utils/audio';
import { triggerCelebration } from '../../utils/celebration';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  league: 'Diamond' | 'Ruby' | 'Sapphire' | 'Gold' | 'Silver' | 'Bronze';
  movement: 'up' | 'down' | 'same';
  deltaRanks: number;
  isCurrentUser: boolean;
  country: string;
  cohort: string;
  topBadge: string;
}

interface LeaderboardProps {
  profile: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ profile }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');
  const [scope, setScope] = useState<'global' | 'class'>('global');

  // Datasets for different tabs
  const globalWeeklyUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      xp: 4890,
      streak: 34,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Spain',
      cohort: 'Cohort Beta',
      topBadge: 'Grammar Titan'
    },
    {
      rank: 2,
      name: 'Taro Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      xp: 4210,
      streak: 22,
      league: 'Ruby',
      movement: 'up',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'Japan',
      cohort: 'Cohort Alpha',
      topBadge: 'Calculus Ace'
    },
    {
      rank: 3,
      name: `${profile.name} (You)`,
      avatar: profile.avatar,
      xp: profile.xp,
      streak: profile.currentStreak,
      league: profile.league,
      movement: 'up',
      deltaRanks: 2,
      isCurrentUser: true,
      country: 'Global',
      cohort: 'Cohort Alpha',
      topBadge: 'Band 8 Visionary'
    },
    {
      rank: 4,
      name: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      xp: 3250,
      streak: 12,
      league: 'Ruby',
      movement: 'down',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'UK',
      cohort: 'Cohort Alpha',
      topBadge: 'IELTS Scholar'
    },
    {
      rank: 5,
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      xp: 3100,
      streak: 19,
      league: 'Ruby',
      movement: 'up',
      deltaRanks: 3,
      isCurrentUser: false,
      country: 'Canada',
      cohort: 'Cohort Alpha',
      topBadge: 'Phonetic Master'
    },
    {
      rank: 6,
      name: 'Devon Vance',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      xp: 2890,
      streak: 9,
      league: 'Ruby',
      movement: 'down',
      deltaRanks: 2,
      isCurrentUser: false,
      country: 'Australia',
      cohort: 'Cohort Beta',
      topBadge: 'DeepSeek Prover'
    },
    {
      rank: 7,
      name: 'Amina Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      xp: 2600,
      streak: 15,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'UAE',
      cohort: 'Cohort Gamma',
      topBadge: 'Vocabulary Virtuoso'
    },
    {
      rank: 8,
      name: 'Lucas Meyer',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      xp: 2420,
      streak: 11,
      league: 'Ruby',
      movement: 'up',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'Germany',
      cohort: 'Cohort Beta',
      topBadge: 'Relativity Analyst'
    }
  ];

  const globalAllTimeUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Dr. Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      xp: 42800,
      streak: 182,
      league: 'Diamond',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Japan',
      cohort: 'Alumni Fellow',
      topBadge: 'Legendary Pioneer'
    },
    {
      rank: 2,
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      xp: 38900,
      streak: 34,
      league: 'Diamond',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Spain',
      cohort: 'Cohort Beta',
      topBadge: 'Grammar Titan'
    },
    {
      rank: 3,
      name: `${profile.name} (You)`,
      avatar: profile.avatar,
      xp: 31420,
      streak: profile.currentStreak,
      league: 'Diamond',
      movement: 'up',
      deltaRanks: 2,
      isCurrentUser: true,
      country: 'Global',
      cohort: 'Cohort Alpha',
      topBadge: 'Band 8 Visionary'
    },
    {
      rank: 4,
      name: 'Liam O’Connor',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      xp: 28150,
      streak: 84,
      league: 'Ruby',
      movement: 'down',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'Ireland',
      cohort: 'Cohort Beta',
      topBadge: 'PTE Master'
    },
    {
      rank: 5,
      name: 'Chen Wei',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      xp: 26400,
      streak: 65,
      league: 'Ruby',
      movement: 'up',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'Singapore',
      cohort: 'Cohort Alpha',
      topBadge: 'Algorithmic Proof'
    }
  ];

  const classWeeklyUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Taro Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      xp: 4210,
      streak: 22,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Japan',
      cohort: 'Cohort Alpha',
      topBadge: 'Calculus Ace'
    },
    {
      rank: 2,
      name: `${profile.name} (You)`,
      avatar: profile.avatar,
      xp: profile.xp,
      streak: profile.currentStreak,
      league: profile.league,
      movement: 'up',
      deltaRanks: 1,
      isCurrentUser: true,
      country: 'Global',
      cohort: 'Cohort Alpha',
      topBadge: 'Band 8 Visionary'
    },
    {
      rank: 3,
      name: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      xp: 3250,
      streak: 12,
      league: 'Ruby',
      movement: 'down',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'UK',
      cohort: 'Cohort Alpha',
      topBadge: 'IELTS Scholar'
    },
    {
      rank: 4,
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      xp: 3100,
      streak: 19,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Canada',
      cohort: 'Cohort Alpha',
      topBadge: 'Phonetic Master'
    },
    {
      rank: 5,
      name: 'Jordan Blake',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      xp: 2750,
      streak: 8,
      league: 'Sapphire',
      movement: 'up',
      deltaRanks: 2,
      isCurrentUser: false,
      country: 'USA',
      cohort: 'Cohort Alpha',
      topBadge: 'STEM Pioneer'
    }
  ];

  const classAllTimeUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: `${profile.name} (You)`,
      avatar: profile.avatar,
      xp: 31420,
      streak: profile.currentStreak,
      league: 'Diamond',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: true,
      country: 'Global',
      cohort: 'Cohort Alpha',
      topBadge: 'Cohort Champion'
    },
    {
      rank: 2,
      name: 'Taro Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      xp: 29800,
      streak: 22,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'Japan',
      cohort: 'Cohort Alpha',
      topBadge: 'Calculus Ace'
    },
    {
      rank: 3,
      name: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      xp: 24300,
      streak: 12,
      league: 'Ruby',
      movement: 'same',
      deltaRanks: 0,
      isCurrentUser: false,
      country: 'UK',
      cohort: 'Cohort Alpha',
      topBadge: 'IELTS Scholar'
    },
    {
      rank: 4,
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      xp: 22100,
      streak: 19,
      league: 'Ruby',
      movement: 'up',
      deltaRanks: 1,
      isCurrentUser: false,
      country: 'Canada',
      cohort: 'Cohort Alpha',
      topBadge: 'Phonetic Master'
    }
  ];

  // Pick dataset according to active tab selections
  const activeDataset: LeaderboardUser[] =
    scope === 'global'
      ? timeframe === 'weekly'
        ? globalWeeklyUsers
        : globalAllTimeUsers
      : timeframe === 'weekly'
      ? classWeeklyUsers
      : classAllTimeUsers;

  const currentUserData = activeDataset.find((u) => u.isCurrentUser) || activeDataset[2];
  const topThree = activeDataset.slice(0, 3);

  // XP needed to overtake the user ahead
  const aheadUser = currentUserData.rank > 1 ? activeDataset[currentUserData.rank - 2] : null;
  const xpDifference = aheadUser ? Math.max(0, aheadUser.xp - currentUserData.xp + 10) : 0;

  const handleCelebrateStanding = () => {
    sound.playClick();
    triggerCelebration('daily_goal');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner & Control Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Trophy className="w-4 h-4" />
              <span>Competitive Gamification &amp; Merit Standings</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Rankings &amp; XP Leaderboard
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time standing across academic exercises, language trees, and IELTS/PTE mock exams.
            </p>
          </div>

          {/* Scope Selector: Global vs Class */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setScope('global');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scope === 'global'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global League</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setScope('class');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                scope === 'class'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Cohort Alpha</span>
            </button>
          </div>
        </div>

        {/* Timeframe Switcher Tabs: Weekly vs All-Time */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setTimeframe('weekly');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                timeframe === 'weekly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Weekly Tournament
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTimeframe('all-time');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                timeframe === 'all-time'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              All-Time Hall of Fame
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{timeframe === 'weekly' ? 'Resets Sunday at 00:00 UTC' : 'Cumulative Lifetime XP'}</span>
          </div>
        </div>
      </div>

      {/* Podium Highlight: Top 3 Scholars */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2">
          
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center justify-end text-center space-y-2">
            <div className="relative">
              <img
                src={topThree[1].avatar}
                alt={topThree[1].name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-slate-300 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                2
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{topThree[1].name}</p>
              <span className="text-[11px] font-mono font-black text-slate-600 block">{topThree[1].xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-400 block">{topThree[1].topBadge}</span>
            </div>
            <div className="w-full bg-slate-200/80 rounded-t-2xl h-16 sm:h-20 flex items-center justify-center font-black text-slate-400 text-sm">
              SILVER
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="flex flex-col items-center justify-end text-center space-y-2">
            <div className="relative">
              <Crown className="w-7 h-7 text-amber-500 mx-auto -mb-1 animate-bounce" />
              <img
                src={topThree[0].avatar}
                alt={topThree[0].name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center border-2 border-white shadow-sm">
                1
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">{topThree[0].name}</p>
              <span className="text-xs font-mono font-black text-amber-700 block">{topThree[0].xp.toLocaleString()} XP</span>
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                {topThree[0].topBadge}
              </span>
            </div>
            <div className="w-full bg-gradient-to-t from-amber-400 to-yellow-300 rounded-t-2xl h-24 sm:h-28 flex items-center justify-center font-black text-amber-950 text-base shadow-xs">
              GOLD #1
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center justify-end text-center space-y-2">
            <div className="relative">
              <img
                src={topThree[2].avatar}
                alt={topThree[2].name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-amber-700/60 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                3
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{topThree[2].name}</p>
              <span className="text-[11px] font-mono font-black text-amber-800 block">{topThree[2].xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-400 block">{topThree[2].topBadge}</span>
            </div>
            <div className="w-full bg-amber-200/80 rounded-t-2xl h-12 sm:h-14 flex items-center justify-center font-black text-amber-800 text-xs">
              BRONZE
            </div>
          </div>

        </div>
      )}

      {/* Main Leaderboard Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Table Sub-Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8 text-center">Rank</span>
            <span>Learner</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-12">
            <span className="hidden sm:inline">Streak</span>
            <span className="hidden sm:inline">League</span>
            <span className="w-20 text-right">XP Earned</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {activeDataset.map((user, idx) => {
            const isPromotionZone = user.rank <= 3 && timeframe === 'weekly';
            const isDemotionZone = user.rank > 7 && timeframe === 'weekly';

            return (
              <React.Fragment key={user.name}>
                {/* Visual promotion divider after rank 3 */}
                {idx === 3 && timeframe === 'weekly' && (
                  <div className="bg-emerald-50/70 px-6 py-1.5 flex items-center justify-between text-[11px] font-bold text-emerald-800 border-y border-emerald-200/80">
                    <span className="flex items-center gap-1.5">
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Promotion Zone · Top 3 Advance to Diamond League</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase">Tier 1 Threshold</span>
                  </div>
                )}

                <div
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors ${
                    user.isCurrentUser
                      ? 'bg-indigo-50/80 hover:bg-indigo-50 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank number & movement */}
                    <div className="w-8 flex flex-col items-center justify-center shrink-0">
                      <span className={`font-mono font-black text-sm ${
                        user.rank === 1 ? 'text-amber-500 text-base' :
                        user.rank === 2 ? 'text-slate-400 text-base' :
                        user.rank === 3 ? 'text-amber-700 text-base' :
                        'text-slate-600'
                      }`}>
                        #{user.rank}
                      </span>
                      {/* Movement Icon */}
                      <span className="text-[10px] font-mono flex items-center gap-0.5">
                        {user.movement === 'up' && (
                          <span className="text-emerald-600 flex items-center">
                            <ArrowUp className="w-2.5 h-2.5" />
                            {user.deltaRanks}
                          </span>
                        )}
                        {user.movement === 'down' && (
                          <span className="text-rose-500 flex items-center">
                            <ArrowDown className="w-2.5 h-2.5" />
                            {user.deltaRanks}
                          </span>
                        )}
                        {user.movement === 'same' && (
                          <span className="text-slate-300">
                            <Minus className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-10 h-10 rounded-full object-cover ring-2 ${
                          user.isCurrentUser ? 'ring-indigo-500' : 'ring-slate-200'
                        }`}
                      />
                      {user.rank === 1 && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 absolute -top-1 -right-1" />
                      )}
                    </div>

                    {/* Name & Cohort */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          user.isCurrentUser ? 'text-indigo-900 font-extrabold' : 'text-slate-900'
                        }`}>
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-[10px] bg-indigo-600 text-white font-black px-1.5 py-0.2 rounded-md">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{user.cohort}</span>
                        <span>·</span>
                        <span>{user.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Streak, League, XP */}
                  <div className="flex items-center gap-6 sm:gap-12">
                    <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{user.streak}d</span>
                    </div>

                    <div className="hidden sm:block">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                        {user.league}
                      </span>
                    </div>

                    <div className="w-20 text-right">
                      <span className="font-mono font-black text-sm text-slate-900 block">
                        {user.xp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">XP</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* User's Sticky Standing & Overtake Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
            #{currentUserData.rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Your Current Standings ({scope === 'global' ? 'Global' : 'Cohort Alpha'})
              </span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                Promotion Safe
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {aheadUser ? (
                <>
                  Earn <strong>{xpDifference} more XP</strong> to overtake <strong>{aheadUser.name}</strong> for #{aheadUser.rank}!
                </>
              ) : (
                <>You are currently dominating in <strong>#1 First Place</strong>! Keep the lead!</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleCelebrateStanding}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate Rank #{currentUserData.rank} 🎉</span>
          </button>
        </div>
      </div>

    </div>
  );
};
