import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowLeft, Check, X } from 'lucide-react';
import { GameProps } from './types';

type Screen = 'start' | 'playing' | 'victory';

interface FoodItem {
  id: number;
  emoji: string;
  name: string;
  isHealthy: boolean;
}

const FOODS: Omit<FoodItem, 'id'>[] = [
  { emoji: '🍎', name: 'Apple', isHealthy: true },
  { emoji: '🥕', name: 'Carrot', isHealthy: true },
  { emoji: '🥛', name: 'Milk', isHealthy: true },
  { emoji: '🧀', name: 'Cheese', isHealthy: true },
  { emoji: '🥦', name: 'Broccoli', isHealthy: true },
  { emoji: '🥚', name: 'Egg', isHealthy: true },
  { emoji: '🍗', name: 'Chicken', isHealthy: true },
  { emoji: '🥜', name: 'Nuts', isHealthy: true },
  { emoji: '🍭', name: 'Lollipop', isHealthy: false },
  { emoji: '🍬', name: 'Candy', isHealthy: false },
  { emoji: '🍩', name: 'Donut', isHealthy: false },
  { emoji: '🍫', name: 'Chocolate', isHealthy: false },
  { emoji: '🧁', name: 'Cupcake', isHealthy: false },
  { emoji: '🍪', name: 'Cookie', isHealthy: false },
  { emoji: '🥤', name: 'Soda', isHealthy: false },
  { emoji: '🍰', name: 'Cake', isHealthy: false },
];

export function KingsBanquet({ onComplete, onExit }: GameProps) {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [foodsAnswered, setFoodsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const maxScore = 500;
  const totalFoods = 15;

  // Get next food
  const getNextFood = useCallback(() => {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)];
    setCurrentFood({ ...food, id: Date.now() });
    setFeedback(null);
  }, []);

  // Start game
  useEffect(() => {
    if (screen === 'playing' && !currentFood) {
      getNextFood();
    }
  }, [screen, currentFood, getNextFood]);

  // Timer
  useEffect(() => {
    if (screen !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setScreen('victory');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen]);

  // Check if game complete
  useEffect(() => {
    if (foodsAnswered >= totalFoods && screen === 'playing') {
      setScreen('victory');
    }
  }, [foodsAnswered, screen]);

  const handleAnswer = (isHealthy: boolean) => {
    if (!currentFood || feedback) return;

    const correct = currentFood.isHealthy === isHealthy;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      const bonus = Math.min(streak * 5, 20);
      setScore(s => Math.min(maxScore, s + 25 + bonus));
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setFoodsAnswered(f => f + 1);

    setTimeout(() => {
      if (foodsAnswered + 1 < totalFoods) {
        getNextFood();
      } else {
        setScreen('victory');
      }
    }, 800);
  };

  const stars = score >= 400 ? 3 : score >= 250 ? 2 : 1;

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 relative"
          >
            {/* Floating food */}
            {['🍎', '🍭', '🥕', '🍬', '🧀', '🍩'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                style={{ left: `${10 + i * 15}%`, top: `${25 + (i % 2) * 40}%` }}
              >
                {emoji}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-3">👑</div>
              <h1 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                The King's
              </h1>
              <h2 className="text-xl font-bold text-yellow-200">Banquet!</h2>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              🦷
            </motion.div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-[280px]">
              <p className="text-white/90 text-center text-sm">
                Sort the foods! Is it healthy for teeth or sugary?
              </p>
              <p className="text-white/70 text-center text-xs mt-2">
                ✅ Healthy = Good! ❌ Sugary = Bad!
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('playing')}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Sorting
            </motion.button>

            {onExit && (
              <button
                onClick={onExit}
                className="mt-4 text-white/60 text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </motion.div>
        )}

        {screen === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* HUD */}
            <div className="p-3 flex items-center justify-between bg-black/30">
              <div className="text-white text-sm font-bold">
                {foodsAnswered}/{totalFoods}
              </div>

              <div className="text-yellow-300 font-bold text-lg">
                {score}
              </div>

              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <span className="bg-orange-500 px-2 py-1 rounded text-white text-xs font-bold">
                    🔥 {streak}x
                  </span>
                )}
                <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-bold">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Game area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {currentFood && (
                <motion.div
                  key={currentFood.id}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative"
                >
                  {/* Food card */}
                  <motion.div
                    className={`w-52 h-52 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center ${feedback === 'correct' ? 'bg-green-100' :
                        feedback === 'wrong' ? 'bg-red-100' : ''
                      }`}
                    animate={feedback ? { scale: [1, 1.1, 1] } : {}}
                  >
                    <span className="text-7xl mb-3">{currentFood.emoji}</span>
                    <span className="text-xl font-bold text-gray-800">{currentFood.name}</span>

                    {feedback && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                      >
                        {feedback === 'correct' ? (
                          <Check className="w-8 h-8 text-white" />
                        ) : (
                          <X className="w-8 h-8 text-white" />
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Feedback text */}
                  {feedback && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center mt-4 font-bold text-lg ${feedback === 'correct' ? 'text-green-200' : 'text-red-200'
                        }`}
                    >
                      {feedback === 'correct'
                        ? (currentFood.isHealthy ? '🦷 Great for teeth!' : '✓ You knew it!')
                        : (currentFood.isHealthy ? 'Actually healthy!' : 'That\'s sugary!')
                      }
                    </motion.p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-black/30 flex items-center justify-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAnswer(true)}
                disabled={!!feedback}
                className="w-28 h-20 bg-gradient-to-b from-green-400 to-green-600 rounded-2xl text-white shadow-lg flex flex-col items-center justify-center active:from-green-500 active:to-green-700 disabled:opacity-50"
              >
                <Check className="w-8 h-8" />
                <span className="text-xs font-bold mt-1">Healthy</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleAnswer(false)}
                disabled={!!feedback}
                className="w-28 h-20 bg-gradient-to-b from-red-400 to-red-600 rounded-2xl text-white shadow-lg flex flex-col items-center justify-center active:from-red-500 active:to-red-700 disabled:opacity-50"
              >
                <X className="w-8 h-8" />
                <span className="text-xs font-bold mt-1">Sugary</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative"
          >
            {/* Confetti */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: [0, 400],
                  x: Math.sin(i) * 50,
                  opacity: [1, 0],
                  rotate: 360,
                }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                style={{ left: `${5 + i * 10}%` }}
              >
                {['⭐', '🍎', '👑', '✨'][i % 4]}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl mb-4"
            >
              🎊
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2">
              Royal Feast Complete!
            </h2>

            <p className="text-yellow-300 text-3xl font-bold mb-4">
              {score} points
            </p>

            {/* Stars */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Star
                    className={`w-12 h-12 ${i <= stars
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-600'
                      }`}
                  />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(score, stars)}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg"
            >
              Continue ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
