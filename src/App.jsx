import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import Events from './pages/Events';
import MyTrip from './pages/MyTrip';
import ChatGuide from './pages/ChatGuide';


const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Hide footer on full-screen chat page
  const showFooter = location.pathname !== '/chat-guide';

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-navy text-white' : 'bg-cream text-navy'}`}>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Home />
                </AnimatedPage>
              }
            />
            <Route
              path="/results"
              element={
                <AnimatedPage>
                  <Results />
                </AnimatedPage>
              }
            />
            <Route
              path="/events"
              element={
                <AnimatedPage>
                  <Events />
                </AnimatedPage>
              }
            />
            <Route
              path="/my-trip"
              element={
                <AnimatedPage>
                  <MyTrip />
                </AnimatedPage>
              }
            />
            <Route
              path="/chat-guide"
              element={
                <AnimatedPage>
                  <ChatGuide />
                </AnimatedPage>
              }
            />

          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
