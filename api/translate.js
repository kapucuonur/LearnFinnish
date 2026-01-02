// api/translate.js - Free translation using MyMemory API (10K words/day, no API key)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { text, context } = req.body;

  console.log('Translation request received:', { text, context });

  // Validate required fields
  if (!text || text.trim() === '') {
    console.error('Translation error: No text provided');
    return res.status(400).json({
      translation: 'Error',
      details: 'No text provided for translation'
    });
  }

  try {
    // Use MyMemory Translation API (free, 10K words/day, no API key)
    // API docs: https://mymemory.translated.net/doc/spec.php
    const encodedText = encodeURIComponent(text.trim());
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fi|en`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`MyMemory API returned ${response.status}`);
    }

    const data = await response.json();

    // Check if translation was successful
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed');
    }

    let translation = data.responseData.translatedText.trim();

    // Clean up the response - remove quotes, periods, extra whitespace
    translation = translation
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/\.$/, '') // Remove trailing period
      .trim();

    // If response is too long (more than 50 chars), take first few words
    if (translation.length > 50) {
      const words = translation.split(/\s+/);
      translation = words.slice(0, 3).join(' ');
    }

    res.status(200).json({ translation });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({
      translation: 'Error',
      details: err.message
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};