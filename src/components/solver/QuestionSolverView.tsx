/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QuestionSolverView Component for EduBridge
 * AI-Powered Universal Question Solver & Interactive Digital Learning Assistant.
 * Layout:
 * - Left Side: Question Input Workspace & Persistent Step-by-Step Solution Breakdown ("left side explanation remains there")
 * - Right Side: Dedicated "Answer Palette" with verified final answer, voice controls, formulas, concepts, and practice.
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
  Languages,
  Upload,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Copy,
  Check,
  Bot,
  Send,
  MessageSquare
} from 'lucide-react';
import {
  SolverSubject,
  SolverResponse,
  SolverChatMessage,
  InputMode
} from '../../types/solver';
import { QuestionSolverService } from '../../services/questionSolverService';
import { PDFExportService } from '../../services/pdfExportService';
import { HandwritingCanvas } from './HandwritingCanvas';
import { FormulaToolbar } from './FormulaToolbar';
import { OCRService } from '../../services/ocrService';
import {
  SpeechService,
  SUPPORTED_LANGUAGES
} from '../../services/speechService';
import { VoicePersonaSelector } from '../common/VoicePersonaSelector';
import { sound } from '../../utils/audio';

interface QuestionSolverViewProps {
  initialSubject?: SolverSubject;
  initialQuestion?: string;
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
    question: '2x^2 - 8 = 0'
  },
  {
    subject: 'Mathematics',
    label: 'Derivative (Calculus)',
    question: 'derivative of x^3 - 5x + 4'
  },
  {
    subject: 'Mathematics',
    label: 'Integral (Calculus)',
    question: 'integral of 3x^2 + 2x - 5 dx'
  },
  {
    subject: 'Mathematics',
    label: 'Factor (Algebra)',
    question: 'factor x^2 - 16'
  },
  {
    subject: 'Mathematics',
    label: 'Matrix Det (LinAlg)',
    question: 'det([[1, 2], [3, 4]])'
  },
  {
    subject: 'Mathematics',
    label: 'Linear System (2 eq)',
    question: '2x + y = 7, x - y = 2'
  },
  {
    subject: 'Essay Writing',
    label: 'Paragraph: Pakistan',
    question: 'write a paragraph on Pakistan'
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
    label: 'Essay: My Friend',
    question: 'Write an essay on my friend'
  },
  {
    subject: 'Essay Writing',
    label: 'Essay: AI & Future',
    question: 'Write an essay on the impact of artificial intelligence on future employment.'
  },
  {
    subject: 'Computer Science',
    label: 'Binary Base-2 (CS)',
    question: 'Explain how to convert decimal integer 42 into binary number system.'
  }
];

