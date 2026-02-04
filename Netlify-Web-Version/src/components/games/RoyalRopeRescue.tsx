import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { GameProps, GameScreen } from './types';
import { StarRating } from './StarRating';

interface Obstacle {
  id: string;
  y: number;
  gap: number;
  gapSize: number;
  passed: boolean;
}

export function RoyalRopeRescue({ onComplete }: GameProps) {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [score, setScore] = useState(0);
  const [ropeY, setRopeY] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [health, setHealth] = useState(100);
  const [distance, setDistance] = useState(0);
  const [debris, setDebris] = useState(0);
  const [isPerfect, setIsPerfect] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const calculateStars = (finalScore: number): number => {
    if (finalScore >= 400) return 3;
    if (finalScore >= 250) return 2;
    if (finalScore >= 100) return 1;
    return 0;
  };

  const spawnObstacle = useCallback(() => {
    const gapSize = 90 + Math.random() * 40;
    const newObstacle: Obstacle = {
      id: Math.random().toString(36).slice(2),
      y: 550,
      gap: Math.random() * (350 - gapSize) + 50,
      gapSize,
      passed: false
    };
    setObstacles(prev => [...prev, newObstacle]);
  }, []);

  // Move obstacles
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const mover = setInterval(() => {
      setDistance(d => d + 1);
      setObstacles(prev => {
        const updated = prev.map(obs => {
          const newY = obs.y - 4;

          if (newY < 120 && newY > 60 && !obs.passed) {
            const ropeTop = ropeY - 25;
            const ropeBottom = ropeY + 25;
            const gapTop = obs.gap;
            const gapBottom = obs.gap + obs.gapSize;

            if (ropeTop < gapTop || ropeBottom > gapBottom) {
              setHealth(h => Math.max(0, h - 20));
            } else {
              const centerGap = obs.gap + obs.gapSize / 2;
              const distFromCenter = Math.abs(ropeY - centerGap);
              const isPerfectPass = distFromCenter < 20;

              if (isPerfectPass) {
                setIsPerfect(true);
                setTimeout(() => setIsPerfect(false), 500);
                setScore(s => s + 25);
              } else {
                setScore(s => s + 10);
              }
              setDebris(d => d + 1);
            }
            return { ...obs, y: newY, passed: true };
          }

          return { ...obs, y: newY };
        });
        return updated.filter(obs => obs.y > -50);
      });
    }, 30);
    return () => clearInterval(mover);
  }, [screen, ropeY]);

  // Spawn obstacles
  useEffect(() => {
    if (screen !== 'gameplay') return;
    spawnObstacle();
    const spawner = setInterval(spawnObstacle, 1800);
    return () => clearInterval(spawner);
  }, [screen, spawnObstacle]);

  // Keyboard controls
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setRopeY(prev => Math.max(40, prev - 25));
      } else if (e.key === 'ArrowDown') {
        setRopeY(prev => Math.min(360, prev + 25));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen]);

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [health, screen]);

  // End game after distance
  useEffect(() => {
    if (distance >= 800 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [distance, screen]);

  const handleStart = () => {
    setScreen('gameplay');
    setScore(0);
    setHealth(100);
    setRopeY(200);
    setObstacles([]);
    setDistance(0);
    setDebris(0);
  };

  const handleComplete = () => {
    const stars = calculateStars(score);
    onComplete(score, stars);
  };

  const moveRope = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setRopeY(prev => Math.max(40, prev - 30));
    } else {
      setRopeY(prev => Math.min(360, prev + 30));
    }
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
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden border-4 border-indigo-300 shadow-2xl"
          >
            {/* Stars Background */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ duration: 1 + Math.random() * 2, repeat: Infinity }}
              >
                {Math.random() > 0.5 ? '✨' : '⭐'}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🧵
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: '3px 3px 0 #7C3AED, 6px 6px 0 #EC4899' }}>
                Royal Rope Rescue
              </h1>

              <p className="text-xl text-white font-medium mb-2">
                🦷 Guide the floss between the teeth! 🦷
              </p>
              <p className="text-white/80 mb-8 max-w-md">
                Use UP/DOWN arrows or tap buttons to navigate through gaps!
              </p>

              <motion.button
                onClick={handleStart}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #0284C7' }}
              >
                <Sparkles className="w-8 h-8" />
                FLOSS!
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
            ref={gameRef}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-pink-200 via-pink-100 to-rose-200 rounded-3xl overflow-hidden border-4 border-pink-400 select-none"
          >
            {/* Gum Background */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-pink-400 to-pink-300 rounded-l-3xl">
              {/* Gum texture */}
              <div className="absolute inset-0 flex flex-col justify-around py-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-2 bg-pink-500/30 rounded-full" />
                ))}
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-pink-400 to-pink-300 rounded-r-3xl">
              <div className="absolute inset-0 flex flex-col justify-around py-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-2 bg-pink-500/30 rounded-full" />
                ))}
              </div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-3 left-20 right-20 flex justify-between items-start z-40">
              {/* Health */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-pink-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-pink-600 font-bold text-sm">Floss HP</span>
                </div>
                <div className="w-24 h-4 bg-pink-200 rounded-full overflow-hidden border-2 border-pink-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-red-400 rounded-full"
                    animate={{ width: `${health}%` }}
                  />
                </div>
              </div>

              {/* Score */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-500">{score}</div>
                <div className="text-xs text-orange-400 font-bold">SCORE</div>
                {isPerfect && (
                  <motion.div
                    className="text-green-500 font-bold text-sm"
                    animate={{ scale: [1, 1.3, 1] }}
                  >
                    PERFECT! ✨
                  </motion.div>
                )}
              </div>

              {/* Progress */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-indigo-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="text-indigo-600 font-bold text-sm">Progress</span>
                </div>
                <div className="w-24 h-4 bg-indigo-200 rounded-full overflow-hidden border-2 border-indigo-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                    animate={{ width: `${Math.min(100, distance / 8)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Teeth/Obstacles */}
            {obstacles.map(obs => (
              <motion.div
                key={obs.id}
                className="absolute left-16 right-16 z-10"
                style={{ top: obs.y }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Top Tooth */}
                <div
                  className="absolute left-0 right-0 bg-gradient-to-b from-white to-blue-50 rounded-b-2xl shadow-lg border-4 border-cyan-200"
                  style={{ height: obs.gap, top: 0 }}
                >
                  <div className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-b from-blue-100 to-transparent rounded-b-2xl" />
                  {/* Tooth shine */}
                  <div className="absolute top-4 left-4 w-8 h-4 bg-white/80 rounded-full" />
                </div>

                {/* Gap Indicator - Sparkle */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 text-3xl"
                  style={{ top: obs.gap + obs.gapSize / 2 - 18 }}
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⭐
                </motion.div>

                {/* Bottom Tooth */}
                <div
                  className="absolute left-0 right-0 bg-gradient-to-t from-white to-blue-50 rounded-t-2xl shadow-lg border-4 border-cyan-200"
                  style={{ height: 400 - obs.gap - obs.gapSize, top: obs.gap + obs.gapSize }}
                >
                  <div className="absolute top-2 left-0 right-0 h-3 bg-gradient-to-t from-blue-100 to-transparent rounded-t-2xl" />
                  <div className="absolute bottom-4 left-4 w-8 h-4 bg-white/80 rounded-full" />
                </div>
              </motion.div>
            ))}

            {/* Dental Floss */}
            <motion.div
              className="absolute left-16 right-16 z-20 flex items-center justify-center"
              style={{ top: 80 }}
            >
              <motion.div
                className="relative"
                animate={{ y: ropeY - 200 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Floss Line */}
                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-[600px] bg-gradient-to-b from-cyan-300 via-white to-cyan-300 opacity-60 rounded-full" style={{ top: -300 }} />

                {/* Main Floss Node */}
                <motion.div
                  className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center border-4 ${isPerfect
                    ? 'bg-gradient-to-br from-yellow-300 to-amber-400 border-yellow-200'
                    : 'bg-gradient-to-br from-cyan-300 to-blue-400 border-cyan-200'
                    }`}
                  animate={{
                    scale: isPerfect ? [1, 1.4, 1] : [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: isPerfect ? 0.5 : 1.5, repeat: isPerfect ? 0 : Infinity }}
                >
                  <span className="text-3xl">🧵</span>

                  {/* Glow */}
                  <div className={`absolute -inset-2 rounded-full blur-md ${isPerfect ? 'bg-yellow-400/50' : 'bg-cyan-400/30'}`} />
                </motion.div>

                {/* Perfect sparkles */}
                {isPerfect && (
                  <>
                    <motion.span
                      className="absolute -top-4 -right-4 text-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 0], rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      className="absolute -bottom-4 -left-4 text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 0] }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      ⭐
                    </motion.span>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Touch Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-30">
              <motion.button
                onClick={() => moveRope('up')}
                className="w-16 h-14 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-indigo-300"
                whileTap={{ scale: 0.85 }}
                style={{ boxShadow: '0 4px 0 #4338CA' }}
              >
                <ArrowUp className="w-8 h-8" strokeWidth={3} />
              </motion.button>
              <motion.button
                onClick={() => moveRope('down')}
                className="w-16 h-14 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-indigo-300"
                whileTap={{ scale: 0.85 }}
                style={{ boxShadow: '0 4px 0 #4338CA' }}
              >
                <ArrowDown className="w-8 h-8" strokeWidth={3} />
              </motion.button>
            </div>

            {/* Debris Cleaned */}
            <div className="absolute bottom-4 right-20 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 border-4 border-cyan-300 shadow-lg">
              <span className="text-cyan-600 font-bold">🦷 Gaps: </span>
              <span className="text-purple-600 font-bold text-xl">{debris}</span>
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden border-4 border-indigo-300 shadow-2xl"
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
                {['🧵', '✨', '⭐', '💫', '🦷', '🌟'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-4"
              >
                🧵
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: '3px 3px 0 #7C3AED' }}
              >
                JOURNEY COMPLETE!
              </motion.h1>

              <motion.div
                className="text-6xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                style={{ textShadow: '4px 4px 0 #EC4899' }}
              >
                {score} pts
              </motion.div>

              <motion.div
                className="text-xl text-white mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                🦷 Gaps Cleared: {debris}
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
