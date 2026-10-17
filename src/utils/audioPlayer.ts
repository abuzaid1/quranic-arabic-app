/**
 * Real Human Voice Recitation & Phonetics Audio Service
 * 100% Real Human Voices - No AI Speech Synthesis.
 * Integrates:
 * 1. EveryAyah CDN - Real studio recitation for every Quranic verse by legendary Qaris
 * 2. Quran.com CDN - Real human word-by-word Quran recitation for every word
 * 3. Classical Arabic Alphabet Studio - Real human pronunciation for all 28 Arabic letters
 */

export interface ReciterInfo {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  style: string;
  description: string;
}

export const QURAN_RECITERS: ReciterInfo[] = [
  {
    id: 'Alafasy_128kbps',
    name: 'Sheikh Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    country: 'Kuwait',
    style: 'Murattal (Melodic & Crisp)',
    description: 'Imam of the Grand Mosque of Kuwait. Famous worldwide for clear, soulful recitation with pristine Tajweed.',
  },
  {
    id: 'Husary_128kbps',
    name: 'Sheikh Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    country: 'Egypt',
    style: 'Master of Tajweed (Reference Standard)',
    description: 'The golden authority of Quranic pronunciation and Tajweed rules; president of the Quran Reciters of Egypt.',
  },
  {
    id: 'Abdul_Basit_Murattal_192kbps',
    name: 'Sheikh AbdulBaset AbdulSamad',
    arabicName: 'عبد الباسط عبد الصمد',
    country: 'Egypt',
    style: 'Murattal (Legendary Golden Voice)',
    description: 'Celebrated as "The Voice of Heaven", unmatched breath control, resonant clarity, and reverence.',
  },
  {
    id: 'Minshawy_Murattal_128kbps',
    name: 'Sheikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    country: 'Egypt',
    style: 'Murattal (Devotional & Reverent)',
    description: 'Deeply emotional, contemplative recitation that touches the hearts of Quran students across centuries.',
  },
  {
    id: 'Abu_Bakr_Ash-Shaatree_128kbps',
    name: 'Sheikh Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    country: 'Saudi Arabia',
    style: 'Modern Murattal',
    description: 'Calm, measured cadence and clear vowel elongation, highly recommended for beginners.',
  },
  {
    id: 'Saood_ash-Shuraym_128kbps',
    name: "Sheikh Sa'ud ash-Shuraym",
    arabicName: 'سعود الشريم',
    country: 'Saudi Arabia',
    style: 'Haramain Murattal',
    description: 'Former Imam and Khateeb of Masjid al-Haram in Mecca with powerful, rhythmic delivery.',
  },
];

// Mapping letter ID to real human audio file on Arabic Reading Course CDN
export const LETTER_AUDIO_MAP: Record<string, string> = {
  alif: 'alif.mp3',
  baa: 'ba.mp3',
  taa: 'ta.mp3',
  thaa: 'tha.mp3',
  jeem: 'jiim.mp3',
  haa: 'hha.mp3', // ح
  khaa: 'kha.mp3', // خ
  daal: 'daal.mp3',
  dhaal: 'thaal.mp3', // ذ
  raa: 'ra.mp3',
  zay: 'zay.mp3',
  seen: 'siin.mp3',
  sheen: 'shiin.mp3',
  saad: 'saad.mp3',
  daad: 'daad.mp3',
  taa_heavy: 'taa.mp3', // ط
  zaa_heavy: 'thaa.mp3', // ظ
  ayn: 'ayn.mp3', // ع
  ghayn: 'ghayn.mp3', // غ
  faa: 'fa.mp3',
  qaaf: 'qaf.mp3',
  kaaf: 'kaf.mp3',
  laam: 'lam.mp3',
  meem: 'miim.mp3',
  noon: 'nuun.mp3',
  haa_light: 'ha.mp3', // هـ
  waaw: 'waw.mp3',
  yaa: 'ya.mp3',
};

