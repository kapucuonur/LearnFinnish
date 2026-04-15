import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.get('/', async (req, res) => {
  const { topic, difficulty, level, count } = req.query;
  const numWords = count || 40;
  const diffLevel = level || difficulty || 'A1';

  if (!topic) return res.status(400).json({ error: 'Missing topic' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server API Key is missing.' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate ${numWords} Finnish words related to "${topic}" at ${diffLevel} level.
    Return ONLY a raw JSON array (no markdown) in this format:
    [{"word": "FinnishWord", "translation": "EnglishTranslation", "example_sentence": "A simple Finnish sentence using the word."}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

export default router;
