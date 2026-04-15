import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.post('/', async (req, res) => {
  const { text, context } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ translation: 'Error', details: 'No text provided' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const translation = await translateWithGemini(text, context, geminiKey);
      return res.status(200).json({ translation });
    } catch (err) {
      console.warn('Gemini failed, switching to MyMemory fallback:', err.message);
    }
  }

  try {
    const translation = await translateWithMyMemory(text);
    return res.status(200).json({ translation });
  } catch (err) {
    console.error('All translation services failed:', err);
    return res.status(500).json({ translation: 'Error', details: 'Translation failed' });
  }
});

async function translateWithGemini(text, context, apiKey) {
  const prompt = context && context.length > text.length
    ? `Given Finnish sentence: "${context}". Translate ONLY word "${text}" to English. No explanations.`
    : `Translate Finnish word "${text}" to English. Output ONLY the translation.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const result = await model.generateContent(prompt);
  let translation = result.response.text().trim()
    .replace(/^[\"']|[\"']$/g, '').replace(/\.$/, '').trim();
  if (translation.length > 50) translation = translation.split(/\s+/).slice(0, 3).join(' ');
  return translation;
}

async function translateWithMyMemory(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=fi|en`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`MyMemory status ${response.status}`);
  const data = await response.json();
  if (data.responseStatus !== 200) throw new Error(data.responseDetails);
  let result = data.responseData.translatedText.trim()
    .replace(/^[\"']|[\"']$/g, '').replace(/\.$/, '').trim();
  if (result.length > 50) result = result.split(/\s+/).slice(0, 3).join(' ');
  return result;
}

export default router;
