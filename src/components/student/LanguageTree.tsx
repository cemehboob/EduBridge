import React, { useState, useEffect } from 'react';
import { triggerCelebration } from '../../utils/celebration';
import {
  CheckCircle2,
  Lock,
  Star,
  Play,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  PartyPopper,
  Globe
} from 'lucide-react';
import { Unit, Lesson, UserProfile } from '../../types';
import { sound } from '../../utils/audio';
import { ieltsAcademicUnits } from '../../data/ieltsUnitsData';

interface LanguageTreeProps {
  units: Unit[];
  profile: UserProfile;
  onStartLesson: (lesson: Lesson) => void;
  onCelebrate?: (type: 'daily_goal' | 'streak') => void;
}

export const LanguageTree: React.FC<LanguageTreeProps> = ({
  units,
  profile,
  onStartLesson,
  onCelebrate
}) => {
  const isGoalReached = profile.todayXp >= profile.dailyGoalXp;
  const dailyProgress = Math.min(100, Math.round((profile.todayXp / profile.dailyGoalXp) * 100));

  // Determine if student's primary educational target is IELTS / English Academic
  const prefersIelts = Boolean(
    profile.targetExam?.toLowerCase().includes('ielts') ||
    profile.preferredLanguage?.toLowerCase().includes('ielts') ||
    profile.preferredLanguage?.toLowerCase().includes('academic english')
  );

  const [activeTrack, setActiveTrack] = useState<'ielts' | 'spanish'>(
    prefersIelts ? 'ielts' : 'spanish'
  );

  useEffect(() => {
    setActiveTrack(prefersIelts ? 'ielts' : 'spanish');
  }, [profile.targetExam, profile.preferredLanguage, prefersIelts]);

  const displayedUnits = activeTrack === 'ielts' ? ieltsAcademicUnits : units;

  const handleCelebrateGoal = () => {
    sound.playClick();
    triggerCelebration('daily_goal');
    if (onCelebrate) onCelebrate('daily_goal');
  };

  const handleCelebrateStreak = () => {
    sound.playClick();
    triggerCelebration('streak');
    if (onCelebrate) onCelebrate('streak');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Daily Goal & Streak Banner */}
      <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
        isGoalReached
          ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-orange-500/10 border-amber-300 shadow-sm'
          : 'bg-white border-slate-200/80 shadow-xs'
      } flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isGoalReached ? (
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <PartyPopper className="w-3.5 h-3.5" /> Goal Achieved!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Daily Target
              </span>
            )}
            <h3 className="font-extrabold text-slate-900 text-base">
              {isGoalReached ? 'Daily XP Target Smashed!' : 'Today’s Daily XP Goal'}
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            {profile.todayXp} of {profile.dailyGoalXp} XP reached · Day {profile.currentStreak} study habit active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 sm:w-48">
            <div className="w-full bg-slate-200/70 h-3.5 rounded-full overflow-hidden border border-slate-300/40">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalReached
                    ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500'
                    : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }`}
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
            <span className="text-xs font-black text-slate-800 font-mono w-10 text-right">{dailyProgress}%</span>
          </div>

          {/* Celebratory Confetti Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isGoalReached ? (
              <button
                onClick={handleCelebrateGoal}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Fire celebratory confetti animation"
              >
                <PartyPopper className="w-3.5 h-3.5 animate-bounce" />
                <span>Celebrate Goal! 🎉</span>
              </button>
            ) : (
              <button
                onClick={handleCelebrateStreak}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
                title="Celebrate your active study streak with flame confetti"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Celebrate Streak ({profile.currentStreak}d)</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Target Course & Track Switcher */}
      <div className="space-y-4">
        {/* Track Selection Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTrack('ielts');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTrack === 'ielts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>IELTS Academic Track (Band 8.0+)</span>
              {prefersIelts && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Your Target</span>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTrack('spanish');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTrack === 'spanish'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Spanish Language Course</span>
              {!prefersIelts && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Your Target</span>
              )}
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold px-2">
            Target Exam: <span className="text-indigo-700 font-black">{profile.targetExam || 'IELTS Academic'}</span>
          </div>
        </div>

        {/* Dynamic Course Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 block">
              {activeTrack === 'ielts' ? 'Official Exam Preparation Curriculum' : 'World Language Track'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTrack === 'ielts' ? 'IELTS Academic & Formal Discourse' : 'Conversational Spanish & Discourse'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTrack === 'ielts'
                ? 'Cohesive Task 1 visual synthesis, Band 9 Task 2 essays, and high-scoring lexical precision.'
                : 'Interactive greetings, café dialogues, directions, and foundational syntax drills.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>
              {activeTrack === 'ielts'
                ? `Target Band: ${profile.targetBand || '8.0 Band'} • C1/C2 Rubric`
                : 'CEFR Level B2 Path'}
            </span>
          </div>
        </div>
      </div>

      {/* Units Stack */}
      <div className="space-y-8">
        {displayedUnits.map((unit) => {
          const completedCount = unit.lessons.filter((l) => l.completed).length;
          const totalCount = unit.lessons.length;
          const isUnitDone = totalCount > 0 && completedCount === totalCount;

          return (
            <div
              key={unit.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-200 ${
                unit.locked
                  ? 'bg-slate-50/70 border-slate-200 opacity-70'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              {/* Unit Header Strip */}
              <div className={`p-5 sm:p-6 bg-gradient-to-r ${unit.color} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
                    <span>Unit {unit.unitNumber}</span>
                    <span>·</span>
                    <span>{totalCount} Lessons</span>
                    {unit.locked && (
                      <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-white text-[10px]">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{unit.title}</h3>
                  <p className="text-xs text-white/90 max-w-xl">{unit.description}</p>
                </div>

                {!unit.locked && (
                  <div className="flex items-center gap-2 bg-black/15 backdrop-blur-xs px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{completedCount}/{totalCount} Completed</span>
                  </div>
                )}
              </div>

              {/* Lessons Interactive Node Path */}
              {!unit.locked && (
                <div className="p-6 sm:p-10 relative flex flex-col items-center">
                  
                  {/* Stepping node path */}
                  <div className="flex flex-col items-center space-y-6 w-full max-w-md">
                    {unit.lessons.map((lesson, idx) => {
                      // Slight natural serpentine offset
                      const offsets = ['translate-x-0', '-translate-x-6 sm:-translate-x-10', 'translate-x-6 sm:translate-x-10', 'translate-x-0'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div key={lesson.id} className={`flex flex-col items-center ${offsetClass} transition-transform`}>
                          
                          {/* Node circle */}
                          <div className="relative group">
                            <button
                              onClick={() => {
                                sound.playClick();
                                onStartLesson(lesson);
                              }}
                              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-md ${
                                lesson.completed
                                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300 hover:scale-105 ring-4 ring-amber-100'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 ring-4 ring-indigo-100'
                              }`}
                            >
                              {lesson.completed ? (
                                <Star className="w-8 h-8 fill-slate-900" />
                              ) : (
                                <Play className="w-7 h-7 fill-white translate-x-0.5" />
                              )}
                              <span className="text-[10px] font-black mt-0.5">
                                +{lesson.xpReward} XP
                              </span>
                            </button>

                            {/* Floating crown / check pill */}
                            {lesson.completed && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Lesson Title label */}
                          <div className="mt-2 text-center max-w-[200px]">
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{lesson.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{lesson.description}</p>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Unit review completion card */}
                  {isUnitDone && (
                    <div className="mt-8 w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Unit Mastered! 100% curriculum retention recorded.</span>
                      </div>
                      <span className="text-emerald-700 uppercase tracking-wider text-[10px]">Verified</span>
                    </div>
                  )}

                </div>
              )}

              {unit.locked && (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Unit Locked</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Complete Unit {unit.unitNumber - 1} lessons to unlock professional workplace simulations.
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
