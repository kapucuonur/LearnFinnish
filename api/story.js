// api/story.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  // Generate a prompt from the topic
  const prompt = topic && topic.trim()
    ? `Write a short Finnish story (150-200 words, B1 level) about: ${topic}. Make it engaging and use common vocabulary suitable for learners.`
    : `Write a short Finnish story (150-200 words, B1 level) about everyday life in Finland. Make it engaging and use common vocabulary suitable for learners.`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    return res.status(500).json({ error: 'Gemini error', details: error });
  }

  const data = await geminiRes.json();
  const story = data.candidates[0].content.parts[0].text.trim();

  res.status(200).json({ story });
}

export const config = {
  api: {
    bodyParser: true,
  },
};