import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

const sites = [
  {
    name: 'Mont Saint-Michel',
    historicalYear: '1228',
    modernYear: '2024',
    historicalImg: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&auto=format&fit=crop&q=80',
    modernImg: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&auto=format&fit=crop&q=80',
    desc: 'From medieval abbey to UNESCO World Heritage icon',
  },
  {
    name: 'Eiffel Tower',
    historicalYear: '1889',
    modernYear: '2024',
    historicalImg: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&auto=format&fit=crop&q=80',
    modernImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    desc: 'From controversial iron lattice to beloved global symbol',
  },
  {
    name: 'Palace of Versailles',
    historicalYear: '1682',
    modernYear: '2024',
    historicalImg: 'https://images.unsplash.com/photo-1551410224-699683e15636?w=800&auto=format&fit=crop&q=80',
    modernImg: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&auto=format&fit=crop&q=80',
    desc: 'From royal residence to the world\'s most visited palace',
  },
];

export default function BeforeAfterSlider() {
  const [activeSite, setActiveSite] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  const site = sites[activeSite];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => handleMove(e.touches ? e.touches[0].clientX : e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  return (
    <section className={`py-24 px-6 md:px-12 ${isDark ? 'bg-navy' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Heritage
          </span>
          <h2 className={`font-playfair text-3xl sm:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            Before & After
          </h2>
          <p className={isDark ? 'text-white/50' : 'text-gray-400'}>
            Drag the slider to see how France's iconic landmarks have transformed through the centuries
          </p>
        </div>

        {/* Site selector */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {sites.map((s, i) => (
            <button
              key={s.name}
              onClick={() => { setActiveSite(i); setSliderPos(50); }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                i === activeSite
                  ? 'gold-gradient text-navy'
                  : isDark
                    ? 'border border-white/20 text-white/55 hover:border-gold/40'
                    : 'border border-gray-200 text-gray-500 hover:border-gold/40'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-3xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none border border-gold/20"
          onMouseDown={(e) => { setDragging(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setDragging(true); handleMove(e.touches[0].clientX); }}
        >
          {/* Modern (background) */}
          <img
            src={site.modernImg}
            alt={`${site.name} modern`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />

          {/* Historical (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={site.historicalImg}
              alt={`${site.name} historical`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: `${containerRef.current?.offsetWidth || 800}px` }}
              draggable="false"
            />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-gold z-10"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-gold/40">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 3L14 8L11 13" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Year labels */}
          <div className="absolute top-4 left-4 bg-navy/80 backdrop-blur-sm text-gold px-3 py-1.5 rounded-lg text-xs font-bold z-20">
            📜 {site.historicalYear}
          </div>
          <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-navy px-3 py-1.5 rounded-lg text-xs font-bold z-20">
            📸 {site.modernYear}
          </div>
        </div>

        {/* Description */}
        <motion.p
          key={activeSite}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-6 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}
        >
          {site.desc}
        </motion.p>
      </div>
    </section>
  );
}
