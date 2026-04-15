import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'Word is required' });

  const prompt = `Write a simple Finnish example sentence (B1 level) using the word "${word}". Also provide the English translation. Return ONLY JSON: { "sentence": "Finnish sentence here", "translation": "English translation here" }. No markdown.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing Gemini API Key');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Example generation error:', error);
    res.status(500).json({
      error: 'Failed to generate example',
      fallback: {
        sentence: `Tämä on esimerkki sanalle "${word}".`,
        translation: `This is an example for the word "${word}".`,
      },
    });
  }
});

export default router;