// Surah Name to Number Lookup for Quranic References
export const SURAH_NAME_MAP: Record<string, number> = {
  'fatiha': 1,
  'al-fatiha': 1,
  'baqarah': 2,
  'al-baqarah': 2,
  'ali \'imran': 3,
  'al-imran': 3,
  'imran': 3,
  'nisa': 4,
  'an-nisa': 4,
  'maidah': 5,
  'al-ma\'idah': 5,
  'al-maidah': 5,
  'an\'am': 6,
  'al-an\'am': 6,
  'a\'raf': 7,
  'al-a\'raf': 7,
  'anfal': 8,
  'al-anfal': 8,
  'tawbah': 9,
  'at-tawbah': 9,
  'yunus': 10,
  'hud': 11,
  'yusuf': 12,
  'ra\'d': 13,
  'ar-ra\'d': 13,
  'ibrahim': 14,
  'hijr': 15,
  'al-hijr': 15,
  'nahl': 16,
  'an-nahl': 16,
  'isra': 17,
  'al-isra': 17,
  'kahf': 18,
  'al-kahf': 18,
  'maryam': 19,
  'ta-ha': 20,
  'taha': 20,
  'anbiya': 21,
  'al-anbiya': 21,
  'hajj': 22,
  'al-hajj': 22,
  'mu\'minun': 23,
  'al-mu\'minun': 23,
  'nur': 24,
  'an-nur': 24,
  'furqan': 25,
  'al-furqan': 25,
  'shu\'ara': 26,
  'ash-shu\'ara': 26,
  'naml': 27,
  'an-naml': 27,
  'qasas': 28,
  'al-qasas': 28,
  '\'ankabut': 29,
  'al-\'ankabut': 29,
  'rum': 30,
  'ar-rum': 30,
  'luqman': 31,
  'sajdah': 32,
  'as-sajdah': 32,
  'ahzab': 33,
  'al-ahzab': 33,
  'saba': 34,
  'fatir': 35,
  'ya-sin': 36,
  'yasin': 36,
  'saffat': 37,
  'as-saffat': 37,
  'sad': 38,
  'zumar': 39,
  'az-zumar': 39,
  'ghafir': 40,
  'fussilat': 41,
  'shura': 42,
  'ash-shura': 42,
  'zukhruf': 43,
  'az-zukhruf': 43,
  'dukhan': 44,
  'ad-dukhan': 44,
  'jathiyah': 45,
  'al-jathiyah': 45,
  'ahqaf': 46,
  'al-ahqaf': 46,
  'muhammad': 47,
  'fath': 48,
  'al-fath': 48,
  'hujurat': 49,
  'al-hujurat': 49,
  'qaf': 50,
  'dhariyat': 51,
  'adh-dhariyat': 51,
  'tur': 52,
  'at-tur': 52,
  'najm': 53,
  'an-najm': 53,
  'qamar': 54,
  'al-qamar': 54,
  'rahman': 55,
  'ar-rahman': 55,
  'waqi\'ah': 56,
  'al-waqi\'ah': 56,
  'hadid': 57,
  'al-hadid': 57,
  'mujadila': 58,
  'al-mujadila': 58,
  'hashr': 59,
  'al-hashr': 59,
  'mumtahanah': 60,
  'al-mumtahanah': 60,
  'saff': 61,
  'as-saff': 61,
  'jumu\'ah': 62,
  'al-jumu\'ah': 62,
  'munafiqun': 63,
  'al-munafiqun': 63,
  'taghabun': 64,
  'at-taghabun': 64,
  'talaq': 65,
  'at-talaq': 65,
  'tahrim': 66,
  'at-tahrim': 66,
  'mulk': 67,
  'al-mulk': 67,
  'qalam': 68,
  'al-qalam': 68,
  'haqqah': 69,
  'al-haqqah': 69,
  'ma\'arij': 70,
  'al-ma\'arij': 70,
  'nuh': 71,
  'jinn': 72,
  'al-jinn': 72,
  'muzzammil': 73,
  'al-muzzammil': 73,
  'muddaththir': 74,
  'al-muddaththir': 74,
  'qiyamah': 75,
  'al-qiyamah': 75,
  'insan': 76,
  'al-insan': 76,
  'mursalat': 77,
  'al-mursalat': 77,
  'naba': 78,
  'an-naba': 78,
  'nazi\'at': 79,
  'an-nazi\'at': 79,
  '\'abasa': 80,
  'abasa': 80,
  'takwir': 81,
  'at-takwir': 81,
  'infitar': 82,
  'al-infitar': 82,
  'mutaffifin': 83,
  'al-mutaffifin': 83,
  'inshiqaq': 84,
  'al-inshiqaq': 84,
  'buruj': 85,
  'al-buruj': 85,
  'tariq': 86,
  'at-tariq': 86,
  'a\'la': 87,
  'al-a\'la': 87,
  'ghashiyah': 88,
  'al-ghashiyah': 88,
  'fajr': 89,
  'al-fajr': 89,
  'balad': 90,
  'al-balad': 90,
  'shams': 91,
  'ash-shams': 91,
  'layl': 92,
  'al-layl': 92,
  'duha': 93,
  'ad-duha': 93,
  'sharh': 94,
  'ash-sharh': 94,
  'tin': 95,
  'at-tin': 95,
  '\'alaq': 96,
  'al-\'alaq': 96,
  'alaq': 96,
  'qadr': 97,
  'al-qadr': 97,
  'bayyinah': 98,
  'al-bayyinah': 98,
  'zalzalah': 99,
  'az-zalzalah': 99,
  '\'adiyat': 100,
  'al-\'adiyat': 100,
  'qari\'ah': 101,
  'al-qari\'ah': 101,
  'takathur': 102,
  'at-takathur': 102,
  'asr': 103,
  'al-asr': 103,
  'humazah': 104,
  'al-humazah': 104,
  'fil': 105,
  'al-fil': 105,
  'quraysh': 106,
  'ma\'un': 107,
  'al-ma\'un': 107,
  'kawthar': 108,
  'al-kawthar': 108,
  'kafirun': 109,
  'al-kafirun': 109,
  'nasr': 110,
  'an-nasr': 110,
  'masad': 111,
  'al-masad': 111,
  'ikhlas': 112,
  'al-ikhlas': 112,
  'falaq': 113,
  'al-falaq': 113,
  'nas': 114,
  'an-nas': 114,
};

