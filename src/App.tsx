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
  FontScale
} from './types';
import { StorageService } from './services/storage';
import { systemMetrics } from './data/initialData';
import { sound } from './utils/audio';
import { userAccountToProfile, calculateCohortFromDob, calculateEducationLevel } from './utils/userProfile';

import { Header } from './components/Header';
import { StudentView } from './components/student/StudentView';
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

export default function App() {
  // Global ecosystem state with offline persistence
  const [users, setUsers] = useState<UserAccount[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const active = StorageService.getActiveUser();
    if (active) return active;
    const allUsers = StorageService.getUsers();
    return allUsers[0] || null;
  });
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

  const [profile, setProfile] = useState(() => StorageService.getProfile());
  const [activeRole, setActiveRole] = useState<UserRole>(() => currentUser?.role || 'student');
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
  const [scheduledJobs, setScheduledJobs] = useState(() => StorageService.getScheduledJobs());
  const [vocabularyWords, setVocabularyWords] = useState(() => StorageService.getVocabularyWords());
  const [ingestedLedger, setIngestedLedger] = useState<IngestedItemRecord[]>(() => StorageService.getIngestedItemsLedger());

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
    // Simulate daemon execution latency
    await new Promise((r) => setTimeout(r, 1000));
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (jobId === 'job_exam_midnight_00') {
      // Generate at least 5 complete daily mock tests covering PTE, TOEFL, OET, DET, and Cambridge English
      const newMockTests = generateFivePracticeTestsBatch(Math.floor(mockTests.length / 5) + 1, timestamp);
      const updatedTests = [...mockTests, ...newMockTests];
      setMockTests(updatedTests);
      StorageService.saveMockTests(updatedTests);

      // Secondly: Multi-exam test generator adds practice tests as well!
      const newPracticeTests = generatePracticeTestsBatch(Math.floor(mockTests.length / 5) + 1, timestamp);
      const existingPracticeTests = StorageService.getPracticeTests();
      const updatedPracticeTests = [...newPracticeTests, ...existingPracticeTests];
      StorageService.savePracticeTests(updatedPracticeTests);

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
        action: `CRON_SCHEDULE_EXECUTE: Added ${newMockTests.length} mock tests and ${newPracticeTests.length} practice tests across PTE, TOEFL, OET, DET & Cambridge English`,
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
        action: `CRON_SCHEDULE_EXECUTE: Added ${newWords.length} new vocabulary words with phonetics, CEFR levels, and audio transcripts`,
        category: 'DATABASE_SYNC',
        status: 'SUCCESS'
      };
      const updatedLogs = [newLog, ...auditLogs];
      setAuditLogs(updatedLogs);
      StorageService.saveAuditLogs(updatedLogs);
    }
  };

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
    StorageService.setActiveUser(null);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
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

  const handleAddUser = (newUser: UserAccount) => {
    const updated = [newUser, ...users];
    setUsers(updated);
    StorageService.saveUsers(updated);

    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@edubridge.org',
      action: `USER_PROVISIONED: Admin created user account ${newUser.email} with role '${newUser.role}'`,
      category: 'RBAC_CHANGE',
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenResourceVault={() => setIsResourceVaultOpen(true)}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        onLogout={handleLogout}
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
      />

      {/* Main Content View by Role (Strict RBAC Guarded) */}
      <div className="flex-1 py-4 sm:py-6">
        {effectiveRole === 'student' && (
          <StudentView
            key={currentUser?.id || 'guest'}
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
            vocabularyWords={vocabularyWords}
            onStartLesson={handleStartLesson}
            onSendMessage={handleSendMessage}
            onToggleTask={handleToggleDailyTask}
            onCompleteRevision={handleCompleteRevision}
            onAddTask={handleAddTask}
            onUpdateResume={handleUpdateResume}
            onOpenResourceVault={() => setIsResourceVaultOpen(true)}
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
          <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <ParentPortal progress={childProgress} />
          </main>
        )}

        {effectiveRole === 'teacher' && (
          <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <TeacherPortal
              assignments={assignments}
              questionBank={questionBank}
              onAddQuestion={handleAddQuestion}
              onAddAssignment={handleAddAssignment}
            />
          </main>
        )}

        {effectiveRole === 'admin' && isUserAdmin && (
          <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <AdminPortal
              models={ollamaModels}
              metrics={systemMetrics}
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
              onToggleFeatureFlag={handleToggleFeatureFlag}
              onRespondFeedback={handleRespondFeedback}
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

      {/* User Authentication & Password Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
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
