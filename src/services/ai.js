
// srv/services/ai.js
// Adapter to fetch data from the secure Vercel Serverless Function

export const aiService = {
    generateGameContent: async (topic = "General", level = "B1") => {
        try {
            // Call the secure serverless function (hides API key)
            // Removed hardcoded count=5 to let backend default (25) take over
            const response = await fetch(`/api/generate-level?topic=${topic}&level=${level}`);

            if (!response.ok) {
                throw new Error(`AI Service Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("AI Generation Failed:", error);
            // Fallback for "FinnishMario" if API fails
            return [
                { word: "Talo", translation: "House", example_sentence: "Tämä on minun taloni." },
                { word: "Auto", translation: "Car", example_sentence: "Auto on punainen." },
                { word: "Koulu", translation: "School", example_sentence: "Käyn joka päivä koulua." },
                { word: "Järvi", translation: "Lake", example_sentence: "Suomessa on monta järveä." },
                { word: "Metsä", translation: "Forest", example_sentence: "Metsässä on hiljaista." }
            ];
        }
    }
};
