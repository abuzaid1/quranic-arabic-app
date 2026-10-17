import { UserProgress } from '../types/index';
import { updateStreak } from './quizEngine';

const STORAGE_KEY = 'thoufeek_quranic_arabic_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  name: 'Thoufeek',
  streakDays: 7,
  lastActiveTimestamp: Date.now() - 3600 * 1000 * 2, // Active 2 hours ago
  xp: 450,
  masteredLetterIds: ['alif', 'baa', 'taa', 'noon', 'meem', 'haa_light'],
  masteredWordIds: ['allah', 'rabb', 'rahman', 'raheem', 'fi', 'min', 'qala'],
  completedTajweedRuleIds: ['izhar_halqi', 'qalqalah'],
  completedGrammarTopicIds: ['parts_of_speech'],
  favoriteWordIds: ['allah', 'rahman', 'kitab', 'illa'],
  favoriteAyahIds: ['1_1', '1_2', '2_255'],
  savedForMemorizationIds: ['allah', 'rabb', 'thoufeek_ayah', 'rahman', 'raheem'],
  duolingoLives: 5,
  completedDuolingoLessonIds: ['duo_quest_1'],
  hasSeenYMBWelcome: false,
  selectedReciter: 'Alafasy_128kbps',
  arabicFontSize: 'large',
  dailyGoalMinutes: 15,
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    // Check and update streak on load
    const streakResult = updateStreak(parsed.streakDays || 1, parsed.lastActiveTimestamp || 0);
    parsed.streakDays = streakResult.newStreak;
    parsed.lastActiveTimestamp = Date.now();
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Error loading progress from localStorage:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress to localStorage:', e);
  }
}
