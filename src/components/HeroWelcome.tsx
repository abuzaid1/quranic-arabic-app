import React, { useState } from 'react';
import { Sparkles, Volume2, ArrowRight, BookOpen, Layers, CheckCircle2, Play, Pause } from 'lucide-react';
import { UserProgress } from '../types/index';
import { quranAudio } from '../utils/audioPlayer';
import { NavTab } from './Navbar';

interface HeroWelcomeProps {
  progress: UserProgress;
  onNavigate: (tab: NavTab) => void;
  onOpenTutor: () => void;
  onOpenYMBInfo: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ progress, onNavigate, onOpenTutor, onOpenYMBInfo }) => {
  const [isPlayingWord, setIsPlayingWord] = useState(false);

  // Today's Quranic Word of the Day (connected to Tawfeeq & divine facilitation)
  const wordOfTheDay = {
    arabic: 'تَوْفِيق',
    transliteration: 'Tawfeeq / Thoufeek',
    english: 'Divine facilitation, guidance, and aligning with righteous success',
    root: 'و ف ق',
    surahRef: 'Surah Hud 11:88',
    ayahArabic: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ، عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ',
    ayahEnglish: 'And my success is not but through Allah. Upon Him I have relied, and to Him I return.',
  };

  const handlePlayWord = () => {
    if (isPlayingWord) {
      quranAudio.stop();
      setIsPlayingWord(false);
      return;
    }
    setIsPlayingWord(true);
    quranAudio.playAyah(11, 88, progress.selectedReciter, () => {
      setIsPlayingWord(false);
    }, () => {
      setIsPlayingWord(false);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white border border-emerald-800/80 p-6 sm:p-8 shadow-xl mb-8">
      {/* Subtle Islamic geometric pattern background */}
      <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Welcome & Inspiration for Thoufeek */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Dedicated Quranic Learning Suite for Thoufeek</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ahlan wa Sahlan,{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-serif">
              Thoufeek!
            </span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Your gateway to reciting the Holy Quran with pristine Tajweed and understanding every single word, root, and grammatical rule with confidence.
          </p>

          {/* Thoufeek's Ayah banner */}
          <div className="bg-emerald-900/60 border border-amber-400/30 rounded-xl p-4 text-emerald-50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                Your Namesake Quranic Ayah
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-emerald-300/80 font-arabic">{wordOfTheDay.surahRef}</span>
                <button
                  onClick={handlePlayWord}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isPlayingWord
                      ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                      : 'bg-emerald-800 text-amber-200 hover:bg-emerald-700'
                  }`}
                  title="Listen to real human recitation by Qari"
                >
                  {isPlayingWord ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isPlayingWord ? 'Playing Reciter' : 'Listen Recitation'}</span>
                </button>
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-quran text-amber-100 text-right leading-loose mb-2 select-text" dir="rtl">
              {wordOfTheDay.ayahArabic}
            </p>
            <p className="text-xs sm:text-sm text-emerald-200/90 italic">
              "{wordOfTheDay.ayahEnglish}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('reader')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Surah Al-Fatiha</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('vocab')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700/80 text-emerald-100 font-semibold text-sm border border-emerald-700 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>80% Vocab Flashcards</span>
            </button>

            <button
              onClick={onOpenYMBInfo}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-800/60 hover:bg-teal-700/60 text-teal-200 font-semibold text-sm border border-teal-600/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>YMB-AI (Your Muslim Brother)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Thoufeek's Quick Progress Card & Word of the Day */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Thoufeek's Quran Journey
              </span>
              <span className="text-xs text-emerald-300 font-medium">Goal: {progress.dailyGoalMinutes} min/day</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 my-4 text-center">
              <div className="bg-emerald-900/40 rounded-lg p-2.5 border border-emerald-800/40">
                <span className="block text-lg font-bold text-amber-300">{progress.masteredLetterIds.length}/28</span>
                <span className="text-[11px] text-emerald-300/80">Makharij Letters</span>
              </div>
              <div className="bg-emerald-900/40 rounded-lg p-2.5 border border-emerald-800/40">
                <span className="block text-lg font-bold text-amber-300">{progress.masteredWordIds.length}</span>
                <span className="text-[11px] text-emerald-300/80">Quran Words</span>
              </div>
              <div className="bg-emerald-900/40 rounded-lg p-2.5 border border-emerald-800/40">
                <span className="block text-lg font-bold text-amber-300">{progress.completedTajweedRuleIds.length}</span>
                <span className="text-[11px] text-emerald-300/80">Tajweed Rules</span>
              </div>
            </div>

            {/* Word of the Day Mini Card */}
            <div className="bg-emerald-900/50 rounded-xl p-3.5 border border-emerald-700/50 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-amber-300/90 uppercase font-semibold">Word of the Day</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 font-medium">Root: <span className="font-arabic font-bold text-amber-300">{wordOfTheDay.root}</span></span>
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-xl font-arabic font-bold text-white">{wordOfTheDay.arabic}</span>
                  <span className="text-xs text-emerald-300 italic">{wordOfTheDay.transliteration}</span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5 line-clamp-1">{wordOfTheDay.english}</p>
              </div>

              <button
                onClick={handlePlayWord}
                disabled={isPlayingWord}
                className="p-3 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                title="Listen to Quranic Pronunciation"
                aria-label="Listen to Quranic Pronunciation"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingWord ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
