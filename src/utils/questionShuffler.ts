/**
 * Centralized Question & Option Shuffler Utility for EduBridge
 *
 * Implements Fisher-Yates randomization to ensure answer options are distributed
 * evenly across positions (A, B, C, D) rather than predictably clustering at index 0.
 *
 * Fully preserves answer mapping, scoring, validation, and explanations.
 */

/**
 * Shuffles an array of string options using the Fisher-Yates algorithm.
 * Guarantees that if options.length > 1, the result is randomized.
 */
export function shuffleOptions(options?: string[], correctAnswer?: string): string[] {
  if (!options || options.length <= 1) {
    return options ? [...options] : [];
  }

  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Shuffles an array of options while tracking and updating the correctIndex pointer.
 * Used for components that store answers as numerical indices (e.g., STEM Academic View).
 */
export function shuffleIndexedOptions(
  options: string[],
  correctIndex: number
): { options: string[]; correctIndex: number } {
  if (!options || options.length <= 1) {
    return { options: [...options], correctIndex };
  }

  const originalCorrectAnswer = options[correctIndex];
  const shuffled = [...options];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  let newCorrectIndex = shuffled.indexOf(originalCorrectAnswer);
  if (newCorrectIndex === -1) {
    newCorrectIndex = 0;
  }

  return {
    options: shuffled,
    correctIndex: newCorrectIndex
  };
}

/**
 * Deduplicates questions by normalized prompt to prevent repetitive questions in a session.
 */
export function deduplicateQuestionsByPrompt<T extends { prompt?: string; question?: string; questionText?: string }>(
  questions: T[]
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const q of questions) {
    const rawPrompt = q.prompt || q.question || q.questionText || '';
    const normalized = rawPrompt.trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(q);
    }
  }

  return unique;
}

/**
 * Checks whether a question prompt or option contains unwanted dummy/placeholder text.
 */
export function isPlaceholderQuestion(q: {
  prompt?: string;
  question?: string;
  questionText?: string;
  options?: string[];
}): boolean {
  const textToCheck = [
    q.prompt || '',
    q.question || '',
    q.questionText || '',
    ...(q.options || [])
  ].join(' ').toLowerCase();

  const dummyKeywords = [
    'cohort diagnostic inquiry',
    'distractor b',
    'distractor c',
    'distractor d',
    'verified standard answer',
    'standard solution (verified)'
  ];

  return dummyKeywords.some((keyword) => textToCheck.includes(keyword));
}
