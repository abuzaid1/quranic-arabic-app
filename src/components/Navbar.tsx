import React from 'react';
import {
  BookOpen,
  Sparkles,
  Flame,
  Award,
  Layers,
  Settings,
  Bot,
  Compass,
  Feather,
  BookMarked,
} from 'lucide-react';
import { UserProgress } from '../types/index';

export type NavTab = 'reader' | 'qaida' | 'tajweed' | 'vocab' | 'roots' | 'grammar' | 'tutor';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  progress: UserProgress;
  onOpenProfile: () => void;
  onOpenTutor: () => void;
  onOpenYMBInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  progress,
  onOpenProfile,
  onOpenTutor,
  onOpenYMBInfo,
}) => {
  const tabs = [
    { id: 'reader' as NavTab, label: 'Quran Reader', icon: BookOpen, sub: 'Word-by-word I\'rab' },
    { id: 'qaida' as NavTab, label: 'Qaida & Makharij', icon: Layers, sub: 'Phonetics & Forms' },
    { id: 'tajweed' as NavTab, label: 'Tajweed Rules', icon: Sparkles, sub: 'Colors & Recitation' },
    { id: 'vocab' as NavTab, label: '80% Vocabulary', icon: BookMarked, sub: 'High-frequency SRS' },
    { id: 'roots' as NavTab, label: 'Root Explorer', icon: Compass, sub: 'Sarf & Morphology' },
    { id: 'grammar' as NavTab, label: 'Grammar Studio', icon: Feather, sub: 'Nahw Simplified' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/60 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Dedicated Title for Thoufeek */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('reader')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-emerald-950 font-bold text-xl font-serif">
              ت
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-amber-300 to-white bg-clip-text text-transparent">
                  Thoufeek
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-arabic font-semibold">
                  تَوْفِيق
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 -mt-0.5 font-medium tracking-wide">
                Quranic Arabic Academy
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-emerald-800 text-amber-300 shadow-inner border border-emerald-700/60'
                      : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets (Streak, XP, AI Tutor & Settings) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-300 text-xs font-semibold shadow-sm"
              title="Thoufeek's Consecutive Daily Streak"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>{progress.streakDays}d Streak</span>
            </div>

            {/* XP Counter */}
            <div
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm"
              title="Quranic Mastery XP"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{progress.xp} XP</span>
            </div>

            {/* YMB-AI Quick Button */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenTutor}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  activeTab === 'tutor'
                    ? 'bg-amber-400 text-emerald-950 font-bold ring-2 ring-amber-300'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                }`}
                title="YMB-AI: Your Muslim Brother Artificial Intelligence"
                aria-label="Open YMB-AI Quran Tutor"
              >
                <Bot className="w-4 h-4 text-amber-200" />
                <span className="font-extrabold tracking-wide">YMB-AI</span>
              </button>

              <button
                onClick={onOpenYMBInfo}
                className="p-1 rounded-full text-emerald-300 hover:text-amber-300 hover:bg-emerald-900 transition-colors cursor-pointer text-[10px] font-bold"
                title="What is YMB-AI? Click to view greeting & meaning"
                aria-label="What does YMB-AI mean?"
              >
                <span className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center text-[9px]">
                  ?
                </span>
              </button>
            </div>

            {/* Settings & Profile Modal */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/80 transition-colors"
              aria-label="Thoufeek Profile & Settings"
              title="Thoufeek Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-emerald-900/60 scrollbar-none text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center space-x-1 font-medium shrink-0 transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-amber-300 font-semibold'
                    : 'text-emerald-200/70 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
