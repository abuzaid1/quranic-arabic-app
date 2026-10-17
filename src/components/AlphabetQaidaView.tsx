import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle,
  Filter,
  Info,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Play,
  Pause,
  Video,
  Layers,
  GraduationCap,
  Activity,
  Award,
  RotateCcw,
  ExternalLink,
  Flame,
  HelpCircle,
  Headphones,
} from 'lucide-react';
import { ArabicLetter, MakhrajLocation, UserProgress } from '../types/index';
import { ARABIC_LETTERS } from '../data/arabicLetters';
import { quranAudio } from '../utils/audioPlayer';
import { harakatAudio, HarakahType, CONSONANT_PROFILES } from '../utils/harakatAudio';
import confetti from 'canvas-confetti';

interface AlphabetQaidaViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

type QaidaSectionTab = 'harakat' | 'quiz' | 'flashcards' | 'letters' | 'makharij' | 'videos' | 'forms' | 'matching';

interface VideoLesson {
  id: string;
  title: string;
  arabicTitle: string;
  source: string;
  duration: string;
  description: string;
  youtubeId: string;
  keyTakeaways: string[];
}

const GROUND_ZERO_VIDEOS: VideoLesson[] = [
  {
    id: 'v1',
    title: 'The Arabic Alphabet & Sounds from Ground Zero',
    arabicTitle: 'حروف الهجاء من الصفر',
    source: 'Shaykhi Academy & Arabic 101',
    duration: '14 min',
    description: 'Learn the exact name and clean phonetic sound of all 28 Arabic letters without confusing letter names with vowel sounds.',
    youtubeId: 'b_oV_Ua0cNg',
    keyTakeaways: [
      'Understand the difference between a letter name (e.g. Baa) and its sound (B).',
      'Learn proper breath control for heavy (Tafkheem) vs light (Tarqeeq) letters.',
      'The foundational step before reading any verse in the Quran.',
    ],
  },
  {
    id: 'v2',
    title: 'Harakat in Arabic: The Complete Guide (Fatha, Kasra, Damma)',
    arabicTitle: 'دليل الحركات القصيرة في اللغة العربية',
    source: 'Shaykhi Academy Masterclass',
    duration: '12 min',
    description: 'Comprehensive guide based on Shaykhi Academy: how short vowels work, physical mouth shapes, and avoiding common mistakes.',
    youtubeId: '9bEaHw5B9b0',
    keyTakeaways: [
      'Fatḥah (ـَ): The jaw opens naturally vertically without widening horizontally.',
      'Kasrah (ـِ): The lower jaw drops gently down to create the crisp /i/ sound.',
      'Ḍammah (ـُ): The lips circle forward into a small, round opening.',
      'Sukūn (ـْ): Full stop / arrest of air without adding an extra vowel.',
    ],
  },
  {
    id: 'v3',
    title: 'The 5 Major Makharij (Organs of Articulation)',
    arabicTitle: 'المخارج العامة الخمسة',
    source: 'Tajweed Institute',
    duration: '18 min',
    description: 'Detailed anatomical walkthrough of the Throat, Tongue, Lips, Oral Cavity, and Nasal Passage where every Quranic sound originates.',
    youtubeId: '8K1h0H8J7wI',
    keyTakeaways: [
      'The Throat (الحلق) contains 6 letters: Hamzah, Haa, Ayn, Haa, Ghayn, Khaa.',
      'The Tongue (اللسان) is the master organ with 10 points and 18 letters.',
      'The Lips (الشفتان) produce 4 letters: Faa, Baa, Meem, Waaw.',
    ],
  },
  {
    id: 'v4',
    title: 'Connecting Letters in Arabic (Initial, Medial, Final)',
    arabicTitle: 'اتصال الحروف في أول ووسط وآخر الكلمة',
    source: 'Qaida Nooraniyyah Method',
    duration: '10 min',
    description: 'How letters transform when written inside words, plus the 6 non-connecting letters that never join to the left.',
    youtubeId: 'L8E_6Gj9w-w',
    keyTakeaways: [
      '6 letters are "non-connectors" (د, ذ, ر, ز, و, ا) and must never connect forward.',
      'Most letters lose their trailing flourish in the beginning and middle of words.',
    ],
  },
];

interface HarakatCardData {
  id: HarakahType;
  name: string;
  arabicName: string;
  symbol: string;
  sound: string;
  transliterationTip: string;
  mouthPosture: string;
  shaykhiRule: string;
  sampleLetterId: string;
  sampleWordArabic: string;
  sampleWordMeaning: string;
}

