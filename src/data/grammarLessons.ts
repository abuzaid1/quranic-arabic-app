import { GrammarTopic } from '../types/index';

export const GRAMMAR_LESSONS: GrammarTopic[] = [
  {
    id: 'parts_of_speech',
    title: 'The 3 Parts of Speech (Kalimah)',
    arabicTitle: 'أَقْسَامُ الْكَلَامِ',
    difficulty: 'Beginner',
    summary: 'Every single word in the entire Holy Quran belongs to only one of three categories: Ism (Noun/Adjective), Fi\'l (Verb), or Harf (Particle).',
    coreRule: '1. ISM (اسْم): Person, place, thing, adjective, idea. Signs: Accepts "Al-" (ال), Tanween (ـٌ ـً ـٍ), or Ta Marbutah (ة).\n2. FI\'L (فِعْل): An action locked in time (past, present, command).\n3. HARF (حَرْف): A particle that makes full sense only when paired with other words (e.g. فِي, مِنْ, عَلَى, لَا, إِنَّ).',
    keyQuranExamples: [
      {
        arabic: 'الْكِتَابُ',
        english: 'The Book',
        analysis: 'Ism because it has the definite prefix "Al-" (ال).',
        ayahRef: 'Al-Baqarah 2:2',
      },
      {
        arabic: 'خَلَقَ',
        english: 'He created',
        analysis: 'Fi\'l (past tense verb) indicating action in the past.',
        ayahRef: 'Al-\'Alaq 96:1',
      },
      {
        arabic: 'فِي',
        english: 'In',
        analysis: 'Harf (preposition) which connects ideas and places nouns into the Majroor state.',
        ayahRef: 'Al-Baqarah 2:2',
      },
    ],
    practiceQuestions: [
      {
        id: 'q1',
        prompt: 'Which category does the word "الرَّحْمَٰن" belong to?',
        options: ['Ism (Noun / Divine Attribute)', 'Fi\'l (Verb)', 'Harf (Particle)'],
        correctIndex: 0,
        explanation: 'It starts with "Al-" (ال), which is a definitive sign of an Ism!',
      },
      {
        id: 'q2',
        prompt: 'What part of speech is "مِنْ" (From / Among)?',
        options: ['Fi\'l (Verb)', 'Harf (Particle)', 'Ism (Noun)'],
        correctIndex: 1,
        explanation: 'Min is a Harf (preposition), one of the Huroof al-Jarr.',
      },
      {
        id: 'q3',
        prompt: 'What type of word is "عَلِمَ" (He knew)?',
        options: ['Harf', 'Ism', 'Fi\'l (Past Verb)'],
        correctIndex: 2,
        explanation: 'It is a past-tense verb showing the action of knowing in the past.',
      },
    ],
  },
  {
    id: 'three_cases',
    title: 'The 3 Grammatical Cases (I\'rab)',
    arabicTitle: 'حَالَاتُ الْإِعْرَابِ الثَّلَاث',
    difficulty: 'Intermediate',
    summary: 'Arabic vowel endings change to reveal WHO is doing WHAT in the Quran. Learn Dammah (Marfoo\'), Fathah (Mansoob), and Kasrah (Majroor).',
    coreRule: '1. MARFOO\' (مَرْفُوع) -> Usually ends in Dammah (ـُ / ـٌ). This is the Doer / Subject (Faa\'il) or Topic (Mubtada\').\n2. MANSOOB (مَنْصُوب) -> Usually ends in Fathah (ـَ / ـً). This is the Object / Detail (Maf\'ool) or adverb of condition.\n3. MAJROOR (مَجْرُور) -> Usually ends in Kasrah (ـِ / ـٍ). This occurs after a Preposition (Harf Jarr) or as the second word in possession (Idafah).',
    keyQuranExamples: [
      {
        arabic: 'خَلَقَ اللَّهُ السَّمَاوَاتِ',
        english: 'Allah created the heavens',
        analysis: 'Allāhu ends with Dammah because Allah is the Creator (Doer / Subject). As-Samāwāti is the object receiving creation.',
        ayahRef: 'Al-\'Ankabut 29:44',
      },
      {
        arabic: 'بِسْمِ اللَّهِ',
        english: 'In the name of Allah',
        analysis: 'Bismi ends with Kasrah due to Bi (in), and Allahi ends with Kasrah because it is Mudaf Ilayh (Possessor).',
        ayahRef: 'Al-Fatiha 1:1',
      },
    ],
    practiceQuestions: [
      {
        id: 'tc_q1',
        prompt: 'Why does "اللَّهُ" have a Dammah (ـُ) in "قَالَ اللَّهُ"?',
        options: [
          'Because Allah is the Doer / Speaker (Subject / Faa\'il)',
          'Because of a preposition',
          'Because it is an object receiving action',
        ],
        correctIndex: 0,
        explanation: 'In Arabic, the doer of an action (Faa\'il) is always in the Marfoo\' state, marked by Dammah.',
      },
      {
        id: 'tc_q2',
        prompt: 'What ending does a noun take when it comes directly after "فِي" (In)?',
        options: ['Fathah (ـَ)', 'Kasrah (ـِ)', 'Sukun (ـْ)'],
        correctIndex: 1,
        explanation: 'Prepositions (Huroof Jarr) always pull the following noun into the Majroor state, usually with Kasrah.',
      },
    ],
  },
  {
    id: 'idafah_possessive',
    title: 'Idafah: The Quranic Possessive Construction',
    arabicTitle: 'الْإِضَافَةُ فِي الْقُرْآنِ',
    difficulty: 'Intermediate',
    summary: 'The phrase "X of Y" (e.g. Messenger of Allah, Book of Allah, House of Allah) is one of the most frequent constructions in the Holy Quran.',
    coreRule: 'Formula: [Mudaf] + [Mudaf Ilayh]\n• Rule 1: The first word (Mudaf) CANNOT have "Al-" and CANNOT have Tanween.\n• Rule 2: The second word (Mudaf Ilayh) is ALWAYS Majroor (Kasrah).\n• Example: رَسُولُ اللَّهِ (Rasoolu-llah) = Messenger OF Allah.',
    keyQuranExamples: [
      {
        arabic: 'بَيْتُ اللَّهِ',
        english: 'The House of Allah (The Ka\'bah)',
        analysis: 'Baytu (no Al, no Tanween) + Allahi (Kasrah).',
        ayahRef: 'Al-Baqarah 2:125',
      },
      {
        arabic: 'يَوْمِ الدِّينِ',
        english: 'Day of Judgment',
        analysis: 'Yawmi (no Tanween) + ad-Deeni (Kasrah).',
        ayahRef: 'Al-Fatiha 1:4',
      },
      {
        arabic: 'كِتَابَ اللَّهِ',
        english: 'The Book of Allah',
        analysis: 'Kitaba (Mudaf) + Allahi (Mudaf Ilayh with Kasrah).',
        ayahRef: 'An-Nisa 4:24',
      },
    ],
    practiceQuestions: [
      {
        id: 'id_q1',
        prompt: 'Can the first word in an Idafah (Mudaf) have Tanween (ـٌ / ـً / ـٍ)?',
        options: ['Never! Tanween drops in Idafah', 'Yes, always', 'Only if it is feminine'],
        correctIndex: 0,
        explanation: 'The Mudaf loses both Tanween and the Al- prefix.',
      },
      {
        id: 'id_q2',
        prompt: 'What case is the second word (Mudaf Ilayh) in "رَبِّ الْعَالَمِينَ"?',
        options: ['Mansoob (Fatha)', 'Marfoo\' (Damma)', 'Majroor (Genitive / Kasra or Yaa)'],
        correctIndex: 2,
        explanation: 'The Mudaf Ilayh is always Majroor (Al-\'Alameen ends in -een, the plural genitive ending).',
      },
    ],
  },
  {
    id: 'verb_tenses',
    title: 'Quranic Verbs (Madi, Mudari\', Amr)',
    arabicTitle: 'الْأَفْعَالُ فِي الْقُرْآنِ',
    difficulty: 'Intermediate',
    summary: 'Arabic verbs are built on 3-letter roots. The 3 main tenses in the Quran are Madi (Past), Mudari\' (Present / Continuous), and Amr (Command).',
    coreRule: '1. MĀDĪ (مَاضِي): Past action, e.g. خَلَقَ (He created), قَالَ (He said).\n2. MUḌĀRI\' (مُضَارِع): Present/Future/Continuous action, prefixed with (يـ / تـ / أ / نـ), e.g. يَعْلَمُ (He knows), نَعْبُدُ (We worship).\n3. AMR (أَمْر): Command or supplication to Allah, e.g. اقْرَأْ (Recite!), اهْدِنَا (Guide us!).',
    keyQuranExamples: [
      {
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        english: 'Recite in the name of your Lord who created',
        analysis: 'Iqra\' is Amr (command verb). Khalaqa is Madi (past verb).',
        ayahRef: 'Al-\'Alaq 96:1',
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ',
        english: 'You alone we worship',
        analysis: 'Na\'budu is Mudari\' (present tense, 1st person plural "we").',
        ayahRef: 'Al-Fatiha 1:5',
      },
    ],
    practiceQuestions: [
      {
        id: 'v_q1',
        prompt: 'In "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", what type of verb is "اهْدِ" (Guide!)?',
        options: ['Amr (Command / Supplication)', 'Madi (Past)', 'Mudari\' (Present)'],
        correctIndex: 0,
        explanation: 'When addressing Allah, the imperative verb (Amr) carries the sublime meaning of sincere supplication (Du\'a).',
      },
    ],
  },
];
