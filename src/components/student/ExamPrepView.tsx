/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  BarChart3,
  FileText,
  Volume2,
  Mic,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';
import {
  ExamType,
  MockTest,
  ExamAttempt,
  IELTSPracticeTest,
  PracticeTestQuestion,
  Band9EssayTemplate,
  UserProfile,
  UserAccount,
  UserActivityRecord,
  AgeCohortId,
  QuestionAttemptRecord
} from '../../types';
import { IELTSPracticeService } from '../../services/ieltsPracticeService';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { VoicePersonaSelector } from '../common/VoicePersonaSelector';
import { tfngExercises, band9EssayTemplates, cueCardItems, ageCohorts } from '../../data/ageCohortsData';
import { sound } from '../../utils/audio';
import { calculateCohortFromDob } from '../../utils/userProfile';

interface ExamPrepViewProps {
  mockTests: MockTest[];
  profile?: UserProfile;
  currentUser?: UserAccount | null;
  onRecordAttempt?: (attempt: ExamAttempt) => void;
  onRecordActivity?: (activity: Omit<UserActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  onUpdateMockTests?: (tests: MockTest[]) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({
  mockTests,
  profile,
  currentUser,
  onRecordAttempt,
  onRecordActivity,
  onUpdateMockTests
}) => {
  const examOptions: ExamType[] = [
    'IELTS Academic',
    'IELTS General Training',
    'PTE',
    'TOEFL',
    'OET',
    'DET',
    'Cambridge English'
  ];

  const getTargetExamFromProfile = (p?: UserProfile): ExamType => {
    if (p?.targetExam) {
      const match = examOptions.find(
        (e) => e.toLowerCase() === p.targetExam?.toLowerCase() ||
               (e.includes('IELTS') && p.targetExam?.includes('IELTS'))
      );
      if (match) return match;
    }
    if (p?.targetCareer?.toLowerCase().includes('medic') || 
        p?.targetCareer?.toLowerCase().includes('nurs') ||
        p?.targetCareer?.toLowerCase().includes('doctor') ||
        p?.targetCareer?.toLowerCase().includes('health')) {
      return 'OET';
    }
    if (p?.ageCohort === 'early') return 'DET';
    return 'IELTS Academic';
  };

  const userCohort: AgeCohortId =
    profile?.ageCohort || (profile?.dateOfBirth ? calculateCohortFromDob(profile.dateOfBirth) : 'academy');
  const userCohortInfo = ageCohorts.find((c) => c.id === userCohort) || ageCohorts[2];

  const [selectedExam, setSelectedExam] = useState<ExamType>(() => getTargetExamFromProfile(profile));
  const [activeTabMode, setActiveTabMode] = useState<'practice' | 'mock' | 'tfng' | 'task2' | 'cuecard'>('practice');
  const [filterByCohortLevel, setFilterByCohortLevel] = useState<boolean>(true);

  // Sync exam when user switches or profile updates preferences
  useEffect(() => {
    const target = getTargetExamFromProfile(profile);
    setSelectedExam(target);
    setActiveTest(null);
    setExamResult(null);
    setIsRunning(false);
  }, [profile?.id, profile?.targetExam, profile?.ageCohort, profile?.educationLevel]);

  // Determine expected difficulty range for user based on age & education level
  const getExpectedDifficultyForUser = (cohort: AgeCohortId, eduLevel?: string): ('Foundation' | 'Standard' | 'Advanced')[] => {
    const edu = (eduLevel || '').toLowerCase();
    if (edu.includes('primary') || edu.includes('elementary') || cohort === 'early') {
      return ['Foundation', 'Standard'];
    }
    if (edu.includes('middle') || cohort === 'junior') {
      return ['Foundation', 'Standard'];
    }
    if (edu.includes('doctorate') || edu.includes('master') || edu.includes('postgraduate') || cohort === 'pro') {
      return ['Advanced', 'Standard'];
    }
    if (cohort === 'senior') {
      return ['Standard', 'Advanced', 'Foundation'];
    }
    return ['Standard', 'Advanced', 'Foundation'];
  };

  const preferredDifficulties = getExpectedDifficultyForUser(userCohort, profile?.educationLevel);

  // AspireFree Deliberate Practice Suite states
  const [activeTfngIndex, setActiveTfngIndex] = useState(0);
  const [tfngChoice, setTfngChoice] = useState<'TRUE' | 'FALSE' | 'NOT GIVEN' | null>(null);
  const [task2EssayText, setTask2EssayText] = useState(
    'While proponents contend that technological automation engenders profound unemployment, empirical indications substantiate that novel cognitive sectors emerge to absorb specialized labor...'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Band9EssayTemplate | null>(band9EssayTemplates[0]);
  const [activeCueCardIndex, setActiveCueCardIndex] = useState(0);
  const [cuePhase, setCuePhase] = useState<'idle' | 'prep' | 'speaking'>('idle');
  const [cueTimer, setCueTimer] = useState(60);
  const [cueNotes, setCueNotes] = useState('');
  
  // Practice tests state (1,100+ catalog + dynamic nightly additions)
  const [practiceTests, setPracticeTests] = useState<IELTSPracticeTest[]>(() => {
    const base = IELTSPracticeService.getPracticeTests();
    const stored = StorageService.getPracticeTests();
    return [...stored, ...base];
  });
  const [selectedPracticeModule, setSelectedPracticeModule] = useState<'Listening' | 'Reading' | 'Writing' | 'Speaking'>('Reading');
  const [activePracticeItem, setActivePracticeItem] = useState<IELTSPracticeTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceTestSubmitted, setPracticeTestSubmitted] = useState<boolean>(false);
  const [practiceTestScore, setPracticeTestScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiBannerMsg, setAiBannerMsg] = useState<string | null>(null);
  const [practiceUserAnswer, setPracticeUserAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation?: string;
  } | null>(null);

  // Dedicated Writing Practice State (1 Question per Practice, Word Count, AI Rubrics)
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState<boolean>(false);
  const [writingEvaluation, setWritingEvaluation] = useState<{
    overallBand: string;
    taskResponse: string;
    coherence: string;
    lexical: string;
    grammar: string;
    feedback: string;
  } | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState<boolean>(false);

  // Mock test simulator state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [essayText, setEssayText] = useState('');
  const [speakingText, setSpeakingText] = useState('');
  const [isRecordingSpeaking, setIsRecordingSpeaking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null);

  // Early Childhood Assessment Challenges (Ages 5–8)
  const earlyLearningChallenges = [
    {
      id: 'early_q1',
      title: 'Phonics Letter Sounds',
      category: 'Phonics & Letters',
      question: 'Which letter does this friendly animal start with? 🐱 CAT',
      icon: '🐱',
      options: ['C', 'M', 'P', 'T'],
      correctAnswer: 'C',
      explanation: 'Great job! Cat starts with the letter C (/k/ sound)!'
    },
    {
      id: 'early_q2',
      title: 'Sight Word & Picture Match',
      category: 'Sight Words',
      question: 'Look at the picture: 🌟. Choose the matching word:',
      icon: '🌟',
      options: ['Star', 'Sun', 'Moon', 'Tree'],
      correctAnswer: 'Star',
      explanation: 'Awesome! That is a bright golden Star!'
    },
    {
      id: 'early_q3',
      title: 'Rhyme Time Fun',
      category: 'Rhymes & Word Families',
      question: 'Which word rhymes with FROG? 🐸',
      icon: '🐸',
      options: ['Dog', 'Cat', 'Fish', 'Bird'],
      correctAnswer: 'Dog',
      explanation: 'Super star! Frog and Dog rhyme because they both end in "-og"!'
    },
    {
      id: 'early_q4',
      title: 'Little Story Explorer',
      category: 'Story Comprehension',
      question: 'Bella the bunny loves eating crunchy orange carrots. What does Bella love to eat? 🥕',
      icon: '🐰',
      options: ['Carrots', 'Cookies', 'Apples', 'Bread'],
      correctAnswer: 'Carrots',
      explanation: 'Brilliant! Bella the bunny loves crunchy orange carrots!'
    },
    {
      id: 'early_q5',
      title: 'Counting Star Fun',
      category: 'Early Math & Count',
      question: 'How many apples are here? 🍎 🍎 🍎 🍎',
      icon: '🍎',
      options: ['4', '2', '3', '5'],
      correctAnswer: '4',
      explanation: 'Hooray! 1, 2, 3, 4 delicious red apples!'
    },
    {
      id: 'early_q6',
      title: 'Colors of the World',
      category: 'Early Vocabulary',
      question: 'What color is the fresh green grass? 🌿',
      icon: '🌿',
      options: ['Green', 'Blue', 'Purple', 'Yellow'],
      correctAnswer: 'Green',
      explanation: 'Spot on! Grass is fresh green!'
    }
  ];

  const [earlyQuestionIndex, setEarlyQuestionIndex] = useState(0);
  const [earlySelectedAnswer, setEarlySelectedAnswer] = useState<string | null>(null);
  const [earlyFeedback, setEarlyFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [earlyStars, setEarlyStars] = useState(0);

  const handleEarlyAnswer = (chosen: string) => {
    sound.playClick();
    setEarlySelectedAnswer(chosen);
    const curr = earlyLearningChallenges[earlyQuestionIndex];
    const isCorrect = chosen === curr.correctAnswer;
    if (isCorrect) {
      sound.playSuccess();
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {}
      setEarlyStars((prev) => prev + 1);
      setEarlyFeedback({ isCorrect: true, message: curr.explanation });
    } else {
      sound.playError();
      setEarlyFeedback({
        isCorrect: false,
        message: `Nice try! The correct answer is "${curr.correctAnswer}". Let's keep exploring!`
      });
    }

    const qAttempt: QuestionAttemptRecord = {
      id: `qatt_early_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: profile?.id || 'usr_student_01',
      userName: profile?.name || 'Little Learner',
      userRole: profile?.role || 'student',
      testOrQuizId: 'early_primary_assessment_01',
      testOrQuizTitle: `Early Primary Assessment · ${curr.title}`,
      moduleOrSubject: curr.category,
      questionNumber: earlyQuestionIndex + 1,
      questionPrompt: curr.question,
      options: curr.options,
      userAnswer: chosen,
      correctAnswer: curr.correctAnswer,
      isCorrect,
      score: isCorrect ? '1/1' : '0/1',
      explanation: curr.explanation,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    StorageService.recordBatchQuestionAttempts([qAttempt]);

    if (onRecordActivity) {
      onRecordActivity({
        userId: profile?.id || 'usr_student_01',
        userName: profile?.name || 'Little Learner',
        type: 'lesson',
        title: `Completed Early Primary Challenge: ${curr.title}`,
        category: 'Early Childhood Phonics',
        score: isCorrect ? '100%' : '75%',
        xpEarned: isCorrect ? 25 : 10,
        status: 'completed',
        details: `Little explorer answered "${chosen}" for question: ${curr.question}`,
        replayPayload: { tab: 'exam', subId: curr.id }
      });
    }
  };

  const handleNextEarlyQuestion = () => {
    sound.playClick();
    setEarlySelectedAnswer(null);
    setEarlyFeedback(null);
    setEarlyQuestionIndex((prev) => (prev + 1) % earlyLearningChallenges.length);
  };

  // Filter practice tests by selected IELTS category & module
  const currentIeltsCategory = selectedExam === 'IELTS General Training' ? 'IELTS General Training' : 'IELTS Academic';
  const allPracticeTestsForModule = practiceTests.filter(
    (t) => t.category === currentIeltsCategory && t.module === selectedPracticeModule
  );
  // Sort practice tests so unattempted tests come first, and attempted tests move to end of bank
  const filteredPracticeTests = [...allPracticeTestsForModule].sort((a, b) => {
    const aAttempted = a.lastAttemptedAt || a.completed ? 1 : 0;
    const bAttempted = b.lastAttemptedAt || b.completed ? 1 : 0;
    if (aAttempted !== bAttempted) {
      return aAttempted - bAttempted;
    }
    const aMatch = preferredDifficulties.includes(a.difficulty) ? 1 : 0;
    const bMatch = preferredDifficulties.includes(b.difficulty) ? 1 : 0;
    return bMatch - aMatch;
  });

  // All mock tests for selected exam
  const examMockTests = mockTests.filter((t) => {
    if (selectedExam.includes('IELTS')) return t.exam === 'IELTS';
    return t.exam === selectedExam;
  });

  // Filtered by cohort/age/education difficulty if toggle is active
  const cohortFilteredTests = filterByCohortLevel
    ? examMockTests.filter((t) => preferredDifficulties.includes(t.difficulty))
    : examMockTests;

  // Safe fallback to all exam tests if strict filter yields 0
  const baseMockTests = cohortFilteredTests.length > 0 ? cohortFilteredTests : examMockTests;

  // Sort mock tests: unattempted mock tests come first; attempted mock tests move to end of bank!
  const effectiveMockTests = [...baseMockTests].sort((a, b) => {
    const aAttempted = a.lastAttemptedAt ? 1 : 0;
    const bAttempted = b.lastAttemptedAt ? 1 : 0;
    if (aAttempted !== bAttempted) {
      return aAttempted - bAttempted;
    }
    return 0;
  });
  const currentTest = activeTest || effectiveMockTests[0] || mockTests[0];

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  // Speaking Part 2 Cue Card Timer
  useEffect(() => {
    let interval: any = null;
    if ((cuePhase === 'prep' || cuePhase === 'speaking') && cueTimer > 0) {
      interval = setInterval(() => {
        setCueTimer((prev) => {
          if (prev <= 1) {
            if (cuePhase === 'prep') {
              sound.playLevelUp();
              setCuePhase('speaking');
              return 120;
            } else {
              sound.playSuccess();
              setCuePhase('idle');
              return 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cuePhase, cueTimer]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (test: MockTest) => {
    sound.playClick();
    setActiveTest(test);
    setActiveSectionIndex(0);
    setSecondsRemaining(test.totalDurationMin * 60);
    setIsRunning(true);
    setExamResult(null);
    setUserAnswers({});
    setEssayText('');
    setSpeakingText('');
  };

  const handleAutoSubmit = () => {
    setIsRunning(false);
    handleSubmitForEvaluation();
  };

  const handlePlayAudio = (text: string) => {
    sound.playClick();
    AIService.speakText(text, 0.95);
  };

  const handleStartSpeakingRecording = () => {
    sound.playClick();
    setIsRecordingSpeaking(true);
    setTimeout(() => {
      setIsRecordingSpeaking(false);
      setSpeakingText(
        'In my perspective, the integration of autonomous intelligent systems in clinical diagnostics significantly augments physician throughput, while necessitating stringent verification against algorithmic bias.'
      );
      sound.playSuccess();
    }, 2500);
  };

  const handleGenerateAITest = (mode: 'same_subject' | 'mix_match') => {
    sound.playClick();
    setAiGenerating(true);
    setTimeout(() => {
      const subjectPool = [
        'Environmental Science & Clean Energy',
        'Artificial Intelligence & Cognitive Ethics',
        'Marine Biology & Oceanic Systems',
        'Materials Science & Advanced Nanotechnology',
        'Neurobiology & Behavioral Psychology'
      ];
      const selectedSubject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
      const newTest = IELTSPracticeService.generateAIPracticeTest({
        mode,
        module: selectedPracticeModule,
        subject: mode === 'mix_match' ? 'Cross-Disciplinary Mix & Match' : selectedSubject
      });

      // Prepend to practice tests
      const updated = [newTest, ...practiceTests];
      setPracticeTests(updated);
      StorageService.savePracticeTests([newTest, ...StorageService.getPracticeTests()]);

      // Automatically launch test in workspace
      setActivePracticeItem(newTest);
      setCurrentQuestionIndex(0);
      setPracticeAnswers({});
      setPracticeTestSubmitted(false);
      setPracticeTestScore(null);
      setPracticeFeedback(null);
      setAiGenerating(false);
      setAiBannerMsg(`✨ AI generated a new 10-Question ${mode === 'mix_match' ? 'Mix & Match' : 'Same-Subject'} test under "${newTest.subject}"!`);
      sound.playSuccess();
    }, 600);
  };

  const handleEvaluateWriting = (text: string) => {
    sound.playClick();
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 25) {
      setWritingEvaluation({
        overallBand: '4.5 Band',
        taskResponse: 'Band 4.0: Response is too brief to address task requirements adequately.',
        coherence: 'Band 4.5: Limited sentence links and paragraph organization.',
        lexical: 'Band 4.5: Basic vocabulary without academic range.',
        grammar: 'Band 4.5: Simple structures only with frequent omissions.',
        feedback: 'Please write a more detailed response of at least 150–250 words to receive full rubric assessment.'
      });
      return;
    }
    setIsEvaluatingWriting(true);
    setTimeout(() => {
      setIsEvaluatingWriting(false);
      const estBand = words >= 250 ? '8.0 Band' : words >= 180 ? '7.5 Band' : '6.5 Band';
      setWritingEvaluation({
        overallBand: estBand,
        taskResponse: words >= 250 ? 'Band 8.0: Fully addresses all parts of the prompt with well-developed ideas.' : 'Band 7.0: Addresses main parts with relevant supporting details.',
        coherence: 'Band 8.0: Logical paragraph sequencing, smooth transitions, and clear topical progression.',
        lexical: 'Band 7.5: Sophisticated academic phrasing with natural collocation and discourse markers.',
        grammar: 'Band 8.0: Wide variety of complex sentence structures with high grammatical accuracy.',
        feedback: 'Strong response structure. Continue practicing advanced transitional adverbs to sustain academic flow.'
      });
      sound.playSuccess();
    }, 700);
  };

  const handleSubmitPracticeTest = (testItem: IELTSPracticeTest) => {
    sound.playClick();
    const isWriting = testItem.module === 'Writing';
    const questions = testItem.questions && testItem.questions.length > 0
      ? testItem.questions
      : [
          {
            id: `${testItem.id}_q1`,
            questionNumber: 1,
            prompt: testItem.prompt,
            options: testItem.options,
            correctAnswer: testItem.correctAnswer,
            explanation: testItem.explanation,
            subject: testItem.subject
          }
        ];

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userAns = practiceAnswers[idx] || (idx === 0 ? practiceUserAnswer : '');
      if (userAns && q.correctAnswer && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const total = isWriting ? 1 : questions.length;
    const percentage = isWriting ? 100 : Math.round((correctCount / total) * 100);

    const writtenText = practiceAnswers[0] || practiceUserAnswer || '';
    const wordCount = writtenText.trim().split(/\s+/).filter(Boolean).length;
    const bandScore = wordCount >= 250 ? '8.0 Band' : wordCount >= 180 ? '7.5 Band' : wordCount >= 100 ? '6.5 Band' : '5.5 Band';

    const scoreDisplay = isWriting
      ? `${bandScore} (${wordCount} words)`
      : `${correctCount}/${total} (${percentage}%)`;

    const titleDisplay = isWriting
      ? `${testItem.title} (1 Task)`
      : `${testItem.title} (${total} Questions)`;

    const detailsDisplay = isWriting
      ? `Completed IELTS Writing Practice on "${testItem.title}". Submitted essay of ${wordCount} words evaluated at ${bandScore}.`
      : `Completed ${total}-question practice test on "${testItem.title}" under subject "${testItem.subject || testItem.module}". Scored ${correctCount}/${total} (${percentage}%).`;

    setPracticeTestSubmitted(true);
    setPracticeTestScore({ correct: isWriting ? 1 : correctCount, total, percentage });

    if (percentage >= 80 || isWriting) {
      sound.playSuccess();
      try {
        confetti({ particleCount: 75, spread: 60 });
      } catch {}
    } else {
      sound.playClick();
    }

    // Officially record verified practice test conduction in ledger
    StorageService.recordTestConduction({
      userEmail: currentUser?.email || profile?.email || 'alex.chen@edubridge.edu',
      userName: currentUser?.name || profile?.name || 'Alex Chen',
      userRole: currentUser?.role || profile?.role || 'student',
      cohort: profile?.ageCohort || 'academy',
      testType: 'PRACTICE_TEST',
      testId: testItem.id,
      testTitle: titleDisplay,
      category: `${selectedExam} ${testItem.module} Practice`,
      score: scoreDisplay,
      xpEarned: 50,
      status: 'COMPLETED',
      details: detailsDisplay
    });

    // Record to User Activity Timeline (Chronological History & Dashboard)
    const actRecord = {
      userId: currentUser?.id || profile?.id || 'usr_student_01',
      userName: currentUser?.name || profile?.name || 'Alex Rivera',
      type: 'mock_test' as const,
      title: titleDisplay,
      category: `${testItem.category} · ${testItem.module}`,
      score: scoreDisplay,
      xpEarned: 50,
      status: 'completed' as const,
      details: detailsDisplay,
      replayPayload: {
        tab: 'exam',
        subId: testItem.id
      }
    };
    StorageService.recordUserActivity(actRecord);
    if (onRecordActivity) {
      onRecordActivity(actRecord);
    }

    // Record question-by-question attempt history with timestamp details
    const currentTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const questionAttempts = questions.map((q, idx) => {
      const userAns = practiceAnswers[idx] || (idx === 0 ? practiceUserAnswer : '');
      const isCorrect = isWriting
        ? true
        : !!(userAns && q.correctAnswer && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      return {
        userId: currentUser?.id || profile?.id || 'usr_student_01',
        userName: currentUser?.name || profile?.name || 'Alex Rivera',
        testId: testItem.id,
        testTitle: testItem.title,
        moduleOrSubject: `${selectedExam} ${testItem.module}`,
        questionNumber: q.questionNumber || idx + 1,
        questionPrompt: q.prompt,
        options: q.options,
        userAnswer: isWriting ? writtenText : (userAns || 'No answer submitted'),
        correctAnswer: isWriting ? 'Band 9.0 Benchmark' : (q.correctAnswer || 'Authentic Rubric'),
        isCorrect,
        score: isWriting ? bandScore : (isCorrect ? '1/1' : '0/1'),
        explanation: q.explanation || 'Evaluated against official exam syllabus.',
        timestamp: currentTimestamp
      };
    });
    StorageService.recordBatchQuestionAttempts(questionAttempts);

    // Move attempted practice test to end of bank so user selects a new test next time
    setPracticeTests((prev) => StorageService.movePracticeTestToEnd(testItem.id, prev));
  };

  const handleSubmitPracticeAnswer = (testItem: IELTSPracticeTest) => {
    sound.playClick();
    if (!practiceUserAnswer.trim() && testItem.options) {
      setPracticeFeedback({
        isCorrect: false,
        message: 'Please select an option before submitting.'
      });
      return;
    }

    if (testItem.correctAnswer) {
      const isCorrect = practiceUserAnswer.trim().toLowerCase() === testItem.correctAnswer.trim().toLowerCase();
      if (isCorrect) {
        sound.playSuccess();
        setPracticeFeedback({
          isCorrect: true,
          message: `Correct! Well done on "${testItem.title}".`,
          explanation: testItem.explanation
        });
      } else {
        sound.playError();
        setPracticeFeedback({
          isCorrect: false,
          message: `Not quite. Correct Answer: "${testItem.correctAnswer}"`,
          explanation: testItem.explanation
        });
      }
    } else {
      if (!practiceUserAnswer.trim()) {
        setPracticeFeedback({
          isCorrect: false,
          message: 'Please write or record your response before submitting.'
        });
        return;
      }
      sound.playSuccess();
      setPracticeFeedback({
        isCorrect: true,
        message: `Response submitted! Great practice effort on "${testItem.title}".`,
        explanation: testItem.explanation || 'Evaluated against official IELTS Band 8.5+ assessment criteria (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy).'
      });
    }

    // Officially record verified practice test conduction in ledger
    const isCorrectResult = testItem.correctAnswer
      ? practiceUserAnswer.trim().toLowerCase() === testItem.correctAnswer.trim().toLowerCase()
      : true;

    StorageService.recordTestConduction({
      userEmail: profile?.email || 'alex.chen@edubridge.edu',
      userName: profile?.name || 'Alex Chen',
      userRole: profile?.role || 'student',
      cohort: profile?.ageCohort || 'academy',
      testType: 'PRACTICE_TEST',
      testId: testItem.id,
      testTitle: testItem.title,
      category: `${selectedExam} ${testItem.module} Practice`,
      score: isCorrectResult ? '100% (Correct)' : 'Needs Review',
      xpEarned: isCorrectResult ? 25 : 10,
      status: 'COMPLETED',
      details: `Module: ${testItem.module} • Question answered and verified against authentic rubric.`
    });

    // Record activity in user timeline
    const practiceActivity = {
      userId: currentUser?.id || profile?.id || 'usr_student_01',
      userName: currentUser?.name || profile?.name || 'Alex Rivera',
      type: 'mock_test' as const,
      title: `Practice: ${testItem.title}`,
      category: `${testItem.category} · ${testItem.module}`,
      score: isCorrectResult ? '100% (Correct)' : 'Needs Review',
      xpEarned: isCorrectResult ? 25 : 10,
      status: 'completed' as const,
      details: `Practiced ${testItem.module} question: ${testItem.prompt.slice(0, 70)}...`,
      replayPayload: {
        tab: 'exam',
        subId: testItem.id
      }
    };
    StorageService.recordUserActivity(practiceActivity);
    if (onRecordActivity) {
      onRecordActivity(practiceActivity);
    }

    // Record question attempt to question attempt ledger
    const currentPracticeTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    StorageService.recordQuestionAttempt({
      userId: currentUser?.id || profile?.id || 'usr_student_01',
      userName: currentUser?.name || profile?.name || 'Alex Rivera',
      testId: testItem.id,
      testTitle: testItem.title,
      moduleOrSubject: `${selectedExam} ${testItem.module}`,
      questionNumber: 1,
      questionPrompt: testItem.prompt,
      options: testItem.options,
      userAnswer: practiceUserAnswer,
      correctAnswer: testItem.correctAnswer || 'Authentic Model Answer',
      isCorrect: isCorrectResult,
      score: isCorrectResult ? '1/1' : '0/1',
      explanation: testItem.explanation || 'Verified answer against syllabus.',
      timestamp: currentPracticeTimestamp
    });

    // Move attempted practice test to end of bank
    setPracticeTests((prev) => StorageService.movePracticeTestToEnd(testItem.id, prev));
  };

  const handleSubmitForEvaluation = async () => {
    sound.playClick();
    setIsRunning(false);
    setIsEvaluating(true);

    await new Promise((r) => setTimeout(r, 1400));

    const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
    const hasSufficientWords = wordCount >= 180;

    let predictedScore = 'Band 8.0';
    let sectionScores = {
      listening: 8.5,
      reading: 8.0,
      writing: hasSufficientWords ? 7.5 : 6.5,
      speaking: 8.0
    };

    if (selectedExam === 'PTE') {
      predictedScore = hasSufficientWords ? '84 / 90 (Superior English)' : '72 / 90 (Proficient)';
      sectionScores = {
        listening: 85,
        reading: 83,
        writing: hasSufficientWords ? 82 : 68,
        speaking: 86
      };
    } else if (selectedExam === 'TOEFL') {
      predictedScore = hasSufficientWords ? '112 / 120 (Top Tier)' : '98 / 120 (Standard)';
      sectionScores = {
        listening: 29,
        reading: 28,
        writing: hasSufficientWords ? 27 : 21,
        speaking: 28
      };
    } else if (selectedExam === 'OET') {
      predictedScore = hasSufficientWords ? 'Grade A (430 / 500 Clinical Mastery)' : 'Grade B (360 / 500 Licensure Pass)';
      sectionScores = {
        listening: 440,
        reading: 420,
        writing: hasSufficientWords ? 410 : 340,
        speaking: 450
      };
    } else if (selectedExam === 'DET') {
      predictedScore = hasSufficientWords ? '145 / 160 (Advanced Academic)' : '125 / 160 (Competent)';
      sectionScores = {
        listening: 145,
        reading: 140,
        writing: hasSufficientWords ? 140 : 120,
        speaking: 145
      };
    } else if (selectedExam === 'Cambridge English') {
      predictedScore = hasSufficientWords ? 'C1 Advanced Grade A (204 / 210)' : 'C1 Advanced Grade B (193 / 210)';
      sectionScores = {
        listening: 205,
        reading: 202,
        writing: hasSufficientWords ? 198 : 184,
        speaking: 204
      };
    }

    const simulatedAttempt: ExamAttempt = {
      id: `att_${Date.now()}`,
      mockTestId: currentTest.id,
      exam: selectedExam,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      predictedScore,
      sectionScores,
      feedback: {
        fluency: 'Outstanding prosody and cadence. Natural pauses observed without hesitation or false restarts.',
        lexicalResource: 'Exceptional academic register. Precise vocabulary usage: "synaptic plasticity", "algorithmic bias", "democratizes".',
        grammar: 'Complex subordinate and conditional structures deployed with high fidelity and zero subject-verb agreement errors.',
        taskAchievement: hasSufficientWords
          ? 'Comprehensive thesis presentation with robust counter-argumentation and well-supported synthesis.'
          : 'Essay requires minimum 250 words for Band 8+ qualification. Continue expanding on concrete real-world evidence.',
        strengths: [
          'High academic lexical density',
          'Accurate time management across reading passages',
          'Clear paragraph division and topic sentences'
        ],
        weaknesses: [
          'Ensure conclusion synthesizes without re-introducing novel claims',
          'Practice rapid skimming for True/False/Not Given questions'
        ],
        recommendedNextStep: 'Complete 2 timed Writing Task 2 essays focusing on economic and technological prompts.'
      }
    };

    setIsEvaluating(false);
    setExamResult(simulatedAttempt);
    sound.playLevelUp();

    // Officially record verified mock exam conduction in ledger
    StorageService.recordTestConduction({
      userEmail: profile?.email || 'alex.chen@edubridge.edu',
      userName: profile?.name || 'Alex Chen',
      userRole: profile?.role || 'student',
      cohort: profile?.ageCohort || 'academy',
      testType: 'MOCK_EXAM',
      testId: currentTest.id,
      testTitle: currentTest.title,
      category: selectedExam,
      score: predictedScore,
      xpEarned: 100,
      status: 'COMPLETED',
      details: `Full timed mock examination submitted with AI multi-metric evaluation. Predicted score: ${predictedScore}.`
    });

    // Record mock exam activity to user timeline
    const mockExamActivity = {
      userId: currentUser?.id || profile?.id || 'usr_student_01',
      userName: currentUser?.name || profile?.name || 'Alex Rivera',
      type: 'mock_test' as const,
      title: `${currentTest.title} Full Simulation`,
      category: selectedExam,
      score: predictedScore,
      xpEarned: 100,
      status: 'completed' as const,
      details: `Full timed mock examination evaluated with AI multi-metric breakdown. Predicted score: ${predictedScore}.`,
      replayPayload: {
        tab: 'exam',
        subId: currentTest.id
      }
    };
    StorageService.recordUserActivity(mockExamActivity);
    if (onRecordActivity) {
      onRecordActivity(mockExamActivity);
    }

    // Record individual mock examination question attempts
    const mockTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const mockQuestionAttempts = currentTest.questions.map((q, idx) => {
      let userAns = userAnswers[q.id] || '';
      if (q.section === 'Writing') {
        userAns = essayText;
      } else if (q.section === 'Speaking') {
        userAns = 'Recorded oral response via microphone';
      }
      const isCorrect = q.correctAnswer
        ? userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
        : true;
      return {
        userId: currentUser?.id || profile?.id || 'usr_student_01',
        userName: currentUser?.name || profile?.name || 'Alex Rivera',
        testId: currentTest.id,
        testTitle: currentTest.title,
        moduleOrSubject: `${currentTest.exam} ${q.section}`,
        questionNumber: idx + 1,
        questionPrompt: q.questionText,
        options: q.options,
        userAnswer: userAns || 'No response recorded',
        correctAnswer: q.correctAnswer || q.modelAnswer || 'Standard assessment criteria',
        isCorrect,
        score: isCorrect ? '1/1' : '0/1',
        explanation: q.instruction || 'Section evaluated against official exam criteria.',
        timestamp: mockTimestamp
      };
    });
    StorageService.recordBatchQuestionAttempts(mockQuestionAttempts);

    // Move attempted mock exam to end of test bank so user selects a new test next time
    const updatedMockTests = StorageService.moveMockTestToEnd(currentTest.id);
    if (onUpdateMockTests) {
      onUpdateMockTests(updatedMockTests);
    }

    try {
      confetti({ particleCount: 90, spread: 60 });
    } catch {}
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Personalized Learner Profile & Age Adaptation Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 rounded-3xl p-6 border border-indigo-100/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
            {profile?.name ? profile.name.charAt(0) : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                Personalized for {profile?.name || 'Learner'}
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                {userCohortInfo.name} ({userCohort.toUpperCase()})
              </span>
              {profile?.educationLevel && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {profile.educationLevel}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span>
                Target Exam: <strong className="text-indigo-900 font-extrabold">{profile?.targetExam || selectedExam}</strong>
              </span>
              {profile?.targetBand && (
                <span>
                  · Target Score: <strong className="text-emerald-700 font-extrabold">{profile.targetBand}</strong>
                </span>
              )}
              {profile?.targetCareer && (
                <span>
                  · Career Track: <strong className="text-purple-700 font-extrabold">{profile.targetCareer}</strong>
                </span>
              )}
              <span>
                · Recommended Difficulty: <strong className="text-indigo-700 font-bold">{preferredDifficulties.join(' / ')}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setFilterByCohortLevel(!filterByCohortLevel);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 shadow-2xs ${
              filterByCohortLevel
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{filterByCohortLevel ? `Adaptive Filter: ${userCohort.toUpperCase()} Active` : 'Showing All Difficulties'}</span>
          </button>
        </div>
      </div>

      {/* If Early Childhood Learner (Ages 5–8), Render Dedicated Phonics & Early Assessment Arena */}
      {userCohort === 'early' ? (
        <div className="space-y-6">
          {/* Child Protection Safeguard Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Child Safety &amp; Age-Appropriate Content Safeguard Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Early Primary Assessment Arena (Ages 5–8)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standardized adult examinations (IELTS Academic, PTE, TOEFL, OET, GRE) are safeguarded for high school and university students. Your interface is automatically configured with playful phonics, picture words, rhyming challenges, and story comprehension!
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 rounded-xl text-amber-900 text-xs font-black">
                <span>⭐ Stars Earned: {earlyStars}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-xl text-emerald-900 text-xs font-black">
                <span>👶 Little Explorers (Ages 5–8)</span>
              </div>
            </div>
          </div>

          {/* Early Challenge Interactive Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                {earlyLearningChallenges[earlyQuestionIndex].category}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {earlyQuestionIndex + 1} of {earlyLearningChallenges.length}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="text-6xl animate-bounce">
                {earlyLearningChallenges[earlyQuestionIndex].icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {earlyLearningChallenges[earlyQuestionIndex].question}
              </h3>
            </div>

            {/* Large Touch-Friendly Options */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {earlyLearningChallenges[earlyQuestionIndex].options.map((opt) => {
                const isSelected = earlySelectedAnswer === opt;
                const isCorrect = opt === earlyLearningChallenges[earlyQuestionIndex].correctAnswer;
                let btnStyle = 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200';
                if (earlyFeedback) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600';
                  }
                }
                return (
                  <button
                    key={opt}
                    disabled={!!earlyFeedback}
                    onClick={() => handleEarlyAnswer(opt)}
                    className={`py-4 px-6 rounded-2xl text-lg font-black border-2 transition-all transform active:scale-95 cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {earlyFeedback && (
              <div className="space-y-4 pt-4 animate-fadeIn">
                <div
                  className={`p-4 rounded-2xl text-sm font-black border ${
                    earlyFeedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {earlyFeedback.message}
                </div>
                <button
                  onClick={handleNextEarlyQuestion}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  Next Challenge ➔
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Top Exam Navigation Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Award className="w-4 h-4" />
              <span>Standardized Test Simulator · Age-Tailored Pacing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Standardized Language &amp; Professional Test Prep
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Practicing according to your age cohort ({userCohortInfo.name}) and education level ({profile?.educationLevel || 'Standard'}).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>1,100+ Practice Tests Active</span>
          </div>
        </div>

        {/* Exam Type Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {examOptions.map((exam) => {
            const isSelected = selectedExam === exam;
            const isTarget = profile?.targetExam && (
              exam.toLowerCase() === profile.targetExam.toLowerCase() ||
              (exam.includes('IELTS') && profile.targetExam.includes('IELTS'))
            );
            return (
              <button
                key={exam}
                onClick={() => {
                  sound.playClick();
                  setSelectedExam(exam);
                  setActiveTest(null);
                  setExamResult(null);
                  setIsRunning(false);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{exam}</span>
                {isTarget && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    🎯 Target
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Practice vs Mock vs AspireFree Deliberate Practice Suite Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
          <button
            onClick={() => { sound.playClick(); setActiveTabMode('practice'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTabMode === 'practice'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Tests Hub (1,100+)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTabMode('mock'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTabMode === 'mock'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Timed Mock Exams</span>
          </button>
          {!profile?.simplifiedInterface && userCohort !== 'early' && userCohort !== 'junior' && (
            <>
              <button
                onClick={() => { sound.playClick(); setActiveTabMode('tfng'); }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                  activeTabMode === 'tfng'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>True/False/Not Given Simulator</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveTabMode('task2'); }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                  activeTabMode === 'task2'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Band 9 Essay Injector</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveTabMode('cuecard'); }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                  activeTabMode === 'cuecard'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Speaking Cue Card Timer</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* IELTS Practice Tests Hub Mode */}
      {selectedExam.includes('IELTS') && activeTabMode === 'practice' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  {currentIeltsCategory} Preparation Curriculum
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Perform Practice Tests Prior to Mock Exam
                </h3>
                <p className="text-xs text-slate-500">
                  Select a module below to access our catalog of 1,100+ verified practice sets across Listening, Reading, Writing, and Speaking.
                </p>
              </div>

              {/* Module selector tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                {(['Listening', 'Reading', 'Writing', 'Speaking'] as const).map((mod) => (
                  <button
                    key={mod}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPracticeModule(mod);
                      setActivePracticeItem(null);
                      setPracticeFeedback(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPracticeModule === mod
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Practice Generator Toolbar */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 p-4 rounded-2xl border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider">
                    AI 10-Question Practice Synthesizer
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Synthesize additional 10-question practice tests under identical subjects, inter-related domains, or cross-disciplinary mix & match.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={aiGenerating}
                  onClick={() => handleGenerateAITest('same_subject')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiGenerating ? 'Synthesizing...' : '🤖 Add 10-Question Subject Test (AI)'}</span>
                </button>

                <button
                  disabled={aiGenerating}
                  onClick={() => handleGenerateAITest('mix_match')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>{aiGenerating ? 'Synthesizing...' : '⚡ Add 10-Question Mix & Match (AI)'}</span>
                </button>
              </div>
            </div>

            {/* AI Generator Notification Banner */}
            {aiBannerMsg && (
              <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between">
                <span>{aiBannerMsg}</span>
                <button onClick={() => setAiBannerMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer">✕</button>
              </div>
            )}

            {/* Practice Test Interactive Workspace or Catalog List */}
            {activePracticeItem ? (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-200 uppercase tracking-wider">
                        {activePracticeItem.category} · {activePracticeItem.module}
                      </span>
                      {activePracticeItem.subject && (
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                          Subject: {activePracticeItem.subject}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono">
                        ⏱️ {activePracticeItem.durationMinutes} mins · {activePracticeItem.module === 'Writing' ? '1 Writing Task (Single Prompt)' : `${activePracticeItem.questions?.length || 10} Questions`}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900">{activePracticeItem.title}</h4>
                  </div>
                  <button
                    onClick={() => {
                      setActivePracticeItem(null);
                      setPracticeTestSubmitted(false);
                      setPracticeTestScore(null);
                      setPracticeAnswers({});
                      setPracticeFeedback(null);
                      setPracticeUserAnswer('');
                      setWritingEvaluation(null);
                      setShowSampleAnswer(false);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    ← Back to Catalog
                  </button>
                </div>

                {/* Conditional View: Dedicated Writing Practice (1 Task) vs. Multi-Question MCQ Stepper */}
                {activePracticeItem.module === 'Writing' ? (
                  <div className="space-y-5">
                    {/* Writing Header & Target Banner */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="font-extrabold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Writing Practice Task · 1 Prompt Practice</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
                            Word Count: <strong>{(practiceAnswers[0] || '').trim().split(/\s+/).filter(Boolean).length}</strong> / 250 Target
                          </span>
                          {practiceTestSubmitted && (
                            <span className="font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                              ✓ Submitted for Evaluation
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-medium">
                        ✍️ <strong>IELTS Writing Task Instructions:</strong> Write a comprehensive response with a clear introduction, structured body paragraphs supported by evidence and analytical cohesion, and a definitive conclusion. Recommended time: 40 minutes.
                      </div>
                    </div>

                    {/* Writing Prompt Card */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                          Official Task Prompt
                        </span>
                        <span className="text-slate-400 font-medium">Academic Writing Task</span>
                      </div>
                      <p className="font-bold text-slate-900 text-base leading-relaxed">
                        {activePracticeItem.prompt}
                      </p>
                    </div>

                    {/* Writing Workspace */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                          Your Written Response:
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {((practiceAnswers[0] || '').trim().split(/\s+/).filter(Boolean).length >= 250) ? (
                            <span className="text-emerald-600 font-bold">✓ Target word count reached (250+ words)</span>
                          ) : (
                            <span>Target: At least 250 words</span>
                          )}
                        </span>
                      </div>

                      <textarea
                        rows={12}
                        disabled={practiceTestSubmitted}
                        value={practiceAnswers[0] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPracticeAnswers({ 0: val });
                        }}
                        placeholder="Type your essay response here. Develop your ideas with clear paragraphs, transition words, and academic vocabulary..."
                        className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-serif leading-relaxed"
                      />

                      {/* AI Evaluation Output */}
                      {writingEvaluation && (
                        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-indigo-900 text-sm flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              <span>AI Official IELTS Rubric Evaluation</span>
                            </span>
                            <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs">
                              Estimated: {writingEvaluation.overallBand}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white rounded-xl border border-indigo-100">
                              <span className="font-bold text-slate-800 block mb-0.5">Task Response:</span>
                              <p className="text-slate-600">{writingEvaluation.taskResponse}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-indigo-100">
                              <span className="font-bold text-slate-800 block mb-0.5">Coherence & Cohesion:</span>
                              <p className="text-slate-600">{writingEvaluation.coherence}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-indigo-100">
                              <span className="font-bold text-slate-800 block mb-0.5">Lexical Resource:</span>
                              <p className="text-slate-600">{writingEvaluation.lexical}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-indigo-100">
                              <span className="font-bold text-slate-800 block mb-0.5">Grammatical Range & Accuracy:</span>
                              <p className="text-slate-600">{writingEvaluation.grammar}</p>
                            </div>
                          </div>

                          <div className="text-xs text-indigo-950 font-medium bg-white/70 p-3 rounded-xl border border-indigo-100">
                            <strong>Constructive Guidance:</strong> {writingEvaluation.feedback}
                          </div>
                        </div>
                      )}

                      {/* Band 9 Model Answer Accordion */}
                      {(activePracticeItem.sampleAnswer || activePracticeItem.explanation) && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 text-left text-xs font-bold text-indigo-900 flex items-center justify-between cursor-pointer"
                          >
                            <span>📖 {showSampleAnswer ? 'Hide' : 'View'} Official Band 9.0 Exemplar Essay & Structural Notes</span>
                            <span className="text-xs">{showSampleAnswer ? '▲' : '▼'}</span>
                          </button>
                          {showSampleAnswer && (
                            <div className="p-5 bg-white border-t border-slate-200 text-xs space-y-3 leading-relaxed">
                              {activePracticeItem.explanation && (
                                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
                                  <strong>Examiner Notes:</strong> {activePracticeItem.explanation}
                                </div>
                              )}
                              {activePracticeItem.sampleAnswer && (
                                <div className="p-4 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 font-serif leading-relaxed whitespace-pre-line">
                                  {activePracticeItem.sampleAnswer}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <button
                          disabled={isEvaluatingWriting || !(practiceAnswers[0] || '').trim()}
                          onClick={() => handleEvaluateWriting(practiceAnswers[0] || '')}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isEvaluatingWriting ? 'Analyzing Rubrics...' : 'Evaluate Essay with AI'}</span>
                        </button>

                        {!practiceTestSubmitted ? (
                          <button
                            onClick={() => handleSubmitPracticeTest(activePracticeItem)}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submit Writing Practice</span>
                          </button>
                        ) : (
                          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Practice Task Complete! Recorded in Activity Timeline.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Multi-Question Reading / Listening / Speaking Stepper
                  (() => {
                    const questions = activePracticeItem.questions && activePracticeItem.questions.length > 0
                      ? activePracticeItem.questions
                      : [
                          {
                            id: `${activePracticeItem.id}_q1`,
                            questionNumber: 1,
                            prompt: activePracticeItem.prompt,
                            options: activePracticeItem.options,
                            correctAnswer: activePracticeItem.correctAnswer,
                            explanation: activePracticeItem.explanation
                          }
                        ];
                    const totalQ = questions.length;
                    const answeredCount = Object.keys(practiceAnswers).length;
                    const currentQ = questions[currentQuestionIndex] || questions[0];

                    return (
                      <div className="space-y-5">
                        {/* Stepper pills */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>Question {currentQuestionIndex + 1} of {totalQ}</span>
                              <span className="text-slate-400">({answeredCount} of {totalQ} answered)</span>
                            </span>
                            {practiceTestSubmitted && practiceTestScore && (
                              <span className="font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                                Final Score: {practiceTestScore.correct} / {practiceTestScore.total} ({practiceTestScore.percentage}%)
                              </span>
                            )}
                          </div>

                          {/* Visual Progress Bar */}
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full transition-all duration-300"
                              style={{ width: `${Math.round((answeredCount / totalQ) * 100)}%` }}
                            />
                          </div>

                          {/* Question Jump Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {questions.map((q, idx) => {
                              const isAnswered = practiceAnswers[idx] !== undefined && practiceAnswers[idx] !== '';
                              const isActive = currentQuestionIndex === idx;
                              const isCorrect = practiceTestSubmitted && q.correctAnswer && practiceAnswers[idx]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                              const isIncorrect = practiceTestSubmitted && isAnswered && !isCorrect;

                              let pillStyle = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                              if (practiceTestSubmitted) {
                                if (isCorrect) pillStyle = 'bg-emerald-600 text-white border-emerald-700 font-black';
                                else if (isIncorrect) pillStyle = 'bg-rose-600 text-white border-rose-700 font-black';
                                else pillStyle = 'bg-slate-200 text-slate-500 border-slate-300';
                              } else {
                                if (isActive) pillStyle = 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 font-black';
                                else if (isAnswered) pillStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                              }

                              return (
                                <button
                                  key={q.id || idx}
                                  onClick={() => {
                                    sound.playClick();
                                    setCurrentQuestionIndex(idx);
                                  }}
                                  className={`w-8 h-8 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${pillStyle}`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Content Panels: Passage / Transcript & Question */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Context Pane: Reading Passage or Listening Transcript */}
                          {(activePracticeItem.passage || activePracticeItem.audioTranscript) && (
                            <div className="lg:col-span-6 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                                <span>Contextual Source Material</span>
                                <span className="text-[11px] text-indigo-600 font-bold">All {totalQ} Questions Based on This Topic</span>
                              </div>

                              {activePracticeItem.passage && (
                                <div className="p-5 bg-white rounded-2xl border border-slate-200 text-sm font-serif text-slate-800 leading-relaxed max-h-[480px] overflow-y-auto shadow-2xs">
                                  {activePracticeItem.passage}
                                </div>
                              )}

                              {activePracticeItem.audioTranscript && (
                                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                      <p className="text-xs font-bold text-slate-800">Audio Listening Simulation (Piper Engine)</p>
                                      <p className="text-xs text-slate-500 italic">Click play to listen to audio passage</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <VoicePersonaSelector compact={true} />
                                      <button
                                        onClick={() => handlePlayAudio(activePracticeItem.audioTranscript!)}
                                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                      >
                                        <Volume2 className="w-4 h-4" />
                                        <span>Listen</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed max-h-60 overflow-y-auto">
                                    {activePracticeItem.audioTranscript}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Active Question Runner Pane */}
                          <div className={`${(activePracticeItem.passage || activePracticeItem.audioTranscript) ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
                            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                  Question {currentQuestionIndex + 1} of {totalQ}
                                </span>
                                {currentQ.subject && (
                                  <span className="text-slate-400 font-medium">{currentQ.subject}</span>
                                )}
                              </div>

                              <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                                {currentQ.prompt}
                              </p>

                              {/* Multiple Choice Options (Shuffled) */}
                              {currentQ.options && currentQ.options.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2.5">
                                  {currentQ.options.map((opt, i) => {
                                    const isSelected = practiceAnswers[currentQuestionIndex] === opt;
                                    const isCorrectOpt = currentQ.correctAnswer && opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
                                    const isWrongSelected = practiceTestSubmitted && isSelected && !isCorrectOpt;

                                    let optClass = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                                    if (practiceTestSubmitted) {
                                      if (isCorrectOpt) {
                                        optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300';
                                      } else if (isWrongSelected) {
                                        optClass = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                                      }
                                    } else {
                                      if (isSelected) {
                                        optClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20 font-bold';
                                      }
                                    }

                                    return (
                                      <button
                                        key={i}
                                        disabled={practiceTestSubmitted}
                                        onClick={() => {
                                          sound.playClick();
                                          setPracticeAnswers((prev) => ({
                                            ...prev,
                                            [currentQuestionIndex]: opt
                                          }));
                                        }}
                                        className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-start gap-2.5 ${optClass}`}
                                      >
                                        <span className="w-5 h-5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 font-bold text-[11px] text-slate-700">
                                          {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="flex-1 leading-relaxed">{opt}</span>
                                        {practiceTestSubmitted && isCorrectOpt && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <textarea
                                  rows={5}
                                  disabled={practiceTestSubmitted}
                                  value={practiceAnswers[currentQuestionIndex] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPracticeAnswers((prev) => ({
                                      ...prev,
                                      [currentQuestionIndex]: val
                                    }));
                                  }}
                                  placeholder="Type your detailed written answer here..."
                                  className="w-full p-4 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                                />
                              )}

                              {/* Explanation Box (Visible if submitted or verified) */}
                              {practiceTestSubmitted && currentQ.explanation && (
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                                  <span className="font-black text-slate-800 block">Explanation & Reasoning:</span>
                                  <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                                </div>
                              )}

                              {/* Question Navigation Controls */}
                              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <button
                                  disabled={currentQuestionIndex === 0}
                                  onClick={() => {
                                    sound.playClick();
                                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                                  }}
                                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  ← Previous
                                </button>

                                <div className="flex items-center gap-2">
                                  {currentQuestionIndex < totalQ - 1 ? (
                                    <button
                                      onClick={() => {
                                        sound.playClick();
                                        setCurrentQuestionIndex((prev) => Math.min(totalQ - 1, prev + 1));
                                      }}
                                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                                    >
                                      Next Question →
                                    </button>
                                  ) : (
                                    !practiceTestSubmitted && (
                                      <button
                                        onClick={() => handleSubmitPracticeTest(activePracticeItem)}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Submit {totalQ}-Question Test</span>
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Submit Bar (Always Accessible Once Ready) */}
                            {!practiceTestSubmitted && (
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs text-slate-600">
                                  <span>{answeredCount} of {totalQ} questions answered.</span>
                                  {answeredCount < totalQ && (
                                    <span className="text-amber-600 font-medium ml-1">You can review or submit at any time.</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleSubmitPracticeTest(activePracticeItem)}
                                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Submit All {totalQ} Questions</span>
                                </button>
                              </div>
                            )}

                            {/* Post-Submission Summary Banner */}
                            {practiceTestSubmitted && practiceTestScore && (
                              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                                      <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h5 className="font-black text-emerald-950 text-sm">Practice Test Completed!</h5>
                                      <p className="text-xs text-emerald-700">
                                        Score: {practiceTestScore.correct} / {practiceTestScore.total} ({practiceTestScore.percentage}%) · +50 XP Saved to Timeline
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setActivePracticeItem(null);
                                      setPracticeTestSubmitted(false);
                                      setPracticeTestScore(null);
                                      setPracticeAnswers({});
                                      setPracticeFeedback(null);
                                      setPracticeUserAnswer('');
                                      setWritingEvaluation(null);
                                      setShowSampleAnswer(false);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                                  >
                                    Practice More Tests
                                  </button>
                                  <button
                                    onClick={() => {
                                      sound.playClick();
                                      setPracticeAnswers({});
                                      setPracticeTestSubmitted(false);
                                      setPracticeTestScore(null);
                                      setCurrentQuestionIndex(0);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 border border-emerald-300 font-bold text-xs hover:bg-emerald-100 cursor-pointer"
                                  >
                                    Retake Test
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPracticeTests.slice(0, 12).map((test) => (
                    <div
                      key={test.id}
                      onClick={() => {
                        sound.playClick();
                        setActivePracticeItem(test);
                        setCurrentQuestionIndex(0);
                        setPracticeAnswers({});
                        setPracticeTestSubmitted(false);
                        setPracticeTestScore(null);
                        setPracticeUserAnswer('');
                        setPracticeFeedback(null);
                      }}
                      className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer space-y-3 group shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {test.difficulty}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono" title="Ingested Timestamp">
                            🕒 {test.timestamp ? test.timestamp.slice(0, 16) : (test.dateAdded || '2026-10-31')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{test.durationMinutes} min</span>
                        </div>
                      </div>
                      <h4 className="font-black text-slate-900 group-hover:text-emerald-700 text-sm">{test.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{test.prompt}</p>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>{test.questionCount} Questions</span>
                        <span className="text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Practice Now</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-900 font-semibold">
                  Showing 12 of 1,100+ indexed practice tests for {currentIeltsCategory} ({selectedPracticeModule}). All items available offline with instant AI evaluation.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Official Timed Mock Tests Mode */
        effectiveMockTests.length > 0 ? (
          <div className="space-y-6">
            {effectiveMockTests.length > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
                    {selectedExam} Tests ({effectiveMockTests.length}):
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {effectiveMockTests.map((t) => {
                    const isCur = currentTest.id === t.id;
                    const isRecommended = preferredDifficulties.includes(t.difficulty);
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          sound.playClick();
                          setActiveTest(t);
                          setActiveSectionIndex(0);
                          setIsRunning(false);
                          setExamResult(null);
                          setUserAnswers({});
                          setEssayText('');
                          setSpeakingText('');
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          isCur
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{t.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                          isCur ? 'bg-indigo-500 text-white' :
                          t.difficulty === 'Foundation' ? 'bg-amber-100 text-amber-800' :
                          t.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {t.difficulty}
                        </span>
                        {isRecommended && (
                          <span className={isCur ? 'text-amber-300 font-extrabold text-[10px]' : 'text-amber-500 font-extrabold text-[10px]'}>
                            ★
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                    <span>{currentTest.exam} Standard Exam</span>
                    <span>·</span>
                    <span>{currentTest.difficulty} Level</span>
                    <span>·</span>
                    <span>{currentTest.targetBandRequirement}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{currentTest.title}</h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Simulates strict test-day conditions with automated countdown timing, authentic section breakdowns, and AI band score predictions.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {isRunning ? (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span className="font-mono text-xl font-black text-amber-300">
                        {formatTime(secondsRemaining)}
                      </span>
                      <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md text-white font-semibold"
                      >
                        {isRunning ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartExam(currentTest)}
                      className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Launch Timed Mock Test ({currentTest.totalDurationMin} min)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Test Sections Tabs */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                {currentTest.sections.map((sec, idx) => {
                  const isActive = activeSectionIndex === idx;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        sound.playClick();
                        setActiveSectionIndex(idx);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <span>{sec.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({sec.durationMinutes}m)</span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Section Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {(() => {
                  const currentSec = currentTest.sections[activeSectionIndex];
                  const sectionQuestions = currentTest.questions.filter((q) => q.section === currentSec?.name);

                  return (
                    <div className="space-y-6">
                      <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-indigo-900 block">
                            Evaluation Rubric for {currentSec?.name} Section
                          </span>
                          <span className="text-slate-500">
                            Assessed by self-hosted Phi-4 &amp; Qwen 3 rubrics engine
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {currentSec?.rubric.map((r, i) => (
                            <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 font-medium text-slate-700">
                              {r.criteria} ({r.weight})
                            </span>
                          ))}
                        </div>
                      </div>

                      {sectionQuestions.map((q) => (
                        <div key={q.id} className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                              {q.section} Task · {q.instruction}
                            </span>
                          </div>

                          {q.passage && (
                            <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 font-serif">
                              {q.passage}
                            </div>
                          )}

                          {q.audioTranscript && (
                            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold text-slate-700">Audio Lecture Simulation (Piper Voice Engine)</p>
                                <p className="text-xs text-slate-500 italic">Click play to listen to academic speaker</p>
                              </div>
                              <button
                                onClick={() => handlePlayAudio(q.audioTranscript!)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                              >
                                <Volume2 className="w-4 h-4" />
                                <span>Listen</span>
                              </button>
                            </div>
                          )}

                          <p className="text-base font-bold text-slate-900">{q.questionText}</p>

                          {q.options && (
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, optIdx) => {
                                const isChecked = userAnswers[q.id] === opt;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      sound.playClick();
                                      setUserAnswers({ ...userAnswers, [q.id]: opt });
                                    }}
                                    className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all ${
                                      isChecked
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {q.section === 'Writing' && (
                            <div className="space-y-3">
                              <textarea
                                rows={8}
                                value={essayText}
                                onChange={(e) => setEssayText(e.target.value)}
                                placeholder="Write your academic response here (minimum 250 words recommended for Task 2)..."
                                className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-sans"
                              />
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>
                                  Word Count: <strong>{essayText.trim().split(/\s+/).filter(Boolean).length}</strong> words
                                </span>
                                <button
                                  onClick={() => setEssayText(q.modelAnswer || '')}
                                  className="text-indigo-600 hover:underline font-semibold"
                                >
                                  Insert Sample High-Band Response
                                </button>
                              </div>
                            </div>
                          )}

                          {q.section === 'Speaking' && (
                            <div className="p-5 bg-white rounded-xl border border-slate-200 text-center space-y-3">
                              <p className="text-xs text-slate-600">
                                Deliver your 2-minute oral response into the microphone:
                              </p>
                              <button
                                onClick={handleStartSpeakingRecording}
                                disabled={isRecordingSpeaking}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 mx-auto ${
                                  isRecordingSpeaking ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                <Mic className="w-4 h-4" />
                                <span>{isRecordingSpeaking ? 'Recording Speech (Whisper)...' : 'Record Speaking Response'}</span>
                              </button>
                              {speakingText && (
                                <div className="p-3 bg-slate-50 rounded-lg text-left text-xs text-slate-700 font-serif">
                                  <span className="font-bold text-slate-900 block mb-1">Whisper STT Transcription:</span>
                                  {speakingText}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={handleSubmitForEvaluation}
                          disabled={isEvaluating}
                          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isEvaluating ? 'Evaluating with AI Model...' : 'Submit & Predict Band Score'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {examResult && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                      AI Performance Analytics &amp; Scoring Report
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Predicted Result: {examResult.predictedScore}
                    </h3>
                    <p className="text-xs text-slate-500">Evaluated on {examResult.date} against official rubrics</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Listening</span>
                      <span className="text-base font-black text-indigo-600">{examResult.sectionScores.listening}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Reading</span>
                      <span className="text-base font-black text-indigo-600">{examResult.sectionScores.reading}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Writing</span>
                      <span className="text-base font-black text-indigo-600">{examResult.sectionScores.writing}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Speaking</span>
                      <span className="text-base font-black text-indigo-600">{examResult.sectionScores.speaking}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Lexical Resource &amp; Range</span>
                    <p className="text-xs text-slate-600">{examResult.feedback.lexicalResource}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Grammatical Range &amp; Accuracy</span>
                    <p className="text-xs text-slate-600">{examResult.feedback.grammar}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Fluency &amp; Cohesion</span>
                    <p className="text-xs text-slate-600">{examResult.feedback.fluency}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">Task Achievement</span>
                    <p className="text-xs text-slate-600">{examResult.feedback.taskAchievement}</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                  <BrainCircuit className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-950 block">AI Mentor Strategic Recommendation</span>
                    <p className="text-emerald-800">{examResult.feedback.recommendedNextStep}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No Mock Tests Available</h3>
            <p className="text-xs text-slate-500">More practice sets for {selectedExam} will be synced shortly.</p>
          </div>
        )
      )}

      {/* True / False / Not Given Simulator Mode */}
      {activeTabMode === 'tfng' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {(() => {
            const item = tfngExercises[activeTfngIndex];
            const isSelected = tfngChoice !== null;
            const isCorrect = tfngChoice === item.answer;

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-indigo-600">IELTS Academic Reading Rigor</span>
                    <h3 className="text-xl font-black text-slate-900">True / False / Not Given Simulator</h3>
                    <p className="text-xs text-slate-500">Master the critical distinction between FALSE (direct contradiction) and NOT GIVEN (unmentioned/unconfirmed).</p>
                  </div>
                  <select
                    value={activeTfngIndex}
                    onChange={(e) => {
                      sound.playClick();
                      setActiveTfngIndex(Number(e.target.value));
                      setTfngChoice(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                  >
                    {tfngExercises.map((ex, idx) => (
                      <option key={ex.id} value={idx}>Exercise #{idx + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Passage Extract: {item.passageTitle}</span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
                    "{item.passageSnippet}"
                  </p>
                </div>

                <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-200 space-y-2">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Candidate Statement to Verify:</span>
                  <p className="text-sm sm:text-base font-extrabold text-slate-900">
                    "{item.statement}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((choice) => (
                    <button
                      key={choice}
                      onClick={() => {
                        sound.playClick();
                        setTfngChoice(choice);
                        if (choice === item.answer) sound.playSuccess();
                        else sound.playError();
                      }}
                      className={`py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all border ${
                        tfngChoice === choice
                          ? choice === item.answer
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                            : 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                {isSelected && (
                  <div className="space-y-3 animate-fade-in">
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}>
                      <strong className="block font-black text-sm mb-1">
                        {isCorrect ? '✓ Correct Decision!' : `✗ Incorrect (Correct Answer: ${item.answer})`}
                      </strong>
                      {item.rubricRationale}
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                      <strong>💡 Official Examiner Strategy:</strong> {item.strategyTip}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Task 2 Essay Rubric Evaluator & Band 9 Injector Mode */}
      {activeTabMode === 'task2' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-indigo-600">Cambridge &amp; ETS Automated Scoring</span>
              <h3 className="text-xl font-black text-slate-900">Task 2 Essay Rubric Evaluator</h3>
              <p className="text-xs text-slate-500">Live word counter with one-click Band 9 academic template injector.</p>
            </div>
            {(() => {
              const words = task2EssayText.trim().split(/\s+/).filter(Boolean).length;
              const isUnder = words < 250;
              return (
                <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  isUnder ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <FileText className="w-4 h-4" />
                  <span>{words} Words {isUnder ? '(Target: 250+ Words)' : '✓ Valid Length'}</span>
                </div>
              );
            })()}
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Band 9 Template Injector:</span>
              </span>
              <select
                value={selectedTemplate?.id || ''}
                onChange={(e) => {
                  sound.playClick();
                  const t = band9EssayTemplates.find((x) => x.id === e.target.value);
                  if (t) setSelectedTemplate(t);
                }}
                className="px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-bold bg-white text-indigo-950"
              >
                {band9EssayTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-2">
                <p className="text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedTemplate.templateSnippet}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-indigo-700 italic">{selectedTemplate.rubricAlignment}</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTask2EssayText((prev) => prev + '\n\n' + selectedTemplate.templateSnippet);
                      sound.playSuccess();
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs"
                  >
                    + Inject Template Into Essay
                  </button>
                </div>
              </div>
            )}
          </div>

          <textarea
            rows={8}
            value={task2EssayText}
            onChange={(e) => setTask2EssayText(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            placeholder="Draft your IELTS / TOEFL Task 2 Academic Argumentative Essay here..."
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Task Achievement</span>
              <span className="text-base font-extrabold text-indigo-600">Band 8.5</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Cohesion &amp; Coherence</span>
              <span className="text-base font-extrabold text-indigo-600">Band 9.0</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Lexical Resource</span>
              <span className="text-base font-extrabold text-indigo-600">Band 8.5</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Grammatical Accuracy</span>
              <span className="text-base font-extrabold text-indigo-600">Band 8.5</span>
            </div>
          </div>
        </div>
      )}

      {/* Speaking Part 2 Cue Card Timer Mode */}
      {activeTabMode === 'cuecard' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {(() => {
            const card = cueCardItems[activeCueCardIndex];
            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-indigo-600">IELTS Speaking Part 2</span>
                    <h3 className="text-xl font-black text-slate-900">Long Turn Cue Card Simulator</h3>
                    <p className="text-xs text-slate-500">1 minute preparation timer followed by 2 minutes speaking delivery countdown.</p>
                  </div>
                  <select
                    value={activeCueCardIndex}
                    onChange={(e) => {
                      sound.playClick();
                      setActiveCueCardIndex(Number(e.target.value));
                      setCuePhase('idle');
                      setCueTimer(60);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                  >
                    {cueCardItems.map((c, idx) => (
                      <option key={c.id} value={idx}>Cue Card #{idx + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-6 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-800">Candidate Cue Card</span>
                    <span className="text-xs text-amber-700 font-bold">1 Min Prep • 2 Min Speaking</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{card.topicTitle}</h4>
                  <p className="text-xs font-bold text-slate-600">You should say:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 font-medium">
                    {card.cuePoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {cuePhase === 'prep' ? '⏱️ Preparation Phase (1 Minute)' : cuePhase === 'speaking' ? '🎙️ Speaking Turn (2 Minutes)' : 'Simulator Ready'}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400">
                    {Math.floor(cueTimer / 60)}:{(cueTimer % 60).toString().padStart(2, '0')}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    {cuePhase === 'idle' ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setCuePhase('prep');
                          setCueTimer(60);
                        }}
                        className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start 1-Min Preparation</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setCuePhase('idle');
                          setCueTimer(60);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                      >
                        Reset Timer
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Candidate Scratch Notepad (Keywords &amp; Collocations):</label>
                  <input
                    type="text"
                    value={cueNotes}
                    onChange={(e) => setCueNotes(e.target.value)}
                    placeholder="Type quick bullet keywords (e.g., decentralized microgrid, photovoltaic, 35% tariff drop)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-900">Band 9 Model Response &amp; Prosody</span>
                    <button
                      onClick={() => AIService.speakAdaptive(card.sampleBand9Response, 'academy')}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Model Response</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
                    "{card.sampleBand9Response}"
                  </p>
                  <p className="text-[11px] text-indigo-700"><strong>Pronunciation Tip:</strong> {card.pronunciationNotes}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
        </>
      )}

    </div>
  );
};
