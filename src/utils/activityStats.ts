import { UserActivityRecord } from '../types';
import { StorageService } from '../services/storage';

export const getActivityQuestionStats = (act: UserActivityRecord) => {
  if (
    act.totalQuestions !== undefined &&
    act.attemptedQuestions !== undefined &&
    act.correctAnswers !== undefined &&
    act.incorrectAnswers !== undefined
  ) {
    return {
      total: act.totalQuestions,
      attempted: act.attemptedQuestions,
      correct: act.correctAnswers,
      wrong: act.incorrectAnswers
    };
  }

  // Check details text for pattern: Total Questions: X · Answers: Y · Correct: C · Wrong: W
  if (act.details) {
    const match = act.details.match(/Total Questions:\s*(\d+).*?Answers:\s*(\d+).*?Correct:\s*(\d+).*?Wrong:\s*(\d+)/i);
    if (match) {
      return {
        total: parseInt(match[1], 10),
        attempted: parseInt(match[2], 10),
        correct: parseInt(match[3], 10),
        wrong: parseInt(match[4], 10)
      };
    }
  }

  // Fallback based on question attempt ledger
  const testId = act.replayPayload?.subId;
  const attempts = StorageService.getQuestionAttempts().filter(
    (a) => (act.id && a.testId === act.id) || (testId && a.testId === testId)
  );
  if (attempts.length > 0) {
    const total = attempts.length;
    const attempted = attempts.filter((a) => a.userAnswer && a.userAnswer !== 'No response recorded').length;
    const correct = attempts.filter((a) => a.isCorrect).length;
    return {
      total,
      attempted,
      correct,
      wrong: Math.max(0, total - correct)
    };
  }

  // Default fallback for single-task exercises
  const isCorrect = act.status === 'completed' && !String(act.score || '').includes('Needs Review');
  return {
    total: 1,
    attempted: 1,
    correct: isCorrect ? 1 : 0,
    wrong: isCorrect ? 0 : 1
  };
};

