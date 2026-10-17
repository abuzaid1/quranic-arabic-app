import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Volume2,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  GitFork,
  ExternalLink,
  Mic,
  MicOff,
  Radio,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { QuranRoot, UserProgress } from '../types/index';
import { QURAN_ROOTS } from '../data/quranRoots';
import { QURAN_VOCABULARY } from '../data/quranVocabulary';
import { quranAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

interface RootExplorerViewProps {
  progress: UserProgress;
  initialRoot?: string;
  onNavigateToSurah?: (surahNum: number) => void;
}

interface DetectedWordAnalysis {
  spokenText: string;
  cleanedArabic: string;
  matchedRoot: QuranRoot;
  exactDerivative?: {
    arabic: string;
    transliteration: string;
    english: string;
    form: string;
    surahRef: string;
  };
  relatedForms: Array<{
    label: string;
    arabic: string;
    meaning: string;
  }>;
}

export const RootExplorerView: React.FC<RootExplorerViewProps> = ({
  progress,
  initialRoot,
  onNavigateToSurah,
}) => {
  const [selectedRoot, setSelectedRoot] = useState<QuranRoot>(() => {
    if (initialRoot) {
      const match = QURAN_ROOTS.find((r) => r.root === initialRoot || r.rootArabic === initialRoot);
      if (match) return match;
    }
    const thoufeekRoot = QURAN_ROOTS.find((r) => r.root === 'و ف ق');
    return thoufeekRoot || QURAN_ROOTS[0];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePlayingRef, setActivePlayingRef] = useState<string | null>(null);

  // Voice Search States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'ar-SA' | 'en-US'>('ar-SA');
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [detectedWordInfo, setDetectedWordInfo] = useState<DetectedWordAnalysis | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Filter roots based on search query
  const filteredRoots = QURAN_ROOTS.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.root.includes(searchQuery) ||
      r.rootArabic.includes(searchQuery) ||
      r.basicMeaning.toLowerCase().includes(q) ||
      r.derivatives.some((d) => d.english.toLowerCase().includes(q) || d.arabic.includes(searchQuery))
    );
  });

  const handlePlayVerseRecitation = (surahRef: string) => {
    if (activePlayingRef === surahRef && quranAudio.isPlaying()) {
      quranAudio.stop();
      setActivePlayingRef(null);
      return;
    }
    setActivePlayingRef(surahRef);
    quranAudio.playQuranReference(
      surahRef,
      progress.selectedReciter,
      () => setActivePlayingRef(null),
      () => setActivePlayingRef(null)
    );
  };

  // Resolve spoken Arabic or English word to Root and Relations
  const resolveSpokenWord = (transcript: string) => {
    const raw = transcript.trim();
    if (!raw) return;

    setSpokenTranscript(raw);
    const normalizedArabic = raw.replace(/[ًٌٍَُِّْ]/g, '').toLowerCase();

    // 1. Search derivatives first for exact match (e.g. توفيق, رحمة, عليم)
    let matchedRoot: QuranRoot | undefined;
    let matchedDerivative: any | undefined;

    for (const r of QURAN_ROOTS) {
      // Check root itself
      const rootNormalized = r.rootArabic.replace(/\s+/g, '').replace(/[ًٌٍَُِّْ]/g, '');
      if (normalizedArabic.includes(rootNormalized) || rootNormalized.includes(normalizedArabic)) {
        matchedRoot = r;
        break;
      }
      // Check derivatives
      for (const d of r.derivatives) {
        const dNorm = d.arabic.replace(/[ًٌٍَُِّْ]/g, '');
        if (
          normalizedArabic.includes(dNorm) ||
          dNorm.includes(normalizedArabic) ||
          raw.toLowerCase().includes(d.english.toLowerCase()) ||
          d.english.toLowerCase().includes(raw.toLowerCase())
        ) {
          matchedRoot = r;
          matchedDerivative = d;
          break;
        }
      }
      if (matchedRoot) break;

      // Check root meaning
      if (r.basicMeaning.toLowerCase().includes(raw.toLowerCase())) {
        matchedRoot = r;
        break;
      }
    }

    // Fallback to Quran Vocabulary
    if (!matchedRoot) {
      for (const v of QURAN_VOCABULARY) {
        const vNorm = v.arabic.replace(/[ًٌٍَُِّْ]/g, '');
        if (
          normalizedArabic.includes(vNorm) ||
          vNorm.includes(normalizedArabic) ||
          raw.toLowerCase().includes(v.english.toLowerCase())
        ) {
          const rootMatch = QURAN_ROOTS.find((r) => r.root === v.root || r.rootArabic === v.root);
          if (rootMatch) {
            matchedRoot = rootMatch;
            break;
          }
        }
      }
    }

    // Default fallback to first root or Thoufeek root if unknown
    const targetRoot = matchedRoot || QURAN_ROOTS[0];
    setSelectedRoot(targetRoot);
    setSearchQuery('');

    // Generate Morphological relations
    const relatedForms = [
      { label: 'Root (الأَصْل)', arabic: targetRoot.rootArabic, meaning: targetRoot.basicMeaning },
      {
        label: 'Primary Form (الفِعْل/الاسْم)',
        arabic: targetRoot.derivatives[0]?.arabic || targetRoot.rootArabic,
        meaning: targetRoot.derivatives[0]?.english || targetRoot.basicMeaning,
      },
      {
        label: 'Quranic Derived Form',
        arabic: targetRoot.derivatives[1]?.arabic || targetRoot.derivatives[0]?.arabic || targetRoot.rootArabic,
        meaning: targetRoot.derivatives[1]?.english || targetRoot.derivatives[0]?.english || '',
      },
    ];

    setDetectedWordInfo({
      spokenText: raw,
      cleanedArabic: raw,
      matchedRoot: targetRoot,
      exactDerivative: matchedDerivative,
      relatedForms,
    });

    confetti({ particleCount: 30, spread: 50 });
  };

  // Start Web Speech Recognition
  const handleStartVoiceSearch = () => {
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Please use the quick voice samples below!');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenTranscript('Listening... Speak now in Arabic (e.g. توفيق, رحمة, علم)');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        resolveSpokenWord(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Click any suggested voice word below to test!');
        } else {
          setVoiceError(`Voice detection: ${event.error}. You can also click the quick spoken words below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Voice recognition initialization error:', err);
      setIsListening(false);
      setVoiceError('Could not start microphone. Click a voice sample below to test word detection.');
    }
  };

  const handleStopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-emerald-950/80 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 dark:text-amber-100 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>The Quranic Root <span className="font-arabic font-bold text-amber-500">(جَذْر)</span> Explorer</span>
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Unlock the Quran's morphological DNA (Sarf). Search by text or <strong>Search by Voice in Arabic</strong> to detect words and view all relations, root letters, spelling, and Quranic examples!
          </p>
        </div>

        {/* Search & Voice Actions */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Voice Search Button */}
          <button
            onClick={isListening ? handleStopVoiceSearch : handleStartVoiceSearch}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/30'
                : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
            }`}
            title="Search by Voice (Speak Arabic or English)"
          >
            {isListening ? <Radio className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Listening...' : 'Search by Voice'}</span>
          </button>

          {/* Language toggle for voice */}
          <button
            onClick={() => setVoiceLanguage((l) => (l === 'ar-SA' ? 'en-US' : 'ar-SA'))}
            className="px-2.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold border border-emerald-300 dark:border-emerald-700 cursor-pointer"
            title="Toggle Voice Recognition Language"
          >
            {voiceLanguage === 'ar-SA' ? 'العربية (AR)' : 'English (EN)'}
          </button>

          {/* Search Input */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search root (e.g. mercy, كتب)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-white placeholder-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* VOICE SEARCH ACTIVE LISTENING BANNER */}
      {isListening && (
        <div className="bg-gradient-to-r from-rose-950 via-emerald-950 to-teal-950 text-white p-5 rounded-3xl border-2 border-rose-400 shadow-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
              <Mic className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-300 block">
                🎙 Listening in {voiceLanguage === 'ar-SA' ? 'Arabic (العربية)' : 'English'}...
              </span>
              <p className="text-sm font-bold text-amber-200">
                {spokenTranscript}
              </p>
            </div>
          </div>

          <button
            onClick={handleStopVoiceSearch}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
          >
            Done Speaking
          </button>
        </div>
      )}

      {/* VOICE DETECTION ERROR OR QUICK-CLICK FALLBACKS */}
      {voiceError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-emerald-950 border border-amber-300 dark:border-amber-600 text-xs text-emerald-950 dark:text-emerald-100 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{voiceError}</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
              Tip: You can test voice resolution by clicking any sample word below:
            </p>
          </div>
        </div>
      )}

      {/* QUICK VOICE TEST SAMPLES CHIPS */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-xs">
        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Try Voice Queries:</span>
        </span>
        {[
          { label: 'توفيق (Thoufeek / Success)', val: 'توفيق' },
          { label: 'رحمة (Mercy)', val: 'رحمة' },
          { label: 'علم (Knowledge)', val: 'علم' },
          { label: 'كتب (Book / Decree)', val: 'كتب' },
          { label: 'صبر (Patience)', val: 'صبر' },
          { label: 'هدى (Guidance)', val: 'هدى' },
        ].map((item) => (
          <button
            key={item.val}
            onClick={() => resolveSpokenWord(item.val)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-amber-200 font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* DETECTED WORD BREAKDOWN CARD */}
      {detectedWordInfo && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border-2 border-amber-400 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Voice Search Result Detected</span>
              </span>
              <span className="text-xs text-emerald-300">
                Heard: <strong className="text-amber-200 font-arabic text-base ml-1">"{detectedWordInfo.spokenText}"</strong>
              </span>
            </div>

            <button
              onClick={() => setDetectedWordInfo(null)}
              className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Detected Spelling & Root */}
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400">Detected Word & Tashkeel:</span>
              <div className="text-4xl font-quran font-bold text-amber-300">
                {detectedWordInfo.exactDerivative?.arabic || detectedWordInfo.spokenText}
              </div>
              <div className="text-xs font-mono text-emerald-300">
                {detectedWordInfo.exactDerivative?.transliteration || ''}
              </div>
              <div className="text-xs text-white font-semibold">
                "{detectedWordInfo.exactDerivative?.english || detectedWordInfo.matchedRoot.basicMeaning}"
              </div>
            </div>

            {/* Resolved Root */}
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400">Identified 3-Letter Root (جذر):</span>
              <div className="text-4xl font-quran font-bold text-white">
                {detectedWordInfo.matchedRoot.rootArabic}
              </div>
              <div className="text-xs text-emerald-300 font-semibold">
                Root Meaning: {detectedWordInfo.matchedRoot.basicMeaning}
              </div>
              <div className="text-[11px] text-amber-300 font-semibold">
                Total Quran Occurrences: {detectedWordInfo.matchedRoot.totalOccurrences.toLocaleString()}x
              </div>
            </div>

            {/* Sample Verse with Real Reciter */}
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Quranic Context & Audio:</span>
              <div className="text-xs text-emerald-200">
                Surah Ref:{' '}
                <span className="font-bold text-amber-300">
                  {detectedWordInfo.exactDerivative?.surahRef || detectedWordInfo.matchedRoot.derivatives[0]?.surahRef}
                </span>
              </div>
              <button
                onClick={() =>
                  handlePlayVerseRecitation(
                    detectedWordInfo.exactDerivative?.surahRef || detectedWordInfo.matchedRoot.derivatives[0]?.surahRef
                  )
                }
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Real Qari Recitation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Roots List (Left) + Morphological Family Tree (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Root Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
            Essential Roots ({filteredRoots.length}):
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredRoots.map((r) => {
              const isSelected = selectedRoot.root === r.root;
              const isThoufeekRoot = r.root === 'و ف ق';

              return (
                <div
                  key={r.root}
                  onClick={() => setSelectedRoot(r)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                      : 'bg-white dark:bg-emerald-950/70 border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                        {r.rootArabic}
                      </span>
                      {isThoufeekRoot && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold">
                          Thoufeek Root
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {r.totalOccurrences}x in Quran
                    </span>
                  </div>

                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 line-clamp-1">
                    {r.basicMeaning}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Root Breakdown & Derived Words Tree */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Selected Root Overview Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-7 border border-emerald-800/80 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-4xl sm:text-5xl font-quran font-bold text-amber-300">
                    {selectedRoot.rootArabic}
                  </span>
                  <div>
                    <span className="text-xs text-emerald-300 uppercase font-semibold">3-Letter Root</span>
                    <h3 className="text-xl font-arabic font-bold text-white tracking-widest">{selectedRoot.rootArabic}</h3>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-2xl font-bold text-amber-300">
                  {selectedRoot.totalOccurrences.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-300">Occurrences across Quran</span>
              </div>
            </div>

            {/* Core semantic meaning */}
            <div className="mt-4">
              <span className="text-xs uppercase font-semibold text-amber-300/90 block mb-1">
                Linguistic Core Meaning:
              </span>
              <p className="text-base text-emerald-100 font-medium leading-relaxed">
                {selectedRoot.basicMeaning}
              </p>
            </div>

            {/* Special Callout if Thoufeek's root */}
            {selectedRoot.root === 'و ف ق' && (
              <div className="mt-4 p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-200 text-xs leading-relaxed">
                <span className="font-bold block mb-1 text-amber-300">
                  🌟 Thoufeek's Namesake Root: <span className="font-arabic font-bold">و ف ق</span>
                </span>
                In the Holy Quran, Prophet Shu'ayb (peace be upon him) encapsulates the believer's aspiration in Surah Hud 11:88:
                <div className="text-lg font-quran text-amber-100 text-right my-2" dir="rtl">
                  "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ، عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ"
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 pt-2 border-t border-amber-400/20">
                  <span className="italic text-emerald-200">
                    "And my success (Tawfeeq / Thoufeek) is not but through Allah. Upon Him I have relied, and to Him I return."
                  </span>
                  <button
                    onClick={() => handlePlayVerseRecitation('Hud 11:88')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all cursor-pointer ${
                      activePlayingRef === 'Hud 11:88' && quranAudio.isPlaying()
                        ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                        : 'bg-amber-400/30 hover:bg-amber-400 text-amber-200 hover:text-emerald-950'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>
                      {activePlayingRef === 'Hud 11:88' && quranAudio.isPlaying()
                        ? 'Reciting...'
                        : 'Recite Ayah (Real Qari)'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Morphological Family Tree of Derivatives */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 dark:text-amber-100 flex items-center space-x-2">
                <GitFork className="w-4 h-4 text-emerald-600 dark:text-amber-400" />
                <span>Derived Quranic Words & Forms ({selectedRoot.derivatives.length})</span>
              </h4>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Click speaker to recite verse by Real Qari
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedRoot.derivatives.map((deriv, idx) => {
                const isPlaying = activePlayingRef === deriv.surahRef && quranAudio.isPlaying();
                return (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-emerald-950/70 rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                      isPlaying
                        ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/20'
                        : 'border-emerald-100 dark:border-emerald-800/60 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                          {deriv.form}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                          {deriv.surahRef}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <div>
                          <div className="text-2xl font-quran font-bold text-emerald-950 dark:text-amber-200">
                            {deriv.arabic}
                          </div>
                          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                            {deriv.transliteration}
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayVerseRecitation(deriv.surahRef)}
                          className={`p-2 rounded-xl transition-all shadow-xs cursor-pointer ${
                            isPlaying
                              ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-500 font-bold'
                              : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                          }`}
                          title={`Recite ${deriv.surahRef} with real reciter`}
                        >
                          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100 mt-2">
                        "{deriv.english}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
