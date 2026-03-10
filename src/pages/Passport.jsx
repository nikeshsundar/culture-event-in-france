import { useState } from 'react';
import CulturalPassport from '../components/CulturalPassport';
import ImmersionScore from '../components/ImmersionScore';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import events from '../data/events.json';
import { getRegionFromQuiz } from '../ai/gemini';

const quizQuestions = [
  {
    key: 'food',
    question: 'What cuisine excites you most?',
    options: ['Wine & cheese', 'Seafood', 'Pastries & bread', 'Hearty mountain food', 'Fine dining'],
  },
  {
    key: 'pace',
    question: 'What is your ideal travel pace?',
    options: ['Slow & relaxed', 'Moderately active', 'Fast-paced adventure', 'City hopping'],
  },
  {
    key: 'season',
    question: 'What is your favorite season?',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
  },
  {
    key: 'interest',
    question: 'What interests you most?',
    options: ['Art & museums', 'Music & festivals', 'History & architecture', 'Nature & outdoor', 'Food & markets'],
  },
  {
    key: 'landscape',
    question: 'What landscape calls to you?',
    options: ['Coastal beaches', 'Lavender fields', 'Snowy mountains', 'Urban streets', 'Countryside vineyards'],
  },
];

export default function Passport() {
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Demo explored data
  const exploredRegions = [
    'Île-de-France',
    'Provence-Alpes-Côte d\'Azur',
    'Nouvelle-Aquitaine',
    'Auvergne-Rhône-Alpes',
  ];
  const exploredEvents = events.filter((e) => exploredRegions.includes(e.region));

  const handleAnswer = async (option) => {
    const newAnswers = { ...answers, [quizQuestions[quizStep].key]: option };
    setAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // All answered — call AI
      setQuizLoading(true);
      const result = await getRegionFromQuiz(newAnswers);
      setQuizResult(result);
      setQuizLoading(false);
    }
  };

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Passport */}
      <CulturalPassport exploredRegions={exploredRegions} />

      {/* Immersion Score */}
      <ImmersionScore exploredEvents={exploredEvents} />

      {/* Region Quiz */}
      <section className="py-24 px-6 md:px-12 bg-cream text-center">
        <span className="inline-block gold-gradient text-navy text-[0.65rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4">
          AI-Powered Quiz
        </span>
        <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-navy mb-3">
          Which Region Matches You?
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-10">
          Answer 5 quick questions and AI will match you to your perfect French region
        </p>

        {!showQuiz ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQuiz(true)}
            className="gold-gradient text-navy px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-gold/30"
          >
            <Sparkles size={14} className="inline mr-2 -mt-0.5" />
            Take the Quiz
          </motion.button>
        ) : quizLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto py-12"
          >
            <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">AI is analyzing your preferences...</p>
          </motion.div>
        ) : quizResult ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="font-playfair text-2xl font-bold text-navy mb-2">Your Region</h3>
            <p className="text-gold-dark font-playfair text-xl font-bold mb-3">{quizResult.region}</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{quizResult.reason}</p>
            <button
              onClick={() => {
                setShowQuiz(false);
                setQuizStep(0);
                setAnswers({});
                setQuizResult(null);
              }}
              className="text-sm text-gold-dark font-semibold hover:underline"
            >
              Retake Quiz →
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            {/* Progress */}
            <div className="flex gap-1.5 justify-center mb-6">
              {quizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= quizStep ? 'w-8 gold-gradient' : 'w-4 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <h3 className="font-playfair text-xl font-bold text-navy mb-6">
              {quizQuestions[quizStep].question}
            </h3>

            <div className="grid gap-3">
              {quizQuestions[quizStep].options.map((opt) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(opt)}
                  className="w-full bg-white border border-navy/10 rounded-xl px-5 py-3.5 text-sm font-medium text-navy hover:border-gold hover:shadow-md transition-all text-left"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
