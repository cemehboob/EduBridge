/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QuestionSolverView Component for EduBridge
 * AI-Powered Universal Question Solver & Interactive Digital Learning Assistant.
 * Provides Keyboard, Handwriting (Mouse as digital pen), Voice, and Image inputs,
 * step-by-step verified solutions, educational highlights, and multilingual speech narration.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Keyboard,
  PenTool,
  Mic,
  MicOff,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Atom,
  Binary,
  PenLine,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Languages,
  Upload,
  ArrowRight
} from 'lucide-react';
import {
  SolverSubject,
  SolverResponse,
  InputMode
} from '../../types/solver';
import { QuestionSolverService } from '../../services/questionSolverService';
import { HandwritingCanvas } from './HandwritingCanvas';
import { FormulaToolbar } from './FormulaToolbar';
import { OCRService } from '../../services/ocrService';
import {
  SpeechService,
  SUPPORTED_LANGUAGES,
  SpeechLanguage
} from '../../services/speechService';
import { sound } from '../../utils/audio';

interface QuestionSolverViewProps {
  initialSubject?: SolverSubject;
  onQuestionSolved?: (subject: SolverSubject) => void;
}

const SAMPLE_QUESTIONS: { subject: SolverSubject; label: string; question: string }[] = [
  {
    subject: 'Mathematics',
    label: 'Linear Eq (Math)',
    question: 'Solve for x: 2x + 5 = 15'
  },
  {
    subject: 'Mathematics',
    label: 'Quadratic (Math)',
    question: 'Find the roots of x² - 5x + 6 = 0'
  },
  {
    subject: 'Physics',
    label: 'Newton Law (Physics)',
    question: 'Calculate the net force required to accelerate a 5 kg mass at 3 m/s².'
  },
  {
    subject: 'Chemistry',
    label: 'Equation (Chemistry)',
    question: 'Balance the chemical reaction: H2 + O2 -> H2O'
  },
  {
    subject: 'Biology',
    label: 'Cell Energy (Biology)',
    question: 'How do mitochondria synthesize ATP during cellular respiration?'
  },
  {
    subject: 'English',
    label: 'Passive Voice (English)',
    question: 'Convert into passive voice: "The research team discovered a groundbreaking cure."'
  },
  {
    subject: 'Essay Writing',
    label: 'Essay Architecture',
    question: 'Write an essay on the impact of artificial intelligence on future employment.'
  },
  {
    subject: 'Computer Science',
    label: 'Binary Base-2 (CS)',
    question: 'Explain how to convert decimal integer 42 into binary number system.'
  }
];

