import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, Sparkles } from 'lucide-react';
import { cities, moods } from '../data/constants';
import { useNavigate } from 'react-router-dom';
import { parseNaturalQuery } from '../ai/gemini';
import { useLang } from '../context/LanguageContext';

export default function SearchBar() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [range, setRange] = useState(50);
  const [mood, setMood] = useState('');
  const [nlQuery, setNlQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = () => {
    const selected = cities.find((c) => c.name === city);
    const params = new URLSearchParams();
    if (selected) {
      params.set('lat', selected.lat);
      params.set('lng', selected.lng);
      params.set('city', selected.name);
    }
    if (startDate) params.set('date', startDate);
    if (endDate) params.set('endDate', endDate);
    if (range) params.set('range', range);
    if (mood) params.set('mood', mood);
    navigate(`/results?${params.toString()}`);
  };

  const handleAiSearch = async () => {
    if (!nlQuery.trim()) return;
    setAiLoading(true);
    const parsed = await parseNaturalQuery(nlQuery);
    setAiLoading(false);

    const params = new URLSearchParams();
    if (parsed) {
      if (parsed.city) {
        const found = cities.find((c) => c.name.toLowerCase() === parsed.city.toLowerCase());
        if (found) {
          params.set('lat', found.lat);
          params.set('lng', found.lng);
          params.set('city', found.name);
        }
      }
      if (parsed.date) params.set('date', parsed.date);
      if (parsed.range) params.set('range', parsed.range);
      if (parsed.mood) params.set('mood', parsed.mood);
      if (parsed.season) params.set('season', parsed.season);
      if (parsed.category) params.set('category', parsed.category);
    }
    params.set('q', nlQuery);
    navigate(`/results?${params.toString()}`);
  };

  const handleRandomSearch = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomMood = moods[Math.floor(Math.random() * moods.length)].id;
    const today = new Date();
    const start = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + (7 + Math.random() * 20) * 24 * 60 * 60 * 1000);
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];
    const ranges = [10, 50, 100, 200];
    const randomRange = ranges[Math.floor(Math.random() * ranges.length)];
    setCity(randomCity.name);
    setMood(randomMood);
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    setRange(randomRange);
    // Switch to Classic Search to show the random suggestions
    setIsAiMode(false);
  };

  const handleRandomAiSearch = () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomMood = moods[Math.floor(Math.random() * moods.length)].label;
    const suggestions = [
      `${randomMood} events near ${randomCity.name}`,
      `Best ${randomMood.toLowerCase()} festivals in ${randomCity.name}`,
      `${randomMood} cultural experiences near ${randomCity.name}`,
      `What ${randomMood.toLowerCase()} events are near ${randomCity.name}?`,
      `Find me ${randomMood.toLowerCase()} activities in ${randomCity.name}`,
    ];
    const randomQuery = suggestions[Math.floor(Math.random() * suggestions.length)];
    setNlQuery(randomQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="w-full max-w-[860px]"
    >
      {/* Mode toggle */}
      <div className="flex justify-center gap-3 mb-5">
        <button
          onClick={() => setIsAiMode(false)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            !isAiMode
              ? 'gold-gradient text-navy'
              : 'bg-navy/80 text-white/60 border border-white/15 hover:border-gold/40'
          }`}
        >
          <Compass size={13} className="inline mr-1.5 -mt-0.5" />
          Classic Search
        </button>
        <button
          onClick={() => setIsAiMode(true)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            isAiMode
              ? 'gold-gradient text-navy'
              : 'bg-navy/80 text-white/60 border border-white/15 hover:border-gold/40'
          }`}
        >
          <Sparkles size={13} className="inline mr-1.5 -mt-0.5" />
          AI Search
        </button>
      </div>

      {/* AI Search */}
      {isAiMode ? (
        <div className="glass-dark rounded-2xl p-6 shadow-2xl">
          <label className="block text-gold text-[0.72rem] font-semibold tracking-[0.12em] uppercase mb-2">
            ✨ Ask in natural language
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              placeholder='e.g. "romantic festivals near Lyon this summer under 50km"'
              className="flex-1 bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-gold transition-colors placeholder:text-white/35"
            />
            <button
              onClick={handleRandomAiSearch}
              title="Get random search suggestion"
              className="flex items-center justify-center bg-white/10 border border-white/20 hover:border-gold/60 text-white px-4 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all hover:bg-white/15"
            >
              🎲
            </button>
            <button
              onClick={handleAiSearch}
              disabled={aiLoading}
              className="gold-gradient text-navy px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform disabled:opacity-60 whitespace-nowrap"
            >
              {aiLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Thinking...
                </span>
              ) : (
                <>
                  <Sparkles size={14} className="inline mr-1.5 -mt-0.5" />
                  Search
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        // Classic Search
        <div className="glass-dark rounded-2xl p-7 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Location */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-gold text-[0.72rem] font-semibold tracking-[0.12em] uppercase mb-2">
                <MapPin size={12} className="inline mr-1 -mt-0.5" /> Location
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
              >
                <option value="">All of France</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name} className="bg-navy text-white">{c.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range - Full Width on Mobile */}
            <div className="w-full md:flex-1 md:min-w-[350px] flex gap-2">
              <div className="flex-1">
                <label className="block text-gold text-[0.72rem] font-semibold tracking-[0.12em] uppercase mb-2">
                  <Calendar size={12} className="inline mr-1 -mt-0.5" /> {t('from')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white px-3 py-3 text-sm outline-none focus:border-gold transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gold text-[0.72rem] font-semibold tracking-[0.12em] uppercase mb-2">
                  {t('to')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white px-3 py-3 text-sm outline-none focus:border-gold transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Range */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-gold text-[0.72rem] font-semibold tracking-[0.12em] uppercase mb-2">
                ⭕ Proximity
              </label>
              <select
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl text-white px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
              >
                <option value={10} className="bg-navy">10 km</option>
                <option value={50} className="bg-navy">50 km</option>
                <option value={100} className="bg-navy">100 km</option>
                <option value={200} className="bg-navy">200 km</option>
                <option value={500} className="bg-navy">500 km</option>
                <option value={10000} className="bg-navy">No limit</option>
              </select>
            </div>

            {/* Random button */}
            <button
              onClick={handleRandomSearch}
              title="Get random search suggestion"
              className="flex items-center justify-center bg-white/10 border border-white/20 hover:border-gold/60 text-white px-4 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all hover:bg-white/15"
            >
              🎲
            </button>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="gold-gradient text-navy px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-gold/30 whitespace-nowrap"
            >
              Explore Now →
            </button>
          </div>

          {/* Mood chips */}
          <div className="flex gap-3 flex-wrap items-center mt-5">
            <span className="text-[0.72rem] text-white/40 font-semibold tracking-[0.08em] uppercase">Mood:</span>
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(mood === m.id ? '' : m.id)}
                className={`px-4 py-1.5 rounded-full text-[0.82rem] transition-all border ${
                  mood === m.id
                    ? 'gold-gradient text-navy border-transparent font-bold'
                    : 'bg-white/10 text-white/70 border-white/15 hover:border-gold/40'
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
