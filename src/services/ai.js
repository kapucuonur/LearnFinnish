
// srv/services/ai.js
// Adapter to fetch data from the secure Vercel Serverless Function

export const aiService = {
    generateGameContent: async (topic = "General", level = "B1") => {
        try {
            // Call the secure serverless function (hides API key)
            const response = await fetch(`/api/generate-level?topic=${topic}&level=${level}&count=5`);

            if (!response.ok) {
                throw new Error(`AI Service Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("AI Generation Failed:", error);
            // Fallback for "FinnishMario" if API fails
            return [
                { word: "Talo", translation: "House" },
                { word: "Auto", translation: "Car" },
                { word: "Koulu", translation: "School" },
                { word: "Järvi", translation: "Lake" },
                { word: "Metsä", translation: "Forest" }
            ];
        }
    }
};
