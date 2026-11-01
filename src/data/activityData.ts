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
  }
];

