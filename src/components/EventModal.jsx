import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { generateEventStory } from '../ai/gemini';

export default function EventModal({ event, onClose }) {
  const [story, setStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);

  if (!event) return null;

  const handleStoryMode = async () => {
    setLoadingStory(true);
    const result = await generateEventStory(event);
    setStory(result);
    setLoadingStory(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Image */}
          <div className="relative h-[260px]">
            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="gold-gradient text-navy text-[0.68rem] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {event.category}
              </span>
              <h2 className="font-playfair text-3xl font-bold text-white mt-2">{event.name}</h2>
              <p className="text-white/60 text-sm mt-1">{event.city}, {event.region}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {/* Date & Distance */}
            <div className="flex gap-4 flex-wrap mb-5 text-sm text-gray-400">
              <span>📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {event.endDate !== event.date && (
                <span>→ {new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              )}
              {event.distance != null && <span>📍 {event.distance} km away</span>}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-5">{event.description}</p>

            {/* Historical note */}
            <div className="bg-cream rounded-xl p-4 mb-5">
              <h4 className="font-playfair font-bold text-navy text-sm mb-1">🏛 Historical Note</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{event.historicalNote}</p>
            </div>

            {/* French phrase */}
            <div className="bg-navy/5 rounded-xl p-4 mb-5">
              <p className="italic text-gold-dark font-playfair text-lg">"{event.frenchPhrase}"</p>
              <p className="text-sm text-gray-400 mt-1">{event.phraseTranslation}</p>
            </div>

            {/* Sensory tags */}
            <div className="flex gap-2 flex-wrap mb-5">
              {event.sensory.map((s) => (
                <span key={s} className="bg-navy/5 text-navy text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                  {s}
                </span>
              ))}
              {event.mood.map((m) => (
                <span key={m} className="bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                  {m}
                </span>
              ))}
            </div>

            {/* Cultural depth */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1.5">
                <span>Cultural Depth</span>
                <span className="font-bold text-gold-dark">{event.culturalDepth}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full gold-gradient rounded-full" style={{ width: `${event.culturalDepth}%` }} />
              </div>
            </div>

            {/* AI Story Mode */}
            <div className="border-t border-gray-100 pt-5">
              {!story ? (
                <button
                  onClick={handleStoryMode}
                  disabled={loadingStory}
                  className="w-full gold-gradient text-navy py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
                >
                  {loadingStory ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      AI is writing your story...
                    </span>
                  ) : (
                    <>
                      <Sparkles size={14} className="inline mr-2 -mt-0.5" />
                      Story Mode — AI Cultural Narrative
                    </>
                  )}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-5 text-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-gold" />
                    <span className="text-gold text-xs font-bold tracking-[0.1em] uppercase">AI Story Mode</span>
                  </div>
                  <p className="text-white/80 leading-relaxed italic">{story}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
