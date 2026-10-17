import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  Gauge,
  Sparkles,
  User,
  ChevronDown,
} from 'lucide-react';
import { quranAudio, AudioTrackState, QURAN_RECITERS } from '../utils/audioPlayer';
import { UserProgress } from '../types/index';

interface GlobalAudioPlayerProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({
  progress,
  onUpdateProgress,
}) => {
  const [audioState, setAudioState] = useState<AudioTrackState>(quranAudio.getState());
  const [isReciterMenuOpen, setIsReciterMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = quranAudio.subscribe((newState) => {
      setAudioState({ ...newState });
    });
    return unsubscribe;
  }, []);

  if (!audioState.key && !audioState.isPlaying) {
    return null;
  }

  const currentReciter =
    QURAN_RECITERS.find((r) => r.id === (audioState.reciterId || progress.selectedReciter)) ||
    QURAN_RECITERS[0];

  const handleTogglePlay = () => {
    quranAudio.togglePlayPause();
  };

  const handleStop = () => {
    quranAudio.stop();
  };

  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25];
    const currentIndex = speeds.indexOf(audioState.playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    quranAudio.setPlaybackRate(nextSpeed);
  };

  const handleSelectReciter = (reciterId: string) => {
    onUpdateProgress((prev) => ({ ...prev, selectedReciter: reciterId }));
    quranAudio.setReciter(reciterId);
    setIsReciterMenuOpen(false);

    // If currently reciting a reference or ayah, replay with new reciter
    if (audioState.reference) {
      quranAudio.playQuranReference(audioState.reference, reciterId);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="bg-emerald-950/95 dark:bg-black/95 text-white backdrop-blur-md rounded-2xl border-2 border-amber-400/80 shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Track Info with animated wave */}
        <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
          {/* Animated sound wave bars */}
          <div className="flex items-end space-x-0.5 h-7 w-7 p-1 rounded-lg bg-emerald-900/80 border border-emerald-700/60 shrink-0 justify-center">
            {audioState.isPlaying ? (
              <>
                <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
                <span className="w-1 bg-amber-300 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-6" />
                <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-3" />
                <span className="w-1 bg-amber-200 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-5" />
              </>
            ) : (
              <>
                <span className="w-1 bg-emerald-600 rounded-full h-2" />
                <span className="w-1 bg-emerald-600 rounded-full h-3" />
                <span className="w-1 bg-emerald-600 rounded-full h-2" />
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                Real Qari Voice
              </span>
              <span className="text-xs font-bold text-amber-200 truncate">
                {audioState.title || 'Quran Recitation'}
              </span>
            </div>
            <div className="text-[11px] text-emerald-300 truncate flex items-center space-x-1.5 mt-0.5">
              <span>{audioState.subtitle || currentReciter.name}</span>
            </div>
          </div>
        </div>

        {/* Audio Controls & Reciter Switcher */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
          {/* Speed Button */}
          <button
            onClick={handleCycleSpeed}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 text-xs font-mono font-bold flex items-center space-x-1 border border-emerald-700/60 transition-colors cursor-pointer"
            title="Recitation Speed (Slow down for Tajweed)"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{audioState.playbackRate}x</span>
          </button>

          {/* Reciter Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsReciterMenuOpen(!isReciterMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-medium flex items-center space-x-1 border border-emerald-700/60 transition-colors cursor-pointer max-w-[130px] truncate"
              title="Change Reciter"
            >
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentReciter.name.split(' ')[1] || 'Reciter'}</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>

            {isReciterMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-emerald-950 border border-emerald-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 px-2 py-1">
                  Select Real Reciter
                </div>
                {QURAN_RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectReciter(r.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex flex-col transition-colors cursor-pointer ${
                      currentReciter.id === r.id
                        ? 'bg-amber-400 text-emerald-950 font-bold'
                        : 'text-emerald-100 hover:bg-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.name}</span>
                      <span className="font-arabic text-xs opacity-80">{r.arabicName}</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-normal">{r.style}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 shadow-md transition-colors cursor-pointer"
            title={audioState.isPlaying ? 'Pause' : 'Play'}
          >
            {audioState.isPlaying ? (
              <Pause className="w-4 h-4 fill-emerald-950" />
            ) : (
              <Play className="w-4 h-4 fill-emerald-950" />
            )}
          </button>

          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700/60 transition-colors cursor-pointer"
            title="Stop Recitation"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
