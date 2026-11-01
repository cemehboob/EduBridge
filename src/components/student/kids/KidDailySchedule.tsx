import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Volume2,
  Sparkles,
  Plus,
  Clock,
  Sun,
  Sunset,
  Moon,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';
import { calculateAge } from '../../../utils/userProfile';

export type KidAgeStage = 'early' | 'junior' | 'teen';

interface KidRoutineTask {
  id: string;
  stage: KidAgeStage;
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  emoji: string;
  xpReward: number;
  completed: boolean;
  voicePrompt: string;
  estimatedMinutes: number;
}

interface KidDailyScheduleProps {
  profile?: UserProfile;
  onEarnXp?: (amount: number) => void;
}

export const KidDailySchedule: React.FC<KidDailyScheduleProps> = ({ profile, onEarnXp }) => {
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

  const [tasks, setTasks] = useState<KidRoutineTask[]>([
    // STAGE 1: AGES 3–7
    { id: 'e1', stage: 'early', period: 'morning', title: 'Brush Teeth & Sparkle Smile', emoji: '🪥', xpReward: 15, completed: true, voicePrompt: 'Brush your teeth to make them sparkle clean!', estimatedMinutes: 5 },
    { id: 'e2', stage: 'early', period: 'morning', title: 'Eat Healthy Champion Breakfast', emoji: '🥞', xpReward: 15, completed: true, voicePrompt: 'Eat your yummy fruits and breakfast for energy!', estimatedMinutes: 20 },
    { id: 'e3', stage: 'early', period: 'morning', title: 'Pack Backpack & Favorite Storybook', emoji: '🎒', xpReward: 10, completed: false, voicePrompt: 'Pack your little backpack with your storybook and water!', estimatedMinutes: 10 },
    { id: 'e4', stage: 'early', period: 'afternoon', title: 'Read 1 Fun Fairy Tale or Story', emoji: '📚', xpReward: 20, completed: false, voicePrompt: 'Open a fun book with pictures and explore the story!', estimatedMinutes: 15 },
    { id: 'e5', stage: 'early', period: 'afternoon', title: 'Count Dino Math or Solve 1 Puzzle', emoji: '🦖', xpReward: 20, completed: false, voicePrompt: 'Count friendly dinosaurs and win stars!', estimatedMinutes: 10 },
    { id: 'e6', stage: 'early', period: 'afternoon', title: 'Play Outside & 10 Happy Jumps', emoji: '🏃', xpReward: 15, completed: false, voicePrompt: 'Run in the grass and jump ten times!', estimatedMinutes: 30 },
    { id: 'e7', stage: 'early', period: 'evening', title: 'Put Toys Back into the Toy Box', emoji: '🧸', xpReward: 15, completed: false, voicePrompt: 'Tidy up your favorite toys into the toy box!', estimatedMinutes: 10 },
    { id: 'e8', stage: 'early', period: 'evening', title: 'Cozy Family Bedtime Reading', emoji: '📖', xpReward: 15, completed: false, voicePrompt: 'Snuggle up and listen to a cozy bedtime tale!', estimatedMinutes: 20 },
    { id: 'e9', stage: 'early', period: 'evening', title: 'Pajamas On & Sweet Dreams Recharge', emoji: '😴', xpReward: 20, completed: false, voicePrompt: 'Put on soft pajamas for sweet dreams!', estimatedMinutes: 10 },

    // STAGE 2: AGES 8–10 (Junior)
    { id: 'j1', stage: 'junior', period: 'morning', title: 'Check School Backpack & Homework Binder', emoji: '🎒', xpReward: 20, completed: true, voicePrompt: 'Review your school binder and pack homework assignments.', estimatedMinutes: 10 },
    { id: 'j2', stage: 'junior', period: 'morning', title: '15-Min Morning News or Science Reading', emoji: '📰', xpReward: 20, completed: false, voicePrompt: 'Read a quick science or current events article.', estimatedMinutes: 15 },
    { id: 'j3', stage: 'junior', period: 'afternoon', title: 'Complete Math & Science Homework Sets', emoji: '📐', xpReward: 30, completed: false, voicePrompt: 'Solve assigned math exercises and science worksheets.', estimatedMinutes: 40 },
    { id: 'j4', stage: 'junior', period: 'afternoon', title: '20-Min Coding or Typing Logic Challenge', emoji: '💻', xpReward: 25, completed: false, voicePrompt: 'Practice keyboard touch typing or a block coding puzzle.', estimatedMinutes: 20 },
    { id: 'j5', stage: 'junior', period: 'afternoon', title: 'Outdoor Sports / Cycling / Active Play', emoji: '⚽', xpReward: 25, completed: false, voicePrompt: 'Get outside for soccer, cycling, or active exercise.', estimatedMinutes: 45 },
    { id: 'j6', stage: 'junior', period: 'evening', title: 'Creative Hobby (LEGO, Sketching, Music)', emoji: '🎨', xpReward: 20, completed: false, voicePrompt: 'Spend creative time drawing, building, or playing an instrument.', estimatedMinutes: 30 },
    { id: 'j7', stage: 'junior', period: 'evening', title: 'Chapter Book Reading (20 Pages)', emoji: '📚', xpReward: 25, completed: false, voicePrompt: 'Read twenty pages of your adventure chapter book.', estimatedMinutes: 30 },

    // STAGE 3: AGES 11–17 (Teen Sprints)
    { id: 't1', stage: 'teen', period: 'morning', title: 'Review Daily Academic Goals & Priority Queue', emoji: '🎯', xpReward: 25, completed: true, voicePrompt: 'Set your top three focus priorities for today.', estimatedMinutes: 10 },
    { id: 't2', stage: 'teen', period: 'morning', title: 'STEM & Calculus / Algebra Problem Set', emoji: '📐', xpReward: 35, completed: false, voicePrompt: 'Deep focus on 5 multi-step mathematics problems.', estimatedMinutes: 45 },
    { id: 't3', stage: 'teen', period: 'afternoon', title: 'Science Lab / Computer Science Coding Sprint', emoji: '💻', xpReward: 40, completed: false, voicePrompt: 'Work on your programming project or biology lab write-up.', estimatedMinutes: 50 },
    { id: 't4', stage: 'teen', period: 'afternoon', title: 'Essay Writing & Critical Argumentation Draft', emoji: '📝', xpReward: 35, completed: false, voicePrompt: 'Draft or revise your persuasive academic essay.', estimatedMinutes: 40 },
    { id: 't5', stage: 'teen', period: 'afternoon', title: 'Cardio / Strength Training / Team Athletics', emoji: '🏋️', xpReward: 30, completed: false, voicePrompt: 'Engage in 45 minutes of vigorous cardiovascular exercise.', estimatedMinutes: 45 },
    { id: 't6', stage: 'teen', period: 'evening', title: 'Language Vocab Flashcards & Exam Drill', emoji: '🗂️', xpReward: 25, completed: false, voicePrompt: 'Review 30 spaced-repetition vocabulary flashcards.', estimatedMinutes: 20 }
  ]);

  // Pomodoro Focus Timer for Teens
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isTimerRunning) {
      sound.playLevelUp();
      setIsTimerRunning(false);
      speak('Pomodoro focus sprint complete! Take a 5-minute break.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, pomodoroSeconds]);

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleToggleTask = (task: KidRoutineTask) => {
    if (currentIsLocked) {
      sound.playError();
      speak(`This schedule block is locked. Based on your birthdate, you are age ${userAge}.`);
      return;
    }
    const nextVal = !task.completed;
    if (nextVal) {
      sound.playSuccess();
      speak(`Completed: ${task.title}! Plus ${task.xpReward} XP!`);
      if (onEarnXp) onEarnXp(task.xpReward);
    } else {
      sound.playClick();
    }
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: nextVal } : t)));
  };

  const activeStageTasks = tasks.filter((t) => t.stage === currentStage);
  const completedCount = activeStageTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (activeStageTasks.length || 1)) * 100);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Date of Birth & Age Verification Indicator */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-15 text-8xl select-none pointer-events-none">
          📅
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-100 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered DOB: {registeredDob} (Age {userAge})</span>
            </span>
            <span className="text-xs font-bold text-teal-100">
              • Verified Cohort: {userCalculatedStage === 'early' ? 'Ages 3–7' : userCalculatedStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17 Teen'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Daily Schedule &amp; Routines</span>
            <span className="text-3xl">⏰🎯</span>
          </h2>
          <p className="text-sm font-medium text-teal-100 leading-relaxed">
            Habit tracking and time management calibrated to your registered developmental age!
          </p>

          {/* Age Tier Selector Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {[
              { id: 'early', label: '🧸 Ages 3–7 (Early Explorers)', minAge: 3, maxAge: 7 },
              { id: 'junior', label: '🚀 Ages 8–10 (Junior Inventors)', minAge: 8, maxAge: 10 },
              { id: 'teen', label: '⚡ Ages 11–17 (Teen Titans & Sprints)', minAge: 11, maxAge: 17 }
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
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-102 font-extrabold'
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

          <div className="pt-1 flex items-center gap-2 text-xs text-teal-100">
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
              <span>Show strictly routines for my age group (Age {userAge})</span>
            </label>
          </div>
        </div>
      </div>

      {currentIsLocked && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl text-xs text-amber-950 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-black text-sm text-amber-900">
              🔒 Age-Gated Routine (Calibrated for {currentStage === 'junior' ? 'Ages 8–10' : 'Ages 11–17'})
            </div>
            <p className="text-slate-600 mt-0.5">
              These advanced task blocks are locked for your registered age of <strong>{userAge} years old</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-700">
          <span className="flex items-center gap-1.5">
            <span>🌟 Habit Progress:</span>
            <span className="text-teal-700 font-extrabold">
              {completedCount} of {activeStageTasks.length} Completed
            </span>
          </span>
          <span className="text-emerald-600 font-black">{progressPercent}% Fulfilled!</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Teen Pomodoro Special Widget */}
      {currentStage === 'teen' && (
        <div className={`bg-slate-950 rounded-3xl p-6 text-white border-2 border-indigo-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 ${currentIsLocked ? 'opacity-60' : ''}`}>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono text-[11px] uppercase tracking-wider font-bold">
              <span>⏱️ Pomodoro Deep Focus Engine (Ages 11–17)</span>
            </div>
            <h4 className="text-lg font-black text-white">25-Minute High-Yield Study Sprint</h4>
            <p className="text-xs text-slate-400">Zero distractions. 25 min focus / 5 min rest interval.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="font-mono text-4xl sm:text-5xl font-black text-amber-400 tracking-wider">
              {formatTimer(pomodoroSeconds)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentIsLocked) return;
                  sound.playClick();
                  setIsTimerRunning(!isTimerRunning);
                }}
                disabled={currentIsLocked}
                className={`p-3 rounded-2xl font-black text-xs shadow-md transition-all ${
                  currentIsLocked
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : isTimerRunning
                    ? 'bg-amber-500 text-slate-950 cursor-pointer'
                    : 'bg-emerald-600 text-white cursor-pointer'
                }`}
              >
                {currentIsLocked ? <Lock className="w-5 h-5 text-slate-400" /> : isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => {
                  if (currentIsLocked) return;
                  sound.playClick();
                  setIsTimerRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                disabled={currentIsLocked}
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routine Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeStageTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task)}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
              currentIsLocked
                ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
                : 'cursor-pointer hover:scale-102 ' + (task.completed ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-slate-200 hover:border-teal-300')
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{task.emoji}</span>
                <div>
                  <div className={`font-black text-sm leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {task.title}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    {task.period === 'morning' && '☀️ Morning'}
                    {task.period === 'afternoon' && '🎨 Afternoon'}
                    {task.period === 'evening' && '🌙 Evening'}
                    {' · '}{task.estimatedMinutes}m
                  </div>
                </div>
              </div>

              <div>
                {currentIsLocked ? (
                  <Lock className="w-5 h-5 text-slate-400" />
                ) : task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 hover:text-teal-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] font-black text-amber-600">+{task.xpReward} Star Points</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(task.voicePrompt);
                }}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
