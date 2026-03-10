import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Route, Plus, Trash2, Navigation, Clock, Car } from 'lucide-react';
import { haversineDistance } from '../utils/haversine';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import events from '../data/events.json';

export default function RoutePlanner() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  const selectedEvents = useMemo(
    () => selectedIds.map((id) => events.find((e) => e.id === id)).filter(Boolean),
    [selectedIds]
  );

  const routeLegs = useMemo(() => {
    if (selectedEvents.length < 2) return [];
    const legs = [];
    for (let i = 0; i < selectedEvents.length - 1; i++) {
      const a = selectedEvents[i];
      const b = selectedEvents[i + 1];
      const dist = haversineDistance(a.latitude, a.longitude, b.latitude, b.longitude);
      legs.push({
        from: a.name,
        to: b.name,
        distKm: dist,
        driveMin: Math.round(dist * 0.9), // ~65 km/h avg
      });
    }
    return legs;
  }, [selectedEvents]);

  const totalKm = routeLegs.reduce((s, l) => s + l.distKm, 0);
  const totalMin = routeLegs.reduce((s, l) => s + l.driveMin, 0);

  const addEvent = (id) => {
    if (selectedIds.includes(id) || selectedIds.length >= 5) return;
    setSelectedIds((prev) => [...prev, id]);
    setShowPicker(false);
  };

  const removeEvent = (id) => setSelectedIds((prev) => prev.filter((x) => x !== id));

  const available = events.filter((e) => !selectedIds.includes(e.id));

  return (
    <section className={`py-24 px-6 md:px-12 ${isDark ? 'bg-[#0d1b30]' : 'bg-cream'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Road Trip
          </span>
          <h2 className={`font-playfair text-3xl sm:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            Cultural Route Planner
          </h2>
          <p className={isDark ? 'text-white/50' : 'text-gray-400'}>
            Pick up to 5 events and we'll map your perfect French road trip
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: event list + add */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Route size={16} className="text-gold" />
              <span className={`text-sm font-semibold ${isDark ? 'text-white/70' : 'text-navy/70'}`}>
                Your Stops ({selectedIds.length}/5)
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <AnimatePresence>
                {selectedEvents.map((ev, i) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'}`}
                  >
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-navy text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-navy'}`}>{ev.name}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{ev.city}, {ev.region}</p>
                    </div>
                    <button
                      onClick={() => removeEvent(ev.id)}
                      className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {selectedIds.length < 5 && (
              <div className="relative">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-colors ${
                    isDark
                      ? 'border-gold/30 text-gold/60 hover:border-gold/60 hover:text-gold'
                      : 'border-gold/20 text-gold/80 hover:border-gold/50'
                  }`}
                >
                  <Plus size={16} />
                  <span className="text-sm font-medium">Add a stop</span>
                </button>

                <AnimatePresence>
                  {showPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute left-0 right-0 top-full mt-2 max-h-52 overflow-y-auto rounded-xl z-20 ${
                        isDark ? 'bg-navy border border-gold/20' : 'bg-white border border-gray-200 shadow-lg'
                      }`}
                    >
                      {available.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => addEvent(ev.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            isDark
                              ? 'text-white/70 hover:bg-gold/10 hover:text-gold'
                              : 'text-gray-600 hover:bg-gold/5 hover:text-navy'
                          }`}
                        >
                          <span className="font-medium">{ev.name}</span>
                          <span className={`ml-2 text-xs ${isDark ? 'text-white/30' : 'text-gray-300'}`}>
                            — {ev.city}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right: route visualization */}
          <div>
            {routeLegs.length > 0 ? (
              <div>
                {/* Summary */}
                <div className={`flex gap-6 mb-6 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'}`}>
                  <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-gold" />
                    <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Total</span>
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-navy'}`}>{totalKm} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gold" />
                    <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Drive</span>
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-navy'}`}>
                      {totalMin >= 60 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : `${totalMin}m`}
                    </span>
                  </div>
                </div>

                {/* Legs */}
                <div className="space-y-1">
                  {routeLegs.map((leg, i) => (
                    <div key={i}>
                      {/* Stop dot */}
                      <div className="flex items-center gap-3 ml-3">
                        <div className="w-3 h-3 rounded-full bg-gold" />
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>{leg.from}</span>
                      </div>
                      {/* Connector */}
                      <div className="flex items-center gap-3 ml-[17px]">
                        <div className="w-[2px] h-12 bg-gold/30" />
                        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                          <Car size={12} />
                          {leg.distKm} km · ~{leg.driveMin >= 60 ? `${Math.floor(leg.driveMin / 60)}h ${leg.driveMin % 60}m` : `${leg.driveMin}m`}
                        </div>
                      </div>
                      {/* Last stop */}
                      {i === routeLegs.length - 1 && (
                        <div className="flex items-center gap-3 ml-3">
                          <div className="w-3 h-3 rounded-full bg-crimson" />
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>{leg.to}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <MapPin size={32} className={isDark ? 'text-white/15' : 'text-gray-200'} />
                <p className={`mt-3 text-sm ${isDark ? 'text-white/25' : 'text-gray-300'}`}>
                  Add at least 2 stops to see your route
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
