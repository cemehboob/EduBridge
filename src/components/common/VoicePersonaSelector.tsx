import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check } from 'lucide-react';
import { VoicePersona } from '../../types';
import { StorageService } from '../../services/storage';
import { AIService } from '../../services/aiService';
import { sound } from '../../utils/audio';

export interface VoicePersonaConfig {
  id: VoicePersona;
  label: string;
  emoji: string;
  subtitle: string;
  previewSample: string;
}

export const VOICE_PERSONAS: VoicePersonaConfig[] = [
  {
    id: 'man',
    label: 'Man',
    emoji: '👨',
    subtitle: 'Deep, articulate adult male',
    previewSample: 'Hello, I am your EduBridge male tutor. Ready to solve today’s challenge?'
  },
  {
    id: 'woman',
    label: 'Woman',
    emoji: '👩',
    subtitle: 'Warm, natural adult female',
    previewSample: 'Hello, I am your EduBridge female tutor. Let’s learn together!'
  },
  {
    id: 'boy',
    label: 'Boy',
    emoji: '👦',
    subtitle: 'Energetic, cheerful youthful boy',
    previewSample: 'Hey there! I am ready to explore questions and practice with you!'
  },
  {
    id: 'girl',
    label: 'Girl',
    emoji: '👧',
    subtitle: 'Bright, sweet youthful girl',
    previewSample: 'Hi! Let’s practice English and solve problems step-by-step!'
  }
];

interface VoicePersonaSelectorProps {
  compact?: boolean;
  showPreviewButton?: boolean;
  className?: string;
  onPersonaChange?: (persona: VoicePersona) => void;
}

export const VoicePersonaSelector: React.FC<VoicePersonaSelectorProps> = ({
  compact = true,
  showPreviewButton = false,
  className = '',
  onPersonaChange
}) => {
  const [activePersona, setActivePersona] = useState<VoicePersona>(() => StorageService.getVoicePersona());

  useEffect(() => {
    const handlePersonaChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ persona: VoicePersona }>;
      if (customEvent.detail?.persona) {
        setActivePersona(customEvent.detail.persona);
      }
    };

    window.addEventListener('edubridge:persona-changed', handlePersonaChange);
    return () => window.removeEventListener('edubridge:persona-changed', handlePersonaChange);
  }, []);

  const handleSelect = (persona: VoicePersona, previewText?: string) => {
    sound.playClick();
    setActivePersona(persona);
    StorageService.saveVoicePersona(persona);
    if (onPersonaChange) {
      onPersonaChange(persona);
    }
    if (showPreviewButton && previewText) {
      AIService.speakText(previewText, 1.0, 1.0, persona);
    }
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs ${className}`}>
        <div className="flex items-center gap-1 pl-1.5 pr-1 text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0">
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Voice:</span>
        </div>
        <div className="flex items-center gap-1">
          {VOICE_PERSONAS.map((p) => {
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id, p.previewSample)}
                title={`${p.label} Persona (${p.subtitle})`}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-950 font-black shadow-xs ring-1 ring-indigo-500/30 scale-102'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full detailed card mode (for Settings / Preferences / Modal)
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-indigo-600" />
          <span>Active Voice Persona &amp; Cadence</span>
        </label>
        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          Syncs Across All Modules
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {VOICE_PERSONAS.map((p) => {
          const isSelected = activePersona === p.id;
          return (
            <div
              key={p.id}
              onClick={() => handleSelect(p.id, p.previewSample)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-1 relative group ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div className="text-2xl">{p.emoji}</div>
              <div className="font-black text-xs text-slate-900">{p.label}</div>
              <p className="text-[10px] text-slate-500 leading-tight">{p.subtitle}</p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick();
                  AIService.speakText(p.previewSample, 1.0, 1.0, p.id);
                }}
                className="pt-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:underline"
              >
                <Volume2 className="w-3 h-3" />
                <span>Test Voice</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
