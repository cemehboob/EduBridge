import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, Square, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { VoicePersonaSelector } from './VoicePersonaSelector';
import { sound } from '../../utils/audio';

interface AudioListeningPlayerProps {
  audioText: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  rate?: number;
  showTranscriptInitially?: boolean;
  onPlaybackStateChange?: (state: 'idle' | 'playing' | 'paused') => void;
}

export const AudioListeningPlayer: React.FC<AudioListeningPlayerProps> = ({
  audioText,
  title = 'Audio Listening Simulation (Piper Voice Engine)',
  subtitle = 'Official exam audio lecture & conversation recording',
  compact = false,
  rate = 0.95,
  showTranscriptInitially = false,
  onPlaybackStateChange
}) => {
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [showTranscript, setShowTranscript] = useState(showTranscriptInitially);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Notify parent if callback provided
    onPlaybackStateChange?.(playbackState);
    isPlayingRef.current = playbackState === 'playing';
  }, [playbackState, onPlaybackStateChange]);

  // Clean up on unmount or when audioText changes
  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        AIService.stopSpeaking();
      }
    };
  }, [audioText]);

  const handleStartPlay = () => {
    if (!audioText) return;
    sound.playClick();
    setPlaybackState('playing');

    AIService.speakText(
      audioText,
      rate,
      1.0,
      undefined,
      () => setPlaybackState('playing'),
      () => setPlaybackState('idle'),
      () => setPlaybackState('idle')
    );
  };

  const handlePause = () => {
    sound.playClick();
    AIService.pauseSpeaking();
    setPlaybackState('paused');
  };

  const handleResume = () => {
    sound.playClick();
    AIService.resumeSpeaking();
    setPlaybackState('playing');
  };

  const handleStop = () => {
    sound.playClick();
    AIService.stopSpeaking();
    setPlaybackState('idle');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {playbackState === 'idle' ? (
          <button
            type="button"
            onClick={handleStartPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Listen to audio text"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen</span>
          </button>
        ) : playbackState === 'playing' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Pause audio playback"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Stop listening"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Resume audio playback"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Stop listening"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 rounded-2xl border border-indigo-100 shadow-2xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs sm:text-sm font-black text-slate-800">{title}</h4>
            {playbackState === 'playing' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Reading Passage...</span>
              </span>
            )}
            {playbackState === 'paused' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                <Pause className="w-2.5 h-2.5" />
                <span>Paused</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Audio Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <VoicePersonaSelector compact={true} />

          {playbackState === 'idle' ? (
            <button
              type="button"
              onClick={handleStartPlay}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer hover:shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Start Listening</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {playbackState === 'playing' ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Pause audio"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResume}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Resume playback"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleStop}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Stop audio playback"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Listening</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Toggle lecture transcript"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showTranscript ? 'Hide Text' : 'View Text'}</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Visual Audio Wave Equalizer while playing */}
      {playbackState === 'playing' && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50/70 border border-indigo-100 rounded-xl animate-in fade-in">
          <span className="text-[11px] font-bold text-indigo-700 mr-2">Audio Stream Active:</span>
          <div className="flex items-center gap-1 h-3">
            <span className="w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
            <span className="w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s] h-2"></span>
            <span className="w-1 bg-indigo-600 rounded-full animate-bounce h-3.5"></span>
            <span className="w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.2s] h-2.5"></span>
            <span className="w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.05s] h-3"></span>
          </div>
          <span className="text-[10px] text-slate-500 ml-auto italic">
            You can pause or stop listening at any time using the controls above.
          </span>
        </div>
      )}

      {/* Collapsible Transcript Text Box */}
      {showTranscript && (
        <div className="p-4 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 font-serif leading-relaxed max-h-60 overflow-y-auto animate-in fade-in">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
            <span>Official Audio Script</span>
            <span>Piper TTS Verified</span>
          </div>
          <p className="whitespace-pre-line">{audioText}</p>
        </div>
      )}
    </div>
  );
};

