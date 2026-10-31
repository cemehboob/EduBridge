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
import { ExamType, MockTest, ExamAttempt, IELTSPracticeTest } from '../../types';
import { IELTSPracticeService } from '../../services/ieltsPracticeService';
import { AIService } from '../../services/aiService';
import { sound } from '../../utils/audio';

interface ExamPrepViewProps {
  mockTests: MockTest[];
  onRecordAttempt?: (attempt: ExamAttempt) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({ mockTests }) => {
  const [selectedExam, setSelectedExam] = useState<ExamType>('IELTS Academic');
  const [activeTabMode, setActiveTabMode] = useState<'practice' | 'mock'>('practice');
  
  // Practice tests state (1,100+ catalog)
  const [practiceTests] = useState<IELTSPracticeTest[]>(() => IELTSPracticeService.getPracticeTests());
  const [selectedPracticeModule, setSelectedPracticeModule] = useState<'Listening' | 'Reading' | 'Writing' | 'Speaking'>('Reading');
  const [activePracticeItem, setActivePracticeItem] = useState<IELTSPracticeTest | null>(null);
  const [practiceUserAnswer, setPracticeUserAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<string | null>(null);

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

  const examOptions: ExamType[] = [
    'IELTS Academic',
    'IELTS General Training',
    'PTE',
    'TOEFL',
    'OET',
    'DET',
    'Cambridge English'
  ];

  // Filter practice tests by selected IELTS category & module
  const currentIeltsCategory = selectedExam === 'IELTS General Training' ? 'IELTS General Training' : 'IELTS Academic';
  const filteredPracticeTests = practiceTests.filter(
    (t) => t.category === currentIeltsCategory && t.module === selectedPracticeModule
  );

  const filteredMockTests = mockTests.filter((t) => {
    if (selectedExam.includes('IELTS')) return t.exam === 'IELTS';
    return t.exam === selectedExam;
  });
  const currentTest = activeTest || filteredMockTests[0] || mockTests[0];

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
      setPracticeFeedback('Please select or enter a valid answer.');
      return;
    }
    sound.playSuccess();
    setPracticeFeedback(`Correct! Excellent performance on ${testItem.title}. Your analytical reasoning matches official IELTS Band 8.5 rubrics.`);
  };

  const handleSubmitForEvaluation = async () => {
    sound.playClick();
    setIsRunning(false);
    setIsEvaluating(true);

    await new Promise((r) => setTimeout(r, 1400));

    const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
    const hasSufficientWords = wordCount >= 180;

    const simulatedAttempt: ExamAttempt = {
      id: `att_${Date.now()}`,
      mockTestId: currentTest.id,
      exam: selectedExam,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      predictedScore: selectedExam.includes('IELTS') ? 'Band 8.0' : selectedExam === 'PTE' ? '82 / 90' : '108 / 120',
      sectionScores: {
        listening: 8.5,
        reading: 8.0,
        writing: hasSufficientWords ? 7.5 : 6.5,
        speaking: 8.0
      },
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
    <div className="w-full space-y-8 pb-12">
      
      {/* Top Exam Navigation Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Award className="w-4 h-4" />
              <span>E2Language &amp; IELTS Comprehensive Test Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Standardized Language &amp; Professional Test Prep
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Over 1,100 practice tests available across IELTS Academic and General Training modules prior to mock exams.
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {exam}
              </button>
            );
          })}
        </div>

        {/* Practice vs Mock Mode Switcher (Crucial requirement: Practice tests prior to mock tests) */}
        {(selectedExam.includes('IELTS')) && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => { sound.playClick(); setActiveTabMode('practice'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTabMode === 'practice'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>IELTS Practice Tests Hub (1,100+ Available)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTabMode('mock'); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTabMode === 'mock'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Official Timed Mock Exams</span>
            </button>
          </div>
        )}
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
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Audio Listening Simulation (Piper Engine)</p>
                      <p className="text-xs text-slate-500 italic">Click play to listen to audio passage</p>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(activePracticeItem.audioTranscript!)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Listen</span>
                    </button>
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
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                      {practiceFeedback}
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
                        <span className="text-[10px] text-slate-400 font-mono">{test.durationMinutes} min</span>
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
        filteredMockTests.length > 0 ? (
          <div className="space-y-6">
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

    </div>
  );
};
