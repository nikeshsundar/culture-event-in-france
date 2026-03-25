import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-[#050d1a] text-white/45 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Top */}
        <div className="flex flex-wrap gap-12 pb-10 border-b border-white/7 mb-7">
          {/* Brand */}
          <div className="flex-[2] min-w-[220px]">
            <div className="font-playfair text-xl text-white mb-3">
              La <span className="text-gold">France</span> Culturelle
            </div>
            <p className="text-sm leading-7 max-w-[280px]">
              {t('footerBrand')}
            </p>
          </div>

          {/* Links columns */}
          <div className="flex-1 min-w-[140px]">
            <h4 className="text-xs font-bold text-gold tracking-[0.12em] uppercase mb-4">{t('footerExplore')}</h4>
            <Link to="/" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerDiscoverEvents')}</Link>
            <Link to="/events" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerAllEvents')}</Link>
            <Link to="/events" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerByRegion')}</Link>
            <Link to="/events" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerCalendar')}</Link>
          </div>

          <div className="flex-1 min-w-[140px]">
            <h4 className="text-xs font-bold text-gold tracking-[0.12em] uppercase mb-4">{t('footerFeatures')}</h4>
            <Link to="/passport" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerMyPassport')}</Link>
            <Link to="/" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerTimeMachine')}</Link>
            <Link to="/" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerMoodFinder')}</Link>
            <Link to="/passport" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerImmersion')}</Link>
          </div>

          <div className="flex-1 min-w-[140px]">
            <h4 className="text-xs font-bold text-gold tracking-[0.12em] uppercase mb-4">{t('footerProject')}</h4>
            <Link to="/" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerHome')}</Link>
            <Link to="/events" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerBrowse')}</Link>
            <Link to="/passport" className="block text-sm mb-2.5 hover:text-gold-light transition-colors">{t('footerPassport')}</Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center flex-wrap gap-3 text-xs">
          <span>© 2026 {t('footerCopyright')}</span>
          <div className="flex gap-1 items-center">
            <span className="w-[18px] h-[6px] rounded-sm bg-[#002395]" />
            <span className="w-[18px] h-[6px] rounded-sm bg-white" />
            <span className="w-[18px] h-[6px] rounded-sm bg-[#ED2939]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
