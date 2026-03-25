const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const API_URL = 'https://models.inference.ai.azure.com/chat/completions';
const MODEL = 'gpt-4o-mini';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function chatCompletion(systemPrompt, userPrompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) await delay(1500 * i);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });
      if (res.status === 429 && i < retries - 1) continue;
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}

/**
 * Parse a natural language query into structured search params
 */
export async function parseNaturalQuery(query) {
  const system = 'You are a search parser for a French cultural events website. Extract structured data from user queries. Return ONLY valid JSON.';
  const user = `Parse this query: "${query}"

Return JSON with these fields (use null for missing):
{"city": string|null, "date": "YYYY-MM-DD"|null, "range": number|null, "mood": "romantic"|"adventurous"|"artistic"|"peaceful"|"gourmet"|null, "category": string|null, "season": "spring"|"summer"|"autumn"|"winter"|null}`;

  try {
    const text = await chatCompletion(system, user);
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
export async function generateEventStory(event, lang = 'en') {
  const system =
    lang === 'fr'
      ? 'Vous etes un conteur specialise dans la culture francaise. Ecrivez des recits courts et immersifs en francais.'
      : 'You are a vivid storyteller specializing in French culture. Write short, immersive stories.';
  const user =
    lang === 'fr'
      ? `Ecris une courte histoire immersive (3-4 phrases, max 60 mots) sur "${event.name}" a ${event.city}, France. Rends-la vivante et sensorielle. Pas de puces.`
      : `Write a short immersive story (3-4 sentences, max 60 words) about "${event.name}" in ${event.city}, France. Be vivid, sensory, and engaging. No bullet points.`;

  try {
    const text = await chatCompletion(system, user);
    return text.trim();
  } catch {
    return event.description;
  }
}

/**
 * Generate AI French phrase related to an event
 */
export async function generateFrenchPhrase(event) {
  const system = 'You are a French language expert. Return ONLY valid JSON.';
  const user = `Give one beautiful French phrase or proverb related to "${event.name}" or "${event.category}". Return JSON: { "phrase": "French phrase", "translation": "English translation" }`;

  try {
    const text = await chatCompletion(system, user);
    const json = text.match(/\{[\s\S]*\}/);
    if (json) return JSON.parse(json[0]);
    return { phrase: event.frenchPhrase, translation: event.phraseTranslation };
  } catch {
    return { phrase: event.frenchPhrase, translation: event.phraseTranslation };
  }
}

/**
 * Ask AI about a specific event
 */
export async function askAboutEvent(event, question, lang = 'en') {
  const system =
    lang === 'fr'
      ? `Tu es un guide culturel francais expert. Tu reponds a propos de "${event.name}" a ${event.city}. Categorie: ${event.category}. Date: ${event.date}. Description: ${event.description}. Histoire: ${event.historicalNote}. Reponds en francais en 2 a 4 phrases concises.`
      : `You are a knowledgeable French cultural guide. You are answering about "${event.name}" in ${event.city}. Category: ${event.category}. Date: ${event.date}. Description: ${event.description}. History: ${event.historicalNote}. Give concise answers (2-4 sentences).`;

  try {
    const text = await chatCompletion(system, question);
    return text.trim();
  } catch {
    return 'Sorry, I couldn\'t answer that right now. Please try again.';
  }
}

/**
 * AI-powered region matching quiz
 */
export async function getRegionFromQuiz(answers) {
  const system = 'You are a French travel expert. Match preferences to ONE French region. Return ONLY valid JSON.';
  const user = `Preferences: Food: ${answers.food}, Pace: ${answers.pace}, Season: ${answers.season}, Interest: ${answers.interest}, Landscape: ${answers.landscape}.

Regions: Île-de-France, Provence-Alpes-Côte d'Azur, Auvergne-Rhône-Alpes, Nouvelle-Aquitaine, Occitanie, Grand Est, Bretagne, Normandie, Bourgogne-Franche-Comté, Pays de la Loire, Hauts-de-France, Centre-Val de Loire, Corse

Return JSON: { "region": "name", "reason": "one sentence" }`;

  try {
    const text = await chatCompletion(system, user);
    const json = text.match(/\{[\s\S]*\}/);
    if (json) return JSON.parse(json[0]);
    return { region: "Provence-Alpes-Côte d'Azur", reason: "A perfect blend of culture, cuisine, and coastal beauty." };
  } catch {
    return { region: "Provence-Alpes-Côte d'Azur", reason: "A perfect blend of culture, cuisine, and coastal beauty." };
  }
}
