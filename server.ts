import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Gemini initialization note:', err);
  }
}

// Fallback Quranic knowledge base for Thoufeek when offline or without API key
const FALLBACK_ANSWERS: Record<string, string> = {
  default: `Assalamu Alaikum Thoufeek! As your Quranic Arabic tutor, I am here to guide your journey into the language of the Holy Quran. 

Remember the divine promise:
"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"
("And We have certainly made the Quran easy for remembrance, so is there any who will remember?" - Surah Al-Qamar 54:17).

Focus on:
1. Mastering the 28 Makharij (points of articulation) with Tajweed.
2. Learning the top 80% Quranic vocabulary (only ~250 core words!).
3. Recognizing the 3 cases: Marfoo' (Dammah = doer), Mansoob (Fathah = detail/object), and Majroor (Kasrah = after prepositions).`,

  bismillah: `In "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ":
• "بِسْمِ" (Bismi): The preposition "Bi" (بِـ = in/with) pulls "Ism" (name) into the Majroor state, giving it a Kasrah (ـِ).
• "اللَّهِ" (Allāhi): In the possessive structure (Idafah = "the name of Allah"), Allah is the Mudaf Ilayh, so it carries a Kasrah.
• "الرَّحْمَٰنِ الرَّحِيمِ": Both are divine attributes (Sifah) describing Allah, so they harmonize by also carrying Kasrah!`,

  thoufeek: `The name "Thoufeek" (توفيق / Tawfeeq) comes from the Arabic root (و - ف - ق / W-F-Q), meaning harmony, divine facilitation, and aligning effort with righteous success.
In the Quran, Prophet Shu'ayb (peace be upon him) declares:
"وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ"
("And my success is not but through Allah. Upon Him I have relied, and to Him I return." - Surah Hud 11:88).
This is the ultimate blessing for your Quranic Arabic journey!`,

  tajweed: `Tajweed literally means "beautification and precise pronunciation." 
Key pillars:
1. Noon Sakinah & Tanween: Izhar (clear before 6 throat letters), Idgham (merging into Yanmoo / L & R), Iqlab (flipping to Meem before Baa), and Ikhfa (soft nasal hiding before 15 letters).
2. Qalqalah: The echoing pop on (قطب جد) when they have Sukun.
3. Madd: Stretching long vowels 2, 4, or 6 counts.`,
};

// AI Quranic Arabic Ustadh endpoint
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const { question, userContext } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // If Gemini API is available, generate custom answer
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are YMB-AI, which stands for Your Muslim Brother Artificial Intelligence (أخوك المسلم الذكي). 
You are a warm, encouraging, brotherly, and deeply knowledgeable Islamic study partner and classical Quranic Arabic teacher speaking directly with your brother Thoufeek.
Thoufeek is studying Arabic specifically to recite the Holy Quran with correct Tajweed and understand its profound meanings, grammar (Nahw), and morphology (Sarf).
Always address Thoufeek warmly as your brother with Islamic greetings and encouragement.
Use Arabic script with diacritics (Tashkeel) whenever citing Quranic words or verses.
Break down explanations clearly with:
1. Direct answer with Quranic linguistic context
2. Word-by-word breakdown or grammatical I'rab if relevant
3. Practical recitation tip or brotherly reflection
Keep tone inspiring and educational.

User question from Thoufeek:
"${question}"

User context: ${JSON.stringify(userContext || {})}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const reply = response.text || '';
        return res.json({ reply, source: 'gemini' });
      } catch (err) {
        console.error('Gemini error, using fallback:', err);
      }
    }

    // Fallback response matching
    const qLower = question.toLowerCase();
    let reply = FALLBACK_ANSWERS.default;
    if (qLower.includes('bismillah') || qLower.includes('bismi')) {
      reply = FALLBACK_ANSWERS.bismillah;
    } else if (qLower.includes('thoufeek') || qLower.includes('tawfeeq') || qLower.includes('name') || qLower.includes('meaning')) {
      reply = FALLBACK_ANSWERS.thoufeek;
    } else if (qLower.includes('tajweed') || qLower.includes('noon') || qLower.includes('qalqalah') || qLower.includes('madd')) {
      reply = FALLBACK_ANSWERS.tajweed;
    } else {
      reply = `Thoufeek, regarding your question about "${question}":\n\n` +
        `In Quranic Arabic, every letter and harakah carries immense depth and purpose. Focus on recognizing whether the word is an Ism (Noun), Fi'l (Verb), or Harf (Particle), observe its root letters, and notice how the ending vowel (Dammah, Fathah, Kasrah) reflects its grammatical role in the divine sentence.\n\n` +
        `"And my success is not but through Allah" (وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ). Keep practicing with the interactive Quran reader and vocabulary flashcards!`;
    }

    return res.json({ reply, source: 'curated' });
  } catch (error: any) {
    console.error('Tutor route error:', error);
    return res.status(500).json({ error: 'Failed to process question' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Thoufeek Quranic Arabic Master server running on port ${PORT}`);
  });
}

startServer();