export const QuestionSolverView: React.FC<QuestionSolverViewProps> = ({
  initialQuestion,
  onQuestionSolved
}) => {
  // Input State - initial question preserved in editor
  const [activeMode, setActiveMode] = useState<InputMode>('keyboard');
  const [questionText, setQuestionText] = useState<string>(initialQuestion || 'Solve for x: 2x + 5 = 15');

  React.useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion);
    }
  }, [initialQuestion]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [solverResult, setSolverResult] = useState<SolverResponse | null>(null);

  // Voice Input State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US');
  const [voiceError, setVoiceError] = useState<string>('');

  // Speech Narration State (TTS)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Practice Example reveal toggle
  const [showPracticeAnswer, setShowPracticeAnswer] = useState<boolean>(false);
  const [copiedAnswer, setCopiedAnswer] = useState<boolean>(false);

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Settings / API Key (optional)
  const [customApiKey] = useState<string>('');

  // Interactive AI Clarification & Question-Narrowing Chat State
  const [chatMessages, setChatMessages] = useState<SolverChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isChatProcessing, setIsChatProcessing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  // Auto-solve default sample on first mount without triggering external celebrations
  useEffect(() => {
    handleSolveQuestion('Solve for x: 2x + 5 = 15', 'keyboard', false);
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
  const handleSolveQuestion = async (
    textToSolve?: string,
    mode?: InputMode,
    notifyParent: boolean = true
  ) => {
    const raw = (textToSolve !== undefined ? textToSolve : questionText).trim();
    if (!raw) return;

    if (textToSolve !== undefined) {
      setQuestionText(textToSolve);
    }

    sound.playClick();
    setIsProcessing(true);
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);

    try {
      const modeUsed = mode || activeMode;
      const result = await QuestionSolverService.solveQuestion(
        raw,
        modeUsed,
        customApiKey,
        speechLanguage
      );
      setSolverResult(result);

      // Populate interactive AI chat with clarification prompt or solution assistant
      if (result.isAmbiguous) {
        setChatMessages([
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `I noticed some missing parameters: "${result.clarificationPrompt}". Please reply below or click a quick suggestion to narrow down your problem so I can solve it for you!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedReplies: result.suggestedClarifications || []
          }
        ]);
        setIsChatOpen(true);
      } else {
        setChatMessages([
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `I have analyzed your request regarding "${result.topic}". The verified solution is presented in the answer palette and step-by-step breakdown. If you would like to clarify, shorten, explain any step further, or explore follow-ups, just ask me here!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedReplies: [
              'Explain step 2 in more detail',
              'Summarize in 3 bullet points',
              'Make it shorter',
              'What common mistakes to avoid?'
            ]
          }
        ]);
      }

      if (notifyParent && onQuestionSolved) {
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
   * Interactive Clarification & Follow-Up Chat Handler
   */
  const handleSendChatMessage = async (overrideText?: string) => {
    const text = (overrideText || chatInputText).trim();
    if (!text || !solverResult || isChatProcessing) return;

    sound.playClick();
    setChatInputText('');
    const userMsg: SolverChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatProcessing(true);

    try {
      if (solverResult.isAmbiguous) {
        // Clarification and Narrowing flow
        const { refinedQuestion, result, aiMessage } = await QuestionSolverService.narrowDownAndSolve(
          solverResult.originalInput,
          text,
          activeMode,
          customApiKey,
          speechLanguage
        );

        setQuestionText(refinedQuestion);
        setSolverResult(result);

        const aiMsg: SolverChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedReplies: [
            'Explain step 2 in more detail',
            'Summarize in 3 bullet points',
            'Make it shorter'
          ]
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        sound.playSuccess();
      } else {
        // Interactive Follow-up / Step deep-dive / Translation / Shorten flow
        const { aiReply } = await QuestionSolverService.chatFollowUp(solverResult, text);

        const aiMsg: SolverChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedReplies: [
            'Explain step 1 in more detail',
            'Summarize key formulas',
            'What mistakes should I avoid?'
          ]
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        sound.playSuccess();
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatProcessing(false);
    }
  };

  /**
   * Formula toolbar symbol and quick-solver template insert
   */
  const handleInsertSymbol = (symbol: string) => {
    sound.playClick();
    if (
      symbol.includes('=') ||
      symbol.startsWith('derivative') ||
      symbol.startsWith('integral') ||
      symbol.startsWith('det(') ||
      symbol.startsWith('factor') ||
      symbol.startsWith('sin(') ||
      symbol.includes('2x + y = 7')
    ) {
      if (!questionText.trim() || questionText.includes('Solve for x: 2x + 5 = 15')) {
        setQuestionText(symbol);
        return;
      }
    }
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
      
      {/* Top Banner - AI Universal Problem Solver */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Question Solver &amp; Answer Palette</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Interactive Digital Classroom &amp; Problem Solver
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Ask questions with keyboard, digital pen, voice, or image. Detailed step-by-step explanations remain right on your workspace, while final answers are delivered in the Answer Palette.
            </p>
          </div>

          {/* Voice Language & Persona Selector */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <VoicePersonaSelector compact={true} className="bg-slate-800/80 border-slate-700 text-white" />
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

      {/* Main Workspace Layout (Two Columns):
          Left Column: Question Input + Step-by-Step Explanation ("left side explanation remains there")
          Right Column: Dedicated Answer Palette ("answer in answer pallet")
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Input Workspace & Persistent Step-by-Step Explanation */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Question Input Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Input Mode Navigation Tabs */}
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
                      rows={4}
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
                      Speak in your preferred language ({SUPPORTED_LANGUAGES.find((l) => l.code === speechLanguage)?.name}). Speech is transcribed into the box below.
                    </p>
                    <div className="flex justify-center pt-3">
                      <VoicePersonaSelector compact={true} />
                    </div>
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
                  Press Solve to generate step-by-step explanation and answer palette.
                </span>

                <button
                  type="button"
                  onClick={() => handleSolveQuestion(undefined, undefined, false)}
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
                    handleSolveQuestion(s.question, 'keyboard', false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* LEFT-SIDE PERSISTENT STEP-BY-STEP EXPLANATION SECTION     */}
          {/* "left side explanation should remain there"               */}
          {/* ========================================================= */}
          {solverResult ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              
              {/* Active Problem Statement Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Active Problem Statement
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {solverResult.recognizedQuestion}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                </div>
              </div>

              {/* Step-by-Step Breakdown Heading */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">
                    Step-by-Step Solution &amp; Detailed Explanation
                  </h4>
                </div>
                <span className="text-xs text-slate-500 font-semibold">
                  {solverResult.steps.length} Logical Steps
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                {solverResult.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-white transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {step.stepNumber}
                      </span>
                      <h5 className="font-black text-slate-900 text-sm">
                        {step.title}
                      </h5>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9">
                      {step.explanation}
                    </p>

                    {step.formulaOrCalculation && (
                      <div className="ml-9 p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-indigo-900 font-bold shadow-2xs">
                        {step.formulaOrCalculation}
                      </div>
                    )}

                    {step.intermediateResult && (
                      <div className="ml-9 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                        Intermediate Result: {step.intermediateResult}
                      </div>
                    )}

                    {step.tip && (
                      <div className="ml-9 text-xs font-medium text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Method Rationale Card */}
              {solverResult.learningAssistance?.methodRationale && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs">
                  <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Why this solution method was chosen:</span>
                  </div>
                  <p className="text-indigo-900 leading-relaxed">
                    {solverResult.learningAssistance.methodRationale}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-extrabold text-slate-700">
                Explanation Workspace Ready
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Submit a question or click any multi-subject example to generate and study its complete step-by-step breakdown.
              </p>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Dedicated "Answer Palette" ("Answer Pallet") */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-5 sm:p-6 space-y-5">
            
            {/* Answer Palette Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-base tracking-tight">
                    Answer Palette
                  </h3>
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    Verified solutions &amp; core concepts
                  </span>
                </div>
              </div>

              {solverResult && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {solverResult.difficulty} Level
                </span>
              )}
            </div>

            {solverResult ? (
              <>
                {/* Interactive AI Clarification Center when Question Needs More Information */}
                {solverResult.isAmbiguous ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-50 border-2 border-amber-300 shadow-md space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-amber-950 text-sm">
                            AI Proactive Clarification Center
                          </h4>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase tracking-wider">
                            Need More Info
                          </span>
                        </div>
                        {solverResult.detectedIntent && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Identified Goal: {solverResult.detectedIntent}</span>
                          </div>
                        )}
                        <p className="text-xs text-amber-900 font-medium leading-relaxed pt-1">
                          {solverResult.clarificationPrompt}
                        </p>
                      </div>
                    </div>

                    {/* Missing Details Breakdown */}
                    {solverResult.missingParameters && solverResult.missingParameters.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                          📋 Required Details to Compute Verified Solution:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700 font-medium">
                          {solverResult.missingParameters.map((param, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <span>{param}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Suggestion Chips */}
                    {solverResult.suggestedClarifications && solverResult.suggestedClarifications.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                          ⚡ Or Click Any Ready Preset to Solve Instantly:
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {solverResult.suggestedClarifications.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendChatMessage(sug)}
                              className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100/80 text-amber-950 font-bold text-xs border border-amber-300 shadow-2xs transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                            >
                              <span className="text-left">{sug}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Clarification Chat Input */}
                    <div className="pt-2">
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block mb-1.5">
                        ✍️ Or Enter Your Custom Values / Clarification:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendChatMessage();
                            }
                          }}
                          placeholder="e.g. mass 1200 kg, speed 25 m/s or 2x^2 - 8 = 0"
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendChatMessage()}
                          disabled={!chatInputText.trim() || isChatProcessing}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          {isChatProcessing ? (
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Complete &amp; Solve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Prominent Verified Final Answer Card (supports complete full-text essays and math formulas) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-600/20 space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                        <div className="text-[11px] font-black uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Verified Answer / Solution</span>
                        </div>

                    {/* Quick Action Toolbar (Download PDF, Word, Copy) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => PDFExportService.exportToPDF(solverResult)}
                        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-indigo-900 font-extrabold text-[11px] flex items-center gap-1 transition-all cursor-pointer backdrop-blur-sm shadow-2xs"
                        title="Download / Print full answer as PDF"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => PDFExportService.exportToFile(solverResult, 'doc')}
                        className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-indigo-900 font-extrabold text-[11px] flex items-center gap-1 transition-all cursor-pointer backdrop-blur-sm shadow-2xs"
                        title="Save as Word document (.doc)"
                      >
                        <Download className="w-3 h-3" />
                        <span>DOC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(solverResult.finalAnswer);
                          sound.playClick();
                          setCopiedAnswer(true);
                          setTimeout(() => setCopiedAnswer(false), 2000);
                        }}
                        className="p-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-indigo-900 font-extrabold text-[11px] flex items-center gap-1 transition-all cursor-pointer backdrop-blur-sm"
                        title="Copy full answer text"
                      >
                        {copiedAnswer ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Render Complete Text Answer or Equation */}
                  {solverResult.finalAnswer.length > 100 || solverResult.finalAnswer.includes('\n') ? (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs sm:text-sm font-medium leading-relaxed text-indigo-50 bg-black/15 p-4 rounded-xl border border-white/10 select-text">
                      {solverResult.finalAnswer.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      {solverResult.finalAnswer}
                    </div>
                  )}

                  <p className="text-xs text-indigo-100/90 font-medium leading-relaxed pt-1">
                    {solverResult.summary}
                  </p>
                </div>

                {/* Prominent File Download & PDF Option Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-indigo-950 block">
                        Download Complete Answer in File
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Create print-ready PDF or editable Word document
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => PDFExportService.exportToPDF(solverResult)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => PDFExportService.exportToFile(solverResult, 'doc')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>.DOC</span>
                    </button>
                  </div>
                </div>

                {/* Multilingual Voice Explanation Controls (TTS) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`} />
                    <span className="text-xs font-black text-slate-800">
                      Spoken Narration
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <VoicePersonaSelector compact={true} onPersonaChange={() => { if (isSpeaking) handlePlayVoiceResponse(); }} />
                    {!isSpeaking ? (
                      <button
                        type="button"
                        onClick={handlePlayVoiceResponse}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{isPaused ? 'Resume' : 'Listen'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Formulas Palette */}
                {solverResult.learningAssistance?.keyFormulas && solverResult.learningAssistance.keyFormulas.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Core Formulas Applied:
                    </span>
                    <div className="space-y-1">
                      {solverResult.learningAssistance.keyFormulas.map((f, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white border border-slate-200 font-mono text-xs font-bold text-slate-800">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Concepts & Definitions Palette */}
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

                {/* Common Pitfalls to Avoid Palette */}
                {solverResult.learningAssistance?.commonPitfalls && solverResult.learningAssistance.commonPitfalls.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1 text-xs">
                    <span className="font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Common Mistake to Avoid:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {solverResult.learningAssistance.commonPitfalls[0]}
                    </p>
                  </div>
                )}

                {/* Follow-up Practice Example Palette */}
                {solverResult.learningAssistance?.practiceExample && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Follow-up Practice Problem
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPracticeAnswer(!showPracticeAnswer)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showPracticeAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                        {showPracticeAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    <p className="text-slate-800 font-semibold">
                      {solverResult.learningAssistance.practiceExample.question}
                    </p>

                    {showPracticeAnswer && (
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold">
                        Answer: {solverResult.learningAssistance.practiceExample.answer}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive AI Classroom Chat & Question Narrowing Widget */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="flex items-center gap-2 text-xs font-black text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>Chat with AI Tutor &amp; Refine</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        {chatMessages.length} messages
                      </span>
                      {isChatOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>

                  {isChatOpen && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      {/* Chat Messages Log */}
                      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.sender === 'ai' && (
                              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-2xs'
                              }`}
                            >
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                              <span className={`block text-[9px] mt-1 ${msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                                {msg.timestamp}
                              </span>

                              {/* Suggested quick replies attached to AI messages */}
                              {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                                  {msg.suggestedReplies.map((reply, rIdx) => (
                                    <button
                                      key={rIdx}
                                      type="button"
                                      onClick={() => handleSendChatMessage(reply)}
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 transition-all cursor-pointer active:scale-95"
                                    >
                                      {reply}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {isChatProcessing && (
                          <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold p-2 bg-indigo-50 rounded-xl">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>AI Assistant is analyzing and formulating response...</span>
                          </div>
                        )}
                      </div>

                      {/* Chat Input Bar */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/70">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendChatMessage();
                            }
                          }}
                          placeholder="Ask a follow-up or refine question..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendChatMessage()}
                          disabled={!chatInputText.trim() || isChatProcessing}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                    </>
                  )}
              </>
            ) : (
              <div className="p-8 text-center space-y-3 text-slate-400">
                <Brain className="w-12 h-12 mx-auto text-slate-300 animate-pulse" />
                <h4 className="text-sm font-extrabold text-slate-700">
                  Answer Palette Standing By
                </h4>
                <p className="text-xs text-slate-400">
                  Your final verified answers and voice narration will appear here.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
