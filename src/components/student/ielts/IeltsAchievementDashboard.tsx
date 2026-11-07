import React, { useState } from 'react';
import {
  Award,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  BookOpen,
  Headphones,
  Edit3,
  Mic,
  Calendar,
  Milestone,
  Route,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Info
} from 'lucide-react';
import { UserProfile, IeltsModuleType } from '../../../types';
import { sound } from '../../../utils/audio';
import {
  IeltsLearningTreeService,
  parseTargetBand,
  getBandDescriptor
} from '../../../services/ieltsLearningTreeService';

interface IeltsAchievementDashboardProps {
  profile: UserProfile;
  onUpdateTargetBand?: (band: string) => void;
  onNavigateToDailyPlan?: () => void;
}

export const IeltsAchievementDashboard: React.FC<IeltsAchievementDashboardProps> = ({
  profile,
  onUpdateTargetBand,
  onNavigateToDailyPlan
}) => {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<'all' | IeltsModuleType>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [isBandSelectorOpen, setIsBandSelectorOpen] = useState(false);

  const analytics = IeltsLearningTreeService.calculateIeltsBandAnalytics(profile);
  const coreQuestions = IeltsLearningTreeService.getAnswersToCoreQuestions(profile);

  const targetBandOptions = ['6.5 Band', '7.0 Band', '7.5 Band', '8.0 Band', '8.5 Band', '9.0 Band'];

  const moduleIcons: Record<IeltsModuleType, React.ReactNode> = {
    Listening: <Headphones className="w-4 h-4 text-blue-500" />,
    Reading: <BookOpen className="w-4 h-4 text-emerald-500" />,
    Writing: <Edit3 className="w-4 h-4 text-amber-500" />,
    Speaking: <Mic className="w-4 h-4 text-purple-500" />
  };

  // Helper to get historical points for the chart based on selected filter
  const chartPoints = analytics.historicalTrend.map((pt) => {
    let value = pt.overallBand;
    if (selectedModuleFilter === 'Listening') value = pt.listening;
    else if (selectedModuleFilter === 'Reading') value = pt.reading;
    else if (selectedModuleFilter === 'Writing') value = pt.writing;
    else if (selectedModuleFilter === 'Speaking') value = pt.speaking;
    return { date: pt.date, value };
  });

  // Calculate SVG chart coordinates (viewBox 0 0 600 220)
  // Y-axis spans band 5.0 (bottom, y=190) to band 9.0 (top, y=30)
  const minY = 5.0;
  const maxY = 9.0;
  const getYCoord = (band: number) => {
    const clamped = Math.max(minY, Math.min(maxY, band));
    return 190 - ((clamped - minY) / (maxY - minY)) * 160;
  };
  const getXCoord = (index: number, total: number) => {
    return 40 + (index / (total - 1)) * 320;
  };

  const actualPathD = chartPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getXCoord(i, chartPoints.length)} ${getYCoord(pt.value)}`)
    .join(' ');

  // Target reference line Y
  const targetY = getYCoord(analytics.targetBand);

  // Projection points (from last actual point to future predicted milestones)
  const lastActualX = getXCoord(chartPoints.length - 1, chartPoints.length);
  const lastActualY = getYCoord(chartPoints[chartPoints.length - 1].value);
  const proj1X = lastActualX + 70;
  const proj1Y = getYCoord(analytics.predictedProgression[1].predictedBand);
  const proj2X = proj1X + 70;
  const proj2Y = getYCoord(analytics.predictedProgression[2].predictedBand);
  const projTargetX = proj2X + 80;
  const projTargetY = targetY;

  const projectionPathD = `M ${lastActualX} ${lastActualY} L ${proj1X} ${proj1Y} L ${proj2X} ${proj2Y} L ${projTargetX} ${projTargetY}`;

  return (
    <div className="w-full space-y-8">

      {/* Top Banner & Target Score Configurator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized IELTS Academic Pathway &amp; Progress Graph</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Target Band {analytics.targetBand.toFixed(1)} Achievement Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dynamically calibrated to your expected IELTS Academic band score. Historical performance, module weaknesses, and daily practice are continuously synchronized to guide your study trajectory.
            </p>
          </div>

          {/* Target Score Pill & Quick Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsBandSelectorOpen(!isBandSelectorOpen);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center justify-between gap-3 text-left cursor-pointer"
                title="Click to adjust your expected IELTS band score"
              >
                <div>
                  <div className="text-[10px] uppercase font-bold text-indigo-300">Expected Score</div>
                  <div className="text-base font-black text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>{analytics.targetBandText}</span>
                  </div>
                </div>
                <Sliders className="w-4 h-4 text-indigo-300 ml-2" />
              </button>

              {/* Target Band Dropdown */}
              {isBandSelectorOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-slate-500 px-2 py-1 border-b border-slate-100">
                    Select Target IELTS Band:
                  </div>
                  <div className="py-1 space-y-0.5">
                    {targetBandOptions.map((band) => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setIsBandSelectorOpen(false);
                          if (onUpdateTargetBand) {
                            onUpdateTargetBand(band);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          analytics.targetBandText.includes(band.split(' ')[0])
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{band}</span>
                        {analytics.targetBandText.includes(band.split(' ')[0]) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {onNavigateToDailyPlan && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateToDailyPlan();
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Launch Today's Missions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Quick Stat Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Current Estimated Band</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              Band {analytics.currentBand.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{analytics.overallDescriptor.split(' ')[0]} User</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Expected Target Score</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              {analytics.targetBandText}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{analytics.targetDescriptor.split(' ')[0]} Standard</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Score Gap to Bridge</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-0.5">
              {analytics.gap === 0 ? '✓ On Target' : `+${analytics.gap.toFixed(1)} Band`}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">~{Math.ceil(analytics.remainingDaysEstimated / 7)} Weeks Study</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Priority Weakness</div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5">
              {analytics.weakestModule}
            </div>
            <div className="text-[10px] text-rose-300/80 mt-0.5">Focus Drills Active</div>
          </div>
        </div>
      </div>

      {/* ==================== A. IELTS BAND SCORE PROGRESS GRAPH ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                IELTS Band Score Progress &amp; Predictive Trajectory
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive timeline tracking actual verified performance and AI-estimated progression toward your expected band score.
            </p>
          </div>

          {/* Module Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => { sound.playClick(); setSelectedModuleFilter('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedModuleFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Modules
            </button>
            {(['Listening', 'Reading', 'Writing', 'Speaking'] as const).map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => { sound.playClick(); setSelectedModuleFilter(mod); }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedModuleFilter === mod
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {moduleIcons[mod]}
                <span>{mod}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Progress Chart */}
        <div className="relative bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 overflow-x-auto">
          <svg className="w-full min-w-[550px] h-60" viewBox="0 0 600 220">
            {/* Grid Lines */}
            {[5.0, 6.0, 7.0, 8.0, 9.0].map((b) => {
              const y = getYCoord(b);
              return (
                <g key={b}>
                  <line x1="40" y1={y} x2="560" y2={y} stroke="#e2e8f0" strokeDasharray="3,3" />
                  <text x="15" y={y + 4} fill="#94a3b8" fontSize="10" fontWeight="bold">
                    {b.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Target Score Line (Gold Dotted) */}
            <line
              x1="40"
              y1={targetY}
              x2="560"
              y2={targetY}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <rect x="420" y={targetY - 18} width="140" height="16" rx="4" fill="#fef3c7" />
            <text x="426" y={targetY - 6} fill="#b45309" fontSize="9" fontWeight="900">
              TARGET: {analytics.targetBandText}
            </text>

            {/* Actual Verified Trajectory Path (Solid Emerald) */}
            <path
              d={actualPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Actual Verified Data Points */}
            {chartPoints.map((pt, i) => {
              const cx = getXCoord(i, chartPoints.length);
              const cy = getYCoord(pt.value);
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                  <text x={cx} y="210" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {pt.date}
                  </text>
                </g>
              );
            })}

            {/* Predictive Trajectory Line (Dashed Indigo) */}
            <path
              d={projectionPathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeDasharray="5,4"
              strokeLinecap="round"
            />

            {/* Predicted Milestone Points */}
            {[
              { x: proj1X, y: proj1Y, label: '+2w' },
              { x: proj2X, y: proj2Y, label: '+4w' },
              { x: projTargetX, y: projTargetY, label: 'Target' }
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <text x={p.x} y="210" fill="#6366f1" fontSize="9" fontWeight="black" textAnchor="middle">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend and Non-guaranteed Prediction Disclaimer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="w-3.5 h-1 bg-emerald-500 rounded-full inline-block" />
                Actual Verified Assessment
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                <span className="w-3.5 h-1 bg-amber-500 rounded-full inline-block" />
                Target Score ({analytics.targetBandText})
              </span>
              <span className="flex items-center gap-1.5 font-bold text-indigo-700">
                <span className="w-3.5 h-1 bg-indigo-500 rounded-full inline-block" />
                AI Predicted Trajectory
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>AI projections are estimates based on study frequency and do not guarantee test scores.</span>
            </div>
          </div>
        </div>

        {/* 4 Individual Module Cards Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Listening', 'Reading', 'Writing', 'Speaking'] as const).map((mod) => {
            const m = analytics.moduleScores[mod];
            const isWeakest = mod === analytics.weakestModule;

            const statusColors: Record<string, string> = {
              mastered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              on_track: 'bg-indigo-100 text-indigo-800 border-indigo-300',
              needs_work: 'bg-amber-100 text-amber-800 border-amber-300',
              critical_focus: 'bg-rose-100 text-rose-800 border-rose-300'
            };

            return (
              <div
                key={mod}
                className={`p-4 rounded-2xl border transition-all ${
                  isWeakest
                    ? 'bg-rose-50/40 border-rose-200 shadow-xs ring-1 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                    {moduleIcons[mod]}
                    <span>{mod}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${statusColors[m.status]}`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3 mb-2">
                  <div>
                    <span className="text-2xl font-black text-slate-900">Band {m.currentBand.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 ml-1">/ 9.0</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Gap: <strong className={m.gap > 0 ? 'text-rose-600 font-black' : 'text-emerald-600 font-black'}>{m.gap > 0 ? `+${m.gap.toFixed(1)}` : '0.0'}</strong>
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.gap === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (m.currentBand / m.targetBand) * 100)}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div className="font-semibold text-slate-700">Recommended Action:</div>
                  <div className="text-slate-500 leading-tight italic">{m.recommendedAction}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== B. PERSONALIZED IELTS ACHIEVEMENT PATHWAY ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Step-by-Step IELTS Achievement Pathway
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured 4-phase progression roadmap designed to advance your proficiency to Band {analytics.targetBand.toFixed(1)}.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
            <Milestone className="w-4 h-4 text-indigo-600" />
            <span>Overall Progress: {analytics.completionPercentage}%</span>
          </div>
        </div>

        {/* Pathway Timeline Cards */}
        <div className="space-y-4">
          {analytics.pathwayMilestones.map((m) => {
            const isCompleted = m.status === 'completed';
            const isInProgress = m.status === 'in_progress';

            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isInProgress
                    ? 'bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isCompleted ? '✓' : m.milestoneNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Phase {m.milestoneNumber}: {m.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Target Benchmark: <strong className="text-indigo-600">Band {m.targetBand.toFixed(1)}</strong> · Est. Target: {m.estimatedTargetDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isInProgress
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3">{m.description}</p>

                {/* Learning Objectives List */}
                <div className="space-y-1 mb-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Core Learning Objectives:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {m.learningObjectives.map((obj, i) => (
                      <div
                        key={i}
                        className="text-xs bg-white p-2 rounded-xl border border-slate-200/80 flex items-start gap-1.5 text-slate-700"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isCompleted ? 'text-emerald-600' : 'text-indigo-500'
                          }`}
                        />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Study Effort & Mock Test Requirement */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-slate-200/60 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recommended: {m.recommendedHoursPerWeek} hrs/week</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{m.practiceTestRequirement}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== D. 8 CORE QUESTIONS ANSWER PANEL ==================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Essential IELTS Achievement Guidance &amp; FAQ
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct, data-driven answers to the 8 core questions about your IELTS status, daily missions, and pathway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreQuestions.map((q) => {
            const isExpanded = expandedFaqId === q.id;

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => {
                  sound.playClick();
                  setExpandedFaqId(isExpanded ? null : q.id);
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">
                      {q.id}
                    </span>
                    <span>{q.question}</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>

                <div className="text-xs font-bold text-indigo-700 mt-2">
                  {q.answer}
                </div>

                {isExpanded && (
                  <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200/70 leading-relaxed animate-in fade-in">
                    {q.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
