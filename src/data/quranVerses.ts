import { AyahData } from '../types/index';

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, nameArabic: 'الفَاتِحَة', nameEnglish: 'Al-Fatiha (The Opening)', totalAyahs: 7, revelationType: 'Meccan' },
  { number: 11, nameArabic: 'هُود (آيَةُ تَوْفِيق)', nameEnglish: "Hud (11:88 Thoufeek's Ayah)", totalAyahs: 1, revelationType: 'Meccan' },
  { number: 2, nameArabic: 'آيَةُ الْكُرْسِيّ (البَقَرَة)', nameEnglish: 'Ayat Al-Kursi (2:255)', totalAyahs: 1, revelationType: 'Medinan' },
  { number: 103, nameArabic: 'العَصْر', nameEnglish: 'Al-Asr (The Declining Day)', totalAyahs: 3, revelationType: 'Meccan' },
  { number: 108, nameArabic: 'الكَوْثَر', nameEnglish: 'Al-Kawthar (Abundance)', totalAyahs: 3, revelationType: 'Meccan' },
  { number: 112, nameArabic: 'الإِخْلَاص', nameEnglish: 'Al-Ikhlas (Sincerity / Unity)', totalAyahs: 4, revelationType: 'Meccan' },
  { number: 113, nameArabic: 'الفَلَق', nameEnglish: 'Al-Falaq (Daybreak)', totalAyahs: 5, revelationType: 'Meccan' },
  { number: 114, nameArabic: 'النَّاس', nameEnglish: 'An-Nas (Mankind)', totalAyahs: 6, revelationType: 'Meccan' },
];

