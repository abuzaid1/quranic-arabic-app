import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BookMarked,
  Info,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { AyahData, WordAnalysis, UserProgress } from '../types/index';
import { QURAN_VERSES, SURAH_LIST, SurahMeta } from '../data/quranVerses';
import { quranAudio, QURAN_RECITERS } from '../utils/audioPlayer';

interface QuranReaderViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onSelectRoot?: (root: string) => void;
}

export const QuranReaderView: React.FC<QuranReaderViewProps> = ({
  progress,
  onUpdateProgress,
  onSelectRoot,
}) => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null);
  const [selectedAyahIndex, setSelectedAyahIndex] = useState<number>(0);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Filter ayahs for the selected surah
  const surahAyahs = QURAN_VERSES.filter((a) => a.surahNumber === selectedSurahNumber);
  const currentSurah = SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[0];

  const currentReciter =
    QURAN_RECITERS.find((r) => r.id === progress.selectedReciter) || QURAN_RECITERS[0];

  // Set default selected word on initial load or surah change
  useEffect(() => {
    if (surahAyahs.length > 0 && surahAyahs[0].words.length > 0) {
      setSelectedWord(surahAyahs[0].words[0]);
      setSelectedAyahIndex(0);
    }
    // Stop audio if surah changes
    quranAudio.stop();
    setPlayingAyahNumber(null);
    setActiveWordIndex(null);
  }, [selectedSurahNumber]);

  // Handle Ayah playback with real Qari and auto-advance
  const handleTogglePlayAyah = (ayah: AyahData) => {
    if (playingAyahNumber === ayah.ayahNumber) {
      quranAudio.stop();
      setPlayingAyahNumber(null);
      setActiveWordIndex(null);
    } else {
      setPlayingAyahNumber(ayah.ayahNumber);
      quranAudio.playAyah(
        ayah.surahNumber,
        ayah.ayahNumber,
        progress.selectedReciter || 'Alafasy_128kbps',
        () => {
          if (isLooping) {
            handleTogglePlayAyah(ayah);
          } else if (autoAdvance) {
            const currentIdx = surahAyahs.findIndex((a) => a.ayahNumber === ayah.ayahNumber);
            if (currentIdx >= 0 && currentIdx < surahAyahs.length - 1) {
              const nextAyah = surahAyahs[currentIdx + 1];
              handleTogglePlayAyah(nextAyah);
            } else {
              setPlayingAyahNumber(null);
              setActiveWordIndex(null);
            }
          } else {
            setPlayingAyahNumber(null);
            setActiveWordIndex(null);
          }
        },
        (err) => {
          console.warn('Real Ayah recitation audio error:', err);
          setPlayingAyahNumber(null);
        }
      );
    }
  };

  const handlePronounceWord = (word: WordAnalysis) => {
    const currentAyah = surahAyahs[selectedAyahIndex] || surahAyahs[0];
    quranAudio.playWord(currentAyah.surahNumber, currentAyah.ayahNumber, word.wordIndex);
  };

  const handleToggleFavoriteWord = (wordId: string) => {
    onUpdateProgress((prev) => {
      const exists = prev.favoriteWordIds.includes(wordId);
      const updated = exists
        ? prev.favoriteWordIds.filter((id) => id !== wordId)
        : [...prev.favoriteWordIds, wordId];
      return { ...prev, favoriteWordIds: updated };
    });
  };

  return (
    <div className="space-y-6">
      {/* Surah Selector & Display Preferences Bar */}
      <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-100 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
            Surah:
          </span>
          {SURAH_LIST.map((surah) => (
            <button
              key={surah.number}
              onClick={() => setSelectedSurahNumber(surah.number)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSurahNumber === surah.number
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/30'
                  : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/70'
              }`}
            >
              <span className="font-arabic font-bold mr-1.5">{surah.nameArabic}</span>
              <span>{surah.nameEnglish.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Reciter & View toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 self-end md:self-auto">
          {/* Reciter Selector */}
          <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-900/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={progress.selectedReciter}
              onChange={(e) => {
                const newReciter = e.target.value;
                onUpdateProgress((prev) => ({ ...prev, selectedReciter: newReciter }));
                quranAudio.setReciter(newReciter);
              }}
              className="bg-transparent text-xs font-semibold text-emerald-950 dark:text-amber-200 focus:outline-hidden cursor-pointer"
            >
              {QURAN_RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="bg-emerald-950 text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Advance Toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <span className="font-semibold text-amber-700 dark:text-amber-300">Auto-Next</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTransliteration}
              onChange={(e) => setShowTransliteration(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Transliteration</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Translation</span>
          </label>
        </div>
      </div>

      {/* Main Content Layout: Quran Verses (Left) + Morphology Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quran Verses & Word Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Surah Header Card */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 text-white p-6 shadow-md text-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Surah #{currentSurah.number} • {currentSurah.revelationType} Revelation
              </span>
              <h2 className="text-3xl font-quran font-bold my-2 text-amber-100">
                سُورَةُ {currentSurah.nameArabic}
              </h2>
              <p className="text-emerald-200 text-sm font-medium">
                {currentSurah.nameEnglish} • {surahAyahs.length} Verses loaded with word-by-word I'rab
              </p>
            </div>
          </div>

          {/* Verses List */}
          <div className="space-y-6">
            {surahAyahs.map((ayah, aIdx) => {
              const isPlaying = playingAyahNumber === ayah.ayahNumber;

              return (
                <div
                  key={ayah.ayahNumber}
                  className={`bg-white dark:bg-emerald-950/70 rounded-2xl p-5 sm:p-6 border transition-all shadow-sm ${
                    isPlaying
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                      : 'border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                  }`}
                >
                  {/* Ayah Header with Audio & Reciter controls */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-emerald-100 dark:border-emerald-900/60">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center font-serif">
                        {ayah.ayahNumber}
                      </div>
                      <span className="text-xs text-emerald-700 dark:text-emerald-300/80 font-medium">
                        Ayah {ayah.surahNumber}:{ayah.ayahNumber}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePlayAyah(ayah)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-400 text-emerald-950 shadow-sm'
                            : 'bg-emerald-100 dark:bg-emerald-800/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200'
                        }`}
                        title="Play recitation by Mishary Alafasy"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isPlaying ? 'Pause' : 'Recite'}</span>
                      </button>

                      <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isLooping
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                            : 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                        }`}
                        title="Loop this verse for memorization"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Words Flow (Right to Left for Arabic) */}
                  <div className="flex flex-wrap flex-row-reverse gap-2 sm:gap-3 items-center justify-end my-4 leading-loose">
                    {ayah.words.map((w) => {
                      const isSelected = selectedWord?.arabic === w.arabic && selectedWord?.wordIndex === w.wordIndex;

                      return (
                        <button
                          key={w.wordIndex}
                          onClick={() => {
                            setSelectedWord(w);
                            setSelectedAyahIndex(aIdx);
                          }}
                          className={`group text-right p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-amber-500/10 dark:bg-amber-400/20 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/30 shadow-sm'
                              : 'bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/40 hover:bg-emerald-100/70 hover:border-emerald-300'
                          }`}
                        >
                          <div className="text-xl sm:text-2xl font-quran font-bold text-emerald-950 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            {w.arabic}
                          </div>
                          {showTransliteration && (
                            <div className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 font-mono mt-0.5">
                              {w.transliteration}
                            </div>
                          )}
                          <div className="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium mt-0.5 line-clamp-1">
                            {w.english}
                          </div>

                          {/* Grammatical Type Tag */}
                          <span
                            className={`inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                              w.type === 'ism'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'
                                : w.type === 'fi\'l'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}
                          >
                            {w.type}
                          </span>
                        </button>
                      );
                    })}

                    {/* Ayah End Sign (۝) */}
                    <span className="text-2xl font-quran text-amber-500 font-bold px-1 select-none">
                      ۝
                    </span>
                  </div>

                  {/* Full English Translation */}
                  {showTranslation && (
                    <div className="mt-4 pt-3 border-t border-emerald-100/60 dark:border-emerald-900/60 text-sm text-emerald-900 dark:text-emerald-100/90 font-sans leading-relaxed">
                      <span className="font-semibold text-emerald-700 dark:text-amber-300 mr-2">Translation:</span>
                      "{ayah.englishTranslation}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Morphology & I'rab Drawer */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/80 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-800/60">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-emerald-950 dark:text-amber-100 uppercase tracking-wider">
                  Morphology & I'rab Inspector
                </h3>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Word Analysis</span>
            </div>

            {selectedWord ? (
              <div className="space-y-4 pt-4">
                {/* Word Display with Audio */}
                <div className="bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl py-6 px-4 text-center border border-emerald-100 dark:border-emerald-800/50 relative shadow-inner">
                  <div className="min-h-[70px] flex items-center justify-center text-4xl sm:text-5xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                    {selectedWord.arabic}
                  </div>
                  <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 mt-2">
                    {selectedWord.transliteration}
                  </div>
                  <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mt-1">
                    "{selectedWord.english}"
                  </div>

                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <button
                      onClick={() => handlePronounceWord(selectedWord)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Word</span>
                    </button>

                    <button
                      onClick={() => handleToggleFavoriteWord(selectedWord.arabic)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        progress.favoriteWordIds.includes(selectedWord.arabic)
                          ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'border-emerald-200 dark:border-emerald-700 text-emerald-600 hover:bg-emerald-100'
                      }`}
                      title="Bookmark this word"
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grammatical Properties */}
                <div className="space-y-2.5 text-xs">
                  {/* Part of Speech */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-900/30">
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">Part of Speech:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded uppercase ${
                        selectedWord.type === 'ism'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                          : selectedWord.type === 'fi\'l'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {selectedWord.type === 'ism' ? 'Ism (Noun / Adj)' : selectedWord.type === 'fi\'l' ? 'Fi\'l (Verb)' : 'Harf (Particle)'}
                    </span>
                  </div>

                  {/* Root (Jadhr) */}
                  {selectedWord.root && selectedWord.root !== '-' && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-900/30">
                      <span className="text-emerald-800 dark:text-emerald-300 font-medium">Root <span className="font-arabic font-semibold">(الجذر)</span>:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-arabic font-bold text-sm text-amber-600 dark:text-amber-300">
                          {selectedWord.root}
                        </span>
                        {onSelectRoot && (
                          <button
                            onClick={() => onSelectRoot(selectedWord.root!)}
                            className="text-[11px] text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 underline inline-flex items-center cursor-pointer"
                          >
                            <span>Explore</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Grammatical Case Ending (I'rab) */}
                  {selectedWord.caseEnding && (
                    <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-900/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-800 dark:text-emerald-300 font-medium">Case State <span className="font-arabic font-semibold">(الإعراب)</span>:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-300 capitalize">
                          {selectedWord.caseEnding}
                        </span>
                      </div>
                      {selectedWord.caseExplanation && (
                        <p className="text-emerald-900 dark:text-emerald-200/90 text-[11px] leading-relaxed pt-1 border-t border-emerald-100 dark:border-emerald-800/40">
                          {selectedWord.caseExplanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Study Tip for Thoufeek */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-1">💡 Ustadh Tip for Thoufeek:</span>
                  Notice how the vowel on the final letter indicates the word's grammatical job in the sentence. Kasrah (ـِ) tells you something came before it pulling it down!
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-emerald-600 dark:text-emerald-400 text-xs">
                Click any word in the Quran verses to inspect its grammar and root!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
