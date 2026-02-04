import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Play, Trophy } from 'lucide-react';
import { GameProps, GameScreen, Enemy } from './types';
import { Hero } from './Hero';
import { StarRating } from './StarRating';

export function EnamelCastleSiege({ onComplete }: GameProps) {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [score, setScore] = useState(0);
  const [heroX, setHeroX] = useState(100);
  const [heroY, setHeroY] = useState(280);
  const [heroHealth, setHeroHealth] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [brushPower, setBrushPower] = useState(100);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const calculateStars = (finalScore: number): number => {
    if (finalScore >= 500) return 3;
    if (finalScore >= 300) return 2;
    if (finalScore >= 100) return 1;
    return 0;
  };

  const spawnEnemy = useCallback(() => {
    const types: Enemy['type'][] = ['plaque', 'candy', 'bacteria'];
    const newEnemy: Enemy = {
      id: Math.random().toString(36).slice(2),
      x: 700 + Math.random() * 100,
      y: 200 + Math.random() * 150,
      type: types[Math.floor(Math.random() * types.length)],
      health: 30,
      maxHealth: 30
    };
    setEnemies(prev => [...prev, newEnemy]);
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

  // Enemy spawning
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const spawner = setInterval(spawnEnemy, 2000);
    return () => clearInterval(spawner);
  }, [screen, spawnEnemy]);

  // Move enemies
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const mover = setInterval(() => {
      setEnemies(prev => {
        const updated = prev.map(e => ({ ...e, x: e.x - 2 }));
        updated.forEach(e => {
          if (e.x < 50 && e.health > 0) {
            setHeroHealth(h => Math.max(0, h - 10));
          }
        });
        return updated.filter(e => e.x > 30);
      });
    }, 50);
    return () => clearInterval(mover);
  }, [screen]);

  // Keyboard controls
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          setDirection('right');
          setHeroX(prev => Math.min(700, prev + 20));
          break;
        case 'ArrowLeft':
          setDirection('left');
          setHeroX(prev => Math.max(50, prev - 20));
          break;
        case 'ArrowUp':
          setHeroY(prev => Math.max(150, prev - 20));
          break;
        case 'ArrowDown':
          setHeroY(prev => Math.min(380, prev + 20));
          break;
        case ' ':
          handleAttack();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, heroX, heroY, enemies, brushPower, combo]);

  const handleAttack = useCallback(() => {
    if (brushPower < 10) return;
    setIsAttacking(true);
    setBrushPower(prev => Math.max(0, prev - 10));
    setTimeout(() => setIsAttacking(false), 300);

    setEnemies(prev => {
      let hitCount = 0;
      const updated = prev.map(e => {
        const dist = Math.sqrt(Math.pow(e.x - heroX, 2) + Math.pow(e.y - heroY, 2));
        if (dist < 100 && e.health > 0) {
          hitCount++;
          const newHealth = e.health - 30;
          return { ...e, health: newHealth };
        }
        return e;
      });

      if (hitCount > 0) {
        setCombo(c => c + hitCount);
        setScore(s => s + (10 * hitCount * Math.min(combo + 1, 5)));
      } else {
        setCombo(0);
      }

      return updated.filter(e => e.health > 0);
    });
  }, [brushPower, heroX, heroY, combo]);

  // Regenerate brush power
  useEffect(() => {
    if (screen !== 'gameplay') return;
    const regen = setInterval(() => {
      setBrushPower(prev => Math.min(100, prev + 5));
    }, 500);
    return () => clearInterval(regen);
  }, [screen]);

  // Check game over
  useEffect(() => {
    if (heroHealth <= 0 && screen === 'gameplay') {
      setScreen('victory');
    }
  }, [heroHealth, screen]);

  const handleStart = () => {
    setScreen('gameplay');
    setScore(0);
    setHeroHealth(100);
    setHeroX(100);
    setHeroY(280);
    setEnemies([]);
    setTimeLeft(60);
    setCombo(0);
    setBrushPower(100);
  };

  const handleComplete = () => {
    const stars = calculateStars(score);
    onComplete(score, stars);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setHeroX(Math.max(50, Math.min(700, x)));
    setHeroY(Math.max(150, Math.min(380, y)));
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
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl"
          >
            {/* Colorful bubbles background */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 10 + Math.random() * 30,
                  height: 10 + Math.random() * 30,
                  background: ['#FF6B9D', '#FFE66D', '#4ECDC4', '#95E1D3', '#F38181'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}

            {/* Cute castle */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <motion.div
                className="text-8xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏰
              </motion.div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🦷
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{ textShadow: '3px 3px 0 #FF6B9D, 6px 6px 0 #4ECDC4' }}>
                Enamel Castle Siege
              </h1>

              <p className="text-xl text-white font-medium mb-2 drop-shadow-md">
                🛡️ Defend the castle from plaque monsters! 🛡️
              </p>
              <p className="text-white/80 mb-8 max-w-md">
                Arrow keys to move • SPACE to brush attack • Tap enemies on mobile!
              </p>

              <motion.button
                onClick={handleStart}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full text-white font-bold text-2xl shadow-lg border-4 border-white"
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: '0 8px 0 #059669' }}
              >
                <Play className="w-8 h-8" />
                PLAY!
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
            ref={gameAreaRef}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-cyan-300 via-blue-200 to-green-300 rounded-3xl overflow-hidden border-4 border-pink-400 cursor-crosshair select-none"
            onTouchMove={handleTouchMove}
            onClick={handleAttack}
          >
            {/* Cute clouds */}
            <motion.div
              className="absolute top-8 left-16 text-5xl opacity-80"
              animate={{ x: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              ☁️
            </motion.div>
            <motion.div
              className="absolute top-16 right-24 text-4xl opacity-60"
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              ☁️
            </motion.div>

            {/* Rainbow */}
            <div className="absolute top-12 right-8 w-32 h-16 opacity-40">
              <div className="w-full h-full bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-t-full" />
            </div>

            {/* Cute grass */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-green-400 to-green-600 rounded-t-3xl">
              {/* Flowers */}
              <div className="absolute -top-4 left-10 text-2xl">🌸</div>
              <div className="absolute -top-3 left-32 text-xl">🌼</div>
              <div className="absolute -top-4 right-20 text-2xl">🌷</div>
              <div className="absolute -top-3 right-48 text-xl">🌻</div>
            </div>

            {/* Castle on the left */}
            <div className="absolute left-4 bottom-20 text-6xl">🏰</div>

            {/* UI Overlay - Bubbly style */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-40">
              {/* Health */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-4 border-pink-400 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                  <span className="text-pink-600 font-bold text-sm">Castle HP</span>
                </div>
                <div className="w-28 h-4 bg-pink-200 rounded-full overflow-hidden border-2 border-pink-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-400 to-red-400 rounded-full"
                    animate={{ width: `${heroHealth}%` }}
                  />
                </div>
              </div>

              {/* Score & Timer */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-4 border-yellow-400 shadow-lg text-center">
                <div className="text-3xl font-bold text-orange-500">{score}</div>
                <div className="text-xs text-orange-400 font-bold">SCORE</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-xl">⏰</span>
                  <span className="text-lg font-bold text-purple-600">{timeLeft}s</span>
                </div>
              </div>

              {/* Combo & Brush Power */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-4 border-cyan-400 shadow-lg">
                {combo > 1 && (
                  <motion.div
                    className="text-lg font-bold text-orange-500 mb-1"
                    animate={{ scale: [1, 1.3, 1] }}
                  >
                    {combo}x COMBO! 🔥
                  </motion.div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  <span className="text-cyan-600 font-bold text-sm">Brush Power</span>
                </div>
                <div className="w-28 h-4 bg-cyan-200 rounded-full overflow-hidden border-2 border-cyan-400">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                    animate={{ width: `${brushPower}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hero */}
            <Hero
              x={heroX}
              y={heroY}
              direction={direction}
              isAttacking={isAttacking}
              health={heroHealth}
              maxHealth={100}
              variant="tooth"
            />

            {/* Enemies - Cute style */}
            {enemies.map(enemy => (
              <motion.div
                key={enemy.id}
                className="absolute z-20 cursor-pointer"
                style={{ left: enemy.x, top: enemy.y }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setHeroX(enemy.x - 60);
                  setHeroY(enemy.y);
                  setTimeout(handleAttack, 100);
                }}
                whileHover={{ scale: 1.2 }}
              >
                {/* Enemy Health Bar */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-3 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-400">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  />
                </div>

                {/* Enemy Body - Cute monsters */}
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-4 ${enemy.type === 'plaque' ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-700' :
                    enemy.type === 'candy' ? 'bg-gradient-to-br from-pink-400 to-red-500 border-pink-700' :
                      'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-700'
                    }`}>
                    {enemy.type === 'plaque' && '👾'}
                    {enemy.type === 'candy' && '🍬'}
                    {enemy.type === 'bacteria' && '🦠'}
                  </div>
                  {/* Angry eyebrows */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg">😠</div>
                </motion.div>
              </motion.div>
            ))}

            {/* Mobile Controls Hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 text-purple-600 text-sm font-bold border-2 border-purple-300 md:hidden">
              👆 Tap & drag to move! Tap enemies to attack!
            </div>
          </motion.div>
        )}

        {screen === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative min-h-[500px] h-[85vh] max-h-[800px] lg:h-[80vh] bg-gradient-to-b from-yellow-400 via-orange-400 to-pink-500 rounded-3xl overflow-hidden border-4 border-yellow-300 shadow-2xl"
          >
            {/* Confetti */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{ left: `${Math.random() * 100}%` }}
                initial={{ y: -50, opacity: 0, rotate: 0 }}
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
                {['🎉', '⭐', '✨', '🎊', '💫', '🌟'][i % 6]}
              </motion.div>
            ))}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ textShadow: '3px 3px 0 #FF6B9D' }}
              >
                {heroHealth > 0 ? 'VICTORY!' : 'WELL PLAYED!'}
              </motion.h1>

              <motion.div
                className="text-6xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
                style={{ textShadow: '4px 4px 0 #4ECDC4' }}
              >
                {score} pts
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
