import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        paragraphs: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["paragraphs"]
    },
    temperature: 0.5,
    maxOutputTokens: 2048,
    thinkingConfig: {
      thinkingBudget: 0
    }
  }
});

model.generateContent("Write a story in B1 Finnish about coffee. 3 paragraphs.")
  .then(res => {
    console.log("Raw output:", res.response.text());
    console.log("Candidates:", JSON.stringify(res.response.candidates, null, 2));
  })
  .catch(console.error);
