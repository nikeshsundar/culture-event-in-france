import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { sensoryTypes } from '../data/constants';

export default function EventCard({ event, index = 0, onClick }) {
  const sensoryMap = Object.fromEntries(sensoryTypes.map((s) => [s.id, s]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 56px rgba(10,22,40,0.18)' }}
      onClick={() => onClick?.(event)}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 gold-gradient text-navy text-[0.7rem] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
          {event.category}
        </span>
        {event.distance !== null && event.distance !== undefined && (
          <span className="absolute top-4 right-4 bg-navy/75 border border-gold/30 text-gold-light text-[0.72rem] font-semibold px-3 py-1 rounded-full">
            📍 {event.distance} km
          </span>
        )}
        {event.hiddenGem && (
          <span className="absolute bottom-4 right-4 bg-crimson/90 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full">
            ✨ Hidden Gem
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 pb-6">
        <h3 className="font-playfair text-lg font-bold text-navy mb-1.5 group-hover:text-gold-dark transition-colors">
          {event.name}
        </h3>
        <div className="flex gap-4 flex-wrap text-[0.8rem] text-gray-400 mb-3">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {event.city}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <p className="text-[0.87rem] text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Sensory tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {event.sensory.map((s) => (
            <span key={s} className="bg-navy/5 text-navy text-[0.72rem] font-semibold px-2.5 py-1 rounded-full">
              {sensoryMap[s]?.emoji} {sensoryMap[s]?.label}
            </span>
          ))}
        </div>

        {/* Cultural depth bar */}
        <div>
          <div className="flex justify-between text-[0.75rem] text-gray-400 mb-1.5">
            <span>Cultural Depth</span>
            <span>{event.culturalDepth}%</span>
          </div>
          <div className="h-[5px] bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${event.culturalDepth}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full gold-gradient rounded-full"
            />
          </div>
        </div>

        {/* French phrase */}
        {event.frenchPhrase && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[0.78rem] italic text-gold-dark">"{event.frenchPhrase}"</p>
            <p className="text-[0.7rem] text-gray-400 mt-0.5">{event.phraseTranslation}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
