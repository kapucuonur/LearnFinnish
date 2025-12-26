// api/translate.js - Context-aware word translation using Gemini API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { kelime, hedefDil, context } = req.body;

  try {
    // DEBUG: List available models to find the correct name
    console.log('Fetching model list...');
    const modelsRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    if (!modelsRes.ok) {
      const errorText = await modelsRes.text();
      console.error('ListModels Error:', errorText);
      return res.status(500).json({
        translation: 'Model List Error',
        details: errorText
      });
    }

    const data = await modelsRes.json();
    console.log('Available Models:', JSON.stringify(data, null, 2));

    // Return the list of models to the frontend to be logged
    // Force 500 so frontend logs the details
    return res.status(500).json({
      translation: 'Check Console',
      details: JSON.stringify(data, null, 2)
    });
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