export const QuestionSolverView: React.FC<QuestionSolverViewProps> = ({
  onQuestionSolved
}) => {
  // Input State
  const [activeMode, setActiveMode] = useState<InputMode>('keyboard');
  const [questionText, setQuestionText] = useState<string>('Solve for x: 2x + 5 = 15');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [solverResult, setSolverResult] = useState<SolverResponse | null>(null);

  // Voice Input State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US');
  const [voiceError, setVoiceError] = useState<string>('');

  // Speech Narration State (TTS)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Settings / API Key modal toggle (optional)
  const [customApiKey, setCustomApiKey] = useState<string>('');

  // Auto-solve default sample on first mount for instant gratification
  useEffect(() => {
    handleSolveQuestion('Solve for x: 2x + 5 = 15', 'keyboard');
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      SpeechService.stopSpeaking();
      SpeechService.stopListening();
    };
  }, []);

  /**
   * Solve Question Core Handler
   */
  const handleSolveQuestion = async (textToSolve?: string, mode?: InputMode) => {
    const raw = (textToSolve !== undefined ? textToSolve : questionText).trim();
    if (!raw) return;

    sound.playClick();
    setIsProcessing(true);
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveStepIndex(null);

    try {
      const modeUsed = mode || activeMode;
      const result = await QuestionSolverService.solveQuestion(
        raw,
        modeUsed,
        customApiKey,
        speechLanguage
      );
      setSolverResult(result);
      if (onQuestionSolved) {
        onQuestionSolved(result.subject);
      }
      sound.playSuccess();
    } catch (err) {
      console.error('Error solving question:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Formula toolbar symbol insert
   */
  const handleInsertSymbol = (symbol: string) => {
    setQuestionText((prev) => prev + symbol);
  };

  /**
   * Handwriting recognition callback
   */
  const handleCaptureHandwriting = async (dataUrl: string) => {
    setIsProcessing(true);
    sound.playClick();
    try {
      const ocrResult = await OCRService.recognizeHandwriting(dataUrl, customApiKey);
      if (ocrResult.text) {
        setQuestionText(ocrResult.text);
        sound.playSuccess();
      }
    } catch (err) {
      console.error('OCR Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Image file upload handling
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedImagePreview(dataUrl);
      setIsProcessing(true);
      try {
        const ocrResult = await OCRService.recognizeImage(dataUrl, customApiKey);
        if (ocrResult.text) {
          setQuestionText(ocrResult.text);
          sound.playSuccess();
        }
      } catch (err) {
        console.error('Image OCR error:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Voice Input Recording Toggle (STT)
   */
  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      SpeechService.stopListening();
      setIsRecording(false);
      sound.playClick();
    } else {
      setVoiceError('');
      const started = SpeechService.startListening(
        speechLanguage,
        (transcript, isFinal) => {
          setQuestionText(transcript);
          if (isFinal) {
            setIsRecording(false);
            sound.playSuccess();
          }
        },
        (errorMsg) => {
          setVoiceError(errorMsg);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
      if (started) {
        setIsRecording(true);
        sound.playClick();
      }
    }
  };

  /**
   * Text-to-Speech Playback Controls (TTS)
   */
  const handlePlayVoiceResponse = () => {
    if (!solverResult) return;

    if (isPaused) {
      SpeechService.resumeSpeaking();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    sound.playClick();
    setIsSpeaking(true);
    setIsPaused(false);

    SpeechService.speak(
      solverResult.voiceSpeechScript,
      speechLanguage,
      () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveStepIndex(null);
      }
    );
  };

  const handlePauseVoice = () => {
    SpeechService.pauseSpeaking();
    setIsPaused(true);
    setIsSpeaking(false);
  };

  const handleStopVoice = () => {
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveStepIndex(null);
  };

  const getSubjectBadge = (subject: SolverSubject) => {
    switch (subject) {
      case 'Mathematics':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: Binary };
      case 'Physics':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Atom };
      case 'Chemistry':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Sparkles };
      case 'Biology':
        return { bg: 'bg-teal-100 text-teal-800 border-teal-200', icon: Brain };
      case 'English':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: BookOpen };
      case 'Essay Writing':
        return { bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: PenLine };
      case 'Computer Science':
        return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Binary };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-200', icon: Lightbulb };
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Header Banner - Digital Classroom Learning Assistant */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal AI Question Solver</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Interactive Digital Classroom &amp; Problem Solver
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Ask any educational question using keyboard, digital pen handwriting, speech, or images.
              Receive rigorously verified solutions with step-by-step logic and multilingual voice narration.
            </p>
          </div>

          {/* Language Selector & Settings */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700 text-xs">
              <Languages className="w-4 h-4 text-indigo-400" />
              <select
                value={speechLanguage}
                onChange={(e) => setSpeechLanguage(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Top Column: Input Workspace (7 cols on large screens for maximum space) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Input Method Navigation Tabs */}
            <div className="p-2 sm:p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center gap-1.5">
              {[
                { id: 'keyboard', label: 'Keyboard Editor', icon: Keyboard },
                { id: 'handwriting', label: 'Digital Pen Canvas', icon: PenTool },
                { id: 'voice', label: 'Voice Input', icon: Mic },
                { id: 'image', label: 'Image / Diagram', icon: ImageIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveMode(tab.id as InputMode);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Workspace Body by Mode */}
            <div className="p-4 sm:p-5">

              {/* Mode 1: Keyboard Input */}
              {activeMode === 'keyboard' && (
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Type your question, equation, or essay prompt here..."
                      rows={5}
                      className="w-full p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 font-mono text-sm sm:text-base text-slate-800 resize-none outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  {/* Formula Toolbar */}
                  <FormulaToolbar onInsertSymbol={handleInsertSymbol} className="rounded-xl border" />
                </div>
              )}

              {/* Mode 2: Handwriting Canvas */}
              {activeMode === 'handwriting' && (
                <div className="space-y-3">
                  <HandwritingCanvas
                    onCaptureHandwriting={handleCaptureHandwriting}
                    isProcessing={isProcessing}
                  />
                </div>
              )}

              {/* Mode 3: Voice Input */}
              {activeMode === 'voice' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center relative">
                    {isRecording && (
                      <span className="absolute inset-0 rounded-3xl bg-red-500/20 animate-ping" />
                    )}
                    <button
                      type="button"
                      onClick={handleToggleVoiceRecording}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-md cursor-pointer ${
                        isRecording ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {isRecording ? 'Listening carefully...' : 'Click to start speaking your question'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Speak clearly in your preferred language ({SUPPORTED_LANGUAGES.find((l) => l.code === speechLanguage)?.name}).
                      Speech is automatically transcribed into the question confirmation box below.
                    </p>
                  </div>

                  {voiceError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {voiceError}
                    </div>
                  )}
                </div>
              )}

              {/* Mode 4: Image Input */}
              {activeMode === 'image' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {uploadedImagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={uploadedImagePreview}
                        alt="Uploaded question"
                        className="max-h-56 mx-auto rounded-xl border border-slate-200 shadow-sm object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                      >
                        Choose another image
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer space-y-2 py-4"
                    >
                      <Upload className="w-10 h-10 text-indigo-500 mx-auto animate-bounce" />
                      <p className="font-extrabold text-slate-800 text-sm">
                        Upload or capture a photo of a textbook, test paper, or diagram
                      </p>
                      <p className="text-xs text-slate-400">
                        PNG, JPG, or WEBP up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recognized Question Confirmation & Verification Area */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Recognized Question for AI Processing:
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuestionText('')}
                    className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Review recognized question or edit before solving..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 font-semibold text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit / Solve Action Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-medium">
                  Press Solve to generate step-by-step verified explanation.
                </span>

                <button
                  type="button"
                  onClick={() => handleSolveQuestion()}
                  disabled={isProcessing || !questionText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Analyzing & Solving...' : 'Solve Question'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Quick Subject Test Samples */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Instant Multi-Subject Examples:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setQuestionText(s.question);
                    handleSolveQuestion(s.question, 'keyboard');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Solution Workspace & Interactive Step-by-Step Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {solverResult ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
              
              {/* Subject & Difficulty Classification Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getSubjectBadge(solverResult.subject);
                    const Icon = badge.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${badge.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{solverResult.subject}</span>
                      </span>
                    );
                  })()}
                  <span className="text-xs font-extrabold text-slate-600">
                    {solverResult.topic}
                  </span>
                </div>

                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {solverResult.difficulty} Level
                </span>
              </div>

              {/* Ambiguity Alert Prompt (if clarification needed) */}
              {solverResult.isAmbiguous && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-amber-900 text-sm">
                      Clarification Needed
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {solverResult.clarificationPrompt}
                    </p>
                  </div>
                </div>
              )}

              {/* Multilingual Spoken Audio Response Controls (Phase 5) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`} />
                  <span className="text-xs font-black text-slate-800">
                    Voice Explanation
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isSpeaking ? (
                    <button
                      type="button"
                      onClick={handlePlayVoiceResponse}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isPaused ? 'Resume' : 'Listen'}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handlePauseVoice}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Pause className="w-3 h-3" />
                        <span>Pause</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleStopVoice}
                        className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 cursor-pointer"
                        title="Stop speech"
                      >
                        <Square className="w-3 h-3 fill-rose-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Prominent Final Answer Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-600/20 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Final Answer</span>
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {solverResult.finalAnswer}
                </div>
                <p className="text-xs text-indigo-100/90 font-medium">
                  {solverResult.summary}
                </p>
              </div>

              {/* Step-by-Step Explanation Section */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Step-by-Step Solution Breakdown</span>
                </h4>

                <div className="space-y-2.5">
                  {solverResult.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white transition-all space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {step.title}
                        </h5>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pl-8">
                        {step.explanation}
                      </p>

                      {step.formulaOrCalculation && (
                        <div className="ml-8 p-2 rounded-xl bg-white border border-slate-200 font-mono text-xs text-indigo-900 font-bold">
                          {step.formulaOrCalculation}
                        </div>
                      )}

                      {step.intermediateResult && (
                        <div className="ml-8 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                          Result: {step.intermediateResult}
                        </div>
                      )}

                      {step.tip && (
                        <div className="ml-8 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                          <Lightbulb className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{step.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlighted Concepts & Definitions */}
              {solverResult.highlightedConcepts && solverResult.highlightedConcepts.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h5 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Important Concepts &amp; Definitions:</span>
                  </h5>

                  <div className="space-y-2">
                    {solverResult.highlightedConcepts.map((c) => (
                      <div key={c.term} className="text-xs space-y-0.5">
                        <span className="font-extrabold text-slate-900">{c.term}: </span>
                        <span className="text-slate-600">{c.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Assistance: Rationale, Pitfalls & Formulas */}
              {solverResult.learningAssistance && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
                  <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Why this method was chosen:</span>
                  </div>
                  <p className="text-indigo-900 leading-relaxed">
                    {solverResult.learningAssistance.methodRationale}
                  </p>

                  {solverResult.learningAssistance.commonPitfalls.length > 0 && (
                    <div className="pt-2 border-t border-indigo-100 space-y-1">
                      <span className="font-bold text-rose-800">Common Mistake to Avoid:</span>
                      <p className="text-slate-600">
                        {solverResult.learningAssistance.commonPitfalls[0]}
                      </p>
                    </div>
                  )}

                  {solverResult.learningAssistance.practiceExample && (
                    <div className="pt-2 border-t border-indigo-100 space-y-1">
                      <span className="font-bold text-emerald-800">Follow-up Practice:</span>
                      <p className="text-slate-800 font-semibold">
                        {solverResult.learningAssistance.practiceExample.question}
                      </p>
                      <p className="text-emerald-700 text-[11px] font-bold">
                        Answer: {solverResult.learningAssistance.practiceExample.answer}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <Brain className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
              <h3 className="text-base font-extrabold text-slate-800">
                AI Solver Ready
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Submit any question from the workspace on the left to view full step-by-step solutions, concepts, and audio narration.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
