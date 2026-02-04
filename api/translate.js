// api/translate.js - Hybrid Translation: Gemini (Primary) -> MyMemory (Fallback)
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { text, context } = req.body;

  console.log('Translation req:', { text, context: !!context });

  if (!text || text.trim() === '') {
    return res.status(400).json({ translation: 'Error', details: 'No text' });
  }

  // 1. Try Gemini (Smart, Context-aware) - 1,500 req/day free
  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const translation = await translateWithGemini(text, context);
      console.log('Gemini translation success');
      return res.status(200).json({ translation });
    } catch (err) {
      console.warn('Gemini failed, switching to fallback:', err.message);
      // Fall through to MyMemory...
    }
  }

  // 2. Fallback: MyMemory API (Generic, High volume) - 10,000 req/day free
  try {
    const translation = await translateWithMyMemory(text);
    console.log('MyMemory translation success');
    return res.status(200).json({ translation });
  } catch (err) {
    console.error('All translation services failed:', err);
    return res.status(500).json({ translation: 'Error', details: 'Translation failed' });
  }
}

// --- Helper Functions ---

async function translateWithGemini(text, context) {
  const targetLanguage = 'English';
  const prompt = context && context.length > text.length
    ? `Given Finnish sentence: "${context}". Translate ONLY word "${text}" to ${targetLanguage}. No explanations.`
    : `Translate Finnish word "${text}" to ${targetLanguage}. Output ONLY the translation.`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let translation = response.text().trim();

  // Clean up
  translation = translation.replace(/^["']|["']$/g, '').replace(/\.$/, '').trim();

  // Validate length
  if (translation.length > 50) translation = translation.split(/\s+/).slice(0, 3).join(' ');
  return translation;
}

async function translateWithMyMemory(text) {
  const encodedText = encodeURIComponent(text.trim());
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fi|en`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`MyMemory status ${response.status}`);

  const data = await response.json();
  if (data.responseStatus !== 200) throw new Error(data.responseDetails);

  let result = data.responseData.translatedText.trim();

  // Clean up
  result = result.replace(/^["']|["']$/g, '').replace(/\.$/, '').trim();
  if (result.length > 50) result = result.split(/\s+/).slice(0, 3).join(' ');
  return result;
}

export const config = {
  api: { bodyParser: true },
};