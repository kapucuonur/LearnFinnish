// api/hikaye.js - Gemini 1.5 Flash ile (ücretsiz tier'da çalışıyor)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!geminiRes.ok) {
    const error = await geminiRes.text();
    return res.status(500).json({ error: 'Gemini hatası', details: error });
  }

  const data = await geminiRes.json();
  const hikaye = data.candidates[0].content.parts[0].text.trim();

  res.status(200).json({ hikaye });
}

export const config = {
  api: {
    bodyParser: true,
  },
};