// api/translate.js - Google Translate unofficial proxy (2025'te hala çalışan, en güvenilir yöntem)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil } = req.body;

  const target = hedefDil === 'tr' ? 'tr' : 'en';

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fi&tl=${target}&dt=t&q=${encodeURIComponent(kelime)}`
    );

    if (!response.ok) {
      return res.status(500).json({ 
        translation: hedefDil === 'tr' ? 'Çeviri hatası' : 'Translation error' 
      });
    }

    const data = await response.json();
    const translation = data[0][0][0] || (hedefDil === 'tr' ? 'Çeviri bulunamadı' : 'No translation found');

    // Büyük harf düzeltme (kelime büyük harfle başlıyorsa çeviri de öyle olsun)
    let finalTranslation = translation;
    if (kelime.charAt(0).toUpperCase() === kelime.charAt(0) && translation) {
      finalTranslation = translation.charAt(0).toUpperCase() + translation.slice(1);
    }

    res.status(200).json({ translation: finalTranslation });
  } catch (err) {
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