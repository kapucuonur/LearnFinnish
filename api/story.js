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
    console.warn('Gemini Story API failed, using fallback.');
    // Fallback Stories (Backup)
    const fallbacks = [
      "Pekka herää aikaisin aamulla. Aurinko paistaa ja linnut laulavat. Hän keittää kahvia ja syö ruisleipää. Tänään on lauantai, joten hänellä on vapaapäivä. Pekka päättää mennä metsään kävelylle. Metsässä on hiljaista ja rauhallista. Hän näkee oravan puussa. Orava kiipeää nopeasti ylös. Kävelyn jälkeen Pekka menee saunaan. Sauna on kuuma ja rentouttava. Illalla hän lukee kirjaa ja menee nukkumaan tyytyväisenä.",
      "Liisa asuu Helsingissä. Hän pitää kaupunkielämästä. Tänään hän menee torille ostamaan vihanneksia. Torilla on paljon ihmisiä. Liisa ostaa tuoreita mansikoita ja herneitä. Sitten hän tapaa ystävänsä Minnan. He menevät kahvilaan juomaan teetä. Kahvilassa tuoksuu korvapuusti. He puhuvat kesälomasta. Liisa haluaa matkustaa Lappiin. Minna haluaa mennä uimarannalle. Illalla Liisa tekee mansikkakakkua.",
      "On talvi. Ulkona sataa lunta. Maa on valkoinen ja kaunis. Matti ja Maija menevät ulos leikkimään. He rakentavat lumilyhdyn ja lumiukon. Lumiukolla on porkkananenä ja hiilisiilmät. On kylmä, pakkasta on kymmenen astetta. Lapset tulevat sisälle juomaan kuumaa kaakaota. Takassa on tuli. Se on lämmin ja mukava. Kissa nukkuu sohvalla. Talvi-illat ovat pitkiä ja pimeitä, mutta kodikkaita."
    ];
    const story = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.status(200).json({ story });
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