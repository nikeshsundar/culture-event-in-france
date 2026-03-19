/**
 * Haversine formula — returns distance in km between two lat/lng points
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Check if an event date falls on or around a target date
 */
export function isEventNearDate(event, targetDate) {
  if (!targetDate) return true;
  const target = new Date(targetDate);
  const start = new Date(event.date);
  const end = new Date(event.endDate || event.date);
  return target >= start && target <= end;
}

/**
 * Filter events by location, date, range, mood, and sensory
 */
export function filterEvents(events, { cityLat, cityLng, date, endDate, range, mood, sensory, category, hiddenGemOnly, season }) {
  return events.filter((event) => {
    // Distance filter
    if (cityLat && cityLng && range) {
      const dist = haversineDistance(cityLat, cityLng, event.latitude, event.longitude);
      if (dist > range) return false;
    }

    // Date filter (Range or Single Date)
    if (date && endDate) {
      const eventStart = new Date(event.date);
      const eventEnd = new Date(event.endDate || event.date);
      const queryStart = new Date(date);
      const queryEnd = new Date(endDate);
      // Check for overlap
      if (!(eventStart <= queryEnd && eventEnd >= queryStart)) return false;
    } else if (date && !isEventNearDate(event, date)) {
      return false;
    }

    // Mood filter
    if (mood && !event.mood.includes(mood)) return false;

    // Sensory filter
    if (sensory && !event.sensory.includes(sensory)) return false;

    // Category filter
    if (category && event.category !== category) return false;

    // Hidden gem filter
    if (hiddenGemOnly && !event.hiddenGem) return false;

    // Season filter
    if (season && event.season !== season) return false;

    return true;
  }).map((event) => {
    const distance = (cityLat && cityLng)
      ? haversineDistance(cityLat, cityLng, event.latitude, event.longitude)
      : null;
    return { ...event, distance };
  }).sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    return 0;
  });
}
