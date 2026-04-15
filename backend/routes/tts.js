import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fi&client=tw-ob&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) throw new Error(`TTS upstream error: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutability');
    res.send(buffer);
  } catch (error) {
    console.error('TTS Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch audio' });
  }
});

export default router;
