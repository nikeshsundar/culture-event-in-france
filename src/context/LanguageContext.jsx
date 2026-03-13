import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

// All translatable strings
const translations = {
  en: {
    // Navbar
    discover: 'Discover',
    events: 'Events',
    myTrip: 'My Trip',
    aiGuide: 'AI Guide',
    startExploring: 'Start Exploring',

    // Hero
    heroEyebrow: 'AI-Powered Cultural Exploration',
    heroTitle1: 'Discover',
    heroTitle2: 'La France',
    heroTitle3: 'Through Its Culture',
    heroSubtitle: 'Find festivals, traditions, and cultural experiences across all regions of France — filtered by your date, location, and mood. Powered by AI.',

    // Search
    classicSearch: 'Classic Search',
    aiSearch: 'AI Search',
    askNatural: '✨ Ask in natural language',
    aiPlaceholder: 'e.g. "romantic festivals near Lyon this summer under 50km"',
    search: 'Search',
    thinking: 'Thinking...',
    location: 'Location',
    allFrance: 'All of France',
    date: 'Date',
    proximity: 'Proximity',
    noLimit: 'No limit',
    exploreNow: 'Explore Now →',
    mood: 'Mood:',

    // Stats
    statEvents: 'Cultural Events',
    statRegions: 'Regions',
    statCategories: 'Categories',
    statYears: 'Years of History',

    // Features
    featuresLabel: 'Why Choose Us',
    featuresTitle: 'Unique Cultural Features',

    // Seasonal Map
    mapLabel: 'Interactive',
    mapTitle: 'Seasonal Cultural Map',
    mapSubtitle: 'Watch France come alive — select a season to see where cultural activity peaks',
    eventsWord: 'Events',

    // Featured Events
    featuredLabel: 'Featured Events',
    featuredTitle: 'Top Cultural Experiences',

    // Cultural Passport
    passportLabel: 'Your Journey',
    passportTitle: 'Cultural Passport',
    passportProgress: 'regions explored',
    stampEarned: '✓ Visited',
    stampLocked: '🔒 Locked',

    // Time Machine
    timeLabel: 'Time Travel',
    timeTitle: 'Cultural Time Machine',
    timeSubtitle: 'Slide through centuries — from medieval fairs to modern megafestivals',

    // Immersion
    immersionLabel: 'Your Score',
    immersionTitle: 'Cultural Immersion Score',
    immersionBased: 'Based on your explored events',

    // Events page
    browseLabel: 'Browse',
    browseTitle: 'All Cultural Events',
    allCategories: 'All Categories',
    allSeasons: 'All Seasons',
    allRegions: 'All Regions',
    hiddenGemsOnly: 'Hidden Gems Only',
    eventsFound: 'events found',

    // Results page
    resultsTitle: 'Search Results',
    resultsFor: 'Results for',
    sortBy: 'Sort:',
    sortDistance: 'Distance',
    sortMood: 'Mood Match',
    sortDepth: 'Depth',
    sortDate: 'Date',
    noResults: 'No events found — try a different search!',

    // Passport page
    passportPageTitle: 'Your Cultural Passport',
    regionQuiz: 'Find Your Region',
    quizTitle: 'AI Region Personality Quiz',
    quizSubtitle: 'Answer 5 questions and AI will match you with your ideal French region',
    startQuiz: 'Start Quiz',
    next: 'Next',
    findRegion: 'Find My Region',
    finding: 'Finding...',
    yourRegion: 'Your Ideal Region',
    retake: 'Retake Quiz',

    // Event Card
    hiddenGem: '💎 Hidden Gem',
    culturalDepth: 'Cultural Depth',
    awayKm: 'km away',

    // Event Modal
    historicalNote: 'Historical Note',
    frenchPhrase: 'French Phrase',
    sensoryExperience: 'Sensory Experience',
    moodTags: 'Mood Tags',
    aiStory: '✨ AI Story Mode',
    generatingStory: 'Generating story...',

    // Route Planner
    routeLabel: 'Plan Your Trip',
    routeTitle: 'Cultural Route Planner',
    routeSubtitle: 'Select 2-3 events to build a cultural road trip across France',
    addToRoute: 'Add to Route',
    removeFromRoute: 'Remove',
    calculateRoute: 'Calculate Route',
    totalDistance: 'Total Distance',
    clearRoute: 'Clear Route',

    // Chatbot
    chatTitle: 'Cultural Guide',
    chatPlaceholder: 'Ask about French culture...',
    chatWelcome: 'Bonjour! I\'m your French culture guide. Ask me anything about events, regions, or traditions!',

    // Footer
    footerBrand: 'Your AI-powered guide to French cultural events, festivals, and traditions across all regions.',
    footerExplore: 'Explore',
    footerHome: 'Home',
    footerBrowse: 'Browse Events',
    footerFeatures: 'Features',
    footerProject: 'Project',
    footerPassport: 'Passport',

    // Theme
    lightMode: 'Light',
    darkMode: 'Dark',

    // Seasons
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',

    // Moods
    romantic: 'Romantic',
    adventurous: 'Adventurous',
    artistic: 'Artistic',
    peaceful: 'Peaceful',
    gourmet: 'Gourmet',
  },
  fr: {
    discover: 'Découvrir',
    events: 'Événements',
    myTrip: 'Mon Voyage',
    aiGuide: 'Guide IA',
    startExploring: 'Commencer',

    heroEyebrow: 'Exploration Culturelle par IA',
    heroTitle1: 'Découvrez',
    heroTitle2: 'La France',
    heroTitle3: 'À Travers Sa Culture',
    heroSubtitle: 'Trouvez festivals, traditions et expériences culturelles dans toutes les régions de France — filtrés par date, lieu et humeur. Propulsé par l\'IA.',

    classicSearch: 'Recherche Classique',
    aiSearch: 'Recherche IA',
    askNatural: '✨ Demandez en langage naturel',
    aiPlaceholder: 'ex: "festivals romantiques près de Lyon cet été sous 50km"',
    search: 'Chercher',
    thinking: 'Réflexion...',
    location: 'Lieu',
    allFrance: 'Toute la France',
    date: 'Date',
    proximity: 'Proximité',
    noLimit: 'Sans limite',
    exploreNow: 'Explorer →',
    mood: 'Humeur :',

    statEvents: 'Événements Culturels',
    statRegions: 'Régions',
    statCategories: 'Catégories',
    statYears: 'Ans d\'Histoire',

    featuresLabel: 'Pourquoi Nous',
    featuresTitle: 'Fonctionnalités Uniques',

    mapLabel: 'Interactif',
    mapTitle: 'Carte Culturelle Saisonnière',
    mapSubtitle: 'Voyez la France s\'animer — choisissez une saison pour voir les pics d\'activité culturelle',
    eventsWord: 'Événements',

    featuredLabel: 'En Vedette',
    featuredTitle: 'Expériences Culturelles Phares',

    passportLabel: 'Votre Voyage',
    passportTitle: 'Passeport Culturel',
    passportProgress: 'régions explorées',
    stampEarned: '✓ Visité',
    stampLocked: '🔒 Verrouillé',

    timeLabel: 'Voyager dans le Temps',
    timeTitle: 'Machine à Remonter le Temps',
    timeSubtitle: 'Glissez à travers les siècles — des foires médiévales aux mégafestivals modernes',

    immersionLabel: 'Votre Score',
    immersionTitle: 'Score d\'Immersion Culturelle',
    immersionBased: 'Basé sur vos événements explorés',

    browseLabel: 'Parcourir',
    browseTitle: 'Tous les Événements Culturels',
    allCategories: 'Toutes les Catégories',
    allSeasons: 'Toutes les Saisons',
    allRegions: 'Toutes les Régions',
    hiddenGemsOnly: 'Pépites Cachées',
    eventsFound: 'événements trouvés',

    resultsTitle: 'Résultats de Recherche',
    resultsFor: 'Résultats pour',
    sortBy: 'Trier :',
    sortDistance: 'Distance',
    sortMood: 'Humeur',
    sortDepth: 'Profondeur',
    sortDate: 'Date',
    noResults: 'Aucun événement trouvé — essayez une autre recherche !',

    passportPageTitle: 'Votre Passeport Culturel',
    regionQuiz: 'Trouvez Votre Région',
    quizTitle: 'Quiz Personnalité Régionale IA',
    quizSubtitle: 'Répondez à 5 questions et l\'IA trouvera votre région française idéale',
    startQuiz: 'Commencer le Quiz',
    next: 'Suivant',
    findRegion: 'Trouver Ma Région',
    finding: 'Recherche...',
    yourRegion: 'Votre Région Idéale',
    retake: 'Recommencer',

    hiddenGem: '💎 Pépite Cachée',
    culturalDepth: 'Profondeur Culturelle',
    awayKm: 'km',

    historicalNote: 'Note Historique',
    frenchPhrase: 'Phrase Française',
    sensoryExperience: 'Expérience Sensorielle',
    moodTags: 'Tags d\'Humeur',
    aiStory: '✨ Mode Histoire IA',
    generatingStory: 'Génération de l\'histoire...',

    routeLabel: 'Planifiez Votre Voyage',
    routeTitle: 'Planificateur d\'Itinéraire Culturel',
    routeSubtitle: 'Sélectionnez 2-3 événements pour créer un road trip culturel à travers la France',
    addToRoute: 'Ajouter',
    removeFromRoute: 'Retirer',
    calculateRoute: 'Calculer l\'Itinéraire',
    totalDistance: 'Distance Totale',
    clearRoute: 'Effacer',

    chatTitle: 'Guide Culturel',
    chatPlaceholder: 'Posez une question sur la culture française...',
    chatWelcome: 'Bonjour ! Je suis votre guide culturel français. Posez-moi toute question sur les événements, régions ou traditions !',

    footerBrand: 'Votre guide propulsé par l\'IA pour les événements culturels, festivals et traditions françaises dans toutes les régions.',
    footerExplore: 'Explorer',
    footerHome: 'Accueil',
    footerBrowse: 'Événements',
    footerFeatures: 'Fonctionnalités',
    footerProject: 'Projet',
    footerPassport: 'Passeport',

    lightMode: 'Clair',
    darkMode: 'Sombre',

    spring: 'Printemps',
    summer: 'Été',
    autumn: 'Automne',
    winter: 'Hiver',

    romantic: 'Romantique',
    adventurous: 'Aventureux',
    artistic: 'Artistique',
    peaceful: 'Paisible',
    gourmet: 'Gourmet',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const toggleLang = () => setLang((l) => (l === 'en' ? 'fr' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
