import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle,
  HelpCircle,
  Award,
  ArrowRight,
  BookOpen,
  Info,
} from 'lucide-react';
import { TajweedRule, TajweedCategory, UserProgress } from '../types/index';
import { TAJWEED_RULES } from '../data/tajweedRules';
import { quranAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

import { Play, Pause, Square } from 'lucide-react';
import { QURAN_RECITERS } from '../utils/audioPlayer';

interface TajweedMasterViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const TajweedMasterView: React.FC<TajweedMasterViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [selectedRule, setSelectedRule] = useState<TajweedRule>(TAJWEED_RULES[0]);
  const [selectedCategory, setSelectedCategory] = useState<TajweedCategory | 'all'>('all');
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [activePlayingRef, setActivePlayingRef] = useState<string | null>(null);

  // Filtered rules
  const filteredRules = TAJWEED_RULES.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const currentReciter =
    QURAN_RECITERS.find((r) => r.id === progress.selectedReciter) ||
    QURAN_RECITERS.find((r) => r.id === 'Husary_128kbps') ||
    QURAN_RECITERS[0];

  const handlePlayExampleRecitation = (surahRef: string) => {
    if (activePlayingRef === surahRef && quranAudio.isPlaying()) {
      quranAudio.stop();
      setActivePlayingRef(null);
      return;
    }
    setActivePlayingRef(surahRef);
    quranAudio.playQuranReference(
      surahRef,
      progress.selectedReciter || 'Husary_128kbps',
      () => setActivePlayingRef(null),
      () => setActivePlayingRef(null)
    );
  };

  const handleToggleCompleted = (ruleId: string) => {
    onUpdateProgress((prev) => {
      const isCompleted = prev.completedTajweedRuleIds.includes(ruleId);
      const updated = isCompleted
        ? prev.completedTajweedRuleIds.filter((id) => id !== ruleId)
        : [...prev.completedTajweedRuleIds, ruleId];
      const xpGain = !isCompleted ? 35 : 0;

      if (!isCompleted) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }

      return {
        ...prev,
        completedTajweedRuleIds: updated,
        xp: prev.xp + xpGain,
      };
    });
  };

  // Interactive Spot-the-Tajweed Quiz Questions
  const tajweedQuizQuestions = [
    {
      verse: 'قُلْ هُوَ اللَّهُ أَحَدْ',
      highlightedWord: 'أَحَدْ',
      question: 'When stopping on the word "أَحَدْ" at the end of Surah Al-Ikhlas, which Tajweed rule applies to the Daal (د)?',
      options: ['Qalqalah Kubra (Major Echoing Bounce)', 'Idgham with Ghunnah', 'Ikhfa Haqiqi', 'Izhar Halqi'],
      correctIndex: 0,
      explanation: 'The letter Daal (د) is one of the 5 Qalqalah letters (قطب جد). When stopping on it with an implied Sukun at the end of an ayah, it receives a resonant Qalqalah Kubra!',
    },
    {
      verse: 'مَن يَقُولُ',
      highlightedWord: 'مَن يَقُولُ',
      question: 'What rule occurs when the Noon Sakinah meets the letter Yaa (ي) in "مَن يَقُولُ"?',
      options: ['Izhar Halqi', 'Idgham with Ghunnah (2 beats nasal merge)', 'Iqlab', 'Madd Lazim'],
      correctIndex: 1,
      explanation: 'The letter Yaa is one of the (يَنْمُو) letters of Idgham with Ghunnah. The Noon blends into Yaa with a 2-beat nasal resonance.',
    },
    {
      verse: 'مِن بَعْدِ',
      highlightedWord: 'مِن بَعْدِ',
      question: 'Why does the Noon Sakinah before the Baa (ب) sound like a Meem in "مِن بَعْدِ"?',
      options: ['Iqlab (Transforming Noon into Meem)', 'Idgham without Ghunnah', 'Qalqalah Sughra', 'Madd Muttasil'],
      correctIndex: 0,
      explanation: 'Iqlab literally means "to turn over". Whenever Noon Sakinah or Tanween is followed by Baa (ب), it turns into a hidden Meem with Ghunnah.',
    },
  ];

  const currentQuiz = tajweedQuizQuestions[quizQuestionIndex];

  const handleAnswerQuiz = (selectedOptionIndex: number) => {
    if (quizFeedback !== null) return;
    const isCorrect = selectedOptionIndex === currentQuiz.correctIndex;
    setQuizFeedback({
      isCorrect,
      message: currentQuiz.explanation,
    });

    if (isCorrect) {
      confetti({ particleCount: 30, spread: 50 });
      onUpdateProgress((prev) => ({ ...prev, xp: prev.xp + 25 }));
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizFeedback(null);
    if (quizQuestionIndex < tajweedQuizQuestions.length - 1) {
      setQuizQuestionIndex(quizQuestionIndex + 1);
    } else {
      setQuizActive(false);
      setQuizQuestionIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 dark:text-amber-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Interactive Tajweed Master</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
              {progress.completedTajweedRuleIds.length}/{TAJWEED_RULES.length} Rules Mastered
            </span>
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Learn the exact science of reciting the Quran as revealed to the Prophet Muhammad (peace be upon him).
          </p>
        </div>

        {/* Practice Game Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuizActive(!quizActive)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              quizActive
                ? 'bg-amber-400 text-emerald-950'
                : 'bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>{quizActive ? 'Exit Tajweed Quiz' : 'Test Your Tajweed Ear'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tajweed Quiz Overlay/Section */}
      {quizActive && (
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-2xl p-6 border-2 border-amber-400/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <span className="text-xs uppercase font-bold text-amber-300">
              Spot the Tajweed Rule • Question {quizQuestionIndex + 1} of {tajweedQuizQuestions.length}
            </span>
            <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              +25 XP per correct answer
            </span>
          </div>

          <div className="text-center py-4 bg-emerald-900/40 rounded-xl border border-emerald-800/60">
            <span className="text-xs text-emerald-300 block mb-1">Quranic Verse:</span>
            <div className="text-3xl font-quran font-bold text-amber-200 mb-2 select-text" dir="rtl">
              {currentQuiz.verse}
            </div>
            <p className="text-sm text-emerald-100 max-w-xl mx-auto font-medium">
              {currentQuiz.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuiz.options.map((opt, oIdx) => {
              const isSelected = quizFeedback !== null;
              const isCorrectOpt = oIdx === currentQuiz.correctIndex;

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswerQuiz(oIdx)}
                  disabled={isSelected}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? isCorrectOpt
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border-emerald-700/60'
                  }`}
                >
                  <span className="font-bold mr-2 text-amber-300">
                    {String.fromCharCode(65 + oIdx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizFeedback && (
            <div
              className={`p-4 rounded-xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
                quizFeedback.isCorrect ? 'bg-emerald-800/80 border border-emerald-500' : 'bg-rose-950/80 border border-rose-500'
              }`}
            >
              <div>
                <span className="font-bold block text-sm mb-0.5">
                  {quizFeedback.isCorrect ? '✨ MashAllah! Spot on!' : '💡 Good effort! Review the rule:'}
                </span>
                <p className="text-emerald-100/90">{quizFeedback.message}</p>
              </div>

              <button
                onClick={handleNextQuizQuestion}
                className="px-4 py-2 rounded-lg bg-amber-400 text-emerald-950 font-bold text-xs whitespace-nowrap hover:bg-amber-300 transition-colors cursor-pointer"
              >
                {quizQuestionIndex < tajweedQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="font-bold text-emerald-900 dark:text-emerald-200 shrink-0">Rule Category:</span>
        {[
          { id: 'all', label: 'All Rules' },
          { id: 'noon_sakina', label: 'Noon Sakinah & Tanween' },
          { id: 'qalqalah', label: 'Qalqalah (Echo)' },
          { id: 'madd', label: 'Madd (Elongations)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-800 text-amber-300 shadow-sm'
                : 'bg-white dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Rules List (Left) + Rule Detail Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Rules Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRules.map((rule) => {
            const isSelected = selectedRule.id === rule.id;
            const isCompleted = progress.completedTajweedRuleIds.includes(rule.id);

            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRule(rule)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-white dark:bg-emerald-950 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                    : 'bg-white dark:bg-emerald-950/70 border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-arabic font-bold px-2.5 py-0.5 rounded-full ${rule.badgeColor}`}>
                        {rule.arabicName}
                      </span>
                      {rule.durationHarakat && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold">
                          Hold: {rule.durationHarakat} Harakat
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-emerald-950 dark:text-amber-100">
                      {rule.name}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300/80 line-clamp-2">
                      {rule.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isCompleted && (
                      <span title="Completed by Thoufeek">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </span>
                    )}
                    <span className="text-lg font-arabic font-bold text-emerald-800 dark:text-emerald-300">
                      {rule.letters.slice(0, 4).join(' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Rule Studio & Audio Showcase */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/80 shadow-md space-y-4">
            <div className="pb-3 border-b border-emerald-100 dark:border-emerald-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-300">
                  {selectedRule.category.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-amber-100">
                  {selectedRule.name}
                </h3>
              </div>
              <span className="text-xl font-arabic font-bold text-emerald-800 dark:text-emerald-300">
                {selectedRule.arabicName}
              </span>
            </div>

            {/* Explanation Card */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
              <span className="font-bold block text-emerald-950 dark:text-amber-200">How to Apply:</span>
              <p className="leading-relaxed">{selectedRule.rulesHowToApply}</p>
            </div>

            {/* Trigger Letters */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
                Trigger Letters ({selectedRule.letters.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedRule.letters.map((ltr) => (
                  <span
                    key={ltr}
                    className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-amber-200 font-quran text-lg font-bold flex items-center justify-center shadow-xs"
                  >
                    {ltr}
                  </span>
                ))}
              </div>
            </div>

            {/* Quranic Verse Examples with Real Qari Recitation */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Quran Examples (Real Qari Recitation):
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  {currentReciter.name.split(' ')[1] || 'Reciter'}
                </span>
              </div>

              {selectedRule.examples.map((ex, i) => {
                const isPlaying = activePlayingRef === ex.surahRef && quranAudio.isPlaying();
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isPlaying
                        ? 'border-amber-400 bg-amber-50/70 dark:bg-emerald-900/60 shadow-md ring-2 ring-amber-400/40'
                        : 'border-emerald-100 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-900/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                        {ex.arabic}
                      </div>
                      <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                        {ex.transliteration}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        {ex.explanation} • <span className="font-semibold text-emerald-800 dark:text-amber-300">{ex.surahRef}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayExampleRecitation(ex.surahRef)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm cursor-pointer shrink-0 flex items-center space-x-1.5 ${
                        isPlaying
                          ? 'bg-amber-400 text-emerald-950 font-bold scale-105 ring-2 ring-amber-500'
                          : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                      }`}
                      title={isPlaying ? 'Pause Recitation' : `Recite ${ex.surahRef} with real reciter`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span className="text-[10px] uppercase font-bold">Playing</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span className="text-[10px] uppercase font-bold">Recite</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Mark Rule Completed */}
            <button
              onClick={() => handleToggleCompleted(selectedRule.id)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                progress.completedTajweedRuleIds.includes(selectedRule.id)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>
                {progress.completedTajweedRuleIds.includes(selectedRule.id)
                  ? 'Rule Mastered by Thoufeek (+35 XP)'
                  : 'Mark Rule as Mastered (+35 XP)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
