/**
 * Pure quiz, SRS flashcard, and streak calculation logic for Thoufeek Quranic Arabic Master
 */

export interface SRSItem {
  id: string;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  nextReviewDate: number; // timestamp
}

// SM-2 / Leitner hybrid spaced repetition step
export function calculateNextSRS(
  current: SRSItem,
  rating: 'again' | 'hard' | 'good' | 'easy'
): SRSItem {
  let { intervalDays, easeFactor, repetitionCount } = current;

  if (rating === 'again') {
    repetitionCount = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    if (rating === 'hard') {
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (rating === 'good') {
      if (repetitionCount === 0) {
        intervalDays = 1;
      } else if (repetitionCount === 1) {
        intervalDays = 3;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      repetitionCount += 1;
    } else if (rating === 'easy') {
      if (repetitionCount === 0) {
        intervalDays = 3;
      } else if (repetitionCount === 1) {
        intervalDays = 5;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor * 1.3);
      }
      easeFactor = Math.min(2.5, easeFactor + 0.15);
      repetitionCount += 1;
    }
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const nextReviewDate = Date.now() + intervalDays * oneDayMs;

  return {
    id: current.id,
    intervalDays,
    easeFactor,
    repetitionCount,
    nextReviewDate,
  };
}

// Streak calculation logic: increments if active consecutive days, preserves if same day, resets if missed > 1 day
export function updateStreak(
  currentStreak: number,
  lastActiveTimestamp: number,
  nowTimestamp: number = Date.now()
): { newStreak: number; didIncrease: boolean } {
  if (!lastActiveTimestamp) {
    return { newStreak: 1, didIncrease: true };
  }

  const lastDate = new Date(lastActiveTimestamp);
  const nowDate = new Date(nowTimestamp);

  const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime();
  const nowDay = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime();

  const diffDays = Math.round((nowDay - lastDay) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    // Same day, streak intact, no duplicate increment
    return { newStreak: currentStreak, didIncrease: false };
  } else if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, didIncrease: true };
  } else {
    // Missed day, restarts at 1
    return { newStreak: 1, didIncrease: true };
  }
}

// XP reward calculation
export function calculateQuizXP(correctCount: number, totalQuestions: number, streakMultiplier: number = 1): number {
  if (totalQuestions <= 0) return 0;
  const basePerQuestion = 15;
  const perfectionBonus = correctCount === totalQuestions ? 50 : 0;
  const earned = correctCount * basePerQuestion + perfectionBonus;
  return Math.round(earned * Math.max(1, streakMultiplier));
}
