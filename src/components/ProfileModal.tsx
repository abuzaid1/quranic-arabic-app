import React from 'react';
import {
  X,
  User,
  Flame,
  Award,
  Settings,
  BookOpen,
  Volume2,
  CheckCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { UserProgress } from '../types/index';
import { QURAN_RECITERS } from '../utils/audioPlayer';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
}) => {
  if (!isOpen) return null;

  const badges = [
    {
      id: 'b1',
      title: 'Tawfeeq Seeker',
      desc: 'Embark on the blessed journey of learning Quranic Arabic',
      unlocked: true,
      icon: '🌱',
    },
    {
      id: 'b2',
      title: 'Makharij Apprentice',
      desc: 'Mastered 5 or more Arabic letter articulation points',
      unlocked: progress.masteredLetterIds.length >= 5,
      icon: '🗣️',
    },
    {
      id: 'b3',
      title: '80% Vocab Builder',
      desc: 'Mastered 5 or more high-frequency Quran words',
      unlocked: progress.masteredWordIds.length >= 5,
      icon: '📚',
    },
    {
      id: 'b4',
      title: 'Tajweed Scholar',
      desc: 'Mastered 2 or more Quranic recitation rules',
      unlocked: progress.completedTajweedRuleIds.length >= 2,
      icon: '🎨',
    },
    {
      id: 'b5',
      title: 'Al-Fatiha Graduate',
      desc: 'Explored word-by-word I\'rab of the Opening Surah',
      unlocked: true,
      icon: '📖',
    },
  ];

  const handleSetDailyGoal = (mins: number) => {
    onUpdateProgress((prev) => ({ ...prev, dailyGoalMinutes: mins }));
  };

  const handleSetReciter = (reciterId: string) => {
    onUpdateProgress((prev) => ({ ...prev, selectedReciter: reciterId }));
  };

  const handleSetFontSize = (size: 'normal' | 'large' | 'huge') => {
    onUpdateProgress((prev) => ({ ...prev, arabicFontSize: size }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-800 overflow-hidden space-y-6">
        {/* Header with Thoufeek's dedicated badge */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-amber-400/30">
              {progress.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{progress.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold">
                  {progress.xp} XP
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5 font-arabic">
                تَوْفِيق • مَن سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا
              </p>
              <div className="flex items-center space-x-3 text-xs text-emerald-300 mt-2">
                <span className="flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{progress.streakDays} Day Streak</span>
                </span>
                <span>•</span>
                <span>Goal: {progress.dailyGoalMinutes} min/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-emerald-900 dark:text-emerald-200">
          {/* Daily Goal Setting */}
          <div className="space-y-2">
            <label className="font-bold text-emerald-950 dark:text-amber-200 uppercase tracking-wider block">
              Daily Quranic Study Goal:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 15, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetDailyGoal(mins)}
                  className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                    progress.dailyGoalMinutes === mins
                      ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-sm font-bold'
                      : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Real Qari Recitation Voice Preference */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 dark:text-amber-200 uppercase tracking-wider block">
                Primary Real Quran Reciter (100% Studio Voice):
              </label>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                EveryAyah CDN
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {QURAN_RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSetReciter(r.id)}
                  className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                    progress.selectedReciter === r.id
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400 font-bold'
                      : 'bg-emerald-50/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-[10px] opacity-75 font-arabic">({r.arabicName})</span>
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      {r.style} • {r.country}
                    </div>
                  </div>
                  {progress.selectedReciter === r.id && (
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Font Size */}
          <div className="space-y-2">
            <label className="font-bold text-emerald-950 dark:text-amber-200 uppercase tracking-wider block">
              Quran Font Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'huge'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleSetFontSize(sz)}
                  className={`py-2 px-3 rounded-xl capitalize font-semibold border transition-all cursor-pointer ${
                    progress.arabicFontSize === sz
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Thoufeek's Achievements & Badges */}
          <div className="space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-800/60">
            <label className="font-bold text-emerald-950 dark:text-amber-200 uppercase tracking-wider block">
              Thoufeek's Learning Badges ({badges.filter((b) => b.unlocked).length}/{badges.length}):
            </label>
            <div className="space-y-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-all ${
                    b.unlocked
                      ? 'bg-emerald-50/70 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800'
                      : 'opacity-40 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center space-x-1.5">
                      <span>{b.title}</span>
                      {b.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/50 border-t border-emerald-100 dark:border-emerald-800/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
