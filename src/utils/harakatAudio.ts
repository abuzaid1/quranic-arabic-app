/**
 * Harakat Audio Engine
 * Provides authentic acoustic synthesis & phonetic vocalization for all Arabic letters
 * combined with short vowels (Fathah, Kasrah, Dammah) and Sukun (with Qalqalah echo where applicable).
 * Grounded in classical Qaida Nooraniyyah & Shaykhi Academy phonetic rules.
 */

// Consonant phonetic base frequencies & characteristics
interface ConsonantProfile {
  name: string;
  translit: string;
  baseFreq: number; // fundamental Hz
  noiseAmount: number; // friction for throat/hissing letters
  isQalqalah: boolean; // قطب جد letters
  isHeavy: boolean; // Tafkheem (throat cavity expansion)
  onsetDuration: number;
}

export const CONSONANT_PROFILES: Record<string, ConsonantProfile> = {
  alif: { name: 'Alif / Hamzah', translit: 'A', baseFreq: 140, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.04 },
  baa: { name: 'Baa', translit: 'B', baseFreq: 110, noiseAmount: 0.08, isQalqalah: true, isHeavy: false, onsetDuration: 0.05 },
  taa: { name: 'Taa', translit: 'T', baseFreq: 190, noiseAmount: 0.35, isQalqalah: false, isHeavy: false, onsetDuration: 0.06 },
  thaa: { name: 'Thaa', translit: 'Th', baseFreq: 220, noiseAmount: 0.45, isQalqalah: false, isHeavy: false, onsetDuration: 0.08 },
  jeem: { name: 'Jeem', translit: 'J', baseFreq: 130, noiseAmount: 0.3, isQalqalah: true, isHeavy: false, onsetDuration: 0.06 },
  haa: { name: 'Haa (ح)', translit: 'Ḥ', baseFreq: 180, noiseAmount: 0.5, isQalqalah: false, isHeavy: false, onsetDuration: 0.1 },
  khaa: { name: 'Khaa (خ)', translit: 'Kh', baseFreq: 150, noiseAmount: 0.6, isQalqalah: false, isHeavy: true, onsetDuration: 0.1 },
  daal: { name: 'Daal', translit: 'D', baseFreq: 125, noiseAmount: 0.1, isQalqalah: true, isHeavy: false, onsetDuration: 0.05 },
  dhaal: { name: 'Dhaal (ذ)', translit: 'Dh', baseFreq: 140, noiseAmount: 0.35, isQalqalah: false, isHeavy: false, onsetDuration: 0.07 },
  raa: { name: 'Raa', translit: 'R', baseFreq: 135, noiseAmount: 0.15, isQalqalah: false, isHeavy: true, onsetDuration: 0.06 },
  zay: { name: 'Zay', translit: 'Z', baseFreq: 170, noiseAmount: 0.4, isQalqalah: false, isHeavy: false, onsetDuration: 0.07 },
  seen: { name: 'Seen', translit: 'S', baseFreq: 240, noiseAmount: 0.65, isQalqalah: false, isHeavy: false, onsetDuration: 0.08 },
  sheen: { name: 'Sheen', translit: 'Sh', baseFreq: 210, noiseAmount: 0.7, isQalqalah: false, isHeavy: false, onsetDuration: 0.09 },
  saad: { name: 'Saad (ص)', translit: 'Ṣ', baseFreq: 190, noiseAmount: 0.55, isQalqalah: false, isHeavy: true, onsetDuration: 0.08 },
  daad: { name: 'Daad (ض)', translit: 'Ḍ', baseFreq: 120, noiseAmount: 0.25, isQalqalah: false, isHeavy: true, onsetDuration: 0.08 },
  taa_heavy: { name: 'Taa (ط)', translit: 'Ṭ', baseFreq: 170, noiseAmount: 0.2, isQalqalah: true, isHeavy: true, onsetDuration: 0.06 },
  zaa_heavy: { name: 'Zhaa (ظ)', translit: 'Ẓ', baseFreq: 140, noiseAmount: 0.35, isQalqalah: false, isHeavy: true, onsetDuration: 0.07 },
  ayn: { name: 'Ayn (ع)', translit: '\'A', baseFreq: 110, noiseAmount: 0.2, isQalqalah: false, isHeavy: false, onsetDuration: 0.09 },
  ghayn: { name: 'Ghayn (غ)', translit: 'Gh', baseFreq: 115, noiseAmount: 0.45, isQalqalah: false, isHeavy: true, onsetDuration: 0.09 },
  faa: { name: 'Faa', translit: 'F', baseFreq: 200, noiseAmount: 0.5, isQalqalah: false, isHeavy: false, onsetDuration: 0.07 },
  qaaf: { name: 'Qaaf (ق)', translit: 'Q', baseFreq: 130, noiseAmount: 0.25, isQalqalah: true, isHeavy: true, onsetDuration: 0.06 },
  kaaf: { name: 'Kaaf', translit: 'K', baseFreq: 180, noiseAmount: 0.4, isQalqalah: false, isHeavy: false, onsetDuration: 0.06 },
  laam: { name: 'Laam', translit: 'L', baseFreq: 150, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.05 },
  meem: { name: 'Meem', translit: 'M', baseFreq: 115, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.06 },
  noon: { name: 'Noon', translit: 'N', baseFreq: 130, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.06 },
  haa_light: { name: 'Haa (هـ)', translit: 'H', baseFreq: 160, noiseAmount: 0.45, isQalqalah: false, isHeavy: false, onsetDuration: 0.08 },
  waaw: { name: 'Waaw', translit: 'W', baseFreq: 110, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.06 },
  yaa: { name: 'Yaa', translit: 'Y', baseFreq: 160, noiseAmount: 0.05, isQalqalah: false, isHeavy: false, onsetDuration: 0.05 },
};

