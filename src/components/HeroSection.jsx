import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function HeroSection() {
  const { t } = useLang();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop"
          alt="Paris skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/50 to-navy/90" />
      </div>

      {/* Shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] shimmer-line z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 text-gold text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-6"
        >
          <span className="w-10 h-px bg-gold" />
          {t('heroEyebrow')}
          <span className="w-10 h-px bg-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08]"
        >
          {t('heroTitle1')}{' '}
          <em className="text-gold-gradient font-playfair italic bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {t('heroTitle2')}
          </em>
          <br />
          {t('heroTitle3')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-5 max-w-xl text-white/65 text-base sm:text-lg leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>
      </div>
    </section>
  );
}
