// api/translate.js - Context-aware word translation using Gemini API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil, context } = req.body;
  const targetLanguage = hedefDil === 'tr' ? 'Turkish' : 'English';

  console.error('ListModels Error:', errorText);
  return res.status(500).json({
    translation: 'Model List Error',
    details: errorText
  });
}

const data = await modelsRes.json();
console.log('Available Models:', JSON.stringify(data, null, 2));

// Return the list of models to the frontend to be logged
return res.status(200).json({
  translation: 'Check Console',
  details: JSON.stringify(data, null, 2)
});
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