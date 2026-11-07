/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * EduBridge Enterprise Core Architecture
 * PLATFORM: Web Application Only (Desktop & Responsive Web Browser)
 * NOTE: All mobileApp native wrappers, Capacitor/Cordova plugins, and mobile-only bridges
 * are deferred and commented out until the complete web application is verified and operational.
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Lesson,
  ChatMessage,
  DailyTask,
  ResumeData,
  QuestionBankItem,
  CourseAssignment,
  AuditLog,
  UserAccount,
  FeatureFlag,
  UserFeedbackTicket,
  UserGuideArticle,
  FontScale,
  AgeCohortId,
  UserActivityRecord
} from './types';
import { StorageService } from './services/storage';
import { systemMetrics } from './data/initialData';
import { cohortQuizQuestions } from './data/cohortQuizzesData';
import { sound } from './utils/audio';
import { userAccountToProfile, calculateCohortFromDob, calculateEducationLevel } from './utils/userProfile';

import { Header } from './components/Header';
import { HomePage } from './components/home/HomePage';
import { StudentView, StudentTab } from './components/student/StudentView';
import { AIService } from './services/aiService';
import { apiService } from './services/apiService';
import { ParentPortal } from './components/parent/ParentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ExerciseModal } from './components/common/ExerciseModal';
import { OfflineSyncModal } from './components/common/OfflineSyncModal';
import { CelebrationModal, CelebrationType } from './components/student/CelebrationModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { UserGuideModal } from './components/guide/UserGuideModal';
import { ResourceVaultModal } from './components/cohorts/ResourceVaultModal';
import { triggerCelebration } from './utils/celebration';
import { generateFivePracticeTestsBatch, generateOneHundredWordsBatch, generatePracticeTestsBatch } from './services/scheduleJobService';
import { IngestedItemRecord } from './types';
import { applyThemeToDom } from './utils/themeManager';

