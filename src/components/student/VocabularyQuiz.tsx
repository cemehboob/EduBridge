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
  ChevronRight
} from 'lucide-react';
import { VocabularyWord } from '../../types';
import { sound } from '../../utils/audio';
import { triggerCelebration } from '../../utils/celebration';

interface VocabularyQuizProps {
  vocabularyWords: VocabularyWord[];
  onCompleteQuiz?: (score: number, totalQuestions: number, xpEarned: number) => void;
}

type QuestionMode = 'definition' | 'meaning' | 'sentence' | 'synonym';

interface GeneratedQuestion {
  id: string;
  targetWord: VocabularyWord;
  mode: QuestionMode;
  questionText: string;
  options: string[]; // 4 choices
  correctAnswer: string;
  explanation: string;
}

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  vocabularyWords = [],
  onCompleteQuiz
}) => {
  // Config state
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');
  const [selectedLength, setSelectedLength] = useState<number>(10);
  const [selectedMode, setSelectedMode] = useState<QuestionMode>('definition');

  // Quiz execution state
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: string; isCorrect: boolean }[]>([]);
  const [streakCombo, setStreakCombo] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Available CEFR levels
  const cefrLevels = ['ALL', 'B1', 'B2', 'C1', 'C2'];

  // Speech TTS handler
  const handleSpeak = (text: string) => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate dynamic questions based on current config and vocabularyWords pool
  const generateQuestions = (): GeneratedQuestion[] => {
    let pool = vocabularyWords.length > 0 ? vocabularyWords : defaultFallbackWords;

    if (selectedCefr !== 'ALL') {
      const filtered = pool.filter((w) => w.cefrLevel.toUpperCase() === selectedCefr.toUpperCase());
      if (filtered.length >= 4) {
        pool = filtered;
      }
    }

    // Shuffle pool
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const targetWords = shuffledPool.slice(0, Math.min(selectedLength, shuffledPool.length));

    return targetWords.map((word, idx) => {
      // Determine question mode (either fixed or mixed)
      const currentMode = selectedMode;

      // Distractors from other words
      const otherWords = pool.filter((w) => w.id !== word.id);
      const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);

      let questionText = '';
      let correctAnswer = '';
      let options: string[] = [];
      let explanation = '';

      if (currentMode === 'definition') {
        // Prompt: Given definition, pick word
        questionText = `Which word matches this definition?\n"${word.definition}"`;
        correctAnswer = word.word;
        const distractors = shuffledOthers.slice(0, 3).map((w) => w.word);
        options = [word.word, ...distractors].sort(() => Math.random() - 0.5);
        explanation = `"${word.word}" (${word.partOfSpeech}) means: ${word.definition}`;
      } else if (currentMode === 'meaning') {
        // Prompt: Given word, pick definition
        questionText = `What is the correct definition of "${word.word}"?`;
        correctAnswer = word.definition;
        const distractors = shuffledOthers.slice(0, 3).map((w) => w.definition);
        options = [word.definition, ...distractors].sort(() => Math.random() - 0.5);
        explanation = `"${word.word}" ${word.phonetic ? `[${word.phonetic}]` : ''}: ${word.definition}`;
      } else if (currentMode === 'sentence') {
        // Prompt: Fill in sentence blank
        let sentenceWithBlank = word.example || word.exampleSentence || `The student used the word ${word.word} in an essay.`;
        // Replace exact word (case-insensitive) with blank
        const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
        if (regex.test(sentenceWithBlank)) {
          sentenceWithBlank = sentenceWithBlank.replace(regex, '_______');
        } else {
          sentenceWithBlank = `Fill in the blank: "It was a ________ moment." (${word.definition})`;
        }
        questionText = `Select the missing word to complete the sentence:\n"${sentenceWithBlank}"`;
        correctAnswer = word.word;
        const distractors = shuffledOthers.slice(0, 3).map((w) => w.word);
        options = [word.word, ...distractors].sort(() => Math.random() - 0.5);
        explanation = `Example: ${word.example || word.exampleSentence || `"${word.word}" fits the context.`}`;
      } else {
        // Synonym mode
        const synonym = word.synonyms && word.synonyms.length > 0 ? word.synonyms[0] : word.word;
        questionText = `Which word is closest in meaning to "${word.word}"?`;
        correctAnswer = synonym;

        const distractorSynonyms = shuffledOthers
          .slice(0, 3)
          .map((w) => (w.synonyms && w.synonyms[0] ? w.synonyms[0] : w.word));
        
        options = [synonym, ...distractorSynonyms].sort(() => Math.random() - 0.5);
        explanation = `"${word.word}" is synonymous with "${synonym}". Definition: ${word.definition}`;
      }

      return {
        id: `q_${word.id}_${idx}_${Date.now()}`,
        targetWord: word,
        mode: currentMode,
        questionText,
        options,
        correctAnswer,
        explanation
      };
    });
  };

  const handleStartQuiz = () => {
    sound.playClick();
    const generated = generateQuestions();
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setStreakCombo(0);
    setMaxStreak(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      sound.playSuccess();
      const newCombo = streakCombo + 1;
      setStreakCombo(newCombo);
      if (newCombo > maxStreak) setMaxStreak(newCombo);
    } else {
      sound.playError();
      setStreakCombo(0);
    }

    setIsSubmitted(true);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: selectedOption,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Finish quiz
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const accuracy = Math.round((correctCount / questions.length) * 100);
      const xpEarned = correctCount * 15 + maxStreak * 5;

      setIsQuizFinished(true);
      setIsQuizActive(false);

      if (accuracy >= 80) {
        triggerCelebration('daily_goal');
      }

      if (onCompleteQuiz) {
        onCompleteQuiz(correctCount, questions.length, xpEarned);
      }
    }
  };

  // Calculated results
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const accuracyPercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const totalXpEarned = correctCount * 15 + maxStreak * 5;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              Interactive Vocabulary Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Adaptive Vocabulary Mastery Quiz
            </h1>
            <p className="text-indigo-200/90 text-sm max-w-2xl leading-relaxed">
              Test your knowledge of academic & CEFR-aligned lexicon with dynamic multiple-choice drills, instant audio pronunciation, and real-time streak multipliers.
            </p>
          </div>

          {!isQuizActive && !isQuizFinished && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15">
              <div className="text-right">
                <div className="text-xs text-indigo-200">System Vocab Pool</div>
                <div className="text-xl font-bold text-white">{vocabularyWords.length} Words</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: Quiz Configuration Setup (Before starting) */}
      {!isQuizActive && !isQuizFinished && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Controls Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Customize Your Practice Session
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Configure your target CEFR level, question mode, and quiz length to sharpen your vocabulary retention.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Quiz Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'definition',
                    title: 'Definition Match',
                    desc: 'Read the definition and identify the matching vocabulary word.'
                  },
                  {
                    id: 'meaning',
                    title: 'Word Meaning',
                    desc: 'Read the word and pick the correct formal definition.'
                  },
                  {
                    id: 'sentence',
                    title: 'Contextual Fill-in-Blank',
                    desc: 'Complete example sentences with the proper target term.'
                  },
                  {
                    id: 'synonym',
                    title: 'Synonym Challenge',
                    desc: 'Match words with their closest academic synonyms.'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedMode(mode.id as QuestionMode);
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedMode === mode.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                      {mode.title}
                      {selectedMode === mode.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CEFR Level Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                CEFR Proficiency Filter
              </label>
              <div className="flex flex-wrap gap-2">
                {cefrLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCefr(lvl);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCefr === lvl
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {lvl === 'ALL' ? 'All Levels (Mixed)' : `Level ${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Length */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 20].map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      sound.playClick();
                      setSelectedLength(len);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedLength === len
                        ? 'border-indigo-600 bg-indigo-60 text-indigo-700 font-extrabold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {len} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleStartQuiz}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                Start Vocabulary Quiz Now
              </button>
            </div>
          </div>

          {/* Quick Insights & Sample Vocabulary Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white space-y-4 shadow-md">
              <h3 className="font-bold text-base flex items-center gap-2 text-indigo-300">
                <Target className="w-5 h-5" />
                Quiz Reward Structure
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span>Correct Choice</span>
                  <span className="font-bold text-emerald-400">+15 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span>Streak Multiplier</span>
                  <span className="font-bold text-amber-400">+5 XP per streak</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span>Score &ge; 80%</span>
                  <span className="font-bold text-purple-400">Badge Progress & Confetti 🎉</span>
                </div>
              </div>
            </div>

            {/* Preview of Vocab Words */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Featured Words in Pool
                </h4>
                <span className="text-xs font-semibold text-slate-500">Showing 4 of {vocabularyWords.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {(vocabularyWords.length > 0 ? vocabularyWords.slice(0, 4) : defaultFallbackWords.slice(0, 4)).map((w) => (
                  <div key={w.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        {w.word}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-normal">
                          {w.partOfSpeech}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{w.definition}</div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                      {w.cefrLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Active Question Card */}
      {isQuizActive && questions.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Progress & Stats Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                Question {currentIndex + 1} / {questions.length}
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Zap className="w-4 h-4 fill-amber-500" />
                Streak: {streakCombo}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsQuizActive(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Quit Quiz
            </button>
          </div>

          {/* Current Question Card */}
          {(() => {
            const currentQ = questions[currentIndex];
            return (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
                {/* Question Header & Prompt */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                      {currentQ.targetWord.cefrLevel} Level • {currentQ.targetWord.partOfSpeech}
                    </span>
                    <button
                      onClick={() => handleSpeak(currentQ.targetWord.word)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      Audio Playback
                    </button>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug whitespace-pre-line">
                    {currentQ.questionText}
                  </h3>
                </div>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQ.options.map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx); // A, B, C, D
                    const isSelected = selectedOption === option;
                    const isCorrectAnswer = option === currentQ.correctAnswer;

                    let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-800';

                    if (isSubmitted) {
                      if (isCorrectAnswer) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-600/30';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleOptionClick(option)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-4 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                              isSubmitted && isCorrectAnswer
                                ? 'bg-emerald-600 text-white'
                                : isSubmitted && isSelected && !isCorrectAnswer
                                ? 'bg-rose-600 text-white'
                                : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-sm sm:text-base leading-relaxed">{option}</span>
                        </div>

                        {isSubmitted && (
                          <div className="shrink-0">
                            {isCorrectAnswer ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isSelected ? (
                              <XCircle className="w-5 h-5 text-rose-600" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Next Button */}
                {!isSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleSubmitAnswer}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      selectedOption
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Explanation Box */}
                    <div
                      className={`p-4 rounded-xl border ${
                        selectedOption === currentQ.correctAnswer
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/80 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-2">
                        {selectedOption === currentQ.correctAnswer ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Correct Answer! (+15 XP)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            Incorrect. The correct answer was: &quot;{currentQ.correctAnswer}&quot;
                          </>
                        )}
                      </div>
                      <p className="text-xs mt-2 leading-relaxed opacity-90">{currentQ.explanation}</p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
                    >
                      {currentIndex < questions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Complete Quiz Results
                          <Trophy className="w-4 h-4 text-amber-400" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW 3: Quiz Results & XP Summary */}
      {isQuizFinished && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Quiz Session Completed!
              </h2>
              <p className="text-sm text-slate-600">
                Great effort! Here is your performance breakdown for this vocabulary test.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Score</div>
                <div className="text-2xl font-black text-slate-900">
                  {correctCount} / {questions.length}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Accuracy</div>
                <div className={`text-2xl font-black ${accuracyPercent >= 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {accuracyPercent}%
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">XP Awarded</div>
                <div className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                  +{totalXpEarned}
                </div>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Detailed Question Review
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const ans = userAnswers[idx];
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                        ans?.isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800">
                          Q{idx + 1}: {q.targetWord.word} ({q.targetWord.cefrLevel})
                        </div>
                        <div className="text-slate-600">{q.explanation}</div>
                      </div>
                      <div className="shrink-0 font-extrabold">
                        {ans?.isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleStartQuiz}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsQuizFinished(false);
                }}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-all"
              >
                Configure New Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fallback pool in case vocabularyWords prop is empty
const defaultFallbackWords: VocabularyWord[] = [
  {
    id: 'vw_fb_1',
    word: 'Meticulous',
    phonetic: '/mɪˈtɪkjələs/',
    partOfSpeech: 'Adjective',
    translation: 'Cuidadoso / Meticuloso',
    definition: 'Showing great attention to detail; very careful and precise.',
    cefrLevel: 'C1',
    category: 'Academic Discourse',
    dateAdded: '2026-10-31',
    example: 'The research assistant was meticulous in logging every experimental data point.',
    exampleSentence: 'The research assistant was meticulous in logging every experimental data point.',
    synonyms: ['precise', 'scrupulous', 'painstaking'],
    antonyms: ['careless', 'sloppy']
  },
  {
    id: 'vw_fb_2',
    word: 'Pragmatic',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'Adjective',
    translation: 'Práctico / Pragmático',
    definition: 'Dealing with things sensibly and realistically based on practical considerations.',
    cefrLevel: 'B2',
    category: 'Logic & Reasoning',
    dateAdded: '2026-10-31',
    example: 'The team took a pragmatic approach to solving the software deployment bug.',
    exampleSentence: 'The team took a pragmatic approach to solving the software deployment bug.',
    synonyms: ['practical', 'sensible', 'realistic'],
    antonyms: ['idealistic', 'impractical']
  },
  {
    id: 'vw_fb_3',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'Adjective',
    translation: 'Ubicuo',
    definition: 'Present, appearing, or found everywhere.',
    cefrLevel: 'C2',
    category: 'Advanced Lexicon',
    dateAdded: '2026-10-31',
    example: 'Smartphones have become ubiquitous features of modern daily communication.',
    exampleSentence: 'Smartphones have become ubiquitous features of modern daily communication.',
    synonyms: ['omnipresent', 'pervasive', 'universal'],
    antonyms: ['rare', 'scarce']
  },
  {
    id: 'vw_fb_4',
    word: 'Eloquent',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'Adjective',
    translation: 'Elocuente',
    definition: 'Fluent or persuasive in speaking or writing.',
    cefrLevel: 'B2',
    category: 'Communication',
    dateAdded: '2026-10-31',
    example: 'The speaker delivered an eloquent speech that moved the entire audience.',
    exampleSentence: 'The speaker delivered an eloquent speech that moved the entire audience.',
    synonyms: ['articulate', 'expressive', 'persuasive'],
    antonyms: ['inarticulate', 'hesitant']
  },
  {
    id: 'vw_fb_5',
    word: 'Resilient',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'Adjective',
    translation: 'Resiliente',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    cefrLevel: 'B1',
    category: 'Growth Mindset',
    dateAdded: '2026-10-31',
    example: 'Students who stay resilient turn academic challenges into learning milestones.',
    exampleSentence: 'Students who stay resilient turn academic challenges into learning milestones.',
    synonyms: ['adaptable', 'tough', 'buoyant'],
    antonyms: ['fragile', 'vulnerable']
  }
];
