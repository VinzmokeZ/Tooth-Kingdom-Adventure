import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, ArrowLeft, Heart, Swords } from 'lucide-react';
import { GameProps } from './types';

type Screen = 'start' | 'playing' | 'victory';

interface Monster {
  id: number;
  x: number;
  y: number;
  health: number;
  type: 'plaque' | 'candy' | 'bacteria';
}

export function EnamelCastleSiege({ onComplete, onExit }: GameProps) {
  const [screen, setScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [heroY, setHeroY] = useState(50);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const maxScore = 500;

  // Spawn monsters
  useEffect(() => {
    if (screen !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const newMonster: Monster = {
        id: Date.now(),
        x: 100,
        y: Math.random() * 60 + 20,
        health: 1,
        type: ['plaque', 'candy', 'bacteria'][Math.floor(Math.random() * 3)] as Monster['type'],
      };
      setMonsters(prev => [...prev, newMonster]);
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [screen]);

  // Move monsters
  useEffect(() => {
    if (screen !== 'playing') return;

    const moveInterval = setInterval(() => {
      setMonsters(prev => {
        const updated = prev.map(m => ({ ...m, x: m.x - 2 }));
        
        // Check for monsters reaching castle
        const reached = updated.filter(m => m.x <= 15);
        if (reached.length > 0) {
          setHealth(h => Math.max(0, h - reached.length * 10));
          setCombo(0);
        }
        
        return updated.filter(m => m.x > 10);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [screen]);

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

  // Check game over
  useEffect(() => {
    if (health <= 0 && screen === 'playing') {
      setScreen('victory');
    }
  }, [health, screen]);

  // Handle attack
  const handleAttack = useCallback(() => {
    if (screen !== 'playing' || isAttacking) return;

    setIsAttacking(true);
    setTimeout(() => setIsAttacking(false), 200);

    // Find monsters in attack range
    setMonsters(prev => {
      const inRange = prev.filter(m => m.x >= 20 && m.x <= 45 && Math.abs(m.y - heroY) < 25);
      
      if (inRange.length > 0) {
        const points = inRange.length * 10 * (1 + combo * 0.1);
        setScore(s => Math.min(maxScore, s + Math.floor(points)));
        setCombo(c => c + 1);
        return prev.filter(m => !inRange.includes(m));
      } else {
        setCombo(0);
        return prev;
      }
    });
  }, [screen, isAttacking, heroY, combo]);

  // Handle movement
  const moveHero = (direction: 'up' | 'down') => {
    if (screen !== 'playing') return;
    setHeroY(y => {
      if (direction === 'up') return Math.max(15, y - 12);
      return Math.min(85, y + 12);
    });
  };

  const stars = score >= 400 ? 3 : score >= 250 ? 2 : 1;

  // Monster emoji based on type
  const getMonsterEmoji = (type: Monster['type']) => {
    switch (type) {
      case 'plaque': return '👾';
      case 'candy': return '🍬';
      case 'bacteria': return '🦠';
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-4 relative"
          >
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ opacity: 0.6, y: 0 }}
                animate={{
                  y: [-10, 10, -10],
                  x: [0, 5, -5, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
              >
                ✨
              </motion.div>
            ))}

            {/* Title */}
            <motion.div
              initial={{ scale: 0.8, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="text-5xl mb-3">🏰</div>
              <h1 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                Enamel Castle
              </h1>
              <h2 className="text-xl font-bold text-yellow-300">Siege!</h2>
            </motion.div>

            {/* Hero preview */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🦷
            </motion.div>

            {/* Instructions */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-[280px]">
              <p className="text-white/90 text-center text-sm">
                <Swords className="w-4 h-4 inline mr-1" />
                Defend your castle from plaque monsters!
              </p>
              <p className="text-white/70 text-center text-xs mt-2">
                Move up/down and attack to defeat enemies
              </p>
            </div>

            {/* Start button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('playing')}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Battle
            </motion.button>

            {/* Back button */}
            {onExit && (
              <button
                onClick={onExit}
                className="mt-4 text-white/60 text-sm flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Chapters
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
              
              <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-bold">
                {timeLeft}s
              </div>
            </div>

            {/* Combo indicator */}
            {combo > 1 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold"
              >
                {combo}x Combo! 🔥
              </motion.div>
            )}

            {/* Game area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Background castle */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl opacity-80">
                🏰
              </div>

              {/* Hero */}
              <motion.div
                className="absolute left-8 text-4xl"
                animate={{
                  top: `${heroY}%`,
                  scale: isAttacking ? 1.2 : 1,
                  x: isAttacking ? 20 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ translateY: '-50%' }}
              >
                🦷
                {isAttacking && (
                  <motion.span
                    initial={{ opacity: 1, x: 20 }}
                    animate={{ opacity: 0, x: 40 }}
                    className="absolute left-full text-2xl"
                  >
                    ⚔️
                  </motion.span>
                )}
              </motion.div>

              {/* Monsters */}
              <AnimatePresence>
                {monsters.map(monster => (
                  <motion.div
                    key={monster.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                    className="absolute text-3xl"
                    style={{
                      left: `${monster.x}%`,
                      top: `${monster.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {getMonsterEmoji(monster.type)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-4 bg-black/30 flex items-center justify-between">
              {/* Movement */}
              <div className="flex flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => moveHero('up')}
                  onClick={() => moveHero('up')}
                  className="w-14 h-14 bg-blue-500 rounded-xl text-white text-2xl shadow-lg active:bg-blue-600"
                >
                  ⬆️
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onTouchStart={() => moveHero('down')}
                  onClick={() => moveHero('down')}
                  className="w-14 h-14 bg-blue-500 rounded-xl text-white text-2xl shadow-lg active:bg-blue-600"
                >
                  ⬇️
                </motion.button>
              </div>

              {/* Attack button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={handleAttack}
                onClick={handleAttack}
                className={`w-24 h-24 rounded-full text-4xl shadow-xl flex items-center justify-center ${
                  isAttacking 
                    ? 'bg-red-600' 
                    : 'bg-gradient-to-br from-red-500 to-orange-500'
                }`}
              >
                ⚔️
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
            {[...Array(12)].map((_, i) => (
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
                style={{ left: `${5 + i * 8}%` }}
              >
                {['⭐', '✨', '🌟'][i % 3]}
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
              {health > 0 ? 'Victory!' : 'Good Try!'}
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
              whileHover={{ scale: 1.05 }}
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
