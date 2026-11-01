/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Multilingual Speech Service for EduBridge AI Question Solver
 * Supports Speech-to-Text (STT) and Text-to-Speech (TTS) with Play/Pause/Stop controls
 * and active step audio highlighting.
 */

import { VoicePersona } from '../types';
import { StorageService } from './storage';

export interface SpeechLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SpeechLanguage[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ur-PK', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

export type SpeechState = 'idle' | 'recording' | 'speaking' | 'paused';

export class SpeechService {
  private static recognition: any = null;
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Check if Speech Recognition (STT) is supported in current browser
   */
  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  /**
   * Check if Speech Synthesis (TTS) is supported
   */
  public static isSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  /**
   * Start listening for voice speech and convert to text
   */
  public static startListening(
    langCode: string,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please type your question.');
      return false;
    }

    try {
      this.stopListening();

      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognitionConstructor();
      rec.lang = langCode || 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const text = (final || interim).trim();
        if (text) {
          onResult(text, !!final);
        }
      };

      rec.onerror = (event: any) => {
        const errorMsg = event.error === 'not-allowed'
          ? 'Microphone access denied. Please enable microphone permissions in your browser.'
          : `Speech recognition error: ${event.error}`;
        onError(errorMsg);
      };

      rec.onend = () => {
        this.recognition = null;
        onEnd();
      };

      rec.start();
      this.recognition = rec;
      return true;
    } catch (err: any) {
      onError(err?.message || 'Could not start microphone');
      return false;
    }
  }

  /**
   * Stop voice recording
   */
  public static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
  }

  public static getPersona(): VoicePersona {
    return StorageService.getVoicePersona();
  }

  public static setPersona(persona: VoicePersona): void {
    StorageService.saveVoicePersona(persona);
  }

  /**
   * Speak a text string with text-to-speech and persona voice tuning
   */
  public static speak(
    text: string,
    langCode: string = 'en-US',
    onStart?: () => void,
    onEnd?: () => void,
    onBoundary?: (charIndex: number) => void,
    overridePersona?: VoicePersona
  ): void {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean up math symbols for natural spoken speech
    const naturalText = this.prepareTextForSpeech(text);

    const utterance = new SpeechSynthesisUtterance(naturalText);
    utterance.lang = langCode;

    const persona = overridePersona || this.getPersona();
    let targetPitch = 1.0;
    let targetRate = 0.95;

    if (persona === 'man') {
      targetPitch = 0.88;
      targetRate = 0.95;
    } else if (persona === 'woman') {
      targetPitch = 1.08;
      targetRate = 0.95;
    } else if (persona === 'boy') {
      targetPitch = 1.25;
      targetRate = 1.02;
    } else if (persona === 'girl') {
      targetPitch = 1.35;
      targetRate = 1.02;
    }

    utterance.pitch = targetPitch;
    utterance.rate = targetRate;

    // Pick a natural voice if available
    const voices = this.synth.getVoices();
    let matchingVoice: SpeechSynthesisVoice | undefined;

    if (persona === 'man' || persona === 'boy') {
      matchingVoice = voices.find(
        (v) =>
          v.lang.startsWith(langCode.slice(0, 2)) &&
          (/male|david|george|daniel|guy|tom|james|alex/i.test(v.name) ||
            v.name.includes('Male'))
      );
    } else {
      matchingVoice = voices.find(
        (v) =>
          v.lang.startsWith(langCode.slice(0, 2)) &&
          (/female|samantha|karen|jenny|victoria|zira|fiona/i.test(v.name) ||
            v.name.includes('Female'))
      );
    }

    if (!matchingVoice) {
      matchingVoice = voices.find(
        (v) =>
          v.lang.startsWith(langCode.slice(0, 2)) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.default)
      );
    }

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onBoundary) {
      utterance.onboundary = (e) => onBoundary(e.charIndex);
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Pause ongoing speech
   */
  public static pauseSpeaking(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  public static resumeSpeaking(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Stop speech synthesis completely
   */
  public static stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Format math and science symbols, LaTeX markup, and units into intelligible spoken phrases
   */
  public static prepareTextForSpeech(text: string): string {
    if (!text) return '';

    return text
      // Clean markdown tags
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links
      // LaTeX fractions: \frac{a}{b} -> a over b
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2')
      // LaTeX square roots: \sqrt{a} -> square root of a
      .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
      // LaTeX operators and symbols
      .replace(/\\implies/g, ' implies ')
      .replace(/\\times/g, ' times ')
      .replace(/\\cdot/g, ' times ')
      .replace(/\\pm/g, ' plus or minus ')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\quad/g, ' ')
      .replace(/\\Delta/g, ' delta ')
      .replace(/\\/g, '') // remove remaining backslashes
      // Math exponents and powers
      .replace(/x\^2/g, 'x squared')
      .replace(/x\^3/g, 'x cubed')
      .replace(/\^(\d+)/g, ' to the power of $1')
      .replace(/²|\^2/g, ' squared')
      .replace(/³|\^3/g, ' cubed')
      // Square root symbol
      .replace(/√(\w+|\([^)]+\))/g, 'square root of $1')
      // Physics and Math units for natural pronunciation
      .replace(/\bm\/s\^2\b|\bm\/s²\b/gi, ' meters per second squared ')
      .replace(/\bm\/s\b/gi, ' meters per second ')
      .replace(/\bkm\/h\b/gi, ' kilometers per hour ')
      .replace(/(\d+)\s*kg\b/gi, '$1 kilograms ')
      .replace(/(\d+)\s*kJ\b/gi, '$1 kilojoules ')
      .replace(/(\d+)\s*J\b/gi, '$1 Joules ')
      .replace(/(\d+)\s*N\b/gi, '$1 Newtons ')
      .replace(/(\d+)\s*m\b(?!\s*[a-zA-Z^])/gi, '$1 meters ')
      .replace(/(\d+)\s*s\b/gi, '$1 seconds ')
      .replace(/(\d+)\s*Ω\b|(\d+)\s*ohms?\b/gi, '$1 ohms ')
      // Greek symbols
      .replace(/π/g, 'pi')
      .replace(/θ/g, 'theta')
      .replace(/∑/g, 'sum of')
      .replace(/∫/g, 'integral of')
      .replace(/→/g, ' yields ')
      .replace(/⇌/g, ' in equilibrium with ')
      .replace(/≠/g, ' is not equal to ')
      .replace(/≤/g, ' less than or equal to ')
      .replace(/≥/g, ' greater than or equal to ')
      .replace(/±/g, ' plus or minus ')
      .replace(/·/g, ' times ')
      // Chemistry formulas
      .replace(/\bH2O\b/g, 'H 2 O water')
      .replace(/\bCO2\b/g, 'C O 2 carbon dioxide')
      // Clean extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }
}

