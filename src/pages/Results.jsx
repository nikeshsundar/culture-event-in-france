import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Filter, Sparkles, Search } from 'lucide-react';
import events from '../data/events.json';
import { filterEvents } from '../utils/haversine';
import { scoreMoodMatch } from '../utils/scoring';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { useLang } from '../context/LanguageContext';

export default function Results() {
  const { t, locale } = useLang();
  const [params] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hiddenGemOnly, setHiddenGemOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance');

  const cityLat = params.get('lat') ? parseFloat(params.get('lat')) : null;
  const cityLng = params.get('lng') ? parseFloat(params.get('lng')) : null;
  const cityName = params.get('city') || '';
  const date = params.get('date') || '';
  const endDate = params.get('endDate') || '';
  const range = params.get('range') ? parseInt(params.get('range')) : 10000;
  const mood = params.get('mood') || '';
  const season = params.get('season') || '';
  const category = params.get('category') || '';
  const query = params.get('q') || '';

  const results = useMemo(() => {
    let filtered = filterEvents(events, {
      cityLat,
      cityLng,
      date,
      endDate,
      range,
      mood,
      season,
      category,
      hiddenGemOnly,
    });

    // Add mood score
    filtered = filtered.map((e) => ({
      ...e,
      moodScore: mood ? scoreMoodMatch(e, mood) : 50,
    }));

    // Sort
    if (sortBy === 'mood') {
      filtered.sort((a, b) => b.moodScore - a.moodScore);
    } else if (sortBy === 'depth') {
      filtered.sort((a, b) => b.culturalDepth - a.culturalDepth);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    // default: distance (already sorted by filterEvents)

    return filtered;
  }, [cityLat, cityLng, date, range, mood, season, category, hiddenGemOnly, sortBy]);

  return (
    <div className="pt-[70px] min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {query && (
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-gold" />
                <span className="text-gold text-xs font-bold tracking-[0.1em] uppercase">{t('aiSearchLabel')}</span>
              </div>
            )}
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-2">
              {query ? (
                <>{t('resultsFor')}: <span className="text-gold italic">"{query}"</span></>
              ) : cityName ? (
                <>{t('eventsNear')} <span className="text-gold">{cityName}</span></>
              ) : (
                t('browseTitle')
              )}
            </h1>
            <p className="text-white/50 text-sm">
              {results.length} {t('eventsFound')}
              {date && !endDate && ` · ${new Date(date).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}`}
              {date && endDate && ` · ${new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`}
              {mood && ` · ${t(mood)} ${t('moodSuffix')}`}
              {range < 10000 && ` · ${t('withinKm')} ${range} km`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 sticky top-[70px] z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
          <Filter size={16} className="text-gray-400" />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-navy/5 border border-navy/10 rounded-lg px-3 py-1.5 text-navy font-medium outline-none"
          >
            <option value="distance">{t('nearestSort')}</option>
            <option value="mood">{t('bestMoodSort')}</option>
            <option value="depth">{t('depthSort')}</option>
            <option value="date">{t('dateSort')}</option>
          </select>

          {/* Hidden gem toggle */}
          <button
            onClick={() => setHiddenGemOnly(!hiddenGemOnly)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              hiddenGemOnly
                ? 'gold-gradient text-navy border-transparent'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gold/40'
            }`}
          >
            ✨ {t('hiddenGemsOnly')}
          </button>
        </div>
      </div>

      {/* Results grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-2">{t('noEventsFoundTitle')}</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {t('noEventsFoundHint')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {results.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} onClick={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
