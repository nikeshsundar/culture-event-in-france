import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const features = [
  {
    icon: '🎖️',
    titleKey: 'feature1Title',
    descriptionKey: 'feature1Description',
    badgeKey: 'feature1Badge',
  },
  {
    icon: '🌙',
    titleKey: 'feature2Title',
    descriptionKey: 'feature2Description',
    badgeKey: 'feature2Badge',
  },
  {
    icon: '⏳',
    titleKey: 'feature3Title',
    descriptionKey: 'feature3Description',
    badgeKey: 'feature3Badge',
  },
  {
    icon: '✨',
    titleKey: 'feature4Title',
    descriptionKey: 'feature4Description',
    badgeKey: 'feature4Badge',
  },
  {
    icon: '📊',
    titleKey: 'feature5Title',
    descriptionKey: 'feature5Description',
    badgeKey: 'feature5Badge',
  },
  {
    icon: '🗺️',
    titleKey: 'feature6Title',
    descriptionKey: 'feature6Description',
    badgeKey: 'feature6Badge',
  },
];

export default function FeaturesGrid() {
  const { t } = useLang();

  return (
    <section className="py-24 px-6 md:px-12 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            {t('featuresLabel')}
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-navy mb-3">
            {t('featuresTitle')}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feat, i) => (
            <motion.div
              key={feat.titleKey}
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
              <h3 className="font-playfair text-xl font-bold text-navy mb-2.5 line-clamp-2">{t(feat.titleKey)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{t(feat.descriptionKey)}</p>
              <span className="inline-block bg-gold/12 text-gold-dark text-[0.72rem] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                {t(feat.badgeKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
