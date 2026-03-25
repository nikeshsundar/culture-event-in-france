import { createContext, useContext, useEffect, useState } from 'react';

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
    from: 'From',
    to: 'To',
    proximity: 'Proximity',
    noLimit: 'No limit',
    exploreNow: 'Explore Now →',
    randomSearch: 'Random Search',
    randomSearchHint: 'Get a random search suggestion to inspire you!',
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
    mysteryRoute: '✨ Surprise Me Route',

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

    // Global actions and labels
    languageEnglish: 'EN',
    languageFrench: 'FR',
    switchToFrench: 'Switch to French',
    switchToEnglish: 'Switch to English',
    addedToVault: 'Added to Experience Vault!',
    alreadyInVault: 'Already in your Vault.',
    addedToItineraryFor: 'Added to Itinerary for',

    // Home sections
    featuredSubtitle: "Explore some of France's most iconic cultural celebrations",

    // Features section
    featuresSubtitle: 'Six innovative features that transform how you experience French culture',
    feature1Title: 'Cultural Passport',
    feature1Description: 'Collect digital stamps as you explore each region of France. Track your journey and unlock new cultural discoveries across all 13 regions.',
    feature1Badge: 'Gamification',
    feature2Title: 'Mood-Based Discovery',
    feature2Description: "Tell us how you feel - Romantic, Adventurous, Artistic, or Peaceful - and we'll match you with the perfect cultural experience for your mood.",
    feature2Badge: 'AI-Powered',
    feature3Title: 'Cultural Time Machine',
    feature3Description: 'Slide through history to see what cultural events were happening in France on the same date across different years. Past meets present.',
    feature3Badge: 'Historical Layer',
    feature4Title: 'Sensory Tags',
    feature4Description: 'Every event is tagged by the sensory experience it offers - visual spectacle, sound immersion, taste, nature, or historical depth.',
    feature4Badge: 'Deep Filtering',
    feature5Title: 'Cultural Immersion Score',
    feature5Description: 'Watch your French cultural immersion percentage grow as you explore more events. Broken down by region, season, and category.',
    feature5Badge: 'AI Scoring',
    feature6Title: 'Seasonal Animated Map',
    feature6Description: 'An animated map of France where regions light up and shift color based on the selected season - showing where culture peaks right now.',
    feature6Badge: 'Interactive Map',

    // Events and results
    hiddenGems: 'Hidden Gems',
    noEventsMatchFilters: 'No events match your filters',
    relaxFilters: 'Try relaxing your filter criteria',
    aiSearchLabel: 'AI Search',
    eventsNear: 'Events near',
    nearestSort: 'Sort: Nearest',
    bestMoodSort: 'Sort: Best Mood Match',
    depthSort: 'Sort: Cultural Depth',
    dateSort: 'Sort: Date',
    noEventsFoundTitle: 'No events found',
    noEventsFoundHint: 'Try adjusting your search criteria - different date, wider range, or a different mood.',
    moodSuffix: 'mood',
    withinKm: 'within',

    // Event card and modal
    hiddenGemTag: 'Hidden Gem',
    saveToVault: 'Save to Vault',
    addToItinerary: 'Add to Itinerary',
    aiWritingStory: 'AI is writing your story...',
    storyModeButton: 'Story Mode - AI Cultural Narrative',
    knowMoreButton: 'Know More - Chat with AI about this event',
    askAboutEvent: 'Ask about',
    whatShouldIWear: 'What should I wear to',
    bestFoodNear: 'Best food near',
    howToGetTickets: 'How to get tickets?',
    whatsTheHistory: "What's the history?",
    askAnythingAbout: 'Ask anything about',
    away: 'away',

    // My trip page
    customPlanner: 'Custom Planner',
    yourFrenchAdventure: 'Your French Adventure',
    myTripSubtitle: 'Curate your journey by saving favorite events and scheduling them into your itinerary. Your personalized guide to discovering La France.',

    // Experience vault
    savedPicks: 'Saved Picks',
    experienceVaultTitle: 'Experience Vault',
    experienceVaultSubtitle: 'Save events you love and keep quick personal notes for later.',
    selectEventToSave: 'Select an event to save',
    yourVaultEmpty: 'Your vault is empty.',
    addNotePlaceholder: 'Add your note (what to see, budget, people, etc.)',

    // Itinerary
    planAhead: 'Plan Ahead',
    myItineraryTitle: 'My Itinerary',
    myItinerarySubtitle: 'Build your personal schedule with dates and times.',
    selectEvent: 'Select event',
    noPlannedEvents: 'No planned events yet.',

    // Route planner extras
    roadTrip: 'Road Trip',
    routePickSubtitle: "Pick up to 5 events and we'll map your perfect French road trip",
    yourStops: 'Your Stops',
    addAStop: 'Add a stop',
    addTwoStopsHint: 'Add at least 2 stops to see your route',
    total: 'Total',
    drive: 'Drive',
    nowLabel: 'Now',
    historyLabel: 'History',

    // Chat page
    aiAssistant: 'AI Assistant',
    chatSubheading: 'Your personal guide to French culture, history, and traditions.',
    chatPrompt1: 'Best time to visit Paris?',
    chatPrompt2: 'What is Bastille Day?',
    chatPrompt3: 'Famous foods in Lyon',
    chatPrompt4: 'Castles in Loire Valley',
    askSomething: 'Ask something...',
    aiMistakesNote: 'AI can make mistakes. Verify important information.',
    apiTokenMissing: 'API token is missing. Please set VITE_GITHUB_TOKEN in your .env file.',
    rateLimitReached: 'Rate limit reached. Please wait a few seconds and try again.',
    apiError: 'Sorry, API error',
    unsureAnswer: "I'm not sure about that. Try asking about a specific French cultural event or region!",
    networkError: 'Network error. Please check your connection.',

    // Footer
    footerDiscoverEvents: 'Discover Events',
    footerAllEvents: 'All Events',
    footerByRegion: 'By Region',
    footerCalendar: 'Cultural Calendar',
    footerMyPassport: 'My Passport',
    footerTimeMachine: 'Time Machine',
    footerMoodFinder: 'Mood Finder',
    footerImmersion: 'Immersion Score',
    footerCopyright: 'La France Culturelle - PBL Project',

    // Taxonomy labels
    categoryMusic: 'Music',
    categoryFilm: 'Film',
    categoryTheatre: 'Theatre',
    categoryArt: 'Art',
    categoryCarnival: 'Carnival',
    categoryFoodWine: 'Food & Wine',
    categoryFashion: 'Fashion',
    categorySports: 'Sports',
    categoryLightFestival: 'Light Festival',
    categoryMarket: 'Market',
    categoryNationalHoliday: 'National Holiday',
    categoryFestival: 'Festival',
    sensoryVisual: 'Visual',
    sensorySound: 'Sound',
    sensoryTaste: 'Taste',
    sensoryOutdoor: 'Nature & Outdoors',
    sensoryHistorical: 'Historical Depth',
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
    from: 'Du',
    to: 'Au',
    proximity: 'Proximité',
    noLimit: 'Sans limite',
    exploreNow: 'Explorer →',
    randomSearch: 'Recherche Aléatoire',
    randomSearchHint: 'Obtenez une suggestion aléatoire pour vous inspirer !',
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
    mysteryRoute: '✨ Itinéraire Surprise',

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

    languageEnglish: 'EN',
    languageFrench: 'FR',
    switchToFrench: 'Passer en francais',
    switchToEnglish: 'Passer en anglais',
    addedToVault: "Ajoute au Coffre d'Experiences !",
    alreadyInVault: 'Deja dans votre Coffre.',
    addedToItineraryFor: "Ajoute a l'itineraire pour",

    featuredSubtitle: 'Explorez certaines des celebrations culturelles les plus emblematiques de France',

    featuresSubtitle: 'Six fonctionnalites innovantes qui transforment votre experience de la culture francaise',
    feature1Title: 'Passeport Culturel',
    feature1Description: 'Collectionnez des tampons numeriques en explorant chaque region de France. Suivez votre parcours et debloquez de nouvelles decouvertes culturelles dans les 13 regions.',
    feature1Badge: 'Gamification',
    feature2Title: "Decouverte selon l'humeur",
    feature2Description: "Dites-nous votre humeur - Romantique, Aventureux, Artistique ou Paisible - et nous trouverons l'experience culturelle ideale.",
    feature2Badge: 'Propulse par IA',
    feature3Title: 'Machine a Remonter le Temps',
    feature3Description: "Glissez a travers l'histoire pour voir quels evenements culturels avaient lieu en France a la meme date selon les annees.",
    feature3Badge: 'Couche Historique',
    feature4Title: 'Etiquettes Sensorielles',
    feature4Description: "Chaque evenement est etiquete selon l'experience sensorielle proposee - visuel, son, gout, nature, ou profondeur historique.",
    feature4Badge: 'Filtrage Avance',
    feature5Title: "Score d'Immersion Culturelle",
    feature5Description: "Regardez votre pourcentage d'immersion culturelle augmenter a mesure que vous explorez plus d'evenements.",
    feature5Badge: 'Score IA',
    feature6Title: 'Carte Animee des Saisons',
    feature6Description: "Une carte animee de la France ou les regions s'illuminent selon la saison selectionnee.",
    feature6Badge: 'Carte Interactive',

    hiddenGems: 'Pepites Cachees',
    noEventsMatchFilters: "Aucun evenement ne correspond a vos filtres",
    relaxFilters: 'Essayez de desserrer vos criteres de filtre',
    aiSearchLabel: 'Recherche IA',
    eventsNear: 'Evenements pres de',
    nearestSort: 'Trier : Plus proches',
    bestMoodSort: "Trier : Meilleure correspondance d'humeur",
    depthSort: 'Trier : Profondeur culturelle',
    dateSort: 'Trier : Date',
    noEventsFoundTitle: 'Aucun evenement trouve',
    noEventsFoundHint: 'Essayez une autre date, une zone plus large, ou une autre humeur.',
    moodSuffix: 'humeur',
    withinKm: 'dans un rayon de',

    hiddenGemTag: 'Pepite Cachee',
    saveToVault: 'Sauvegarder dans le Coffre',
    addToItinerary: "Ajouter a l'itineraire",
    aiWritingStory: 'IA redige votre histoire...',
    storyModeButton: 'Mode Histoire - Recit Culturel IA',
    knowMoreButton: "En savoir plus - Discuter avec l'IA sur cet evenement",
    askAboutEvent: 'Poser une question sur',
    whatShouldIWear: 'Que dois-je porter pour',
    bestFoodNear: 'Meilleure cuisine pres de',
    howToGetTickets: 'Comment obtenir des billets ?',
    whatsTheHistory: "Quelle est l'histoire ?",
    askAnythingAbout: "Demandez tout sur",
    away: 'de distance',

    customPlanner: 'Planificateur Personnalise',
    yourFrenchAdventure: 'Votre Aventure Francaise',
    myTripSubtitle: 'Construisez votre voyage en sauvegardant vos evenements preferes et en les planifiant dans votre itineraire. Votre guide personnalise pour decouvrir La France.',

    savedPicks: 'Selections Sauvegardees',
    experienceVaultTitle: "Coffre d'Experiences",
    experienceVaultSubtitle: 'Sauvegardez les evenements que vous aimez et ajoutez des notes personnelles.',
    selectEventToSave: 'Selectionnez un evenement a sauvegarder',
    yourVaultEmpty: 'Votre coffre est vide.',
    addNotePlaceholder: 'Ajoutez votre note (a voir, budget, personnes, etc.)',

    planAhead: 'Planifier',
    myItineraryTitle: 'Mon Itineraire',
    myItinerarySubtitle: 'Construisez votre programme personnel avec dates et horaires.',
    selectEvent: 'Selectionner un evenement',
    noPlannedEvents: 'Aucun evenement planifie pour le moment.',

    roadTrip: 'Road Trip',
    routePickSubtitle: "Choisissez jusqu'a 5 evenements et nous tracerons votre road trip culturel ideal",
    yourStops: 'Vos etapes',
    addAStop: 'Ajouter une etape',
    addTwoStopsHint: 'Ajoutez au moins 2 etapes pour voir votre itineraire',
    total: 'Total',
    drive: 'Conduite',
    nowLabel: 'Maintenant',
    historyLabel: 'Historique',

    aiAssistant: 'Assistant IA',
    chatSubheading: 'Votre guide personnel de la culture, de lhistoire et des traditions francaises.',
    chatPrompt1: 'Meilleure periode pour visiter Paris ?',
    chatPrompt2: 'Quest-ce que la Fete nationale ?',
    chatPrompt3: 'Specialites culinaires de Lyon',
    chatPrompt4: 'Chateaux de la vallee de la Loire',
    askSomething: 'Posez une question...',
    aiMistakesNote: "L'IA peut se tromper. Verifiez les informations importantes.",
    apiTokenMissing: 'Le jeton API est manquant. Ajoutez VITE_GITHUB_TOKEN dans votre fichier .env.',
    rateLimitReached: 'Limite atteinte. Attendez quelques secondes puis reessayez.',
    apiError: 'Desole, erreur API',
    unsureAnswer: "Je ne suis pas sur. Essayez une question sur un evenement ou une region francaise.",
    networkError: 'Erreur reseau. Verifiez votre connexion.',

    footerDiscoverEvents: 'Decouvrir les evenements',
    footerAllEvents: 'Tous les evenements',
    footerByRegion: 'Par region',
    footerCalendar: 'Calendrier culturel',
    footerMyPassport: 'Mon Passeport',
    footerTimeMachine: 'Machine Temporelle',
    footerMoodFinder: "Recherche par humeur",
    footerImmersion: "Score d'immersion",
    footerCopyright: 'La France Culturelle - Projet PBL',

    categoryMusic: 'Musique',
    categoryFilm: 'Cinema',
    categoryTheatre: 'Theatre',
    categoryArt: 'Art',
    categoryCarnival: 'Carnaval',
    categoryFoodWine: 'Gastronomie & Vin',
    categoryFashion: 'Mode',
    categorySports: 'Sports',
    categoryLightFestival: 'Festival de Lumiere',
    categoryMarket: 'Marche',
    categoryNationalHoliday: 'Fete Nationale',
    categoryFestival: 'Festival',
    sensoryVisual: 'Visuel',
    sensorySound: 'Son',
    sensoryTaste: 'Gout',
    sensoryOutdoor: 'Nature & Plein air',
    sensoryHistorical: 'Profondeur Historique',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const toggleLang = () => setLang((l) => (l === 'en' ? 'fr' : 'en'));
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
