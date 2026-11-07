import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Headphones,
  BookOpen,
  Edit3,
  Mic,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Trophy,
  Award
} from 'lucide-react';
import { UserProfile, Lesson, IeltsDailyMission, IeltsModuleType } from '../../../types';
import { sound } from '../../../utils/audio';
import { triggerCelebration } from '../../../utils/celebration';
import {
  IeltsLearningTreeService,
  getLocalTodayDateString
} from '../../../services/ieltsLearningTreeService';

interface IeltsDailyPlanViewProps {
  profile: UserProfile;
  onStartLesson: (lesson: Lesson) => void;
  onPlanUpdated?: () => void;
}

export const IeltsDailyPlanView: React.FC<IeltsDailyPlanViewProps> = ({
  profile,
  onStartLesson,
  onPlanUpdated
}) => {
  const [dailyPlan, setDailyPlan] = useState(() =>
    IeltsLearningTreeService.getOrGenerateDailyPlan(profile)
  );

  // Sync daily plan if profile or targetBand changes
  useEffect(() => {
    const updated = IeltsLearningTreeService.getOrGenerateDailyPlan(profile);
    setDailyPlan(updated);
  }, [profile.id, profile.targetBand]);

  const todayStr = getLocalTodayDateString();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const moduleIcons: Record<IeltsModuleType, React.ReactNode> = {
    Listening: <Headphones className="w-5 h-5 text-blue-500" />,
    Reading: <BookOpen className="w-5 h-5 text-emerald-500" />,
    Writing: <Edit3 className="w-5 h-5 text-amber-500" />,
    Speaking: <Mic className="w-5 h-5 text-purple-500" />
  };

  const handleLaunchMission = (mission: IeltsDailyMission) => {
    sound.playClick();
    // Convert mission into Lesson format compatible with ExerciseModal
    const missionLesson: Lesson = {
      id: mission.id,
      title: `${mission.module}: ${mission.title}`,
      description: mission.description,
      xpReward: mission.xpReward,
      completed: mission.completed,
      score: mission.score,
      exercises: mission.exercises
    };

    onStartLesson(missionLesson);
  };

  const completedCount = dailyPlan.missions.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / dailyPlan.missions.length) * 100);

  return (
    <div className="w-full space-y-6">

      {/* Daily Reset Header Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/80 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{todayFormatted}</span>
              <span>·</span>
              <span className="text-emerald-300">Daily Reset Active</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Personalized Daily IELTS Learning Tree
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Tailored for your expected <strong className="text-amber-300 font-extrabold">{dailyPlan.targetBandText}</strong>. Complete today's 4 core missions to bridge your estimated band gap and protect your {profile.currentStreak}-day learning streak.
            </p>
          </div>

          {/* Daily Progress Gauge */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:w-64 shrink-0 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-indigo-200">Today's Missions:</span>
              <span className="text-white font-mono font-black">{completedCount} of {dailyPlan.missions.length} Done</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>{progressPercent}% Completed</span>
              {progressPercent === 100 && (
                <span className="text-emerald-300 font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Done!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reset Notice Banner */}
        <div className="mt-6 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Learning tree automatically resets every 24 hours at midnight in your local timezone.</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Historical test scores, XP, and cumulative unit mastery are permanently preserved.</span>
          </div>
        </div>
      </div>

      {/* 4 Daily Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailyPlan.missions.map((mission) => {
          const isWeakness = mission.module === dailyPlan.weakestModule;

          return (
            <div
              key={mission.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${mission.completed
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                  : isWeakness
                    ? 'bg-white border-rose-300 shadow-sm ring-1 ring-rose-200'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                }`}
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      {moduleIcons[mission.module]}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase text-slate-900 block">
                        {mission.module} Mission
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold">
                        Target {dailyPlan.targetBandText} Curriculum
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isWeakness && !mission.completed && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">
                        Priority Focus
                      </span>
                    )}
                    <span className="text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-black text-slate-900 tracking-tight mb-2">
                  {mission.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {mission.description}
                </p>

                {/* Exercises Count & Est Time */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{mission.exercises.length} Interactive Exercises</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{mission.estimatedMinutes} Mins</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {mission.completed ? (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed Today</span>
                    </span>
                    {mission.score !== undefined && (
                      <span className="bg-emerald-200/70 px-2 py-0.5 rounded text-[11px]">
                        Score: {mission.score}%
                      </span>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunchMission(mission)}
                    className={`w-full py-3 px-4 rounded-xl text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${isWeakness
                        ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    <span>Start {mission.module} Mission</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
