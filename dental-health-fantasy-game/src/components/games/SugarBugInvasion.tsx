import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowLeft, Heart, Zap } from 'lucide-react';
import { GameProps } from './types';

type Screen = 'start' | 'playing' | 'victory';

interface Bug {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const BUG_COLORS = ['#FF6B9D', '#9B59B6', '#3498DB', '#2ECC71', '#F39C12'];

export function SugarBugInvasion({ onComplete, onExit }: GameProps) {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [wave, setWave] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [tapEffects, setTapEffects] = useState<{ id: number; x: number; y: number }[]>([]);

  const maxScore = 600;

  // Spawn bugs
  useEffect(() => {
    if (screen !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 45;
      
      const newBug: Bug = {
        id: Date.now() + Math.random(),
        x: 50 + Math.cos(angle) * distance,
        y: 50 + Math.sin(angle) * distance,
        size: 24 + Math.random() * 12,
        speed: 0.3 + wave * 0.1,
        color: BUG_COLORS[Math.floor(Math.random() * BUG_COLORS.length)],
      };
      setBugs(prev => [...prev, newBug]);
    }, 1200 - wave * 100);

    return () => clearInterval(spawnInterval);
  }, [screen, wave]);

  // Move bugs toward center
  useEffect(() => {
    if (screen !== 'playing') return;

    const moveInterval = setInterval(() => {
      setBugs(prev => {
        const updated = prev.map(bug => {
          const dx = 50 - bug.x;
          const dy = 50 - bug.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 8) {
            setHealth(h => Math.max(0, h - 8));
            return null;
          }
          
          return {
            ...bug,
            x: bug.x + (dx / dist) * bug.speed,
            y: bug.y + (dy / dist) * bug.speed,
          };
        }).filter(Boolean) as Bug[];
        
        return updated;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [screen]);

  // Timer and waves
  useEffect(() => {
    if (screen !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setScreen('victory');
          return 0;
        }
        if (t % 10 === 0) setWave(w => Math.min(5, w + 1));
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen]);

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'playing') {
      setScreen('victory');
    }
  }, [health, screen]);

  // Handle tap on bug
  const handleTapBug = useCallback((bugId: number, x: number, y: number) => {
    setBugs(prev => prev.filter(b => b.id !== bugId));
    setScore(s => Math.min(maxScore, s + 15 * wave));
    
    // Add tap effect
    const effectId = Date.now();
    setTapEffects(prev => [...prev, { id: effectId, x, y }]);
    setTimeout(() => {
      setTapEffects(prev => prev.filter(e => e.id !== effectId));
    }, 500);
  }, [wave]);

  const stars = score >= 480 ? 3 : score >= 300 ? 2 : 1;

  return (
    <div className="w-full h-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-600 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 relative"
          >
            {/* Floating bugs */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                animate={{
                  y: [-10, 10, -10],
                  x: [0, 10, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                style={{ left: `${15 + i * 14}%`, top: `${25 + (i % 2) * 40}%` }}
              >
                🦠
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-3">🦷</div>
              <h1 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                Sugar Bug
              </h1>
              <h2 className="text-xl font-bold text-yellow-300">Invasion!</h2>
            </motion.div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-[280px]">
              <p className="text-white/90 text-center text-sm">
                <Zap className="w-4 h-4 inline mr-1" />
                Tap the bacteria before they reach your tooth!
              </p>
              <p className="text-white/70 text-center text-xs mt-2">
                Faster taps = more points!
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('playing')}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Defense
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
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <div className="w-20 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400"
                    animate={{ width: `${health}%` }}
                  />
                </div>
              </div>
              
              <div className="text-yellow-300 font-bold text-lg">
                {score}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 px-2 py-1 rounded text-white text-xs font-bold">
                  Wave {wave}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-bold">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Game area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Central tooth */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-5xl">🦷</div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  style={{ width: 100, height: 100, left: -25, top: -25 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Bugs */}
              <AnimatePresence>
                {bugs.map(bug => (
                  <motion.button
                    key={bug.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleTapBug(bug.id, bug.x, bug.y)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 active:scale-90"
                    style={{
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      fontSize: bug.size,
                    }}
                  >
                    🦠
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* Tap effects */}
              <AnimatePresence>
                {tapEffects.map(effect => (
                  <motion.div
                    key={effect.id}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none text-3xl"
                    style={{
                      left: `${effect.x}%`,
                      top: `${effect.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    💥
                  </motion.div>
                ))}
              </AnimatePresence>
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
                {['⭐', '✨', '🌟', '💫'][i % 4]}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-6xl mb-4"
            >
              {health > 0 ? '🏆' : '💪'}
            </motion.div>

            <h2 className="text-2xl font-black text-white mb-2">
              {health > 0 ? 'Tooth Saved!' : 'Good Defense!'}
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
                    className={`w-12 h-12 ${
                      i <= stars
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
