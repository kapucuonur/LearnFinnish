// Client-side service calling Serverless Function


export async function generateLevelContent(topic, difficulty) {
    try {
        const response = await fetch(`/api/generate-level?topic=${topic}&difficulty=${difficulty}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const words = await response.json();
        return words;
    } catch (error) {
        console.error("Level Generation Error:", error);
        // Fallback for demo if API fails/quota exceeded
        return getFallbackData(topic);
    }
}

function getFallbackData(topic) {
    // Simple fallback to keep game playable without API key
    if (topic === 'Food') {
        return [
            { word: "Omena", translation: "Apple" },
            { word: "Leipä", translation: "Bread" },
            { word: "Juusto", "translation": "Cheese" },
            { word: "Vesi", translation: "Water" },
            { word: "Maito", translation: "Milk" }
        ];
    }
    return [
        { word: "Kissa", translation: "Cat" },
        { word: "Koira", translation: "Dog" },
        { word: "Talo", translation: "House" },
        { word: "Auto", translation: "Car" },
        { word: "Koulu", translation: "School" }
    ];
}
