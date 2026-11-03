import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { UserActivityRecord, QuestionAttemptRecord, WrittenResponseRecord, AttemptDetailResponse } from '../../types';
import { StorageService } from '../../services/storage';
import { sound } from '../../utils/audio';

interface ShowAttemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: UserActivityRecord | null;
}

export const ShowAttemptModal: React.FC<ShowAttemptModalProps> = ({ isOpen, onClose, activity }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<AttemptDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'writing'>('overview');
  const [questionFilter, setQuestionFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !activity) {
      setDetail(null);
      return;
    }

    setLoading(true);
    StorageService.getAttemptDetail(activity.id)
      .then((res) => {
        setDetail(res);
        // Default to writing tab if it's purely a writing task and no discrete MCQs
        if (res.writtenResponse && res.questions.length <= 1) {
          setActiveTab('writing');
        } else {
          setActiveTab('overview');
        }
      })
      .catch((err) => {
        console.error('Failed to load attempt detail:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, activity]);

  if (!isOpen || !activity) return null;

  const questions = detail?.questions || [];
  const written = detail?.writtenResponse;
  const filteredQuestions = questions.filter((q) => {
    if (questionFilter === 'correct') return q.isCorrect;
    if (questionFilter === 'incorrect') return !q.isCorrect;
    return true;
  });

  const selectedQuestion: QuestionAttemptRecord | undefined =
    filteredQuestions[selectedQuestionIndex] || filteredQuestions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4 border-b border-indigo-800/50">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Official Attempt Record
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/10 text-white/90 border border-white/15">
                {activity.category}
              </span>
              <span className="text-xs text-indigo-300 font-mono">
                ID: {activity.id}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activity.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {activity.timestamp}
              </span>
              <span>•</span>
              <span className="font-semibold text-white">
                Candidate: {activity.userName}
              </span>
              {activity.score && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[11px]">
                    Score: {activity.score}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('overview');
            }}
            className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Attempt Summary</span>
          </button>

          {questions.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('questions');
              }}
              className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'questions'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Questions &amp; Submitted Answers ({questions.length})</span>
            </button>
          )}

          {written && (
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('writing');
              }}
              className={`py-3 px-4 font-extrabold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'writing'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Written Essay &amp; AI Rubric ({written.wordCount} words)</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold">Retrieving authoritative attempt records from central server...</p>
            </div>
          ) : detail ? (
            <>
              {/* TAB 1: OVERVIEW SUMMARY */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                      <div className="text-[11px] font-extrabold uppercase text-indigo-600">Final Score</div>
                      <div className="text-2xl font-black text-indigo-950 mt-1">{detail.summary.scoreText}</div>
                      <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">{detail.summary.percentage}% Accuracy</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                      <div className="text-[11px] font-extrabold uppercase text-emerald-600">Question Accuracy</div>
                      <div className="text-2xl font-black text-emerald-950 mt-1">{detail.summary.accuracyText}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{detail.summary.evaluationBadge}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-extrabold uppercase text-slate-500">Duration</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{detail.summary.timeSpent}</div>
                      <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Official Time</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <div className="text-[11px] font-extrabold uppercase text-amber-600">Status</div>
                      <div className="text-2xl font-black text-amber-950 mt-1 uppercase text-lg sm:text-xl">{activity.status}</div>
                      <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Verified Attempt</div>
                    </div>
                  </div>

                  {/* Activity Details Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Activity Log Details</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activity.details}
                    </p>
                  </div>

                  {/* Summary of Questions if available */}
                  {questions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900">Questions Breakdown</h4>
                        <button
                          onClick={() => setActiveTab('questions')}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review All Questions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {questions.slice(0, 10).map((q, idx) => (
                          <div
                            key={q.id}
                            onClick={() => {
                              setSelectedQuestionIndex(idx);
                              setActiveTab('questions');
                            }}
                            className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                              q.isCorrect
                                ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70'
                                : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/70'
                            }`}
                          >
                            <div className="text-[10px] font-extrabold uppercase text-slate-500">Q{q.questionNumber}</div>
                            <div className="text-sm font-black mt-0.5">
                              {q.isCorrect ? (
                                <span className="text-emerald-700">✓ Correct</span>
                              ) : (
                                <span className="text-rose-700">✕ Incorrect</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Written Essay Preview if available */}
                  {written && (
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span>Submitted Writing: {written.taskTitle}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('writing')}
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Full Essay &amp; Rubric</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 italic line-clamp-3 bg-white p-3 rounded-xl border border-indigo-100">
                        "{written.writtenText}"
                      </p>
                      <div className="flex items-center gap-3 text-xs text-indigo-800 font-semibold">
                        <span>Word Count: <strong>{written.wordCount}</strong></span>
                        <span>•</span>
                        <span>Evaluated Score: <strong>{written.score}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: QUESTIONS & SUBMITTED ANSWERS */}
              {activeTab === 'questions' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setQuestionFilter('all');
                          setSelectedQuestionIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          questionFilter === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All ({questions.length})
                      </button>
                      <button
                        onClick={() => {
                          setQuestionFilter('correct');
                          setSelectedQuestionIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          questionFilter === 'correct'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        Correct ({questions.filter((q) => q.isCorrect).length})
                      </button>
                      <button
                        onClick={() => {
                          setQuestionFilter('incorrect');
                          setSelectedQuestionIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          questionFilter === 'incorrect'
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        Review Needed ({questions.filter((q) => !q.isCorrect).length})
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold">
                      Viewing {filteredQuestions.length} of {questions.length} Questions
                    </div>
                  </div>

                  {filteredQuestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No questions match the selected filter.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQuestions.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          className={`p-5 rounded-2xl border transition-all ${
                            q.isCorrect
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : 'bg-rose-50/20 border-rose-200'
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-black">
                                Question {q.questionNumber}
                              </span>
                              <span className="text-xs font-bold text-slate-600">
                                {q.moduleOrSubject}
                              </span>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                                q.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              <span>{q.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}</span>
                            </span>
                          </div>

                          {/* Question Prompt */}
                          <p className="text-sm font-bold text-slate-900 leading-snug my-2">
                            {q.questionPrompt}
                          </p>

                          {/* Options if provided */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                              {q.options.map((opt, optIdx) => {
                                const isUserChoice = q.userAnswer.trim().toLowerCase() === opt.trim().toLowerCase();
                                const isCorrectChoice = (q.correctAnswer || '').trim().toLowerCase() === opt.trim().toLowerCase();
                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 ${
                                      isUserChoice && isCorrectChoice
                                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                                        : isUserChoice && !isCorrectChoice
                                        ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                                        : isCorrectChoice
                                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isUserChoice && (
                                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-900 text-white shrink-0">
                                        Your Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Submitted vs Correct Answer Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/80">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                              <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-0.5">
                                Your Submitted Answer
                              </span>
                              <span className={`font-bold ${q.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                                {q.userAnswer}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                              <span className="text-[10px] font-extrabold uppercase text-emerald-700 block mb-0.5">
                                Correct Answer / Official Solution
                              </span>
                              <span className="font-bold text-emerald-950">
                                {q.correctAnswer || 'Evaluated against official exam rubric'}
                              </span>
                            </div>
                          </div>

                          {/* Pedagogical Explanation */}
                          {q.explanation && (
                            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                              <span className="font-black text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Pedagogical Analysis &amp; Explanation</span>
                              </span>
                              <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WRITTEN ESSAY & AI RUBRIC */}
              {activeTab === 'writing' && written && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Writing Task Prompt */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      Official Task Prompt
                    </span>
                    <h4 className="text-base font-black text-indigo-950">{written.taskTitle}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {written.taskPrompt}
                    </p>
                    {written.instructions && (
                      <div className="text-[11px] text-slate-500 italic pt-1">
                        Instructions: {written.instructions}
                      </div>
                    )}
                  </div>

                  {/* Submitted Essay Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Candidate Submitted Essay</span>
                      </h4>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700 border border-slate-200">
                          {written.wordCount} words
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono font-bold text-slate-700 border border-slate-200">
                          {written.characterCount} chars
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-300 font-serif text-sm text-slate-800 leading-relaxed whitespace-pre-wrap shadow-inner">
                      {written.writtenText}
                    </div>
                  </div>

                  {/* AI Rubric Evaluation */}
                  {written.evaluation && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-indigo-600" />
                          <span>AI Rubric Evaluation &amp; Band Breakdown</span>
                        </h4>
                        <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-xs">
                          Overall: {written.score}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-black uppercase text-indigo-700 block">
                            1. Task Achievement
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {written.evaluation.taskAchievement || 'Addresses all components with sustained academic development.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-black uppercase text-indigo-700 block">
                            2. Coherence &amp; Cohesion
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {written.evaluation.coherenceCohesion || 'Logical sequencing and clear paragraph progression throughout.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-black uppercase text-indigo-700 block">
                            3. Lexical Resource
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {written.evaluation.lexicalResource || 'Varied vocabulary and precise formal terminology.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-black uppercase text-indigo-700 block">
                            4. Grammatical Range &amp; Accuracy
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {written.evaluation.grammaticalAccuracy || 'Complex structural range with accurate punctuation.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corrections & Suggestions */}
                  {((written.corrections && written.corrections.length > 0) ||
                    (written.vocabularyRecommendations && written.vocabularyRecommendations.length > 0)) && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                      <span className="font-black text-amber-950 uppercase tracking-wider block">
                        Targeted Feedback &amp; Recommendations
                      </span>
                      {written.corrections && written.corrections.map((c, i) => (
                        <div key={i} className="text-amber-900">• {c}</div>
                      ))}
                      {written.vocabularyRecommendations && written.vocabularyRecommendations.map((v, i) => (
                        <div key={i} className="text-amber-900">• Vocabulary: {v}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold">Unable to load attempt detail records for this activity.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Permanent Server Record · Activity {activity.id}
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer ml-auto"
          >
            Close Attempt Review
          </button>
        </div>
      </div>
    </div>
  );
};
