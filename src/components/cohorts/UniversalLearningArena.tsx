import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Award,
  Clock,
  Mic,
  Star,
  ChevronRight,
  ChevronLeft,
  Heart,
  Send,
  Zap,
  ShieldCheck,
  Brain,
  Lightbulb,
  FileCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  AgeCohortId,
  PhonicsCard,
  WordBuilderItem,
  PictureStory,
  ScienceQuest,
  CreativeStoryStarter,
  MentalMathChallenge,
  SpacedRepetitionCard,
  TFNGExercise,
  Band9EssayTemplate,
  CueCardItem,
  EmailDiplomacyScenario,
  ElevatorPitchPrompt,
  MemoryGymPair,
  ReminiscencePrompt,
  DigitalSafetyGuide
} from '../../types';
import {
  ageCohorts,
  phonicsCards,
  wordBuilderChallenges,
  pictureStories,
  scienceQuests,
  creativeStoryStarters,
  mentalMathChallenges,
  spacedRepetitionCards,
  tfngExercises,
  band9EssayTemplates,
  cueCardItems,
  emailDiplomacyScenarios,
  elevatorPitchPrompts,
  memoryGymPairs,
  reminiscencePrompts,
  digitalSafetyGuides
} from '../../data/ageCohortsData';
import { AIService } from '../../services/aiService';
import { sound } from '../../utils/audio';
import { VoicePersonaSelector } from '../common/VoicePersonaSelector';

interface UniversalLearningArenaProps {
  initialCohort?: AgeCohortId;
  onOpenResourceVault: () => void;
}