const HARAKAT_FLASHCARDS: HarakatCardData[] = [
  {
    id: 'fatha',
    name: 'Fatḥah',
    arabicName: 'فَتْحَة',
    symbol: 'ـَ',
    sound: 'Short "A" /æ/ or /a/',
    transliterationTip: 'Like the "a" in "cat" (light) or "father" (heavy)',
    mouthPosture: 'Open the jaw vertically with lips in relaxed rest position.',
    shaykhiRule: 'Shaykhi Academy emphasizes: Fatḥah means "opening". Never stretch lips horizontally like a smile, open vertically.',
    sampleLetterId: 'baa',
    sampleWordArabic: 'بَسْمَلَة',
    sampleWordMeaning: 'To say Bismillah',
  },
  {
    id: 'kasra',
    name: 'Kasrah',
    arabicName: 'كَسْرَة',
    symbol: 'ـِ',
    sound: 'Short "I" /ɪ/ or /i/',
    transliterationTip: 'Like the "i" in "sit"',
    mouthPosture: 'Drop the lower jaw downwards gently while middle of tongue rises slightly.',
    shaykhiRule: 'Kasrah literally means "breaking" or "lowering". Drop lower jaw to prevent it from decaying into an /e/ sound.',
    sampleLetterId: 'baa',
    sampleWordArabic: 'بِسْمِ اللَّهِ',
    sampleWordMeaning: 'In the name of Allah',
  },
  {
    id: 'damma',
    name: 'Ḍammah',
    arabicName: 'ضَمَّة',
    symbol: 'ـُ',
    sound: 'Short "U" /ʊ/ or /u/',
    transliterationTip: 'Like the "u" in "put"',
    mouthPosture: 'Circle and protrude both lips forward leaving a small central hole.',
    shaykhiRule: 'Ḍammah means "embracing" or "joining". Both lips must actively round forward to form a complete circle.',
    sampleLetterId: 'baa',
    sampleWordArabic: 'بُيُوت',
    sampleWordMeaning: 'Houses / Homes',
  },
  {
    id: 'sukun',
    name: 'Sukūn',
    arabicName: 'سُكُون',
    symbol: 'ـْ',
    sound: 'Vowelless Rest / Complete Stop',
    transliterationTip: 'Clean consonant closure without adding a trailing vowel',
    mouthPosture: 'Hold the organ of speech firmly in place with no breath escape.',
    shaykhiRule: 'Sukūn means "peace / stillness". If on letters of Qutb Jad (ق ط ب ج د), release with an echoing bounce (Qalqalah).',
    sampleLetterId: 'daal',
    sampleWordArabic: 'أَحَدْ',
    sampleWordMeaning: 'One / Unique (Surah Al-Ikhlas)',
  },
  {
    id: 'tanween_fath',
    name: 'Tanween Fatḥ',
    arabicName: 'تَنْوِين فَتْح',
    symbol: 'ـً',
    sound: '"-an" ending with hidden Noon',
    transliterationTip: 'Vowel /a/ followed immediately by vowelless nasal /n/',
    mouthPosture: 'Form Fatha opening followed immediately by tongue tip tapping upper gum.',
    shaykhiRule: 'Tanween is an unwritten Noon Sakinah that exists in speech only. Written with Alif support (except on Ta Marbutah).',
    sampleLetterId: 'baa',
    sampleWordArabic: 'كِتَابًا',
    sampleWordMeaning: 'A Book (indefinite accusative)',
  },
  {
    id: 'tanween_kasr',
    name: 'Tanween Kasr',
    arabicName: 'تَنْوِين كَسْر',
    symbol: 'ـٍ',
    sound: '"-in" ending with hidden Noon',
    transliterationTip: 'Vowel /i/ followed immediately by vowelless nasal /n/',
    mouthPosture: 'Drop jaw downward for Kasrah then touch tongue tip for Noon.',
    shaykhiRule: 'Appears under the final letter of indefinite nouns in the Majroor (genitive) state.',
    sampleLetterId: 'baa',
    sampleWordArabic: 'فِي رَحْمَةٍ',
    sampleWordMeaning: 'In mercy',
  },
  {
    id: 'tanween_damm',
    name: 'Tanween Ḍamm',
    arabicName: 'تَنْوِين ضَمّ',
    symbol: 'ـٌ',
    sound: '"-un" ending with hidden Noon',
    transliterationTip: 'Vowel /u/ followed immediately by vowelless nasal /n/',
    mouthPosture: 'Round lips forward for Dammah then close on nasal Noon.',
    shaykhiRule: 'Indicates indefinite nouns in the Marfoo (nominative) state, e.g. Subject or Predicate.',
    sampleLetterId: 'baa',
    sampleWordArabic: 'عَلِيمٌ حَكِيمٌ',
    sampleWordMeaning: 'All-Knowing, All-Wise',
  },
  {
    id: 'shaddah',
    name: 'Shaddah',
    arabicName: 'شَدَّة',
    symbol: 'ـّ',
    sound: 'Doubled Consonant (Hold for 2 counts)',
    transliterationTip: 'First instance has Sukun, second has the vowel',
    mouthPosture: 'Lock the articulation point for double the duration before vowel release.',
    shaykhiRule: 'Shaddah means "strengthening". A doubled letter represents 2 letters compressed into one.',
    sampleLetterId: 'meem',
    sampleWordArabic: 'مُحَمَّدٌ',
    sampleWordMeaning: 'Muhammad (Peace be upon him)',
  },
];

interface QuranWordQuizQuestion {
  id: string;
  prompt: string;
  wordSnippet: string;
  missingPart: string;
  options: { label: string; isCorrect: boolean; explanation: string }[];
  audioSurahRef?: string;
}

