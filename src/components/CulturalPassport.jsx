import { motion } from 'framer-motion';
import { regionStamps } from '../data/constants';
import { useLang } from '../context/LanguageContext';

export default function CulturalPassport({ exploredRegions = [] }) {
  const { t } = useLang();
  const earned = exploredRegions.length;
  const total = regionStamps.length;
  const progress = Math.round((earned / total) * 100);

  return (
    <section className="py-24 px-6 md:px-12 bg-navy text-center">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
          {t('passportLabel')}
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mb-3">
          {t('passportTitle')}
        </h2>
        <p className="text-white/50 max-w-md mx-auto mb-10">
          {t('passportProgress')}
        </p>

        {/* Passport book */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="navy-gradient border-2 border-gold/25 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <h3 className="font-playfair text-xl text-gold">🎖️ Mon Passeport Culturel</h3>
            <span className="text-sm text-white/50">
              {t('passportProgress')}: <strong className="text-gold-light">{earned} / {total}</strong>
            </span>
          </div>

          {/* Stamps grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
            {regionStamps.map((stamp, i) => {
              const isEarned = exploredRegions.includes(stamp.region);
              return (
                <motion.div
                  key={stamp.region}
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: i * 0.05 }}
                  whileHover={isEarned ? { scale: 1.1, rotate: 5 } : {}}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 p-3 transition-all ${
                    isEarned
                      ? 'border-2 border-gold bg-gold/10 shadow-[0_0_18px_rgba(201,168,76,0.2)]'
                      : 'border-2 border-dashed border-gold/30 opacity-30'
                  }`}
                >
                  <span className="text-2xl">{stamp.icon}</span>
                  <span className="text-[0.58rem] text-gold-light font-semibold text-center leading-tight">
                    {stamp.shortName}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm text-white/50 mb-2.5">
              <span>{t('immersionTitle')}</span>
              <span className="text-gold font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full gold-gradient rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
