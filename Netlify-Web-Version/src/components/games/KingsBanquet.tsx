import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Check, X, Crown } from 'lucide-react';
import { GameProps, GameScreen, FoodItem } from './types';
import { StarRating } from './StarRating';

const HEALTHY_FOODS = [
  { name: 'Apple', emoji: '🍎' },
  { name: 'Carrot', emoji: '🥕' },
  { name: 'Broccoli', emoji: '🥦' },
  { name: 'Cheese', emoji: '🧀' },
  { name: 'Milk', emoji: '🥛' },
  { name: 'Fish', emoji: '🐟' },
  { name: 'Egg', emoji: '🥚' },
  { name: 'Celery', emoji: '🥬' },
  { name: 'Water', emoji: '💧' },
  { name: 'Nuts', emoji: '🥜' }
];

const SUGARY_FOODS = [
  { name: 'Candy', emoji: '🍬' },
  { name: 'Cake', emoji: '🎂' },
  { name: 'Soda', emoji: '🥤' },
  { name: 'Cookie', emoji: '🍪' },
  { name: 'Ice Cream', emoji: '🍦' },
  { name: 'Donut', emoji: '🍩' },
  { name: 'Lollipop', emoji: '🍭' },
  { name: 'Chocolate', emoji: '🍫' },
  { name: 'Cupcake', emoji: '🧁' },
  { name: 'Pie', emoji: '🥧' }
];

