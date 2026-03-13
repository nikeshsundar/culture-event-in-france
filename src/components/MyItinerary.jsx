import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MapPin, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const STORAGE_KEY = 'myItinerary';

export default function MyItinerary({ events = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [items, setItems] = useState([]);
  const [eventId, setEventId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const loadItems = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    };

    loadItems();
    window.addEventListener('itinerary-updated', loadItems);
    return () => window.removeEventListener('itinerary-updated', loadItems);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    const ev = events.find((item) => item.id === Number(eventId));
    if (!ev || !date) return;

    setItems((prev) => [
      ...prev,
      {
        uid: `${Date.now()}-${ev.id}`,
        eventId: ev.id,
        name: ev.name,
        city: ev.city,
        date,
        time: time || '10:00',
      },
    ]);

    setEventId('');
    setDate('');
    setTime('');
  };

  const removeItem = (uid) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aValue = `${a.date}T${a.time}`;
      const bValue = `${b.date}T${b.time}`;
      return aValue.localeCompare(bValue);
    });
  }, [items]);

  return (
    <section className={`py-24 px-6 md:px-12 ${isDark ? 'bg-navy' : 'bg-cream-dark'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Plan Ahead
          </span>
          <h2 className={`font-playfair text-3xl sm:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            My Itinerary
          </h2>
          <p className={isDark ? 'text-white/50' : 'text-gray-400'}>
            Build your personal schedule with dates and times.
          </p>
        </div>

        <div className={`rounded-2xl p-5 md:p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="grid md:grid-cols-4 gap-3 mb-6">
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className={`md:col-span-2 px-4 py-2.5 rounded-xl text-sm outline-none border ${isDark ? 'bg-navy text-white border-white/10' : 'bg-cream text-navy border-gray-200'}`}
            >
              <option value="">Select event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name} — {ev.city}</option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`px-4 py-2.5 rounded-xl text-sm outline-none border ${isDark ? 'bg-navy text-white border-white/10' : 'bg-cream text-navy border-gray-200'}`}
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`px-4 py-2.5 rounded-xl text-sm outline-none border ${isDark ? 'bg-navy text-white border-white/10' : 'bg-cream text-navy border-gray-200'}`}
            />
          </div>

          <button
            onClick={addItem}
            disabled={!eventId || !date}
            className="mb-6 px-4 py-2.5 rounded-xl gold-gradient text-navy text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={15} /> Add to Itinerary
          </button>

          {sortedItems.length === 0 ? (
            <div className={`rounded-xl border-2 border-dashed p-10 text-center ${isDark ? 'border-white/10 text-white/30' : 'border-gray-200 text-gray-300'}`}>
              <CalendarDays className="mx-auto mb-2" size={28} />
              No planned events yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.uid}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl p-4 border flex items-center justify-between gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-cream border-gray-200'}`}
                >
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>{item.name}</h3>
                    <div className={`text-xs mt-1 flex flex-wrap gap-3 ${isDark ? 'text-white/45' : 'text-gray-400'}`}>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {item.city}</span>
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {item.date}</span>
                      <span className="flex items-center gap-1"><Clock3 size={12} /> {item.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.uid)}
                    className="text-red-400/80 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
