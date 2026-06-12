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

// Hard truncate story to max N words, cutting at the last complete sentence
function truncateToWords(text, maxWords = 320) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;

  const truncated = words.slice(0, maxWords).join(' ');
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  return lastSentenceEnd > 0 ? truncated.slice(0, lastSentenceEnd + 1) : truncated;
}

router.post('/', async (req, res) => {
  const { topic } = req.body;

  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const tone = TONES[Math.floor(Math.random() * TONES.length)];
  const baseTopic = topic?.trim() || "a turning point in someone's life";

  const prompt = `
  You are a Finnish language teacher writing a SHORT story for B1 learners.

  ⚠️ CRITICAL RULE: The story MUST be between 250 and 300 words.
  ⚠️ DO NOT write more than 300 words. Count your words as you write.

  STORY PARAMETERS:
  - Topic: ${baseTopic}
  - Genre: ${genre}
  - Setting: ${setting}
  - Protagonist: ${character}
  - Tone: ${tone}

  STORY WRITING RULES:
  1. MAXIMUM 300 WORDS — count carefully and stop.
  2. Write in natural, everyday B1 Finnish. Short sentences. Common words.
  3. Include 2 short dialogue lines using smart quotes or dashes (e.g. ”Hei!”, hän sanoi. or - Hei!, hän sanoi. — DO NOT use raw straight double quotes ").
  4. Do NOT start with "Olipa kerran".
  5. Structure: Return the story as an array of exactly 3 strings (each representing a paragraph) inside the "paragraphs" field.
  6. First paragraph (paragraphs[0]): set the scene (2-3 sentences).
  7. Second paragraph (paragraphs[1]): the main event with dialogue (3-4 sentences).
  8. Third paragraph (paragraphs[2]): brief resolution (2-3 sentences). STOP HERE.

  VOCABULARY SELECTION:
  - Select 12-16 vocabulary words/phrases from the story.
  - Prioritize single words (verbs, nouns, adjectives, adverbs) over long phrases, so they highlight correctly in the text.
  `;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Missing Gemini API Key');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            paragraphs: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'Exactly 3 paragraphs of the story. Word count of the combined paragraphs MUST be between 250 and 300 words.'
            },
            vocabulary: {
              type: 'ARRAY',
              description: '12-16 vocabulary words/phrases highlighted from the story.',
              items: {
                type: 'OBJECT',
                properties: {
                  finnish: { 
                    type: 'STRING',
                    description: 'The EXACT word or phrase as written in the story (lowercased, e.g. \"kahvilassa\" if the story contains \"kahvilassa\", NOT the dictionary form \"kahvila\").'
                  },
                  translation: { 
                    type: 'STRING',
                    description: 'English translation of the word, including a hint to its dictionary form if inflected.'
                  },
                  type: { 
                    type: 'STRING', 
                    enum: ['verb', 'noun', 'adjective', 'phrase', 'adverb'],
                    description: 'Grammatical type.'
                  }
                },
                required: ['finnish', 'translation', 'type']
              }
            }
          },
          required: ['paragraphs', 'vocabulary']
        },
        temperature: 0.5,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON response from Gemini. Raw text was:', text);
      throw parseError;
    }

    // Convert structured vocabulary array to dictionary expected by frontend
    const vocabularyObj = {};
    if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) {
      parsed.vocabulary.forEach(item => {
        if (item.finnish) {
          vocabularyObj[item.finnish.toLowerCase()] = {
            translation: item.translation || '',
            type: item.type || 'noun'
          };
        }
      });
    }

    let storyText = '';
    if (parsed.paragraphs && Array.isArray(parsed.paragraphs)) {
      storyText = parsed.paragraphs.join('\n\n');
    }
    storyText = truncateToWords(storyText, 320);

    res.status(200).json({
      story: storyText,
      vocabulary: vocabularyObj
    });
  } catch (error) {
    console.error('Story Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate story', details: error.message, stack: error.stack });
  }
});

export default router;
