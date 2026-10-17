import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroWelcome } from './components/HeroWelcome';
import { QuranReaderView } from './components/QuranReaderView';
import { AlphabetQaidaView } from './components/AlphabetQaidaView';
import { TajweedMasterView } from './components/TajweedMasterView';
import { Vocab80View } from './components/Vocab80View';
import { RootExplorerView } from './components/RootExplorerView';
import { GrammarStudioView } from './components/GrammarStudioView';
import { AITutorDrawer } from './components/AITutorDrawer';
import { ProfileModal } from './components/ProfileModal';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { YMBWelcomeModal } from './components/YMBWelcomeModal';
import { UserProgress } from './types/index';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('reader');
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isYMBModalOpen, setIsYMBModalOpen] = useState<boolean>(false);
  const [selectedRootToExplore, setSelectedRootToExplore] = useState<string>('و ف ق');

  // Auto-show greeting when user enters the application if not seen before
  useEffect(() => {
    if (!progress.hasSeenYMBWelcome) {
      // Small timeout for smooth initial load
      const timer = setTimeout(() => {
        setIsYMBModalOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [progress.hasSeenYMBWelcome]);

  // Auto-save progress whenever it changes
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Handle cross-tab navigation to root explorer
  const handleSelectRoot = (root: string) => {
    setSelectedRootToExplore(root);
    setActiveTab('roots');
  };

  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      saveUserProgress(updated);
      return updated;
    });
  };

  const handleCloseYMBModal = () => {
    setIsYMBModalOpen(false);
    updateProgress((prev) => ({ ...prev, hasSeenYMBWelcome: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-emerald-980 text-slate-900 dark:text-emerald-50 flex flex-col font-sans transition-colors selection:bg-amber-400 selection:text-emerald-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        progress={progress}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTutor={() => setIsTutorOpen(true)}
        onOpenYMBInfo={() => setIsYMBModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Banner for Thoufeek */}
        <HeroWelcome
          progress={progress}
          onNavigate={setActiveTab}
          onOpenTutor={() => setIsTutorOpen(true)}
          onOpenYMBInfo={() => setIsYMBModalOpen(true)}
        />

        {/* Tab View Routing */}
        <div className="transition-opacity duration-200">
          {activeTab === 'reader' && (
            <QuranReaderView
              progress={progress}
              onUpdateProgress={updateProgress}
              onSelectRoot={handleSelectRoot}
            />
          )}

          {activeTab === 'qaida' && (
            <AlphabetQaidaView
              progress={progress}
              onUpdateProgress={updateProgress}
            />
          )}

          {activeTab === 'tajweed' && (
            <TajweedMasterView
              progress={progress}
              onUpdateProgress={updateProgress}
            />
          )}

          {activeTab === 'vocab' && (
            <Vocab80View
              progress={progress}
              onUpdateProgress={updateProgress}
              onSelectRoot={handleSelectRoot}
            />
          )}

          {activeTab === 'roots' && (
            <RootExplorerView
              progress={progress}
              initialRoot={selectedRootToExplore}
            />
          )}

          {activeTab === 'grammar' && (
            <GrammarStudioView
              progress={progress}
              onUpdateProgress={updateProgress}
            />
          )}

          {activeTab === 'tutor' && (
            <div className="py-6">
              <div className="max-w-3xl mx-auto bg-white dark:bg-emerald-950/80 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-emerald-950 text-3xl font-bold shadow-md">
                  ت
                </div>
                <h2 className="text-2xl font-bold text-emerald-950 dark:text-amber-200">
                  YMB-AI: Your Muslim Brother Artificial Intelligence (أخوك المسلم الذكي)
                </h2>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto">
                  Your 24/7 dedicated classical Arabic tutor and digital brother in faith. Ask any question about Quranic syntax, I'rab, Tajweed rules, or root words.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsTutorOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    Open YMB-AI Chat Panel
                  </button>
                  <button
                    onClick={() => setIsYMBModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-semibold text-sm border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 transition-all cursor-pointer"
                  >
                    What is YMB-AI?
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* YMB-AI Welcome & Greeting Modal */}
      <YMBWelcomeModal
        isOpen={isYMBModalOpen}
        onClose={handleCloseYMBModal}
        onOpenTutor={() => {
          setIsYMBModalOpen(false);
          setIsTutorOpen(true);
        }}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
      />

      {/* AI Ustadh Drawer */}
      <AITutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        progress={progress}
      />

      {/* Global Real Qari Floating Audio Player */}
      <GlobalAudioPlayer
        progress={progress}
        onUpdateProgress={updateProgress}
      />

      {/* App Footer */}
      <footer className="mt-12 bg-emerald-950 border-t border-emerald-900/80 text-emerald-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold font-serif">
              ت
            </div>
            <div>
              <p className="font-bold text-sm text-amber-200">
                Thoufeek: Quranic Arabic Master
              </p>
              <p className="text-emerald-400">
                Crafted for Thoufeek's journey to recite and understand the Holy Quran
              </p>
            </div>
          </div>

          <div className="text-center md:text-right font-quran text-base text-amber-100/90 leading-loose" dir="rtl">
            "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"
            <span className="block text-[11px] font-sans text-emerald-300 not-italic" dir="ltr">
              "And We have certainly made the Quran easy for remembrance" — Surah Al-Qamar (54:17)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
