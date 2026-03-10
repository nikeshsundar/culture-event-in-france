import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { path: '/', labelKey: 'discover' },
  { path: '/events', labelKey: 'events' },
  { path: '/passport', labelKey: 'myPassport' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[70px] transition-all duration-500 ${
        scrolled
          ? 'bg-navy/90 backdrop-blur-xl shadow-lg shadow-navy/30'
          : 'bg-navy/60 backdrop-blur-md'
      } border-b border-gold/20`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-[18px] rounded overflow-hidden">
          <div className="w-[7px] bg-[#002395]" />
          <div className="w-[7px] bg-white" />
          <div className="w-[7px] bg-[#ED2939]" />
        </div>
        <span className="font-playfair text-xl font-bold text-white">
          La <span className="text-gold">France</span> Culturelle
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${
              location.pathname === link.path ? 'text-gold' : 'text-white/70 hover:text-gold'
            }`}
          >
            {t(link.labelKey)}
            {location.pathname === link.path && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Right controls */}
      <div className="hidden md:flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 text-white/70 hover:text-gold hover:border-gold/40 transition-all text-xs font-semibold"
          title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
        >
          {lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-white/15 text-white/70 hover:text-gold hover:border-gold/40 transition-all"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* CTA */}
        <Link
          to="/events"
          className="gold-gradient text-navy px-5 py-2 rounded-lg text-sm font-bold tracking-wide hover:scale-105 transition-transform"
        >
          {t('startExploring')}
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-white"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[70px] left-0 right-0 bg-navy/95 backdrop-blur-xl border-b border-gold/20 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium py-2 ${
                  location.pathname === link.path ? 'text-gold' : 'text-white/70'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-white/70 text-xs font-semibold"
              >
                {lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-white/15 text-white/70"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
            <Link
              to="/events"
              className="gold-gradient text-navy px-5 py-3 rounded-lg text-sm font-bold text-center mt-2"
            >
              {t('startExploring')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
