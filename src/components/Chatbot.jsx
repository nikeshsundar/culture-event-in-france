import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function askCulturalGuide(message, retries = 3) {
  if (!GITHUB_TOKEN) return 'API token is missing. Please set VITE_GITHUB_TOKEN in your .env file.';

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) await delay(1500 * attempt);
      const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a friendly French cultural guide. Answer questions about French culture, events, festivals, regions, food, traditions, and travel tips. Keep answers concise (2-4 sentences). Be warm and knowledgeable.' },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (res.status === 429) {
        if (attempt < retries - 1) continue;
        return 'Rate limit reached. Please wait a few seconds and try again.';
      }
      if (!res.ok) {
        return `Sorry, API error (${res.status}). Please try again.`;
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'I\'m not sure about that. Try asking about a specific French cultural event or region!';
    } catch {
      if (attempt === retries - 1) return 'Network error. Please check your connection.';
    }
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const reply = await askCulturalGuide(userMsg);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-gold/30 gold-gradient`}
      >
        {open ? <X size={22} className="text-navy" /> : <MessageCircle size={22} className="text-navy" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px] rounded-2xl flex flex-col overflow-hidden shadow-2xl border ${
              isDark
                ? 'bg-navy/95 backdrop-blur-xl border-gold/20'
                : 'bg-white/95 backdrop-blur-xl border-gold/20'
            }`}
          >
            {/* Header */}
            <div className="gold-gradient px-5 py-3.5 flex items-center gap-3">
              <Bot size={20} className="text-navy" />
              <div>
                <p className="font-bold text-navy text-sm">{t('chatTitle')}</p>
                <p className="text-navy/60 text-[0.65rem]">AI-Powered • Ask anything</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className={`rounded-xl px-4 py-3 text-sm ${isDark ? 'bg-white/5 text-white/60' : 'bg-cream text-gray-500'}`}>
                  {t('chatWelcome')}
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-navy" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'gold-gradient text-navy font-medium'
                        : isDark
                          ? 'bg-white/8 text-white/75'
                          : 'bg-cream text-gray-600'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isDark ? 'bg-white/10' : 'bg-cream-dark'}`}>
                      <User size={14} className={isDark ? 'text-white/60' : 'text-gray-400'} />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-navy" />
                  </div>
                  <div className={`rounded-xl px-4 py-3 ${isDark ? 'bg-white/8' : 'bg-cream'}`}>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 rounded-full bg-gold"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chatPlaceholder')}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-white/10 text-black border border-white/10 focus:border-gold placeholder:text-black/40'
                      : 'bg-cream text-navy border border-gray-200 focus:border-gold placeholder:text-gray-400'
                  }`}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send size={16} className="text-navy" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
