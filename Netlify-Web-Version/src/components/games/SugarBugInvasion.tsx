import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Trophy } from 'lucide-react';
import { GameProps, GameScreen } from './types';
import { StarRating } from './StarRating';

interface BugEnemy {
  id: string;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  speed: number;
  health: number;
  color: string;
}

const BUG_COLORS = [
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-red-400 to-red-600',
];

export function SugarBugInvasion({ onComplete }: GameProps) {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [score, setScore] = useState(0);
  const [bugs, setBugs] = useState<BugEnemy[]>([]);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [zapPower, setZapPower] = useState(100);
  const [bugsZapped, setBugsZapped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [effects, setEffects] = useState<{ id: string, x: number, y: number }[]>([]);

  const calculateStars = (finalScore: number): number => {
    if (finalScore >= 800) return 3;
    if (finalScore >= 500) return 2;
    if (finalScore >= 200) return 1;
    return 0;
  };

  const spawnBug = useCallback(() => {
    const sizes: BugEnemy['size'][] = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 350;

    const centerX = 400;
    const centerY = 250;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    const newBug: BugEnemy = {
      id: Math.random().toString(36).slice(2),
      x,
      y,
      size,
      speed: size === 'small' ? 2.5 : size === 'medium' ? 1.8 : 1.2,
      health: size === 'small' ? 1 : size === 'medium' ? 2 : 3,
      color: BUG_COLORS[Math.floor(Math.random() * BUG_COLORS.length)]
    };
    setBugs(prev => [...prev, newBug]);
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

  // Bug spawning
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const spawner = setInterval(spawnBug, Math.max(500, 1500 - wave * 100));
    return () => clearInterval(spawner);
  }, [screen, wave, spawnBug]);

  // Move bugs toward center
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const mover = setInterval(() => {
      const centerX = 400;
      const centerY = 250;

      setBugs(prev => {
        return prev.map(bug => {
          const dx = centerX - bug.x;
          const dy = centerY - bug.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            setHealth(h => Math.max(0, h - (bug.size === 'large' ? 15 : bug.size === 'medium' ? 10 : 5)));
            return null;
          }

          return {
            ...bug,
            x: bug.x + (dx / dist) * bug.speed,
            y: bug.y + (dy / dist) * bug.speed
          };
        }).filter(Boolean) as BugEnemy[];
      });
    }, 50);
    return () => clearInterval(mover);
  }, [screen]);

  // Wave progression
  useEffect(() => {
    if (bugsZapped > 0 && bugsZapped % 10 === 0) {
      setWave(w => w + 1);
    }
  }, [bugsZapped]);

  // Regenerate zap power
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const regen = setInterval(() => {
      setZapPower(prev => Math.min(100, prev + 3));
    }, 200);
    return () => clearInterval(regen);
  }, [screen]);

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [health, screen]);

  const handleZap = (bugId: string, x: number, y: number) => {
    if (zapPower < 5) return;

    setZapPower(prev => prev - 5);

    const effectId = Math.random().toString(36).slice(2);
    setEffects(prev => [...prev, { id: effectId, x, y }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effectId));
    }, 300);

    setBugs(prev => {
      return prev.map(bug => {
        if (bug.id === bugId) {
          const newHealth = bug.health - 1;
          if (newHealth <= 0) {
            const points = bug.size === 'large' ? 30 : bug.size === 'medium' ? 20 : 10;
            setScore(s => s + points * wave);
            setBugsZapped(z => z + 1);
            return null;
          }
          return { ...bug, health: newHealth };
        }
        return bug;
      }).filter(Boolean) as BugEnemy[];
    });
  };

  const handleStart = () => {
    setScreen('gameplay');
    setScore(0);
    setHealth(100);
    setBugs([]);
    setWave(1);
    setZapPower(100);
    setBugsZapped(0);
    setTimeLeft(45);
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
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-purple-600 via-pink-600 to-red-500 rounded-3xl overflow-hidden border-4 border-purple-300 shadow-2xl"
          >
            {/* Animated Bugs Background */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3 + Math.random() * 3, repeat: Infinity }}
              >
                🦠
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🦠
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: '3px 3px 0 #9333EA, 6px 6px 0 #EC4899' }}>
                Sugar Bug Invasion
              </h1>

              <p className="text-xl text-white font-medium mb-2">
                ⚡ Zap the bugs before they reach your tooth! ⚡
              </p>
              <p className="text-white/80 mb-8 max-w-md">
                Tap on bugs to zap them! Don't let them reach the center!
              </p>

              <motion.button
                onClick={handleStart}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #D97706' }}
              >
                <Zap className="w-8 h-8" />
                ZAP!
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
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-900 rounded-3xl overflow-hidden border-4 border-purple-400 cursor-crosshair select-none"
          >
            {/* Stars background */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                transition={{ duration: 1 + Math.random() * 2, repeat: Infinity }}
              />
            ))}

            {/* Center Tooth */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Shield rings */}
              <motion.div
                className="absolute -inset-16 rounded-full border-4 border-cyan-400/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-12 rounded-full border-2 border-pink-400/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border-2 border-yellow-400/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Tooth */}
              <div className="relative w-24 h-28 bg-gradient-to-b from-white via-blue-50 to-blue-100 rounded-t-full rounded-b-xl shadow-2xl border-4 border-cyan-300">
                {/* Shine */}
                <div className="absolute top-3 left-3 w-6 h-8 bg-white rounded-full opacity-70" />
                {/* Face */}
                <div className="absolute top-10 left-0 right-0 flex flex-col items-center">
                  <div className="flex gap-4 mb-2">
                    <motion.div
                      className="w-4 h-5 bg-slate-800 rounded-full relative"
                      animate={{ scaleY: [1, 0.3, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                    <motion.div
                      className="w-4 h-5 bg-slate-800 rounded-full relative"
                      animate={{ scaleY: [1, 0.3, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  </div>
                  <div className="w-6 h-4 bg-pink-400 rounded-full" />
                </div>
                {/* Roots */}
                <div className="absolute -bottom-3 left-3 w-4 h-5 bg-blue-100 rounded-b-lg" />
                <div className="absolute -bottom-3 right-3 w-4 h-5 bg-blue-100 rounded-b-lg" />
              </div>
            </motion.div>

            {/* UI Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-40">
              {/* Health */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-pink-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-pink-600 font-bold text-sm">Tooth HP</span>
                </div>
                <div className="w-28 h-4 bg-pink-200 rounded-full overflow-hidden border-2 border-pink-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-red-400 rounded-full"
                    animate={{ width: `${health}%` }}
                  />
                </div>
              </div>

              {/* Score & Wave */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-500">{score}</div>
                <div className="text-xs text-orange-400 font-bold">SCORE</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-purple-600 font-bold">Wave {wave}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-lg font-bold text-blue-600">{timeLeft}s</span>
                </div>
              </div>

              {/* Zap Power */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-yellow-600 font-bold text-sm">Zap Power</span>
                </div>
                <div className="w-28 h-4 bg-yellow-200 rounded-full overflow-hidden border-2 border-yellow-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                    animate={{ width: `${zapPower}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bugs */}
            {bugs.map(bug => (
              <motion.div
                key={bug.id}
                className="absolute z-20 cursor-pointer"
                style={{ left: bug.x - 25, top: bug.y - 25 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => handleZap(bug.id, bug.x, bug.y)}
                whileTap={{ scale: 0.7 }}
              >
                <motion.div
                  className={`relative flex items-center justify-center rounded-full shadow-lg border-4 border-white/50 bg-gradient-to-br ${bug.color} ${bug.size === 'small' ? 'w-10 h-10 text-xl' :
                    bug.size === 'medium' ? 'w-14 h-14 text-2xl' :
                      'w-18 h-18 text-3xl'
                    }`}
                  style={{ width: bug.size === 'large' ? 60 : bug.size === 'medium' ? 50 : 40, height: bug.size === 'large' ? 60 : bug.size === 'medium' ? 50 : 40 }}
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [-10, 10, -10]
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  🦠

                  {/* Health dots */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {Array.from({ length: bug.health }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-red-500 rounded-full border border-white" />
                    ))}
                  </div>

                  {/* Angry eyes */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-1 h-2 bg-slate-800 rounded-full transform -rotate-12" />
                    <div className="w-1 h-2 bg-slate-800 rounded-full transform rotate-12" />
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Zap Effects */}
            {effects.map(effect => (
              <motion.div
                key={effect.id}
                className="absolute z-50 pointer-events-none text-5xl"
                style={{ left: effect.x - 30, top: effect.y - 30 }}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                ⚡
              </motion.div>
            ))}

            {/* Bugs Zapped Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 border-4 border-purple-300 shadow-lg">
              <span className="text-purple-600 font-bold">🦠 Bugs Zapped: </span>
              <span className="text-orange-500 font-bold text-xl">{bugsZapped}</span>
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400 rounded-3xl overflow-hidden border-4 border-purple-300 shadow-2xl"
          >
            {/* Victory Confetti */}
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
                {['⚡', '✨', '🌟', '💫', '⭐', '🎉'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-4"
              >
                ⚡
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: '3px 3px 0 #9333EA' }}
              >
                {health > 0 ? 'BUGS ZAPPED!' : 'WELL FOUGHT!'}
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
                🦠 {bugsZapped} Zapped | Wave {wave} 🌊
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
