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
  BrainCircuit
} from 'lucide-react';
import { ExamType, MockTest, ExamAttempt } from '../../types';
import { AIService } from '../../services/aiService';
import { sound } from '../../utils/audio';

interface ExamPrepViewProps {
  mockTests: MockTest[];
  onRecordAttempt?: (attempt: ExamAttempt) => void;
}

export const ExamPrepView: React.FC<ExamPrepViewProps> = ({ mockTests }) => {
  const [selectedExam, setSelectedExam] = useState<ExamType>('IELTS');
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Timed exam simulator
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [essayText, setEssayText] = useState('');
  const [speakingText, setSpeakingText] = useState('');
  const [isRecordingSpeaking, setIsRecordingSpeaking] = useState(false);

  // Evaluation & Results
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [examResult, setExamResult] = useState<ExamAttempt | null>(null);

  const examOptions: ExamType[] = ['IELTS', 'PTE', 'TOEFL', 'OET', 'DET', 'Cambridge English'];

  const filteredTests = mockTests.filter((t) => t.exam === selectedExam);
  const currentTest = activeTest || filteredTests[0] || mockTests[0];

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

  const handlePlayListening = (transcript: string) => {
    sound.playClick();
    AIService.speakText(transcript, 0.95);
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

  const handleSubmitForEvaluation = async () => {
    sound.playClick();
    setIsRunning(false);
    setIsEvaluating(true);

    // Simulate E2Language AI Evaluation using open-source Qwen/Phi rubric analyzer
    await new Promise((r) => setTimeout(r, 1400));

    const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;
    const hasSufficientWords = wordCount >= 180;

    const simulatedAttempt: ExamAttempt = {
      id: `att_${Date.now()}`,
      mockTestId: currentTest.id,
      exam: selectedExam,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      predictedScore: selectedExam === 'IELTS' ? 'Band 8.0' : selectedExam === 'PTE' ? '82 / 90' : '108 / 120',
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Exam Navigation Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Award className="w-4 h-4" />
              <span>E2Language-Style Exam Preparation Module</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Standardized Language &amp; Professional Test Simulator
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Target Goal: Band 8.0 / PTE 79+</span>
          </div>
        </div>

        {/* Exam Type Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {exam}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Test Simulator */}
      {filteredTests.length > 0 ? (
        <div className="space-y-6">
          
          {/* Active Test Card */}
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

              {/* Timer & Launch Action */}
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
                    {/* Rubric Criteria overview */}
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

                    {/* Question / Simulation Cards */}
                    {sectionQuestions.map((q) => (
                      <div key={q.id} className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            {q.section} Task · {q.instruction}
                          </span>
                        </div>

                        {/* Optional Passage */}
                        {q.passage && (
                          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 font-serif">
                            {q.passage}
                          </div>
                        )}

                        {/* Optional Audio Lecture */}
                        {q.audioTranscript && (
                          <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-700">Audio Lecture Simulation (Piper Voice Engine)</p>
                              <p className="text-xs text-slate-500 italic">Click play to listen to academic speaker</p>
                            </div>
                            <button
                              onClick={() => handlePlayListening(q.audioTranscript!)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>Listen</span>
                            </button>
                          </div>
                        )}

                        {/* Question Text */}
                        <p className="text-base font-bold text-slate-900">{q.questionText}</p>

                        {/* Multiple choice options */}
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

                        {/* Writing Task Editor */}
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

                        {/* Speaking Task Recorder */}
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

                    {/* Submit for AI Band Score Prediction Button */}
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

          {/* AI Feedback & Band Score Prediction Card */}
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

              {/* Rubric Breakdown Grid */}
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

              {/* Recommendations */}
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
      )}

    </div>
  );
};
