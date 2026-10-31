/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Multilingual Speech Service for EduBridge AI Question Solver
 * Supports Speech-to-Text (STT) and Text-to-Speech (TTS) with Play/Pause/Stop controls
 * and active step audio highlighting.
 */

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

  /**
   * Speak a text string with text-to-speech
   */
  public static speak(
    text: string,
    langCode: string = 'en-US',
    onStart?: () => void,
    onEnd?: () => void,
    onBoundary?: (charIndex: number) => void
  ): void {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean up math symbols for natural spoken speech
    const naturalText = this.prepareTextForSpeech(text);

    const utterance = new SpeechSynthesisUtterance(naturalText);
    utterance.lang = langCode;
    utterance.rate = 0.95; // comfortable educational cadence
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.startsWith(langCode.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.default)
    );
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
   * Format math and science symbols into intelligible spoken phrases
   */
  private static prepareTextForSpeech(text: string): string {
    return text
      .replace(/x\^2/g, 'x squared')
      .replace(/x\^3/g, 'x cubed')
      .replace(/\^(\d+)/g, ' to the power of $1')
      .replace(/√(\w+|\([^)]+\))/g, 'square root of $1')
      .replace(/(\w+)\/(\w+)/g, '$1 over $2')
      .replace(/π/g, 'pi')
      .replace(/θ/g, 'theta')
      .replace(/∑/g, 'sum of')
      .replace(/∫/g, 'integral of')
      .replace(/→/g, 'yields')
      .replace(/⇌/g, 'in equilibrium with')
      .replace(/H2O/g, 'H 2 O water')
      .replace(/CO2/g, 'C O 2 carbon dioxide')
      .replace(/≠/g, 'is not equal to')
      .replace(/≤/g, 'less than or equal to')
      .replace(/≥/g, 'greater than or equal to')
      .replace(/±/g, 'plus or minus');
  }
}