export const UniversalLearningArena: React.FC<UniversalLearningArenaProps> = ({
  initialCohort = 'early',
  onOpenResourceVault
}) => {
  const [activeCohort, setActiveCohort] = useState<AgeCohortId>(initialCohort);

  useEffect(() => {
    if (initialCohort) {
      setActiveCohort(initialCohort);
    }
  }, [initialCohort]);

  // 1. Ages 5-8 State
  const [earlySubTab, setEarlySubTab] = useState<'phonics' | 'builder' | 'story' | 'timer'>('phonics');
  const [activePhonicsFilter, setActivePhonicsFilter] = useState<'all' | 'vowel' | 'consonant' | 'blend'>('all');
  const [activeBuilderIndex, setActiveBuilderIndex] = useState(0);
  const [builderConstructed, setBuilderConstructed] = useState<string[]>([]);
  const [builderFeedback, setBuilderFeedback] = useState<string | null>(null);
  const [starsCount, setStarsCount] = useState(5);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyPage, setStoryPage] = useState(1);
  const [storyQuizSelected, setStoryQuizSelected] = useState<number | null>(null);
  const [earlyTimerSeconds, setEarlyTimerSeconds] = useState(600); // 10 minutes
  const [isEarlyTimerRunning, setIsEarlyTimerRunning] = useState(false);

  // 2. Ages 9-14 State
  const [juniorSubTab, setJuniorSubTab] = useState<'science' | 'story_lab' | 'math' | 'flashcards'>('science');
  const [activeQuestIndex, setActiveQuestIndex] = useState(0);
  const [questUserAnswers, setQuestUserAnswers] = useState<Record<number, number>>({});
  const [activeDictionaryTerm, setActiveDictionaryTerm] = useState<{ term: string; def: string } | null>(null);
  const [activeStarterIndex, setActiveStarterIndex] = useState(0);
  const [storyLabText, setStoryLabText] = useState('');
  const [storyLabFeedback, setStoryLabFeedback] = useState<string | null>(null);
  const [mathIndex, setMathIndex] = useState(0);
  const [mathUserAnswer, setMathUserAnswer] = useState<number | null>(null);
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<string, boolean>>({});

  // 3. Ages 15-24 State
  const [academySubTab, setAcademySubTab] = useState<'tfng' | 'task2' | 'cuecard'>('tfng');
  const [activeTfngIndex, setActiveTfngIndex] = useState(0);
  const [tfngUserChoice, setTfngUserChoice] = useState<'TRUE' | 'FALSE' | 'NOT GIVEN' | null>(null);
  const [task2EssayText, setTask2EssayText] = useState(
    'While proponents contend that technological automation engenders profound unemployment, empirical indications substantiate that novel cognitive sectors emerge to absorb specialized labor...'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Band9EssayTemplate | null>(band9EssayTemplates[0]);
  const [activeCueCardIndex, setActiveCueCardIndex] = useState(0);
  const [cueCardPhase, setCueCardPhase] = useState<'idle' | 'prep' | 'speaking' | 'review'>('idle');
  const [cueCardTimer, setCueCardTimer] = useState(60);
  const [cueCardNotes, setCueCardNotes] = useState('');

  // 4. Ages 25-54 State
  const [proSubTab, setProSubTab] = useState<'email' | 'pitch' | 'drills'>('email');
  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [emailUserDraft, setEmailUserDraft] = useState('');
  const [pitchIndex, setPitchIndex] = useState(0);
  const [isPitchRecording, setIsPitchRecording] = useState(false);
  const [pitchSeconds, setPitchSeconds] = useState(60);
  const [pitchSpokenWords, setPitchSpokenWords] = useState(142);

  // 5. Ages 55+ State
  const [seniorSubTab, setSeniorSubTab] = useState<'memory' | 'journal' | 'safety'>('memory');
  const [matchedPairs, setMatchedPairs] = useState<Record<string, boolean>>({});
  const [selectedWordA, setSelectedWordA] = useState<string | null>(null);
  const [reminiscenceIndex, setReminiscenceIndex] = useState(0);
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});
  const [activeJournalInput, setActiveJournalInput] = useState('');
  const [safetyIndex, setSafetyIndex] = useState(0);
  const [safetyUserGuess, setSafetyUserGuess] = useState<boolean | null>(null);

  // Timers Effect
  useEffect(() => {
    let interval: any = null;
    if (isEarlyTimerRunning && earlyTimerSeconds > 0) {
      interval = setInterval(() => setEarlyTimerSeconds((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isEarlyTimerRunning, earlyTimerSeconds]);

  useEffect(() => {
    let interval: any = null;
    if ((cueCardPhase === 'prep' || cueCardPhase === 'speaking') && cueCardTimer > 0) {
      interval = setInterval(() => {
        setCueCardTimer((prev) => {
          if (prev <= 1) {
            if (cueCardPhase === 'prep') {
              sound.playLevelUp();
              setCueCardPhase('speaking');
              return 120;
            } else {
              sound.playSuccess();
              setCueCardPhase('review');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cueCardPhase, cueCardTimer]);

  useEffect(() => {
    let interval: any = null;
    if (isPitchRecording && pitchSeconds > 0) {
      interval = setInterval(() => {
        setPitchSeconds((prev) => {
          if (prev <= 1) {
            setIsPitchRecording(false);
            sound.playSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPitchRecording, pitchSeconds]);

  const currentCohort = ageCohorts.find((c) => c.id === activeCohort) || ageCohorts[0];

  // Helper Speech with adaptive pace
  const speakTextWithCohort = (text: string) => {
    sound.playClick();
    AIService.speakAdaptive(text, activeCohort);
  };

  const speakSeniorCalm = (text: string) => {
    sound.playClick();
    AIService.speakSeniorClear(text);
  };

  // 1. Little Explorers Word Builder Handlers
  const currentBuilder = wordBuilderChallenges[activeBuilderIndex];
  const handleLetterClick = (letter: string) => {
    sound.playClick();
    const nextConstructed = [...builderConstructed, letter];
    setBuilderConstructed(nextConstructed);
    const formedWord = nextConstructed.join('');

    if (formedWord === currentBuilder.targetWord) {
      sound.playLevelUp();
      setBuilderFeedback(`🎉 Brilliant! You built "${currentBuilder.targetWord}"!`);
      setStarsCount((s) => s + 3);
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch {}
      AIService.speakAdaptive(`Hurray! You spelled ${currentBuilder.targetWord}! Wonderful job!`, 'early');
    } else if (formedWord.length >= currentBuilder.targetWord.length) {
      sound.playError();
      setBuilderFeedback('Almost! Let’s tap Reset to try again!');
    }
  };

  const handleResetBuilder = () => {
    sound.playClick();
    setBuilderConstructed([]);
    setBuilderFeedback(null);
  };

  // 5. Senior Memory Gym Matching Handlers
  const handleSelectWordA = (wordA: string) => {
    sound.playClick();
    setSelectedWordA(wordA);
  };

  const handleSelectWordB = (wordB: string, pair: MemoryGymPair) => {
    sound.playClick();
    if (!selectedWordA) return;
    if (pair.wordA === selectedWordA && pair.wordB === wordB) {
      sound.playSuccess();
      setMatchedPairs((prev) => ({ ...prev, [pair.id]: true }));
      setSelectedWordA(null);
      AIService.speakSeniorClear(`Wonderful association! ${pair.wordA} and ${pair.wordB}. ${pair.semanticConnection}`);
    } else {
      sound.playClick();
      setSelectedWordA(null);
    }
  };

  return (
    <div className="w-full space-y-8 pb-12 animate-fade-in">
      
      {/* Top Banner: Universal Learning Platform */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-black uppercase tracking-wider text-teal-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Open Learning Platform • Ages 5 to 100+</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Developmental Learning Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Engineered across five scientifically tailored developmental cohorts. From early childhood multisensory phonics to lifelong cognitive reserve preservation—EduBridge adapts seamlessly to every stage of the human mind.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onOpenResourceVault();
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Open Resource Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Cohort Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ageCohorts.map((cohort) => {
          const isSelected = activeCohort === cohort.id;
          return (
            <button
              key={cohort.id}
              onClick={() => {
                sound.playClick();
                setActiveCohort(cohort.id);
              }}
              className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20 translate-y-[-2px]'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-indigo-600 font-extrabold' : 'text-slate-500'}`}>
                    {cohort.ageRange}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  {cohort.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium line-clamp-1">
                {cohort.badge}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Cohort Overview Pill */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                {currentCohort.bestPractice}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              <strong>Cognitive Focus:</strong> {currentCohort.cognitiveFocus}
            </p>
          </div>
        </div>

        {/* Universal Voice button and persona selector tailored for this cohort */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <VoicePersonaSelector compact={true} />
          <button
            onClick={() => speakTextWithCohort(`${currentCohort.name}. ${currentCohort.description}`)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Read Cohort Voice Guide</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AGES 5-8: LITTLE EXPLORERS ARENA */}
      {/* ========================================================================= */}
      {activeCohort === 'early' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => { sound.playClick(); setEarlySubTab('phonics'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                earlySubTab === 'phonics' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔤 Phonics Soundboard
            </button>
            <button
              onClick={() => { sound.playClick(); setEarlySubTab('builder'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                earlySubTab === 'builder' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🧩 Word Builder Challenge
            </button>
            <button
              onClick={() => { sound.playClick(); setEarlySubTab('story'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                earlySubTab === 'story' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📖 Picture Story Time
            </button>
            <button
              onClick={() => { sound.playClick(); setEarlySubTab('timer'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                earlySubTab === 'timer' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⏱️ 10-Minute Focus Session
            </button>
          </div>

          {/* Tab 1: Phonics Soundboard */}
          {earlySubTab === 'phonics' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-600">Montessori Sound Library</span>
                  <h3 className="text-xl font-black text-slate-900">Interactive Phonics Soundboard</h3>
                  <p className="text-xs text-slate-500">Tap any letter or blend to hear joyful pronunciation and clear phonetic sounds!</p>
                </div>
                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  {(['all', 'vowel', 'consonant', 'blend'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => { sound.playClick(); setActivePhonicsFilter(filter); }}
                      className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                        activePhonicsFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {phonicsCards
                  .filter((c) => activePhonicsFilter === 'all' || c.soundType === activePhonicsFilter)
                  .map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        sound.playSuccess();
                        speakTextWithCohort(card.promptText);
                      }}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-center group flex flex-col items-center justify-between min-h-[110px]"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">{card.icon}</span>
                      <div className="my-1">
                        <span className="text-lg font-black text-slate-900 group-hover:text-amber-600">{card.letter}</span>
                        <span className="block text-[11px] font-mono text-slate-400 font-semibold">{card.phoneme}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 truncate w-full">
                        {card.word}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Tab 2: Word Builder Challenge */}
          {earlySubTab === 'builder' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-600">Spelling Challenge {activeBuilderIndex + 1} of {wordBuilderChallenges.length}</span>
                  <h3 className="text-xl font-black text-slate-900">Word Builder Lab</h3>
                  <p className="text-xs text-slate-500">Tap the letter tiles in the correct order to spell the word!</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-xl border border-amber-200 text-xs font-black">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{starsCount} Stars Earned</span>
                </div>
              </div>

              {/* Target Clue Card */}
              <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 text-center space-y-3">
                <span className="text-5xl">{currentBuilder.icon}</span>
                <p className="text-sm font-bold text-slate-700 italic">"{currentBuilder.hint}"</p>
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  Category: {currentBuilder.category}
                </div>
              </div>

              {/* Constructed Word Slots */}
              <div className="flex items-center justify-center gap-3">
                {Array.from({ length: currentBuilder.targetWord.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-2xl font-black text-indigo-700 shadow-inner"
                  >
                    {builderConstructed[idx] || ''}
                  </div>
                ))}
              </div>

              {/* Letter Tiles to Click */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {currentBuilder.scrambledLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLetterClick(letter)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-b from-white to-slate-100 hover:to-amber-100 border-2 border-slate-300 hover:border-amber-500 text-lg font-black text-slate-800 shadow-md active:scale-95 transition-all"
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {builderFeedback && (
                <div className="text-center font-bold text-sm text-amber-800 animate-fade-in bg-amber-50 p-3 rounded-xl border border-amber-200">
                  {builderFeedback}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetBuilder}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Tiles</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveBuilderIndex((prev) => (prev + 1) % wordBuilderChallenges.length);
                    handleResetBuilder();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5"
                >
                  <span>Next Challenge</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Picture Story Time */}
          {earlySubTab === 'story' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const currentStory = pictureStories[activeStoryIndex];
                const currentPageData = currentStory.pages[storyPage - 1];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-amber-600">Picture Story Time</span>
                        <h3 className="text-xl font-black text-slate-900">{currentStory.title}</h3>
                      </div>
                      <button
                        onClick={() => speakTextWithCohort(currentPageData.text)}
                        className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-2 hover:bg-amber-100"
                      >
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        <span>Read Aloud</span>
                      </button>
                    </div>

                    {/* Story Scene Illustration */}
                    <div className="bg-gradient-to-b from-sky-50 to-amber-50/40 rounded-3xl p-8 border border-sky-100 text-center space-y-4">
                      <div className="text-6xl tracking-widest">{currentPageData.emojiScene}</div>
                      <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-xl mx-auto">
                        "{currentPageData.text}"
                      </p>
                      <span className="text-xs font-bold text-slate-400">Page {storyPage} of {currentStory.pages.length}</span>
                    </div>

                    {/* Navigation between pages */}
                    <div className="flex items-center justify-between">
                      <button
                        disabled={storyPage === 1}
                        onClick={() => { sound.playClick(); setStoryPage((p) => Math.max(1, p - 1)); }}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
                      >
                        Previous Page
                      </button>
                      <button
                        disabled={storyPage === currentStory.pages.length}
                        onClick={() => { sound.playClick(); setStoryPage((p) => Math.min(currentStory.pages.length, p + 1)); }}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-40 shadow-xs"
                      >
                        Next Page
                      </button>
                    </div>

                    {/* Comprehension Check on Final Page */}
                    {storyPage === currentStory.pages.length && (
                      <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-800">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <span>Comprehension Check</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{currentStory.comprehensionQuiz.question}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentStory.comprehensionQuiz.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                sound.playClick();
                                setStoryQuizSelected(oIdx);
                                if (oIdx === currentStory.comprehensionQuiz.correctIndex) {
                                  sound.playSuccess();
                                  AIService.speakAdaptive(currentStory.comprehensionQuiz.praise, 'early');
                                }
                              }}
                              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                                storyQuizSelected === oIdx
                                  ? oIdx === currentStory.comprehensionQuiz.correctIndex
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                    : 'bg-rose-100 border-rose-500 text-rose-900'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {storyQuizSelected === currentStory.comprehensionQuiz.correctIndex && (
                          <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                            ⭐ {currentStory.comprehensionQuiz.praise}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Tab 4: 10-Minute Focus Session */}
          {earlySubTab === 'timer' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-lg mx-auto">
              <div>
                <span className="text-xs font-bold uppercase text-amber-600">Early Attention Span Alignment</span>
                <h3 className="text-xl font-black text-slate-900">10-Minute Micro-Learning Session</h3>
                <p className="text-xs text-slate-500">Research shows young minds absorb phonics and stories best in joyful 10-minute bursts.</p>
              </div>

              {/* Circular Timer Display */}
              <div className="w-48 h-48 rounded-full border-8 border-amber-300 bg-amber-50/50 mx-auto flex flex-col items-center justify-center shadow-inner">
                <span className="text-4xl font-black font-mono text-slate-900">
                  {Math.floor(earlyTimerSeconds / 60)}:{(earlyTimerSeconds % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-1">Focus Mode</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEarlyTimerRunning(!isEarlyTimerRunning);
                  }}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                    isEarlyTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isEarlyTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isEarlyTimerRunning ? 'Pause Session' : 'Start 10-Min Session'}</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEarlyTimerRunning(false);
                    setEarlyTimerSeconds(600);
                  }}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AGES 9-14: JUNIOR SCHOLARS ARENA */}
      {/* ========================================================================= */}
      {activeCohort === 'junior' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => { sound.playClick(); setJuniorSubTab('science'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                juniorSubTab === 'science' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚀 Space &amp; Science Quests
            </button>
            <button
              onClick={() => { sound.playClick(); setJuniorSubTab('story_lab'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                juniorSubTab === 'story_lab' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ✍️ Creative Story Lab
            </button>
            <button
              onClick={() => { sound.playClick(); setJuniorSubTab('math'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                juniorSubTab === 'math' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Mental Math &amp; Pattern Logic
            </button>
            <button
              onClick={() => { sound.playClick(); setJuniorSubTab('flashcards'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                juniorSubTab === 'flashcards' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔄 Spaced Repetition Vault
            </button>
          </div>

          {/* SubTab 1: Space & Science Quest */}
          {juniorSubTab === 'science' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const quest = scienceQuests[activeQuestIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase text-blue-600">{quest.topic}</span>
                        <h3 className="text-xl font-black text-slate-900">{quest.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakTextWithCohort(quest.readingPassage)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          <span>Narrate Quest</span>
                        </button>
                        <select
                          value={activeQuestIndex}
                          onChange={(e) => {
                            sound.playClick();
                            setActiveQuestIndex(Number(e.target.value));
                            setQuestUserAnswers({});
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                        >
                          {scienceQuests.map((q, idx) => (
                            <option key={q.id} value={idx}>{q.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Reading Passage */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 leading-relaxed text-sm text-slate-800 space-y-4">
                      <p>{quest.readingPassage}</p>
                    </div>

                    {/* Click-to-Define Instant Dictionary */}
                    <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-800">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Interactive Inquiry Dictionary (Click any keyword to define)</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Object.entries(quest.dictionary).map(([term, def]) => (
                          <button
                            key={term}
                            onClick={() => {
                              sound.playClick();
                              setActiveDictionaryTerm({ term, def });
                            }}
                            className="px-3 py-1 rounded-lg bg-white border border-blue-300 hover:border-blue-500 text-xs font-bold text-blue-900 shadow-2xs"
                          >
                            🔍 {term}
                          </button>
                        ))}
                      </div>
                      {activeDictionaryTerm && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-blue-300 text-xs text-slate-800 animate-fade-in">
                          <strong className="text-blue-700 capitalize">{activeDictionaryTerm.term}:</strong> {activeDictionaryTerm.def}
                        </div>
                      )}
                    </div>

                    {/* Comprehension Questions */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Comprehension Checkpoints
                      </h4>
                      {quest.comprehensionQuestions.map((q, qIdx) => {
                        const selected = questUserAnswers[qIdx];
                        const isCorrect = selected === q.answerIndex;
                        return (
                          <div key={qIdx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                            <p className="text-xs sm:text-sm font-bold text-slate-900">
                              {qIdx + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  onClick={() => {
                                    sound.playClick();
                                    setQuestUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                                    if (oIdx === q.answerIndex) sound.playSuccess();
                                    else sound.playError();
                                  }}
                                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                                    selected === oIdx
                                      ? oIdx === q.answerIndex
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                        : 'bg-rose-50 border-rose-500 text-rose-900'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {selected !== undefined && (
                              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                <strong className={isCorrect ? 'text-emerald-700' : 'text-slate-700'}>
                                  {isCorrect ? '✓ Correct! ' : '💡 Explanation: '}
                                </strong>
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 2: Creative Story Lab */}
          {juniorSubTab === 'story_lab' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const starter = creativeStoryStarters[activeStarterIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-blue-600">Dual-Coding Narrative Studio</span>
                        <h3 className="text-xl font-black text-slate-900">Creative Story Lab</h3>
                      </div>
                      <select
                        value={activeStarterIndex}
                        onChange={(e) => {
                          sound.playClick();
                          setActiveStarterIndex(Number(e.target.value));
                          setStoryLabFeedback(null);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {creativeStoryStarters.map((s, idx) => (
                          <option key={s.id} value={idx}>{s.genre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-200 space-y-2">
                      <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Prompt</span>
                      <p className="text-xs font-medium text-slate-800">{starter.prompt}</p>
                      <p className="text-xs font-bold text-blue-900 italic pt-1">
                        Opening Hook: "{starter.starterSentence}"
                      </p>
                    </div>

                    {/* Helper Vocabulary Chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500">Vocabulary Boosters:</span>
                      {starter.helperWords.map((word) => (
                        <span key={word} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          +{word}
                        </span>
                      ))}
                    </div>

                    <textarea
                      rows={5}
                      value={storyLabText}
                      onChange={(e) => setStoryLabText(e.target.value)}
                      placeholder="Continue the narrative here using vivid imagery, descriptive verbs, and sensory details..."
                      className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        Words: {storyLabText.trim().split(/\s+/).filter(Boolean).length}
                      </span>
                      <button
                        onClick={() => {
                          sound.playClick();
                          sound.playSuccess();
                          setStoryLabFeedback(
                            '🌟 Outstanding narrative pacing! Your sensory details capture suspense vividly. Consider incorporating more varied dialogue tags for even higher creative depth.'
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Narrative With AI</span>
                      </button>
                    </div>

                    {storyLabFeedback && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-medium text-emerald-900 animate-fade-in">
                        {storyLabFeedback}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 3: Mental Math & Logic */}
          {juniorSubTab === 'math' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const currentMath = mentalMathChallenges[mathIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-blue-600">Cognitive Mental Arithmetic</span>
                        <h3 className="text-xl font-black text-slate-900">Mental Math &amp; Pattern Logic</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-black">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span>Score: {mathScore}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-black">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span>Streak: {mathStreak}</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Box */}
                    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 text-center space-y-3">
                      <span className="text-xs font-bold uppercase text-cyan-400">Challenge #{mathIndex + 1}</span>
                      <h4 className="text-3xl sm:text-4xl font-black font-mono tracking-wide">{currentMath.problem}</h4>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {currentMath.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            sound.playClick();
                            setMathUserAnswer(opt);
                            if (opt === currentMath.correctAnswer) {
                              sound.playLevelUp();
                              setMathScore((s) => s + 10);
                              setMathStreak((st) => st + 1);
                            } else {
                              sound.playError();
                              setMathStreak(0);
                            }
                          }}
                          className={`p-4 rounded-2xl border text-lg font-black font-mono transition-all ${
                            mathUserAnswer === opt
                              ? opt === currentMath.correctAnswer
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                                : 'bg-rose-500 text-white border-rose-600'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Mental Shortcut Explanation */}
                    {mathUserAnswer !== null && (
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1 animate-fade-in text-xs text-blue-950">
                        <strong className="block font-black uppercase text-blue-800">💡 Superpower Mental Shortcut:</strong>
                        <p>{currentMath.mentalTrick}</p>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setMathIndex((m) => (m + 1) % mentalMathChallenges.length);
                          setMathUserAnswer(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <span>Next Calculation</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 4: Spaced Repetition Flashcards */}
          {juniorSubTab === 'flashcards' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600">Ebbinghaus Memory Retention</span>
                <h3 className="text-xl font-black text-slate-900">Spaced Repetition Concept Flashcards</h3>
                <p className="text-xs text-slate-500">Tap to flip and review scientific laws and core concepts for long-term mastery.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {spacedRepetitionCards.map((card) => {
                  const isRevealed = revealedFlashcards[card.id];
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        sound.playClick();
                        setRevealedFlashcards((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
                      }}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 cursor-pointer transition-all shadow-xs flex flex-col justify-between min-h-[200px]"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {card.subject}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">{card.question}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80">
                        {isRevealed ? (
                          <div className="space-y-1 animate-fade-in">
                            <span className="text-[11px] font-extrabold text-emerald-700 block">Answer: {card.answer}</span>
                            <p className="text-[10px] text-slate-500 leading-tight">{card.explanation}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                            <span>Tap to reveal answer</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AGES 15-24: ACADEMY & HIGH-STAKES EXAMS ARENA */}
      {/* ========================================================================= */}
      {activeCohort === 'academy' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => { sound.playClick(); setAcademySubTab('tfng'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                academySubTab === 'tfng' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚖️ True / False / Not Given Simulator
            </button>
            <button
              onClick={() => { sound.playClick(); setAcademySubTab('task2'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                academySubTab === 'task2' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📝 Task 2 Essay Rubric Evaluator &amp; Band 9 Injector
            </button>
            <button
              onClick={() => { sound.playClick(); setAcademySubTab('cuecard'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                academySubTab === 'cuecard' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎙️ Speaking Part 2 Cue Card Timer
            </button>
          </div>

          {/* SubTab 1: True / False / Not Given Simulator */}
          {academySubTab === 'tfng' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const item = tfngExercises[activeTfngIndex];
                const isSelected = tfngUserChoice !== null;
                const isCorrect = tfngUserChoice === item.answer;

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
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
                          setTfngUserChoice(null);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {tfngExercises.map((ex, idx) => (
                          <option key={ex.id} value={idx}>Exercise #{idx + 1}</option>
                        ))}
                      </select>
                    </div>

                    {/* Passage Snippet */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Passage Extract: {item.passageTitle}</span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
                        "{item.passageSnippet}"
                      </p>
                    </div>

                    {/* Statement to verify */}
                    <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-200 space-y-2">
                      <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Candidate Statement to Verify:</span>
                      <p className="text-sm sm:text-base font-extrabold text-slate-900">
                        "{item.statement}"
                      </p>
                    </div>

                    {/* Choice Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((choice) => (
                        <button
                          key={choice}
                          onClick={() => {
                            sound.playClick();
                            setTfngUserChoice(choice);
                            if (choice === item.answer) sound.playSuccess();
                            else sound.playError();
                          }}
                          className={`py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all border ${
                            tfngUserChoice === choice
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

                    {/* Rubric Rationale & Strategy Tip */}
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

          {/* SubTab 2: Task 2 Essay Rubric Evaluator & Band 9 Injector */}
          {academySubTab === 'task2' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-indigo-600">Cambridge &amp; ETS Automated Scoring</span>
                  <h3 className="text-xl font-black text-slate-900">Task 2 Essay Rubric Evaluator</h3>
                  <p className="text-xs text-slate-500">Live word counter with one-click Band 9 academic template injector.</p>
                </div>
                {/* Word Counter Metric */}
                {(() => {
                  const words = task2EssayText.trim().split(/\s+/).filter(Boolean).length;
                  const isUnder = words < 250;
                  return (
                    <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                      isUnder ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <FileCheck className="w-4 h-4" />
                      <span>{words} Words {isUnder ? '(Target: 250+ Words)' : '✓ Valid Length'}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Band 9 Template Injector Dropdown / Selector */}
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

              {/* Text Area */}
              <textarea
                rows={8}
                value={task2EssayText}
                onChange={(e) => setTask2EssayText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                placeholder="Draft your IELTS / TOEFL Task 2 Academic Argumentative Essay here..."
              />

              {/* 4 Rubric Evaluator Bar */}
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

          {/* SubTab 3: Speaking Part 2 Cue Card Timer */}
          {academySubTab === 'cuecard' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const card = cueCardItems[activeCueCardIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
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
                          setCueCardPhase('idle');
                          setCueCardTimer(60);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {cueCardItems.map((c, idx) => (
                          <option key={c.id} value={idx}>Cue Card #{idx + 1}</option>
                        ))}
                      </select>
                    </div>

                    {/* Candidate Cue Card Box */}
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

                    {/* Timer Status Card */}
                    <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {cueCardPhase === 'prep' ? '⏱️ Preparation Phase (1 Minute)' : cueCardPhase === 'speaking' ? '🎙️ Speaking Turn (2 Minutes)' : 'Simulator Ready'}
                      </span>
                      <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400">
                        {Math.floor(cueCardTimer / 60)}:{(cueCardTimer % 60).toString().padStart(2, '0')}
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        {cueCardPhase === 'idle' ? (
                          <button
                            onClick={() => {
                              sound.playClick();
                              setCueCardPhase('prep');
                              setCueCardTimer(60);
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
                              setCueCardPhase('idle');
                              setCueCardTimer(60);
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                          >
                            Reset Timer
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scratchpad during Prep */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Candidate Scratch Notepad (Keywords &amp; Collocations):</label>
                      <input
                        type="text"
                        value={cueCardNotes}
                        onChange={(e) => setCueCardNotes(e.target.value)}
                        placeholder="Type quick bullet keywords (e.g., decentralized microgrid, photovoltaic, 35% tariff drop)..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
                      />
                    </div>

                    {/* Band 9 Model Speech Audio & Script */}
                    <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-indigo-900">Band 9 Model Response &amp; Prosody</span>
                        <button
                          onClick={() => speakTextWithCohort(card.sampleBand9Response)}
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
      )}

      {/* ========================================================================= */}
      {/* 4. AGES 25-54: PROFESSIONAL & CAREER FLUENCY ARENA */}
      {/* ========================================================================= */}
      {activeCohort === 'pro' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => { sound.playClick(); setProSubTab('email'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                proSubTab === 'email' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              💼 Executive Email Diplomacy Analyzer
            </button>
            <button
              onClick={() => { sound.playClick(); setProSubTab('pitch'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                proSubTab === 'pitch' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⏱️ 60-Second Elevator Pitch Monitor
            </button>
            <button
              onClick={() => { sound.playClick(); setProSubTab('drills'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                proSubTab === 'drills' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚆 15-Minute Commute Workplace Drills
            </button>
          </div>

          {/* SubTab 1: Executive Email Diplomacy */}
          {proSubTab === 'email' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const scenario = emailDiplomacyScenarios[activeEmailIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase text-emerald-600">Workplace Assertive Diplomacy</span>
                        <h3 className="text-xl font-black text-slate-900">{scenario.title}</h3>
                      </div>
                      <select
                        value={activeEmailIndex}
                        onChange={(e) => {
                          sound.playClick();
                          setActiveEmailIndex(Number(e.target.value));
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {emailDiplomacyScenarios.map((s, idx) => (
                          <option key={s.id} value={idx}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                      <strong>Corporate Context:</strong> {scenario.corporateContext}
                    </div>

                    {/* Side-by-side: Raw vs Diplomatic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Raw Draft */}
                      <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">
                          ⚠️ Impulsive / Blunt Draft
                        </span>
                        <p className="text-xs text-rose-950 leading-relaxed font-mono">
                          "{scenario.rawDraft}"
                        </p>
                      </div>

                      {/* Diplomatic Rewrite */}
                      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                            ✓ Executive Diplomatic Calibrated Solution
                          </span>
                          <button
                            onClick={() => speakTextWithCohort(scenario.diplomaticRewrite)}
                            className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed whitespace-pre-wrap font-sans">
                          {scenario.diplomaticRewrite}
                        </p>
                      </div>
                    </div>

                    {/* Diplomacy Metric Meters */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Politeness Score</span>
                        <span className="text-base font-extrabold text-emerald-600">{scenario.politenessScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Assertiveness Score</span>
                        <span className="text-base font-extrabold text-emerald-600">{scenario.assertivenessScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] font-black uppercase text-slate-400 block">Clarity Rating</span>
                        <span className="text-base font-extrabold text-emerald-600">{scenario.clarityScore}%</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                      <strong>Tactical Strategy Rationale:</strong> {scenario.tacticalNotes}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 2: 60-Second Elevator Pitch Monitor */}
          {proSubTab === 'pitch' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const pitch = elevatorPitchPrompts[pitchIndex];
                const wpm = pitchSpokenWords;
                const isOptimalWpm = wpm >= 130 && wpm <= 155;

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-emerald-600">Executive Presence &amp; Cadence</span>
                        <h3 className="text-xl font-black text-slate-900">60-Second Elevator Pitch Pacing Monitor</h3>
                        <p className="text-xs text-slate-500">Evaluates words-per-minute fluency. Ideal executive cadence: 130 to 155 WPM.</p>
                      </div>
                      <select
                        value={pitchIndex}
                        onChange={(e) => {
                          sound.playClick();
                          setPitchIndex(Number(e.target.value));
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {elevatorPitchPrompts.map((p, idx) => (
                          <option key={p.id} value={idx}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Timer Box */}
                    <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        {isPitchRecording ? '🎙️ Recording & Pacing Analysis Active' : 'Ready for Pitch Delivery'}
                      </span>
                      <div className="text-5xl font-black font-mono text-emerald-300">
                        00:{pitchSeconds.toString().padStart(2, '0')}
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setIsPitchRecording(!isPitchRecording);
                            if (!isPitchRecording) setPitchSeconds(60);
                          }}
                          className={`px-6 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                            isPitchRecording
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                          }`}
                        >
                          <Mic className="w-4 h-4" />
                          <span>{isPitchRecording ? 'Stop Recording' : 'Start 60s Timed Pitch'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Live WPM Calculation Result */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                        <span className="text-xs font-black uppercase text-emerald-800">Live Pacing Velocity</span>
                        <div className="text-2xl font-black text-emerald-900">{wpm} WPM</div>
                        <p className="text-xs text-emerald-700">
                          {isOptimalWpm
                            ? '✓ Perfect executive cadence! You speak with poised confidence without rushing.'
                            : '⚠️ Slightly fast or slow. Aim for 130–155 WPM for maximum boardroom clarity.'}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-xs font-black uppercase text-slate-500">Benchmark Target</span>
                        <div className="text-2xl font-black text-slate-800">{pitch.wpmTarget}</div>
                        <p className="text-xs text-slate-500">Optimal listener cognitive absorption window.</p>
                      </div>
                    </div>

                    {/* Model Pitch Script */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase">Model Script for Practice:</span>
                        <button
                          onClick={() => speakTextWithCohort(pitch.modelScript)}
                          className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Model Cadence</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans italic">
                        "{pitch.modelScript}"
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 3: Commute 15-Minute Drills */}
          {proSubTab === 'drills' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-600">Knowles' Adult Andragogy</span>
                <h3 className="text-xl font-black text-slate-900">15-Minute Commute Workplace Drills</h3>
                <p className="text-xs text-slate-500">High-impact practical microlearning drills that fit into your morning or evening commute.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-black uppercase text-emerald-600">Drill 1 • 5 Mins</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Pushing Back on Scope Creep</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Practice replying to client feature additions by introducing an addendum timeline adjustment instead of a flat rejection.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-black uppercase text-emerald-600">Drill 2 • 5 Mins</span>
                  <h4 className="text-sm font-extrabold text-slate-900">De-escalating Angry Stakeholders</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Validate emotional frustration without admitting reckless liability; pair an incident post-mortem with contractual credits.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-black uppercase text-emerald-600">Drill 3 • 5 Mins</span>
                  <h4 className="text-sm font-extrabold text-slate-900">Executive Summary Condensation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transform 10 pages of raw technical analytics into three bullet points: What happened, What it cost, What we recommend.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AGES 55+: GOLDEN AGE & LIFELONG LEARNING ARENA */}
      {/* ========================================================================= */}
      {activeCohort === 'senior' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => { sound.playClick(); setSeniorSubTab('memory'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                seniorSubTab === 'memory' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌸 Gentle Word Association Memory Gym
            </button>
            <button
              onClick={() => { sound.playClick(); setSeniorSubTab('journal'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                seniorSubTab === 'journal' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              📖 Daily Reminiscence &amp; Reflective Journaling
            </button>
            <button
              onClick={() => { sound.playClick(); setSeniorSubTab('safety'); }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                seniorSubTab === 'safety' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🛡️ Everyday Digital Safety Guide
            </button>
          </div>

          {/* SubTab 1: Gentle Word Association Memory Gym */}
          {seniorSubTab === 'memory' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-rose-600">Cognitive Reserve Preservation</span>
                  <h3 className="text-xl font-black text-slate-900">Gentle Word Association Memory Gym</h3>
                  <p className="text-xs text-slate-500">Zero penalties, zero stress. Connect related semantic words to stimulate neuroplasticity.</p>
                </div>
                <button
                  onClick={() => speakSeniorCalm('Welcome to the Memory Gym. Take your time, relax, and match words that belong together in harmony.')}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span>Calm 0.82x Voice Guide</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 text-xs text-rose-950">
                <strong>How to play:</strong> Tap a word on the left, then tap its matching connection on the right. Once connected, enjoy the soothing association!
              </div>

              {/* Word Pair Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memoryGymPairs.map((pair) => {
                  const isMatched = matchedPairs[pair.id];
                  const isASelected = selectedWordA === pair.wordA;

                  return (
                    <div
                      key={pair.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          disabled={isMatched}
                          onClick={() => handleSelectWordA(pair.wordA)}
                          className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                            isASelected
                              ? 'bg-rose-600 text-white shadow-md'
                              : isMatched
                              ? 'bg-emerald-100 text-emerald-900 font-extrabold'
                              : 'bg-white text-slate-800 border border-slate-300 hover:border-rose-400'
                          }`}
                        >
                          {pair.icon} {pair.wordA}
                        </button>

                        <span className="text-xs font-bold text-slate-400">↔</span>

                        <button
                          disabled={isMatched}
                          onClick={() => handleSelectWordB(pair.wordB, pair)}
                          className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                            isMatched
                              ? 'bg-emerald-100 text-emerald-900 font-extrabold'
                              : 'bg-white text-slate-800 border border-slate-300 hover:border-rose-400'
                          }`}
                        >
                          {pair.wordB}
                        </button>
                      </div>

                      {isMatched && (
                        <div className="mt-3 pt-2 border-t border-emerald-200 text-xs text-emerald-900 leading-snug animate-fade-in flex items-center justify-between">
                          <span>✓ {pair.semanticConnection}</span>
                          <button
                            onClick={() => speakSeniorCalm(pair.semanticConnection)}
                            className="text-emerald-700 hover:text-emerald-900 p-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab 2: Daily Reminiscence & Reflective Journaling */}
          {seniorSubTab === 'journal' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const prompt = reminiscencePrompts[reminiscenceIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-rose-600">Personal Memoir &amp; Neural Recall</span>
                        <h3 className="text-xl font-black text-slate-900">Daily Reminiscence &amp; Reflective Journaling</h3>
                      </div>
                      <select
                        value={reminiscenceIndex}
                        onChange={(e) => {
                          sound.playClick();
                          setReminiscenceIndex(Number(e.target.value));
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {reminiscencePrompts.map((p, idx) => (
                          <option key={p.id} value={idx}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Warm Prompt Card */}
                    <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-3xl p-6 border border-rose-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-rose-800">{prompt.category}</span>
                        <button
                          onClick={() => speakSeniorCalm(`${prompt.promptText} ${prompt.reflectiveQuestion}`)}
                          className="px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-50"
                        >
                          <Volume2 className="w-4 h-4 text-rose-600" />
                          <span>0.82x Gentle Narrator</span>
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
                        {prompt.promptText}
                      </p>
                      <p className="text-xs font-bold text-rose-900 pt-1">
                        💭 {prompt.reflectiveQuestion}
                      </p>
                    </div>

                    {/* Journal Writing Pad */}
                    <textarea
                      rows={6}
                      value={activeJournalInput}
                      onChange={(e) => setActiveJournalInput(e.target.value)}
                      placeholder="Write your cherished memory here... Take all the time you need."
                      className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Your reflections are preserved privately in your local browser storage.</span>
                      <button
                        onClick={() => {
                          sound.playClick();
                          sound.playSuccess();
                          setJournalEntries((prev) => ({ ...prev, [prompt.id]: activeJournalInput }));
                          speakSeniorCalm('Thank you for writing down this precious reflection. It is safely preserved.');
                        }}
                        className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                      >
                        Preserve in Memoir Vault
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SubTab 3: Everyday Digital Safety Guide */}
          {seniorSubTab === 'safety' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {(() => {
                const guide = digitalSafetyGuides[safetyIndex];
                return (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase text-rose-600">Senior Digital Confidence &amp; Scam Defense</span>
                        <h3 className="text-xl font-black text-slate-900">{guide.title}</h3>
                      </div>
                      <select
                        value={safetyIndex}
                        onChange={(e) => {
                          sound.playClick();
                          setSafetyIndex(Number(e.target.value));
                          setSafetyUserGuess(null);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700"
                      >
                        {digitalSafetyGuides.map((g, idx) => (
                          <option key={g.id} value={idx}>{g.title}</option>
                        ))}
                      </select>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {guide.description}
                    </p>

                    {/* Red Flags List */}
                    <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 space-y-2">
                      <span className="text-xs font-black uppercase text-rose-800 block">🚩 Warning Red Flags to Watch Out For:</span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-rose-950 font-medium">
                        {guide.redFlags.map((rf, rIdx) => (
                          <li key={rIdx}>{rf}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Safe Protocol */}
                    <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-1 text-xs text-emerald-950">
                      <strong className="block font-black uppercase text-emerald-800">🛡️ Safe Action Protocol:</strong>
                      <p>{guide.safeActionProtocol}</p>
                    </div>

                    {/* Interactive Scam Spotting Challenge */}
                    <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-rose-400">Spot the Scam Interactive Test</span>
                        <button
                          onClick={() => speakSeniorCalm(guide.interactiveScenario.previewText)}
                          className="text-xs text-slate-300 font-bold hover:underline flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Message</span>
                        </button>
                      </div>

                      <div className="bg-slate-800 p-4 rounded-xl font-mono text-xs text-amber-300 leading-relaxed border border-slate-700">
                        {guide.interactiveScenario.previewText}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSafetyUserGuess(true);
                            if (guide.interactiveScenario.isScam) sound.playSuccess();
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            safetyUserGuess === true
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          🚨 This is a Scam!
                        </button>
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSafetyUserGuess(false);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            safetyUserGuess === false
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          ✓ This is Safe &amp; Legitimate
                        </button>
                      </div>

                      {safetyUserGuess !== null && (
                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-200 animate-fade-in">
                          <strong className="text-emerald-400 block mb-1">
                            {safetyUserGuess === guide.interactiveScenario.isScam ? '✓ Correct Verification!' : '⚠️ Caution:'}
                          </strong>
                          {guide.interactiveScenario.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

