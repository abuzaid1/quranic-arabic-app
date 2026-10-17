import React, { useState, useMemo } from 'react';
import {
  Volume2,
  BookMarked,
  RotateCcw,
  Check,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  CheckCircle,
  Bookmark,
  Calendar,
  Layers,
  Heart,
  BookOpen,
} from 'lucide-react';
import { QuranWord, WordCategory, UserProgress } from '../types/index';
import { QURAN_VOCABULARY } from '../data/quranVocabulary';
import { quranAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

interface Vocab80ViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onSelectRoot?: (root: string) => void;
}

export const Vocab80View: React.FC<Vocab80ViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectRoot,
}) => {
  const [viewMode, setViewMode] = useState<'flashcards' | 'memorization' | 'grid'>('flashcards');
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all' | 'saved_memorization'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [dailyWordOffset, setDailyWordOffset] = useState<number>(0);

  // Daily Word from Quran (Rotates naturally based on day of year + manual offset)
  const dailyWordIndex = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = (dayOfYear + dailyWordOffset) % QURAN_VOCABULARY.length;
    return index < 0 ? QURAN_VOCABULARY.length + index : index;
  }, [dailyWordOffset]);

  const dailyWord = QURAN_VOCABULARY[dailyWordIndex] || QURAN_VOCABULARY[0];

  const savedWordIds = progress.savedForMemorizationIds || [];

  // Filter words
  const filteredWords = QURAN_VOCABULARY.filter((w) => {
    if (selectedCategory === 'saved_memorization') {
      if (!savedWordIds.includes(w.id)) return false;
    } else if (selectedCategory !== 'all' && w.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchArabic = w.arabic.includes(searchQuery);
      const matchEnglish = w.english.toLowerCase().includes(q);
      const matchTrans = w.transliteration.toLowerCase().includes(q);
      const matchRoot = w.root.includes(searchQuery);
      return matchArabic || matchEnglish || matchTrans || matchRoot;
    }
    return true;
  });

  const [activePlayingRef, setActivePlayingRef] = useState<string | null>(null);

  const currentCard = filteredWords[cardIndex] || filteredWords[0];

  const handlePlayContextAyah = (surah: string, ayahNumber: number) => {
    const ref = `${surah} ${ayahNumber}`;
    if (activePlayingRef === ref && quranAudio.isPlaying()) {
      quranAudio.stop();
      setActivePlayingRef(null);
      return;
    }
    setActivePlayingRef(ref);
    quranAudio.playQuranReference(
      ref,
      progress.selectedReciter,
      () => setActivePlayingRef(null),
      () => setActivePlayingRef(null)
    );
  };

  const handlePronounce = (word: QuranWord) => {
    handlePlayContextAyah(word.exampleAyah.surah, word.exampleAyah.ayahNumber);
  };

  const handleToggleMastered = (wordId: string) => {
    onUpdateProgress((prev) => {
      const isMastered = prev.masteredWordIds.includes(wordId);
      const updated = isMastered
        ? prev.masteredWordIds.filter((id) => id !== wordId)
        : [...prev.masteredWordIds, wordId];
      const xpGain = !isMastered ? 15 : 0;

      if (!isMastered) {
        confetti({ particleCount: 25, spread: 45 });
      }

      return {
        ...prev,
        masteredWordIds: updated,
        xp: prev.xp + xpGain,
      };
    });
  };

  // Toggle Save for Memorization
  const handleToggleSaveForMemorization = (wordId: string) => {
    onUpdateProgress((prev) => {
      const currentSaved = prev.savedForMemorizationIds || [];
      const exists = currentSaved.includes(wordId);
      const updated = exists
        ? currentSaved.filter((id) => id !== wordId)
        : [...currentSaved, wordId];

      if (!exists) {
        confetti({ particleCount: 20, spread: 40 });
      }

      return {
        ...prev,
        savedForMemorizationIds: updated,
        favoriteWordIds: exists
          ? prev.favoriteWordIds.filter((id) => id !== wordId)
          : [...new Set([...prev.favoriteWordIds, wordId])],
        xp: !exists ? prev.xp + 10 : prev.xp,
      };
    });
  };

  const handleSRSNext = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (rating === 'good' || rating === 'easy') {
      if (currentCard && !progress.masteredWordIds.includes(currentCard.id)) {
        handleToggleMastered(currentCard.id);
      }
    }
    setIsFlipped(false);
    if (cardIndex < filteredWords.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  const isDailyWordSaved = savedWordIds.includes(dailyWord.id);
  const isCurrentCardSaved = currentCard && savedWordIds.includes(currentCard.id);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 dark:text-amber-100 flex items-center space-x-2">
            <span>The 80% Quranic Vocabulary Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
              {progress.masteredWordIds.length} Mastered
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold flex items-center space-x-1">
              <Bookmark className="w-3 h-3 fill-current" />
              <span>{savedWordIds.length} for Memorization</span>
            </span>
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Proven linguistic method: mastering these high-frequency words unlocks comprehension for over 80% of the Holy Quran!
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-900/40 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'flashcards'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            SRS Flashcards
          </button>

          <button
            onClick={() => {
              setViewMode('memorization');
              setSelectedCategory('saved_memorization');
              setCardIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
              viewMode === 'memorization'
                ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm ring-2 ring-amber-300'
                : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Memorization Vault ({savedWordIds.length})</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Library ({QURAN_VOCABULARY.length})
          </button>
        </div>
      </div>

      {/* FEATURE: DAILY WORD FROM QURAN BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border-2 border-amber-400/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Word from the Quran</span>
              </span>
              <span className="text-xs text-amber-200 font-semibold">
                Frequency: {dailyWord.frequency.toLocaleString()}x in Quran
              </span>
              {dailyWord.root && dailyWord.root !== '-' && (
                <button
                  onClick={() => onSelectRoot && onSelectRoot(dailyWord.root)}
                  className="px-2 py-0.5 rounded-md bg-emerald-800/80 text-amber-300 text-xs font-arabic font-bold hover:bg-emerald-700 cursor-pointer"
                  title="Explore this root in Root Explorer"
                >
                  Root: {dailyWord.root} ↗
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-4xl sm:text-5xl font-quran font-black text-amber-300 select-text">
                {dailyWord.arabic}
              </h3>
              <span className="text-sm sm:text-base font-mono text-emerald-300 font-semibold">
                ({dailyWord.transliteration})
              </span>
              <span className="text-sm sm:text-base text-white font-bold">
                — {dailyWord.english}
              </span>
            </div>

            {/* Context Ayah */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 text-xs space-y-1.5">
              <div className="text-right font-quran text-base sm:text-lg text-amber-100 leading-relaxed" dir="rtl">
                {dailyWord.exampleAyah.arabic}
              </div>
              <div className="flex items-center justify-between text-emerald-300 pt-1">
                <span className="italic line-clamp-1">"{dailyWord.exampleAyah.english}"</span>
                <span className="font-semibold text-amber-300 shrink-0 ml-2">
                  {dailyWord.exampleAyah.surah} {dailyWord.exampleAyah.ayahNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons on Daily Word */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => handlePlayContextAyah(dailyWord.exampleAyah.surah, dailyWord.exampleAyah.ayahNumber)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activePlayingRef === `${dailyWord.exampleAyah.surah} ${dailyWord.exampleAyah.ayahNumber}` && quranAudio.isPlaying()
                  ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-amber-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {activePlayingRef === `${dailyWord.exampleAyah.surah} ${dailyWord.exampleAyah.ayahNumber}` && quranAudio.isPlaying()
                  ? 'Reciting Ayah...'
                  : 'Recite Context Verse'}
              </span>
            </button>

            <button
              onClick={() => handleToggleSaveForMemorization(dailyWord.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isDailyWordSaved
                  ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-700/80 hover:bg-emerald-600/80 text-white border border-emerald-500/60'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isDailyWordSaved ? 'fill-current' : ''}`} />
              <span>{isDailyWordSaved ? 'Saved for Memorization ✓' : 'Save for Memorization (+10 XP)'}</span>
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setDailyWordOffset((o) => o - 1)}
                className="text-[11px] text-emerald-300 hover:text-white underline cursor-pointer"
              >
                ← Prev Day
              </button>
              <button
                onClick={() => setDailyWordOffset((o) => o + 1)}
                className="text-[11px] text-emerald-300 hover:text-white underline cursor-pointer"
              >
                Next Day →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Words' },
            { id: 'saved_memorization', label: `★ Saved for Memorization (${savedWordIds.length})` },
            { id: 'preposition', label: 'Prepositions' },
            { id: 'pronoun', label: 'Pronouns' },
            { id: 'verb', label: 'Verbs' },
            { id: 'noun', label: 'Nouns' },
            { id: 'divine_name', label: 'Divine Names' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-amber-300 font-semibold ring-2 ring-emerald-600'
                  : 'bg-white dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search word, meaning, root..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-white placeholder-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {viewMode === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {currentCard ? (
            <div>
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 pb-2">
                <span>Card {cardIndex + 1} of {filteredWords.length}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-300">
                  {currentCard.frequency.toLocaleString()} Occurrences in Quran
                </span>
              </div>

              {/* The Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[300px] sm:min-h-[320px] rounded-3xl bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/20 dark:from-emerald-950 dark:via-emerald-900/50 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:border-amber-400 select-none relative"
              >
                {/* Top Badge on Card */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                    {currentCard.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Save for Memorization Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSaveForMemorization(currentCard.id);
                      }}
                      className={`p-2 rounded-full transition-all cursor-pointer flex items-center space-x-1 text-xs font-bold ${
                        isCurrentCardSaved
                          ? 'bg-amber-400 text-emerald-950 shadow-sm ring-2 ring-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-amber-300 hover:text-emerald-950'
                      }`}
                      title={isCurrentCardSaved ? 'Saved for Memorization' : 'Save for Memorization'}
                    >
                      <Bookmark className={`w-4 h-4 ${isCurrentCardSaved ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline text-[10px]">
                        {isCurrentCardSaved ? 'Saved' : 'Save for Memory'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(currentCard);
                      }}
                      className="p-2 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-sm cursor-pointer"
                      title="Hear context verse recited by real Qari"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="text-center py-6">
                  {!isFlipped ? (
                    /* Front side */
                    <div className="space-y-3">
                      <div className="text-6xl sm:text-7xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                        {currentCard.arabic}
                      </div>
                      <div className="text-sm font-mono text-emerald-600 dark:text-emerald-300">
                        {currentCard.transliteration}
                      </div>
                      {currentCard.root && currentCard.root !== '-' && (
                        <div className="text-xs text-amber-600 dark:text-amber-300 font-semibold font-arabic">
                          Root: {currentCard.root}
                        </div>
                      )}
                      <span className="text-xs text-emerald-500 italic block pt-2">
                        Click card to flip and reveal Quranic meaning & context verse
                      </span>
                    </div>
                  ) : (
                    /* Back side */
                    <div className="space-y-3">
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-white">
                        {currentCard.english}
                      </div>
                      <div className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center justify-center space-x-2">
                        <span className="font-quran font-bold text-2xl text-emerald-950 dark:text-amber-200">
                          {currentCard.arabic}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                          {currentCard.transliteration}
                        </span>
                      </div>

                      {/* Quran Example Context with Real Qari Audio */}
                      <div className="mt-4 p-4 rounded-2xl bg-emerald-900/40 text-emerald-100 border border-emerald-800 space-y-2">
                        <div className="text-right font-quran text-lg leading-relaxed" dir="rtl">
                          {currentCard.exampleAyah.arabic}
                        </div>
                        <p className="text-xs text-emerald-300 italic text-left">
                          "{currentCard.exampleAyah.english}"
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-emerald-800/60">
                          <span className="text-[11px] font-semibold text-amber-300">
                            {currentCard.exampleAyah.surah} {currentCard.exampleAyah.ayahNumber}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayContextAyah(currentCard.exampleAyah.surah, currentCard.exampleAyah.ayahNumber);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                              activePlayingRef === `${currentCard.exampleAyah.surah} ${currentCard.exampleAyah.ayahNumber}` && quranAudio.isPlaying()
                                ? 'bg-amber-400 text-emerald-950 shadow-md ring-2 ring-amber-400'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-amber-200'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>
                              {activePlayingRef === `${currentCard.exampleAyah.surah} ${currentCard.exampleAyah.ayahNumber}` && quranAudio.isPlaying()
                                ? 'Reciting...'
                                : 'Recite Ayah (Real Qari)'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flip Indicator */}
                <div className="text-center text-[11px] text-emerald-600 dark:text-emerald-400">
                  {isFlipped ? 'Tap to flip back' : 'Tap to reveal translation'}
                </div>
              </div>

              {/* Spaced Repetition Rating Buttons */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleSRSNext('again')}
                  className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                >
                  Again (1d)
                </button>
                <button
                  onClick={() => handleSRSNext('hard')}
                  className="py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                >
                  Hard (2d)
                </button>
                <button
                  onClick={() => handleSRSNext('good')}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Good (4d)
                </button>
                <button
                  onClick={() => handleSRSNext('easy')}
                  className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Easy (7d)
                </button>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex(Math.max(0, cardIndex - 1));
                  }}
                  disabled={cardIndex === 0}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex(Math.min(filteredWords.length - 1, cardIndex + 1));
                  }}
                  disabled={cardIndex === filteredWords.length - 1}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 disabled:opacity-30 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-emerald-600 dark:text-emerald-400 text-sm">
              No vocabulary words match your search or filter.
            </div>
          )}
        </div>
      )}

      {/* MEMORIZATION VAULT MODE */}
      {viewMode === 'memorization' && (
        <div className="space-y-6">
          <div className="bg-amber-400/10 dark:bg-amber-400/5 rounded-3xl p-6 border-2 border-amber-400/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-400 text-emerald-950 inline-block mb-1">
                Thoufeek's Memorization Vault (قائمة الحفظ)
              </span>
              <h3 className="text-xl font-bold text-emerald-950 dark:text-amber-100">
                You have {savedWordIds.length} Quranic words saved for active memorization
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Review these sacred words regularly with spaced repetition until they become second nature during your recitation and Salah.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('saved_memorization');
                  setViewMode('flashcards');
                  setCardIndex(0);
                }}
                disabled={savedWordIds.length === 0}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-40"
              >
                <Layers className="w-4 h-4" />
                <span>Drill Saved Flashcards</span>
              </button>
            </div>
          </div>

          {savedWordIds.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-emerald-950/40 rounded-3xl border border-emerald-100 dark:border-emerald-800/60 p-6 space-y-3">
              <Bookmark className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950 dark:text-white">
                No words saved for memorization yet!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Browse through the 80% Vocabulary Library or Daily Quran Word and tap the <strong>"Save for Memorization"</strong> button on any word to add it here.
              </p>
              <button
                onClick={() => setViewMode('grid')}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Browse All Words
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {QURAN_VOCABULARY.filter((w) => savedWordIds.includes(w.id)).map((word) => {
                const isMastered = progress.masteredWordIds.includes(word.id);

                return (
                  <div
                    key={word.id}
                    className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border-2 border-amber-400/60 shadow-md flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                          {word.category.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleToggleSaveForMemorization(word.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <div>
                          <div className="text-3xl font-quran font-black text-amber-600 dark:text-amber-200">
                            {word.arabic}
                          </div>
                          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                            {word.transliteration}
                          </div>
                        </div>

                        <button
                          onClick={() => handlePronounce(word)}
                          className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-xs cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-emerald-950 dark:text-white mt-1">
                        {word.english}
                      </p>

                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-xs mt-2 border border-emerald-100 dark:border-emerald-800/60">
                        <span className="font-arabic font-semibold block">{word.exampleAyah.arabic}</span>
                        <span className="text-[10px] italic text-emerald-600 dark:text-emerald-400">{word.exampleAyah.surah} {word.exampleAyah.ayahNumber}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleMastered(word.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Memorized by Thoufeek ✓' : 'Mark as Memorized (+15 XP)'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GRID / LIBRARY MODE */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => {
            const isMastered = progress.masteredWordIds.includes(word.id);
            const isSaved = savedWordIds.includes(word.id);

            return (
              <div
                key={word.id}
                className={`bg-white dark:bg-emerald-950/70 rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                  isMastered
                    ? 'border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/30'
                    : isSaved
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                      {word.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                        {word.frequency.toLocaleString()}x in Quran
                      </span>
                      <button
                        onClick={() => handleToggleSaveForMemorization(word.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-amber-400 text-emerald-950'
                            : 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-800'
                        }`}
                        title={isSaved ? 'Saved for Memorization' : 'Save for Memorization'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <div>
                      <div className="text-3xl font-quran font-bold text-emerald-950 dark:text-amber-100">
                        {word.arabic}
                      </div>
                      <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                        {word.transliteration}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePronounce(word)}
                      className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-colors shadow-xs cursor-pointer"
                      title="Hear Quranic context verse recited by real Qari"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mt-2">
                    {word.english}
                  </p>

                  {word.root && word.root !== '-' && (
                    <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      Root:{' '}
                      <button
                        onClick={() => onSelectRoot && onSelectRoot(word.root)}
                        className="font-arabic font-bold text-amber-600 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        {word.root}
                      </button>
                    </div>
                  )}

                  {/* Context snippet with real Qari recitation */}
                  <div className="mt-3 pt-2 border-t border-emerald-100 dark:border-emerald-800/40 text-[11px] text-emerald-700 dark:text-emerald-300/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-arabic font-semibold truncate block">{word.exampleAyah.arabic}</span>
                      <span className="block text-[10px] italic mt-0.5">{word.exampleAyah.surah} {word.exampleAyah.ayahNumber}</span>
                    </div>
                    <button
                      onClick={() => handlePlayContextAyah(word.exampleAyah.surah, word.exampleAyah.ayahNumber)}
                      className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-amber-300 hover:bg-amber-400 hover:text-emerald-950 transition-colors cursor-pointer shrink-0"
                      title="Recite context Ayah with real Qari"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mark as Mastered button */}
                <button
                  onClick={() => handleToggleMastered(word.id)}
                  className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                    isMastered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isMastered ? 'Mastered by Thoufeek' : 'Mark as Mastered (+15 XP)'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
