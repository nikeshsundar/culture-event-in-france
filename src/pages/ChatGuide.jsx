import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
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

const ChatGuide = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { theme } = useTheme();
  // Safe default for t function
  const { t } = { t: (k) => k, ...useLang() }; 
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (manualInput) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() || loading) return;
    
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    const reply = await askCulturalGuide(textToSend);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div className={`pt-[80px] h-[100dvh] overflow-hidden flex flex-col ${isDark ? 'bg-navy' : 'bg-cream-dark'}`}>
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col overflow-hidden px-4 pb-4 md:pb-8">
        
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-6 flex-shrink-0">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-3">
            AI Assistant
          </span>
          <h1 className={`font-playfair text-3xl md:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-navy'}`}>
            {t('chatTitle') || 'Cultural Guide'}
          </h1>
          <p className={`mt-2 text-sm md:text-base ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Your personal guide to French culture, history, and traditions.
          </p>
        </div>
        
        {/* Chat Container */}
        <div className={`flex flex-col flex-1 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border relative ${
          isDark ? 'bg-[#0d1b30] border-white/10' : 'bg-white border-gray-100'
        }`}>
          
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-8 opacity-70">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full gold-gradient flex items-center justify-center mb-4">
                  <Bot size={24} className="text-navy md:w-8 md:h-8" />
                </div>
                <h3 className={`font-playfair font-bold text-lg md:text-xl mb-2 ${isDark ? 'text-white' : 'text-navy'}`}>
                  Bonjour!
                </h3>
                <p className={`max-w-sm mx-auto text-sm mb-8 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  {t('chatWelcome') || "I'm your AI guide. Ask me anything about France!"}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {['Best time to visit Paris?', 'What is Bastille Day?', 'Famous foods in Lyon', 'Castles in Loire Valley'].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className={`text-sm py-3 px-4 rounded-xl border transition-all hover:scale-[1.02] text-left ${
                        isDark 
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/20 mt-1">
                      <Bot size={16} className="text-navy" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 text-[0.95rem] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-navy text-white rounded-tr-sm'
                      : isDark
                        ? 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5'
                        : 'bg-white text-gray-700 rounded-tl-sm border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 items-center"
              >
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-navy" />
                </div>
                <div className={`rounded-2xl px-5 py-4 ${isDark ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
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
              </motion.div>
            )}
            <div ref={scrollRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className={`p-3 md:p-5 border-t flex-shrink-0 z-10 relative ${
            isDark ? 'bg-[#0d1b30] border-white/10' : 'bg-white border-gray-100'
          }`}>
            <div className={`relative flex items-center p-1 md:p-1.5 rounded-xl border transition-colors ${
              isDark 
                ? 'bg-navy border-white/10 focus-within:border-gold/50' 
                : 'bg-gray-50 border-gray-200 focus-within:border-gold/50'
            }`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatPlaceholder') || 'Ask something...'}
                className={`flex-1 px-3 py-3 md:px-4 md:py-3 bg-transparent outline-none text-base ${
                  isDark ? 'text-white placeholder:text-white/30' : 'text-navy placeholder:text-gray-400'
                }`}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-2 md:p-3 rounded-lg gold-gradient text-navy hover:shadow-lg hover:shadow-gold/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
              >
                <Send size={18} className="md:w-5 md:h-5 " />
              </button>
            </div>
            <p className={`text-center text-[0.65rem] md:text-[0.7rem] mt-2 md:mt-3 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              AI can make mistakes. Verify important information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatGuide;
