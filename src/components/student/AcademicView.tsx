import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calculator,
  Atom,
  Cpu,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Code2,
  TrendingUp,
  Brain
} from 'lucide-react';
import { AcademicTopic, AcademicSubject } from '../../types';
import { sound } from '../../utils/audio';
import { StorageService } from '../../services/storage';
import { shuffleIndexedOptions } from '../../utils/questionShuffler';

interface AcademicViewProps {
  topics: AcademicTopic[];
  onConsultAI: (topicTitle: string, formula?: string) => void;
}

export const AcademicView: React.FC<AcademicViewProps> = ({ topics, onConsultAI }) => {
  const [activeSubject, setActiveSubject] = useState<AcademicSubject>('Mathematics');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const subjects: { name: AcademicSubject; icon: React.ReactNode; color: string }[] = [
    { name: 'Mathematics', icon: <Calculator className="w-4 h-4" />, color: 'text-indigo-600' },
    { name: 'Science', icon: <Atom className="w-4 h-4" />, color: 'text-emerald-600' },
    { name: 'Technology', icon: <Cpu className="w-4 h-4" />, color: 'text-blue-600' }
  ];

  const filteredTopics = topics.filter((t) => t.subject === activeSubject);
  const activeTopic = topics.find((t) => t.id === selectedTopicId) || filteredTopics[0] || topics[0];

  // Dynamically randomized option order for the active practice problem
  const [shuffledProblem, setShuffledProblem] = useState<{ options: string[]; correctIndex: number } | null>(null);

  useEffect(() => {
    if (activeTopic?.practiceProblem) {
      setShuffledProblem(
        shuffleIndexedOptions(activeTopic.practiceProblem.options, activeTopic.practiceProblem.correctIndex)
      );
      setSelectedOption(null);
      setShowSolution(false);
    }
  }, [activeTopic?.id]);

  const activeOptions = shuffledProblem?.options || activeTopic?.practiceProblem.options || [];
  const activeCorrectIndex = shuffledProblem !== null ? shuffledProblem.correctIndex : (activeTopic?.practiceProblem.correctIndex ?? 0);

  const handleSelectOption = (idx: number) => {
    sound.playClick();
    setSelectedOption(idx);
    setShowSolution(true);
    const isCorrect = activeTopic && idx === activeCorrectIndex;
    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    // Record question attempt and learning activity with exact timestamp
    if (activeTopic) {
      const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      StorageService.recordQuestionAttempt({
        userId: 'usr_student_01',
        userName: 'Educator Rivera',
        testId: activeTopic.id,
        testTitle: activeTopic.title,
        moduleOrSubject: activeTopic.subject,
        questionNumber: 1,
        questionPrompt: activeTopic.practiceProblem.question,
        options: activeOptions,
        userAnswer: activeOptions[idx] || `Option #${idx + 1}`,
        correctAnswer: activeOptions[activeCorrectIndex],
        isCorrect: !!isCorrect,
        score: isCorrect ? '1/1 (Correct)' : '0/1 (Needs Review)',
        explanation: activeTopic.practiceProblem.stepByStepSolution?.join(' ') || 'Standard step-by-step derivation.',
        timestamp: nowTimestamp
      });

      StorageService.recordUserActivity({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: 'usr_student_01',
        userName: 'Educator Rivera',
        type: 'stem_game',
        title: `${activeTopic.subject}: ${activeTopic.title}`,
        category: `${activeTopic.subject} Mastery`,
        score: isCorrect ? '100% (Correct)' : 'Needs Review',
        xpEarned: isCorrect ? 25 : 10,
        totalQuestions: 1,
        attemptedQuestions: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
        status: 'completed',
        details: `Practiced ${activeTopic.subCategory} problem: "${activeTopic.practiceProblem.question}". ${isCorrect ? 'Answered correctly!' : 'Reviewed complete step-by-step derivation.'} Total Questions: 1 · Answers: 1 · Correct: ${isCorrect ? 1 : 0} · Wrong: ${isCorrect ? 0 : 1}.`,
        replayPayload: {
          tab: 'academic',
          subId: activeTopic.id
        }
      });
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <BookOpen className="w-4 h-4" />
            <span>Khan Academy-Style Mastery Ecosystem</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Concept Mastery &amp; First Principles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Build rigorous conceptual intuition across STEM with step-by-step problem deconstruction.
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {subjects.map((sub) => {
            const isSelected = activeSubject === sub.name;
            return (
              <button
                key={sub.name}
                onClick={() => {
                  sound.playClick();
                  setActiveSubject(sub.name);
                  const firstOfSubject = topics.find((t) => t.subject === sub.name);
                  if (firstOfSubject) setSelectedTopicId(firstOfSubject.id);
                  setSelectedOption(null);
                  setShowSolution(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.icon}
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Topics List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            {activeSubject} Modules
          </h3>
          <div className="space-y-2">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic?.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopicId(topic.id);
                    setSelectedOption(null);
                    setShowSolution(false);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md border-indigo-700'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1 opacity-90">
                    <span className="font-semibold uppercase tracking-wider">{topic.subCategory}</span>
                    <span>{topic.masteryPercent}% Mastery</span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base leading-snug">{topic.title}</h4>
                  
                  {/* Mastery mini progress bar */}
                  <div className="mt-2.5 w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isSelected ? 'bg-amber-300' : 'bg-indigo-500'}`}
                      style={{ width: `${topic.masteryPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Concept Card & Practice Problem */}
        <div className="lg:col-span-8 space-y-6">
          {activeTopic ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <span>{activeTopic.subject}</span>
                    <span>·</span>
                    <span>{activeTopic.subCategory}</span>
                    <span>·</span>
                    <span className="text-slate-500">{activeTopic.level}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                    {activeTopic.title}
                  </h3>
                </div>

                {/* DeepSeek 8B Reasoning Button */}
                <button
                  onClick={() => onConsultAI(activeTopic.title, activeTopic.formulaOrSnippet)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0"
                >
                  <Brain className="w-4 h-4 text-amber-400" />
                  <span>Ask DeepSeek 8B Reasoner</span>
                </button>
              </div>

              {/* Concept Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Intuition</h4>
                <p className="text-sm leading-relaxed text-slate-700">{activeTopic.summary}</p>
              </div>

              {/* Formula or Code Snippet */}
              {activeTopic.formulaOrSnippet && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Governing Equation / Code Pattern
                  </h4>
                  <pre className="p-4 bg-slate-900 text-amber-300 rounded-2xl text-xs sm:text-sm font-mono overflow-x-auto shadow-inner leading-relaxed">
                    {activeTopic.formulaOrSnippet}
                  </pre>
                </div>
              )}

              {/* Key Concepts Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Sub-Concepts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTopic.keyConcepts.map((kc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{kc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Practice Problem */}
              <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Checkpoint Practice Problem
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Instant Verification</span>
                </div>

                <p className="text-base font-bold text-slate-900">
                  {activeTopic.practiceProblem.question}
                </p>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeOptions.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeCorrectIndex;
                    let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        style = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                      } else if (isSelected) {
                        style = 'bg-rose-500 text-white border-rose-600 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`p-3.5 rounded-xl border text-sm font-medium transition-all text-left ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Step-by-step Solution */}
                {showSolution && (
                  <div className="p-4 bg-white rounded-xl border border-indigo-200 text-xs space-y-2 animate-in fade-in">
                    <span className="font-bold text-indigo-950 block">Step-by-Step Analytical Deconstruction:</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      {activeTopic.practiceProblem.stepByStepSolution.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select a module from the left list.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
