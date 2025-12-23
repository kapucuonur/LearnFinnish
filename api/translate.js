// api/translate.js - Official Google Cloud Translation API (better quality, requires API key)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil } = req.body;

  const target = hedefDil === 'tr' ? 'tr' : 'en';

  try {
    // Check if API key is configured
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      console.error('GOOGLE_TRANSLATE_API_KEY not configured');
      return res.status(500).json({
        translation: hedefDil === 'tr' ? 'API anahtarı yapılandırılmamış' : 'API key not configured'
      });
    }

    // Use official Google Cloud Translation API
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: kelime,
          source: 'fi',
          target: target,
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Translation API error:', errorData);
      return res.status(500).json({
        translation: hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error'
      });
    }

    const data = await response.json();
    const translation = data.data?.translations?.[0]?.translatedText ||
      (hedefDil === 'tr' ? 'Çeviri bulunamadı' : 'No translation found');

    res.status(200).json({ translation });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({
      translation: hedefDil === 'tr' ? 'Bağlantı hatası' : 'Connection error'
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};