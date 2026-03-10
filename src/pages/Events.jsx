import { useState } from 'react';
import { motion } from 'framer-motion';
import events from '../data/events.json';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { categories, seasons, moods, regions } from '../data/constants';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeason, setFilterSeason] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [hiddenGemOnly, setHiddenGemOnly] = useState(false);

  const filtered = events.filter((e) => {
    if (filterCategory && e.category !== filterCategory) return false;
    if (filterSeason && e.season !== filterSeason) return false;
    if (filterRegion && e.region !== filterRegion) return false;
    if (hiddenGemOnly && !e.hiddenGem) return false;
    return true;
  });

  return (
    <div className="pt-[70px] min-h-screen bg-cream">
      {/* Hero banner */}
      <div className="bg-navy py-16 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-3"
          >
            All Cultural Events
          </motion.h1>
          <p className="text-white/50 max-w-md mx-auto">
            Browse France's complete cultural calendar — filter by region, category, or season
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 sticky top-[70px] z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm bg-navy/5 border border-navy/10 rounded-lg px-3 py-1.5 text-navy font-medium outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Season */}
          <select
            value={filterSeason}
            onChange={(e) => setFilterSeason(e.target.value)}
            className="text-sm bg-navy/5 border border-navy/10 rounded-lg px-3 py-1.5 text-navy font-medium outline-none"
          >
            <option value="">All Seasons</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
            ))}
          </select>

          {/* Region */}
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="text-sm bg-navy/5 border border-navy/10 rounded-lg px-3 py-1.5 text-navy font-medium outline-none"
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Hidden gem */}
          <button
            onClick={() => setHiddenGemOnly(!hiddenGemOnly)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              hiddenGemOnly
                ? 'gold-gradient text-navy border-transparent'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gold/40'
            }`}
          >
            ✨ Hidden Gems
          </button>

          {/* Count */}
          <span className="ml-auto text-sm text-gray-400">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Events grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-2">No events match your filters</h3>
            <p className="text-gray-400">Try relaxing your filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} onClick={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
