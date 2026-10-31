import React, { useState } from 'react';
import { triggerCelebration } from '../../utils/celebration';
import {
  TreePine,
  Award,
  BookOpen,
  Bot,
  Calendar,
  Briefcase,
  Trophy,
  PartyPopper,
  Flame,
  Sparkles,
  Medal,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  Zap,
  Grid
} from 'lucide-react';
import {
  UserProfile,
  Unit,
  Lesson,
  MockTest,
  AcademicTopic,
  OllamaModelInfo,
  ChatMessage,
  DailyTask,
  RevisionItem,
  CareerRoadmap,
  ResumeData,
  CertificateItem,
  VocabularyWord
} from '../../types';
import { LanguageTree } from './LanguageTree';
import { ExamPrepView } from './ExamPrepView';
import { AcademicView } from './AcademicView';
import { AITutorView } from './AITutorView';
import { StudyPlannerView } from './StudyPlannerView';
import { CareerPortfolioView } from './CareerPortfolioView';
import { GamificationView } from './GamificationView';
import { Leaderboard } from './Leaderboard';
import { StreakCounter } from './StreakCounter';
import { BadgeGrid } from './BadgeGrid';
import { BadgeService } from '../../services/badgeService';
import { sound } from '../../utils/audio';

type StudentTab = 'language' | 'exam' | 'academic' | 'tutor' | 'planner' | 'career' | 'leaderboard' | 'badges';

interface StudentViewProps {
  profile: UserProfile;
  units: Unit[];
  mockTests: MockTest[];
  academicTopics: AcademicTopic[];
  ollamaModels: OllamaModelInfo[];
  chatMessages: ChatMessage[];
  dailyTasks: DailyTask[];
  revisions: RevisionItem[];
  careerRoadmaps: CareerRoadmap[];
  resume: ResumeData;
  certificates: CertificateItem[];
  vocabularyWords?: VocabularyWord[];
  onStartLesson: (lesson: Lesson) => void;
  onSendMessage: (msg: ChatMessage) => void;
  onToggleTask: (taskId: string) => void;
  onCompleteRevision: (revId: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
  onUpdateResume: (updated: ResumeData) => void;
  onCelebrate?: (type: 'daily_goal' | 'streak') => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  profile,
  units,
  mockTests,
  academicTopics,
  ollamaModels,
  chatMessages,
  dailyTasks,
  revisions,
  careerRoadmaps,
  resume,
  certificates,
  vocabularyWords = [],
  onStartLesson,
  onSendMessage,
  onToggleTask,
  onCompleteRevision,
  onAddTask,
  onUpdateResume,
  onCelebrate
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('language');
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [isBadgeGridExpanded, setIsBadgeGridExpanded] = useState(false);

  // Compute live badges for summary showcase
  const badges = BadgeService.computeBadges(profile, vocabularyWords, units, mockTests, 3);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const tabs: { id: StudentTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'language', label: 'Language Trees', icon: <TreePine className="w-4 h-4" /> },
    { id: 'exam', label: 'Exam Prep (IELTS/PTE)', icon: <Award className="w-4 h-4" /> },
    { id: 'academic', label: 'STEM Academics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Mentor Bridge', icon: <Bot className="w-4 h-4" />, badge: '4 Models' },
    { id: 'planner', label: 'Study Planner', icon: <Calendar className="w-4 h-4" /> },
    { id: 'career', label: 'Career & Portfolio', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: <Trophy className="w-4 h-4" /> },
    { id: 'badges', label: 'Badges & Honors', icon: <Medal className="w-4 h-4" />, badge: `${unlockedBadgesCount}/${badges.length}` }
  ];


  const handleConsultAIFromAcademic = (topicTitle: string, formula?: string) => {
    setTutorInitialPrompt(
      `Please provide a rigorous mathematical and conceptual deconstruction of: "${topicTitle}". Formula context: ${formula || 'N/A'}`
    );
    setActiveTab('tutor');
    sound.playClick();
  };

  const handleAskCareerAdvisor = (careerTitle: string) => {
    setTutorInitialPrompt(
      `As my career strategist (Llama 3.3), analyze my trajectory for "${careerTitle}". What specific open-source portfolio artifact will give me an unfair advantage in freelance proposals?`
    );
    setActiveTab('tutor');
    sound.playClick();
  };

