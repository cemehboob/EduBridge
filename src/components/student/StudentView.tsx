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
  Sparkles
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
  CertificateItem
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
import { sound } from '../../utils/audio';

type StudentTab = 'language' | 'exam' | 'academic' | 'tutor' | 'planner' | 'career' | 'leaderboard';

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

  const tabs: { id: StudentTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'language', label: 'Language Trees', icon: <TreePine className="w-4 h-4" /> },
    { id: 'exam', label: 'Exam Prep (IELTS/PTE)', icon: <Award className="w-4 h-4" /> },
    { id: 'academic', label: 'STEM Academics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Mentor Bridge', icon: <Bot className="w-4 h-4" />, badge: '4 Models' },
    { id: 'planner', label: 'Study Planner', icon: <Calendar className="w-4 h-4" /> },
    { id: 'career', label: 'Career & Portfolio', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard & XP', icon: <Trophy className="w-4 h-4" /> }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StreakCounter
          profile={profile}
          onCelebrate={onCelebrate ? () => onCelebrate('streak') : undefined}
        />
      </div>

      {/* Active Tab View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </main>

    </div>
  );
};
