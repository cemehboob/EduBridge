import confetti from 'canvas-confetti';
import { sound } from './audio';

/**
 * Fires a multi-stage celebratory confetti show for milestone achievements (Daily XP Goal, Streak Completion)
 */
export function triggerCelebration(type: 'daily_goal' | 'streak' | 'lesson_mastery' = 'daily_goal') {
  sound.playLevelUp();

  try {
    // 1. Center burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: type === 'streak' ? ['#f59e0b', '#ef4444', '#f97316', '#fbbf24'] : ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4']
    });

    // 2. Left and Right synchronized cannons
    const end = Date.now() + 1200;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() * 0.3 + 0.3 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
      });

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() * 0.3 + 0.3 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7']
      });
    }, 250);
  } catch (err) {
    console.warn('[EduBridge Confetti] Canvas confetti unavailable:', err);
  }
}
