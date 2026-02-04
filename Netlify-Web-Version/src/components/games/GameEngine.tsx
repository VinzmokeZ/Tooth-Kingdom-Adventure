import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lock, ArrowLeft } from 'lucide-react';
import { EnamelCastleSiege } from './EnamelCastleSiege';
import { SugarBugInvasion } from './SugarBugInvasion';
import { KingsBanquet } from './KingsBanquet';
import { RoyalRopeRescue } from './RoyalRopeRescue';
import { WiseKnightsTrial } from './WiseKnightsTrial';
import { chapters } from '../../data/chapters';

interface GameProgress {
  completed: boolean;
  score: number;
  stars: number;
}

interface ChapterInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
}

const CHAPTERS: ChapterInfo[] = [
  {
    id: 'brushing',
    title: 'Enamel Castle Siege',
    subtitle: 'Brush away plaque monsters!',
    icon: '🏰',
    bgGradient: 'from-pink-500 via-purple-500 to-indigo-500',
    borderColor: 'border-pink-400'
  },
  {
    id: 'bacteria',
    title: 'Sugar Bug Invasion',
    subtitle: 'Zap the bacteria bugs!',
    icon: '🦠',
    bgGradient: 'from-purple-500 via-pink-500 to-red-500',
    borderColor: 'border-purple-400'
  },
  {
    id: 'flossing',
    title: 'Royal Rope Rescue',
    subtitle: 'Navigate the floss through teeth!',
    icon: '🧵',
    bgGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    borderColor: 'border-indigo-400'
  },
  {
    id: 'nutrition',
    title: "The King's Banquet",
    subtitle: 'Sort healthy vs sugary foods!',
    icon: '👑',
    bgGradient: 'from-orange-500 via-amber-500 to-yellow-500',
    borderColor: 'border-orange-400'
  },
  {
    id: 'mastery',
    title: "Wise Knight's Trial",
    subtitle: 'Test your dental wisdom!',
    icon: '🧠',
    bgGradient: 'from-blue-500 via-indigo-500 to-purple-500',
    borderColor: 'border-blue-400'
  }
];

interface GameEngineProps {
  chapterId?: number;
  onExit?: () => void;
  onComplete?: (score: number, stars: number) => void;
}

