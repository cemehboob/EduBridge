import React, { useState, useEffect } from 'react';
import {
  Brain,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Trophy,
  Filter,
  Zap,
  Target,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronRight,
  Star,
  ShieldCheck,
  Flame,
  UserCheck
} from 'lucide-react';
import { VocabularyWord, UserProfile, AgeCohortId } from '../../types';
import { sound } from '../../utils/audio';
import { triggerCelebration } from '../../utils/celebration';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { cohortQuizCategories, cohortQuizQuestions, CohortQuizQuestion } from '../../data/cohortQuizzesData';
import { calculateCohortFromDob, calculateEducationLevel } from '../../utils/userProfile';

interface VocabularyQuizProps {
  vocabularyWords?: VocabularyWord[];
  profile?: UserProfile;
  onCompleteQuiz?: (score: number, totalQuestions: number, xpEarned: number) => void;
}

type QuizTrack = 'cohort' | 'cefr';

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  vocabularyWords = [],
  profile,
  onCompleteQuiz
}) => {
  // Infer user cohort or fallback to academy
  const userInferredCohort: AgeCohortId =
    profile?.ageCohort || (profile?.dateOfBirth ? calculateCohortFromDob(profile.dateOfBirth) : 'academy');

  // Track & Cohort config state
  const [activeTrack, setActiveTrack] = useState<QuizTrack>('cohort');
  const [selectedCohort, setSelectedCohort] = useState<AgeCohortId>(userInferredCohort);
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');

  // Sync cohort whenever profile changes (e.g. user login switch)
  useEffect(() => {
    if (profile?.ageCohort) {
      setSelectedCohort(profile.ageCohort);
    } else if (profile?.dateOfBirth) {
      setSelectedCohort(calculateCohortFromDob(profile.dateOfBirth));
    }
    // Reset active quiz on user switch to ensure fresh state
    setIsQuizActive(false);
    setIsQuizFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
  }, [profile?.id, profile?.ageCohort, profile?.dateOfBirth]);

  // Quiz execution state
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [cohortQuestions, setCohortQuestions] = useState<CohortQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: string; isCorrect: boolean }[]>([]);
  const [streakCombo, setStreakCombo] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Active category info
  const activeCategoryInfo = cohortQuizCategories.find((c) => c.id === selectedCohort) || cohortQuizCategories[2];

  // Speech helper with cohort-adaptive pitch and pace
  const handleSpeak = (text: string) => {
    sound.playClick();
    if (selectedCohort === 'senior') {
      AIService.speakSeniorClear(text);
    } else {
      AIService.speakAdaptive(text, selectedCohort);
    }
  };

  // Start Quiz Handler
  const handleStartQuiz = () => {
    sound.playClick();
    // Filter questions by selected cohort: unattempted questions come first, attempted move to end of bank
    const pool = cohortQuizQuestions.filter((q) => q.cohort === selectedCohort);
    const attemptedIds = StorageService.getAttemptedCohortQuizIds();
    const unattempted = pool.filter((q) => !attemptedIds.includes(q.id));
    const attempted = pool
      .filter((q) => attemptedIds.includes(q.id))
      .sort((a, b) => attemptedIds.indexOf(a.id) - attemptedIds.indexOf(b.id));

    const orderedPool = [...unattempted, ...attempted];
    const finalSelection = orderedPool.length > 0 ? orderedPool : pool;

    setCohortQuestions(finalSelection);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setStreakCombo(0);
    setMaxStreak(0);
    setStarsEarned(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);

    // Initial voice prompt
    if (finalSelection[0]) {
      handleSpeak(finalSelection[0].prompt);
    }
  };

  // Answer selection
  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedOption(option);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQ = cohortQuestions[currentIndex];
    const isCorrect = selectedOption.trim() === currentQ.correctAnswer.trim();

    setIsSubmitted(true);

    if (isCorrect) {
      sound.playSuccess();
      const nextStreak = streakCombo + 1;
      setStreakCombo(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setStarsEarned((s) => s + 1);

      // Play vocal praise for early and senior learners
      if (selectedCohort === 'early') {
        AIService.speakAdaptive(currentQ.praise, 'early');
      } else if (selectedCohort === 'senior') {
        AIService.speakSeniorClear(currentQ.praise);
      }
    } else {
      sound.playError();
      // For senior learners, maintain calm zero-stress positive tone
      if (selectedCohort !== 'senior') {
        setStreakCombo(0);
      }
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: selectedOption,
        isCorrect
      }
    ]);
  };

  // Next Question / Finish
  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex < cohortQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsSubmitted(false);
      if (cohortQuestions[nextIdx]) {
        handleSpeak(cohortQuestions[nextIdx].prompt);
      }
    } else {
      // Quiz finished
      const correct = userAnswers.filter((a) => a.isCorrect).length;
      const total = cohortQuestions.length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const xpEarned = correct * 20 + maxStreak * 10;

      setIsQuizFinished(true);
      setIsQuizActive(false);

      // Record question-by-question attempt history with timestamp details
      const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const questionAttempts = userAnswers.map((ans, idx) => {
        const question = cohortQuestions.find((q) => q.id === ans.questionId) || cohortQuestions[idx];
        return {
          userId: profile?.id || 'usr_student_01',
          userName: profile?.name || 'Alex Rivera',
          testId: `vocab_quiz_${selectedCohort}`,
          testTitle: `Vocabulary Quiz: ${activeCategoryInfo.name}`,
          moduleOrSubject: 'Vocabulary',
          questionNumber: idx + 1,
          questionPrompt: question?.prompt || `Vocabulary Word Assessment #${idx + 1}`,
          options: question?.options,
          userAnswer: ans.selected,
          correctAnswer: question?.correctAnswer,
          isCorrect: ans.isCorrect,
          score: ans.isCorrect ? '1/1' : '0/1',
          explanation: question?.explanation || 'Assessed against cohort lexicon standards.',
          timestamp: nowTimestamp
        };
      });
      StorageService.recordBatchQuestionAttempts(questionAttempts);

      // Record quiz activity to user timeline
      StorageService.recordUserActivity({
        userId: profile?.id || 'usr_student_01',
        userName: profile?.name || 'Alex Rivera',
        type: 'vocab_quiz',
        title: `Vocabulary Quiz: ${activeCategoryInfo.name}`,
        category: 'Vocabulary Track',
        score: `${correct}/${total} (${accuracy}%)`,
        xpEarned,
        status: 'completed',
        details: `Tested on vocabulary definitions and lexical accuracy: ${correct}/${total} correct (${accuracy}%).`,
        replayPayload: {
          tab: 'vocab_quiz',
          subId: selectedCohort
        }
      });

      // Move attempted quiz questions to end of quiz bank
      StorageService.recordAttemptedCohortQuizIds(cohortQuestions.map((q) => q.id));

      if (accuracy >= 80) {
        triggerCelebration('daily_goal');
      }

      if (onCompleteQuiz) {
        onCompleteQuiz(correct, total, xpEarned);
      }
    }
  };

  const currentQ = cohortQuestions[currentIndex];
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const totalQuestions = cohortQuestions.length;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const totalXpEarned = correctCount * 20 + maxStreak * 10;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner Header with User Personalization */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-black uppercase tracking-wider text-teal-300 backdrop-blur-md">
              <Brain className="w-3.5 h-3.5" />
              <span>Age &amp; Education Calibrated Mastery Quizzes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Adaptive Vocabulary &amp; Concept Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dynamically tailored across 5 developmental stages—from Montessori phonics &amp; sight words for young explorers to high-stakes exam lexicons, executive diplomacy, and senior cognitive vitality.
            </p>
          </div>

          {/* User Profile Personalization Badge */}
          {profile && (
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-indigo-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                {profile.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] text-teal-300 font-extrabold uppercase tracking-wider block">
                  Active Learner
                </span>
                <div className="text-xs font-black text-white">{profile.name}</div>
                <div className="text-[11px] text-slate-300">
                  {profile.educationLevel || calculateEducationLevel(profile.dateOfBirth)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: Quiz Configuration & Age Cohort Selector (Before starting) */}
      {!isQuizActive && !isQuizFinished && (
        <div className="space-y-6">
          
          {/* 5-Level Age & Education Cohort Switcher */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                  Developmental Stage Calibration
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Select Educational Level &amp; Cognitive Focus
                </h3>
                <p className="text-xs text-slate-500">
                  Automatically calibrated to your profile, or pick any level to explore.
                </p>
              </div>

              {profile && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Calibrated for: {profile.name.split(' ')[0]} ({activeCategoryInfo.badge})</span>
                </div>
              )}
            </div>

            {/* 5 Cohort Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {cohortQuizCategories.map((cat) => {
                const isSelected = selectedCohort === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCohort(cat.id);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/60 border-indigo-600 shadow-md ring-2 ring-indigo-500/20 translate-y-[-2px]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon}</span>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mt-2">
                        {cat.ageRange}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-indigo-700 mt-1">{cat.badge}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Level Summary & Start CTA */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeCategoryInfo.icon}</span>
                  <span className="text-xs font-black uppercase text-indigo-600">
                    {activeCategoryInfo.defaultModeName}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Ready to test: {activeCategoryInfo.name} ({activeCategoryInfo.ageRange})
                </h4>
                <p className="text-xs text-slate-600">
                  {selectedCohort === 'early' && 'Includes picture sight words, phonics sounds, cheerful voice, and stars.'}
                  {selectedCohort === 'junior' && 'Includes middle-school science, bioluminescence, photosynthesis, and physics velocity.'}
                  {selectedCohort === 'academy' && 'Includes IELTS Academic Band 8.5+ lexicon, Task 2 collocations, and formal register.'}
                  {selectedCohort === 'pro' && 'Includes corporate diplomacy, de-escalation tactics, scope creep, and executive cadence.'}
                  {selectedCohort === 'senior' && 'Includes digital scam spotting, neuroplasticity facts, and calm 0.82x voice narration.'}
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Start Calibrated Quiz Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Active Quiz Runner */}
      {isQuizActive && currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeCategoryInfo.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                  {currentQ.educationLevel}
                </span>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Question {currentIndex + 1} of {totalQuestions} • {currentQ.category}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stars Counter for Early Learners */}
              {selectedCohort === 'early' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{starsEarned} Stars</span>
                </div>
              )}

              {/* Streak Counter */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black">
                <Flame className="w-4 h-4 text-indigo-600" />
                <span>{streakCombo} Streak</span>
              </div>
            </div>
          </div>

          {/* Target Word & Phonetics Prompt Box */}
          <div className={`rounded-3xl p-6 sm:p-8 text-center space-y-3 ${
            selectedCohort === 'early'
              ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300'
              : selectedCohort === 'senior'
              ? 'bg-gradient-to-b from-rose-50 to-pink-50 border border-rose-200'
              : 'bg-slate-900 text-white'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-wider">
                {currentQ.word}
              </span>
              {currentQ.phonetic && (
                <span className={`text-xs sm:text-sm font-mono font-medium ${
                  selectedCohort === 'early' ? 'text-amber-800' : selectedCohort === 'senior' ? 'text-rose-800' : 'text-indigo-300'
                }`}>
                  [{currentQ.phonetic}]
                </span>
              )}
              <button
                onClick={() => handleSpeak(currentQ.word)}
                className={`p-2 rounded-xl transition-all ${
                  selectedCohort === 'early'
                    ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                    : selectedCohort === 'senior'
                    ? 'bg-rose-200 text-rose-900 hover:bg-rose-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Listen Pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-sm sm:text-base font-bold max-w-xl mx-auto leading-relaxed ${
              selectedCohort === 'early' ? 'text-slate-800' : selectedCohort === 'senior' ? 'text-slate-800' : 'text-slate-200'
            }`}>
              {currentQ.prompt}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option.trim() === currentQ.correctAnswer.trim();

              let btnClass = 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-slate-800';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnClass = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-xs';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 ${btnClass}`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {isSubmitted && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isSubmitted && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Feedback Card */}
          {isSubmitted && (
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-2 animate-fade-in ${
              selectedOption?.trim() === currentQ.correctAnswer.trim()
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-black uppercase tracking-wider text-sm flex items-center gap-1.5">
                  {selectedOption?.trim() === currentQ.correctAnswer.trim() ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{currentQ.praise}</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Explanation &amp; Correct Answer</span>
                    </>
                  )}
                </span>
                <button
                  onClick={() => handleSpeak(currentQ.explanation)}
                  className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
              <p className="text-slate-800">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playClick();
                setIsQuizActive(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Exit Quiz
            </button>

            {!isSubmitted ? (
              <button
                disabled={!selectedOption}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs disabled:opacity-40 shadow-xs"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-2"
              >
                <span>{currentIndex < totalQuestions - 1 ? 'Next Question' : 'View Final Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Final Results & Celebration */}
      {isQuizFinished && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              {activeCategoryInfo.name} Completed
            </span>
            <h3 className="text-2xl font-black text-slate-900">Quiz Completed!</h3>
            <p className="text-xs text-slate-500">
              Great job practicing concepts calibrated for {activeCategoryInfo.badge}.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Score</span>
              <span className="text-xl font-black text-slate-900">{correctCount} / {totalQuestions}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Accuracy</span>
              <span className="text-xl font-black text-emerald-600">{accuracyPercent}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-400 block">XP Earned</span>
              <span className="text-xl font-black text-indigo-600">+{totalXpEarned} XP</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Level</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsQuizFinished(false);
                setIsQuizActive(false);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
            >
              Change Level
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
