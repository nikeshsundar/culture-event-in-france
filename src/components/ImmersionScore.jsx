import { motion } from 'framer-motion';
import { calculateImmersionScore } from '../utils/scoring';

export default function ImmersionScore({ exploredEvents = [] }) {
  const score = calculateImmersionScore(exploredEvents);

  const categories = [
    { icon: '🎵', name: 'Music & Arts', value: score.categories },
    { icon: '🗺️', name: 'Regions', value: score.regions },
    { icon: '☀️', name: 'Seasons', value: score.seasons },
  ];

  return (
    <section className="py-24 px-6 md:px-12 navy-gradient text-center">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
          Your Progress
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Cultural Immersion Score
        </h2>
        <p className="text-white/50 max-w-md mx-auto mb-12">
          Your personal score grows as you discover more of France's rich cultural heritage
        </p>

        {/* Score ring */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ rotate: -90 }}
            whileInView={{ rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-[200px] h-[200px] rounded-full flex items-center justify-center relative"
            style={{
              background: `conic-gradient(#C9A84C 0% ${score.total}%, rgba(255,255,255,0.07) ${score.total}% 100%)`,
            }}
          >
            <div className="absolute w-[155px] h-[155px] rounded-full bg-[#0d1e35]" />
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="font-playfair text-5xl font-black text-gold leading-none"
              >
                {score.total}%
              </motion.div>
              <span className="text-[0.72rem] text-white/50 uppercase tracking-[0.1em]">Immersed</span>
            </div>
          </motion.div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-5"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-[0.78rem] text-white/55 mb-3">{cat.name}</div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${cat.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full gold-gradient rounded-full"
                />
              </div>
              <div className="text-sm font-bold text-gold">{cat.value}%</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
