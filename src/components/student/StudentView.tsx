import React, { useState, useEffect } from 'react';
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
  Grid,
  Brain
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
import { VocabularyQuiz } from './VocabularyQuiz';
import { UniversalLearningArena } from '../cohorts/UniversalLearningArena';
import { QuestionSolverView } from '../solver/QuestionSolverView';
import { BadgeService } from '../../services/badgeService';
import { sound } from '../../utils/audio';

type StudentTab = 'language' | 'cohorts' | 'solver' | 'exam' | 'vocab_quiz' | 'academic' | 'tutor' | 'planner' | 'career' | 'leaderboard' | 'badges';

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
  onOpenResourceVault: () => void;
  onCelebrate?: (type: 'daily_goal' | 'streak') => void;
  onToggleSimplifiedInterface?: (simplified: boolean) => void;
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
  onOpenResourceVault,
  onCelebrate,
  onToggleSimplifiedInterface
}) => {
  const isKidMode = profile.simplifiedInterface !== undefined
    ? profile.simplifiedInterface
    : (profile.ageCohort === 'early' || profile.ageCohort === 'junior');

  const visibleConfig = profile.visibleModules || {};

  const defaultTab: StudentTab = isKidMode
    ? (profile.ageCohort === 'early' ? 'cohorts' : 'language')
    : (profile.ageCohort === 'early' || profile.ageCohort === 'senior' ? 'cohorts' : 'language');
  
  const [activeTab, setActiveTab] = useState<StudentTab>(defaultTab);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [isBadgeGridExpanded, setIsBadgeGridExpanded] = useState(false);

  // Compute live badges for summary showcase
  const badges = BadgeService.computeBadges(profile, vocabularyWords, units, mockTests, 3);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const allTabs: { id: StudentTab; label: string; icon: React.ReactNode; badge?: string; isKidDefault?: boolean }[] = [
    {
      id: 'cohorts',
      label: isKidMode ? '🧸 Story & Phonics Arena' : 'Universal Arena (5–100+)',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: isKidMode ? 'Stories' : '5 Cohorts',
      isKidDefault: profile.ageCohort === 'early' || !profile.targetExam
    },
    {
      id: 'solver',
      label: isKidMode ? '💡 AI Magic Solver' : 'AI Question Solver',
      icon: <Brain className="w-4 h-4 text-indigo-500" />,
      badge: isKidMode ? 'Magic' : 'Step-by-Step',
      isKidDefault: true
    },
    {
      id: 'language',
      label: isKidMode
        ? '🌳 Lesson Journey'
        : (profile.targetExam ? `${profile.targetExam} Tree` : 'Language Trees'),
      icon: <TreePine className="w-4 h-4 text-emerald-500" />,
      badge: profile.targetBand || undefined,
      isKidDefault: true
    },
    {
      id: 'vocab_quiz',
      label: isKidMode ? '⭐ Fun Word Quiz' : 'Vocab Quiz',
      icon: <Brain className="w-4 h-4 text-indigo-500" />,
      badge: isKidMode ? 'Stars' : `${vocabularyWords.length} Words`,
      isKidDefault: true
    },
    {
      id: 'exam',
      label: isKidMode ? '🎯 Junior Practice Tests' : 'Exam Prep (IELTS/PTE)',
      icon: <Award className="w-4 h-4 text-rose-500" />,
      badge: isKidMode ? 'Junior' : undefined,
      isKidDefault: profile.ageCohort === 'junior' || profile.ageCohort === 'early'
    },
    {
      id: 'badges',
      label: isKidMode ? '🏆 My Stars & Badges' : 'Badges & Honors',
      icon: <Medal className="w-4 h-4 text-amber-500" />,
      badge: `${unlockedBadgesCount}/${badges.length}`,
      isKidDefault: true
    },
    {
      id: 'tutor',
      label: isKidMode ? '🤖 AI Study Buddy' : 'AI Mentor Bridge',
      icon: <Bot className="w-4 h-4 text-blue-500" />,
      badge: isKidMode ? 'Ask AI' : '4 Models',
      isKidDefault: false
    },
    {
      id: 'academic',
      label: isKidMode ? '🔬 Science & Math Fun' : 'STEM Academics',
      icon: <BookOpen className="w-4 h-4 text-purple-500" />,
      isKidDefault: false
    },
    {
      id: 'leaderboard',
      label: isKidMode ? '🏅 Friends & Rankings' : 'Leaderboard & XP',
      icon: <Trophy className="w-4 h-4 text-yellow-500" />,
      isKidDefault: false
    },
    {
      id: 'planner',
      label: isKidMode ? '📅 Daily Schedule' : 'Study Planner',
      icon: <Calendar className="w-4 h-4 text-teal-500" />,
      isKidDefault: false
    },
    {
      id: 'career',
      label: isKidMode ? '💼 Future Dreams' : 'Career & Portfolio',
      icon: <Briefcase className="w-4 h-4 text-slate-500" />,
      isKidDefault: false
    }
  ];

  // Filter tabs according to simplified mode and user's visibleModules preferences
  const visibleTabs = allTabs.filter((t) => {
    // If explicitly disabled in user preferences, hide
    if (visibleConfig[t.id] === false) return false;
    // If explicitly enabled in user preferences, show
    if (visibleConfig[t.id] === true) return true;
    // In simplified kid-friendly mode, show kid defaults
    if (isKidMode) {
      return t.isKidDefault;
    }
    return true;
  });

  // Guarantee activeTab is valid among visibleTabs
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === activeTab) && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs.length, isKidMode, profile.id]);


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
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row md:items-center justify-between gap-2 py-2">
          <nav aria-label="Student Learning Navigation" className="flex space-x-2 sm:space-x-3 overflow-x-auto py-1">
            {visibleTabs.map((tab) => {
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
                      ? isKidMode
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      isActive 
                        ? (isKidMode ? 'bg-amber-700 text-amber-100' : 'bg-indigo-800 text-indigo-100')
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Simplicity Mode Toggle in Navigation */}
          {onToggleSimplifiedInterface && (
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pb-1 md:pb-0">
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleSimplifiedInterface(!isKidMode);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 ${
                  isKidMode
                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={isKidMode ? 'Switch to full interface view' : 'Switch to simple kid-friendly interface'}
              >
                <span>{isKidMode ? '🧸 Mode: Simple' : '⚙️ Mode: Full'}</span>
                <span className="text-[10px] underline text-indigo-600 font-bold">Change</span>
              </button>
            </div>
          )}
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
        {activeTab === 'cohorts' && (
          <UniversalLearningArena
            initialCohort={profile?.ageCohort}
            onOpenResourceVault={onOpenResourceVault}
          />
        )}

        {activeTab === 'solver' && (
          <QuestionSolverView
            onQuestionSolved={(subject) => {
              // Solver question completed cleanly without triggering modal spam
            }}
          />
        )}

        {activeTab === 'language' && (
          <LanguageTree
            units={units}
            profile={profile}
            onStartLesson={onStartLesson}
            onCelebrate={onCelebrate}
          />
        )}

        {activeTab === 'exam' && (
          <ExamPrepView mockTests={mockTests} profile={profile} />
        )}

        {activeTab === 'vocab_quiz' && (
          <VocabularyQuiz
            profile={profile}
            vocabularyWords={vocabularyWords}
            onCompleteQuiz={(score, total, xpEarned) => {
              if (onCelebrate && (score / total) >= 0.8) {
                onCelebrate('daily_goal');
              }
            }}
          />
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