export const QURAN_VERSES: AyahData[] = [
  // Surah Al-Fatiha (1:1 - 1:7)
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    audioAyahNumberOverall: 1,
    words: [
      { wordIndex: 1, arabic: 'بِسْمِ', transliteration: 'Bismi', english: 'In [the] name [of]', type: 'harf', root: 'س م و', caseEnding: 'majroor', caseExplanation: 'Compound of preposition Bi (بِ) + Ism (اسم). Ends with Kasrah because of Harf Jarr.' },
      { wordIndex: 2, arabic: 'اللَّهِ', transliteration: 'Allāhi', english: 'Allah', type: 'ism', root: 'أ ل ه', caseEnding: 'majroor', caseExplanation: 'Mudaf Ilayh (Possessor: "The name OF Allah"). Majroor with Kasrah.' },
      { wordIndex: 3, arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Raḥmāni', english: 'the Entirely Merciful', type: 'ism', root: 'ر ح م', caseEnding: 'majroor', caseExplanation: 'First descriptive adjective (Na\'t / Sifah) for Allah. Matches in Kasrah.' },
      { wordIndex: 4, arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raḥīmi', english: 'the Especially Merciful', type: 'ism', root: 'ر ح م', caseEnding: 'majroor', caseExplanation: 'Second descriptive adjective (Na\'t / Sifah) for Allah. Matches in Kasrah.' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 2,
    arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    englishTranslation: '[All] praise is [due] to Allah, Lord of the worlds.',
    audioAyahNumberOverall: 2,
    words: [
      { wordIndex: 1, arabic: 'الْحَمْدُ', transliteration: 'Al-ḥamdu', english: '[All] the praise', type: 'ism', root: 'ح م د', caseEnding: 'marfoo', caseExplanation: 'The subject / topic (Mubtada\') starting the nominal sentence. Takes Dammah.' },
      { wordIndex: 2, arabic: 'لِلَّهِ', transliteration: 'Lillāhi', english: '[is] for Allah', type: 'harf', root: 'أ ل ه', caseEnding: 'majroor', caseExplanation: 'Preposition Li (لِـ) meaning "belonging to" + Allah (Majroor with Kasrah).' },
      { wordIndex: 3, arabic: 'رَبِّ', transliteration: 'Rabbi', english: 'Lord / Sustainer', type: 'ism', root: 'ر ب ب', caseEnding: 'majroor', caseExplanation: 'Apposition / attribute (Badal or Na\'t) describing Allah. Mudaf to the next word.' },
      { wordIndex: 4, arabic: 'الْعَالَمِينَ', transliteration: 'Al-\'ālamīn', english: 'of all the worlds', type: 'ism', root: 'ع ل م', caseEnding: 'majroor', caseExplanation: 'Mudaf Ilayh. Majroor with the letter Yaa (ـين) because it is a sound masculine plural.' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 3,
    arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
    englishTranslation: 'The Entirely Merciful, the Especially Merciful.',
    audioAyahNumberOverall: 3,
    words: [
      { wordIndex: 1, arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Raḥmāni', english: 'The Entirely Merciful', type: 'ism', root: 'ر ح م', caseEnding: 'majroor', caseExplanation: 'Descriptive adjective for Lord of the worlds. Matches in Kasrah.' },
      { wordIndex: 2, arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raḥīmi', english: 'The Especially Merciful', type: 'ism', root: 'ر ح م', caseEnding: 'majroor', caseExplanation: 'Consecutive descriptive adjective. Matches in Kasrah.' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 4,
    arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
    englishTranslation: 'Sovereign of the Day of Recompense.',
    audioAyahNumberOverall: 4,
    words: [
      { wordIndex: 1, arabic: 'مَالِكِ', transliteration: 'Māliki', english: 'Master / Sovereign', type: 'ism', root: 'م ل ك', caseEnding: 'majroor', caseExplanation: 'Adjective / Badal for Allah. First word in a chained Idafah.' },
      { wordIndex: 2, arabic: 'يَوْمِ', transliteration: 'Yawmi', english: 'of [the] Day', type: 'ism', root: 'ي و م', caseEnding: 'majroor', caseExplanation: 'Mudaf Ilayh to Maliki (so it has Kasrah), and simultaneously Mudaf to ad-Deen.' },
      { wordIndex: 3, arabic: 'الدِّينِ', transliteration: 'Ad-dīni', english: 'of Judgment / Recompense', type: 'ism', root: 'د ي ن', caseEnding: 'majroor', caseExplanation: 'Final Mudaf Ilayh in the chain. Takes Kasrah.' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 5,
    arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    englishTranslation: 'It is You we worship and You we ask for help.',
    audioAyahNumberOverall: 5,
    words: [
      { wordIndex: 1, arabic: 'إِيَّاكَ', transliteration: 'Iyyāka', english: 'You alone', type: 'harf', root: '-', caseEnding: 'mansoob', caseExplanation: 'Detached objective pronoun. Placed first (Taqdeem) for exclusive devotion: "ONLY You!"' },
      { wordIndex: 2, arabic: 'نَعْبُدُ', transliteration: 'Na\'budu', english: 'we worship', type: 'fi\'l', root: 'ع ب د', caseEnding: 'marfoo', caseExplanation: 'Present tense verb (Mudari\'). Subject is implied "Nahnu" (we). Ends with Dammah.' },
      { wordIndex: 3, arabic: 'وَإِيَّاكَ', transliteration: 'Wa-Iyyāka', english: 'and You alone', type: 'harf', root: '-', caseEnding: 'mansoob', caseExplanation: 'Conjunction Wa (and) + exclusive pronoun Iyyaka.' },
      { wordIndex: 4, arabic: 'نَسْتَعِينُ', transliteration: 'Nasta\'īn', english: 'we seek assistance', type: 'fi\'l', root: 'ع و ن', caseEnding: 'marfoo', caseExplanation: 'Present tense Form X verb (asking for \'Awn / help).' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 6,
    arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    englishTranslation: 'Guide us to the straight path -',
    audioAyahNumberOverall: 6,
    words: [
      { wordIndex: 1, arabic: 'اهْدِنَا', transliteration: 'Ihdinā', english: 'Guide us!', type: 'fi\'l', root: 'هـ د ي', caseEnding: 'mabni', caseExplanation: 'Imperative verb of supplication (Ihdi) + attached object pronoun (Na = us).' },
      { wordIndex: 2, arabic: 'الصِّرَاطَ', transliteration: 'Aṣ-ṣirāṭa', english: 'the path', type: 'ism', root: 'ص ر ط', caseEnding: 'mansoob', caseExplanation: 'Second direct object (Maf\'ool Bihi Thani). Takes Fathah.' },
      { wordIndex: 3, arabic: 'الْمُسْتَقِيمَ', transliteration: 'Al-mustaqīm', english: 'the straight', type: 'ism', root: 'ق و م', caseEnding: 'mansoob', caseExplanation: 'Adjective (Sifah) matching as-Sirata in gender, definiteness, and Fathah.' },
    ],
  },
  {
    surahNumber: 1,
    surahNameArabic: 'الفَاتِحَة',
    surahNameEnglish: 'Al-Fatiha',
    ayahNumber: 7,
    arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    englishTranslation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    audioAyahNumberOverall: 7,
    words: [
      { wordIndex: 1, arabic: 'صِرَاطَ', transliteration: 'Ṣirāṭa', english: 'The path [of]', type: 'ism', root: 'ص ر ط', caseEnding: 'mansoob', caseExplanation: 'Substitutive clarification (Badal) for as-Sirat al-Mustaqeem.' },
      { wordIndex: 2, arabic: 'الَّذِينَ', transliteration: 'Alladhīna', english: 'those who', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Relative pronoun in place of Mudaf Ilayh (genitive position).' },
      { wordIndex: 3, arabic: 'أَنْعَمْتَ', transliteration: 'An\'amta', english: 'You bestowed favor', type: 'fi\'l', root: 'ن ع م', caseEnding: 'mabni', caseExplanation: 'Past tense verb (An\'ama) + subject pronoun (Ta = You).' },
      { wordIndex: 4, arabic: 'عَلَيْهِمْ', transliteration: '\'Alayhim', english: 'upon them', type: 'harf', root: '-', caseEnding: 'majroor', caseExplanation: 'Preposition \'Ala + pronoun Hum (them).' },
      { wordIndex: 5, arabic: 'غَيْرِ', transliteration: 'Ghayri', english: 'not [of]', type: 'ism', root: 'غ ي ر', caseEnding: 'majroor', caseExplanation: 'Badal / adjective in genitive state.' },
      { wordIndex: 6, arabic: 'الْمَغْضُوبِ', transliteration: 'Al-maghḍūbi', english: 'those who earned wrath', type: 'ism', root: 'غ ض ب', caseEnding: 'majroor', caseExplanation: 'Passive participle (Maf\'ool form) acting as Mudaf Ilayh with Kasrah.' },
      { wordIndex: 7, arabic: 'عَلَيْهِمْ', transliteration: '\'Alayhim', english: 'upon them', type: 'harf', root: '-', caseEnding: 'majroor', caseExplanation: 'Preposition + pronoun.' },
      { wordIndex: 8, arabic: 'وَلَا', transliteration: 'Wa-lā', english: 'and not', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Conjunction Wa + negative particle La.' },
      { wordIndex: 9, arabic: 'الضَّالِّينَ', transliteration: 'Aḍ-ḍāllīn', english: 'those who are astray', type: 'ism', root: 'ض ل ل', caseEnding: 'majroor', caseExplanation: 'Active participle plural. Conjoined in genitive case with Yaa. Contains Madd Lazim 6 counts!' },
    ],
  },

  // Ayat Al-Kursi (2:255)
  {
    surahNumber: 2,
    surahNameArabic: 'آيَةُ الْكُرْسِيّ',
    surahNameEnglish: 'Ayat Al-Kursi (2:255)',
    ayahNumber: 255,
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    englishTranslation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    audioAyahNumberOverall: 262,
    words: [
      { wordIndex: 1, arabic: 'اللَّهُ', transliteration: 'Allāhu', english: 'Allah', type: 'ism', root: 'أ ل ه', caseEnding: 'marfoo', caseExplanation: 'Topic / Subject (Mubtada\') with Dammah.' },
      { wordIndex: 2, arabic: 'لَا إِلَٰهَ', transliteration: 'Lā ilāha', english: 'No deity', type: 'harf', root: 'أ ل ه', caseEnding: 'mansoob', caseExplanation: 'Absolute negative particle (La an-Nafiyah lil-Jins) making Ilaha take Fatha.' },
      { wordIndex: 3, arabic: 'إِلَّا هُوَ', transliteration: 'Illā Huwa', english: 'except Him', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Particle of exception + pronoun Huwa.' },
      { wordIndex: 4, arabic: 'الْحَيُّ', transliteration: 'Al-Ḥayyu', english: 'The Ever-Living', type: 'ism', root: 'ح ي ي', caseEnding: 'marfoo', caseExplanation: 'Divine name predicate / attribute with Dammah.' },
      { wordIndex: 5, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyūmu', english: 'The Self-Sustaining', type: 'ism', root: 'ق و م', caseEnding: 'marfoo', caseExplanation: 'Intensive Form divine attribute with Dammah.' },
      { wordIndex: 6, arabic: 'لَا تَأْخُذُهُ', transliteration: 'Lā ta\'khudhuh', english: 'Does not seize Him', type: 'fi\'l', root: 'أ خ ذ', caseEnding: 'marfoo', caseExplanation: 'Negative particle + present verb with attached pronoun Hu.' },
      { wordIndex: 7, arabic: 'سِنَةٌ', transliteration: 'Sinatun', english: 'Drowsiness / slumber', type: 'ism', root: 'و س ن', caseEnding: 'marfoo', caseExplanation: 'The subject (Faa\'il) that would seize. Takes Tanween Damm.' },
      { wordIndex: 8, arabic: 'وَلَا نَوْمٌ', transliteration: 'Wa-lā nawm', english: 'nor sleep', type: 'ism', root: 'ن و م', caseEnding: 'marfoo', caseExplanation: 'Conjoined subject with Tanween Damm.' },
      { wordIndex: 9, arabic: 'وَهُوَ الْعَلِيُّ الْعَظِيمُ', transliteration: 'Wa Huwal \'Aliyyul \'Azeem', english: 'And He is the Most High, the Most Great', type: 'ism', root: 'ع ل و', caseEnding: 'marfoo', caseExplanation: 'Pronoun + two magnificent exalted divine attributes ending with Dammah.' },
    ],
  },

  // Surah Al-Ikhlas (112:1 - 112:4)
  {
    surahNumber: 112,
    surahNameArabic: 'الإِخْلَاص',
    surahNameEnglish: 'Al-Ikhlas',
    ayahNumber: 1,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    englishTranslation: 'Say, "He is Allah, [who is] One."',
    audioAyahNumberOverall: 6222,
    words: [
      { wordIndex: 1, arabic: 'قُلْ', transliteration: 'Qul', english: 'Say!', type: 'fi\'l', root: 'ق و ل', caseEnding: 'mabni', caseExplanation: 'Imperative command verb (Amr) with Sukun.' },
      { wordIndex: 2, arabic: 'هُوَ', transliteration: 'Huwa', english: 'He is', type: 'pronoun' as any, root: '-', caseEnding: 'mabni', caseExplanation: 'Subject pronoun (Mubtada\').' },
      { wordIndex: 3, arabic: 'اللَّهُ', transliteration: 'Allāhu', english: 'Allah', type: 'ism', root: 'أ ل ه', caseEnding: 'marfoo', caseExplanation: 'The supreme divine name, predicate or apposition with Dammah.' },
      { wordIndex: 4, arabic: 'أَحَدٌ', transliteration: 'Aḥad', english: 'One / Absolute Unique', type: 'ism', root: 'أ ح د', caseEnding: 'marfoo', caseExplanation: 'Predicate (Khabar) with Tanween Damm. Qalqalah on Daal when stopping!' },
    ],
  },
  {
    surahNumber: 112,
    surahNameArabic: 'الإِخْلَاص',
    surahNameEnglish: 'Al-Ikhlas',
    ayahNumber: 2,
    arabicText: 'اللَّهُ الصَّمَدُ',
    englishTranslation: 'Allah, the Eternal Refuge.',
    audioAyahNumberOverall: 6223,
    words: [
      { wordIndex: 1, arabic: 'اللَّهُ', transliteration: 'Allāhu', english: 'Allah', type: 'ism', root: 'أ ل ه', caseEnding: 'marfoo', caseExplanation: 'Subject with Dammah.' },
      { wordIndex: 2, arabic: 'الصَّمَدُ', transliteration: 'Aṣ-Ṣamadu', english: 'The Eternal / Self-Sufficient upon whom all rely', type: 'ism', root: 'ص م د', caseEnding: 'marfoo', caseExplanation: 'Predicate with Dammah. Qalqalah on Daal when stopping.' },
    ],
  },
  {
    surahNumber: 112,
    surahNameArabic: 'الإِخْلَاص',
    surahNameEnglish: 'Al-Ikhlas',
    ayahNumber: 3,
    arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    englishTranslation: 'He neither begets nor is born,',
    audioAyahNumberOverall: 6224,
    words: [
      { wordIndex: 1, arabic: 'لَمْ', transliteration: 'Lam', english: 'Not', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Particle of negative past jussive (Harf Jazm).' },
      { wordIndex: 2, arabic: 'يَلِدْ', transliteration: 'Yalid', english: 'He begets', type: 'fi\'l', root: 'و ل د', caseEnding: 'mabni', caseExplanation: 'Present active verb made Majzoom with Sukun. Qalqalah on Daal.' },
      { wordIndex: 3, arabic: 'وَلَمْ', transliteration: 'Wa-lam', english: 'and not', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Conjunction + particle of jazm.' },
      { wordIndex: 4, arabic: 'يُولَدْ', transliteration: 'Yūlad', english: 'is He begotten', type: 'fi\'l', root: 'و ل د', caseEnding: 'mabni', caseExplanation: 'Present passive verb made Majzoom with Sukun. Qalqalah on Daal.' },
    ],
  },
  {
    surahNumber: 112,
    surahNameArabic: 'الإِخْلَاص',
    surahNameEnglish: 'Al-Ikhlas',
    ayahNumber: 4,
    arabicText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    englishTranslation: 'Nor is there to Him any equivalent.',
    audioAyahNumberOverall: 6225,
    words: [
      { wordIndex: 1, arabic: 'وَلَمْ يَكُن', transliteration: 'Wa-lam yakun', english: 'And there was not', type: 'fi\'l', root: 'ك و ن', caseEnding: 'mabni', caseExplanation: 'Incomplete verb of being (Kana) made Majzoom. Idgham without Ghunnah with next letter Laam!' },
      { wordIndex: 2, arabic: 'لَّهُ', transliteration: 'Lahū', english: 'unto Him', type: 'harf', root: '-', caseEnding: 'majroor', caseExplanation: 'Preposition Li + pronoun.' },
      { wordIndex: 3, arabic: 'كُفُوًا', transliteration: 'Kufuwan', english: 'an equal / co-equivalent', type: 'ism', root: 'ك ف أ', caseEnding: 'mansoob', caseExplanation: 'Predicate of Kana (Khabar Kana Muqaddam) with Tanween Fath. Izhar Halqi with next letter Hamzah.' },
      { wordIndex: 4, arabic: 'أَحَدٌ', transliteration: 'Aḥad', english: 'anyone', type: 'ism', root: 'أ ح د', caseEnding: 'marfoo', caseExplanation: 'Subject of Kana (Ism Kana Mu\'akhkhar) with Tanween Damm. Qalqalah Kubra on Daal.' },
    ],
  },

  // Surah Al-Kawthar (108:1 - 108:3)
  {
    surahNumber: 108,
    surahNameArabic: 'الكَوْثَر',
    surahNameEnglish: 'Al-Kawthar',
    ayahNumber: 1,
    arabicText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    englishTranslation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
    audioAyahNumberOverall: 6205,
    words: [
      { wordIndex: 1, arabic: 'إِنَّا', transliteration: 'Innā', english: 'Indeed We', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Emphatic particle Inna + Royal Plural Na. Madd Munfasil 4-5 counts!' },
      { wordIndex: 2, arabic: 'أَعْطَيْنَاكَ', transliteration: 'A\'ṭaynāka', english: 'We have given you', type: 'fi\'l', root: 'ع ط و', caseEnding: 'mabni', caseExplanation: 'Past verb Form IV + We (subject) + you (first object).' },
      { wordIndex: 3, arabic: 'الْكَوْثَرَ', transliteration: 'Al-Kawthara', english: 'The Abundant Goodness / The River of Jannah', type: 'ism', root: 'ك ث ر', caseEnding: 'mansoob', caseExplanation: 'Second direct object (Maf\'ool Bihi Thani) taking Fatha.' },
    ],
  },
  {
    surahNumber: 108,
    surahNameArabic: 'الكَوْثَر',
    surahNameEnglish: 'Al-Kawthar',
    ayahNumber: 2,
    arabicText: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    englishTranslation: 'So pray to your Lord and sacrifice [to Him alone].',
    audioAyahNumberOverall: 6206,
    words: [
      { wordIndex: 1, arabic: 'فَصَلِّ', transliteration: 'Fa-ṣalli', english: 'So pray!', type: 'fi\'l', root: 'ص ل و', caseEnding: 'mabni', caseExplanation: 'Connecting Fa + Imperative verb Salli (ends with Kasra, defective root dropped).' },
      { wordIndex: 2, arabic: 'لِرَبِّكَ', transliteration: 'Li-rabbika', english: 'to your Lord', type: 'harf', root: 'ر ب ب', caseEnding: 'majroor', caseExplanation: 'Preposition Li + Rabb (Majroor with Kasrah) + your (pronoun Ka).' },
      { wordIndex: 3, arabic: 'وَانْحَرْ', transliteration: 'Wan-ḥar', english: 'and sacrifice!', type: 'fi\'l', root: 'ن ح ر', caseEnding: 'mabni', caseExplanation: 'Conjunction Wa + imperative verb Inhar (slaughter offering).' },
    ],
  },
  {
    surahNumber: 108,
    surahNameArabic: 'الكَوْثَر',
    surahNameEnglish: 'Al-Kawthar',
    ayahNumber: 3,
    arabicText: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    englishTranslation: 'Indeed, your enemy is the one cut off.',
    audioAyahNumberOverall: 6207,
    words: [
      { wordIndex: 1, arabic: 'إِنَّ', transliteration: 'Inna', english: 'Indeed', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Particle that puts following noun into Mansoob state.' },
      { wordIndex: 2, arabic: 'شَانِئَكَ', transliteration: 'Shāni\'aka', english: 'your hater / enemy', type: 'ism', root: 'ش ن أ', caseEnding: 'mansoob', caseExplanation: 'Ism Inna with Fathah + Ka pronoun.' },
      { wordIndex: 3, arabic: 'هُوَ', transliteration: 'Huwa', english: 'he is', type: 'pronoun' as any, root: '-', caseEnding: 'mabni', caseExplanation: 'Separating pronoun (Fasl).' },
      { wordIndex: 4, arabic: 'الْأَبْتَرُ', transliteration: 'Al-Abtar', english: 'the one cut off [from all good and posterity]', type: 'ism', root: 'ب ت ر', caseEnding: 'marfoo', caseExplanation: 'Predicate of Inna (Khabar Inna) with Dammah. Qalqalah on Baa!' },
    ],
  },

  // Surah Hud 11:88 - Thoufeek's Namesake Ayah
  {
    surahNumber: 11,
    surahNameArabic: 'هُود',
    surahNameEnglish: 'Hud',
    ayahNumber: 88,
    arabicText: 'وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ، عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ',
    englishTranslation: 'And my success (Tawfeeq / Thoufeek) is not but through Allah. Upon Him I have relied, and to Him I return.',
    audioAyahNumberOverall: 1561,
    words: [
      { wordIndex: 1, arabic: 'وَمَا', transliteration: 'Wa-mā', english: 'And not', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Wa (conjunction) + Mā (particle of negation). Sets up the exceptional sentence structure.' },
      { wordIndex: 2, arabic: 'تَوْفِيقِي', transliteration: 'Tawfīqī (Thoufeek)', english: 'my success / divine facilitation', type: 'ism', root: 'و ف ق', caseEnding: 'marfoo', caseExplanation: 'Mubtada\' (Subject). The root و-ف-ق means alignment and success granted by Allah. Yaa indicates 1st person possessive.' },
      { wordIndex: 3, arabic: 'إِلَّا', transliteration: 'Illā', english: 'except / but', type: 'harf', root: '-', caseEnding: 'mabni', caseExplanation: 'Tool of restriction (Adāt al-Ḥaṣr), creating an emphatic positive meaning.' },
      { wordIndex: 4, arabic: 'بِاللَّهِ', transliteration: 'Billāh', english: 'through Allah', type: 'harf', root: 'أ ل ه', caseEnding: 'majroor', caseExplanation: 'Preposition Bi (بِـ) meaning "by/through" + Allah. Acts as the predicate (Khabar).' },
      { wordIndex: 5, arabic: 'عَلَيْهِ', transliteration: '\'Alayhi', english: 'upon Him [alone]', type: 'harf', root: '-', caseEnding: 'majroor', caseExplanation: 'Preposition \'Alā + pronoun Hu. Brought forward (Taqdeem) for exclusive devotion.' },
      { wordIndex: 6, arabic: 'تَوَكَّلْتُ', transliteration: 'Tawakkaltu', english: 'I have relied', type: 'fi\'l', root: 'و ك ل', caseEnding: 'mabni', caseExplanation: 'Past verb Form V (Tafa\'\'ala) + Tu (1st person subject: "I"). Indicates unwavering trust.' },
      { wordIndex: 7, arabic: 'وَإِلَيْهِ', transliteration: 'Wa-ilayhi', english: 'and unto Him', type: 'harf', root: '-', caseEnding: 'majroor', caseExplanation: 'Conjunction Wa + Ilā (to) + pronoun Hu (Him).' },
      { wordIndex: 8, arabic: 'أُنِيبُ', transliteration: 'Unīb', english: 'I return in repentance', type: 'fi\'l', root: 'ن و ب', caseEnding: 'marfoo', caseExplanation: 'Present tense verb (Fi\'l Mudari\') with Dammah on the Baa, showing continuous returning to Allah.' },
    ],
  },
];
