/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Solver Types for EduBridge AI-Powered Universal Question Solver
 */

export type SolverSubject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Essay Writing'
  | 'Computer Science'
  | 'General Knowledge'
  | 'Interdisciplinary';

export type InputMode = 'keyboard' | 'handwriting' | 'voice' | 'image';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaOrCalculation?: string;
  intermediateResult?: string;
  tip?: string;
}

export interface HighlightedConcept {
  term: string;
  definition: string;
  relevance: string;
}

export interface LearningAssistance {
  methodRationale: string;
  alternativeMethods: string[];
  commonPitfalls: string[];
  keyFormulas: string[];
  practiceExample?: {
    question: string;
    answer: string;
  };
}

export interface SolverResponse {
  id: string;
  timestamp: string;
  originalInput: string;
  recognizedQuestion: string;
  inputMode: InputMode;
  subject: SolverSubject;
  topic: string;
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
  isAmbiguous: boolean;
  clarificationPrompt?: string;
  finalAnswer: string;
  summary: string;
  steps: SolutionStep[];
  highlightedConcepts: HighlightedConcept[];
  learningAssistance: LearningAssistance;
  voiceSpeechScript: string;
}

export interface SpeechSettings {
  language: string;
  rate: number;
  pitch: number;
  voiceName?: string;
}
