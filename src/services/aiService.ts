import { OllamaModelKey, TutorMode, ChatMessage } from '../types';

export interface AIServiceResponse {
  content: string;
  suggestedFollowUps: string[];
  reasoningSteps?: string[];
}

export const AIService = {
  /**
   * Generates response tailored to the selected open-source model and tutoring mode
   */
  async generateResponse(
    userPrompt: string,
    model: OllamaModelKey,
    mode: TutorMode,
    conversationHistory: ChatMessage[] = []
  ): Promise<AIServiceResponse> {
    // Simulate brief inference latency matching model specs
    const latencyMap: Record<OllamaModelKey, number> = {
      'phi-4-mini': 350,
      'qwen-3-8b': 650,
      'deepseek-8b': 850,
      'llama-3.3-8b': 550
    };

    await new Promise((resolve) => setTimeout(resolve, latencyMap[model] || 500));

    const promptLower = userPrompt.toLowerCase();

    // 1. Specialized by Model:
    if (model === 'phi-4-mini') {
      // Grammar, quick definitions, syntax corrections
      if (promptLower.includes('spanish') || promptLower.includes('conjugation') || promptLower.includes('grammar') || promptLower.includes('mucho gusto')) {
        return {
          content: `**[Phi-4 Mini • Grammar & Lexicon Engine]**\n\nHere is the grammatical breakdown for your query:\n\n• **Core Structure**: In Spanish, verbs of identity use *ser* for permanent traits and *estar* for states/locations.\n• **Phonetics**: Maintain pure open vowels (a, e, i, o, u) without English-style gliding offglides.\n• **Syntactic Note**: In formal address (*usted*), conjugate in the 3rd person singular.\n\n*Quick Check*: Would you like 3 rapid flashcards testing this exact grammatical pattern?`,
          suggestedFollowUps: [
            'Test me with 3 rapid flashcards',
            'Show formal vs informal contrast examples',
            'Explain reflexive verb pronoun placement'
          ],
          reasoningSteps: [
            'Tokenizing linguistic components',
            'Identifying target grammatical category (Spanish verb morphology)',
            'Verifying phonetic vowel constraints',
            'Synthesizing concise high-density explanation'
          ]
        };
      }
      return {
        content: `**[Phi-4 Mini • Precision Lexicon]**\n\nAnalyzing query syntax: "${userPrompt.slice(0, 80)}..."\n\n1. **Sentence Clarity**: High structural coherence.\n2. **Grammar & Collocation**: Accurate phrasing observed.\n3. **Quick Rule**: Precision in lexical selection enhances academic and professional readability.\n\nShall we run a quick grammar verification drill on this topic?`,
        suggestedFollowUps: [
          'Run a rapid grammar drill',
          'Break down sentence structure',
          'Provide vocabulary synonyms'
        ]
      };
    }

    if (model === 'deepseek-8b') {
      // Deep reasoning, calculus, logic, algorithmic proofs
      return {
        content: `**[DeepSeek R1 • Algorithmic & Mathematical Proof]**\n\nLet us deconstruct this problem through first-principles reasoning:\n\n$$\\text{Objective: Analyze and prove the governing dynamics of } \\mathbf{X}$$\n\n### Step 1: Formal Premises\n• Let the state function be denoted as $\\mathcal{L}(\\theta)$.\n• We evaluate the rate of change using the gradient $\\nabla_\\theta \\mathcal{L}$.\n\n### Step 2: Intermediate Chain-of-Thought\n$$\\frac{\\partial \\mathcal{L}}{\\partial \\theta} = \\lim_{h \\to 0} \\frac{\\mathcal{L}(\\theta + h) - \\mathcal{L}(\\theta)}{h}$$\nWhen we project into higher dimensions, the Hessian matrix $\\mathbf{H}$ determines local curvature (eigenvalues indicate local minima, maxima, or saddle points).\n\n### Step 3: Analytical Conclusion\nIn neural optimization, backpropagation is strictly the generalized chain rule applied recursively across a directed acyclic computation graph. Scaling by $\\frac{1}{\\sqrt{d_k}}$ preserves unit variance across token dot-products.\n\nDoes this rigorous formulation make sense, or would you like to compute an explicit numerical example together?`,
        suggestedFollowUps: [
          'Work through an explicit numerical example',
          'Show how the Hessian matrix detects saddle points',
          'Connect this directly to Transformer self-attention'
        ],
        reasoningSteps: [
          'Formalizing mathematical definitions and domain bounds',
          'Applying multivariate calculus rules and chain-of-thought deductions',
          'Checking for edge cases and numerical stability limits',
          'Verifying unit variance stabilization rationale'
        ]
      };
    }

    if (model === 'llama-3.3-8b') {
      // Career advisor, ATS resume feedback, freelancing & portfolio
      return {
        content: `**[Llama 3.3 • Strategic Career & Freelance Navigator]**\n\nGreat strategic question! Here is an actionable roadmap designed to translate this skill into verifiable employability and freelancing revenue:\n\n### 1. Market Positioning & Hourly Rates\n• **Mid-Level Benchmark**: $75 – $110 / hr on Upwork & Toptal.\n• **High-Value Niche**: Enterprise self-hosted open-source model deployment (Ollama + vLLM + NestJS).\n\n### 2. Tangible Portfolio Deliverable\nDo not just claim familiarity on your resume—deploy a working live artifact:\n- A Docker Compose multi-service architecture showing PostgreSQL 17 + Redis cache + local Ollama container.\n- Include Prometheus metrics proving p95 inference latency < 80ms.\n\n### 3. ATS Resume Optimization\nUse strong action verbs: *"Architected self-hosted multi-model AI cluster utilizing Ollama and DeepSeek 8B, slashing external API operational expenditures by 100%."*\n\nWould you like me to tailor a client pitch template or review your portfolio summary?`,
        suggestedFollowUps: [
          'Draft a high-converting Upwork proposal pitch',
          'Review my resume headline and skills section',
          'Show client contract milestones for AI projects'
        ],
        reasoningSteps: [
          'Analyzing current labor market compensation data for Q4 2026',
          'Filtering for high-demand self-hosted AI architecture skills',
          'Formulating ATS-aligned impact statements with measurable metrics'
        ]
      };
    }

    // Default: Qwen 3 8B (Pedagogical tutor, Socratic guide)
    if (mode === 'socratic') {
      return {
        content: `**[Bridge • Socratic Mentor (Qwen 3)]**\n\nThat's an insightful question to explore! Rather than just giving you the answer outright, let's build the intuition together.\n\nThink about this fundamental question:\n*If you were trying to teach someone how a car moves, would you start by showing them the chemical bonds in petroleum, or would you start by showing them what happens when you press the accelerator pedal?*\n\nIn the same way with your topic: **What do you suspect happens to the output when we alter the initial starting conditions?**\n\nShare your first hypothesis, even if it feels incomplete—we will refine it together!`,
        suggestedFollowUps: [
          'I think it increases exponentially',
          'It stays constant because of conservation laws',
          'Can you give me a subtle hint?'
        ],
        reasoningSteps: [
          'Identifying student baseline comprehension level',
          'Constructing a real-world cognitive bridge analogy',
          'Formulating a Socratic prompt to stimulate analytical thinking'
        ]
      };
    } else if (mode === 'quiz-me') {
      return {
        content: `**[Bridge • Adaptive Quiz Generator]**\n\nHere is a quick 2-question checkpoint to test your mastery:\n\n**Question 1**: When an algorithm encounters high variance (overfitting) on training data, which intervention is most mathematically sound?\n- A) Increase model parameter count\n- B) Introduce L2 regularization (weight decay) or dropout\n- C) Remove data validation splits\n\n**Question 2**: In IELTS Academic Writing Task 2, what penalty is incurred if an essay does not address all parts of the prompt?\n- A) Lexical Resource capped at Band 5\n- B) Task Achievement capped at Band 5 or 6\n- C) Pronunciation penalty\n\nReply with your answers (e.g. "1B, 2B") and I'll grade them instantly with explanations!`,
        suggestedFollowUps: [
          '1B and 2B',
          '1A and 2B',
          'Give me a hint for Question 1'
        ]
      };
    } else if (mode === 'study-plan') {
      return {
        content: `**[Bridge • Personalized Study Architect]**\n\nBased on your active 14-day streak and upcoming target exams, here is your high-impact revision breakdown:\n\n📅 **Optimal 3-Day Focus Block**:\n1. **Morning (30 min)**: Active recall on Spanish Unit 1 flashcards & pronunciation recording.\n2. **Midday (45 min)**: Timed IELTS Reading inference practice with immediate rubric review.\n3. **Evening (30 min)**: DeepSeek step-by-step calculus proofs (derivatives & gradients).\n\nShall I automatically sync this schedule into your **Study Planner** dashboard?`,
        suggestedFollowUps: [
          'Sync this schedule into my Study Planner',
          'Adjust for lighter weekend hours',
          'Add a career portfolio building block'
        ]
      };
    } else {
      // deep-explain
      return {
        content: `**[Bridge • Deep Explainer (Qwen 3)]**\n\nLet's break down this concept into three crystal-clear mental models:\n\n### 1. The Core Intuition\nImagine you are hiking down a foggy mountain in complete darkness. You can only feel the slope directly under your boots. To reach the valley (the minimum error), you step in whichever direction slopes downward most steeply. That is exactly what gradient descent does in mathematics.\n\n### 2. The Formal Anatomy\n- **Function**: The terrain or loss landscape.\n- **Learning Rate**: The step size of your stride.\n- **Convergence**: Arriving safely at the bottom of the basin.\n\n### 3. Why It Matters in Practice\nWithout this foundation, training modern AI models like the ones powering EduBridge would be computationally impossible. Every token generated by Phi-4, Qwen, DeepSeek, and Llama was shaped by millions of these gradient steps.\n\nWhat aspect of this picture would you like to zoom into next?`,
        suggestedFollowUps: [
          'What happens if the step size is too large?',
          'How do momentum and Adam optimizer help?',
          'Can we try a real calculation?'
        ]
      };
    }
  },

  /**
   * Text-to-Speech playback using Web Speech Synthesis API
   */
  speakText(text: string, voiceRate: number = 1.0, voicePitch: number = 1.0): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and hash symbols for clean speech
      const clean = text
        .replace(/[*#_`$]/g, '')
        .replace(/\[.*?\]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      // Prefer a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('[EduBridge TTS] Speech synthesis error:', e);
      return false;
    }
  },

  /**
   * Adaptive pitch & pace reader tailored to developmental age cohorts:
   * - early (5-8): cheerful, friendly, higher pitch (1.15x pitch, 1.05x rate)
   * - junior (9-14): animated, engaging (1.05x pitch, 1.0x rate)
   * - academy (15-24): standard official pace (1.0x pitch, 0.95x rate)
   * - pro (25-54): confident, articulate (0.98x pitch, 1.0x rate)
   * - senior (55+): calm, relaxed, crystal-clear 0.82x speech
   */
  speakAdaptive(text: string, cohort: 'early' | 'junior' | 'academy' | 'pro' | 'senior'): boolean {
    switch (cohort) {
      case 'early':
        return this.speakText(text, 1.05, 1.2);
      case 'junior':
        return this.speakText(text, 1.0, 1.08);
      case 'academy':
        return this.speakText(text, 0.95, 1.0);
      case 'pro':
        return this.speakText(text, 1.0, 0.98);
      case 'senior':
        return this.speakText(text, 0.82, 0.95);
      default:
        return this.speakText(text, 1.0, 1.0);
    }
  },

  /**
   * Calm 0.82x clear speech voice narrator for Golden Age learners
   */
  speakSeniorClear(text: string): boolean {
    return this.speakText(text, 0.82, 0.95);
  },

  stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};
