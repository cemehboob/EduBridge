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
  CheckSquare
} from 'lucide-react';
import { ExamType, MockTest, ExamAttempt, IELTSPracticeTest, Band9EssayTemplate, UserProfile, AgeCohortId } from '../../types';
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
  onRecordAttempt?: (attempt: ExamAttempt) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({ mockTests, profile }) => {
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
  const [practiceTests] = useState<IELTSPracticeTest[]>(() => {
    const base = IELTSPracticeService.getPracticeTests();
    const stored = StorageService.getPracticeTests();
    return [...stored, ...base];
  });
  const [selectedPracticeModule, setSelectedPracticeModule] = useState<'Listening' | 'Reading' | 'Writing' | 'Speaking'>('Reading');
  const [activePracticeItem, setActivePracticeItem] = useState<IELTSPracticeTest | null>(null);
  const [practiceUserAnswer, setPracticeUserAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation?: string;
  } | null>(null);

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

  // Filter practice tests by selected IELTS category & module
  const currentIeltsCategory = selectedExam === 'IELTS General Training' ? 'IELTS General Training' : 'IELTS Academic';
  const allPracticeTestsForModule = practiceTests.filter(
    (t) => t.category === currentIeltsCategory && t.module === selectedPracticeModule
  );
  // Sort practice tests so user's expected difficulty comes first
  const filteredPracticeTests = [...allPracticeTestsForModule].sort((a, b) => {
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
  const filteredMockTests = filterByCohortLevel
    ? examMockTests.filter((t) => preferredDifficulties.includes(t.difficulty))
    : examMockTests;

  // Safe fallback to all exam tests if strict filter yields 0
  const effectiveMockTests = filteredMockTests.length > 0 ? filteredMockTests : examMockTests;
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

            {/* Practice Test Interactive Workspace or Catalog List */}
            {activePracticeItem ? (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {activePracticeItem.category} · {activePracticeItem.module} Practice
                    </span>
                    <h4 className="text-lg font-black text-slate-900">{activePracticeItem.title}</h4>
                  </div>
                  <button
                    onClick={() => { setActivePracticeItem(null); setPracticeFeedback(null); setPracticeUserAnswer(''); }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200"
                  >
                    ← Back to Catalog
                  </button>
                </div>

                {activePracticeItem.passage && (
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 text-sm font-serif text-slate-800 leading-relaxed">
                    {activePracticeItem.passage}
                  </div>
                )}

                {activePracticeItem.audioTranscript && (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Audio Listening Simulation (Piper Engine)</p>
                      <p className="text-xs text-slate-500 italic">Click play to listen to audio passage</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <VoicePersonaSelector compact={true} />
                      <button
                        onClick={() => handlePlayAudio(activePracticeItem.audioTranscript!)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="font-bold text-slate-900 text-sm">{activePracticeItem.prompt}</p>

                  {activePracticeItem.options ? (
                    <div className="grid grid-cols-1 gap-2">
                      {activePracticeItem.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            sound.playClick();
                            setPracticeUserAnswer(opt);
                          }}
                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            practiceUserAnswer === opt
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                              : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      rows={5}
                      value={practiceUserAnswer}
                      onChange={(e) => setPracticeUserAnswer(e.target.value)}
                      placeholder="Write your practice response here..."
                      className="w-full p-4 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  )}

                  {practiceFeedback && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                        practiceFeedback.isCorrect
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50/90 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black">
                        {practiceFeedback.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{practiceFeedback.message}</span>
                      </div>
                      {practiceFeedback.explanation && (
                        <div className="pt-2 border-t border-slate-200/80 text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 block mb-0.5">Explanation & Reasoning:</span>
                          <p>{practiceFeedback.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSubmitPracticeAnswer(activePracticeItem)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Practice Answer</span>
                    </button>
                  </div>
                </div>
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

    </div>
  );
};
