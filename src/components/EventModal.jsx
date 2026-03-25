import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle, Send, Bot, Bookmark, CalendarPlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { generateEventStory, askAboutEvent } from '../ai/gemini';
import { useLang } from '../context/LanguageContext';
import { sensoryTypes } from '../data/constants';

export default function EventModal({ event, onClose }) {
  const { t, locale, lang } = useLang();
  const sensoryMap = Object.fromEntries(sensoryTypes.map((s) => [s.id, s]));
  const [story, setStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  // Reset state when event changes
  useEffect(() => {
    setStory(null);
    setChatOpen(false);
    setChatMessages([]);
    setChatInput('');
  }, [event?.id]);

  if (!event) return null;

  const handleStoryMode = async () => {
    setLoadingStory(true);
    const result = await generateEventStory(event, lang);
    setStory(result);
    setLoadingStory(false);
  };

  const handleEventChat = async (directQuestion) => {
    const question = directQuestion || chatInput.trim();
    if (!question || chatLoading) return;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: question }]);
    setChatLoading(true);
    const reply = await askAboutEvent(event, question, lang);
    setChatMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    setChatLoading(false);
  };

  const addToVault = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('experienceVault') || '[]');
      if (!saved.some((i) => i.id === event.id)) {
        const newItem = {
          id: event.id,
          name: event.name,
          city: event.city,
          category: event.category,
          note: '',
        };
        localStorage.setItem('experienceVault', JSON.stringify([...saved, newItem]));
        window.dispatchEvent(new Event('vault-updated'));
        alert(t('addedToVault'));
      } else {
        alert(t('alreadyInVault'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToItinerary = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('myItinerary') || '[]');
      const newItem = {
        uid: `${Date.now()}-${event.id}`,
        eventId: event.id,
        name: event.name,
        city: event.city,
        date: event.date,
        time: '10:00',
      };
      localStorage.setItem('myItinerary', JSON.stringify([...saved, newItem]));
      window.dispatchEvent(new Event('itinerary-updated'));
      alert(`${t('addedToItineraryFor')} ${new Date(event.date).toLocaleDateString(locale)} !`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Image */}
          <div className="relative h-[260px]">
            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="gold-gradient text-navy text-[0.68rem] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {t(`category${event.category.replace(/[^a-zA-Z]/g, '')}`)}
              </span>
              <h2 className="font-playfair text-3xl font-bold text-white mt-2 line-clamp-2">{event.name}</h2>
              <p className="text-white/60 text-sm mt-1 truncate">{event.city}, {event.region}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8">
            {/* Date & Distance */}
            <div className="flex gap-4 flex-wrap mb-5 text-sm text-gray-400">
              <span>📅 {new Date(event.date).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {event.endDate !== event.date && (
                <span>→ {new Date(event.endDate).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}</span>
              )}
              {event.distance != null && <span>📍 {event.distance} {t('awayKm')} {t('away')}</span>}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={addToVault}
                className="flex items-center gap-2 px-4 py-2 bg-navy/5 hover:bg-navy/10 rounded-lg text-sm font-semibold text-navy transition-colors"
              >
                <Bookmark size={15} /> {t('saveToVault')}
              </button>
              <button
                onClick={addToItinerary}
                className="flex items-center gap-2 px-4 py-2 bg-navy/5 hover:bg-navy/10 rounded-lg text-sm font-semibold text-navy transition-colors"
              >
                <CalendarPlus size={15} /> {t('addToItinerary')}
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-5">{event.description}</p>

            {/* Historical note */}
            <div className="bg-cream rounded-xl p-4 mb-5">
              <h4 className="font-playfair font-bold text-navy text-sm mb-1">🏛 {t('historicalNote')}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{event.historicalNote}</p>
            </div>

            {/* French phrase */}
            <div className="bg-navy/5 rounded-xl p-4 mb-5">
              <p className="italic text-gold-dark font-playfair text-lg">"{event.frenchPhrase}"</p>
              <p className="text-sm text-gray-400 mt-1">{event.phraseTranslation}</p>
            </div>

            {/* Sensory tags */}
            <div className="flex gap-2 flex-wrap mb-5">
              {event.sensory.map((s) => (
                <span key={s} className="bg-navy/5 text-navy text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                  {sensoryMap[s]?.emoji} {t(sensoryMap[s]?.labelKey)}
                </span>
              ))}
              {event.mood.map((m) => (
                <span key={m} className="bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                  {t(m)}
                </span>
              ))}
            </div>

            {/* Cultural depth */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1.5">
                <span>{t('culturalDepth')}</span>
                <span className="font-bold text-gold-dark">{event.culturalDepth}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full gold-gradient rounded-full" style={{ width: `${event.culturalDepth}%` }} />
              </div>
            </div>

            {/* AI Story Mode */}
            <div className="border-t border-gray-100 pt-5">
              {!story ? (
                <button
                  onClick={handleStoryMode}
                  disabled={loadingStory}
                  className="w-full gold-gradient text-navy py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
                >
                  {loadingStory ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                       {t('aiWritingStory')}
                     </span>
                   ) : (
                     <>
                       <Sparkles size={14} className="inline mr-2 -mt-0.5" />
                       {t('storyModeButton')}
                     </>
                   )}
                 </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-5 text-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-gold" />
                    <span className="text-gold text-xs font-bold tracking-[0.1em] uppercase">{t('aiStory')}</span>
                  </div>
                  <p className="text-white/80 leading-relaxed italic">{story}</p>
                </motion.div>
              )}
            </div>

            {/* Know More - AI Chat about this event */}
            <div className="border-t border-gray-100 pt-5 mt-2">
              {!chatOpen ? (
                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full bg-navy text-white py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} />
                  {t('knowMoreButton')}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-navy/5 rounded-xl overflow-hidden"
                >
                  <div className="gold-gradient px-4 py-2.5 flex items-center gap-2">
                    <Bot size={16} className="text-navy" />
                    <span className="font-bold text-navy text-sm">{t('askAboutEvent')} {event.name}</span>
                  </div>

                  {/* Quick questions */}
                  {chatMessages.length === 0 && (
                    <div className="px-4 pt-3 flex flex-wrap gap-2">
                      {[
                        `${t('whatShouldIWear')} ${event.name}?`,
                        `${t('bestFoodNear')} ${event.city}?`,
                        t('howToGetTickets'),
                        t('whatsTheHistory'),
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setChatInput(q);
                            handleEventChat(q);
                          }}
                          className="text-[0.72rem] bg-white border border-navy/10 text-navy px-3 py-1.5 rounded-full hover:border-gold hover:bg-gold/5 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  <div ref={chatRef} className="max-h-[200px] overflow-y-auto p-4 space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                          <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={12} className="text-navy" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'gold-gradient text-navy font-medium'
                            : 'bg-white border border-gray-100 text-gray-600'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                          <Bot size={12} className="text-navy" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl px-3 py-2">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                                className="w-1.5 h-1.5 rounded-full bg-gold"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEventChat()}
                        placeholder={`${t('askAnythingAbout')} ${event.name}...`}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none bg-white border border-gray-200 text-navy focus:border-gold placeholder:text-gray-300"
                      />
                      <button
                        onClick={() => handleEventChat()}
                        disabled={chatLoading || !chatInput.trim()}
                        className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        <Send size={14} className="text-navy" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
