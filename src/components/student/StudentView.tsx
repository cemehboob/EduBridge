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
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle2,
  Lock,
  Zap,
  Grid,
  Brain,
  Play,
  Volume2,
  Activity
} from 'lucide-react';
import { SpeechService } from '../../services/speechService';
import {
  UserProfile,
  UserAccount,
  UserActivityRecord,
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
import { KidScienceMathFun } from './kids/KidScienceMathFun';
import { KidFriendsRanking } from './kids/KidFriendsRanking';
import { KidDailySchedule } from './kids/KidDailySchedule';
import { KidFutureDreams } from './kids/KidFutureDreams';
import { UniversalLearningArena } from '../cohorts/UniversalLearningArena';
import { QuestionSolverView } from '../solver/QuestionSolverView';
import { ActivityBoardView } from './ActivityBoardView';
import { BadgeService } from '../../services/badgeService';
import { StorageService } from '../../services/storage';
import { sound } from '../../utils/audio';

type StudentTab = 'dashboard' | 'language' | 'cohorts' | 'solver' | 'exam' | 'vocab_quiz' | 'academic' | 'tutor' | 'planner' | 'career' | 'leaderboard' | 'badges';

interface StudentViewProps {
  profile: UserProfile;
  currentUser?: UserAccount | null;
  activities?: UserActivityRecord[];
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
  ieltsUnits?: Unit[];
  onStartLesson: (lesson: Lesson) => void;
  onSendMessage: (msg: ChatMessage) => void;
  onToggleTask: (taskId: string) => void;
  onCompleteRevision: (revId: string) => void;
  onAddTask: (newTask: Omit<DailyTask, 'id' | 'completed'>) => void;
  onUpdateResume: (updated: ResumeData) => void;
  onOpenResourceVault: () => void;
  onCelebrate?: (type: 'daily_goal' | 'streak') => void;
  onToggleSimplifiedInterface?: (simplified: boolean) => void;
  onMarkLessonCompleted?: (lesson: Lesson, score?: number) => void;
  onRecordActivity?: (activity: Omit<UserActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  profile,
  currentUser,
  activities = [],
  units,
  ieltsUnits,
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
  onToggleSimplifiedInterface,
  onMarkLessonCompleted,
  onRecordActivity
}) => {
  const isKidMode = profile.simplifiedInterface !== undefined
    ? profile.simplifiedInterface
    : (profile.ageCohort === 'early' || profile.ageCohort === 'junior');

  const visibleConfig = profile.visibleModules || {};

  // First screen after login is always the comprehensive Activity Board & History Dashboard
  const defaultTab: StudentTab = 'dashboard';
  
  const [activeTab, setActiveTab] = useState<StudentTab>(defaultTab);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [solverInitialQuery, setSolverInitialQuery] = useState<string | undefined>(undefined);
  const [isBadgeGridExpanded, setIsBadgeGridExpanded] = useState(false);

  // Local synchronized user activities feed
  const [localActivities, setLocalActivities] = useState<UserActivityRecord[]>(() => {
    return activities && activities.length > 0 ? activities : StorageService.getUserActivities();
  });

  useEffect(() => {
    if (activities && activities.length > 0) {
      setLocalActivities(activities);
    }
  }, [activities]);

  const recordActivitySafe = (act: Omit<UserActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }) => {
    if (onRecordActivity) {
      onRecordActivity(act);
    } else {
      StorageService.recordUserActivity(act);
    }
    setLocalActivities(StorageService.getUserActivities());
  };

  // Compute live badges for summary showcase
  const badges = BadgeService.computeBadges(profile, vocabularyWords, units, mockTests, 3);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const allTabs: { id: StudentTab; label: string; icon: React.ReactNode; badge?: string; isKidDefault?: boolean }[] = [
    {
      id: 'dashboard',
      label: isKidMode ? '🌟 Activity Board' : 'Activity Board & History',
      icon: <Activity className="w-4 h-4 text-indigo-500" />,
      badge: 'Dashboard',
      isKidDefault: true
    },
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
      isKidDefault: true
    },
    {
      id: 'leaderboard',
      label: isKidMode ? '🏅 Friends & Rankings' : 'Leaderboard & XP',
      icon: <Trophy className="w-4 h-4 text-yellow-500" />,
      isKidDefault: true
    },
    {
      id: 'planner',
      label: isKidMode ? '📅 Daily Schedule' : 'Study Planner',
      icon: <Calendar className="w-4 h-4 text-teal-500" />,
      isKidDefault: true
    },
    {
      id: 'career',
      label: isKidMode ? '💼 Future Dreams' : 'Career & Portfolio',
      icon: <Briefcase className="w-4 h-4 text-slate-500" />,
      isKidDefault: true
    }
  ];

  // Filter tabs according to simplified mode and user's visibleModules preferences
  const visibleTabs = allTabs.filter((t) => {
    // Activity Board Dashboard is the fundamental landing board and always visible
    if (t.id === 'dashboard') return true;
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

  const handleReplayActivity = (activity: UserActivityRecord) => {
    sound.playClick();
    if (activity.type === 'lesson') {
      const allLessons = [
        ...units.flatMap((u) => u.lessons),
        ...(ieltsUnits ? ieltsUnits.flatMap((u) => u.lessons) : [])
      ];
      const match = activity.replayPayload.subId
        ? allLessons.find((l) => l.id === activity.replayPayload.subId)
        : allLessons[0];
      if (match) {
        onStartLesson(match);
        return;
      }
      setActiveTab('language');
    } else if (activity.type === 'solver') {
      if (activity.replayPayload.query) {
        setSolverInitialQuery(activity.replayPayload.query);
      }
      setActiveTab('solver');
    } else if (activity.type === 'mock_test') {
      setActiveTab('exam');
    } else if (activity.type === 'vocab_quiz') {
      setActiveTab('vocab_quiz');
    } else if (activity.type === 'stem_game') {
      setActiveTab('cohorts');
    } else if (activity.type === 'study_task' || activity.type === 'daily_schedule') {
      setActiveTab('planner');
    } else if (activity.type === 'career_cv') {
      setActiveTab('career');
    } else {
      setActiveTab('language');
    }
  };

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

  // Find the first available lesson so a 5-year-old kid can launch with 1 click
  const firstAvailableLesson: Lesson | null = (() => {
    for (const unit of units) {
      if (!unit.locked) {
        const uncompleted = unit.lessons.find((l) => !l.completed);
        if (uncompleted) return uncompleted;
        if (unit.lessons[0]) return unit.lessons[0];
      }
    }
    return units[0]?.lessons[0] || null;
  })();

  return (
    <div className="space-y-6">
      
      {/* Student Sub-Navigation Bar: Streamlined Flex Wrap with Maximum Page Space */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-2.5">
          <nav aria-label="Student Learning Navigation" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? isKidMode
                        ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                        : 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                      : 'text-slate-700 bg-slate-50/80 hover:text-slate-950 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      isActive 
                        ? (isKidMode ? 'bg-amber-700 text-amber-100' : 'bg-indigo-800 text-indigo-100')
                        : 'bg-slate-200/80 text-slate-700'
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
        <div className="w-full px-3 sm:px-4 lg:px-6">
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

      {/* Active Tab View */}
      <main className="w-full px-3 sm:px-4 lg:px-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top & First Page Under Menu: Activity Board & Past/Current History */}
            <ActivityBoardView
              profile={profile}
              currentUser={currentUser || null}
              activities={localActivities}
              onReplayActivity={handleReplayActivity}
              onNavigateTab={(tab) => {
                sound.playClick();
                setActiveTab(tab as StudentTab);
              }}
              isKidMode={isKidMode}
            />

            {/* Rest of all objects under Activity Board & History */}
            <div className="space-y-6 pt-4 border-t border-slate-200">
              {/* 🌟 Kids & Beginners Adventure Hub: What to Do & How to Do It */}
              <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-xs shrink-0 animate-pulse">
                      🌟
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          Start Here! What Should I Do Today?
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-200 text-amber-900">
                          Ages 5+ Easy Guide
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Follow these 4 simple steps to learn, ask questions, collect stars, and win trophies!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        sound.playClick();
                        SpeechService.speak(
                          "Hello little learner! Welcome to EduBridge! Step 1: Click the big green button to start your fun lesson. Step 2: Click the purple button to ask the AI Magic Teacher any question. Step 3: Click the yellow button to play the Word Quiz and collect shiny stars!"
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Listen to spoken instructions"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span>🔊 Read to Me</span>
                    </button>

                    {onToggleSimplifiedInterface && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onToggleSimplifiedInterface(!isKidMode);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
                          isKidMode
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{isKidMode ? '🧸 5-Yr Kid Mode ON' : '🧸 Switch to Kid Mode'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Big Action Cards for 5-Year-Old & Beginner Learners */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Step 1: Play Lesson Journey */}
                  <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all group">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🚀</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Step 1 · Start
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        1. Start Today's Lesson
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Tap here to jump right into your next exciting animated lesson!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        if (firstAvailableLesson) {
                          onStartLesson(firstAvailableLesson);
                        } else {
                          setActiveTab('language');
                        }
                      }}
                      className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>START LESSON NOW (+50 XP)</span>
                    </button>
                  </div>

                  {/* Step 2: Ask AI Question Solver */}
                  <div className="bg-white rounded-2xl p-4 border-2 border-indigo-300 shadow-xs flex flex-col justify-between hover:border-indigo-400 hover:shadow-md transition-all group">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">💡</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          Step 2 · Ask
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                        2. Ask AI Magic Teacher
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Stuck on math, science, or words? Type, speak, or take a picture!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('solver');
                      }}
                      className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>ASK A QUESTION</span>
                    </button>
                  </div>

                  {/* Step 3: Fun Word Quiz */}
                  <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-xs flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all group">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">⭐</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Step 3 · Play
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                        3. Fun Star Quiz
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Answer 5 quick multiple choice questions and win shiny bonus stars!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('vocab_quiz');
                      }}
                      className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>PLAY WORD QUIZ (+20 XP)</span>
                    </button>
                  </div>

                  {/* Step 4: Badges & Trophies */}
                  <div className="bg-white rounded-2xl p-4 border-2 border-rose-300 shadow-xs flex flex-col justify-between hover:border-rose-400 hover:shadow-md transition-all group">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🏆</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Step 4 · Win
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                        4. Open Trophy Box
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        See all the shiny badges, medals, and secret honors you unlocked!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('badges');
                      }}
                      className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Medal className="w-3.5 h-3.5" />
                      <span>MY BADGES ({unlockedBadgesCount} WON)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Activity Heatmap & Streak Counter */}
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
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-200/80 shadow-2xs cursor-pointer"
                      title="View Full Badge Grid"
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
                          {b.unlocked ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              +{b.xpReward} XP
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {b.criteria}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                            <span className={b.unlocked ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                              {b.unlocked ? 'Milestone Completed' : 'Authentic Ingestion Progress'}
                            </span>
                            <span>{b.currentValue} / {b.targetValue} words ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Milestone 2: 7-Day Study Streak */}
                  {(() => {
                    const b = badges.find((x) => x.id === 'badge_streak_7');
                    if (!b) return null;
                    const pct = Math.min(100, Math.round((b.currentValue / b.targetValue) * 100));
                    return (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('badges');
                        }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-sm transition-all cursor-pointer group space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                              <Flame className="w-4 h-4" />
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
                          {b.unlocked ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Day {b.currentValue} / {b.targetValue}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {b.criteria}
                        </p>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                            <span className={b.unlocked ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                              {b.unlocked ? 'Habit Mastered' : 'Consecutive Daily Logins'}
                            </span>
                            <span>{b.currentValue} / {b.targetValue} Days ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Milestone 3: Top 3 Diamond League Leader */}
                  {(() => {
                    const b = badges.find((x) => x.id === 'badge_league_top3');
                    if (!b) return null;
                    return (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('leaderboard');
                        }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-400 bg-gradient-to-br from-white to-rose-50/30 hover:shadow-sm transition-all cursor-pointer group space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
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
          </div>
        )}

        {activeTab === 'cohorts' && (
          <UniversalLearningArena
            initialCohort={profile?.ageCohort}
            onOpenResourceVault={onOpenResourceVault}
          />
        )}

        {activeTab === 'solver' && (
          <QuestionSolverView
            initialQuestion={solverInitialQuery}
            onQuestionSolved={(subject, query, result) => {
              recordActivitySafe({
                userId: currentUser?.id || profile.id,
                userName: currentUser?.name || profile.name,
                type: 'solver',
                title: `Solved ${subject} Question: ${query ? (query.length > 40 ? query.slice(0, 40) + '...' : query) : 'Step-by-step Solution'}`,
                category: `${subject} Solver`,
                score: '100% (Verified)',
                xpEarned: 25,
                status: 'completed',
                details: result?.summary || `Explored cognitive reasoning and human-like step-by-step derivation for ${subject}.`,
                replayPayload: {
                  tab: 'solver',
                  query: query || ''
                }
              });
            }}
          />
        )}

        {activeTab === 'language' && (
          <LanguageTree
            units={units}
            ieltsUnits={ieltsUnits}
            profile={profile}
            onStartLesson={onStartLesson}
            onCelebrate={onCelebrate}
            onMarkLessonCompleted={onMarkLessonCompleted}
          />
        )}

        {activeTab === 'exam' && (
          <ExamPrepView
            mockTests={mockTests}
            profile={profile}
            currentUser={currentUser}
            onRecordActivity={recordActivitySafe}
          />
        )}

        {activeTab === 'vocab_quiz' && (
          <VocabularyQuiz
            profile={profile}
            vocabularyWords={vocabularyWords}
            onCompleteQuiz={(score, total, xpEarned) => {
              // Record authentic quiz conduction and words
              BadgeService.recordQuizAttemptWords(score);
              StorageService.recordTestConduction({
                userEmail: profile.email,
                userName: profile.name,
                userRole: profile.role,
                cohort: profile.ageCohort || 'academy',
                testId: `quiz_${Date.now()}`,
                testTitle: `Vocabulary Mastery Quiz (${score}/${total})`,
                testType: 'VOCAB_QUIZ',
                category: 'Vocabulary Track',
                score: `${score}/${total}`,
                xpEarned,
                status: 'COMPLETED',
                details: `Answered ${score} of ${total} vocabulary quiz words correctly.`
              });
              recordActivitySafe({
                userId: currentUser?.id || profile.id,
                userName: currentUser?.name || profile.name,
                type: 'vocab_quiz',
                title: `Vocabulary Quiz: ${profile.ageCohort || 'Academic'} Lexicon`,
                category: 'Lexicon Vault',
                score: `${score}/${total} (${Math.round((score / total) * 100)}%)`,
                xpEarned,
                status: 'completed',
                details: `Tested on academic vocabulary definitions, contextual synonyms, and usage with ${score} of ${total} correct.`,
                replayPayload: {
                  tab: 'vocab_quiz'
                }
              });
              if (onCelebrate && (score / total) >= 0.8) {
                onCelebrate('daily_goal');
              }
            }}
          />
        )}

        {activeTab === 'academic' && (
          isKidMode ? (
            <KidScienceMathFun
              profile={profile}
              onEarnXp={() => {
                recordActivitySafe({
                  userId: currentUser?.id || profile.id,
                  userName: currentUser?.name || profile.name,
                  type: 'stem_game',
                  title: 'STEM Discovery & Math Fun Challenge',
                  category: 'Science & Math Fun',
                  score: '🌟 100% Star Solver',
                  xpEarned: 25,
                  status: 'completed',
                  details: 'Completed interactive science experiment and math calculation games for youth cohort.',
                  replayPayload: {
                    tab: 'academic'
                  }
                });
                if (onCelebrate) onCelebrate('daily_goal');
              }}
            />
          ) : (
            <AcademicView
              topics={academicTopics}
              onConsultAI={handleConsultAIFromAcademic}
            />
          )
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
          isKidMode ? (
            <KidDailySchedule
              profile={profile}
              onEarnXp={() => {
                recordActivitySafe({
                  userId: currentUser?.id || profile.id,
                  userName: currentUser?.name || profile.name,
                  type: 'daily_schedule',
                  title: 'Completed Daily Routine & Schedule Check-in',
                  category: 'Daily Routine',
                  score: '🌟 Golden Routine Star',
                  xpEarned: 20,
                  status: 'completed',
                  details: 'Completed daily learning habit checklist, bedtime reading, and study routines.',
                  replayPayload: {
                    tab: 'planner'
                  }
                });
                if (onCelebrate) onCelebrate('daily_goal');
              }}
            />
          ) : (
            <StudyPlannerView
              tasks={dailyTasks}
              revisions={revisions}
              profile={profile}
              onToggleTask={(taskId) => {
                onToggleTask(taskId);
                const targetTask = dailyTasks.find((t) => t.id === taskId);
                recordActivitySafe({
                  userId: currentUser?.id || profile.id,
                  userName: currentUser?.name || profile.name,
                  type: 'study_task',
                  title: `Completed Study Task: ${targetTask?.title || 'Daily Goal'}`,
                  category: targetTask?.module || 'Study Habits',
                  score: 'Completed',
                  xpEarned: 15,
                  status: 'completed',
                  details: `Checked off study goal: "${targetTask?.title || 'Daily learning task'}".`,
                  replayPayload: {
                    tab: 'planner'
                  }
                });
              }}
              onCompleteRevision={onCompleteRevision}
              onAddTask={onAddTask}
            />
          )
        )}

        {activeTab === 'career' && (
          isKidMode ? (
            <KidFutureDreams profile={profile} />
          ) : (
            <CareerPortfolioView
              roadmaps={careerRoadmaps}
              resume={resume}
              certificates={certificates}
              onUpdateResume={onUpdateResume}
              onAskCareerAdvisor={handleAskCareerAdvisor}
            />
          )
        )}

        {activeTab === 'leaderboard' && (
          isKidMode ? (
            <KidFriendsRanking profile={profile} />
          ) : (
            <Leaderboard profile={profile} />
          )
        )}

        {activeTab === 'badges' && (
          <BadgeGrid
            profile={profile}
            vocabularyWords={vocabularyWords}
            units={units}
            mockTests={mockTests}
            currentRank={3}
            onCelebrate={onCelebrate}
            onCollapse={() => setActiveTab('language')}
            onNavigateToPractice={() => setActiveTab('vocab_quiz')}
          />
        )}
      </main>

    </div>
  );
};

