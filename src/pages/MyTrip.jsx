import { motion } from 'framer-motion';
import ExperienceVault from '../components/ExperienceVault';
import MyItinerary from '../components/MyItinerary';
import RoutePlanner from '../components/RoutePlanner';
import events from '../data/events.json';
import { useLang } from '../context/LanguageContext';

export default function MyTrip() {
  const { t } = useLang();

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            {t('customPlanner')}
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-extrabold text-navy dark:text-white mb-4">
            {t('yourFrenchAdventure')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('myTripSubtitle')}
          </p>
        </motion.div>
      </div>

      <div className="space-y-12 pb-24">
        {/* Experience Vault */}
        <ExperienceVault events={events} />

        {/* My Itinerary */}
        <MyItinerary events={events} />

        {/* Surprise Route Planner */}
        <RoutePlanner />
      </div>
    </div>
  );
}
