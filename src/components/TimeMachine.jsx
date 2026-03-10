import { motion } from 'framer-motion';
import { useState } from 'react';
import events from '../data/events.json';

const timelineData = [
  {
    year: 2026,
    badge: 'now',
    events: [
      { name: 'Fête de la Musique — 44th Edition', desc: 'The 44th annual nationwide music celebration. Thousands of free concerts across every city and village in France on June 21.' },
      { name: 'Cannes Film Festival — 79th Edition', desc: 'The world\'s most prestigious film festival showcases 2026\'s finest cinema on the French Riviera.' },
    ],
  },
  {
    year: 1982,
    badge: 'history',
    events: [
      { name: 'First Fête de la Musique', desc: 'Jack Lang, Minister of Culture, launched the very first Fête de la Musique in Paris. A small celebration that grew into a national treasure.' },
    ],
  },
  {
    year: 1946,
    badge: 'history',
    events: [
      { name: 'First Cannes Film Festival', desc: 'The first official Cannes Film Festival takes place after being delayed by World War II. It would become the world\'s most celebrated film event.' },
    ],
  },
  {
    year: 1947,
    badge: 'history',
    events: [
      { name: 'First Avignon Theatre Festival', desc: 'Jean Vilar founded the Festival d\'Avignon in the Palace of the Popes — revolutionizing French performing arts.' },
    ],
  },
  {
    year: 1903,
    badge: 'history',
    events: [
      { name: 'First Tour de France', desc: 'The first Tour de France cycling race begins, originally created to boost newspaper sales. It would become the world\'s most-watched annual sporting event.' },
    ],
  },
  {
    year: 1852,
    badge: 'history',
    events: [
      { name: 'Origin of Fête des Lumières', desc: 'Citizens of Lyon spontaneously lit candles in their windows to celebrate the Virgin Mary — beginning a tradition that now draws 4 million visitors.' },
    ],
  },
  {
    year: 1294,
    badge: 'history',
    events: [
      { name: 'First Nice Carnival', desc: 'The earliest recorded mention of the Nice Carnival, making it one of the oldest carnivals in the world. 700+ years of celebration on the Côte d\'Azur.' },
    ],
  },
];

export default function TimeMachine() {
  const [sliderYear, setSliderYear] = useState(2026);

  const visibleItems = timelineData.filter((item) => item.year <= sliderYear);

  return (
    <section className="py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Travel Through Time
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-navy mb-3">
            Cultural Time Machine
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Explore what cultural events happened in France on the same date across history
          </p>
        </div>

        {/* Year slider */}
        <div className="flex items-center gap-5 mb-10 max-w-xl mx-auto">
          <span className="text-sm text-gray-400 font-semibold whitespace-nowrap">🕰 Year:</span>
          <input
            type="range"
            min="1200"
            max="2026"
            value={sliderYear}
            onChange={(e) => setSliderYear(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-gold
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(201,168,76,0.6)]"
          />
          <span className="font-playfair text-2xl font-black text-navy w-16 text-right">{sliderYear}</span>
        </div>

        {/* Timeline */}
        <div className="relative pl-14">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold to-transparent" />

          {visibleItems.map((item, i) => (
            <motion.div
              key={item.year + '-' + i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative mb-6"
            >
              {/* Dot */}
              <div
                className={`absolute -left-8 top-6 w-4 h-4 rounded-full shadow-lg ${
                  item.badge === 'now' ? 'bg-gold shadow-gold/50' : 'bg-crimson shadow-crimson/40'
                }`}
              />

              {item.events.map((evt, j) => (
                <div key={j} className="bg-white rounded-2xl p-5 shadow-sm mb-3">
                  <span
                    className={`inline-block text-[0.72rem] font-bold px-2.5 py-0.5 rounded-full mb-2 ${
                      item.badge === 'now'
                        ? 'bg-gold/15 text-gold-dark'
                        : 'bg-crimson/10 text-crimson'
                    }`}
                  >
                    {item.year} — {item.badge === 'now' ? 'Today' : 'Historical'}
                  </span>
                  <h4 className="font-playfair text-base font-bold text-navy mb-1">{evt.name}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{evt.desc}</p>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