const HARAKAT_QURAN_QUESTIONS: QuranWordQuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'In Bismillah: "بِسْمِ اللَّهِ", what is the Harakah under the first letter Baa (ب)?',
    wordSnippet: 'بِـسْمِ اللَّهِ',
    missingPart: 'Harakah on the Baa (ب)',
    options: [
      { label: 'Kasrah (ـِ) — Making the /bi/ sound', isCorrect: true, explanation: 'Correct! The Baa carries a Kasrah: "Bi-smi" because "Bi" is a Harf Jarr (preposition).' },
      { label: 'Fatḥah (ـَ) — Making the /ba/ sound', isCorrect: false, explanation: 'Incorrect. If it had Fatha it would be "Basm", but in Quran it is "Bismi".' },
      { label: 'Ḍammah (ـُ) — Making the /bu/ sound', isCorrect: false, explanation: 'Incorrect. Dammah produces /bu/.' },
      { label: 'Sukūn (ـْ) — Rest / Stop', isCorrect: false, explanation: 'Incorrect. Arabic words cannot start with Sukun.' },
    ],
    audioSurahRef: 'Al-Fatiha 1:1',
  },
  {
    id: 'q2',
    prompt: 'In Surah Al-Ikhlas: "قُلْ هُوَ اللَّهُ أَحَدٌ", what Harakah is on the Qaaf (ق) in "Qul"?',
    wordSnippet: 'قُـلْ',
    missingPart: 'Harakah on Qaaf',
    options: [
      { label: 'Ḍammah (ـُ) — Making the deep /qu/ sound', isCorrect: true, explanation: 'MashaAllah! Qaaf has a Dammah: "Qu-l" (Say).' },
      { label: 'Kasrah (ـِ) — Making the /qi/ sound', isCorrect: false, explanation: 'Incorrect. That would sound like "Qil".' },
      { label: 'Fatḥah (ـَ) — Making the /qa/ sound', isCorrect: false, explanation: 'Incorrect. That would sound like "Qal".' },
      { label: 'Tanween — Double vowel', isCorrect: false, explanation: 'Incorrect. Qaaf is a single letter with Dammah.' },
    ],
    audioSurahRef: 'Al-Ikhlas 112:1',
  },
  {
    id: 'q3',
    prompt: 'When a Sukūn (ـْ) lands on a letter of "Qutb Jad" (ق ط ب ج د), what Tajweed rule applies?',
    wordSnippet: 'قَـلْـقَـلَـة',
    missingPart: 'Acoustic bouncing effect',
    options: [
      { label: 'Qalqalah (Bouncing Echo Resonance)', isCorrect: true, explanation: 'SubhanAllah! When any of the 5 letters of Qutb Jad have Sukun, you make an audible bouncing echo!' },
      { label: 'Idgham (Merging into next letter)', isCorrect: false, explanation: 'Incorrect. Idgham applies to Noon Sakinah and Meem Sakinah.' },
      { label: 'Ikhfa (Hiding with nasalization)', isCorrect: false, explanation: 'Incorrect. Ikhfa is light nasal concealment.' },
      { label: 'Tarqeeq (Softening)', isCorrect: false, explanation: 'Incorrect. Qalqalah is the specific bouncing echo rule.' },
    ],
    audioSurahRef: 'Al-Falaq 113:1',
  },
  {
    id: 'q4',
    prompt: 'In "الْحَمْدُ لِلَّهِ", what Harakah is on the final Daal (د) in Al-Hamdu?',
    wordSnippet: 'الْحَمْـدُ',
    missingPart: 'Case ending vowel',
    options: [
      { label: 'Ḍammah (ـُ) — Marfoo\' (Nominative Subject)', isCorrect: true, explanation: 'Spot on! Al-Hamdu ends in Dammah because it is the Mubtada\' (Topic/Subject) of the sentence.' },
      { label: 'Fatḥah (ـَ) — Mansoob (Accusative)', isCorrect: false, explanation: 'Incorrect. That would be Al-Hamda.' },
      { label: 'Kasrah (ـِ) — Majroor (Genitive)', isCorrect: false, explanation: 'Incorrect. That would be Al-Hamdi.' },
      { label: 'Sukūn (ـْ) — Rest', isCorrect: false, explanation: 'Incorrect during continuous recitation.' },
    ],
    audioSurahRef: 'Al-Fatiha 1:2',
  },
];