  return (
    <div className="space-y-6">
      
      {/* Student Sub-Navigation Bar */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <nav aria-label="Student Learning Navigation" className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Celebratory Milestone Bar (Visible across all tabs when Goal is Reached) */}
      {profile.todayXp >= profile.dailyGoalXp && (
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-orange-500/15 border border-amber-300 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <PartyPopper className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-amber-950 block">
                  Daily XP Goal Reached ({profile.todayXp} / {profile.dailyGoalXp} XP)!
                </span>
                <span className="text-[11px] text-amber-800">
                  Outstanding consistency! Day {profile.currentStreak} study streak is locked in.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                triggerCelebration('daily_goal');
                if (onCelebrate) onCelebrate('daily_goal');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Confetti 🎉</span>
            </button>
          </div>
        </div>
      )}

      {/* Prominent Streak Counter & Monthly Activity Heatmap Dashboard */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4">
        <StreakCounter
          profile={profile}
          onCelebrate={onCelebrate ? () => onCelebrate('streak') : undefined}
        />

        {/* Prominent Milestone Badges Showcase Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                <Medal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Milestone Badges &amp; Achievements
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {unlockedBadgesCount} / {badges.length} Unlocked
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Earn commemorative badges with bonus XP by hitting major study habits, vocabulary, and league milestones.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('badges');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-200/80 shadow-2xs"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>View Full Badge Grid</span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>
            </div>
          </div>

          {/* Quick Preview of the 3 Key Requested Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Milestone 1: 1000 Words Learned */}
            {(() => {
              const b = badges.find((x) => x.id === 'badge_words_1000');
              if (!b) return null;
              const pct = Math.min(100, Math.round((b.currentValue / b.targetValue) * 100));
              return (
                <div
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('badges');
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-cyan-400 bg-gradient-to-br from-white to-cyan-50/30 hover:shadow-sm transition-all cursor-pointer group space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 group-hover:text-cyan-700 block">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {b.tier} Tier · {b.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      +{b.xpReward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {b.criteria}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                      <span>{b.unlocked ? 'Unlocked' : 'Progress'}</span>
                      <span>{b.currentValue} / {b.targetValue} words ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Milestone 2: 7-Day Streak */}
            {(() => {
              const b = badges.find((x) => x.id === 'badge_streak_7');
              if (!b) return null;
              return (
                <div
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('badges');
                  }}
                  className="p-3.5 rounded-2xl border border-amber-200/90 hover:border-amber-400 bg-gradient-to-br from-white to-amber-50/40 hover:shadow-sm transition-all cursor-pointer group space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 group-hover:text-amber-700 block">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                          {b.tier} Tier · {b.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {b.criteria}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                      <span className="text-emerald-700 font-semibold">Habit Pioneer</span>
                      <span>{profile.currentStreak} / {b.targetValue} days (100%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Milestone 3: Top of Leaderboard */}
            {(() => {
              const b = badges.find((x) => x.id === 'badge_top_leaderboard');
              if (!b) return null;
              return (
                <div
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('badges');
                  }}
                  className="p-3.5 rounded-2xl border border-rose-200/90 hover:border-rose-400 bg-gradient-to-br from-white to-rose-50/40 hover:shadow-sm transition-all cursor-pointer group space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 group-hover:text-rose-700 block">
                          {b.title}
                        </span>
                        <span className="text-[10px] text-rose-700 font-semibold uppercase tracking-wider">
                          {b.tier} Tier · {b.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Rank #3</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {b.criteria}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                      <span className="text-emerald-700 font-semibold">Podium Promotion</span>
                      <span>Rank #3 / Top 3 (100%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Active Tab View */}
      <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {activeTab === 'language' && (
          <LanguageTree
            units={units}
            profile={profile}
            onStartLesson={onStartLesson}
            onCelebrate={onCelebrate}
          />
        )}

        {activeTab === 'exam' && (
          <ExamPrepView mockTests={mockTests} />
        )}

        {activeTab === 'academic' && (
          <AcademicView
            topics={academicTopics}
            onConsultAI={handleConsultAIFromAcademic}
          />
        )}

        {activeTab === 'tutor' && (
          <AITutorView
            models={ollamaModels}
            messages={chatMessages}
            onSendMessage={onSendMessage}
            initialPrompt={tutorInitialPrompt}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlannerView
            tasks={dailyTasks}
            revisions={revisions}
            profile={profile}
            onToggleTask={onToggleTask}
            onCompleteRevision={onCompleteRevision}
            onAddTask={onAddTask}
          />
        )}

        {activeTab === 'career' && (
          <CareerPortfolioView
            roadmaps={careerRoadmaps}
            resume={resume}
            certificates={certificates}
            onUpdateResume={onUpdateResume}
            onAskCareerAdvisor={handleAskCareerAdvisor}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard profile={profile} />
        )}

        {activeTab === 'badges' && (
          <BadgeGrid
            profile={profile}
            vocabularyWords={vocabularyWords}
            units={units}
            mockTests={mockTests}
            currentRank={3}
            onCelebrate={onCelebrate}
          />
        )}
      </main>

    </div>
  );
};

