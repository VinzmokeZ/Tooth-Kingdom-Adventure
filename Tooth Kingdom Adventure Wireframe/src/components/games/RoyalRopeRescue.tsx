import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { GameProps } from './types';

type Screen = 'start' | 'playing' | 'victory';

interface Gap {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

export function RoyalRopeRescue({ onComplete, onExit }: GameProps) {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [flossY, setFlossY] = useState(50);
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [lives, setLives] = useState(3);
  const [, setScrollX] = useState(0);
  const [isPerfect, setIsPerfect] = useState(false);

  const maxScore = 500;

  // Create gaps (teeth to navigate through)
  useEffect(() => {
    if (screen !== 'playing') return;

    const gapInterval = setInterval(() => {
      const newGap: Gap = {
        id: Date.now(),
        x: 110,
        gapY: 25 + Math.random() * 50,
        gapHeight: 25,
        passed: false,
      };
      setGaps(prev => [...prev, newGap]);
    }, 2000);

    return () => clearInterval(gapInterval);
  }, [screen]);

  // Move gaps toward player
  useEffect(() => {
    if (screen !== 'playing') return;

    const moveInterval = setInterval(() => {
      setScrollX(x => x + 1);

      setGaps(prev => {
        return prev.map(gap => {
          const newX = gap.x - 1.5;

          // Check if floss passed through gap
          if (!gap.passed && newX <= 15 && newX >= 10) {
            const flossInGap = flossY >= gap.gapY && flossY <= gap.gapY + gap.gapHeight;

            if (flossInGap) {
              // Perfect center bonus
              const center = gap.gapY + gap.gapHeight / 2;
              const distFromCenter = Math.abs(flossY - center);
              const isPerfectPass = distFromCenter < 5;

              setIsPerfect(isPerfectPass);
              setTimeout(() => setIsPerfect(false), 500);

              setScore(s => Math.min(maxScore, s + (isPerfectPass ? 30 : 20)));
              return { ...gap, x: newX, passed: true };
            } else if (newX <= 12) {
              setLives(l => l - 1);
              return { ...gap, x: newX, passed: true };
            }
          }

          return { ...gap, x: newX };
        }).filter(gap => gap.x > -10);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [screen, flossY]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && screen === 'playing') {
      setScreen('victory');
    }
  }, [lives, screen]);

  // Win condition
  useEffect(() => {
    if (score >= maxScore && screen === 'playing') {
      setScreen('victory');
    }
  }, [score, screen]);

  const moveFloss = useCallback((direction: 'up' | 'down') => {
    if (screen !== 'playing') return;
    setFlossY(y => {
      if (direction === 'up') return Math.max(10, y - 8);
      return Math.min(90, y + 8);
    });
  }, [screen]);

  const stars = score >= 400 ? 3 : score >= 250 ? 2 : 1;

  return (
    <div className="w-full h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 relative"
          >
            {/* Floating elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                style={{ left: `${10 + i * 15}%`, top: `${30 + (i % 2) * 35}%` }}
              >
                🦷
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-3">🧵</div>
              <h1 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                Royal Rope
              </h1>
              <h2 className="text-xl font-bold text-yellow-300">Rescue!</h2>
            </motion.div>

            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              🪥
            </motion.div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-[280px]">
              <p className="text-white/90 text-center text-sm">
                Guide the floss through the gaps between teeth!
              </p>
              <p className="text-white/70 text-center text-xs mt-2">
                Hit the center for bonus points!
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('playing')}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Flossing
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
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < lives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>

              <div className="text-yellow-300 font-bold text-lg">
                {score} / {maxScore}
              </div>

              {isPerfect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold"
                >
                  PERFECT!
                </motion.span>
              )}
            </div>

            {/* Game area */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600">
              {/* Floss */}
              <motion.div
                className="absolute left-[12%] w-8 h-8 flex items-center justify-center"
                animate={{ top: `${flossY}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ transform: 'translateY(-50%)' }}
              >
                <span className="text-3xl">🧵</span>
              </motion.div>

              {/* Gaps (teeth) */}
              {gaps.map(gap => (
                <div key={gap.id}>
                  {/* Top tooth */}
                  <motion.div
                    className="absolute w-12 flex flex-col items-center"
                    style={{
                      left: `${gap.x}%`,
                      top: 0,
                      height: `${gap.gapY}%`,
                    }}
                  >
                    <div className="flex-1 w-10 bg-gradient-to-b from-white to-gray-200 rounded-b-xl shadow-lg" />
                    <span className="text-2xl -mt-2">🦷</span>
                  </motion.div>

                  {/* Bottom tooth */}
                  <motion.div
                    className="absolute w-12 flex flex-col items-center"
                    style={{
                      left: `${gap.x}%`,
                      top: `${gap.gapY + gap.gapHeight}%`,
                      height: `${100 - gap.gapY - gap.gapHeight}%`,
                    }}
                  >
                    <span className="text-2xl -mb-2 rotate-180">🦷</span>
                    <div className="flex-1 w-10 bg-gradient-to-t from-white to-gray-200 rounded-t-xl shadow-lg" />
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="p-4 bg-black/30 flex items-center justify-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => moveFloss('up')}
                onClick={() => moveFloss('up')}
                className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl text-white shadow-lg flex items-center justify-center active:from-blue-500 active:to-blue-700"
              >
                <ChevronUp className="w-10 h-10" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => moveFloss('down')}
                onClick={() => moveFloss('down')}
                className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl text-white shadow-lg flex items-center justify-center active:from-blue-500 active:to-blue-700"
              >
                <ChevronDown className="w-10 h-10" />
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
                {['⭐', '✨', '🧵'][i % 3]}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl mb-4"
            >
              {lives > 0 ? '🎉' : '💪'}
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2">
              {lives > 0 ? 'Great Flossing!' : 'Nice Try!'}
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
