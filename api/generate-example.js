import { GoogleGenerativeAI } from "@google/generative-ai";

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
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Missing Gemini API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up if the model returns markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const finalResult = JSON.parse(text);

        return res.status(200).json(finalResult);

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
