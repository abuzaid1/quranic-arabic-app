import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Volume2,
  RefreshCw,
  User,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { UserProgress } from '../types/index';
import { quranAudio, parseQuranReference } from '../utils/audioPlayer';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: number;
}

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Assalamu Alaikum brother Thoufeek! 

I am YMB-AI — Your Muslim Brother Artificial Intelligence (أخوك المسلم الذكي).

I'm honored to accompany you on your sacred journey to recite the Holy Quran with crystal-clear Tajweed and understand its timeless vocabulary, grammar (Nahw), and morphological roots (Sarf).

Feel free to ask me about any verse, root word, pronunciation point, or Tajweed rule!
"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ" (Hud 11:88)`,
      timestamp: Date.now(),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What does my name Thoufeek (توفيق) mean in the Quran?',
    'Why does Bismillah start with a Kasrah on Bismi (بِسْمِ)?',
    'Explain the difference between Ar-Rahman and Ar-Raheem',
    'How do I pronounce the letter Dhad (ض) correctly?',
    'What is the grammar breakdown of Surah Al-Ikhlas?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuestion;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          userContext: {
            name: progress.name,
            streakDays: progress.streakDays,
            xp: progress.xp,
            masteredWordsCount: progress.masteredWordIds.length,
            masteredLettersCount: progress.masteredLetterIds.length,
          },
        }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      const tutorMsg: Message = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply || 'May Allah bless your Quranic learning journey!',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.error('Error contacting AI tutor:', err);
      const fallbackMsg: Message = {
        id: `t-err-${Date.now()}`,
        sender: 'tutor',
        text: `Assalamu Alaikum Thoufeek! While connecting, remember that in Quranic Arabic every word traces back to its root. Always look at the 3 base consonants, identify if it is an Ism, Fi'l, or Harf, and notice the vowel ending (Dammah for doer, Fathah for object, Kasrah after prepositions). "And my success is not but through Allah" (وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ)!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const [activePlayingRef, setActivePlayingRef] = useState<string | null>(null);

  const handlePronounce = (text: string) => {
    const parsed = parseQuranReference(text);
    const targetRef = parsed ? `${parsed.surah}:${parsed.ayah}` : '11:88';

    if (activePlayingRef === targetRef && quranAudio.isPlaying()) {
      quranAudio.stop();
      setActivePlayingRef(null);
      return;
    }

    setActivePlayingRef(targetRef);
    quranAudio.playQuranReference(
      targetRef,
      progress.selectedReciter,
      () => setActivePlayingRef(null),
      () => setActivePlayingRef(null)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white dark:bg-emerald-950 shadow-2xl flex flex-col h-full border-l border-emerald-800">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-amber-200">YMB-AI</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 font-semibold">
                  Online
                </span>
              </div>
              <p className="text-xs text-emerald-300">Your Muslim Brother Artificial Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
            aria-label="Close tutor panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="bg-emerald-50 dark:bg-emerald-900/40 p-3 border-b border-emerald-100 dark:border-emerald-800/60 overflow-x-auto flex items-center space-x-2 scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer shrink-0 font-medium text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isTutor = msg.sender === 'tutor';

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 text-xs font-bold font-serif shadow-xs">
                    ت
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                    isTutor
                      ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-100 border border-emerald-100 dark:border-emerald-800/60'
                      : 'bg-emerald-700 text-white rounded-br-none'
                  }`}
                >
                  <div className="font-sans whitespace-pre-wrap select-text leading-relaxed font-normal text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {isTutor && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-emerald-200/50 dark:border-emerald-800/40">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Ustadh guidance</span>
                      </span>
                      <button
                        onClick={() => handlePronounce(msg.text)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-800/80 hover:bg-amber-400 hover:text-emerald-950 text-emerald-800 dark:text-amber-300 transition-colors cursor-pointer text-[10px] font-bold flex items-center space-x-1 shadow-xs"
                        title="Recite referenced verse with Real Qari"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Recite (Real Qari)</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isTutor && (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-300 text-xs p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Ustadh AI is analyzing the Quranic grammar & rules...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-emerald-950 border-t border-emerald-100 dark:border-emerald-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Quranic Arabic, Tajweed, grammar..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-950 dark:text-white placeholder-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
