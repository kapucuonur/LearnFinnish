// api/translate.js - Context-aware word translation using Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil, context } = req.body;
  const targetLanguage = hedefDil === 'tr' ? 'Turkish' : 'English';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a prompt that asks for ONLY the word's translation in context
    const prompt = context && context.length > kelime.length
      ? `Given this Finnish sentence: "${context}"

Translate ONLY the word "${kelime}" to ${targetLanguage} based on how it's used in this sentence.

Rules:
- Provide ONLY the translation (1-3 words maximum)
- Consider the word's meaning in this specific context
- Do NOT translate the entire sentence
- Do NOT add explanations or extra text
- Just the word's meaning, nothing else

Translation:`
      : `Translate this Finnish word to ${targetLanguage}: "${kelime}"

Provide ONLY the translation (1-3 words maximum), nothing else.

Translation:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let translation = response.text().trim();

    // Clean up the response - remove quotes, periods, extra whitespace
    translation = translation
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/\.$/, '') // Remove trailing period
      .trim();

    // If response is too long (more than 50 chars), it's probably not just the word
    if (translation.length > 50) {
      // Fallback: take first few words
      const words = translation.split(/\s+/);
      translation = words.slice(0, 3).join(' ');
    }

    res.status(200).json({ translation });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({
      translation: hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error'
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};