export const AlphabetQaidaView: React.FC<AlphabetQaidaViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [activeTab, setActiveTab] = useState<QaidaSectionTab>('harakat');
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter>(ARABIC_LETTERS[0]);
  const [makhrajFilter, setMakhrajFilter] = useState<MakhrajLocation | 'all'>('all');
  const [heavyFilterOnly, setHeavyFilterOnly] = useState<boolean>(false);
  const [selectedHarakah, setSelectedHarakah] = useState<HarakahType>('fatha');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPlayingFullAlphabet, setIsPlayingFullAlphabet] = useState<boolean>(false);
  const [activeVideoEmbed, setActiveVideoEmbed] = useState<string | null>(null);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Test with Harakat state
  const [quizSubMode, setQuizSubMode] = useState<'ear_drill' | 'quran_words'>('ear_drill');
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillStreak, setDrillStreak] = useState<number>(0);
  const [drillTarget, setDrillTarget] = useState<{ letter: ArabicLetter; harakah: HarakahType }>(() => ({
    letter: ARABIC_LETTERS[1],
    harakah: 'fatha',
  }));
  const [drillFeedback, setDrillFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Quran Word Quiz state
  const [quranQuizIndex, setQuranQuizIndex] = useState<number>(0);
  const [quranQuizSelected, setQuranQuizSelected] = useState<number | null>(null);
  const [quranQuizFeedback, setQuranQuizFeedback] = useState<boolean | null>(null);

  // Matching game state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedMatchSymbol, setSelectedMatchSymbol] = useState<string | null>(null);
  const [selectedMatchName, setSelectedMatchName] = useState<string | null>(null);

  const filteredLetters = ARABIC_LETTERS.filter((l) => {
    if (makhrajFilter !== 'all' && l.makhraj !== makhrajFilter) return false;
    if (heavyFilterOnly && !l.isHeavy) return false;
    return true;
  });

  // Play working authentic Harakah sound
  const handlePlayHarakah = (letterId: string, harakah: HarakahType) => {
    setIsPlayingAudio(true);
    harakatAudio.playHarakahPhonetic(letterId, harakah, () => {
      setIsPlayingAudio(false);
    });
  };

  // Play base isolated letter name
  const handlePronounceLetter = (letterId: string) => {
    setIsPlayingAudio(true);
    quranAudio.playLetter(
      letterId,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  // Play full 28 letters continuous human recitation
  const handleToggleFullAlphabet = () => {
    if (isPlayingFullAlphabet) {
      quranAudio.stop();
      setIsPlayingFullAlphabet(false);
      return;
    }
    setIsPlayingFullAlphabet(true);
    quranAudio.playFullAlphabet(
      () => setIsPlayingFullAlphabet(false),
      () => setIsPlayingFullAlphabet(false)
    );
  };

  // Play sample Quran verse with real reciter
  const handlePlayQuranSample = (ayahRef: string) => {
    quranAudio.playQuranReference(ayahRef, progress.selectedReciter);
  };

  const handleToggleMastered = (letterId: string) => {
    onUpdateProgress((prev) => {
      const isMastered = prev.masteredLetterIds.includes(letterId);
      const updated = isMastered
        ? prev.masteredLetterIds.filter((id) => id !== letterId)
        : [...prev.masteredLetterIds, letterId];
      const xpGain = !isMastered ? 25 : 0;

      if (!isMastered) {
        confetti({ particleCount: 30, spread: 50 });
      }

      return {
        ...prev,
        masteredLetterIds: updated,
        xp: prev.xp + xpGain,
      };
    });
  };

  // Drill Quiz Handlers
  const handlePlayDrillSound = () => {
    handlePlayHarakah(drillTarget.letter.id, drillTarget.harakah);
  };

  const handleAnswerDrill = (guessedHarakah: HarakahType) => {
    const isCorrect = guessedHarakah === drillTarget.harakah;
    if (isCorrect) {
      const newScore = drillScore + 1;
      const newStreak = drillStreak + 1;
      setDrillScore(newScore);
      setDrillStreak(newStreak);
      confetti({ particleCount: 25, spread: 45 });
      setDrillFeedback({
        isCorrect: true,
        message: `MashaAllah! Correct! That was ${drillTarget.letter.name} with ${guessedHarakah.toUpperCase()}. (+15 XP)`,
      });
      onUpdateProgress((p) => ({ ...p, xp: p.xp + 15 }));
    } else {
      setDrillStreak(0);
      setDrillFeedback({
        isCorrect: false,
        message: `Not quite! The correct vowel was ${drillTarget.harakah.toUpperCase()}. Listen again!`,
      });
    }

    // Pick new drill target after short delay
    setTimeout(() => {
      const randomLetter = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
      const harakahs: HarakahType[] = ['fatha', 'kasra', 'damma', 'sukun'];
      const randomHarakah = harakahs[Math.floor(Math.random() * harakahs.length)];
      setDrillTarget({ letter: randomLetter, harakah: randomHarakah });
      setDrillFeedback(null);
      handlePlayHarakah(randomLetter.id, randomHarakah);
    }, 1700);
  };

  // Quran Word Quiz Handlers
  const currentQuranQ = HARAKAT_QURAN_QUESTIONS[quranQuizIndex];
  const handleAnswerQuranQuiz = (optionIndex: number) => {
    if (quranQuizSelected !== null) return;
    setQuranQuizSelected(optionIndex);
    const isCorrect = currentQuranQ.options[optionIndex].isCorrect;
    setQuranQuizFeedback(isCorrect);
    if (isCorrect) {
      confetti({ particleCount: 35, spread: 55 });
      onUpdateProgress((p) => ({ ...p, xp: p.xp + 20 }));
    }
  };

  const handleNextQuranQuiz = () => {
    setQuranQuizSelected(null);
    setQuranQuizFeedback(null);
    if (quranQuizIndex < HARAKAT_QURAN_QUESTIONS.length - 1) {
      setQuranQuizIndex((i) => i + 1);
    } else {
      setQuranQuizIndex(0);
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  // Matching game handler
  const handleSelectSymbol = (sym: string) => {
    setSelectedMatchSymbol(sym);
    if (selectedMatchName) {
      checkMatch(sym, selectedMatchName);
    }
  };

  const handleSelectName = (name: string) => {
    setSelectedMatchName(name);
    if (selectedMatchSymbol) {
      checkMatch(selectedMatchSymbol, name);
    }
  };

  const checkMatch = (sym: string, name: string) => {
    const card = HARAKAT_FLASHCARDS.find((c) => c.symbol === sym && c.name === name);
    if (card) {
      setMatchedPairs((prev) => [...prev, card.id]);
      confetti({ particleCount: 20, spread: 40 });
      onUpdateProgress((p) => ({ ...p, xp: p.xp + 10 }));
    }
    setSelectedMatchSymbol(null);
    setSelectedMatchName(null);
  };

  const currentFlashcard = HARAKAT_FLASHCARDS[flashcardIndex];

  return (
    <div className="space-y-6">
      {/* Ground Zero Header & Hub Navigation */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ground Zero Arabic Hub • مركز تعليم اللغة العربية من الصفر</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-200">
            Qaida, Harakat & Makharij Masterclass (تعلّم من الصفر)
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-3xl leading-relaxed">
            Master the Arabic language from complete ground zero. Learn short vowels (Harakat), the 5 major articulation organs (Makharij), flippable flashcards, video lessons from Shaykhi Academy, connecting letter shapes, and the working <strong>Test with Harakat</strong> interactive exam!
          </p>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-3">
            {[
              { id: 'harakat' as QaidaSectionTab, label: 'Harakat Sound Studio', icon: Activity },
              { id: 'quiz' as QaidaSectionTab, label: 'Test with Harakat (Working Audio)', icon: Award },
              { id: 'flashcards' as QaidaSectionTab, label: 'Interactive Flashcards', icon: BookOpen },
              { id: 'letters' as QaidaSectionTab, label: '28 Letters & Makharij', icon: Layers },
              { id: 'makharij' as QaidaSectionTab, label: '5 Organs Anatomy Guide', icon: Info },
              { id: 'videos' as QaidaSectionTab, label: 'Ground Zero Videos (Shaykhi Academy)', icon: Video },
              { id: 'forms' as QaidaSectionTab, label: 'Letter Forms (Connecting)', icon: BookOpen },
              { id: 'matching' as QaidaSectionTab, label: 'Harakat Matching Game', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 border border-emerald-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: HARAKAT SOUND STUDIO (SHAYKHI ACADEMY GUIDE & SOUNDS) */}
      {activeTab === 'harakat' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Harakat Studio Card */}
            <div className="lg:col-span-7 bg-white dark:bg-emerald-950/80 rounded-3xl p-6 border-2 border-amber-400/80 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    Interactive Harakat Sound Studio
                  </span>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-amber-100">
                    Phonetic Short Vowels Engine
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold">
                  100% Working Audio
                </span>
              </div>

              {/* Letter Picker Grid */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
                  1. Select Arabic Letter:
                </span>
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {ARABIC_LETTERS.map((ltr) => (
                    <button
                      key={ltr.id}
                      onClick={() => setSelectedLetter(ltr)}
                      className={`w-11 h-11 rounded-xl text-lg font-quran font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                        selectedLetter.id === ltr.id
                          ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400'
                          : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {ltr.glyph}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Interactive Sound Stage Card */}
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 text-center space-y-4 shadow-inner relative overflow-hidden border border-emerald-800">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>Selected: {selectedLetter.name} ({selectedLetter.glyph})</span>
                  <span>Makhraj: {selectedLetter.makhraj}</span>
                </div>

                {/* Big Diacritic Glyph with Animated Waves */}
                <div className="py-4">
                  <div className="text-7xl sm:text-8xl font-quran font-black text-amber-200 my-2 select-text">
                    {harakatAudio.getArabicDiacriticText(selectedLetter.id, selectedHarakah)}
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-300 mt-2">
                    {harakatAudio.getPhoneticTranslit(selectedLetter.id, selectedHarakah)}
                  </div>
                  <div className="text-xs text-emerald-200 italic mt-1">
                    {HARAKAT_FLASHCARDS.find((h) => h.id === selectedHarakah)?.mouthPosture}
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => handlePlayHarakah(selectedLetter.id, selectedHarakah)}
                  disabled={isPlayingAudio}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-xl flex items-center justify-center space-x-2 mx-auto transition-transform active:scale-95 cursor-pointer"
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>
                    {isPlayingAudio ? 'Playing Harakah Sound...' : `Hear Sound (${harakatAudio.getPhoneticTranslit(selectedLetter.id, selectedHarakah)})`}
                  </span>
                </button>
              </div>

              {/* 4 Primary Harakat Quick-Comparison Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  2. Choose Harakah Vowel:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['fatha', 'kasra', 'damma', 'sukun'] as const).map((h) => {
                    const info = HARAKAT_FLASHCARDS.find((item) => item.id === h)!;
                    const glyphWithHarakah = harakatAudio.getArabicDiacriticText(selectedLetter.id, h);
                    const translit = harakatAudio.getPhoneticTranslit(selectedLetter.id, h);
                    const isSelected = selectedHarakah === h;

                    return (
                      <button
                        key={h}
                        onClick={() => {
                          setSelectedHarakah(h);
                          handlePlayHarakah(selectedLetter.id, h);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1 ${
                          isSelected
                            ? 'bg-amber-400 text-emerald-950 border-amber-500 shadow-md ring-2 ring-amber-400/40 font-bold'
                            : 'bg-emerald-50/60 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        <span className="text-3xl font-quran font-bold">{glyphWithHarakah}</span>
                        <span className="text-xs font-bold">{info.name}</span>
                        <span className="text-[10px] font-mono opacity-80">{translit}</span>
                        <span className="text-[9px] uppercase font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                          ▶ Tap to Hear
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tanween & Shaddah Options */}
              <div className="space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Advanced: Tanween & Shaddah:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['tanween_fath', 'tanween_damm', 'tanween_kasr', 'shaddah'] as const).map((h) => {
                    const info = HARAKAT_FLASHCARDS.find((item) => item.id === h)!;
                    const glyphWithHarakah = harakatAudio.getArabicDiacriticText(selectedLetter.id, h);
                    const isSelected = selectedHarakah === h;

                    return (
                      <button
                        key={h}
                        onClick={() => {
                          setSelectedHarakah(h);
                          handlePlayHarakah(selectedLetter.id, h);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-emerald-950 font-bold border-amber-500 shadow-xs'
                            : 'bg-emerald-50/40 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        <span className="text-2xl font-quran font-bold block">{glyphWithHarakah}</span>
                        <span className="text-[11px] font-semibold">{info.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Shaykhi Academy Harakat Educational Guide */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-emerald-950/80 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/80 shadow-md space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <h4 className="text-base font-bold text-emerald-950 dark:text-amber-100">
                    Shaykhi Academy Harakat Guide
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  In classical Arabic, letters alone are static bodies. The <strong>Harakat (الحركات)</strong> are the soul that gives them voice. According to the Shaykhi Academy guide:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 dark:text-amber-200">1. Fatḥah (فَتْحَة)</span>
                      <span className="font-arabic font-bold text-emerald-700 dark:text-amber-300">ـَ</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Literally means "an opening". Your mouth opens vertically without spreading your lips horizontally. Creates the pure /a/ vowel.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 dark:text-amber-200">2. Kasrah (كَسْرَة)</span>
                      <span className="font-arabic font-bold text-emerald-700 dark:text-amber-300">ـِ</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Literally means "a break / lowering". The lower jaw drops gently downward. Creates the clean /i/ vowel without becoming a sluggish /e/.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 dark:text-amber-200">3. Ḍammah (ضَمَّة)</span>
                      <span className="font-arabic font-bold text-emerald-700 dark:text-amber-300">ـُ</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Literally means "a gathering / joining". Both lips circle forward with a small central opening. Creates the deep /u/ vowel.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 dark:text-amber-200">4. Sukūn (سُكُون) & Qalqalah</span>
                      <span className="font-arabic font-bold text-emerald-700 dark:text-amber-300">ـْ</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      Signifies stillness (no vowel). When the 5 letters of <strong>Qutb Jad (ق ط ب ج د)</strong> have Sukūn, they produce an audible bouncing echo (Qalqalah)!
                    </p>
                  </div>
                </div>

                {/* Ground zero tip */}
                <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-900 dark:text-amber-200 text-xs">
                  <span className="font-bold block mb-1">💡 Brotherly Tip from YMB-AI:</span>
                  Try alternating <strong>{selectedLetter.glyph}َ</strong>, <strong>{selectedLetter.glyph}ِ</strong>, <strong>{selectedLetter.glyph}ُ</strong>, and <strong>{selectedLetter.glyph}ْ</strong> three times out loud to build natural muscle memory in your tongue and lips!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST WITH HARAKAT (WORKING INTERACTIVE EXAM & DRILLS) */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Sub-mode switcher */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800">
              <button
                onClick={() => setQuizSubMode('ear_drill')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  quizSubMode === 'ear_drill'
                    ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                    : 'text-emerald-800 dark:text-emerald-200 hover:text-emerald-950'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Mode 1: Audio Ear Drill (Listen & Identify)</span>
              </button>
              <button
                onClick={() => setQuizSubMode('quran_words')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  quizSubMode === 'quran_words'
                    ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                    : 'text-emerald-800 dark:text-emerald-200 hover:text-emerald-950'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mode 2: Quran Words Harakat Quiz</span>
              </button>
            </div>
          </div>

          {/* SUB-MODE 1: AUDIO EAR DRILL */}
          {quizSubMode === 'ear_drill' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-emerald-950/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl text-center space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>Working Harakat Ear Drill</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Streak: {drillStreak}</span>
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black">
                    Score: {drillScore}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-emerald-950 dark:text-amber-100">
                  Listen & Identify the Correct Harakah!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Click the big button below to hear the sound, then choose which Harakah was pronounced.
                </p>
              </div>

              {/* Big Audio Play Button */}
              <button
                onClick={handlePlayDrillSound}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-emerald-950 shadow-xl mx-auto flex items-center justify-center transition-transform active:scale-90 cursor-pointer ring-4 ring-amber-300/40"
                title="Click to Listen to the Harakah sound"
              >
                <Volume2 className="w-10 h-10 fill-emerald-950 animate-pulse" />
              </button>

              {/* Letter Reveal Preview */}
              <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Letter being tested: <span className="font-quran text-3xl text-amber-500 font-bold ml-1">{drillTarget.letter.glyph}</span> ({drillTarget.letter.name})
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {(['fatha', 'kasra', 'damma', 'sukun'] as const).map((h) => {
                  const glyph = harakatAudio.getArabicDiacriticText(drillTarget.letter.id, h);
                  const info = HARAKAT_FLASHCARDS.find((item) => item.id === h)!;

                  return (
                    <button
                      key={h}
                      onClick={() => handleAnswerDrill(h)}
                      className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-amber-400 bg-emerald-50/50 dark:bg-emerald-900/30 hover:bg-amber-50 dark:hover:bg-emerald-900/60 transition-all cursor-pointer flex flex-col items-center justify-center space-y-1"
                    >
                      <span className="text-4xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                        {glyph}
                      </span>
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                        {info.name} ({info.sound})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {drillFeedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-bold ${
                    drillFeedback.isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300'
                  }`}
                >
                  {drillFeedback.message}
                </div>
              )}
            </div>
          )}

          {/* SUB-MODE 2: QURAN WORDS HARAKAT QUIZ */}
          {quizSubMode === 'quran_words' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-emerald-950/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Question {quranQuizIndex + 1} of {HARAKAT_QURAN_QUESTIONS.length}
                </span>
                {currentQuranQ.audioSurahRef && (
                  <button
                    onClick={() => handlePlayQuranSample(currentQuranQ.audioSurahRef!)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 text-amber-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear Verse ({currentQuranQ.audioSurahRef})</span>
                  </button>
                )}
              </div>

              <div className="text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-quran font-black text-amber-600 dark:text-amber-300 py-2">
                  {currentQuranQ.wordSnippet}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100">
                  {currentQuranQ.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuranQ.options.map((opt, idx) => {
                  const isSelected = quranQuizSelected === idx;
                  let style = 'bg-emerald-50/60 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 hover:border-amber-400 text-emerald-950 dark:text-emerald-100';

                  if (quranQuizSelected !== null) {
                    if (opt.isCorrect) {
                      style = 'bg-emerald-600 text-white font-bold border-emerald-500';
                    } else if (isSelected) {
                      style = 'bg-rose-600 text-white border-rose-500';
                    } else {
                      style = 'opacity-40 border-emerald-200 dark:border-emerald-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuranQuiz(idx)}
                      disabled={quranQuizSelected !== null}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${style}`}
                    >
                      <span className="font-bold mr-2 text-amber-500">{String.fromCharCode(65 + idx)}.</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Next Button */}
              {quranQuizSelected !== null && (
                <div className="space-y-3 pt-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs ${
                      quranQuizFeedback
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 border border-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 border border-rose-300'
                    }`}
                  >
                    <span className="font-bold block mb-1">
                      {quranQuizFeedback ? '✅ Alhamdulillah! Correct (+20 XP)' : '❌ Review the rule:'}
                    </span>
                    {currentQuranQ.options[quranQuizSelected].explanation}
                  </div>

                  <button
                    onClick={handleNextQuranQuiz}
                    className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERACTIVE FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
            <span>Flashcard {flashcardIndex + 1} of {HARAKAT_FLASHCARDS.length}</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">Tap Card to Flip & View Shaykhi Guide</span>
          </div>

          {/* Flippable Flashcard */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="min-h-[340px] rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-amber-50/30 dark:from-emerald-950 dark:via-emerald-900/50 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:border-amber-400 select-none relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-400 text-emerald-950">
                {currentFlashcard.name} • {currentFlashcard.arabicName}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayHarakah(currentFlashcard.sampleLetterId, currentFlashcard.id);
                }}
                className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md cursor-pointer"
                title="Listen to Harakah Sound"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Front of Card */}
            {!isCardFlipped ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-8xl font-quran font-black text-amber-500 dark:text-amber-300 drop-shadow-sm">
                  {currentFlashcard.symbol}
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 dark:text-white">
                  {currentFlashcard.name}
                </h3>
                <p className="text-sm font-mono text-emerald-700 dark:text-emerald-300">
                  {currentFlashcard.sound}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 italic block">
                  (Tap card to reveal mouth posture, Shaykhi rule & Quran example)
                </span>
              </div>
            ) : (
              /* Back of Card */
              <div className="py-2 space-y-3 text-left">
                <div className="p-3 rounded-2xl bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-1">
                    Mouth & Jaw Posture:
                  </span>
                  <p className="text-xs text-emerald-900 dark:text-emerald-100 leading-relaxed font-medium">
                    {currentFlashcard.mouthPosture}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
                    Shaykhi Academy Rule:
                  </span>
                  <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                    {currentFlashcard.shaykhiRule}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Quranic Example Word:</span>
                    <div className="text-xl font-quran font-bold text-emerald-950 dark:text-amber-200">{currentFlashcard.sampleWordArabic}</div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">{currentFlashcard.sampleWordMeaning}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayHarakah(currentFlashcard.sampleLetterId, currentFlashcard.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-100 dark:border-emerald-800/60">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardFlipped(false);
                  setFlashcardIndex((i) => (i > 0 ? i - 1 : HARAKAT_FLASHCARDS.length - 1));
                }}
                className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs font-bold flex items-center space-x-1 hover:bg-emerald-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardFlipped(false);
                  setFlashcardIndex((i) => (i < HARAKAT_FLASHCARDS.length - 1 ? i + 1 : 0));
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Next Harakah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 28 LETTERS & MAKHARJ EXPLORER */}
      {activeTab === 'letters' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Makhraj Organ:</span>
              </span>
              {(['all', 'throat', 'tongue', 'lips', 'nasal', 'chest_empty_space'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setMakhrajFilter(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    makhrajFilter === loc
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {loc.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={handleToggleFullAlphabet}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                isPlayingFullAlphabet
                  ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-800 text-amber-200 hover:bg-emerald-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingFullAlphabet ? 'Playing Full Alphabet...' : 'Recite All 28 Letters'}</span>
            </button>
          </div>

          {/* Letter Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {filteredLetters.map((letter) => {
              const isMastered = progress.masteredLetterIds.includes(letter.id);
              const isSelected = selectedLetter.id === letter.id;

              return (
                <button
                  key={letter.id}
                  onClick={() => {
                    setSelectedLetter(letter);
                    handlePronounceLetter(letter.id);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-emerald-900/60 shadow-md ring-2 ring-amber-400/40'
                      : 'border-emerald-100 dark:border-emerald-800/60 bg-white dark:bg-emerald-950/70 hover:border-emerald-300'
                  }`}
                >
                  {isMastered && (
                    <span className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}

                  <div className="text-4xl font-quran font-bold text-emerald-950 dark:text-amber-100 my-1">
                    {letter.glyph}
                  </div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                    {letter.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {letter.makhraj}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Letter Spotlight Card */}
          <div className="bg-white dark:bg-emerald-950/80 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/80 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center bg-emerald-50 dark:bg-emerald-900/40 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <div className="text-7xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                {selectedLetter.glyph}
              </div>
              <h3 className="text-xl font-bold text-emerald-950 dark:text-white mt-2">
                {selectedLetter.name} ({selectedLetter.arabicName})
              </h3>
              <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                Phonetic sound: {selectedLetter.transliteration}
              </p>
              <button
                onClick={() => handlePronounceLetter(selectedLetter.id)}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center space-x-1.5 mx-auto transition-transform active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Letter Pronunciation</span>
              </button>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  Makhraj Point (مخرج الحرف):
                </span>
                <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">
                  {selectedLetter.makhrajDescription}
                </p>
              </div>

              {/* Quran Example Context */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                    Quranic Sample Word:
                  </span>
                  <div className="text-lg font-quran font-bold text-emerald-950 dark:text-amber-200">
                    {selectedLetter.sampleWord.arabic} ({selectedLetter.sampleWord.english})
                  </div>
                  {selectedLetter.sampleWord.ayahRef && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {selectedLetter.sampleWord.ayahRef}
                    </span>
                  )}
                </div>

                {selectedLetter.sampleWord.ayahRef && (
                  <button
                    onClick={() => handlePlayQuranSample(selectedLetter.sampleWord.ayahRef!)}
                    className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Recite Verse</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => handleToggleMastered(selectedLetter.id)}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  progress.masteredLetterIds.includes(selectedLetter.id)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {progress.masteredLetterIds.includes(selectedLetter.id)
                    ? 'Mastered by Thoufeek'
                    : 'Mark Letter as Mastered (+25 XP)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 5 ORGANS MAKHARJ ANATOMY GUIDE */}
      {activeTab === 'makharij' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-emerald-950/80 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800 shadow-md space-y-4">
            <h3 className="text-xl font-bold text-emerald-950 dark:text-amber-200 flex items-center space-x-2">
              <Info className="w-5 h-5 text-amber-500" />
              <span>The 5 Major Articulation Organs (المخارج العامة الخمسة)</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
              Every sound in the Holy Quran is produced by directing breath through one of 5 major anatomical areas. Understanding these physical points is the secret to authentic classical recitation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 dark:text-amber-200">1. Al-Jawf (الجَوْف - The Oral Cavity)</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">3 Letters</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  The open empty space of the throat and mouth. Produces the 3 prolonged Madd letters: Alif (ا), Waaw (و), and Yaa (ي) with natural elongation.
                </p>
                <div className="flex space-x-2 pt-1 font-quran text-lg font-bold text-emerald-900 dark:text-white">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">ا</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">و</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">ي</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 dark:text-amber-200">2. Al-Halq (الحَلْق - The Throat)</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">6 Letters</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Divided into 3 sections: Bottom/Deep (ء , ه), Middle (ع , ح), and Top/Upper nearest the mouth (غ , خ).
                </p>
                <div className="flex space-x-2 pt-1 font-quran text-lg font-bold text-emerald-900 dark:text-white">
                  {['ء', 'ه', 'ع', 'ح', 'غ', 'خ'].map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">{l}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 dark:text-amber-200">3. Al-Lisaan (اللِّسَان - The Tongue)</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">18 Letters</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  The primary organ responsible for the majority of Arabic letters: Root (ق, ك), Middle (ج, ش, ي), Sides (ض, ل), and Tip (ن, ر, ط, د, ت, ص, ز, س, ظ, ذ, ث).
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 font-quran text-base font-bold text-emerald-900 dark:text-white">
                  {['ق', 'ك', 'ج', 'ش', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'].map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">{l}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 dark:text-amber-200">4. Ash-Shafataan (الشَّفَتَان - The Two Lips)</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">4 Letters</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Produced by contact of the lips (ب , م), rounding without touching (و), or the upper teeth against the wet bottom lip (ف).
                </p>
                <div className="flex space-x-2 pt-1 font-quran text-lg font-bold text-emerald-900 dark:text-white">
                  {['ف', 'ب', 'م', 'و'].map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-800">{l}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 dark:text-amber-200">5. Al-Khayshoom (الخَيْشُوم - The Nasal Cavity)</h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Ghunnah Resonance</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  The nasal opening deep in the nose. Produces the melodious <strong>Ghunnah (غُنَّة)</strong> resonance that accompanies Noon (ن) and Meem (م) during Idgham and Ikhfa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GROUND ZERO VIDEOS (SHAYKHI ACADEMY & BAYYINAH) */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Active video embedded player if chosen */}
          {activeVideoEmbed && (
            <div className="bg-black rounded-3xl overflow-hidden p-4 border-2 border-amber-400 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-white text-xs px-2">
                <span className="font-bold text-amber-300">Now Playing Tutorial:</span>
                <button
                  onClick={() => setActiveVideoEmbed(null)}
                  className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Close Video Player
                </button>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoEmbed}?autoplay=1`}
                  title="Arabic Tutorial"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROUND_ZERO_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                className="bg-white dark:bg-emerald-950/80 rounded-3xl p-5 border border-emerald-100 dark:border-emerald-800 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                      {vid.source}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      ⏱ {vid.duration}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-emerald-950 dark:text-amber-200">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {vid.description}
                  </p>

                  {/* Key Takeaways */}
                  <div className="space-y-1.5 pt-2 border-t border-emerald-100 dark:border-emerald-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      What you will learn:
                    </span>
                    {vid.keyTakeaways.map((point, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setActiveVideoEmbed(vid.youtubeId)}
                    className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-950" />
                    <span>Watch in App</span>
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.title + ' ' + vid.source)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LETTER FORMS (CONNECTING IN WORDS) */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-emerald-950/80 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800 shadow-md space-y-4">
            <div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-amber-200">
                Arabic Letter Positions: 4 Shapes of Every Letter
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                Arabic is written in cursive script from right to left. Each letter modifies its tail based on whether it appears alone, at the beginning, in the middle, or at the end of a word.
              </p>
            </div>

            {/* Non-connector highlight */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-1">⚠️ The 6 "Friendly" Non-Connecting Letters:</span>
              <div className="flex space-x-3 my-1 font-quran text-xl font-bold text-amber-600 dark:text-amber-300" dir="rtl">
                <span>ا</span>
                <span>د</span>
                <span>ذ</span>
                <span>ر</span>
                <span>ز</span>
                <span>و</span>
              </div>
              These 6 letters connect to the letter BEFORE them, but NEVER to the letter AFTER them!
            </div>

            {/* Forms Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2 text-left">Letter</th>
                    <th className="py-2.5 px-2">Isolated (منفصل)</th>
                    <th className="py-2.5 px-2">Initial (أول الكلمة)</th>
                    <th className="py-2.5 px-2">Medial (وسط الكلمة)</th>
                    <th className="py-2.5 px-2">Final (آخر الكلمة)</th>
                    <th className="py-2.5 px-2">Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 dark:divide-emerald-900/60 font-quran text-xl">
                  {ARABIC_LETTERS.slice(0, 14).map((l) => (
                    <tr key={l.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20">
                      <td className="py-3 px-2 font-sans text-xs text-left font-bold text-emerald-900 dark:text-emerald-100">
                        {l.name}
                      </td>
                      <td className="py-3 px-2 text-emerald-950 dark:text-amber-200">{l.forms.isolated}</td>
                      <td className="py-3 px-2 text-emerald-950 dark:text-amber-200">{l.forms.initial}ـ</td>
                      <td className="py-3 px-2 text-emerald-950 dark:text-amber-200">ـ{l.forms.medial}ـ</td>
                      <td className="py-3 px-2 text-emerald-950 dark:text-amber-200">ـ{l.forms.final}</td>
                      <td className="py-3 px-2 font-sans">
                        <button
                          onClick={() => handlePronounceLetter(l.id)}
                          className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-amber-300 hover:bg-amber-400 hover:text-emerald-950 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: HARAKAT MATCHING GAME */}
      {activeTab === 'matching' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-emerald-950/80 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Interactive Matching Game
            </span>
            <h3 className="text-xl font-black text-emerald-950 dark:text-amber-100">
              Match the Harakah Symbol to its Classical Name!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Click a symbol on the left, then click its corresponding name on the right.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Symbols */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Diacritic Symbols:</span>
              {HARAKAT_FLASHCARDS.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedMatchSymbol === item.symbol;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectSymbol(item.symbol)}
                    className={`w-full p-3 rounded-2xl border text-center transition-all cursor-pointer font-quran text-3xl ${
                      isMatched
                        ? 'bg-emerald-600 text-white border-emerald-600 opacity-60'
                        : isSelected
                        ? 'bg-amber-400 text-emerald-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                        : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-950 dark:text-amber-200 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {item.symbol}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Names */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Vowel Names:</span>
              {HARAKAT_FLASHCARDS.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedMatchName === item.name;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectName(item.name)}
                    className={`w-full p-3 rounded-2xl border text-center transition-all cursor-pointer text-xs font-bold ${
                      isMatched
                        ? 'bg-emerald-600 text-white border-emerald-600 opacity-60'
                        : isSelected
                        ? 'bg-amber-400 text-emerald-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                        : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {item.name} ({item.sound})
                  </button>
                );
              })}
            </div>
          </div>

          {matchedPairs.length === HARAKAT_FLASHCARDS.length && (
            <div className="text-center p-4 bg-emerald-100 dark:bg-emerald-900/60 rounded-2xl border border-emerald-400 text-emerald-950 dark:text-emerald-100 font-bold space-y-2">
              <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
              <p>MashaAllah Thoufeek! You matched all Harakat symbols perfectly! (+80 XP)</p>
              <button
                onClick={() => setMatchedPairs([])}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