export function GameEngine({ chapterId, onExit, onComplete }: GameEngineProps) {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});
  const [totalStars, setTotalStars] = useState(0);

  // If a chapterId is passed, we use the specific game for that chapter
  const activeChapter = chapterId ? chapters.find(c => c.id === chapterId) : null;
  const gameToRender = activeChapter ? activeChapter.gameType : currentGame;

  const handleGameComplete = (gameId: string, score: number, stars: number) => {
    if (onComplete) {
      onComplete(score, stars);
      return;
    }

    const existingProgress = progress[gameId];
    const isNewBest = !existingProgress || score > existingProgress.score;

    if (isNewBest) {
      const starDiff = stars - (existingProgress?.stars || 0);
      setTotalStars(prev => prev + starDiff);
      setProgress(prev => ({
        ...prev,
        [gameId]: { completed: true, score, stars }
      }));
    }

    setCurrentGame(null);
  };

  const isChapterUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const prevChapter = CHAPTERS[index - 1];
    return progress[prevChapter.id]?.completed || false;
  };

  const renderGame = () => {
    const exitHandler = onExit || (() => setCurrentGame(null));

    switch (gameToRender) {
      case 'brushing-fantasy':
        return <EnamelCastleSiege onComplete={(score, stars) => handleGameComplete('brushing-fantasy', score, stars)} onExit={exitHandler} />;
      case 'germs-fantasy':
        return <SugarBugInvasion onComplete={(score, stars) => handleGameComplete('germs-fantasy', score, stars)} onExit={exitHandler} />;
      case 'flossing-fantasy':
        return <RoyalRopeRescue onComplete={(score, stars) => handleGameComplete('flossing-fantasy', score, stars)} onExit={exitHandler} />;
      case 'food-sort-fantasy':
        return <KingsBanquet onComplete={(score, stars) => handleGameComplete('food-sort-fantasy', score, stars)} onExit={exitHandler} />;
      case 'quiz-master-fantasy':
        return <WiseKnightsTrial onComplete={(score, stars) => handleGameComplete('quiz-master-fantasy', score, stars)} onExit={exitHandler} />;
      // Fallback to original games
      case 'brushing':
        return <EnamelCastleSiege onComplete={(score, stars) => handleGameComplete('brushing', score, stars)} onExit={exitHandler} />;
      case 'germs':
        return <SugarBugInvasion onComplete={(score, stars) => handleGameComplete('germs', score, stars)} onExit={exitHandler} />;
      case 'flossing':
        return <RoyalRopeRescue onComplete={(score, stars) => handleGameComplete('flossing', score, stars)} onExit={exitHandler} />;
      case 'food-sort':
        return <KingsBanquet onComplete={(score, stars) => handleGameComplete('nutrition', score, stars)} onExit={exitHandler} />;
      case 'quiz-master':
        return <WiseKnightsTrial onComplete={(score, stars) => handleGameComplete('mastery', score, stars)} onExit={exitHandler} />;
      default:
        return null;
    }
  };

  // If called from ChaptersScreen with a specific chapterId, render the game directly
  // without the menu wrapper, background, and padding
  if (chapterId && activeChapter) {
    const game = renderGame();

    // If no game is found, show error
    if (!game) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-pink-500">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
            <p className="mb-4">Chapter {chapterId} - {activeChapter.gameType}</p>
            {onExit && (
              <button
                onClick={onExit}
                className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold"
              >
                Back to Chapters
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 w-full h-full">
        {/* Game */}
        <div className="w-full h-full">
          {game}
        </div>
        {/* Back button */}
        {onExit && (
          <button
            onClick={onExit}
            className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-purple-600 font-bold shadow-lg border-2 border-purple-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}
      </div>
    );
  }

  // Otherwise, render the full game menu/selection interface
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500">
      {/* Animated Background Bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 20 + Math.random() * 60,
              height: 20 + Math.random() * 60,
              background: ['#FF6B9D', '#FFE66D', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA'][i % 6],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentGame ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 p-4"
          >
            {/* Back Button */}
            <motion.button
              onClick={() => setCurrentGame(null)}
              className="mb-4 px-6 py-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-purple-600 font-bold flex items-center gap-2 shadow-lg border-4 border-purple-300"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Map
            </motion.button>

            {renderGame()}
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 p-4 md:p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-block"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  🦷
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{ textShadow: '4px 4px 0 #FF6B9D, 8px 8px 0 #4ECDC4' }}
              >
                Dental Kingdom
              </motion.h1>
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ textShadow: '2px 2px 0 #FF6B9D' }}
              >
                Adventures! ✨
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/80 mt-4 mb-6"
              >
                🎮 Choose your adventure and protect the kingdom's teeth! 🏰
              </motion.p>

              {/* Total Stars */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-yellow-400 shadow-xl"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="text-3xl"
                >
                  ⭐
                </motion.span>
                <span className="text-3xl font-bold text-orange-500">{totalStars}</span>
                <span className="text-lg text-orange-400 font-bold">/ {CHAPTERS.length * 3}</span>
              </motion.div>
            </div>

            {/* Chapter Selection */}
            <div className="max-w-3xl mx-auto space-y-4">
              {CHAPTERS.map((chapter, index) => {
                const chapterProgress = progress[chapter.id];
                const unlocked = isChapterUnlocked(index);

                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.button
                      onClick={() => unlocked && setCurrentGame(chapter.id)}
                      disabled={!unlocked}
                      className={`w-full relative overflow-hidden rounded-3xl border-4 ${chapter.borderColor} ${unlocked
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed opacity-60'
                        }`}
                      whileHover={unlocked ? { scale: 1.02, y: -5 } : {}}
                      whileTap={unlocked ? { scale: 0.98 } : {}}
                      style={unlocked ? { boxShadow: '0 10px 0 rgba(0,0,0,0.2)' } : {}}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${chapter.bgGradient}`} />

                      <div className="relative flex items-center p-5 md:p-6">
                        {/* Chapter Icon */}
                        <motion.div
                          className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-5 shadow-lg border-2 border-white/50"
                          animate={unlocked ? { rotate: [0, 5, -5, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {unlocked ? (
                            <span className="text-4xl md:text-5xl">{chapter.icon}</span>
                          ) : (
                            <Lock className="w-8 h-8 text-white/70" />
                          )}
                        </motion.div>

                        {/* Chapter Info */}
                        <div className="flex-grow text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-white/80 font-bold bg-white/20 px-3 py-1 rounded-full">
                              Chapter {index + 1}
                            </span>
                            {chapterProgress?.completed && (
                              <span className="px-3 py-1 bg-green-400/80 rounded-full text-xs text-white font-bold">
                                ✓ Complete!
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
                            {chapter.title}
                          </h3>
                          <p className="text-white/80 font-medium">{chapter.subtitle}</p>
                        </div>

                        {/* Stars / Play */}
                        <div className="flex-shrink-0 flex flex-col items-end">
                          {chapterProgress ? (
                            <>
                              <div className="flex gap-1 mb-2">
                                {[1, 2, 3].map(i => (
                                  <motion.span
                                    key={i}
                                    className="text-2xl"
                                    animate={i <= chapterProgress.stars ? {
                                      scale: [1, 1.2, 1],
                                      rotate: [0, 10, -10, 0]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                  >
                                    {i <= chapterProgress.stars ? '⭐' : '☆'}
                                  </motion.span>
                                ))}
                              </div>
                              <span className="text-sm text-white/80 font-bold">{chapterProgress.score} pts</span>
                            </>
                          ) : unlocked ? (
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ChevronRight className="w-8 h-8 text-white" />
                            </motion.div>
                          ) : null}
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* How to Play */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="max-w-2xl mx-auto mt-8"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-4 border-cyan-300 shadow-xl">
                <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">🎮 How to Play</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-pink-100 rounded-2xl p-3">
                    <span className="text-3xl">🕹️</span>
                    <p className="text-sm font-bold text-pink-600 mt-1">Arrow keys or tap</p>
                  </div>
                  <div className="bg-yellow-100 rounded-2xl p-3">
                    <span className="text-3xl">⭐</span>
                    <p className="text-sm font-bold text-yellow-600 mt-1">Earn 3 stars!</p>
                  </div>
                  <div className="bg-green-100 rounded-2xl p-3">
                    <span className="text-3xl">🔓</span>
                    <p className="text-sm font-bold text-green-600 mt-1">Unlock chapters</p>
                  </div>
                  <div className="bg-purple-100 rounded-2xl p-3">
                    <span className="text-3xl">🦷</span>
                    <p className="text-sm font-bold text-purple-600 mt-1">Learn & have fun!</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer Characters */}
            <motion.div
              className="flex justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.span
                className="text-5xl"
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🦷
              </motion.span>
              <motion.span
                className="text-5xl"
                animate={{ y: [0, -10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                ✨
              </motion.span>
              <motion.span
                className="text-5xl"
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                🏰
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