export default function App() {
  // Global ecosystem state with offline persistence
  const [users, setUsers] = useState<UserAccount[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return StorageService.getActiveUser();
  });
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(() => StorageService.getFeatureFlags());
  const [feedbackTickets, setFeedbackTickets] = useState<UserFeedbackTicket[]>(() => StorageService.getFeedbackTickets());
  const [userGuideArticles] = useState<UserGuideArticle[]>(() => StorageService.getUserGuideArticles());

  // Modals for User Management, Feedback & Windows Guide
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isResourceVaultOpen, setIsResourceVaultOpen] = useState(false);

  // Dynamic Font Scaler (Accessibility First from AspireFree.md)
  const [fontScale, setFontScale] = useState<FontScale>(() => StorageService.getFontScale());

  // Apply Font Scaler class to documentElement
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('font-scale-standard', 'font-scale-large', 'font-scale-xlarge');
      document.documentElement.classList.add(`font-scale-${fontScale}`);
      StorageService.saveFontScale(fontScale);
    }
  }, [fontScale]);

  // Apply User Color Scheme & Theme Template (Accessibility & Customization)
  useEffect(() => {
    const activeScheme = currentUser?.preferences.colorScheme || StorageService.getColorScheme();
    applyThemeToDom(activeScheme);
  }, [currentUser]);

  // Central Server Cross-Device Synchronization & Persistent Session Establishment
  useEffect(() => {
    let isMounted = true;

    // 1. Authoritative session token establishment for active user
    if (currentUser) {
      apiService.auth.ensureSession(currentUser);
      try {
        localStorage.setItem('edubridge_active_user_id', currentUser.id);
      } catch {}
    }

    // 2. Initial flush of pending offline queue and pull latest activities from central server
    const executeSync = async () => {
      try {
        await StorageService.flushPendingSyncQueue();
        const res = await apiService.activities.getAll();
        if (isMounted && res && Array.isArray(res.items)) {
          setActivities(res.items);
          StorageService.saveUserActivities(res.items);
        }
        await StorageService.syncConfigurationsFromCloud();
        await StorageService.syncTestsFromCloud();

        // 3. Sync users from central database across all connected machines
        try {
          const remoteUsers = await apiService.users.getAll();
          if (isMounted && remoteUsers && remoteUsers.length > 0) {
            setUsers(remoteUsers);
            StorageService.saveUsers(remoteUsers);
          }
        } catch {}

        if (isMounted) {
          setFeatureFlags(StorageService.getFeatureFlags());
          setMockTests(StorageService.getMockTests());
        }
      } catch {
        // Background sync
      }
    };
    executeSync();

    // 3. Periodic Cross-Machine Poller (runs every 4 seconds)
    const syncInterval = setInterval(executeSync, 4000);

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
    };
  }, [currentUser?.id]);

  const [profile, setProfile] = useState(() => StorageService.getProfile());
  const [activeRole, setActiveRole] = useState<UserRole>(() => currentUser?.role || 'student');
  const [celebrationModal, setCelebrationModal] = useState<{
    type: CelebrationType;
    title: string;
    subtitle: string;
  } | null>(null);
  const [units, setUnits] = useState(() => StorageService.getUnits());
  const [ieltsUnits, setIeltsUnits] = useState(() => StorageService.getIeltsUnits());
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
  const [scheduledJobs, setScheduledJobs] = useState(() => StorageService.getScheduledJobs());
  const [vocabularyWords, setVocabularyWords] = useState(() => StorageService.getVocabularyWords());
  const [ingestedLedger, setIngestedLedger] = useState<IngestedItemRecord[]>(() => StorageService.getIngestedItemsLedger());
  const [activities, setActivities] = useState<UserActivityRecord[]>(() => StorageService.getUserActivities());

  // Interactive Exercise runner state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Active Student Tab & Global Home Navigation
  const [studentTab, setStudentTab] = useState<StudentTab>('dashboard');
  const [homeResetKey, setHomeResetKey] = useState<number>(0);

  // Stop any active test/practice/quiz/speech and route directly to homepage
  const handleNavigateHome = () => {
    sound.playClick();

    // 1. Immediately stop any active audio / speech recitation
    AIService.stopSpeaking();

    // 2. Stop/abort any running interactive lesson or exercise modal
    setActiveLesson(null);

    // 3. Dismiss all overlays/modals
    setIsSyncModalOpen(false);
    setIsAuthModalOpen(false);
    setIsProfileModalOpen(false);
    setIsFeedbackModalOpen(false);
    setIsGuideModalOpen(false);
    setIsResourceVaultOpen(false);
    setCelebrationModal(null);

    // 4. Reset role to 'student' (the primary learner portal) and route to 'dashboard'
    if (!isUserAdmin || activeRole === 'student') {
      setActiveRole('student');
    }
    setStudentTab('dashboard');

    // 5. Trigger full reset signal to abort any ongoing test/mock/quiz sessions
    setHomeResetKey((prev) => prev + 1);
  };

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
    setIeltsUnits(StorageService.getIeltsUnits());
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

    const isIelts =
      activeLesson.id.startsWith('ielts_') ||
      ieltsUnits.some((u) => u.lessons.some((l) => l.id === activeLesson.id));

    if (isIelts) {
      const updatedIelts = ieltsUnits.map((u) => {
        const hasLesson = u.lessons.some((l) => l.id === activeLesson.id);
        if (!hasLesson) return u;
        return {
          ...u,
          lessons: u.lessons.map((l) =>
            l.id === activeLesson.id ? { ...l, completed: true, score } : l
          )
        };
      });

      const finalIelts = updatedIelts.map((u, idx, arr) => {
        if (idx > 0 && arr[idx - 1].lessons.every((l) => l.completed)) {
          return { ...u, locked: false };
        }
        return u;
      });

      setIeltsUnits(finalIelts);
      StorageService.saveIeltsUnits(finalIelts);
    } else {
      const updatedUnits = units.map((u) => {
        const hasLesson = u.lessons.some((l) => l.id === activeLesson.id);
        if (!hasLesson) return u;
        return {
          ...u,
          lessons: u.lessons.map((l) =>
            l.id === activeLesson.id ? { ...l, completed: true, score } : l
          )
        };
      });

      const finalUnits = updatedUnits.map((u, idx, arr) => {
        if (idx > 0 && arr[idx - 1].lessons.every((l) => l.completed)) {
          return { ...u, locked: false };
        }
        return u;
      });

      setUnits(finalUnits);
      StorageService.saveUnits(finalUnits);
    }

    // Officially record verified test conduction log
    StorageService.recordTestConduction({
      userEmail: profile.email,
      userName: profile.name,
      userRole: profile.role,
      cohort: profile.ageCohort || 'academy',
      testType: 'LESSON_UNIT',
      testId: activeLesson.id,
      testTitle: activeLesson.title,
      category: isIelts ? 'IELTS Academic Track (Band 8.0+)' : 'Spanish Language Track',
      score: `${score}%`,
      xpEarned,
      status: 'COMPLETED',
      details: `Completed interactive exercises with ${score}% proficiency.`
    });

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

    // Record activity to user activity history board
    handleRecordActivity({
      userId: currentUser?.id || 'usr_student_01',
      userName: currentUser?.name || profile.name,
      type: 'lesson',
      title: `Completed Lesson: ${activeLesson.title}`,
      category: isIelts ? 'IELTS Academic' : 'Language Arts',
      score: `${score}%`,
      xpEarned,
      status: 'completed',
      details: `Achieved ${score}% accuracy in ${activeLesson.title} and earned +${xpEarned} XP.`,
      replayPayload: {
        tab: 'language',
        subId: activeLesson.id
      }
    });

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

  const handleMarkLessonCompleted = (lesson: Lesson, score = 95) => {
    setActiveLesson(lesson);
    setTimeout(() => {
      handleCompleteLesson(lesson.xpReward, score);
    }, 40);
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

  // Scheduled Jobs handlers
  const handleToggleJob = (jobId: string) => {
    const updated = scheduledJobs.map((j) =>
      j.id === jobId ? { ...j, enabled: !j.enabled } : j
    );
    setScheduledJobs(updated);
    StorageService.saveScheduledJobs(updated);

    const targetJob = scheduledJobs.find((j) => j.id === jobId);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'admin@edubridge.org',
      action: `ADMIN_CRON_TOGGLE: ${targetJob?.name} set to ${!targetJob?.enabled ? 'ACTIVE' : 'PAUSED'}`,
      category: 'DATABASE_SYNC',
      status: 'INFO'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleRunScheduledJob = async (jobId: string) => {
    // 1. Trigger centralized database job execution directly in Neon Postgres
    try {
      await apiService.jobs.run(jobId);
    } catch (e: any) {
      console.warn('[EduBridge Database Job Execution Note]', e.message);
    }

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (jobId === 'job_exam_midnight_00') {
      // Generate at least 5 complete daily mock tests covering PTE, TOEFL, OET, DET, and Cambridge English
      const newMockTests = generateFivePracticeTestsBatch(Math.floor(mockTests.length / 5) + 1, timestamp);
      const updatedTests = [...mockTests, ...newMockTests];
      setMockTests(updatedTests);
      StorageService.saveMockTests(updatedTests);

      // Persist newly added mock tests to standard_tests database table
      for (const t of newMockTests) {
        apiService.tests.save(t).catch(() => {});
      }

      // Secondly: Multi-exam test generator adds practice tests as well!
      const newPracticeTests = generatePracticeTestsBatch(Math.floor(mockTests.length / 5) + 1, timestamp);
      const existingPracticeTests = StorageService.getPracticeTests();
      const updatedPracticeTests = [...newPracticeTests, ...existingPracticeTests];
      StorageService.savePracticeTests(updatedPracticeTests);

      // Persist newly added practice tests to standard_tests database table
      for (const pt of newPracticeTests) {
        apiService.tests.save(pt).catch(() => {});
      }

      // Record items into the Ingested Items Ledger with timestamp columns
      const currentLedger = StorageService.getIngestedItemsLedger();
      const newLedgerRecords: IngestedItemRecord[] = [
        ...newMockTests.map((t, idx) => ({
          id: `ing_mock_${Date.now()}_${idx}`,
          timestamp,
          jobId: 'job_exam_midnight_00',
          jobName: 'Nightly 00:00 Multi-Exam Test Generator',
          itemType: 'Mock Test' as const,
          itemTitle: t.title,
          categoryOrExam: t.exam,
          details: `${t.sections.length} Sections (${t.sections.map((s) => s.name).join(', ')}) · ${t.totalDurationMin} min`
        })),
        ...newPracticeTests.map((pt, idx) => ({
          id: `ing_pt_${Date.now()}_${idx}`,
          timestamp,
          jobId: 'job_exam_midnight_00',
          jobName: 'Nightly 00:00 Multi-Exam Test Generator',
          itemType: 'Practice Test' as const,
          itemTitle: pt.title,
          categoryOrExam: `${pt.category} (${pt.module})`,
          details: `${pt.difficulty} · ${pt.durationMinutes} min · Verified Answers & Explanations`
        }))
      ];
      const updatedLedger = [...newLedgerRecords, ...currentLedger];
      setIngestedLedger(updatedLedger);
      StorageService.saveIngestedItemsLedger(updatedLedger);

      const totalNewItems = newMockTests.length + newPracticeTests.length;
      const updatedJobs = scheduledJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              itemsGeneratedCount: j.itemsGeneratedCount + totalNewItems,
              lastRunTimestamp: `Last executed: ${timestamp}`,
              status: 'completed' as const
            }
          : j
      );
      setScheduledJobs(updatedJobs);
      StorageService.saveScheduledJobs(updatedJobs);

      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp,
        user: 'cron_worker_00',
        action: `CRON_SCHEDULE_EXECUTE: Added ${newMockTests.length} mock tests and ${newPracticeTests.length} practice tests across PTE, TOEFL, OET, DET & Cambridge English to database`,
        category: 'EXAM_EVAL',
        status: 'SUCCESS'
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      StorageService.saveAuditLogs(updatedLogs);
    } else if (jobId === 'job_vocab_expansion_00') {
      // Generate at least 100 rich vocabulary words with phonetics and CEFR levels
      const newWords = generateOneHundredWordsBatch(Math.floor(vocabularyWords.length / 100) + 1, timestamp);
      const updatedWords = [...vocabularyWords, ...newWords];
      setVocabularyWords(updatedWords);
      StorageService.saveVocabularyWords(updatedWords);

      // Convert vocabulary words into interactive cohort quizzes with authentic distractors and randomized options
      const newQuizzes = newWords.slice(0, 10).map((w, idx) => {
        const otherWords = newWords.filter((ow) => ow.word !== w.word && ow.definition !== w.definition);
        const distractorPool = otherWords.map((ow) => ow.definition);
        const chosenDistractors = distractorPool.slice(0, 3);
        if (chosenDistractors.length < 3) {
          chosenDistractors.push(
            `A provisional methodology distinct from ${w.word.toLowerCase()}`,
            `An unverified computational simulation parameter`,
            `A non-standard linguistic deviation`
          );
        }

        const rawOptions = [w.definition, ...chosenDistractors.slice(0, 3)];
        const shuffled = [...rawOptions];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled[0] === w.definition && shuffled.length > 1) {
          const targetIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
          [shuffled[0], shuffled[targetIdx]] = [shuffled[targetIdx], shuffled[0]];
        }

        return {
          id: `quiz_vocab_${w.id}_${Date.now()}_${idx}`,
          cohort: (w.cefrLevel === 'C2' ? 'senior' : w.cefrLevel === 'C1' ? 'pro' : w.cefrLevel === 'B2' ? 'academy' : 'junior') as AgeCohortId,
          educationLevel: w.cefrLevel === 'C2' ? 'Graduate & Professional' : w.cefrLevel === 'C1' ? 'College & University' : 'High School',
          category: w.category,
          word: w.word,
          phonetic: w.phonetic,
          prompt: `Select the precise definition of "${w.word}" (${w.phonetic}):`,
          options: shuffled,
          correctAnswer: w.definition,
          explanation: `"${w.word}" (${w.partOfSpeech}): ${w.definition} Example: "${w.exampleSentence}"`,
          audioPrompt: `Define ${w.word}`,
          praise: `Great job mastering "${w.word}"!`
        };
      });
      apiService.quizzes.saveBatch(newQuizzes).catch(() => {});

      // Record items into the Ingested Items Ledger with timestamp columns
      const currentLedger = StorageService.getIngestedItemsLedger();
      const newLedgerRecords: IngestedItemRecord[] = newWords.slice(0, 10).map((w, idx) => ({
        id: `ing_word_${Date.now()}_${idx}`,
        timestamp,
        jobId: 'job_vocab_expansion_00',
        jobName: 'Nightly Vocabulary Vault Expansion',
        itemType: 'Vocabulary Word' as const,
        itemTitle: `${w.word} (${w.phonetic})`,
        categoryOrExam: `${w.category} (CEFR ${w.cefrLevel})`,
        details: w.definition
      }));
      const updatedLedger = [...newLedgerRecords, ...currentLedger];
      setIngestedLedger(updatedLedger);
      StorageService.saveIngestedItemsLedger(updatedLedger);

      const updatedJobs = scheduledJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              itemsGeneratedCount: j.itemsGeneratedCount + newWords.length,
              lastRunTimestamp: `Last executed: ${timestamp}`,
              status: 'completed' as const
            }
          : j
      );
      setScheduledJobs(updatedJobs);
      StorageService.saveScheduledJobs(updatedJobs);

      const newLog: AuditLog = {
        id: `log_${Date.now()}`,
        timestamp,
        user: 'cron_worker_00',
        action: `CRON_SCHEDULE_EXECUTE: Added ${newWords.length} new vocabulary words and interactive quizzes to database`,
        category: 'DATABASE_SYNC',
        status: 'SUCCESS'
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      StorageService.saveAuditLogs(updatedLogs);
    } else if (jobId === 'job_quiz_generation_00') {
      const cohorts: AgeCohortId[] = ['early', 'junior', 'academy', 'pro', 'senior'];
      const newQuizzes: any[] = [];
      for (const c of cohorts) {
        const pool = cohortQuizQuestions.filter((q) => q.cohort === c);
        const chosen = pool.slice(0, 2);
        for (const baseQ of chosen) {
          const shuffled = [...baseQ.options];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          newQuizzes.push({
            ...baseQ,
            id: `quiz_daily_${c}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            options: shuffled
          });
        }
      }
      apiService.quizzes.saveBatch(newQuizzes).catch(() => {});

      const updatedJobs = scheduledJobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              itemsGeneratedCount: j.itemsGeneratedCount + newQuizzes.length,
              lastRunTimestamp: `Last executed: ${timestamp}`,
              status: 'completed' as const
            }
          : j
      );
      setScheduledJobs(updatedJobs);
      StorageService.saveScheduledJobs(updatedJobs);
    }
  };

  // Automated background scheduler runner: automatically executes daily midnight jobs on app startup & midnight rollover
  useEffect(() => {
    let timerId: any = null;
    const checkAndAutoRunScheduledJobs = async () => {
      const todayDate = new Date().toISOString().slice(0, 10);
      const jobs = StorageService.getScheduledJobs();

      for (const job of jobs) {
        if (!job.enabled) continue;
        const lastDate = job.lastRunTimestamp?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
        if (!lastDate || lastDate < todayDate || job.lastRunTimestamp?.includes('2026-10-31')) {
          console.log(`[EduBridge Scheduler] Auto-running due daily job on deployment: ${job.name}`);
          try {
            await handleRunScheduledJob(job.id);
          } catch (e: any) {
            console.warn('[EduBridge Scheduler] Auto-run notice:', e.message);
          }
        }
      }
    };

    // Execute check on application mount
    checkAndAutoRunScheduledJobs();

    // Check periodically every 60 seconds for midnight UTC rollover
    timerId = setInterval(checkAndAutoRunScheduledJobs, 60000);
    return () => clearInterval(timerId);
  }, []);

  // Centralized User Activation & Synchronization Handler
  const activateUser = (user: UserAccount, isNewRegistration = false) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updatedUser: UserAccount = {
      ...user,
      lastLoginAt: timestamp
    };

    // Update or insert into users list
    const updatedUsers = users.some((u) => u.id === user.id)
      ? users.map((u) => (u.id === user.id ? updatedUser : u))
      : [updatedUser, ...users];

    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    // Set active user credentials
    setCurrentUser(updatedUser);
    StorageService.setActiveUser(updatedUser.id);

    // Synchronize complete learning history from server (supports cross-device & cache clear restoration)
    StorageService.syncUserFromServer(updatedUser.id).catch(() => {});

    // Derive complete, isolated UserProfile for the new user
    const newProfile = userAccountToProfile(updatedUser);
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);

    // Switch view role to newly connected user's authorized role
    setActiveRole(updatedUser.role);

    // Synchronize Font Scale preferences (e.g. Senior gets xlarge by default)
    const newScale: FontScale =
      updatedUser.preferences.fontScale || (newProfile.ageCohort === 'senior' ? 'xlarge' : 'standard');
    setFontScale(newScale);
    StorageService.saveFontScale(newScale);

    // Synchronize Active Age Cohort
    StorageService.saveActiveCohort(newProfile.ageCohort || 'academy');

    // Synchronize Sound effects preference
    const soundPref = updatedUser.preferences.soundEnabled ?? true;
    setSoundEnabled(soundPref);
    sound.enabled = soundPref;

    // Close Auth modal
    setIsAuthModalOpen(false);

    // Record user login activity in central database activities table for live multi-machine admin visibility
    StorageService.recordUserActivity({
      userId: updatedUser.id,
      userName: updatedUser.name,
      userRole: updatedUser.role,
      cohort: updatedUser.cohort || 'academy',
      type: 'auth' as any,
      category: 'auth',
      action: isNewRegistration
        ? `Registered and joined EduBridge (${updatedUser.role.toUpperCase()})`
        : `Logged in to EduBridge (${updatedUser.role.toUpperCase()})`,
      title: `${updatedUser.name} Logged In`,
      module: 'Authentication',
      status: 'completed',
      score: 'Online',
      details: `${updatedUser.name} (${updatedUser.email}) authenticated as ${updatedUser.role.toUpperCase()}. User is active on the platform.`,
      relativeTime: 'Just now'
    });

    // Append Audit Trail
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: updatedUser.email,
      action: isNewRegistration
        ? `USER_REGISTERED: New account provisioned for ${updatedUser.name} (${updatedUser.role}) with cohort '${newProfile.ageCohort}'`
        : `USER_AUTHENTICATED: Switched active user to ${updatedUser.name} (${updatedUser.role}, ${newProfile.educationLevel})`,
      category: 'AUTH',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  // User Management & RBAC Handlers
  const handleLogin = (user: UserAccount) => {
    activateUser(user, false);
  };

  const handleRegister = (newUser: UserAccount) => {
    activateUser(newUser, true);
  };

  const handleLogout = () => {
    if (currentUser) {
      StorageService.recordUserActivity({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        cohort: currentUser.cohort || 'academy',
        type: 'auth' as any,
        category: 'auth',
        action: `Logged out of EduBridge (${currentUser.role.toUpperCase()})`,
        title: `${currentUser.name} Logged Out`,
        module: 'Authentication',
        status: 'completed',
        score: 'Offline',
        details: `${currentUser.name} (${currentUser.email}) logged out of session.`,
        relativeTime: 'Just now'
      });
      apiService.auth.logout().catch(() => {});
    }
    StorageService.setActiveUser(null);
    setCurrentUser(null);
    AIService.stopSpeaking();
    setActiveLesson(null);
  };

  const handleUpdateCurrentUser = (updatedUser: UserAccount) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    StorageService.saveUsers(updated);
    setCurrentUser(updatedUser);

    const newProfile = userAccountToProfile(updatedUser);
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);

    if (updatedUser.preferences.fontScale) {
      setFontScale(updatedUser.preferences.fontScale);
      StorageService.saveFontScale(updatedUser.preferences.fontScale);
    }
    if (updatedUser.preferences.ageCohort) {
      StorageService.saveActiveCohort(updatedUser.preferences.ageCohort);
    }
    if (updatedUser.preferences.colorScheme) {
      applyThemeToDom(updatedUser.preferences.colorScheme);
      StorageService.saveColorScheme(updatedUser.preferences.colorScheme);
    }
  };

  const handleToggleSimplifiedInterface = (simplified: boolean) => {
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          simplifiedInterface: simplified
        }
      };
      handleUpdateCurrentUser(updatedUser);
    } else {
      setProfile((prev) => ({ ...prev, simplifiedInterface: simplified }));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? ('disabled' as const) : ('active' as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    StorageService.saveUsers(updated);

    const targetUser = users.find((u) => u.id === userId);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `RBAC_STATUS_CHANGE: Toggled account status for ${targetUser?.name || userId}`,
      category: 'RBAC_CHANGE',
      status: 'INFO'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleAddUser = async (newUser: UserAccount) => {
    let savedUser = newUser;
    try {
      // Create user directly at the Neon Postgres database level
      savedUser = await apiService.users.create(newUser);
    } catch (err: any) {
      console.warn('[User DB Creation Fallback]', err.message);
    }

    const updated = [savedUser, ...users.filter((u) => u.id !== newUser.id)];
    setUsers(updated);
    StorageService.saveUsers(updated);

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `USER_PROVISIONED: Admin created user account ${savedUser.email} with role '${savedUser.role}' in database`,
      category: 'RBAC_CHANGE',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleAdminUpdateUser = async (updatedUser: UserAccount) => {
    try {
      // Update user directly at the Neon Postgres database level
      await apiService.users.update(updatedUser.id, updatedUser);
    } catch (err: any) {
      console.warn('[User DB Update Fallback]', err.message);
    }

    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    // If currently logged-in user is updated, keep current session and active profile in sync
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      StorageService.setActiveUser(updatedUser.id);
      const newProfile = userAccountToProfile(updatedUser);
      setProfile(newProfile);
      StorageService.saveProfile(newProfile);
    }

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `USER_CREDENTIALS_UPDATED: Admin updated credentials for user ${updatedUser.name} (${updatedUser.email})`,
      category: 'RBAC_CHANGE',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleRecordActivity = (act: Omit<UserActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newRecord = StorageService.recordUserActivity(act);
    setActivities(StorageService.getUserActivities());
    return newRecord;
  };

  const handleResetPassword = (email: string, newPassword: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const updatedUsers = users.map((u) => (u.email.toLowerCase() === cleanEmail ? { ...u, password: newPassword } : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      const updatedCurrent = { ...currentUser, password: newPassword };
      setCurrentUser(updatedCurrent);
    }

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: cleanEmail,
      action: `PASSWORD_RESET_VIA_OTP: User successfully reset password using verified 6-digit email OTP`,
      category: 'AUTH',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleToggleFeatureFlag = (flagId: string) => {
    const updated = featureFlags.map((f) =>
      f.id === flagId ? { ...f, enabled: !f.enabled } : f
    );
    setFeatureFlags(updated);
    StorageService.saveFeatureFlags(updated);

    const changedFlag = featureFlags.find((f) => f.id === flagId);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `FEATURE_FLAG_TOGGLE: ${changedFlag?.name} set to ${!changedFlag?.enabled}`,
      category: 'RBAC_CHANGE',
      status: 'INFO'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  // Feedback Mechanism Handlers
  const handleSubmitFeedback = (newTicket: UserFeedbackTicket) => {
    const updated = [newTicket, ...feedbackTickets];
    setFeedbackTickets(updated);
    StorageService.saveFeedbackTickets(updated);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: newTicket.userEmail,
      action: `FEEDBACK_DISPATCHED: ${newTicket.category} filed [${newTicket.subject}]. Email notification sent to admin mailing list (${newTicket.adminEmailRecipients.join(', ')})`,
      category: 'AUTH',
      status: 'INFO'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  const handleRespondFeedback = (
    ticketId: string,
    replyMessage: string,
    newStatus: 'Resolved' | 'Investigating'
  ) => {
    const updated = feedbackTickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            status: newStatus,
            adminResponse: {
              respondedBy: currentUser?.name || 'Administrator Root',
              respondedAt: new Date().toLocaleString(),
              message: replyMessage
            }
          }
        : t
    );
    setFeedbackTickets(updated);
    StorageService.saveFeedbackTickets(updated);

    const targetTicket = feedbackTickets.find((t) => t.id === ticketId);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `FEEDBACK_RESPONSE_SENT: Admin responded to '${targetTicket?.subject}' with status ${newStatus}. User notification updated.`,
      category: 'AUTH',
      status: 'SUCCESS'
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    StorageService.saveAuditLogs(updatedLogs);
  };

  // Effective Role Boundary:
  // Non-admins can NEVER view the admin cluster.
  const isUserAdmin = currentUser?.role === 'admin';
  const effectiveRole = !isUserAdmin && activeRole === 'admin' ? (currentUser?.role || 'student') : activeRole;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        profile={profile}
        currentUser={currentUser}
        activeRole={effectiveRole}
        onRoleChange={(newRole) => {
          if (isUserAdmin || newRole === currentUser?.role) {
            setActiveRole(newRole);
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isOnline={isOnline}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenAuthModal={() => {
          setAuthModalInitialTab('login');
          setIsAuthModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenResourceVault={() => setIsResourceVaultOpen(true)}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        onLogout={handleLogout}
        isKidMode={currentUser?.preferences.simplifiedInterface ?? (profile.ageCohort === 'early')}
        onToggleKidMode={() => handleToggleSimplifiedInterface(!(currentUser?.preferences.simplifiedInterface ?? (profile.ageCohort === 'early')))}
        feedbackTicketCount={
          feedbackTickets.filter((t) =>
            t.status === 'Pending Review' ||
            (currentUser && t.userId === currentUser.id && t.adminResponse)
          ).length
        }
        onCelebrateStreak={() => {
          triggerCelebration('streak');
          setCelebrationModal({
            type: 'streak_completed',
            title: `${profile.currentStreak}-Day Streak Active! 🔥`,
            subtitle: 'Your daily learning habit is unbroken. Keep crushing your goals!'
          });
        }}
        onNavigateHome={handleNavigateHome}
        availableUsers={users}
        onSwitchUser={handleLogin}
        onOpenRegister={() => {
          setAuthModalInitialTab('register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content View by Role (Strict RBAC Guarded) */}
      <div className="flex-1">
        {!currentUser ? (
          <HomePage
            onOpenSignIn={() => {
              setAuthModalInitialTab('login');
              setIsAuthModalOpen(true);
            }}
            onOpenRegister={() => {
              setAuthModalInitialTab('register');
              setIsAuthModalOpen(true);
            }}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        ) : (
          <div className="py-4 sm:py-6">
            {effectiveRole === 'student' && (
              <StudentView
                key={`${currentUser?.id || 'guest'}_${homeResetKey}`}
                activeTab={studentTab}
                onTabChange={setStudentTab}
                resetTrigger={homeResetKey}
                profile={profile}
                currentUser={currentUser}
                activities={activities}
                units={units}
                ieltsUnits={ieltsUnits}
                mockTests={mockTests}
                academicTopics={academicTopics}
                ollamaModels={ollamaModels}
                chatMessages={chatMessages}
                dailyTasks={dailyTasks}
                revisions={revisions}
                careerRoadmaps={careerRoadmaps}
                resume={resume}
                certificates={certificates}
                vocabularyWords={vocabularyWords}
                onStartLesson={handleStartLesson}
                onSendMessage={handleSendMessage}
                onToggleTask={handleToggleDailyTask}
                onCompleteRevision={handleCompleteRevision}
                onAddTask={handleAddTask}
                onUpdateResume={handleUpdateResume}
                onOpenResourceVault={() => setIsResourceVaultOpen(true)}
                onMarkLessonCompleted={handleMarkLessonCompleted}
                onRecordActivity={handleRecordActivity}
                onUpdateMockTests={setMockTests}
                onCelebrate={(type) => {
                  if (type === 'daily_goal') {
                    const todayKey = 'edubridge_daily_goal_celebrated_' + new Date().toISOString().slice(0, 10);
                    if (localStorage.getItem(todayKey)) {
                      // Already celebrated daily goal today! Do not show modal repeatedly.
                      return;
                    }
                    localStorage.setItem(todayKey, 'true');
                  }
                  triggerCelebration(type);
                  setCelebrationModal({
                    type: type === 'daily_goal' ? 'goal_reached' : 'streak_completed',
                    title: type === 'daily_goal' ? 'Daily XP Goal Reached! 🎉' : `${profile.currentStreak}-Day Streak Milestone! 🔥`,
                    subtitle: type === 'daily_goal'
                      ? `You earned ${profile.todayXp} of ${profile.dailyGoalXp} XP today!`
                      : `Day ${profile.currentStreak} completed. Your habit consistency is world-class!`
                  });
                }}
                onToggleSimplifiedInterface={handleToggleSimplifiedInterface}
              />
            )}

            {effectiveRole === 'parent' && (
              <main className="w-full px-3 sm:px-4 lg:px-6">
                <ParentPortal progress={childProgress} />
              </main>
            )}

            {effectiveRole === 'teacher' && (
              <main className="w-full px-3 sm:px-4 lg:px-6">
                <TeacherPortal
                  assignments={assignments}
                  questionBank={questionBank}
                  onAddQuestion={handleAddQuestion}
                  onAddAssignment={handleAddAssignment}
                />
              </main>
            )}

            {effectiveRole === 'admin' && isUserAdmin && (
              <main className="w-full px-3 sm:px-4 lg:px-6">
                <AdminPortal
                  models={ollamaModels}
                  metrics={systemMetrics}
                  activities={activities}
                  auditLogs={auditLogs}
                  scheduledJobs={scheduledJobs}
                  vocabularyWords={vocabularyWords}
                  ingestedLedger={ingestedLedger}
                  users={users}
                  featureFlags={featureFlags}
                  feedbackTickets={feedbackTickets}
                  onToggleModelStatus={handleToggleModelStatus}
                  onUpdateModelTemp={handleUpdateModelTemp}
                  onToggleJob={handleToggleJob}
                  onRunScheduledJob={handleRunScheduledJob}
                  onToggleUserStatus={handleToggleUserStatus}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleAdminUpdateUser}
                  onToggleFeatureFlag={handleToggleFeatureFlag}
                  onRespondFeedback={handleRespondFeedback}
                />
              </main>
            )}
          </div>
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

      {/* User Authentication & Password Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onResetPassword={handleResetPassword}
        initialTab={authModalInitialTab}
      />

      {/* User Profile & Preferences Modal */}
      {currentUser && (
        <ProfileSetupModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateCurrentUser}
        />
      )}

      {/* User Feedback & Admin Response Modal */}
      {currentUser && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          currentUser={currentUser}
          tickets={feedbackTickets}
          onSubmitTicket={handleSubmitFeedback}
        />
      )}

      {/* Windows-Style Role-Aware User Guide */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        userRole={currentUser?.role || 'student'}
        articles={userGuideArticles}
      />

      {/* Universal Resource Vault (Printable & Downloadable Study Guides) */}
      <ResourceVaultModal
        isOpen={isResourceVaultOpen}
        onClose={() => setIsResourceVaultOpen(false)}
      />

    </div>
  );
}
