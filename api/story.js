// api/story.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  // Generate a prompt from the topic
  const prompt = topic && topic.trim()
    ? `Write a Finnish story (250-500 words, B1 level) about: ${topic}. Make it engaging and use common vocabulary suitable for learners. 
       Also, identify 15-20 difficult or interesting B1-level words (nouns, verbs, adjectives) from the story and provide their English translations.
       
       RETURN ONLY VALID JSON in the following format:
       {
         "story": "The full story text here...",
         "vocabulary": {
           "word1": "translation1",
           "word2": "translation2"
         }
       }`
    : `Write a Finnish story (250-500 words, B1 level) about everyday life in Finland. Make it engaging and use common vocabulary suitable for learners.
       Also, identify 15-20 difficult or interesting B1-level words (nouns, verbs, adjectives) from the story and provide their English translations.
       
       RETURN ONLY VALID JSON in the following format:
       {
         "story": "The full story text here...",
         "vocabulary": {
           "word1": "translation1",
           "word2": "translation2"
         }
       }`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiRes.ok) {
      console.warn('Gemini Story API failed, using fallback.');
      // Fallback Stories (Backup) - Simple strings for now, or could be objects
      // Ensuring fallback compatibility effectively
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

    const data = await geminiRes.json();
    const rawText = data.candidates[0].content.parts[0].text;

    // Parse JSON response
    // Sometimes Gemini wraps it in ```json ... ``` despite responseMimeType
    const jsonString = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(jsonString);

    res.status(200).json(result);

  } catch (error) {
    console.error("Story Generation Error:", error);
    res.status(500).json({ error: "Failed to generate story." });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};