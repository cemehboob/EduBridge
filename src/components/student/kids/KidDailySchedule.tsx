import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { sound } from '../../../utils/audio';
import { SpeechService } from '../../../services/speechService';

interface KidRoutineTask {
  id: string;
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  emoji: string;
  xpReward: number;
  completed: boolean;
  voicePrompt: string;
}

interface KidDailyScheduleProps {
  onEarnXp?: (amount: number) => void;
}

export const KidDailySchedule: React.FC<KidDailyScheduleProps> = ({ onEarnXp }) => {
  const [tasks, setTasks] = useState<KidRoutineTask[]>([
    // Morning
    {
      id: 'm1',
      period: 'morning',
      title: 'Brush Teeth & Sparkle Smile',
      emoji: '🪥',
      xpReward: 15,
      completed: true,
      voicePrompt: 'Brush your teeth top and bottom for two whole minutes to make them sparkle!'
    },
    {
      id: 'm2',
      period: 'morning',
      title: 'Eat Healthy Champion Breakfast',
      emoji: '🥞',
      xpReward: 15,
      completed: true,
      voicePrompt: 'Eat your yummy fruits and breakfast to fuel your brain for learning!'
    },
    {
      id: 'm3',
      period: 'morning',
      title: 'Pack Backpack & Favorite Storybook',
      emoji: '🎒',
      xpReward: 10,
      completed: false,
      voicePrompt: 'Pack your little backpack with your storybook and fresh water bottle!'
    },

    // Afternoon
    {
      id: 'a1',
      period: 'afternoon',
      title: 'Read 1 Fun Fairy Tale or Story',
      emoji: '📚',
      xpReward: 20,
      completed: false,
      voicePrompt: 'Open a fun book with pictures and explore the magical story!'
    },
    {
      id: 'a2',
      period: 'afternoon',
      title: 'Count Dino Math or Solve 1 Puzzle',
      emoji: '🦖',
      xpReward: 20,
      completed: false,
      voicePrompt: 'Play five minutes of dinosaur counting or shape matching!'
    },
    {
      id: 'a3',
      period: 'afternoon',
      title: 'Play Outside & 10 Happy Jumps',
      emoji: '🏃',
      xpReward: 15,
      completed: false,
      voicePrompt: 'Run in the grass, jump 10 times, and breathe fresh sunshine air!'
    },

    // Evening
    {
      id: 'e1',
      period: 'evening',
      title: 'Put Toys Back into the Toy Box',
      emoji: '🧸',
      xpReward: 15,
      completed: false,
      voicePrompt: 'Help tidy up the room by tucking your favorite toys into the toy box!'
    },
    {
      id: 'e2',
      period: 'evening',
      title: 'Cozy Family Bedtime Reading',
      emoji: '📖',
      xpReward: 15,
      completed: false,
      voicePrompt: 'Snuggle under a warm blanket and listen to a cozy bedtime tale!'
    },
    {
      id: 'e3',
      period: 'evening',
      title: 'Pajamas On & Sweet Dreams Recharge',
      emoji: '😴',
      xpReward: 20,
      completed: false,
      voicePrompt: 'Put on soft pajamas and close your eyes for sweet dreams and brain recharge!'
    }
  ]);

  const [filterPeriod, setFilterPeriod] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎨');
  const [newPeriod, setNewPeriod] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const speak = (text: string) => {
    sound.playClick();
    if (SpeechService.isSynthesisSupported()) {
      SpeechService.speak(text, 'en-US');
    }
  };

  const handleToggleTask = (task: KidRoutineTask) => {
    const nextCompleted = !task.completed;
    if (nextCompleted) {
      sound.playSuccess();
      speak(`Awesome! You finished: ${task.title}! Plus ${task.xpReward} stars!`);
      if (onEarnXp) onEarnXp(task.xpReward);
    } else {
      sound.playClick();
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playLevelUp();
    const newTask: KidRoutineTask = {
      id: `task_${Date.now()}`,
      period: newPeriod,
      title: newTitle.trim(),
      emoji: newEmoji,
      xpReward: 20,
      completed: false,
      voicePrompt: `Time for your custom activity: ${newTitle.trim()}!`
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
    setShowAddModal(false);
    speak(`Yay! Added ${newTask.title} to your daily schedule!`);
  };

  const filteredTasks = tasks.filter((t) => (filterPeriod === 'all' ? true : t.period === filterPeriod));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-3 top-3 opacity-20 text-8xl select-none pointer-events-none">
          📅
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-teal-100 border border-white/30">
            <span>⏰ My Daily Star Routine</span>
            <span>•</span>
            <span>Happy Habits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Daily Schedule &amp; Fun Habits!</span>
            <span className="text-3xl">☀️🌈</span>
          </h2>
          <p className="text-sm font-medium text-teal-100 leading-relaxed">
            Check off your morning, afternoon, and bedtime habits to earn gold stars and celebrate!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-xs">
              <span className="text-emerald-600">⭐</span>
              <span>{completedCount} of {tasks.length} Habits Completed ({progressPercent}%)</span>
            </div>
            <button
              onClick={() => speak('Here is your daily routine! Brush your teeth, eat yummy food, learn new things, and sleep sweetly!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/25 hover:bg-white/35 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Routine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-700">
          <span className="flex items-center gap-1.5">
            <span>🌟 Today&apos;s Star Meter:</span>
            <span className="text-teal-700 font-extrabold">{completedCount} of {tasks.length} done</span>
          </span>
          <span className="text-emerald-600 font-black">{progressPercent}% Full!</span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter and Add Activity */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Routines (9)', icon: '⭐' },
            { id: 'morning', label: 'Morning Sunshine (3)', icon: '☀️' },
            { id: 'afternoon', label: 'Afternoon Play (3)', icon: '🎨' },
            { id: 'evening', label: 'Evening Bedtime (3)', icon: '🌙' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterPeriod(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterPeriod === tab.id
                  ? 'bg-teal-600 text-white shadow-xs scale-102'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add My Fun Activity</span>
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task)}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:scale-102 ${
              task.completed
                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{task.emoji}</span>
                <div>
                  <div className={`font-black text-sm leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {task.title}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                    {task.period === 'morning' && '☀️ Morning Sunshine'}
                    {task.period === 'afternoon' && '🎨 Afternoon Play'}
                    {task.period === 'evening' && '🌙 Bedtime Routine'}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 hover:text-teal-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] font-black text-amber-600 flex items-center gap-1">
                <span>⭐</span>
                <span>+{task.xpReward} Star Points</span>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(task.voicePrompt);
                }}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Hear audio instruction"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Fun Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>➕ Add My Fun Activity</span>
            </h3>
            <p className="text-xs text-slate-500">
              What fun habit do you want to do today? e.g. Draw a dinosaur, Help Mommy, Feed pet!
            </p>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pick a Fun Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {['🎨', '🐾', '🧩', '🎸', '🍎', '🏊', '🚴', '🚀'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => { sound.playClick(); setNewEmoji(em); }}
                      className={`text-2xl p-2 rounded-xl border-2 ${
                        newEmoji === em ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Draw a big friendly puppy"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Time of Day</label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="morning">☀️ Morning Sunshine</option>
                  <option value="afternoon">🎨 Afternoon Discovery</option>
                  <option value="evening">🌙 Evening Bedtime</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black"
                >
                  Save to Schedule ⭐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
