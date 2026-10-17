/**
 * Pure grammar analysis logic and helper functions for Quranic Arabic.
 */

// Common Quranic prepositions (Huroof al-Jarr)
export const COMMON_HUROOF_JARR = [
  'فِي', // in
  'مِنْ', // from
  'إِلَى', // to
  'عَلَى', // upon / on
  'عَنْ', // about / from
  'بِ', // with / by
  'لِ', // for
  'كَمَا', // as / like
  'كَ', // like
  'حَتَّى', // until
];

// In Arabic, a word after Harf Jarr is always Majroor (taking Kasra or Ya)
export function isHarfJarr(word: string): boolean {
  const clean = word.trim().replace(/[ًٌٍَُِّْ]/g, '');
  return COMMON_HUROOF_JARR.some(hj => hj.replace(/[ًٌٍَُِّْ]/g, '') === clean);
}

// Characteristic indicators of an Ism (Noun) in the Quran
export function detectIsmCharacteristics(word: string): {
  isLikelyIsm: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const trimmed = word.trim();

  // 1. Starts with Al- (ال)
  if (trimmed.startsWith('ال') || trimmed.startsWith('ٱل')) {
    reasons.push('Has the definite article "Al-" (ال)');
  }

  // 2. Ends with Tanween (ً , ٌ , ٍ)
  if (/[ًٌٍ]/.test(trimmed)) {
    reasons.push('Ends with Tanween (Nunation - ً ٌ ٍ)');
  }

  // 3. Ends with Ta Marbutah (ة or ـة)
  if (/[ةـة]/.test(trimmed)) {
    reasons.push('Ends with Ta Marbutah (ة) indicating femininity / noun form');
  }

  return {
    isLikelyIsm: reasons.length > 0,
    reasons,
  };
}

// Case ending helper: explains Raf' (Damma), Nasb (Fatha), Jarr (Kasra)
export type ArabicCase = 'marfoo' | 'mansoob' | 'majroor' | 'unknown';

export function determinePrimaryCase(wordWithTashkeel: string): {
  arabicCase: ArabicCase;
  caseNameArabic: string;
  sign: string;
  primaryFunctionInQuran: string;
} {
  const text = wordWithTashkeel.trim();
  const lastChar = text.slice(-2); // examine diacritic at end

  if (/[ٌُ]/.test(lastChar)) {
    return {
      arabicCase: 'marfoo',
      caseNameArabic: 'مَرْفُوع (Marfoo\')',
      sign: 'Dammah (ـُ) or Tanween Damm (ـٌ)',
      primaryFunctionInQuran: 'Subject / Doer (Faa\'il), Topic (Mubtada\'), or Predicate (Khabar).',
    };
  }

  if (/[ًَ]/.test(lastChar)) {
    return {
      arabicCase: 'mansoob',
      caseNameArabic: 'مَنْصُوب (Mansoob)',
      sign: 'Fathah (ـَ) or Tanween Fath (ـً)',
      primaryFunctionInQuran: 'Direct Object (Maf\'ool Bihi), adverbial time/place (Zarf), or state (Haal).',
    };
  }

  if (/[ٍِ]/.test(lastChar)) {
    return {
      arabicCase: 'majroor',
      caseNameArabic: 'مَجْرُور (Majroor)',
      sign: 'Kasrah (ـِ) or Tanween Kasr (ـٍ)',
      primaryFunctionInQuran: 'After a Preposition (Harf Jarr) or Possessor in Idafah (Mudaf Ilayh).',
    };
  }

  return {
    arabicCase: 'unknown',
    caseNameArabic: 'مَبْنِيّ أو غَيْر مُحَدَّد (Mabni / Invariable)',
    sign: 'Fixed ending or Sukun',
    primaryFunctionInQuran: 'Fixed form (like pronouns, demonstratives, or past verbs).',
  };
}

// Idafah check helper (Possessive Phrase, e.g., كِتَابُ اللَّهِ - Book of Allah)
export function isValidIdafahConstruction(firstWord: string, secondWord: string): {
  isValid: boolean;
  explanation: string;
} {
  const mudaf = firstWord.trim();
  const mudafIlayh = secondWord.trim();

  // Mudaf cannot have Al- and cannot have Tanween
  const hasAl = mudaf.startsWith('ال') || mudaf.startsWith('ٱل');
  const hasTanween = /[ًٌٍ]/.test(mudaf);

  if (hasAl) {
    return {
      isValid: false,
      explanation: 'The first word (Mudaf) CANNOT have the definite article "Al-".',
    };
  }
  if (hasTanween) {
    return {
      isValid: false,
      explanation: 'The first word (Mudaf) CANNOT have Tanween (Nunation).',
    };
  }

  // The second word (Mudaf Ilayh) must be in the Majroor state (Kasra)
  const isMajroor = /[ٍِ]/.test(mudafIlayh.slice(-2)) || mudafIlayh.includes('اللَّهِ') || mudafIlayh.includes('اللهِ');

  return {
    isValid: true,
    explanation: isMajroor
      ? 'Correct Idafah structure! The first word has no Al/tanween and the second word is Majroor.'
      : 'Note: Ensure the second word (Mudaf Ilayh) is in the Majroor (Kasrah) state.',
  };
}