export type HarakahType = 'fatha' | 'kasra' | 'damma' | 'sukun' | 'tanween_fath' | 'tanween_damm' | 'tanween_kasr' | 'shaddah';

// Vowel formant frequencies for Arabic vowels
interface VowelFormants {
  f1: number; // Oral opening
  f2: number; // Tongue advancement
  f3: number;
  duration: number; // seconds
}

const HARAKAH_FORMANTS: Record<HarakahType, VowelFormants> = {
  fatha: { f1: 750, f2: 1300, f3: 2400, duration: 0.35 },
  kasra: { f1: 280, f2: 2250, f3: 2800, duration: 0.35 },
  damma: { f1: 320, f2: 850, f3: 2200, duration: 0.35 },
  sukun: { f1: 500, f2: 1500, f3: 2500, duration: 0.2 },
  tanween_fath: { f1: 750, f2: 1300, f3: 2400, duration: 0.5 },
  tanween_damm: { f1: 320, f2: 850, f3: 2200, duration: 0.5 },
  tanween_kasr: { f1: 280, f2: 2250, f3: 2800, duration: 0.5 },
  shaddah: { f1: 700, f2: 1400, f3: 2400, duration: 0.6 },
};

class HarakatAudioEngine {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(console.warn);
    }
    return this.ctx;
  }

  /**
   * Synthesize acoustic Arabic letter with exact Harakah vowel
   */
  public playHarakahPhonetic(
    letterId: string,
    harakah: HarakahType,
    onEnded?: () => void
  ): void {
    // Resume AudioContext if suspended
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const profile = CONSONANT_PROFILES[letterId] || CONSONANT_PROFILES.baa;
    const vowel = HARAKAH_FORMANTS[harakah] || HARAKAH_FORMANTS.fatha;

    let hasEnded = false;
    const fireEndedOnce = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnded) onEnded();
      }
    };

    // First attempt speech synthesis with clean Arabic diacritic
    this.trySpeechSynthesis(letterId, harakah, fireEndedOnce);

    if (!ctx) {
      setTimeout(fireEndedOnce, vowel.duration * 1000);
      return;
    }

    try {
      const now = ctx.currentTime;
      const totalDuration = vowel.duration;

      // 1. Glottal voice oscillator (Voice source)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const pitch = profile.baseFreq;
      osc.frequency.setValueAtTime(pitch, now);
      // Natural pitch contour
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.95, now + totalDuration);

      // 2. Formant Filters (Vocal Tract Shaping)
      const f1Filter = ctx.createBiquadFilter();
      f1Filter.type = 'bandpass';
      f1Filter.frequency.setValueAtTime(vowel.f1, now);
      f1Filter.Q.setValueAtTime(5, now);

      const f2Filter = ctx.createBiquadFilter();
      f2Filter.type = 'bandpass';
      f2Filter.frequency.setValueAtTime(vowel.f2, now);
      f2Filter.Q.setValueAtTime(6, now);

      // 3. Frictional noise for throat & sibilant consonants
      let noiseNode: AudioNode | null = null;
      if (profile.noiseAmount > 0.05) {
        const bufferSize = ctx.sampleRate * 0.15;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(profile.baseFreq * 2.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(profile.noiseAmount * 0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profile.onsetDuration);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        whiteNoise.start(now);
        whiteNoise.stop(now + profile.onsetDuration);
        noiseNode = noiseGain;
      }

      // 4. Amplitude Envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      // Fast attack
      gainNode.gain.linearRampToValueAtTime(0.35, now + profile.onsetDuration);

      if (harakah === 'sukun') {
        // Sukun: abrupt stop
        gainNode.gain.setValueAtTime(0.35, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        // Qalqalah echoing bounce for قطب جد
        if (profile.isQalqalah) {
          const echoTime = now + 0.22;
          gainNode.gain.setValueAtTime(0.2, echoTime);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, echoTime + 0.12);
        }
      } else if (harakah.startsWith('tanween')) {
        // Tanween: vowel then nasal 'n' ending
        gainNode.gain.setValueAtTime(0.35, now + totalDuration * 0.6);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);
      } else {
        // Standard short vowel decay
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + totalDuration);
      }

      // Routing
      osc.connect(f1Filter);
      osc.connect(f2Filter);
      f1Filter.connect(gainNode);
      f2Filter.connect(gainNode);

      if (noiseNode) {
        noiseNode.connect(ctx.destination);
      }

      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + totalDuration + 0.1);

      if (onEnded) {
        setTimeout(onEnded, (totalDuration + 0.1) * 1000);
      }
    } catch (e) {
      console.warn('Harakat acoustic synthesis note:', e);
      if (onEnded) onEnded();
    }
  }

  /**
   * Web Speech Synthesis companion with accurate Arabic vocalization
   */
  private trySpeechSynthesis(letterId: string, harakah: HarakahType, onEnded?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnded) onEnded();
      return;
    }

    try {
      // Cancel any ongoing or stuck utterance first
      window.speechSynthesis.cancel();

      const glyph = this.getArabicDiacriticText(letterId, harakah);
      const utter = new SpeechSynthesisUtterance(glyph);
      utter.lang = 'ar-SA';
      utter.rate = 0.82; // deliberate, clear pedagogical speed
      utter.pitch = 1.0;

      if (onEnded) {
        utter.onend = () => onEnded();
        utter.onerror = () => onEnded();
      }

      // Prefer Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
      if (arabicVoice) {
        utter.voice = arabicVoice;
      }

      window.speechSynthesis.speak(utter);
    } catch (e) {
      // Acoustic synthesis is playing
      if (onEnded) onEnded();
    }
  }

  /**
   * Generate exact Arabic letter with specific Harakah diacritic
   */
  public getArabicDiacriticText(letterId: string, harakah: HarakahType): string {
    const map: Record<string, string> = {
      alif: 'أ',
      baa: 'ب',
      taa: 'ت',
      thaa: 'ث',
      jeem: 'ج',
      haa: 'ح',
      khaa: 'خ',
      daal: 'د',
      dhaal: 'ذ',
      raa: 'ر',
      zay: 'ز',
      seen: 'س',
      sheen: 'ش',
      saad: 'ص',
      daad: 'ض',
      taa_heavy: 'ط',
      zaa_heavy: 'ظ',
      ayn: 'ع',
      ghayn: 'غ',
      faa: 'ف',
      qaaf: 'ق',
      kaaf: 'ك',
      laam: 'ل',
      meem: 'م',
      noon: 'ن',
      haa_light: 'ه',
      waaw: 'و',
      yaa: 'ي',
    };

    const base = map[letterId] || 'ب';

    switch (harakah) {
      case 'fatha':
        return `${base}َ`;
      case 'kasra':
        return `${base}ِ`;
      case 'damma':
        return `${base}ُ`;
      case 'sukun':
        return `${base}ْ`;
      case 'tanween_fath':
        return `${base}ً`;
      case 'tanween_damm':
        return `${base}ٌ`;
      case 'tanween_kasr':
        return `${base}ٍ`;
      case 'shaddah':
        return `${base}َّ`;
      default:
        return base;
    }
  }

  /**
   * Return phonetic transliteration for letter + harakah
   */
  public getPhoneticTranslit(letterId: string, harakah: HarakahType): string {
    const profile = CONSONANT_PROFILES[letterId] || CONSONANT_PROFILES.baa;
    const base = profile.translit;

    switch (harakah) {
      case 'fatha':
        return `${base}a`;
      case 'kasra':
        return `${base}i`;
      case 'damma':
        return `${base}u`;
      case 'sukun':
        return profile.isQalqalah ? `${base}ْ (with echo bounce)` : `${base}ْ (rest)`;
      case 'tanween_fath':
        return `${base}an`;
      case 'tanween_damm':
        return `${base}un`;
      case 'tanween_kasr':
        return `${base}in`;
      case 'shaddah':
        return `${base}${base}a (doubled)`;
      default:
        return base;
    }
  }
}

export const harakatAudio = new HarakatAudioEngine();
