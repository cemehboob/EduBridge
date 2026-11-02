import { UserActivityRecord } from '../types';

export const initialActivities: UserActivityRecord[] = [
  // Alex Rivera (usr_student_01) Activities
  {
    id: 'act_alex_01',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'mock_test',
    title: 'IELTS Academic Reading Full Simulation',
    category: 'IELTS Academic',
    timestamp: '2026-11-01 18:40:15',
    relativeTime: '1 hour ago',
    score: '8.5 Band',
    xpEarned: 50,
    status: 'completed',
    details: 'Completed 40 academic reading questions across 3 passages on Environmental Sustainability and Quantum Computing with 38/40 correct.',
    replayPayload: {
      tab: 'exam',
      subId: 'test_ielts_acad_01'
    }
  },
  {
    id: 'act_alex_02',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'solver',
    title: 'Solved Quadratic Equation: 2x² - 8 = 0',
    category: 'Mathematics (Algebra)',
    timestamp: '2026-11-01 17:15:20',
    relativeTime: '2 hours ago',
    score: '100%',
    xpEarned: 25,
    status: 'completed',
    details: 'Step-by-step factorization: 2(x² - 4) = 0 ➔ 2(x - 2)(x + 2) = 0 ➔ Roots: x = 2, x = -2.',
    replayPayload: {
      tab: 'solver',
      query: '2x^2 - 8 = 0'
    }
  },
  {
    id: 'act_alex_03',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'lesson',
    title: 'IELTS Academic Writing Task 2: Advanced Cohesion',
    category: 'English Language Arts',
    timestamp: '2026-11-01 15:30:00',
    relativeTime: '4 hours ago',
    score: '96%',
    xpEarned: 35,
    status: 'completed',
    details: 'Mastered discourse markers, contrastive transitions, and academic register for Task 2 argument essays.',
    replayPayload: {
      tab: 'language',
      subId: 'u1_l1'
    }
  },
  {
    id: 'act_alex_04',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'vocab_quiz',
    title: 'Vocabulary Vault Quiz: C1 Academic Lexicon',
    category: 'Lexicon Vault',
    timestamp: '2026-11-01 12:10:45',
    relativeTime: '7 hours ago',
    score: '10/10 Correct',
    xpEarned: 40,
    status: 'completed',
    details: 'Tested on nuanced academic vocabulary including "ubiquitous", "pragmatic", "paradigm", and "corroborate".',
    replayPayload: {
      tab: 'vocab_quiz',
      subId: 'academy'
    }
  },
  {
    id: 'act_alex_05',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'solver',
    title: 'Solved Physics Problem: Newton\'s 2nd Law (F = m · a)',
    category: 'Physics',
    timestamp: '2026-10-31 20:45:10',
    relativeTime: 'Yesterday',
    score: '100%',
    xpEarned: 25,
    status: 'completed',
    details: 'Calculated net force on a 1500 kg electric vehicle accelerating at 3.2 m/s² ➔ F = 4,800 N.',
    replayPayload: {
      tab: 'solver',
      query: 'F = m * a where m = 1500kg and a = 3.2m/s^2'
    }
  },
  {
    id: 'act_alex_06',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'study_task',
    title: 'Completed Daily Spaced Repetition Flashcards',
    category: 'Study Habits',
    timestamp: '2026-10-31 09:15:00',
    relativeTime: 'Yesterday',
    score: 'Completed',
    xpEarned: 20,
    status: 'completed',
    details: 'Reviewed 25 spaced repetition cards covering GRE/IELTS vocabulary and calculus derivative rules.',
    replayPayload: {
      tab: 'planner'
    }
  },
  {
    id: 'act_alex_07',
    userId: 'usr_student_01',
    userName: 'Alex Rivera',
    type: 'career_cv',
    title: 'AI Career Audit & CV Regional Adaptation',
    category: 'Career Portfolio',
    timestamp: '2026-10-30 18:20:00',
    relativeTime: '2 days ago',
    score: 'Score: 82%',
    xpEarned: 30,
    status: 'reviewed',
    details: 'Applied quantified metric enhancements and tailored resume for UK/EU Engineering format.',
    replayPayload: {
      tab: 'career'
    }
  },

  // Leo Chen (usr_student_early, Age 7) Activities
  {
    id: 'act_leo_01',
    userId: 'usr_student_early',
    userName: 'Leo Chen (Age 7)',
    type: 'stem_game',
    title: 'Phonics Sound Safari & Animal Match',
    category: 'Phonics Adventure',
    timestamp: '2026-11-01 17:25:00',
    relativeTime: '2 hours ago',
    score: '🌟 100% Star Reader',
    xpEarned: 25,
    status: 'completed',
    details: 'Matched animal sounds with initial phonemes: Lion /l/, Elephant /e/, and Tiger /t/.',
    replayPayload: {
      tab: 'cohorts',
      subId: 'science'
    }
  },
  {
    id: 'act_leo_02',
    userId: 'usr_student_early',
    userName: 'Leo Chen (Age 7)',
    type: 'stem_game',
    title: 'Rocket Math Launch Addition Game',
    category: 'Math Fun (Ages 3–7)',
    timestamp: '2026-11-01 14:10:00',
    relativeTime: '5 hours ago',
    score: '🚀 5 Rockets Launched',
    xpEarned: 25,
    status: 'completed',
    details: 'Solved single-digit addition challenges (4 + 3 = 7, 5 + 5 = 10) to fuel the moon rocket.',
    replayPayload: {
      tab: 'cohorts',
      subId: 'science'
    }
  },
  {
    id: 'act_leo_03',
    userId: 'usr_student_early',
    userName: 'Leo Chen (Age 7)',
    type: 'daily_schedule',
    title: 'Completed Daily Sticker Chart & Phonics Habit',
    category: 'Daily Routine',
    timestamp: '2026-10-31 16:30:00',
    relativeTime: 'Yesterday',
    score: '🌟 3 Golden Stars',
    xpEarned: 20,
    status: 'completed',
    details: 'Completed bedtime story reading, teeth brushing sticker, and 10 minutes of phonics practice.',
    replayPayload: {
      tab: 'cohorts',
      subId: 'schedule'
    }
  },

  // Maya Patel (usr_student_junior, Age 12) Activities
  {
    id: 'act_maya_01',
    userId: 'usr_student_junior',
    userName: 'Maya Patel (Age 12)',
    type: 'stem_game',
    title: 'Junior Virtual Circuit & Magnetism Lab',
    category: 'STEM Lab (Ages 8–10)',
    timestamp: '2026-11-01 17:50:00',
    relativeTime: '2 hours ago',
    score: '95% Voltage Accuracy',
    xpEarned: 35,
    status: 'completed',
    details: 'Connected a series circuit with 9V battery, switch, and LED resistor without short-circuiting.',
    replayPayload: {
      tab: 'cohorts',
      subId: 'science'
    }
  },
  {
    id: 'act_maya_02',
    userId: 'usr_student_junior',
    userName: 'Maya Patel (Age 12)',
    type: 'solver',
    title: 'Chemical Equation Balancing: 2H₂ + O₂ ➔ 2H₂O',
    category: 'Chemistry Lab',
    timestamp: '2026-11-01 13:20:00',
    relativeTime: '6 hours ago',
    score: '100% Balanced',
    xpEarned: 25,
    status: 'completed',
    details: 'Balanced hydrogen and oxygen moles demonstrating the Law of Conservation of Mass.',
    replayPayload: {
      tab: 'solver',
      query: 'balance H2 + O2 -> H2O'
    }
  },
  {
    id: 'act_maya_03',
    userId: 'usr_student_junior',
    userName: 'Maya Patel (Age 12)',
    type: 'vocab_quiz',
    title: 'Middle School Vocabulary Explorer: Science & Space',
    category: 'Lexicon Vault',
    timestamp: '2026-10-31 14:05:00',
    relativeTime: 'Yesterday',
    score: '100%',
    xpEarned: 30,
    status: 'completed',
    details: 'Mastered definitions and context usage for "atmosphere", "photosynthesis", "velocity", and "gravity".',
    replayPayload: {
      tab: 'vocab_quiz',
      subId: 'junior'
    }
  },

  // Marcus Vance (usr_teacher_03, Teacher) Activities
  {
    id: 'act_marcus_01',
    userId: 'usr_teacher_03',
    userName: 'Marcus Vance',
    type: 'lesson',
    title: 'Curriculum Directorate: Published Unit 4 Physics Pacing',
    category: 'Curriculum Directorate',
    timestamp: '2026-11-02 11:30:00',
    relativeTime: '6 hours ago',
    score: 'Published',
    xpEarned: 40,
    status: 'completed',
    details: 'Configured syllabus milestones, lesson plans, and experimental learning objectives for High School Physics.',
    replayPayload: {
      tab: 'curriculum',
      subId: 'physics_u4'
    }
  },
  {
    id: 'act_marcus_02',
    userId: 'usr_teacher_03',
    userName: 'Marcus Vance',
    type: 'mock_test',
    title: 'Item Master Bank: Created 10 Multi-Choice Exam Questions',
    category: 'Item Master Bank',
    timestamp: '2026-11-01 16:45:00',
    relativeTime: 'Yesterday',
    score: '10 Items Added',
    xpEarned: 50,
    status: 'completed',
    details: 'Authored calibrated items for thermodynamics, wave optics, and fluid mechanics with detailed answer rationales.',
    replayPayload: {
      tab: 'questions'
    }
  },

  // Eleanor Rivera (usr_parent_02, Parent) Activities
  {
    id: 'act_eleanor_01',
    userId: 'usr_parent_02',
    userName: 'Eleanor Rivera',
    type: 'study_task',
    title: 'Parental Growth & Oversight Review: Alex Rivera',
    category: 'Parental Oversight',
    timestamp: '2026-11-02 09:15:00',
    relativeTime: '8 hours ago',
    score: 'Reviewed',
    xpEarned: 20,
    status: 'completed',
    details: 'Inspected weekly study duration (14.5 hours), subject mastery radar, and screen time balance metrics.',
    replayPayload: {
      tab: 'growth'
    }
  },

  // System Administrator (usr_admin_04, Root Admin) Activities
  {
    id: 'act_admin_01',
    userId: 'usr_admin_04',
    userName: 'System Administrator',
    type: 'admin_action',
    title: 'Configured Practice Test Architecture: 10 Questions Standard',
    category: 'System Administration',
    timestamp: '2026-11-02 14:10:00',
    relativeTime: '3 hours ago',
    score: 'Active Setting',
    xpEarned: 50,
    status: 'completed',
    details: 'Configured global practice test question counts to 10 questions per test and enabled automated option shuffling for MCQs.',
    replayPayload: {
      tab: 'dashboard',
      subId: 'test_settings'
    }
  },
  {
    id: 'act_admin_02',
    userId: 'usr_admin_04',
    userName: 'System Administrator',
    type: 'admin_action',
    title: 'Model Management: Configured Claude 3.5 Sonnet & Gemini Pro',
    category: 'AI Model Management',
    timestamp: '2026-11-02 12:05:00',
    relativeTime: '5 hours ago',
    score: 'Verified Latency: 240ms',
    xpEarned: 40,
    status: 'completed',
    details: 'Optimized inference temperature parameters (0.2 for Math/Science, 0.7 for Writing Feedback) and confirmed 99.9% uptime.',
    replayPayload: {
      tab: 'models'
    }
  },
  {
    id: 'act_admin_03',
    userId: 'usr_admin_04',
    userName: 'System Administrator',
    type: 'admin_action',
    title: 'Triggered Automation Job: Daily Spaced Repetition Queue',
    category: 'Automation Engine',
    timestamp: '2026-11-01 23:00:00',
    relativeTime: 'Yesterday',
    score: 'Processed 150 Users',
    xpEarned: 35,
    status: 'completed',
    details: 'Executed scheduled cron task for spaced repetition intervals and streak retention verification across active cohorts.',
    replayPayload: {
      tab: 'jobs'
    }
  },
  {
    id: 'act_admin_04',
    userId: 'usr_admin_04',
    userName: 'System Administrator',
    type: 'admin_action',
    title: 'Security Audit: Verified Session Authorization & Audit Logs',
    category: 'Security & Audit',
    timestamp: '2026-10-31 19:40:00',
    relativeTime: '2 days ago',
    score: 'Zero Vulnerabilities',
    xpEarned: 30,
    status: 'completed',
    details: 'Inspected 14 administrative audit entries, validated IP whitelists, and verified password salt hashes.',
    replayPayload: {
      tab: 'audit'
    }
  }
];

