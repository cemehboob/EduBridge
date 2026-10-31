/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Lesson, ChatMessage, DailyTask, ResumeData, QuestionBankItem, CourseAssignment } from './types';
import { StorageService } from './services/storage';
import { systemMetrics } from './data/initialData';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { StudentView } from './components/student/StudentView';
import { ParentPortal } from './components/parent/ParentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ExerciseModal } from './components/common/ExerciseModal';
import { OfflineSyncModal } from './components/common/OfflineSyncModal';
import { CelebrationModal, CelebrationType } from './components/student/CelebrationModal';
import { triggerCelebration } from './utils/celebration';

export default function App() {
  // Global ecosystem state with offline persistence
  const [profile, setProfile] = useState(() => StorageService.getProfile());
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [celebrationModal, setCelebrationModal] = useState<{
    type: CelebrationType;
    title: string;
    subtitle: string;
  } | null>(null);
  const [units, setUnits] = useState(() => StorageService.getUnits());
  const [mockTests, setMockTests] = useState(() => StorageService.getMockTests());
  const [academicTopics, setAcademicTopics] = useState(() => StorageService.getAcademicTopics());
  const [ollamaModels, setOllamaModels] = useState(() => StorageService.getOllamaModels());
  const [chatMessages, setChatMessages] = useState(() => StorageService.getChatMessages());
  const [dailyTasks, setDailyTasks] = useState(() => StorageService.getDailyTasks());
  const [revisions, setRevisions] = useState(() => StorageService.getRevisions());
  const [careerRoadmaps, setCareerRoadmaps] = useState(() => StorageService.getCareerRoadmaps());
  const [resume, setResume] = useState(() => StorageService.getResume());
  const [certificates, setCertificates] = useState(() => StorageService.getCertificates());
  const [childProgress, setChildProgress] = useState(() => StorageService.getChildProgress());
  const [assignments, setAssignments] = useState(() => StorageService.getAssignments());
  const [questionBank, setQuestionBank] = useState(() => StorageService.getQuestionBank());
  const [auditLogs, setAuditLogs] = useState(() => StorageService.getAuditLogs());

  // Interactive Exercise runner state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Sync / Offline Modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Online / Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync sound toggle to sound engine
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
    if (nextState) sound.playClick();
  };

  // Reload state after backup import
  const refreshAllStateFromStorage = () => {
    setProfile(StorageService.getProfile());
    setUnits(StorageService.getUnits());
    setMockTests(StorageService.getMockTests());
    setAcademicTopics(StorageService.getAcademicTopics());
    setCareerRoadmaps(StorageService.getCareerRoadmaps());
    setResume(StorageService.getResume());
    setCertificates(StorageService.getCertificates());
    setDailyTasks(StorageService.getDailyTasks());
    setRevisions(StorageService.getRevisions());
  };

  // Lesson handlers
  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleCompleteLesson = (xpEarned: number, score: number) => {
    if (!activeLesson) return;

    // Update lesson status in units
    const updatedUnits = units.map((u) => ({
      ...u,
      lessons: u.lessons.map((l) =>
        l.id === activeLesson.id ? { ...l, completed: true, score } : l
      )
    }));

    setUnits(updatedUnits);
    StorageService.saveUnits(updatedUnits);

    // Update profile XP & streak
    const wasGoalReachedBefore = profile.todayXp >= profile.dailyGoalXp;
    const newTodayXp = profile.todayXp + xpEarned;
    const newTotalXp = profile.xp + xpEarned;
    const isGoalReachedNow = newTodayXp >= profile.dailyGoalXp;

    const updatedProfile = {
      ...profile,
      todayXp: newTodayXp,
      xp: newTotalXp
    };
    setProfile(updatedProfile);
    StorageService.saveProfile(updatedProfile);

    // Update child progress log for Parent Portal
    const updatedProgress = {
      ...childProgress,
      xpEarnedThisWeek: childProgress.xpEarnedThisWeek + xpEarned,
      weeklyHours: Number((childProgress.weeklyHours + 0.5).toFixed(1)),
      recentActivities: [
        {
          timestamp: 'Just now',
          activity: `Completed: ${activeLesson.title}`,
          result: `+${xpEarned} XP (${score}% Score)`
        },
        ...childProgress.recentActivities.slice(0, 4)
      ]
    };
    setChildProgress(updatedProgress);
    StorageService.saveChildProgress(updatedProgress);

    setActiveLesson(null);

    // Celebratory Confetti Animation triggers
    if (!wasGoalReachedBefore && isGoalReachedNow) {
      // User just crossed their Daily XP Goal!
      triggerCelebration('daily_goal');
      setCelebrationModal({
        type: 'goal_reached',
        title: 'Daily XP Goal Reached! 🎉',
        subtitle: `You earned ${newTodayXp} of ${profile.dailyGoalXp} XP today! Your daily learning goal is 100% complete and your streak is locked in.`
      });
    } else {
      // User completed a daily lesson maintaining their streak
      triggerCelebration('streak');
      setCelebrationModal({
        type: 'streak_completed',
        title: `Day ${profile.currentStreak} Streak Maintained! 🔥`,
        subtitle: `Awesome work completing "${activeLesson.title}"! Your daily habit momentum continues to grow.`
      });
    }
  };

  // Chat messages handler
  const handleSendMessage = (msg: ChatMessage) => {
    const updated = [...chatMessages, msg];
    setChatMessages(updated);
    StorageService.saveChatMessages(updated);
  };

  // Study planner handlers
  const handleToggleDailyTask = (taskId: string) => {
    const updated = dailyTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setDailyTasks(updated);
    StorageService.saveDailyTasks(updated);
  };

  const handleCompleteRevision = (revId: string) => {
    const updated = revisions.map((r) =>
      r.id === revId
        ? {
            ...r,
            retentionScore: 98,
            isOverdue: false,
            dueDate: 'In 7 days'
          }
        : r
    );
    setRevisions(updated);
    StorageService.saveRevisions(updated);
  };

  const handleAddTask = (newTask: Omit<DailyTask, 'id' | 'completed'>) => {
    const task: DailyTask = {
      ...newTask,
      id: `task_${Date.now()}`,
      completed: false
    };
    const updated = [task, ...dailyTasks];
    setDailyTasks(updated);
    StorageService.saveDailyTasks(updated);
  };

  // Resume handler
  const handleUpdateResume = (updated: ResumeData) => {
    setResume(updated);
    StorageService.saveResume(updated);
  };

  // Admin handlers
  const handleToggleModelStatus = (modelId: string) => {
    const updated = ollamaModels.map((m) =>
      m.id === modelId ? { ...m, status: m.status === 'online' ? ('standby' as const) : ('online' as const) } : m
    );
    setOllamaModels(updated);
    StorageService.saveOllamaModels(updated);
  };

  const handleUpdateModelTemp = (modelId: string, temp: number) => {
    const updated = ollamaModels.map((m) =>
      m.id === modelId ? { ...m, temperature: temp } : m
    );
    setOllamaModels(updated);
    StorageService.saveOllamaModels(updated);
  };

  // Teacher handlers
  const handleAddQuestion = (q: QuestionBankItem) => {
    const updated = [q, ...questionBank];
    setQuestionBank(updated);
    StorageService.saveQuestionBank(updated);
  };

  const handleAddAssignment = (a: CourseAssignment) => {
    const updated = [a, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        profile={profile}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isOnline={isOnline}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onCelebrateStreak={() => {
          triggerCelebration('streak');
          setCelebrationModal({
            type: 'streak_completed',
            title: `${profile.currentStreak}-Day Streak Active! 🔥`,
            subtitle: 'Your daily learning habit is unbroken. Keep crushing your goals!'
          });
        }}
      />

      {/* Main Content View by Role */}
      <div className="flex-1 py-4 sm:py-6">
        {activeRole === 'student' && (
          <StudentView
            profile={profile}
            units={units}
            mockTests={mockTests}
            academicTopics={academicTopics}
            ollamaModels={ollamaModels}
            chatMessages={chatMessages}
            dailyTasks={dailyTasks}
            revisions={revisions}
            careerRoadmaps={careerRoadmaps}
            resume={resume}
            certificates={certificates}
            onStartLesson={handleStartLesson}
            onSendMessage={handleSendMessage}
            onToggleTask={handleToggleDailyTask}
            onCompleteRevision={handleCompleteRevision}
            onAddTask={handleAddTask}
            onUpdateResume={handleUpdateResume}
            onCelebrate={(type) => {
              triggerCelebration(type);
              setCelebrationModal({
                type: type === 'daily_goal' ? 'goal_reached' : 'streak_completed',
                title: type === 'daily_goal' ? 'Daily XP Goal Reached! 🎉' : `${profile.currentStreak}-Day Streak Milestone! 🔥`,
                subtitle: type === 'daily_goal'
                  ? `You earned ${profile.todayXp} of ${profile.dailyGoalXp} XP today!`
                  : `Day ${profile.currentStreak} completed. Your habit consistency is world-class!`
              });
            }}
          />
        )}

        {activeRole === 'parent' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ParentPortal progress={childProgress} />
          </main>
        )}

        {activeRole === 'teacher' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TeacherPortal
              assignments={assignments}
              questionBank={questionBank}
              onAddQuestion={handleAddQuestion}
              onAddAssignment={handleAddAssignment}
            />
          </main>
        )}

        {activeRole === 'admin' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdminPortal
              models={ollamaModels}
              metrics={systemMetrics}
              auditLogs={auditLogs}
              onToggleModelStatus={handleToggleModelStatus}
              onUpdateModelTemp={handleUpdateModelTemp}
            />
          </main>
        )}
      </div>

      {/* Interactive Duolingo-style Exercise Modal */}
      {activeLesson && (
        <ExerciseModal
          lesson={activeLesson}
          initialHearts={profile.hearts}
          onClose={() => setActiveLesson(null)}
          onComplete={handleCompleteLesson}
        />
      )}

      {/* Offline Storage & Backup Modal */}
      <OfflineSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        isOnline={isOnline}
        onDataImported={refreshAllStateFromStorage}
      />

      {/* Milestone Celebration Confetti Modal */}
      {celebrationModal && (
        <CelebrationModal
          type={celebrationModal.type}
          title={celebrationModal.title}
          subtitle={celebrationModal.subtitle}
          xpEarnedToday={profile.todayXp}
          goalXp={profile.dailyGoalXp}
          streakDays={profile.currentStreak}
          onClose={() => setCelebrationModal(null)}
        />
      )}

    </div>
  );
}
