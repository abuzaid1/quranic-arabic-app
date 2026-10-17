import React, { useState } from 'react';
import {
  Feather,
  Volume2,
  CheckCircle,
  HelpCircle,
  Award,
  ArrowRight,
  BookOpen,
  Info,
  Sparkles,
  Heart,
  Flame,
  RotateCcw,
  Check,
  X,
  Play,
  Shuffle,
  Star,
  Trophy,
} from 'lucide-react';
import { GrammarTopic, UserProgress } from '../types/index';
import { GRAMMAR_LESSONS } from '../data/grammarLessons';
import { quranAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

interface GrammarStudioViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

// Duolingo Quest Level Definition
interface DuolingoQuest {
  id: string;
  levelNumber: number;
  title: string;
  arabicTitle: string;
  summary: string;
  xpReward: number;
  exercises: Array<{
    id: string;
    type: 'sentence_builder' | 'match_pairs' | 'missing_harakah' | 'irab_role';
    questionPrompt: string;
    arabicContext?: string;
    englishTarget?: string;
    wordBank?: string[]; // For sentence builder
    correctOrder?: string[]; // For sentence builder
    pairs?: Array<{ ar: string; en: string }>; // For match pairs
    options?: string[]; // For multiple choice / harakah
    correctOptionIndex?: number;
    explanation: string;
    surahRef?: string;
  }>;
}

const DUOLINGO_GRAMMAR_QUESTS: DuolingoQuest[] = [
  {
    id: 'quest_1',
    levelNumber: 1,
    title: 'The 3 Quranic Building Blocks',
    arabicTitle: 'أَقْسَامُ الْكَلَام (Ism, Fi\'l, Harf)',
    summary: 'Every single word in the entire Quran belongs to one of three categories: Noun (Ism), Verb (Fi\'l), or Particle (Harf).',
    xpReward: 50,
    exercises: [
      {
        id: 'q1_1',
        type: 'match_pairs',
        questionPrompt: 'Match each Arabic linguistic category with its English definition:',
        pairs: [
          { ar: 'اسْم (Ism)', en: 'Noun / Name / Adjective' },
          { ar: 'فِعْل (Fi\'l)', en: 'Action / Verb with Time' },
          { ar: 'حَرْف (Harf)', en: 'Particle / Preposition' },
          { ar: 'كَلَام (Kalaam)', en: 'Meaningful Speech' },
        ],
        explanation: 'In Arabic: Ism is a person, place, or concept without time. Fi\'l is tied to past, present, or command. Harf gives meaning when joined with others.',
      },
      {
        id: 'q1_2',
        type: 'sentence_builder',
        questionPrompt: 'Assemble the opening verse of Surah Al-Fatiha in the correct order:',
        englishTarget: '"All praise is due to Allah, Lord of the worlds"',
        wordBank: ['رَبِّ', 'الْحَمْدُ', 'الْعَالَمِينَ', 'لِلَّهِ'],
        correctOrder: ['الْحَمْدُ', 'لِلَّهِ', 'رَبِّ', 'الْعَالَمِينَ'],
        surahRef: 'Al-Fatiha 1:2',
        explanation: 'Al-Hamdu (Mubtada / Noun) + Lillahi (Prepositional phrase) + Rabbi (Adjective / Mudaf) + Al-\'Alameen (Mudaf Ilayh).',
      },
      {
        id: 'q1_3',
        type: 'irab_role',
        questionPrompt: 'In the phrase "فِي الْجَنَّةِ" (In Paradise), what category is the word "فِي" (Fee)?',
        arabicContext: 'فِي الْجَنَّةِ',
        options: [
          'حَرْف جَرّ (Harf Jarr - Preposition Particle)',
          'اسْم (Ism - Noun)',
          'فِعْل مَاضٍ (Past Tense Verb)',
          'ضَمِير (Pronoun)',
        ],
        correctOptionIndex: 0,
        surahRef: 'Al-Bayyinah 98:8',
        explanation: 'Spot on! "فِي" is one of the primary Huroof al-Jarr (Prepositions) in the Quran, causing the following noun to take Kasrah.',
      },
    ],
  },
  {
    id: 'quest_2',
    levelNumber: 2,
    title: 'The Three Case Endings & Harakat',
    arabicTitle: 'الإِعْرَاب (Marfoo\', Mansoob, Majroor)',
    summary: 'Arabic case endings (Dammah, Fathah, Kasrah) tell you exactly WHO is doing the action and WHAT is being acted upon.',
    xpReward: 50,
    exercises: [
      {
        id: 'q2_1',
        type: 'missing_harakah',
        questionPrompt: 'In "بِسْمِ اللَّـ...ِ", what is the case ending Harakah on the Name of Allah (Majroor due to Idafah)?',
        arabicContext: 'بِسْمِ اللَّهِ',
        options: [
          'ـهِ (Kasrah) — Majroor state (In the Name OF Allah)',
          'ـهُ (Dammah) — Marfoo state',
          'ـهَ (Fathah) — Mansoob state',
          'ـهْ (Sukun) — Vowelless state',
        ],
        correctOptionIndex: 0,
        surahRef: 'Al-Fatiha 1:1',
        explanation: 'Correct! "Bismi" is Mudaf, and "Allahi" is Mudaf Ilayh (Possessor), which must ALWAYS take a Kasrah (ـِ)!',
      },
      {
        id: 'q2_2',
        type: 'sentence_builder',
        questionPrompt: 'Assemble the Quranic declaration of Tawheed from Surah Al-Ikhlas:',
        englishTarget: '"Say: He is Allah, [who is] One"',
        wordBank: ['أَحَدٌ', 'قُلْ', 'اللَّهُ', 'هُوَ'],
        correctOrder: ['قُلْ', 'هُوَ', 'اللَّهُ', 'أَحَدٌ'],
        surahRef: 'Al-Ikhlas 112:1',
        explanation: 'Qul (Command verb) + Huwa (Pronoun / Topic) + Allahu (Subject / Predicate) + Ahad (Description).',
      },
      {
        id: 'q2_3',
        type: 'irab_role',
        questionPrompt: 'Why does the word "الْحَمْدُ" (Al-Hamdu) end with a Ḍammah (ـُ)?',
        arabicContext: 'الْحَمْدُ لِلَّهِ',
        options: [
          'It is Marfoo\' (مَرْفُوع) because it is the Subject / Topic (Mubtada\')',
          'It is Mansoob (مَنْصُوب) because it is an Object',
          'It is Majroor (مَجْرُور) after a preposition',
          'It is an arbitrary vowelling',
        ],
        correctOptionIndex: 0,
        surahRef: 'Al-Fatiha 1:2',
        explanation: 'MashaAllah! In Arabic syntax, the starting noun of a nominal sentence is the Mubtada\' (Topic), which is fundamentally Marfoo\' with a Dammah.',
      },
    ],
  },
  {
    id: 'quest_3',
    levelNumber: 3,
    title: 'Prepositions & The Royal Idafah',
    arabicTitle: 'حُرُوفُ الْجَرِّ وَالإِضَافَة',
    summary: 'Discover how prepositions pull nouns into the Kasrah state, and how possessive chains (Idhafah) reveal divine honor.',
    xpReward: 60,
    exercises: [
      {
        id: 'q3_1',
        type: 'match_pairs',
        questionPrompt: 'Match each Quranic preposition (Harf Jarr) with its translation:',
        pairs: [
          { ar: 'مِنْ (Min)', en: 'From / Out of' },
          { ar: 'إِلَى (Ila)', en: 'Towards / To' },
          { ar: 'عَلَى (\'Ala)', en: 'Upon / Over' },
          { ar: 'فِي (Fee)', en: 'In / Inside' },
        ],
        explanation: 'These 4 prepositions appear thousands of times in the Holy Quran and always trigger the Majroor (Kasrah) state on the following noun.',
      },
      {
        id: 'q3_2',
        type: 'sentence_builder',
        questionPrompt: 'Build Thoufeek\'s namesake ayah from Surah Hud 11:88:',
        englishTarget: '"And my success is not but through Allah"',
        wordBank: ['بِاللَّهِ', 'وَمَا', 'إِلَّا', 'تَوْفِيقِي'],
        correctOrder: ['وَمَا', 'تَوْفِيقِي', 'إِلَّا', 'بِاللَّهِ'],
        surahRef: 'Hud 11:88',
        explanation: 'Wa (And) + Ma (Not) + Tawfeeqi (My success) + Illa (Except) + Billahi (Through Allah). Prophet Shu\'ayb\'s timeless creed!',
      },
      {
        id: 'q3_3',
        type: 'missing_harakah',
        questionPrompt: 'In the Idafah phrase "كِتَابُ اللَّـ...ِ" (Book of Allah), what ending vowel does Allah take?',
        arabicContext: 'كِتَابُ اللَّهِ',
        options: [
          'ـهِ (Kasrah) — The Mudaf Ilayh (Possessor) is always Majroor',
          'ـهُ (Dammah) — Nominative',
          'ـهَ (Fathah) — Accusative',
          'ـهْ (Sukun) — Stillness',
        ],
        correctOptionIndex: 0,
        surahRef: 'Al-Baqarah 2:2',
        explanation: 'Golden Rule of Nahw: The Mudaf (first word) loses Al- and Tanween, while the Mudaf Ilayh (second word) is ALWAYS Majroor with Kasrah!',
      },
    ],
  },
];

export const GrammarStudioView: React.FC<GrammarStudioViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [activeMode, setActiveMode] = useState<'duolingo' | 'reference'>('duolingo');

  // Duolingo Game States
  const [activeQuestIndex, setActiveQuestIndex] = useState<number>(0);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [selectedWordOrder, setSelectedWordOrder] = useState<string[]>([]);
  const [selectedPairAr, setSelectedPairAr] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showQuestCompleteModal, setShowQuestCompleteModal] = useState<boolean>(false);
  const [activePlayingRef, setActivePlayingRef] = useState<string | null>(null);

  // Reference mode state
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(GRAMMAR_LESSONS[0]);

  const currentQuest = DUOLINGO_GRAMMAR_QUESTS[activeQuestIndex] || DUOLINGO_GRAMMAR_QUESTS[0];
  const currentExercise = currentQuest.exercises[exerciseIndex];

  // Web Audio Chime Synthesizer
  const playSoundEffect = (type: 'correct' | 'wrong' | 'complete') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'correct') {
        // Melodious double chime (C5 -> G5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'wrong') {
        // Soft low bonk
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(140, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'complete') {
        // Grand fanfare (C5 -> E5 -> G5 -> C6)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        osc.frequency.setValueAtTime(1046.5, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      }
    } catch (e) {
      // Audio note ignored
    }
  };

  const handlePlayGrammarAyah = (ayahRef: string) => {
    if (activePlayingRef === ayahRef && quranAudio.isPlaying()) {
      quranAudio.stop();
      setActivePlayingRef(null);
      return;
    }
    setActivePlayingRef(ayahRef);
    quranAudio.playQuranReference(
      ayahRef,
      progress.selectedReciter,
      () => setActivePlayingRef(null),
      () => setActivePlayingRef(null)
    );
  };

  // Check exercise answer
  const handleCheckAnswer = () => {
    let isCorrect = false;

    if (currentExercise.type === 'sentence_builder') {
      const order = selectedWordOrder;
      const target = currentExercise.correctOrder || [];
      isCorrect = order.length === target.length && order.every((w, i) => w === target[i]);
    } else if (currentExercise.type === 'match_pairs') {
      isCorrect = matchedPairs.length === (currentExercise.pairs?.length || 0);
    } else if (currentExercise.type === 'missing_harakah' || currentExercise.type === 'irab_role') {
      isCorrect = selectedOption === currentExercise.correctOptionIndex;
    }

    if (isCorrect) {
      setFeedbackState('correct');
      playSoundEffect('correct');
      confetti({ particleCount: 30, spread: 50 });
      onUpdateProgress((p) => ({ ...p, xp: p.xp + 15 }));
    } else {
      setFeedbackState('wrong');
      playSoundEffect('wrong');
      // Decrement lives if available
      onUpdateProgress((p) => ({
        ...p,
        duolingoLives: Math.max(1, (p.duolingoLives || 5) - 1),
      }));
    }
  };

  // Continue to next exercise or complete level
  const handleContinueNext = () => {
    setFeedbackState('idle');
    setSelectedWordOrder([]);
    setSelectedPairAr(null);
    setMatchedPairs([]);
    setSelectedOption(null);

    if (exerciseIndex < currentQuest.exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
    } else {
      // Quest Level Completed!
      setShowQuestCompleteModal(true);
      playSoundEffect('complete');
      confetti({ particleCount: 60, spread: 80 });
      onUpdateProgress((p) => {
        const completed = p.completedDuolingoLessonIds || [];
        const updated = completed.includes(currentQuest.id) ? completed : [...completed, currentQuest.id];
        return {
          ...p,
          xp: p.xp + currentQuest.xpReward,
          completedDuolingoLessonIds: updated,
          streakDays: p.streakDays + 1,
        };
      });
    }
  };

  const handleSelectWordTile = (word: string) => {
    if (selectedWordOrder.includes(word)) {
      setSelectedWordOrder((prev) => prev.filter((w) => w !== word));
    } else {
      setSelectedWordOrder((prev) => [...prev, word]);
    }
  };

  const handleSelectPairArabic = (ar: string) => {
    setSelectedPairAr(ar);
  };

  const handleSelectPairEnglish = (en: string) => {
    if (!selectedPairAr) return;
    const pair = currentExercise.pairs?.find((p) => p.ar === selectedPairAr && p.en === en);
    if (pair) {
      setMatchedPairs((prev) => [...prev, pair.ar]);
      playSoundEffect('correct');
    } else {
      playSoundEffect('wrong');
    }
    setSelectedPairAr(null);
  };

  const lives = progress.duolingoLives || 5;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Mode Switcher */}
      <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 dark:text-amber-100 flex items-center space-x-2">
            <Feather className="w-5 h-5 text-amber-500" />
            <span>Quranic Grammar <span className="font-arabic font-bold text-amber-500">(نَحْو)</span> Academy</span>
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Master Arabic grammar through Duolingo-style interactive quests or read the comprehensive reference lessons.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/40 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('duolingo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMode === 'duolingo'
                ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Duolingo Quest Series</span>
          </button>

          <button
            onClick={() => setActiveMode('reference')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMode === 'reference'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum Reference</span>
          </button>
        </div>
      </div>

      {/* DUOLINGO QUEST SERIES MODE */}
      {activeMode === 'duolingo' && (
        <div className="space-y-6">
          {/* Duolingo Gamification Top Bar */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-800 flex flex-wrap items-center justify-between gap-4">
            {/* Level selection badges */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {DUOLINGO_GRAMMAR_QUESTS.map((q, idx) => {
                const isSelected = activeQuestIndex === idx;
                const isCompleted = (progress.completedDuolingoLessonIds || []).includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestIndex(idx);
                      setExerciseIndex(0);
                      setFeedbackState('idle');
                      setSelectedWordOrder([]);
                      setSelectedOption(null);
                      setMatchedPairs([]);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                        : isCompleted
                        ? 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    <span>Level {q.levelNumber}</span>
                    {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Lives (Hearts), Streak, XP status */}
            <div className="flex items-center space-x-4">
              {/* Hearts */}
              <div className="flex items-center space-x-1 bg-rose-950/80 border border-rose-500/40 px-3 py-1 rounded-full text-rose-300 text-xs font-bold">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{lives} Lives</span>
              </div>

              {/* Streak */}
              <div className="flex items-center space-x-1 bg-orange-950/80 border border-orange-500/40 px-3 py-1 rounded-full text-orange-300 text-xs font-bold">
                <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span>{progress.streakDays}d Streak</span>
              </div>

              {/* XP */}
              <div className="flex items-center space-x-1 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full text-amber-300 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{progress.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Exercise Card Stage */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-emerald-950/80 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl space-y-6">
            {/* Header: Progress Bar inside Quest */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Level {currentQuest.levelNumber}: {currentQuest.title}
                </span>
                <span>
                  Question {exerciseIndex + 1} of {currentQuest.exercises.length}
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((exerciseIndex + 1) / currentQuest.exercises.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Exercise Prompt */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-950 dark:text-amber-100">
                {currentExercise.questionPrompt}
              </h3>
              {currentExercise.englishTarget && (
                <p className="text-sm text-emerald-700 dark:text-emerald-300 italic font-medium">
                  {currentExercise.englishTarget}
                </p>
              )}
            </div>

            {/* EXERCISE TYPE 1: SENTENCE BUILDER */}
            {currentExercise.type === 'sentence_builder' && (
              <div className="space-y-6 py-2">
                {/* Construction Answer Tray */}
                <div className="min-h-[70px] p-4 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 flex flex-wrap items-center gap-2 justify-center" dir="rtl">
                  {selectedWordOrder.length === 0 ? (
                    <span className="text-xs text-emerald-500 italic" dir="ltr">
                      Tap the word tiles below in the correct Arabic order...
                    </span>
                  ) : (
                    selectedWordOrder.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectWordTile(word)}
                        className="px-4 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-quran text-2xl font-bold shadow-md cursor-pointer hover:bg-amber-300 transition-transform active:scale-95"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Word Bank */}
                <div className="space-y-2 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                    Word Bank (Tap to select):
                  </span>
                  <div className="flex flex-wrap justify-center gap-2.5" dir="rtl">
                    {currentExercise.wordBank?.map((word, idx) => {
                      const isUsed = selectedWordOrder.includes(word);
                      return (
                        <button
                          key={idx}
                          disabled={isUsed || feedbackState !== 'idle'}
                          onClick={() => handleSelectWordTile(word)}
                          className={`px-4 py-2 rounded-xl font-quran text-2xl font-bold transition-all cursor-pointer ${
                            isUsed
                              ? 'opacity-30 bg-emerald-200 dark:bg-emerald-800 text-transparent select-none'
                              : 'bg-emerald-100 dark:bg-emerald-800/80 text-emerald-950 dark:text-amber-200 hover:bg-amber-100 hover:scale-105 border border-emerald-300 dark:border-emerald-700 shadow-sm'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* EXERCISE TYPE 2: MATCH THE PAIRS */}
            {currentExercise.type === 'match_pairs' && (
              <div className="grid grid-cols-2 gap-4 py-2">
                {/* Left: Arabic Terms */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                    Arabic Term:
                  </span>
                  {currentExercise.pairs?.map((p) => {
                    const isMatched = matchedPairs.includes(p.ar);
                    const isSelected = selectedPairAr === p.ar;

                    return (
                      <button
                        key={p.ar}
                        disabled={isMatched || feedbackState !== 'idle'}
                        onClick={() => handleSelectPairArabic(p.ar)}
                        className={`w-full p-3 rounded-2xl border text-center font-quran text-lg font-bold transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-600 text-white border-emerald-600 opacity-50'
                            : isSelected
                            ? 'bg-amber-400 text-emerald-950 border-amber-500 ring-2 ring-amber-300 shadow-md'
                            : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-950 dark:text-amber-200 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {p.ar}
                      </button>
                    );
                  })}
                </div>

                {/* Right: English Meanings */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                    English Meaning:
                  </span>
                  {currentExercise.pairs?.map((p) => {
                    const isMatched = matchedPairs.includes(p.ar);

                    return (
                      <button
                        key={p.en}
                        disabled={isMatched || feedbackState !== 'idle'}
                        onClick={() => handleSelectPairEnglish(p.en)}
                        className={`w-full p-3 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-600 text-white border-emerald-600 opacity-50'
                            : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {p.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXERCISE TYPE 3 & 4: MULTIPLE CHOICE (HARAKAH & I'RAB ROLE) */}
            {(currentExercise.type === 'missing_harakah' || currentExercise.type === 'irab_role') && (
              <div className="space-y-4 py-2">
                {currentExercise.arabicContext && (
                  <div className="text-center py-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-4xl sm:text-5xl font-quran font-black text-amber-600 dark:text-amber-300">
                      {currentExercise.arabicContext}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2.5">
                  {currentExercise.options?.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    let style = 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:border-amber-400 text-emerald-950 dark:text-emerald-100';

                    if (isSelected) {
                      style = 'bg-amber-400 text-emerald-950 border-amber-500 font-bold ring-2 ring-amber-300';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={feedbackState !== 'idle'}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${style}`}
                      >
                        <span className="font-bold mr-2 text-amber-500">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Feedback Banner (Duolingo Style) */}
            {feedbackState !== 'idle' ? (
              <div
                className={`p-4 rounded-2xl border-2 space-y-3 animate-in fade-in duration-200 ${
                  feedbackState === 'correct'
                    ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-100 border-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100 border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {feedbackState === 'correct' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                    <span className="font-extrabold text-sm">
                      {feedbackState === 'correct' ? 'MashaAllah! Excellent!' : 'Review Rule:'}
                    </span>
                  </div>
                  {currentExercise.surahRef && (
                    <button
                      onClick={() => handlePlayGrammarAyah(currentExercise.surahRef!)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800 text-amber-300 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{currentExercise.surahRef}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs leading-relaxed font-medium">
                  {currentExercise.explanation}
                </p>

                <button
                  onClick={handleContinueNext}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                    feedbackState === 'correct'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  Continue
                </button>
              </div>
            ) : (
              /* Check Button */
              <button
                onClick={handleCheckAnswer}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Check Answer
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL: QUEST LEVEL COMPLETE */}
      {showQuestCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-white dark:bg-emerald-950 rounded-3xl p-6 sm:p-8 text-center space-y-5 border-2 border-amber-400 shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-amber-400 text-emerald-950 mx-auto flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                Level Complete!
              </span>
              <h3 className="text-2xl font-black text-emerald-950 dark:text-white mt-1">
                Alhamdulillah, Thoufeek!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                You successfully mastered <strong>{currentQuest.title}</strong>!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-around">
              <div>
                <span className="block text-2xl font-black text-amber-500">+{currentQuest.xpReward}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">XP Gained</span>
              </div>
              <div className="w-px h-8 bg-emerald-300 dark:bg-emerald-700" />
              <div>
                <span className="block text-2xl font-black text-emerald-600">100%</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Accuracy</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQuestCompleteModal(false);
                if (activeQuestIndex < DUOLINGO_GRAMMAR_QUESTS.length - 1) {
                  setActiveQuestIndex((i) => i + 1);
                  setExerciseIndex(0);
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm uppercase shadow-lg cursor-pointer"
            >
              Continue to Next Quest!
            </button>
          </div>
        </div>
      )}

      {/* CURRICULUM REFERENCE MODE */}
      {activeMode === 'reference' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lesson Modules */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
              Grammar Curriculum:
            </span>

            <div className="space-y-2">
              {GRAMMAR_LESSONS.map((topic, index) => {
                const isSelected = selectedTopic.id === topic.id;
                const isCompleted = progress.completedGrammarTopicIds.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 dark:bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                        : 'bg-white dark:bg-emerald-950/70 border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200">
                            Lesson {index + 1}
                          </span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            {topic.difficulty}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-emerald-950 dark:text-amber-100">
                          {topic.title}
                        </h3>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 line-clamp-2">
                          {topic.summary}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center space-x-1">
                        {isCompleted && (
                          <span title="Completed by Thoufeek">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Lesson Reader */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-6 sm:p-7 border border-emerald-200 dark:border-emerald-800/80 shadow-md space-y-5">
              <div className="pb-4 border-b border-emerald-100 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                    Lesson Objective
                  </span>
                  <h3 className="text-xl font-bold text-emerald-950 dark:text-amber-100">
                    {selectedTopic.title}
                  </h3>
                </div>
                <span className="text-2xl font-quran font-bold text-emerald-800 dark:text-emerald-300">
                  {selectedTopic.arabicTitle}
                </span>
              </div>

              {/* Lesson Summary */}
              <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                {selectedTopic.summary}
              </p>

              {/* Core Rule Card */}
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700/60 text-xs text-emerald-950 dark:text-emerald-100 space-y-2">
                <span className="font-bold uppercase tracking-wider text-emerald-800 dark:text-amber-300 block">
                  The Golden Rule:
                </span>
                <pre className="font-sans whitespace-pre-wrap leading-relaxed">
                  {selectedTopic.coreRule}
                </pre>
              </div>

              {/* Quranic Examples Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Key Quranic Examples & Linguistic Analysis:
                </span>
                {selectedTopic.keyQuranExamples.map((ex, i) => {
                  const isPlaying = activePlayingRef === ex.ayahRef && quranAudio.isPlaying();
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isPlaying
                          ? 'border-amber-400 bg-amber-50/60 dark:bg-emerald-900/60 shadow-md ring-2 ring-amber-400/30'
                          : 'border-emerald-100 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-900/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-2xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                          {ex.arabic}
                        </div>
                        <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                          "{ex.english}"
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          <span className="font-bold">Linguistic I'rab:</span> {ex.analysis} •{' '}
                          <span className="font-semibold text-emerald-800 dark:text-amber-300">{ex.ayahRef}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayGrammarAyah(ex.ayahRef)}
                        className={`p-2.5 rounded-xl transition-all shadow-xs cursor-pointer shrink-0 self-end sm:self-center flex items-center space-x-1.5 ${
                          isPlaying
                            ? 'bg-amber-400 text-emerald-950 font-bold scale-105 ring-2 ring-amber-500'
                            : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                        }`}
                        title={isPlaying ? 'Pause recitation' : `Recite ${ex.ayahRef} with Real Qari`}
                      >
                        <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                        <span className="text-[10px] uppercase font-bold">
                          {isPlaying ? 'Reciting' : 'Recite Ayah'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
