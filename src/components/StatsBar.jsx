import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const stats = [
  { num: '120+', key: 'statEvents' },
  { num: '13', key: 'statRegions' },
  { num: '8', key: 'statCategories' },
  { num: '500+', key: 'statYears' },
];

export default function StatsBar() {
  const { t } = useLang();

  return (
    <div className="bg-navy py-7 px-6 md:px-12">
      <div className="max-w-5xl mx-auto flex justify-around flex-wrap gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="font-playfair text-3xl sm:text-4xl font-black text-gold">{stat.num}</div>
            <div className="text-[0.78rem] text-white/50 tracking-[0.1em] uppercase mt-1">{t(stat.key)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
