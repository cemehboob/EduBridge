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
  Brain,
  Lock,
  Calendar
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
  const registeredDob = profile?.dateOfBirth || '2019-03-12';
  const userCalculatedStage: KidAgeStage = userAge <= 7 ? 'early' : userAge <= 10 ? 'junior' : 'teen';

  const [currentStage, setCurrentStage] = useState<KidAgeStage>(userCalculatedStage);
  const [filterToMyAgeOnly, setFilterToMyAgeOnly] = useState<boolean>(userAge <= 7);

  const isStageLocked = (stage: KidAgeStage) => {
    if (stage === 'early') return false;
    if (stage === 'junior') return userAge < 8;
    if (stage === 'teen') return userAge < 11;
    return false;
  };

  const currentIsLocked = isStageLocked(currentStage);

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
      badge: 'Gold House'
    },
    {
      id: 'cyberfoxes',
      name: 'Cyber Foxes 🦊',
      motto: 'Logic puzzles, mystery decoding, and mental math speed!',
      teamXp: 3190,
      targetXp: 4000,
      topMembers: ['Lucas M. (Level 6)', 'Emma S. (Level 5)', 'Noah B. (Level 4)'],
      badge: 'Silver House'
    },
    {
      id: 'phoenix',
      name: 'Solar Phoenix 🔥',
      motto: 'Science lab champions and nature protectors!',
      teamXp: 2950,
      targetXp: 4000,
      topMembers: ['Chloe T. (Level 5)', 'Ethan W. (Level 5)', 'Mia D. (Level 4)'],
      badge: 'Bronze House'
    }
  ]);

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
    speak(`High five sent to ${friend.name}!`);
    setTimeout(() => setCheeredId(null), 1500);
  };

  const handleCheerHouse = () => {
    if (currentIsLocked) {
      sound.playError();
      speak(`House quests require Age 8 or older. Based on your birthdate, you are age ${userAge}.`);
      return;
    }
    sound.playLevelUp();
    speak('House boosted! 50 Team XP added.');
  };

  const handleSendKudo = (squadId: string) => {
    if (currentIsLocked) {
      sound.playError();
      speak(`Teen study squads require Age 11 or older.`);
      return;
    }
    sound.playSuccess();
    setKudosGiven((prev) => ({ ...prev, [squadId]: true }));
    speak('Collaboration kudos sent.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Date of Birth & Age Verification Indicator */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          🏅
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered DOB: {registeredDob} (Age {userAge})</span>
            </span>
            <span className="text-xs font-bold text-amber-100">
              • Verified Cohort: {userCalculatedStage === 'early' ? 'Ages 3–7' : userCalculatedStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17 Teen'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Friends &amp; Rankings</span>
            <span className="text-3xl">🌟🤝</span>
          </h2>
          <p className="text-sm font-medium text-amber-50 leading-relaxed">
            Classmates, team houses, and peer collaboration squads calibrated to your developmental age!
          </p>

          {/* Age Tier Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)', minAge: 3, maxAge: 7 },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)', minAge: 8, maxAge: 10 },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & STEM)', minAge: 11, maxAge: 17 }
            ].map((st) => {
              const locked = isStageLocked(st.id as KidAgeStage);
              const isMatch = userCalculatedStage === st.id;

              if (filterToMyAgeOnly && !isMatch) return null;

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStage(st.id as KidAgeStage);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    currentStage === st.id
                      ? 'bg-white text-slate-950 ring-2 ring-white scale-102 font-extrabold shadow-sm'
                      : locked
                      ? 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/25'
                  }`}
                >
                  <span>{st.label}</span>
                  {locked && <span className="text-amber-300 font-extrabold text-[10px]">🔒 Locked</span>}
                  {isMatch && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-extrabold">Active</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-1 flex items-center gap-2 text-xs text-amber-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={filterToMyAgeOnly}
                onChange={(e) => {
                  sound.playClick();
                  setFilterToMyAgeOnly(e.target.checked);
                  if (e.target.checked) setCurrentStage(userCalculatedStage);
                }}
                className="rounded accent-white w-4 h-4 cursor-pointer"
              />
              <span>Show strictly peer groups for my age group (Age {userAge})</span>
            </label>
          </div>
        </div>
      </div>

      {currentIsLocked && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-xs text-amber-950 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-black text-sm text-amber-900">
              🔒 Age-Gated Social Community (Calibrated for {currentStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17'})
            </div>
            <p className="text-slate-600 mt-0.5">
              Peer rankings and team actions are locked because you are registered as <strong>{userAge} years old</strong>.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 1: AGES 3–7 */}
      {currentStage === 'early' && (
        <div className="space-y-4">
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

      {/* STAGE 2: AGES 8–10 */}
      {currentStage === 'junior' && (
        <div className={`space-y-4 ${currentIsLocked ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">⚡ Junior House Championship &amp; Team Quests</h3>
            <button
              onClick={handleCheerHouse}
              disabled={currentIsLocked}
              className={`px-4 py-2 rounded-2xl font-black text-xs shadow-xs ${
                currentIsLocked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-amber-500 text-slate-950 cursor-pointer'
              }`}
            >
              {currentIsLocked ? '🔒 Locked for Age 8+' : 'Cheer My House (+50 XP)'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {juniorHouses.map((house) => (
              <div key={house.id} className="p-5 rounded-3xl border-2 border-slate-200 bg-white space-y-2">
                <div className="font-black text-sm text-slate-900">{house.name}</div>
                <p className="text-xs text-slate-600">{house.motto}</p>
                <div className="font-mono text-indigo-700 font-bold text-xs">{house.teamXp} / {house.targetXp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 3: AGES 11–17 */}
      {currentStage === 'teen' && (
        <div className={`space-y-4 ${currentIsLocked ? 'opacity-60' : ''}`}>
          <h3 className="text-base font-black text-slate-900">⚡ Teen Study Squads &amp; Focus Pods</h3>
          <div className="space-y-3">
            {teenSquads.map((squad) => (
              <div key={squad.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{squad.name}</div>
                  <div className="text-xs text-slate-500">{squad.specialization} · {squad.sprintXp} XP</div>
                </div>
                <button
                  onClick={() => handleSendKudo(squad.id)}
                  disabled={currentIsLocked || kudosGiven[squad.id]}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    currentIsLocked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white cursor-pointer'
                  }`}
                >
                  {currentIsLocked ? '🔒 Locked (Age 11+)' : kudosGiven[squad.id] ? 'Kudos Sent 👍' : 'Give Kudos'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
