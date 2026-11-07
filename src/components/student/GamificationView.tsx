import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Star,
  Shield,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types';

interface GamificationViewProps {
  profile: UserProfile;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ profile }) => {
  const leaderboardUsers = [
    { rank: 1, name: 'Elena Rostova', xp: 4890, streak: 34, league: 'Ruby', isCurrentUser: false },
    { rank: 2, name: 'Taro Takahashi', xp: 4210, streak: 22, league: 'Ruby', isCurrentUser: false },
    { rank: 3, name: `${profile.name || 'Educator'} (You)`, xp: profile.xp, streak: profile.currentStreak, league: profile.league, isCurrentUser: true },
    { rank: 4, name: 'Marcus Sterling', xp: 3250, streak: 12, league: 'Ruby', isCurrentUser: false },
    { rank: 5, name: 'Sofia Chen', xp: 3100, streak: 19, league: 'Ruby', isCurrentUser: false },
    { rank: 6, name: 'Devon Vance', xp: 2890, streak: 9, league: 'Ruby', isCurrentUser: false },
    { rank: 7, name: 'Amina Al-Mansoor', xp: 2600, streak: 15, league: 'Ruby', isCurrentUser: false }
  ];

  const badges = [
    {
      id: 'b1',
      title: 'Polyglot Apprentice',
      description: 'Master 10 language units across greetings, grammar and dialogue.',
      icon: <Award className="w-6 h-6 text-indigo-500" />,
      unlocked: true,
      progress: '10 / 10'
    },
    {
      id: 'b2',
      title: 'Streak Titan',
      description: 'Maintain a 14-day unbroken daily study habit.',
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      unlocked: true,
      progress: '14 / 14 Days'
    },
    {
      id: 'b3',
      title: 'Band 8.0 Visionary',
      description: 'Achieve a predicted 8.0 Band in full IELTS simulation.',
      icon: <Trophy className="w-6 h-6 text-emerald-500" />,
      unlocked: true,
      progress: 'Band 8.0 Earned'
    },
    {
      id: 'b4',
      title: 'DeepSeek Reasoner',
      description: 'Complete 5 advanced calculus & algorithmic derivations.',
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      unlocked: true,
      progress: '5 / 5 Proofs'
    },
    {
      id: 'b5',
      title: 'Diamond League Contender',
      description: 'Finish in the top 3 of the Ruby League by Sunday.',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      unlocked: false,
      progress: 'Rank #3 / Top 3'
    },
    {
      id: 'b6',
      title: 'Self-Hosted Pioneer',
      description: 'Run 100% of study workflows offline with local Ollama models.',
      icon: <Sparkles className="w-6 h-6 text-teal-500" />,
      unlocked: true,
      progress: 'Offline Synchronized'
    }
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Trophy className="w-4 h-4" />
            <span>Ruby League Competition</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Weekly Leaderboard &amp; Badges of Honor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Top 3 learners advance to the prestigious Diamond League this Sunday at midnight.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 text-xs font-bold text-rose-800">
          <Shield className="w-5 h-5 text-rose-600" />
          <span>Currently in Promotion Zone (#3)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Ruby League Standings</h3>
            <span className="text-xs font-mono text-slate-500">Resets in 2d 19h</span>
          </div>

          <div className="space-y-2">
            {leaderboardUsers.map((user) => (
              <div
                key={user.rank}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  user.isCurrentUser
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 text-center font-black text-sm ${
                    user.rank === 1 ? 'text-amber-500 font-mono text-base' :
                    user.rank === 2 ? 'text-slate-400 font-mono text-base' :
                    user.rank === 3 ? 'text-amber-700 font-mono text-base' :
                    'text-slate-400 font-mono'
                  }`}>
                    #{user.rank}
                  </span>

                  <div>
                    <p className={`text-sm font-bold ${user.isCurrentUser ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Flame className="w-3 h-3 fill-amber-500" /> {user.streak}d
                      </span>
                      <span>·</span>
                      <span>{user.league}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block font-mono">{user.xp} XP</span>
                  {user.rank <= 3 ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                      <ArrowUp className="w-2.5 h-2.5" /> Promotion
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Safe</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Badges of Honor */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">Milestone Badges</h3>
            <span className="text-xs font-semibold text-indigo-600">5 of 6 Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  b.unlocked
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-slate-50/30 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200">
                    {b.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    b.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {b.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{b.description}</p>
                </div>

                <div className="text-[10px] font-mono text-indigo-700 font-semibold pt-1 border-t border-slate-200/50">
                  {b.progress}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