// Parse strings like "Surah Hud 11:88", "Al-Fatiha 1:2", "Al-Baqarah 2:255", "112:1", "Hud 11:88"
export function parseQuranReference(ref: string): { surah: number; ayah: number } | null {
  if (!ref) return null;

  // 1. Direct number:number pattern e.g. "11:88" or "2:255"
  const colonMatch = ref.match(/(\d+)\s*:\s*(\d+)/);
  if (colonMatch) {
    const s = parseInt(colonMatch[1], 10);
    const a = parseInt(colonMatch[2], 10);
    if (!isNaN(s) && !isNaN(a) && s >= 1 && s <= 114) {
      return { surah: s, ayah: a };
    }
  }

  // 2. Surah name + chapter/verse e.g. "Surah Hud 11 88"
  const cleanRef = ref.toLowerCase().replace(/surah\s*/i, '').trim();
  for (const [name, num] of Object.entries(SURAH_NAME_MAP)) {
    if (cleanRef.startsWith(name)) {
      const remaining = cleanRef.slice(name.length).trim();
      const numMatch = remaining.match(/(\d+)/);
      if (numMatch) {
        return { surah: num, ayah: parseInt(numMatch[1], 10) };
      }
    }
  }

  return null;
}

export interface AudioTrackState {
  isPlaying: boolean;
  key: string | null;
  title: string;
  subtitle: string;
  reciterId: string;
  reciterName: string;
  reference?: string;
  playbackRate: number;
}

type AudioListener = (state: AudioTrackState) => void;

class QuranAudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentKey: string | null = null;
  private currentTitle: string = '';
  private currentSubtitle: string = '';
  private currentReciterId: string = 'Alafasy_128kbps';
  private currentReference?: string;
  private playbackRate: number = 1.0;
  private listeners: Set<AudioListener> = new Set();

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  public getState(): AudioTrackState {
    const reciter = QURAN_RECITERS.find((r) => r.id === this.currentReciterId) || QURAN_RECITERS[0];
    return {
      isPlaying: !this.currentAudio?.paused && !!this.currentAudio,
      key: this.currentKey,
      title: this.currentTitle,
      subtitle: this.currentSubtitle,
      reciterId: this.currentReciterId,
      reciterName: reciter.name,
      reference: this.currentReference,
      playbackRate: this.playbackRate,
    };
  }

  // Format surah/ayah/word to 3-digit string (e.g. 1 -> "001", 112 -> "112")
  public pad3(num: number): string {
    return num.toString().padStart(3, '0');
  }

  // 1. EveryAyah CDN URL for full verse recitation by real human Qari
  public getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciter: string = 'Alafasy_128kbps'): string {
    const s = this.pad3(surahNumber);
    const a = this.pad3(ayahNumber);
    return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
  }

  // 2. Quran.com CDN URL for real human word-by-word pronunciation
  public getWordAudioUrl(surahNumber: number, ayahNumber: number, wordIndex: number): string {
    const s = this.pad3(surahNumber);
    const a = this.pad3(ayahNumber);
    const w = this.pad3(wordIndex);
    return `https://audio.qurancdn.com/wbw/${s}_${a}_${w}.mp3`;
  }

  // 3. Real human pronunciation URL for isolated Arabic alphabet letters
  public getLetterAudioUrl(letterId: string): string {
    const filename = LETTER_AUDIO_MAP[letterId] || 'alif.mp3';
    return `https://www.arabicreadingcourse.com/audio/isolated-letters/${filename}`;
  }

  // 4. Real human recitation URL for full alphabet
  public getFullAlphabetAudioUrl(): string {
    return 'https://www.arabicreadingcourse.com/audio/isolated-letters/full-arabic-alphabet.mp3';
  }

  // Play real human recitation of an Ayah
  public playAyah(
    surahNumber: number,
    ayahNumber: number,
    reciter: string = 'Alafasy_128kbps',
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    const key = `ayah_${surahNumber}_${ayahNumber}`;
    if (this.currentKey === key && this.isPlaying()) {
      this.stop();
      return this.currentAudio as any;
    }

    this.stop();
    this.currentReciterId = reciter;
    this.currentKey = key;
    this.currentReference = `${surahNumber}:${ayahNumber}`;

    // Nice title formatting
    const reciterObj = QURAN_RECITERS.find((r) => r.id === reciter) || QURAN_RECITERS[0];
    this.currentTitle = `Ayah ${surahNumber}:${ayahNumber}`;
    this.currentSubtitle = `Recited by ${reciterObj.name}`;

    const url = this.getAyahAudioUrl(surahNumber, ayahNumber, reciter);
    return this.playMediaUrl(url, onEnded, onError);
  }

  // Play real human pronunciation of a specific word from Quran.com
  public playWord(
    surahNumber: number,
    ayahNumber: number,
    wordIndex: number,
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    const key = `word_${surahNumber}_${ayahNumber}_${wordIndex}`;
    if (this.currentKey === key && this.isPlaying()) {
      this.stop();
      return this.currentAudio as any;
    }

    this.stop();
    this.currentKey = key;
    this.currentTitle = `Word ${wordIndex} (${surahNumber}:${ayahNumber})`;
    this.currentSubtitle = 'Real Human Word Pronunciation (Quran.com)';
    this.currentReference = `${surahNumber}:${ayahNumber}`;

    const url = this.getWordAudioUrl(surahNumber, ayahNumber, wordIndex);
    return this.playMediaUrl(url, onEnded, onError);
  }

  // Play real human recitation of an Arabic alphabet letter
  public playLetter(
    letterId: string,
    letterNameOrOnEnded?: string | (() => void),
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    let resolvedName: string | undefined;
    let resolvedOnEnded = onEnded;
    let resolvedOnError = onError;

    if (typeof letterNameOrOnEnded === 'function') {
      resolvedOnEnded = letterNameOrOnEnded;
      resolvedOnError = onEnded as any;
      resolvedName = undefined;
    } else {
      resolvedName = letterNameOrOnEnded;
    }

    const key = `letter_${letterId}`;
    if (this.currentKey === key && this.isPlaying()) {
      this.stop();
      return this.currentAudio as any;
    }

    this.stop();
    this.currentKey = key;
    this.currentTitle = `Letter: ${resolvedName || letterId.toUpperCase()}`;
    this.currentSubtitle = 'Classical Arabic Phonetic Studio Voice';
    this.currentReference = undefined;

    const url = this.getLetterAudioUrl(letterId);
    return this.playMediaUrl(url, resolvedOnEnded, resolvedOnError);
  }

  // Play full alphabet recitation
  public playFullAlphabet(
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    const key = 'full_alphabet';
    if (this.currentKey === key && this.isPlaying()) {
      this.stop();
      return this.currentAudio as any;
    }

    this.stop();
    this.currentKey = key;
    this.currentTitle = 'Full Arabic Alphabet (28 Letters)';
    this.currentSubtitle = 'Continuous Classical Recitation';
    this.currentReference = undefined;

    const url = this.getFullAlphabetAudioUrl();
    return this.playMediaUrl(url, onEnded, onError);
  }

  // Play real recitation by passing any Quran reference string (e.g. "Hud 11:88", "Al-Fatiha 1:2", "Al-Baqarah 2:255")
  public playQuranReference(
    reference: string,
    reciter: string = 'Alafasy_128kbps',
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement | null {
    const parsed = parseQuranReference(reference);
    if (!parsed) {
      console.warn(`Could not parse Quran reference: ${reference}`);
      if (onError) onError(new Error(`Could not parse Quran reference: ${reference}`));
      return null;
    }

    const key = `ref_${parsed.surah}_${parsed.ayah}`;
    if (this.currentKey === key && this.isPlaying()) {
      this.stop();
      return null;
    }

    this.stop();
    this.currentReciterId = reciter;
    this.currentKey = key;
    this.currentReference = `${parsed.surah}:${parsed.ayah}`;

    const reciterObj = QURAN_RECITERS.find((r) => r.id === reciter) || QURAN_RECITERS[0];
    this.currentTitle = reference.trim();
    this.currentSubtitle = `Recited by ${reciterObj.name}`;

    const url = this.getAyahAudioUrl(parsed.surah, parsed.ayah, reciter);
    return this.playMediaUrl(url, onEnded, onError);
  }

  public setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
    this.notify();
  }

  public setReciter(reciterId: string): void {
    this.currentReciterId = reciterId;
    this.notify();
  }

  public togglePlayPause(): void {
    if (!this.currentAudio) return;
    if (this.currentAudio.paused) {
      this.currentAudio.play().catch(console.warn);
    } else {
      this.currentAudio.pause();
    }
    this.notify();
  }

  // Play arbitrary media URL with automatic cleanup & state notification
  private playMediaUrl(
    url: string,
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    const audio = new Audio(url);
    audio.playbackRate = this.playbackRate;
    this.currentAudio = audio;
    this.notify();

    audio.onplay = () => {
      this.notify();
    };

    audio.onpause = () => {
      this.notify();
    };

    audio.onended = () => {
      this.currentAudio = null;
      this.currentKey = null;
      this.notify();
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Real audio CDN playback error:', url, e);
      this.currentAudio = null;
      this.currentKey = null;
      this.notify();
      if (onError) onError(e);
    };

    audio.play().catch((err) => {
      console.warn('Audio play interrupted or waiting for user interaction:', err);
      this.notify();
    });

    return audio;
  }

  // Stop currently playing audio
  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.currentKey = null;
    this.notify();
  }

  public isPlaying(key?: string): boolean {
    if (!this.currentAudio || this.currentAudio.paused) return false;
    if (key) return this.currentKey === key;
    return true;
  }

  public getCurrentKey(): string | null {
    return this.currentKey;
  }
}

export const quranAudio = new QuranAudioService();
