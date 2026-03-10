import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎖️',
    title: 'Cultural Passport',
    description: 'Collect digital stamps as you explore each region of France. Track your journey and unlock new cultural discoveries across all 13 regions.',
    badge: 'Gamification',
  },
  {
    icon: '🌙',
    title: 'Mood-Based Discovery',
    description: 'Tell us how you feel — Romantic, Adventurous, Artistic, or Peaceful — and we\'ll match you with the perfect cultural experience for your mood.',
    badge: 'AI-Powered',
  },
  {
    icon: '⏳',
    title: 'Cultural Time Machine',
    description: 'Slide through history to see what cultural events were happening in France on the same date across different years. Past meets present.',
    badge: 'Historical Layer',
  },
  {
    icon: '✨',
    title: 'Sensory Tags',
    description: 'Every event is tagged by the sensory experience it offers — Visual spectacle, Sound immersion, Taste, Nature, or Historical depth.',
    badge: 'Deep Filtering',
  },
  {
    icon: '📊',
    title: 'Cultural Immersion Score',
    description: 'Watch your French cultural immersion percentage grow as you explore more events. Broken down by region, season, and category.',
    badge: 'AI Scoring',
  },
  {
    icon: '🗺️',
    title: 'Seasonal Animated Map',
    description: 'An animated map of France where regions light up and shift color based on the selected season — showing where culture peaks right now.',
    badge: 'Interactive Map',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            What Makes Us Unique
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-navy mb-3">
            More Than Just an Event Finder
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Six innovative features that transform how you experience French culture
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(10,22,40,0.12)' }}
              className="relative bg-white rounded-2xl p-9 border border-navy/[0.07] shadow-sm overflow-hidden"
            >
              {/* Top gold line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] gold-gradient" />

              <div className="text-4xl mb-5">{feat.icon}</div>
              <h3 className="font-playfair text-xl font-bold text-navy mb-2.5">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{feat.description}</p>
              <span className="inline-block bg-gold/12 text-gold-dark text-[0.72rem] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                {feat.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
