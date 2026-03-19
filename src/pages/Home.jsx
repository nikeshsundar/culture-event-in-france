import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import SearchBar from '../components/SearchBar';
import StatsBar from '../components/StatsBar';
import FeaturesGrid from '../components/FeaturesGrid';
import SeasonalMap from '../components/SeasonalMap';
import ImmersionScore from '../components/ImmersionScore';
import RoutePlanner from '../components/RoutePlanner';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { motion } from 'framer-motion';
import events from '../data/events.json';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Simulated explored events for demo
  const exploredRegions = [
    'Île-de-France',
    'Provence-Alpes-Côte d\'Azur',
    'Nouvelle-Aquitaine',
    'Auvergne-Rhône-Alpes',
  ];
  const exploredEvents = events.filter((e) => exploredRegions.includes(e.region));

  const featured = events.filter((e) => !e.hiddenGem).slice(0, 3);

  return (
    <div>
      {/* Hero + Search */}
      <div className="relative">
        <HeroSection />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center transform translate-y-1/2 z-20 px-4">
          <SearchBar />
        </div>
      </div>

      {/* Spacer for search box overlap */}
      <div className="h-32 bg-cream" />

      {/* Stats */}
      <StatsBar />

      {/* Features */}
      <FeaturesGrid />

      {/* Seasonal Map */}
      <SeasonalMap />

      {/* Featured Events */}
      <section className="py-24 px-6 md:px-12 bg-cream-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
              Featured Events
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-navy mb-3">
              Top Cultural Experiences
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Explore some of France's most iconic cultural celebrations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} onClick={setSelectedEvent} />
            ))}
          </div>
        </div>
      </section>

      {/* Route Planner */}
      <RoutePlanner />

      {/* Immersion Score */}
      <ImmersionScore exploredEvents={exploredEvents} />

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
