import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isHarfJarr,
  detectIsmCharacteristics,
  determinePrimaryCase,
  isValidIdafahConstruction,
} from './grammarEngine.ts';
import {
  calculateNextSRS,
  updateStreak,
  calculateQuizXP,
} from './quizEngine.ts';
import { parseQuranReference } from './audioPlayer.ts';
import { harakatAudio } from './harakatAudio.ts';

test('isHarfJarr correctly identifies Quranic prepositions with or without tashkeel', () => {
  assert.equal(isHarfJarr('فِي'), true);
  assert.equal(isHarfJarr('في'), true);
  assert.equal(isHarfJarr('مِنْ'), true);
  assert.equal(isHarfJarr('عَلَى'), true);
  assert.equal(isHarfJarr('كِتَاب'), false);
  assert.equal(isHarfJarr('قَالَ'), false);
});

test('detectIsmCharacteristics identifies nouns by Al-, Tanween, and Ta Marbutah', () => {
  const alBook = detectIsmCharacteristics('الْكِتَابُ');
  assert.equal(alBook.isLikelyIsm, true);
  assert.ok(alBook.reasons.some(r => r.includes('Al-')));

  const tanweenWord = detectIsmCharacteristics('هُدًى');
  assert.equal(tanweenWord.isLikelyIsm, true);
  assert.ok(tanweenWord.reasons.some(r => r.includes('Tanween')));

  const taMarbutahWord = detectIsmCharacteristics('رَحْمَةٌ');
  assert.equal(taMarbutahWord.isLikelyIsm, true);
  assert.ok(taMarbutahWord.reasons.some(r => r.includes('Ta Marbutah')));

  const verb = detectIsmCharacteristics('يَعْلَمُونَ');
  assert.equal(verb.isLikelyIsm, false);
});

test('determinePrimaryCase detects Marfoo, Mansoob, Majroor correctly', () => {
  assert.equal(determinePrimaryCase('اللَّهُ').arabicCase, 'marfoo');
  assert.equal(determinePrimaryCase('كِتَابًا').arabicCase, 'mansoob');
  assert.equal(determinePrimaryCase('بِالْحَقِّ').arabicCase, 'majroor');
});

test('isValidIdafahConstruction validates Arabic possessive rules', () => {
  // Valid: كِتَابُ اللَّهِ (no Al on first word, Majroor on second word)
  const valid = isValidIdafahConstruction('كِتَابُ', 'اللَّهِ');
  assert.equal(valid.isValid, true);

  // Invalid: first word cannot have Al-
  const invalidAl = isValidIdafahConstruction('الكِتَابُ', 'اللَّهِ');
  assert.equal(invalidAl.isValid, false);

  // Invalid: first word cannot have Tanween
  const invalidTanween = isValidIdafahConstruction('كِتَابٌ', 'اللَّهِ');
  assert.equal(invalidTanween.isValid, false);
});

test('updateStreak handles same day, next day, and missed days', () => {
  const now = new Date('2026-10-17T12:00:00Z').getTime();
  const sameDay = new Date('2026-10-17T08:00:00Z').getTime();
  const yesterday = new Date('2026-10-16T15:00:00Z').getTime();
  const threeDaysAgo = new Date('2026-10-13T10:00:00Z').getTime();

  // Same day should keep current streak
  assert.equal(updateStreak(5, sameDay, now).newStreak, 5);
  assert.equal(updateStreak(5, sameDay, now).didIncrease, false);

  // Yesterday should advance streak
  assert.equal(updateStreak(5, yesterday, now).newStreak, 6);
  assert.equal(updateStreak(5, yesterday, now).didIncrease, true);

  // Missed days should reset streak to 1
  assert.equal(updateStreak(5, threeDaysAgo, now).newStreak, 1);
  assert.equal(updateStreak(5, threeDaysAgo, now).didIncrease, true);
});

test('calculateNextSRS updates intervals correctly based on user response', () => {
  const initial = {
    id: 'word-1',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitionCount: 0,
    nextReviewDate: Date.now(),
  };

  // 'again' resets repetitions
  const againResult = calculateNextSRS(initial, 'again');
  assert.equal(againResult.repetitionCount, 0);
  assert.equal(againResult.intervalDays, 1);

  // 'good' progresses repetition count
  const goodResult = calculateNextSRS(initial, 'good');
  assert.equal(goodResult.repetitionCount, 1);
  assert.equal(goodResult.intervalDays, 1);

  const goodRound2 = calculateNextSRS(goodResult, 'good');
  assert.equal(goodRound2.repetitionCount, 2);
  assert.equal(goodRound2.intervalDays, 3);
});

test('calculateQuizXP computes scores with perfection bonus and streak multiplier', () => {
  assert.equal(calculateQuizXP(5, 5, 1), 5 * 15 + 50); // 125
  assert.equal(calculateQuizXP(3, 5, 1), 3 * 15); // 45
  assert.equal(calculateQuizXP(5, 5, 2), (5 * 15 + 50) * 2); // 250
});

test('parseQuranReference parses Quran chapter and verse strings reliably', () => {
  const r1 = parseQuranReference('Surah Hud 11:88');
  assert.deepEqual(r1, { surah: 11, ayah: 88 });

  const r2 = parseQuranReference('Al-Fatiha 1:2');
  assert.deepEqual(r2, { surah: 1, ayah: 2 });

  const r3 = parseQuranReference('Al-Baqarah 2:255');
  assert.deepEqual(r3, { surah: 2, ayah: 255 });

  const r4 = parseQuranReference('Fussilat 41:42');
  assert.deepEqual(r4, { surah: 41, ayah: 42 });

  const r5 = parseQuranReference('112:1');
  assert.deepEqual(r5, { surah: 112, ayah: 1 });
});

test('harakatAudio correctly generates Arabic diacritics and phonetic transliteration', () => {
  const fathaBaa = harakatAudio.getArabicDiacriticText('baa', 'fatha');
  assert.equal(fathaBaa, 'بَ');

  const kasraBaa = harakatAudio.getArabicDiacriticText('baa', 'kasra');
  assert.equal(kasraBaa, 'بِ');

  const dammaBaa = harakatAudio.getArabicDiacriticText('baa', 'damma');
  assert.equal(dammaBaa, 'بُ');

  const sukunBaa = harakatAudio.getArabicDiacriticText('baa', 'sukun');
  assert.equal(sukunBaa, 'بْ');

  const translitFatha = harakatAudio.getPhoneticTranslit('baa', 'fatha');
  assert.equal(translitFatha, 'Ba');

  const translitKasra = harakatAudio.getPhoneticTranslit('baa', 'kasra');
  assert.equal(translitKasra, 'Bi');

  const translitDamma = harakatAudio.getPhoneticTranslit('baa', 'damma');
  assert.equal(translitDamma, 'Bu');
});
