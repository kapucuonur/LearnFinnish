import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const GENRES = [
  "Finnish Culture & Life Rules: Daily life, unwritten rules, and social norms in Finland.",
  "Nature & Environment: Protecting the environment, recycling, and appreciating Finnish nature.",
  "Seasons & Festivities: Experiencing Christmas (Joulu), Midsummer (Juhannus), or the changing seasons.",
  "Everyday Tasks: Going to the second-hand shop (kirpputori), sorting trash, or using online marketplaces.",
  "Professional Life: Job hunting, preparing for a job interview, or writing an application in Finland.",
  "Self-Improvement: Visiting the library, reading books, and personal growth.",
  "Social Connections: Making new friends, building relationships, and shared activities.",
  "Winter Sports & Sauna: Cross-country skiing (hiihtoa) in the forest followed by a traditional sauna.",
  "Cottage Life (Mökki): Escaping to a cabin, chopping wood, and relaxing by the lake.",
];

const SETTINGS = [
  "A vibrant second-hand shop (kirpputori) filled with hidden treasures.",
  "A quiet, snow-covered cabin (mökki) by a frozen lake.",
  "A modern, peaceful public library like Oodi in Helsinki.",
  "A bustling recycling center (kierrätyskeskus) where people drop off items.",
  "A traditional public sauna filled with steam and friendly chatter.",
  "A snow-covered forest path perfect for cross-country skiing (hiihtolatu).",
  "A cozy living room decorated for Christmas (Joulu).",
  "A bright summer night by a bonfire during Midsummer (Juhannus).",
  "An office or cafe where someone is preparing for a job interview.",
  "A local park where friends meet to enjoy the changing seasons.",
];

const CHARACTERS = [
  "An immigrant preparing for their first job interview in Finland.",
  "A student who loves finding vintage clothes at the kirpputori.",
  "A nature enthusiast who is strict about recycling and the environment.",
  "A person experiencing their very first traditional Finnish Christmas.",
  "A beginner learning how to cross-country ski (hiihtää).",
  "A passionate reader who spends hours at the local library.",
  "A friend organizing a Midsummer (Juhannus) trip to the mökki.",
  "A helpful neighbor teaching someone how to properly sort their trash.",
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
