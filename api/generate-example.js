
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: 'Word is required' });
    }

    const prompt = `Write a simple Finnish example sentence (B1 level) using the word "${word}". Also provide the English translation. Return ONLY JSON in this format: { "sentence": "Finnish sentence here", "translation": "English translation here" }. Do not add any markdown formatting.`;

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!geminiRes.ok) {
            throw new Error('Gemini API failed');
        }

        const data = await geminiRes.json();
        let text = data.candidates[0].content.parts[0].text.trim();

        // Clean up if the model returns markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const result = JSON.parse(text);

        return res.status(200).json(result);

    } catch (error) {
        console.error('Example generation error:', error);
        // Fallback if API fails
        return res.status(500).json({
            error: 'Failed to generate example',
            fallback: {
                sentence: `Tämä on esimerkki sanalle "${word}".`,
                translation: `This is an example for the word "${word}".`
            }
        });
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};
