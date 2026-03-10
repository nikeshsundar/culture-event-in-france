import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Parse a natural language query into structured search params
 */
export async function parseNaturalQuery(query) {
  const prompt = `You are a search parser for a French cultural events website. Extract structured data from this user query.

User query: "${query}"

Return ONLY valid JSON with these fields (use null for missing values):
{
  "city": string or null,
  "date": "YYYY-MM-DD" or null,
  "range": number (km) or null,
  "mood": "romantic" | "adventurous" | "artistic" | "peaceful" | "gourmet" | null,
  "category": string or null,
  "season": "spring" | "summer" | "autumn" | "winter" | null
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = text.match(/\{[\s\S]*\}/);
    if (json) return JSON.parse(json[0]);
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate AI cultural story for an event
 */
export async function generateEventStory(event) {
  const prompt = `Write a short immersive cultural story (3-4 sentences, max 60 words) about the "${event.name}" in ${event.city}, France. Make it vivid, sensory, and emotionally engaging. Focus on what a visitor would experience. Do not use bullet points. Write in English.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return event.description;
  }
}

/**
 * Generate AI French phrase related to an event
 */
export async function generateFrenchPhrase(event) {
  const prompt = `Give me one beautiful French phrase or proverb related to "${event.name}" or "${event.category}" culture.
Return ONLY valid JSON: { "phrase": "French phrase here", "translation": "English translation here" }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = text.match(/\{[\s\S]*\}/);
    if (json) return JSON.parse(json[0]);
    return { phrase: event.frenchPhrase, translation: event.phraseTranslation };
  } catch {
    return { phrase: event.frenchPhrase, translation: event.phraseTranslation };
  }
}

/**
 * AI-powered region matching quiz
 */
export async function getRegionFromQuiz(answers) {
  const prompt = `Based on these travel preferences, which ONE region of France is the best match?

Preferences:
- Favorite food type: ${answers.food}
- Travel pace: ${answers.pace}
- Preferred season: ${answers.season}
- Interest: ${answers.interest}
- Landscape preference: ${answers.landscape}

French regions: Île-de-France, Provence-Alpes-Côte d'Azur, Auvergne-Rhône-Alpes, Nouvelle-Aquitaine, Occitanie, Grand Est, Bretagne, Normandie, Bourgogne-Franche-Comté, Pays de la Loire, Hauts-de-France, Centre-Val de Loire, Corse

Return ONLY valid JSON: { "region": "region name", "reason": "one sentence why" }`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = text.match(/\{[\s\S]*\}/);
    if (json) return JSON.parse(json[0]);
    return { region: "Provence-Alpes-Côte d'Azur", reason: "A perfect blend of culture, cuisine, and coastal beauty." };
  } catch {
    return { region: "Provence-Alpes-Côte d'Azur", reason: "A perfect blend of culture, cuisine, and coastal beauty." };
  }
}
