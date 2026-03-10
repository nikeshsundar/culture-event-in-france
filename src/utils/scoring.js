/**
 * Mood-Based Event Scoring Algorithm
 * Scores events based on how well they match the user's selected mood
 */

const moodWeights = {
  romantic: {
    sensory: { visual: 3, taste: 2, sound: 1, outdoor: 2, historical: 1 },
    categories: { "Food & Wine": 3, "Light Festival": 3, "Music": 2, "Festival": 2, "Fashion": 1 },
    seasonBonus: { winter: 2, autumn: 1, spring: 1, summer: 0 },
  },
  adventurous: {
    sensory: { outdoor: 3, visual: 2, sound: 1, taste: 0, historical: 1 },
    categories: { "Sports": 3, "Carnival": 3, "Art": 2, "Festival": 2, "Music": 1 },
    seasonBonus: { summer: 2, spring: 1, autumn: 0, winter: 0 },
  },
  artistic: {
    sensory: { visual: 3, sound: 2, historical: 2, outdoor: 0, taste: 0 },
    categories: { "Art": 3, "Film": 3, "Theatre": 3, "Fashion": 2, "Music": 2 },
    seasonBonus: { autumn: 1, spring: 1, summer: 1, winter: 1 },
  },
  peaceful: {
    sensory: { outdoor: 3, visual: 2, taste: 1, historical: 2, sound: 0 },
    categories: { "Festival": 2, "Market": 3, "Light Festival": 2, "Food & Wine": 2, "Music": 1 },
    seasonBonus: { spring: 2, autumn: 2, summer: 1, winter: 1 },
  },
  gourmet: {
    sensory: { taste: 3, visual: 1, outdoor: 1, sound: 0, historical: 1 },
    categories: { "Food & Wine": 3, "Market": 3, "Festival": 2 },
    seasonBonus: { autumn: 2, summer: 1, winter: 1, spring: 0 },
  },
};

export function scoreMoodMatch(event, mood) {
  if (!mood || !moodWeights[mood]) return 50;

  const weights = moodWeights[mood];
  let score = 0;
  let maxPossible = 0;

  // Score sensory match
  event.sensory.forEach((s) => {
    score += weights.sensory[s] || 0;
    maxPossible += 3;
  });

  // Score category match
  score += weights.categories[event.category] || 0;
  maxPossible += 3;

  // Season bonus
  score += weights.seasonBonus[event.season] || 0;
  maxPossible += 2;

  // Cultural depth bonus (higher depth = slightly better)
  score += event.culturalDepth > 80 ? 1 : 0;
  maxPossible += 1;

  // Hidden gem bonus for adventurous mood
  if (mood === "adventurous" && event.hiddenGem) {
    score += 2;
  }
  maxPossible += 2;

  return Math.min(100, Math.round((score / maxPossible) * 100));
}

/**
 * Immersion Score Calculator
 * Evaluates cultural diversity across regions, categories, and seasons
 */
export function calculateImmersionScore(exploredEvents) {
  if (!exploredEvents.length) return { total: 0, regions: 0, categories: 0, seasons: 0 };

  const uniqueRegions = new Set(exploredEvents.map((e) => e.region));
  const uniqueCategories = new Set(exploredEvents.map((e) => e.category));
  const uniqueSeasons = new Set(exploredEvents.map((e) => e.season));

  const regionScore = Math.round((uniqueRegions.size / 13) * 100);
  const categoryScore = Math.round((uniqueCategories.size / 12) * 100);
  const seasonScore = Math.round((uniqueSeasons.size / 4) * 100);

  const total = Math.round(regionScore * 0.45 + categoryScore * 0.35 + seasonScore * 0.20);

  return { total, regions: regionScore, categories: categoryScore, seasons: seasonScore };
}

/**
 * Recommend events the user hasn't explored
 * Prioritizes diversity + hidden gems
 */
export function getRecommendations(allEvents, exploredIds, mood, count = 5) {
  const unexplored = allEvents.filter((e) => !exploredIds.includes(e.id));

  return unexplored
    .map((event) => ({
      ...event,
      moodScore: scoreMoodMatch(event, mood),
      gemBonus: event.hiddenGem ? 15 : 0,
    }))
    .sort((a, b) => (b.moodScore + b.gemBonus) - (a.moodScore + a.gemBonus))
    .slice(0, count);
}
