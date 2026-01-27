// api/story.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  // --- 1. EXTENSIVE GENERATION PARMETERS FOR MAXIMUM VARIETY ---

  const GENRES = [
    "Modern Slice of Life: Realistic daily situations in urban Finland.",
    "Nordic Noir / Light Mystery: A missing item, a strange coded message, or a gentle neighborhood mystery.",
    "Cultural Immersion: Experiencing Finnish traditions (sauna, juhannus, crayfish parties) for the first time.",
    "Workplace Drama: Professional challenges, office dynamics, or starting a new business.",
    "Nature & Solitude: A reflective journey in the Finnish wilderness, archipelago, or Lapland.",
    "Romantic Comedy: An awkward date, a misunderstanding, or a meet-cute in a cafe.",
    "Sci-Fi / Future: A glimpse into a high-tech Helsinki of the future.",
    "Historical Fiction: A scene from 1950s Helsinki or rural life in the past.",
    "Social Satire: A funny look at Finnish stereotypes (e.g., personal space, coffee consumption)."
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
    "A traditional public sauna."
  ];

  const CHARACTERS = [
    "A determined software developer moving to Finland for work.",
    "An elderly pensioner who knows all the neighborhood secrets.",
    "A stressed university student preparing for an important exam.",
    "A tourist who accidentally gets lost in the city.",
    "A helpful bus driver who loves to talk (unusually for a Finn).",
    "A young artist seeking inspiration from nature.",
    "A strict but fair teacher.",
    "An entrepreneur trying to sell a strange new invention."
  ];

  const TONES = [
    "Humorous and lighthearted",
    "Melancholic and reflective",
    "Tense and exciting",
    "Inspiring and hopeful",
    "Mysterious and intriguing",
    "Awkward but heartwarming"
  ];

  // Random Selection for uniqueness
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
  const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  const tone = TONES[Math.floor(Math.random() * TONES.length)];

  // Default base topic if none provided
  const baseTopic = (topic && topic.trim()) ? topic : "a turning point in someone's life";

  // --- 2. ADVANCED SYSTEM PROMPT ---

  const prompt = `
  You are an expert Finnish language teacher and professional storyteller.
  
  TASK: Write a unique, engaging, and professional short story in Finnish (B1 Intermediate Level).
  
  STORY PARAMETERS:
  - **Topic**: ${baseTopic}
  - **Genre**: ${genre}
  - **Setting**: ${setting}
  - **Protagonist**: ${character}
  - **Tone**: ${tone}
  
  LANGUAGE GUIDELINES (B1 LEVEL - STRICT):
  - **Grammar**: Use a mix of tenses (preesens, imperfekti, perfekti). Use proper case endings (inessiivi, elatiivi, genetiivi, partitiivi) correctly. 
  - **Sentence Structure**: Combine simple sentences with compound sentences (using 'koska', 'vaikka', 'mutta', 'kun'). Avoid overly complex academic sentence structures (himmelirakenteet).
  - **Vocabulary**: Professional, everyday Finnish. Avoid slang unless essential for the character. Use rich adjectives and precise verbs.
  
  CONTENT REQUIREMENTS:
  1.  **NO CLICHÉS**: Do NOT start with "Olipa kerran". Jump straight into the action or dialogue.
  2.  **Narrative Arc**: The story must have a clear beginning (setup), middle (conflict/action), and end (resolution).
  3.  **Length**: 300 - 450 words.
  4.  **Dialogue**: Include at least 2-3 lines of natural dialogue to show interaction.
  
  OUTPUT FORMAT (JSON ONLY):
  Return a strictly valid JSON object. Do not include markdown formatting like \`\`\`json.
  
  {
    "story": "The complete Finnish story text...",
    "vocabulary": {
      "FinnishWord1": "English translation (contextual)",
      "FinnishWord2": "English translation (contextual)",
      ... (Select 12-15 challenging B1-level words from the story)
    }
  }
  `;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Updated to latest efficient model
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85, // Slightly higher for more creativity
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown wrapper from API response
    const jsonString = text.replace(/```json|```/g, '').trim();

    let finalResult;
    try {
      finalResult = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Invalid JSON response from AI");
    }

    res.status(200).json(finalResult);

  } catch (error) {
    console.error("Story Generation Error:", error);

    // Superior Fallback Mechanism
    // If AI fails, return a pre-written high-quality B1 story to ensure UX continuity.
    const backups = [
      {
        story: "Matti myöhästyi junasta. Se oli katastrofi, koska hänellä oli tärkeä työhaastattelu Helsingissä. Asemalla oli kylmä ja tuuli puhalsi kovaa. Hän katsoi kelloaan; seuraava juna tulisi vasta tunnin kuluttua. Matti päätti mennä asemakahvilaan. Siellä hän tapasi vanhan ystävänsä, Liisan, jota hän ei ollut nähnyt vuosiin. Liisa kertoi, että hänen yrityksensä etsii uutta työntekijää. Se oli onnekas sattuma! Matti ei päässyt haastatteluun, mutta hän sai ehkä vielä paremman mahdollisuuden.",
        vocabulary: { "myöhästyä": "to be late", "katastrofi": "catastrophe", "työhaastattelu": "job interview", "tuulla": "to be windy", "päättää": "to decide", "sattuma": "coincidence", "mahdollisuus": "opportunity" }
      }
    ];
    const backup = backups[0];

    return res.status(200).json(backup);
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};