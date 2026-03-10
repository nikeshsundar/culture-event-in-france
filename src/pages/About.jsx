import { motion } from 'framer-motion';
import { Sparkles, MapPin, Brain, Globe, Compass, Code } from 'lucide-react';

const team = [
  { name: 'Team Member 1', role: 'Frontend Developer' },
  { name: 'Team Member 2', role: 'UI/UX Designer' },
  { name: 'Team Member 3', role: 'Data & Research' },
  { name: 'Team Member 4', role: 'AI Integration' },
];

const techStack = [
  { name: 'React 18', desc: 'Component-based UI framework' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS styling' },
  { name: 'Framer Motion', desc: 'Production-grade animations' },
  { name: 'AI Engine', desc: 'Natural language processing' },
  { name: 'Leaflet', desc: 'Interactive map rendering' },
  { name: 'Haversine Formula', desc: 'Geographical distance calculation' },
];

export default function About() {
  return (
    <div className="pt-[70px] min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-navy py-20 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            About <span className="text-gold">La France Culturelle</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/55 max-w-xl mx-auto leading-relaxed"
          >
            An AI-powered location-based cultural exploration platform designed to help users discover
            and experience the rich cultural heritage of France.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Problem Statement */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
              The Problem
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-4">
              Why This Project Exists
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: <Globe size={24} />, text: 'Cultural information is scattered across multiple sources with no central platform' },
                { icon: <MapPin size={24} />, text: 'It\'s hard to find events based on location and date simultaneously' },
                { icon: <Compass size={24} />, text: 'Travelers often don\'t know which cultural experiences are happening nearby' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-navy/5"
                >
                  <div className="text-gold mb-3">{item.icon}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-16 border-t border-gray-200">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            System Workflow
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'User Input', desc: 'Enter location, date, proximity range, or use natural language with AI search.' },
              { step: '02', title: 'AI Processing', desc: 'System parses input, calculates distances via Haversine formula, and applies mood scoring.' },
              { step: '03', title: 'Event Matching', desc: 'Filtered events are ranked by relevance, mood match, cultural depth, and distance.' },
              { step: '04', title: 'Results', desc: 'Events are presented as interactive cards with full cultural details and AI story mode.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-playfair text-4xl font-black text-gold/20 mb-2">{item.step}</div>
                <h3 className="font-playfair font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Features */}
        <section className="py-16 border-t border-gray-200">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Artificial Intelligence
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-8">
            AI-Powered Features
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: <Brain size={20} />, title: 'Natural Language Search', desc: 'Type queries like "romantic festivals near Lyon" — AI understands and extracts search parameters.' },
              { icon: <Sparkles size={20} />, title: 'AI Story Mode', desc: 'Every event can generate an immersive cultural narrative using Google Gemini, bringing the experience to life.' },
              { icon: <Compass size={20} />, title: 'Region Personality Quiz', desc: 'AI analyzes your preferences across 5 dimensions to match you with your ideal French region.' },
              { icon: <Code size={20} />, title: 'Smart Scoring Algorithms', desc: 'Mood matching, immersion scoring, and recommendations all use intelligent weighted algorithms.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-navy/5 flex gap-4"
              >
                <div className="text-gold flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-playfair font-bold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 border-t border-gray-200">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Technology
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-8">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-navy/5 text-center"
              >
                <h4 className="font-bold text-navy text-sm mb-1">{tech.name}</h4>
                <p className="text-xs text-gray-400">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-16 border-t border-gray-200">
          <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
            Team
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-8">
            Our Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-navy/5 text-center"
              >
                <div className="w-16 h-16 rounded-full gold-gradient mx-auto mb-3 flex items-center justify-center text-navy font-bold text-xl">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <h4 className="font-bold text-navy text-sm">{member.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
