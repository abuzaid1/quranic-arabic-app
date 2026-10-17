// Data types and interfaces for Thoufeek Quranic Arabic Master

export type MakhrajLocation = 'throat' | 'tongue' | 'lips' | 'nasal' | 'chest_empty_space';

export interface ArabicLetter {
  id: string;
  name: string;
  arabicName: string;
  glyph: string;
  transliteration: string;
  makhraj: MakhrajLocation;
  makhrajDescription: string;
  isHeavy: boolean; // Tafkheem vs Tarqeeq
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  sampleWord: {
    arabic: string;
    english: string;
    ayahRef?: string;
  };
}

export type TajweedCategory = 'noon_sakina' | 'meem_sakina' | 'madd' | 'qalqalah' | 'heavy_light';

export interface TajweedRule {
  id: string;
  name: string;
  arabicName: string;
  category: TajweedCategory;
  description: string;
  rulesHowToApply: string;
  colorClass: string;
  badgeColor: string;
  letters: string[];
  durationHarakat?: number;
  examples: Array<{
    arabic: string;
    transliteration: string;
    explanation: string;
    surahRef: string;
  }>;
}

export type WordCategory = 'pronoun' | 'preposition' | 'noun' | 'verb' | 'particle' | 'divine_name';

export interface QuranWord {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  frequency: number; // approximate count in Holy Quran
  category: WordCategory;
  root: string;
  exampleAyah: {
    arabic: string;
    english: string;
    surah: string;
    ayahNumber: number;
  };
}

export interface QuranRoot {
  root: string; // e.g. "ع ل م"
  rootArabic: string;
  basicMeaning: string;
  totalOccurrences: number;
  derivatives: Array<{
    arabic: string;
    transliteration: string;
    english: string;
    form: string;
    surahRef: string;
  }>;
}

export interface WordAnalysis {
  wordIndex: number;
  arabic: string;
  transliteration: string;
  english: string;
  type: 'ism' | 'fi\'l' | 'harf';
  root?: string;
  caseEnding?: 'marfoo' | 'mansoob' | 'majroor' | 'mabni';
  caseExplanation?: string;
  tajweedRule?: string;
}

export interface AyahData {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  audioAyahNumberOverall: number;
  words: WordAnalysis[];
}

export interface GrammarTopic {
  id: string;
  title: string;
  arabicTitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  coreRule: string;
  keyQuranExamples: Array<{
    arabic: string;
    english: string;
    analysis: string;
    ayahRef: string;
  }>;
  practiceQuestions: Array<{
    id: string;
    prompt: string;
    arabicText?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface UserProgress {
  name: string;
  streakDays: number;
  lastActiveTimestamp: number;
  xp: number;
  masteredLetterIds: string[];
  masteredWordIds: string[];
  completedTajweedRuleIds: string[];
  completedGrammarTopicIds: string[];
  favoriteWordIds: string[];
  favoriteAyahIds: string[];
  savedForMemorizationIds: string[];
  duolingoLives: number;
  completedDuolingoLessonIds: string[];
  hasSeenYMBWelcome?: boolean;
  selectedReciter: string;
  arabicFontSize: 'normal' | 'large' | 'huge';
  dailyGoalMinutes: number;
}
