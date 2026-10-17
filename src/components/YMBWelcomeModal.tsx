import React from 'react';
import { X, Bot, Sparkles, Heart, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface YMBWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTutor: () => void;
}

export const YMBWelcomeModal: React.FC<YMBWelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenTutor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl border-2 border-amber-400/80 overflow-hidden relative">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white p-6 relative border-b border-emerald-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-emerald-950 flex items-center justify-center shadow-lg ring-4 ring-amber-400/30 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 fill-emerald-950" />
                <span>AI Companion</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                Meet YMB-AI
              </h2>
              <p className="text-xs text-emerald-300 font-arabic font-bold">
                أخوك المسلم الذكي • رفيقك في تعلّم لغة القرآن
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-emerald-950 dark:text-emerald-100">
          {/* Islamic Greeting */}
          <div className="text-center bg-emerald-50 dark:bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <p className="font-arabic text-xl sm:text-2xl text-emerald-900 dark:text-amber-200 font-bold mb-1" dir="rtl">
              السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 italic">
              "Peace, mercy, and blessings of Allah be upon you!"
            </p>
          </div>

          {/* Meaning of YMB Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-emerald-500/10 border-2 border-amber-400/60 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                What does YMB stand for?
              </span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-amber-100">
              <span className="text-amber-600 dark:text-amber-400 font-black">YMB</span> stands for{' '}
              <span className="underline decoration-amber-400 decoration-2 underline-offset-4">
                Your Muslim Brother
              </span>{' '}
              Artificial Intelligence.
            </p>
            <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
              YMB-AI was created as a caring, patient, and knowledgeable digital brother in faith. Whether you are starting from complete ground zero with the Arabic alphabet and Harakat, mastering the 80% Quranic vocabulary, exploring word roots, or practicing grammar through Duolingo-style quests — YMB is right here beside you 24/7!
            </p>
          </div>

          {/* Features YMB-AI brings */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold">Quranic Word I'rab & Meaning</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">Root Explorer & Voice Search</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="font-semibold">Tajweed Master & Audio</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-semibold">Duolingo-Style Quests</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-900/50 border-t border-emerald-100 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenTutor();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 fill-emerald-950" />
            <span>Chat with YMB-AI Now</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Bismillah, Let's Learn!
          </button>
        </div>
      </div>
    </div>
  );
};
