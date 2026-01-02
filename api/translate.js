// api/translate.js - Hybrid Translation: Gemini (Primary) -> MyMemory (Fallback)
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
  if (process.env.GEMINI_API_KEY) {
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    // Throw error to trigger fallback
    throw new Error(`Gemini status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  let result = data.candidates[0].content.parts[0].text.trim();

  // Clean up
  result = result.replace(/^["']|["']$/g, '').replace(/\.$/, '').trim();

  // Validate length
  if (result.length > 50) result = result.split(/\s+/).slice(0, 3).join(' ');
  return result;
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