import React, { useState } from 'react';
import {
  Trophy,
  Heart,
  Sparkles,
  Volume2,
  Medal,
  Users,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Brain
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';
import { calculateAge } from '../../../utils/userProfile';

export type KidAgeStage = 'early' | 'junior' | 'teen';

interface KidFriendsRankingProps {
  profile: UserProfile;
}

export const KidFriendsRanking: React.FC<KidFriendsRankingProps> = ({ profile }) => {
  const userAge = calculateAge(profile?.dateOfBirth);
  const defaultStage: KidAgeStage = userAge <= 7 ? 'early' : userAge <= 10 ? 'junior' : 'teen';
  const [currentStage, setCurrentStage] = useState<KidAgeStage>(defaultStage);

  // ----------------------------------------------------
  // STAGE 1: AGES 3–7 (Animal Friends)
  // ----------------------------------------------------
  const [earlyFriends, setEarlyFriends] = useState([
    { id: 'f_leo', name: 'Leo the Lion Cub', animal: '🦁', badge: '👑 Star King', stars: 48, highFives: 14, motto: 'Always share my crayons!' },
    { id: 'f_bella', name: 'Bella Bunny', animal: '🐰', badge: '⭐ Story Hopper', stars: 42, highFives: 18, motto: 'Kind words make big smiles!' },
    { id: 'f_pete', name: 'Panda Pete', animal: '🐼', badge: '🎋 Bamboo Reader', stars: 39, highFives: 11, motto: 'Practice makes us strong!' },
    { id: 'f_oliver', name: 'Oliver Fox', animal: '🦊', badge: '🧩 Puzzle Master', stars: 35, highFives: 9, motto: 'Curious questions are best!' }
  ]);
  const [cheeredId, setCheeredId] = useState<string | null>(null);

  // ----------------------------------------------------
  // STAGE 2: AGES 8–10 (Junior Team Houses & Quests)
  // ----------------------------------------------------
  const [selectedHouse, setSelectedHouse] = useState<'thunderbolts' | 'cyberfoxes' | 'phoenix'>('thunderbolts');
  const [juniorHouses, setJuniorHouses] = useState([
    {
      id: 'thunderbolts',
      name: 'Thunderbolt Inventors ⚡',
      motto: 'Building futuristic gadgets and robotic code!',
      teamXp: 3420,
      targetXp: 4000,
      topMembers: ['Aiden K. (Level 6)', 'Maya P. (Level 5)', `${profile.name} (You)`],
      color: 'from-amber-500 to-yellow-600',
      badge: 'Gold House'
    },
    {
      id: 'cyberfoxes',
      name: 'Cyber Foxes 🦊',
      motto: 'Logic puzzles, mystery decoding, and mental math speed!',
      teamXp: 3190,
      targetXp: 4000,
      topMembers: ['Lucas M. (Level 6)', 'Emma S. (Level 5)', 'Noah B. (Level 4)'],
      color: 'from-orange-500 to-rose-600',
      badge: 'Silver House'
    },
    {
      id: 'phoenix',
      name: 'Solar Phoenix 🔥',
      motto: 'Science lab champions and nature protectors!',
      teamXp: 2950,
      targetXp: 4000,
      topMembers: ['Chloe T. (Level 5)', 'Ethan W. (Level 5)', 'Mia D. (Level 4)'],
      color: 'from-rose-500 to-purple-600',
      badge: 'Bronze House'
    }
  ]);
  const [teamCheerSent, setTeamCheerSent] = useState(false);

  // ----------------------------------------------------
  // STAGE 3: AGES 11–17 (Teen Titans: Study Squads & League)
  // ----------------------------------------------------
  const [teenSquads, setTeenSquads] = useState([
    { id: 'squad_py', name: 'Python & AI Coders Pod', members: 6, sprintXp: 4850, rank: '#1 Diamond', specialization: 'Algorithms & Automation' },
    { id: 'squad_olympiad', name: 'STEM Olympiad Titans', members: 8, sprintXp: 4420, rank: '#2 Platinum', specialization: 'Calculus & Physics 2D' },
    { id: 'squad_biomed', name: 'Genetics & Bio-Builders', members: 5, sprintXp: 3980, rank: '#3 Gold', specialization: 'Biotech & CRISPR Labs' }
  ]);
  const [kudosGiven, setKudosGiven] = useState<{ [key: string]: boolean }>({});

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleGiveHighFive = (friend: any) => {
    sound.playSuccess();
    setCheeredId(friend.id);
    setEarlyFriends((prev) =>
      prev.map((f) => (f.id === friend.id ? { ...f, highFives: f.highFives + 1 } : f))
    );
    speak(`High five sent to ${friend.name}! Keep up the great work!`);
    setTimeout(() => setCheeredId(null), 1500);
  };

  const handleCheerHouse = () => {
    sound.playLevelUp();
    setTeamCheerSent(true);
    speak('House boosted! 50 Team XP credited to your team quest!');
    setTimeout(() => setTeamCheerSent(false), 2000);
  };

  const handleSendKudo = (squadId: string) => {
    sound.playSuccess();
    setKudosGiven((prev) => ({ ...prev, [squadId]: true }));
    speak('Peer endorsement sent! Collaboration honor awarded.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Age Stage Switcher */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          🏅
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              Community, Teams &amp; Rankings
            </span>
            <span className="text-xs font-bold text-amber-100">
              {currentStage === 'early' && '• Level 1: Friendly Animal Classroom'}
              {currentStage === 'junior' && '• Level 2: House Leagues & Team Quests'}
              {currentStage === 'teen' && '• Level 3: Study Squads & Global League Tiers'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Friends &amp; Rankings</span>
            <span className="text-3xl">🌟🤝</span>
          </h2>
          <p className="text-sm font-medium text-amber-50 leading-relaxed">
            Collaborate with peers, cheer on friends, achieve team quests, and celebrate shared learning milestones!
          </p>

          {/* Age Tier Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)', subtitle: 'Animal Buddies & High-Fives' },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)', subtitle: 'House Leagues & Team Quests' },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & STEM)', subtitle: 'Study Squads & League Tiers' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentStage(st.id as KidAgeStage);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                  currentStage === st.id
                    ? 'bg-white text-slate-950 ring-2 ring-white scale-102 font-extrabold shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/25'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* STAGE 1: AGES 3–7 (Animal Friends)                  */}
      {/* ==================================================== */}
      {currentStage === 'early' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-tr from-amber-100 to-yellow-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white text-3xl flex items-center justify-center shadow-md">
                🧒
              </div>
              <div>
                <div className="text-xs font-black uppercase text-amber-800">Rank #1 Star Champion</div>
                <h3 className="text-lg font-black text-slate-900">{profile.name}</h3>
                <p className="text-xs text-slate-600">Level {profile.level} Explorer · 52 Shiny Gold Stars ⭐</p>
              </div>
            </div>
            <button
              onClick={() => speak('Great job! You are in the lead with 52 gold stars!')}
              className="px-4 py-2 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xs"
            >
              Hear My Rank 👑
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earlyFriends.map((f) => (
              <div
                key={f.id}
                className="bg-white p-5 rounded-3xl border-2 border-slate-200 hover:border-amber-300 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{f.animal}</span>
                  <div>
                    <div className="font-black text-slate-900 text-sm">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.badge}</div>
                    <div className="text-[11px] text-amber-700 italic mt-0.5">&ldquo;{f.motto}&rdquo;</div>
                  </div>
                </div>

                <button
                  onClick={() => handleGiveHighFive(f)}
                  className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>✋</span>
                  <span>High Five ({f.highFives})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STAGE 2: AGES 8–10 (House Leagues & Quests)         */}
      {/* ==================================================== */}
      {currentStage === 'junior' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">⚡ Junior House Championship &amp; Team XP</h3>
                <p className="text-xs text-slate-500">Every lesson you complete adds XP to your House Quest!</p>
              </div>
              <button
                onClick={handleCheerHouse}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Cheer My House (+50 XP)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {juniorHouses.map((house) => {
                const progressPct = Math.round((house.teamXp / house.targetXp) * 100);

                return (
                  <div
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id as any)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                      selectedHouse === house.id ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-200' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">{house.name}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {house.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{house.motto}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Quest Progress</span>
                        <span className="font-mono text-indigo-700">{house.teamXp} / {house.targetXp} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium">
                      Top Squad: {house.topMembers.join(' · ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STAGE 3: AGES 11–17 (Teen Titans & Study Squads)     */}
      {/* ==================================================== */}
      {currentStage === 'teen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">⚡ Teen Study Squads &amp; Focus Pods</h3>
                <p className="text-xs text-slate-500">Collaborative co-working sprints for STEM, Coding &amp; Olympiads</p>
              </div>
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Weekly Sprint: Day 5 of 7
              </span>
            </div>

            <div className="space-y-3">
              {teenSquads.map((squad) => (
                <div
                  key={squad.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{squad.name}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {squad.rank}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Focus: <span className="font-semibold text-slate-800">{squad.specialization}</span> · {squad.members} Active Contributors
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-sm text-indigo-900 font-mono">{squad.sprintXp.toLocaleString()} XP</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Weekly Sprint</div>
                    </div>

                    <button
                      onClick={() => handleSendKudo(squad.id)}
                      disabled={kudosGiven[squad.id]}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        kudosGiven[squad.id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{kudosGiven[squad.id] ? 'Kudos Sent 👍' : 'Give Kudos'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
