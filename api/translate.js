// api/translate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil } = req.body;

  const langPair = hedefDil === 'tr' ? 'fi|tr' : 'fi|en';

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(kelime)}&langpair=${langPair}`
    );

    if (!response.ok) {
      return res.status(500).json({ translation: hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error' });
    }

    const data = await response.json();

    let translation = data.responseData?.translatedText || (hedefDil === 'tr' ? 'Çeviri bulunamadı' : 'No translation found');

    if (kelime.charAt(0).toUpperCase() === kelime.charAt(0) && translation) {
      translation = translation.charAt(0).toUpperCase() + translation.slice(1);
    }

    res.status(200).json({ translation });
  } catch (err) {
    res.status(500).json({ translation: hedefDil === 'tr' ? 'Bağlantı hatası' : 'Connection error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};