// api/story.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  // Dynamic Guidelines for Variety
  const STYLES = [
    "Dialogue-heavy: Focus on a conversation between two characters.",
    "First-person perspective: Write as if you are the main character telling a personal story.",
    "Descriptive and atmospheric: Focus on the setting, weather, and sensory details.",
    "Fast-paced action: Keep sentences shorter and focus on movement and events.",
    "A diary entry or letter: Write it as a personal note from one person to another.",
    "A news report style: Write it as if reporting on a local event."
  ];

  const GENRES = [
    "Everyday Life (fixing something, shopping, cooking)",
    "Small Mystery (looking for a lost item, strange noise)",
    "Comedy (a misunderstanding, a funny mistake)",
    "Work/School Life (a meeting, a presentation, a difficult task)",
    "Travel/Adventure (a trip to the forest, visiting a new city)",
    "Friendship/Social (meeting a friend, a party)"
  ];

  // Random Selection
  const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
  const randomGenre = GENRES[Math.floor(Math.random() * GENRES.length)];

  // baseTopic logic
  const baseTopic = (topic && topic.trim()) ? topic : "a surprising event in everyday life";

  const prompt = `Write a unique Finnish story (250-500 words, B1 level) about: ${baseTopic}.
  
  CRITICAL INSTRUCTIONS FOR VARIETY:
  - **Genre**: ${randomGenre}
  - **Style**: ${randomStyle}
  - **Creativity**: Do NOT start with "Olipa kerran" or generic openings. Jump straight into the scene.
  - **Structure**: Ensure the story has a clear beginning, middle, and end, but vary the paragraph structure.
  
  LANGUAGE REQUIREMENTS:
  - Level: B1 (Intermediate) - Accessible but not childish.
  - Vocabulary: Use common but interesting vocabulary suitable for learners.
  
  TASK:
  1. Write the story following the Style and Genre above.
  2. Identify 15-20 difficult or interesting B1-level words (nouns, verbs, adjectives) from the text.
  
  RETURN ONLY VALID JSON in the following format:
  {
    "story": "The full story text here...",
    "vocabulary": {
      "word1": "English translation",
      "word2": "English translation"
    }
  }`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    // Sometimes Gemini wraps it in ```json ... ``` despite responseMimeType
    const jsonString = text.replace(/```json|```/g, '').trim();
    const finalResult = JSON.parse(jsonString);

    res.status(200).json(finalResult);

  } catch (error) {
    console.error("Story Generation Error:", error);
    console.warn('Gemini Story API failed, using fallback.');

    // Fallback Stories (Backup)
    const fallbacks = [
      "Pekka herää aikaisin aamulla. Aurinko paistaa ja linnut laulavat. Hän keittää kahvia ja syö ruisleipää. Tänään on lauantai, joten hänellä on vapaapäivä. Pekka päättää mennä metsään kävelylle. Metsässä on hiljaista ja rauhallista. Hän näkee oravan puussa. Orava kiipeää nopeasti ylös. Kävelyn jälkeen Pekka menee saunaan. Sauna on kuuma ja rentouttava. Illalla hän lukee kirjaa ja menee nukkumaan tyytyväisenä.",
      "Liisa asuu Helsingissä. Hän pitää kaupunkielämästä. Tänään hän menee torille ostamaan vihanneksia. Torilla on paljon ihmisiä. Liisa ostaa tuoreita mansikoita ja herneitä. Sitten hän tapaa ystävänsä Minnan. He menevät kahvilaan juomaan teetä. Kahvilassa tuoksuu korvapuusti. He puhuvat kesälomasta. Liisa haluaa matkustaa Lappiin. Minna haluaa mennä uimarannalle. Illalla Liisa tekee mansikkakakkua.",
      "On talvi. Ulkona sataa lunta. Maa on valkoinen ja kaunis. Matti ja Maija menevät ulos leikkimään. He rakentavat lumilyhdyn ja lumiukon. Lumiukolla on porkkananenä ja hiilisiilmät. On kylmä, pakkasta on kymmenen astetta. Lapset tulevat sisälle juomaan kuumaa kaakaota. Takassa on tuli. Se on lämmin ja mukava. Kissa nukkuu sohvalla. Talvi-illat ovat pitkiä ja pimeitä, mutta kodikkaita."
    ];
    const storyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    // Return dummy structure for fallback
    return res.status(200).json({
      story: storyText,
      vocabulary: {}
    });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};