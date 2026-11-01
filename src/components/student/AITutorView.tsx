import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Brain,
  Cpu,
  Layers,
  ChevronDown,
  RotateCcw,
  Bot,
  User,
  Lightbulb,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { OllamaModelKey, TutorMode, ChatMessage, OllamaModelInfo } from '../../types';
import { AIService } from '../../services/aiService';
import { sound } from '../../utils/audio';
import { VoicePersonaSelector } from '../common/VoicePersonaSelector';

interface AITutorViewProps {
  models: OllamaModelInfo[];
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  initialPrompt?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  models,
  messages,
  onSendMessage,
  initialPrompt
}) => {
  const [selectedModel, setSelectedModel] = useState<OllamaModelKey>('qwen-3-8b');
  const [selectedMode, setSelectedMode] = useState<TutorMode>('socratic');
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentModelInfo = models.find((m) => m.id === selectedModel) || models[1];

  const modes: { id: TutorMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'socratic', label: 'Socratic Guide', icon: <Lightbulb className="w-4 h-4" />, desc: 'Teaches via thought-provoking inquiry' },
    { id: 'deep-explain', label: 'Deep Explainer', icon: <Brain className="w-4 h-4" />, desc: 'Visual analogies & structural anatomy' },
    { id: 'quiz-me', label: 'Adaptive Quiz', icon: <Layers className="w-4 h-4" />, desc: 'Generates targeted practice tests' },
    { id: 'study-plan', label: 'Study Planner', icon: <Compass className="w-4 h-4" />, desc: 'Designs high-impact revision blocks' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: 'Just now'
    };

    onSendMessage(userMsg);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const response = await AIService.generateResponse(
        textToSend,
        selectedModel,
        selectedMode,
        messages
      );

      const bridgeMsg: ChatMessage = {
        id: `bridge_${Date.now()}`,
        sender: 'bridge',
        modelUsed: selectedModel,
        mode: selectedMode,
        content: response.content,
        timestamp: 'Just now',
        suggestedFollowUps: response.suggestedFollowUps,
        reasoningSteps: response.reasoningSteps
      };

      onSendMessage(bridgeMsg);
      sound.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    sound.playClick();
    if (activeSpeakingMsgId === msgId) {
      AIService.stopSpeaking();
      setActiveSpeakingMsgId(null);
    } else {
      setActiveSpeakingMsgId(msgId);
      AIService.speakText(text);
      // reset after duration estimate
      const duration = Math.min(15000, text.length * 70);
      setTimeout(() => setActiveSpeakingMsgId(null), duration);
    }
  };

  const handleMicToggle = () => {
    sound.playClick();
    setIsListeningMic(true);
    setTimeout(() => {
      setIsListeningMic(false);
      setInputPrompt('Can you guide me through solving quadratic equations with intuitive geometry?');
      sound.playSuccess();
    }, 2000);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Top Banner & Model Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Bot className="w-4 h-4" />
              <span>Bridge AI Mentor · Self-Hosted Ollama Cluster</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Socratic Mentorship &amp; Multi-Model Intelligence
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <VoicePersonaSelector compact={true} />
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Local Cluster: Online ({currentModelInfo.vram} VRAM)</span>
            </div>
          </div>
        </div>

        {/* 4 Ollama Models Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
          {models.map((m) => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedModel(m.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">{m.name}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {m.latencyMs}ms
                  </span>
                </div>
                <p className={`text-[11px] leading-tight line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {m.specialty}
                </p>
              </button>
            );
          })}
        </div>

        {/* Tutor Modes */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {modes.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMode(m.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isBridge = msg.sender === 'bridge';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBridge ? 'justify-start' : 'justify-end'}`}
              >
                {isBridge && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed space-y-3 ${
                    isBridge
                      ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                      : 'bg-indigo-600 text-white ml-12 shadow-xs'
                  }`}
                >
                  {/* Top metadata for AI message */}
                  {isBridge && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-200/60 pb-2">
                      <span className="font-semibold text-indigo-600">
                        Bridge AI ({msg.modelUsed || selectedModel})
                      </span>
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeSpeakingMsgId === msg.id ? 'Pause Voice' : 'Piper Audio'}</span>
                      </button>
                    </div>
                  )}

                  {/* Message Markdown Body */}
                  <div className="whitespace-pre-line font-sans text-sm">
                    {msg.content}
                  </div>

                  {/* Chain of Thought Reasoning Steps */}
                  {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <details className="text-xs bg-white/70 p-3 rounded-xl border border-slate-200 space-y-1.5 cursor-pointer">
                      <summary className="font-bold text-slate-600 flex items-center gap-1.5 select-none">
                        <Brain className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Chain-of-Thought Reasoning Log ({msg.reasoningSteps.length} steps)</span>
                      </summary>
                      <ul className="list-disc list-inside space-y-1 text-slate-500 pt-2 font-mono text-[11px]">
                        {msg.reasoningSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* Quick suggested follow-ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="text-[11px] font-medium bg-white hover:bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
                        >
                          → {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isBridge && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                <span>Inferring response via {currentModelInfo.name}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-3 rounded-2xl border transition-all ${
                isListeningMic
                  ? 'bg-rose-500 text-white animate-pulse border-rose-600'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
              title="Whisper Speech-to-Text Input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask Bridge with ${currentModelInfo.name} (${selectedMode} mode)...`}
              className="flex-1 px-4 py-3 bg-white rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isGenerating}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
