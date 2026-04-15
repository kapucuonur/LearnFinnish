import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const GENRES = [
  "Modern Slice of Life: Realistic daily situations in urban Finland.",
  "Nordic Noir / Light Mystery: A missing item, a strange coded message, or a gentle neighborhood mystery.",
  "Cultural Immersion: Experiencing Finnish traditions (sauna, juhannus, crayfish parties) for the first time.",
  "Workplace Drama: Professional challenges, office dynamics, or starting a new business.",
  "Nature & Solitude: A reflective journey in the Finnish wilderness, archipelago, or Lapland.",
  "Romantic Comedy: An awkward date, a misunderstanding, or a meet-cute in a cafe.",
  "Sci-Fi / Future: A glimpse into a high-tech Helsinki of the future.",
  "Historical Fiction: A scene from 1950s Helsinki or rural life in the past.",
  "Social Satire: A funny look at Finnish stereotypes (e.g., personal space, coffee consumption).",
];

const SETTINGS = [
  "A bustling market square (Kauppatori) in Helsinki during summer.",
  "A quiet, snow-covered cabin (mökki) by a frozen lake.",
  "A modern open-plan office in Keilaniemi.",
  "A crowded tram (ratikka) during rush hour.",
  "A university library or campus cafe.",
  "A late-night train journey from Helsinki to Rovaniemi.",
  "A heavy metal concert venue or rock club.",
  "A peaceful forest path during the 'ruska' (autumn foliage) season.",
  "A busy shopping mall (Kauppakeskus) on a Saturday.",
  "A traditional public sauna.",
];

const CHARACTERS = [
  "A determined software developer moving to Finland for work.",
  "An elderly pensioner who knows all the neighborhood secrets.",
  "A stressed university student preparing for an important exam.",
  "A tourist who accidentally gets lost in the city.",
  "A helpful bus driver who loves to talk (unusually for a Finn).",
  "A young artist seeking inspiration from nature.",
  "A strict but fair teacher.",
  "An entrepreneur trying to sell a strange new invention.",
];

const TONES = [
  "Humorous and lighthearted",
  "Melancholic and reflective",
  "Tense and exciting",
  "Inspiring and hopeful",
  "Mysterious and intriguing",
  "Awkward but heartwarming",
];

router.post('/', async (req, res) => {
  const { topic } = req.body;

  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const tone = TONES[Math.floor(Math.random() * TONES.length)];
  const baseTopic = topic?.trim() || "a turning point in someone's life";

  const prompt = `
  You are an expert Finnish language teacher and professional storyteller.
  TASK: Write a unique, engaging, and detailed short story in Finnish (B1/B2 Level).
  STORY PARAMETERS:
  - Topic: ${baseTopic}
  - Genre: ${genre}
  - Setting: ${setting}
  - Protagonist: ${character}
  - Tone: ${tone}
  CONTENT REQUIREMENTS:
  1. LENGTH: STRICTLY 500-800 WORDS.
  2. No Clichés: Do NOT start with "Olipa kerran".
  3. Include extensive dialogue.
  OUTPUT FORMAT (JSON ONLY):
  { "story": "...", "vocabulary": { "FinnishWord": "English translation" } }
  (Select 15-20 B1/B2-level words)
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing Gemini API Key');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json', temperature: 0.85 },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error('Story Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

export default router;
