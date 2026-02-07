
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, difficulty, level, count } = req.query;

    const numWords = count || 25;
    const diffLevel = level || difficulty || 'A1';

    if (!topic) {
        return res.status(400).json({ error: 'Missing topic' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        console.error("DEBUG: API Key is missing. Env Vars found:", Object.keys(process.env));
        return res.status(500).json({
            error: 'Configuration Error',
            details: 'Server API Key is missing. Please check Vercel Environment Variables.'
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate ${numWords} Finnish words related to "${topic}" at ${diffLevel} level.
        Return ONLY a raw JSON array (no markdown code blocks) in this format:
        [{"word": "FinnishWord", "translation": "EnglishTranslation", "example_sentence": "A simple Finnish sentence using the word."}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const words = JSON.parse(text);
        res.status(200).json(words);

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
}
