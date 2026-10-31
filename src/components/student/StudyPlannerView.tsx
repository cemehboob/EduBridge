import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  AlertTriangle
} from 'lucide-react';
import { DailyTask, RevisionItem, UserProfile } from '../../types';
import { sound } from '../../utils/audio';

interface StudyPlannerViewProps {
  tasks: DailyTask[];
  revisions: RevisionItem[];
  profile: UserProfile;
  onToggleTask: (taskId: string) => void;
  onCompleteRevision: (revId: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  revisions,
  profile,
  onToggleTask,
  onCompleteRevision,
  onAddTask
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('04:00 PM - 04:45 PM');
  const [taskModule, setTaskModule] = useState<'Language' | 'Exam Prep' | 'Academic' | 'Career'>('Exam Prep');
  const [taskDuration, setTaskDuration] = useState(45);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Calculate days remaining to exam
  const examDate = profile.targetExamDate ? new Date(profile.targetExamDate) : new Date(Date.now() + 20 * 86400000);
  const today = new Date();
  const diffDays = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24)));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    sound.playClick();
    onAddTask({
      title: taskTitle.trim(),
      timeSlot: taskTime,
      module: taskModule,
      durationMin: taskDuration,
      priority: 'High'
    });
    setTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner & Exam Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Countdown Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-900/50 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Calendar className="w-4 h-4" />
              <span>Target Exam Countdown</span>
            </div>
            <h3 className="text-xl font-black">{profile.targetExam || 'IELTS Academic'}</h3>
            <p className="text-xs text-slate-300">Targeting {profile.targetBand || 'Band 8.0'}</p>
          </div>

          <div className="my-4 text-center">
            <span className="font-mono text-5xl font-black text-amber-400 tracking-tight">{diffDays}</span>
            <span className="text-xs text-slate-300 block uppercase font-bold tracking-widest mt-1">Days Left</span>
          </div>

          <div className="text-xs text-slate-300 bg-white/10 p-3 rounded-2xl border border-white/10">
            Recommended: 2 mock tests &amp; 3 spaced-repetition cycles remaining.
          </div>
        </div>

        {/* Daily Schedule Progress */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                Daily Focus Schedule
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {completedTasksCount} of {tasks.length} Milestones Achieved
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{taskProgress}% of daily schedule fulfilled</span>
              <span>1h 45m planned study</span>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Optimal study rhythm: 45-minute focus intervals interspersed with 10-minute active recall.</span>
          </div>
        </div>

      </div>

      {/* Main Schedule & Spaced Repetition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Daily Tasks Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-slate-900 text-lg">Today's Timeline</h4>
            <span className="text-xs text-slate-500 font-medium">Click circle to mark complete</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  sound.playClick();
                  onToggleTask(task.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <span className="font-mono">{task.timeSlot}</span>
                      <span>·</span>
                      <span className="text-indigo-600 font-bold">{task.module}</span>
                    </div>
                    <p className={`text-sm font-bold text-slate-800 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                  {task.durationMin}m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ebbinghaus Spaced Repetition Queue */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <span>Spaced Repetition Queue</span>
              </h4>
              <p className="text-xs text-slate-500">Adaptive Ebbinghaus forgetting curve memory recall</p>
            </div>
          </div>

          <div className="space-y-3">
            {revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700">{rev.subject}</span>
                  <div className="flex items-center gap-1.5">
                    {rev.isOverdue && (
                      <span className="flex items-center gap-1 text-rose-600 font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" /> Due Today
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Stage: {rev.intervalStage}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-snug">{rev.concept}</p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>Retention:</span>
                    <strong className="text-emerald-700">{rev.retentionScore}%</strong>
                  </div>

                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onCompleteRevision(rev.id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-2xs hover:bg-indigo-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Review &amp; Refresh</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Schedule Study Block</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Focus Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Cambridge C1 Speaking Simulation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Module</label>
                  <select
                    value={taskModule}
                    onChange={(e) => setTaskModule(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  >
                    <option value="Language">Language</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duration: {taskDuration} minutes</label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
