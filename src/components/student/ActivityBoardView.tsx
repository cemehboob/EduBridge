import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Brain,
  Zap,
  Flame,
  TrendingUp,
  Target,
  ArrowRight,
  Play,
  Volume2
} from 'lucide-react';
import { UserActivityRecord, UserProfile, UserAccount } from '../../types';
import { sound } from '../../utils/audio';

interface ActivityBoardViewProps {
  profile: UserProfile;
  currentUser: UserAccount | null;
  activities: UserActivityRecord[];
  onReplayActivity: (activity: UserActivityRecord) => void;
  onNavigateTab: (tabId: string) => void;
  isKidMode?: boolean;
}

export const ActivityBoardView: React.FC<ActivityBoardViewProps> = ({
  profile,
  currentUser,
  activities,
  onReplayActivity,
  onNavigateTab,
  isKidMode = false
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter activities for this active user
  const userActivities = currentUser
    ? activities.filter((a) => a.userId === currentUser.id || !a.userId)
    : activities;

  const filteredActivities = userActivities.filter((act) => {
    const matchesType =
      filterType === 'all' ||
      (filterType === 'lesson' && act.type === 'lesson') ||
      (filterType === 'mock_test' && act.type === 'mock_test') ||
      (filterType === 'solver' && act.type === 'solver') ||
      (filterType === 'stem_game' && act.type === 'stem_game') ||
      (filterType === 'vocab_quiz' && act.type === 'vocab_quiz') ||
      (filterType === 'planner' && (act.type === 'study_task' || act.type === 'daily_schedule' || act.type === 'career_cv'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      act.title.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q) ||
      act.details.toLowerCase().includes(q) ||
      act.timestamp.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'mock_test':
        return <Award className="w-4 h-4 text-indigo-600" />;
      case 'solver':
        return <Brain className="w-4 h-4 text-violet-600" />;
      case 'stem_game':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'vocab_quiz':
        return <Sparkles className="w-4 h-4 text-teal-600" />;
      case 'study_task':
      case 'daily_schedule':
      case 'career_cv':
      default:
        return <Calendar className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBadgeStyleForType = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'mock_test':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'solver':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'stem_game':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'vocab_quiz':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  // Up-next recommended spotlight activity
  const spotlightActivity = userActivities[0] || null;

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Activity Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-700/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-black uppercase tracking-wider border border-white/10 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>Real-Time Activity Dashboard</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                ● Live Tracking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isKidMode ? '🌟 Welcome to Your Adventure Board!' : `Welcome Back, ${profile.name}!`}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
              Track all your past and current learning activities with exact timestamps. Review your scores, inspect detailed history, and easily perform any activity again whenever you wish.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Activities</div>
              <div className="text-xl sm:text-2xl font-black text-white">{userActivities.length}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Streak</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{profile.currentStreak}d</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Today's XP</div>
              <div className="text-xl sm:text-2xl font-black text-teal-300">{profile.todayXp} XP</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Total XP</div>
              <div className="text-xl sm:text-2xl font-black text-yellow-300">{profile.xp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Current / In-Progress Spotlight Card */}
      {spotlightActivity && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-white via-indigo-50/20 to-teal-50/20">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Pick Up Where You Left Off
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{spotlightActivity.timestamp}</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {spotlightActivity.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl mt-0.5">
                {spotlightActivity.details}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {spotlightActivity.score && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-black text-xs border border-slate-200">
                Score: {spotlightActivity.score}
              </div>
            )}
            <button
              onClick={() => {
                sound.playClick();
                onReplayActivity(spotlightActivity);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Perform Activity Again</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Pills & Real-time Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'lesson', label: 'Lessons' },
            { id: 'mock_test', label: 'Mock Exams' },
            { id: 'solver', label: 'AI Solvers' },
            { id: 'stem_game', label: 'STEM & Games' },
            { id: 'vocab_quiz', label: 'Vocab Quizzes' },
            { id: 'planner', label: 'Daily Habits & Tasks' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterType(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by title, date, or topic..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* 4. Activity Cards Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <span>Activity Timeline ({filteredActivities.length} Records)</span>
          <span>Click "Perform Again" to restart any activity</span>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getBadgeStyleForType(act.type)}`}>
                    {getIconForType(act.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getBadgeStyleForType(act.type)}`}>
                        {act.category}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {act.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl">
                      {act.details}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 font-mono text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>🕒 {act.timestamp}</span>
                      </span>

                      {act.relativeTime && (
                        <span className="text-slate-400">({act.relativeTime})</span>
                      )}

                      {act.xpEarned && (
                        <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{act.xpEarned} XP
                        </span>
                      )}

                      {act.score && (
                        <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Result: {act.score}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50/70 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Perform Again */}
                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onReplayActivity(act);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 font-bold text-xs transition-all shadow-2xs cursor-pointer group"
                    title={`Perform activity again: ${act.title}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-indigo-600" />
                    <span>Perform Again</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Activities Matched Your Query</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any activities matching "{searchQuery}". Try selecting "All Activities" or clearing your search.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