export function KingsBanquet({ onComplete }: GameProps) {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [score, setScore] = useState(0);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [health, setHealth] = useState(100);
  const [timeLeft, setTimeLeft] = useState(45);
  const [sorted, setSorted] = useState({ healthy: 0, sugary: 0 });
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', id: string } | null>(null);

  const calculateStars = (finalScore: number): number => {
    if (finalScore >= 600) return 3;
    if (finalScore >= 400) return 2;
    if (finalScore >= 200) return 1;
    return 0;
  };

  const spawnFood = useCallback(() => {
    const isHealthy = Math.random() > 0.5;
    const foodList = isHealthy ? HEALTHY_FOODS : SUGARY_FOODS;
    const food = foodList[Math.floor(Math.random() * foodList.length)];

    const newFood: FoodItem = {
      id: Math.random().toString(36).slice(2),
      x: Math.random() * 500 + 100,
      type: isHealthy ? 'healthy' : 'sugary',
      name: food.name,
      emoji: food.emoji
    };
    setFoods(prev => [...prev.slice(-7), newFood]);
  }, []);

  // Game timer
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setScreen('victory');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  // Spawn foods
  useEffect(() => {
    if (screen !== 'gameplay') return;
    spawnFood();
    const spawner = setInterval(spawnFood, 2500);
    return () => clearInterval(spawner);
  }, [screen, spawnFood]);

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [health, screen]);

  const handleSort = (foodId: string, target: 'healthy' | 'sugary') => {
    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    const isCorrect = food.type === target;

    setFeedback({ type: isCorrect ? 'correct' : 'wrong', id: foodId });
    setTimeout(() => setFeedback(null), 600);

    if (isCorrect) {
      setScore(s => s + 10 * (streak + 1));
      setStreak(s => s + 1);
      setSorted(prev => ({
        ...prev,
        [target]: prev[target as keyof typeof prev] + 1
      }));
    } else {
      setHealth(h => Math.max(0, h - 15));
      setStreak(0);
    }

    setFoods(prev => prev.filter(f => f.id !== foodId));
  };

  const handleStart = () => {
    setScreen('gameplay');
    setScore(0);
    setHealth(100);
    setFoods([]);
    setStreak(0);
    setTimeLeft(45);
    setSorted({ healthy: 0, sugary: 0 });
  };

  const handleComplete = () => {
    const stars = calculateStars(score);
    onComplete(score, stars);
  };

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-orange-400 via-amber-400 to-yellow-500 rounded-3xl overflow-hidden border-4 border-orange-300 shadow-2xl"
          >
            {/* Food Background */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              >
                {['🍎', '🍬', '🥕', '🍪', '🧀', '🍭', '🥦', '🍫'][i % 8]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                👑
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: '3px 3px 0 #EA580C, 6px 6px 0 #DC2626' }}>
                The King's Banquet
              </h1>

              <p className="text-xl text-white font-medium mb-2">
                🍎 Sort healthy foods from sugary treats! 🍬
              </p>
              <p className="text-white/80 mb-8 max-w-md">
                Tap ✓ for tooth-friendly foods, ✕ for sugary ones!
              </p>

              <motion.button
                onClick={handleStart}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #059669' }}
              >
                <Crown className="w-8 h-8" />
                FEAST!
              </motion.button>
            </div>
          </motion.div>
        )}

        {screen === 'gameplay' && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-100 rounded-3xl overflow-hidden border-4 border-orange-400 select-none"
          >
            {/* Royal Table */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-3xl border-t-8 border-amber-500">
              <div className="absolute top-2 left-0 right-0 h-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
              {/* Table decorations */}
              <div className="absolute top-8 left-10 text-3xl">🕯️</div>
              <div className="absolute top-8 right-10 text-3xl">🕯️</div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-40">
              {/* Health */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-pink-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-pink-600 font-bold text-sm">Kingdom HP</span>
                </div>
                <div className="w-28 h-4 bg-pink-200 rounded-full overflow-hidden border-2 border-pink-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-red-400 rounded-full"
                    animate={{ width: `${health}%` }}
                  />
                </div>
              </div>

              {/* Score & Timer */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-500">{score}</div>
                <div className="text-xs text-orange-400 font-bold">SCORE</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-lg">⏰</span>
                  <span className="text-lg font-bold text-purple-600">{timeLeft}s</span>
                </div>
                {streak > 1 && (
                  <motion.div
                    className="text-sm text-green-500 font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                  >
                    {streak}x STREAK! 🔥
                  </motion.div>
                )}
              </div>

              {/* Sorted Counter */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-green-400 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl">🍎</div>
                    <span className="text-green-600 font-bold">{sorted.healthy}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">🍬</div>
                    <span className="text-red-500 font-bold">{sorted.sugary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Foods */}
            <div className="absolute top-24 left-0 right-0 h-56 flex flex-wrap justify-center content-start gap-4 px-6 overflow-hidden">
              {foods.map(food => (
                <motion.div
                  key={food.id}
                  className="relative"
                  initial={{ scale: 0, y: -50, rotate: -180 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className={`w-20 h-20 bg-white rounded-2xl shadow-xl border-4 flex flex-col items-center justify-center ${feedback?.id === food.id
                      ? feedback.type === 'correct'
                        ? 'border-green-500 bg-green-100'
                        : 'border-red-500 bg-red-100'
                      : 'border-amber-300'
                      }`}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-4xl">{food.emoji}</span>
                    <span className="text-xs font-bold text-gray-600 mt-1">{food.name}</span>
                  </motion.div>

                  {/* Sort Buttons */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                    <motion.button
                      onClick={() => handleSort(food.id, 'healthy')}
                      className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg border-3 border-green-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <Check className="w-6 h-6" strokeWidth={3} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleSort(food.id, 'sugary')}
                      className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg border-3 border-red-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <X className="w-6 h-6" strokeWidth={3} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sorting Plates */}
            <div className="absolute bottom-36 left-0 right-0 flex justify-center gap-40">
              {/* Healthy Plate */}
              <motion.div
                className="text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-xl border-4 border-green-200 flex items-center justify-center text-4xl">
                  🥗
                </div>
                <div className="mt-2 text-green-700 font-bold text-lg">HEALTHY</div>
              </motion.div>

              {/* Sugary Plate */}
              <motion.div
                className="text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-300 to-red-500 rounded-full shadow-xl border-4 border-red-200 flex items-center justify-center text-4xl">
                  🍭
                </div>
                <div className="mt-2 text-red-600 font-bold text-lg">SUGARY</div>
              </motion.div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 border-4 border-amber-300 shadow-lg">
              <span className="text-amber-700 font-bold">✓ = Tooth-friendly 🦷 | ✕ = Too much sugar!</span>
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-amber-400 via-orange-400 to-yellow-500 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl"
          >
            {/* Confetti */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%` }}
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: 600,
                  opacity: [0, 1, 1, 0],
                  rotate: 360 * 3
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              >
                {['🍎', '⭐', '✨', '🎉', '🥕', '🧀'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-4"
              >
                👑
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: '3px 3px 0 #EA580C' }}
              >
                FEAST COMPLETE!
              </motion.h1>

              <motion.div
                className="text-6xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                style={{ textShadow: '4px 4px 0 #DC2626' }}
              >
                {score} pts
              </motion.div>

              <motion.div
                className="flex gap-8 text-xl mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-white bg-green-500/50 px-4 py-2 rounded-full">🍎 {sorted.healthy} Healthy</span>
                <span className="text-white bg-red-500/50 px-4 py-2 rounded-full">🍬 {sorted.sugary} Sugary</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <StarRating stars={calculateStars(score)} size="lg" />
              </motion.div>

              <motion.button
                onClick={handleComplete}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #059669' }}
              >
                <Trophy className="w-8 h-8" />
                CONTINUE! ➡️
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
