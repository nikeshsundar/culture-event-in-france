import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Plus, Trash2, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

const STORAGE_KEY = 'experienceVault';

export default function ExperienceVault({ events = [] }) {
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  const [vault, setVault] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const loadVault = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setVault(parsed);
        }
      } catch {
        setVault([]);
      }
    };

    loadVault();
    window.addEventListener('vault-updated', loadVault);
    return () => window.removeEventListener('vault-updated', loadVault);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  const savedIds = useMemo(() => vault.map((item) => item.id), [vault]);
  const availableEvents = useMemo(() => events.filter((ev) => !savedIds.includes(ev.id)), [events, savedIds]);

  const addToVault = () => {
    const id = Number(selectedId);
    const ev = events.find((item) => item.id === id);
    if (!ev) return;

    setVault((prev) => [
      ...prev,
      {
        id: ev.id,
        name: ev.name,
        city: ev.city,
        category: ev.category,
        note: '',
      },
    ]);
    setSelectedId('');
  };

  const removeFromVault = (id) => {
    setVault((prev) => prev.filter((item) => item.id !== id));
  };

  const updateNote = (id, note) => {
    setVault((prev) => prev.map((item) => (item.id === id ? { ...item, note } : item)));
  };

  return (
    <section className={`py-24 px-6 md:px-12 ${isDark ? 'bg-[#0d1b30]' : 'bg-cream'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            {t('savedPicks')}
          </span>
          <h2 className={`font-playfair text-3xl sm:text-4xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
            {t('experienceVaultTitle')}
          </h2>
          <p className={isDark ? 'text-white/50' : 'text-gray-400'}>
            {t('experienceVaultSubtitle')}
          </p>
        </div>

        <div className={`rounded-2xl p-5 md:p-6 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border ${isDark ? 'bg-navy text-white border-white/10' : 'bg-cream text-navy border-gray-200'}`}
            >
              <option value="">{t('selectEventToSave')}</option>
              {availableEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name} — {ev.city}</option>
              ))}
            </select>

            <button
              onClick={addToVault}
              disabled={!selectedId}
              className="px-4 py-2.5 rounded-xl gold-gradient text-navy text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={15} /> {t('saveToVault')}
            </button>
          </div>

          {vault.length === 0 ? (
            <div className={`rounded-xl border-2 border-dashed p-10 text-center ${isDark ? 'border-white/10 text-white/30' : 'border-gray-200 text-gray-300'}`}>
              <Bookmark className="mx-auto mb-2" size={28} />
              {t('yourVaultEmpty')}
            </div>
          ) : (
            <div className="space-y-4">
              {vault.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-cream border-gray-200'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-navy'}`}>{item.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-white/45' : 'text-gray-400'}`}>{item.city} · {item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromVault(item.id)}
                      className="text-red-400/80 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="relative">
                    <FileText size={13} className={`absolute left-3 top-3 ${isDark ? 'text-white/35' : 'text-gray-400'}`} />
                    <textarea
                      value={item.note}
                      onChange={(e) => updateNote(item.id, e.target.value)}
                      placeholder={t('addNotePlaceholder')}
                      rows={2}
                      className={`w-full pl-8 pr-3 py-2.5 rounded-lg text-sm outline-none border resize-none ${isDark ? 'bg-navy text-white border-white/10 placeholder:text-white/25' : 'bg-white text-navy border-gray-200 placeholder:text-gray-300'}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
